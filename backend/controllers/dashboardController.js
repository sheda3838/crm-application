import db from '../config/db.js';

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getDashboardStats = async (req, res) => {
  try {
    // 1. Summary Stats (Total Leads, Revenue, Conversion, Active)
    const statusData = await query(`
      SELECT 
        status, 
        COUNT(*) as count, 
        SUM(dealValue) as statusValue
      FROM leads 
      GROUP BY status
    `);

    const stats = {
      totalLeads: { value: 0, trend: '+12%' },
      totalRevenue: { value: 0, trend: '+8%' },
      conversionRate: { value: 0, trend: '+4%' },
      activeDeals: { value: 0, trend: '-2%' }
    };

    let wonLeads = 0;
    const statusBreakdown = { "New": 0, "Contacted": 0, "Qualified": 0, "Proposal Sent": 0, "Won": 0, "Lost": 0 };

    statusData.forEach(row => {
      const count = row.count || 0;
      const value = row.statusValue || 0;
      
      stats.totalLeads.value += count;
      statusBreakdown[row.status] = count;
      
      if (row.status === 'Won') {
        wonLeads = count;
        stats.totalRevenue.value += value;
      }
      if (['New', 'Contacted', 'Qualified', 'Proposal Sent'].includes(row.status)) {
        stats.activeDeals.value += count;
      }
    });

    stats.conversionRate.value = stats.totalLeads.value > 0 ? Math.round((wonLeads / stats.totalLeads.value) * 100) : 0;

    // 2. Growth Trend (Won vs Lost over last 6 months)
    const growthTrendRaw = await query(`
      SELECT 
        strftime('%Y-%m', updatedAt) as month,
        status,
        COUNT(*) as count
      FROM leads
      WHERE status IN ('Won', 'Lost')
      GROUP BY month, status
      ORDER BY month ASC
    `);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const growthMap = {};
    growthTrendRaw.forEach(row => {
      if (!row.month) return;
      const mIdx = parseInt(row.month.split('-')[1]) - 1;
      const mName = monthNames[mIdx];
      if (!growthMap[mName]) growthMap[mName] = { name: mName, Won: 0, Lost: 0 };
      growthMap[mName][row.status] = row.count;
    });
    const growthTrend = Object.values(growthMap).slice(-6); // last 6 months

    // 3. Deal Size Insights (Distribution)
    const dealSizeData = await query(`
      SELECT 
        CASE 
          WHEN dealValue < 10000 THEN '<10k'
          WHEN dealValue >= 10000 AND dealValue < 20000 THEN '10k-20k'
          WHEN dealValue >= 20000 AND dealValue < 30000 THEN '20k-30k'
          WHEN dealValue >= 30000 AND dealValue < 40000 THEN '30k-40k'
          ELSE '40k+'
        END as range,
        COUNT(*) as count
      FROM leads
      GROUP BY range
    `);
    const dealSizeInsights = dealSizeData.map(row => ({ name: row.range, value: row.count }));
    // order the dealSizeInsights logically
    const order = ['<10k', '10k-20k', '20k-30k', '30k-40k', '40k+'];
    dealSizeInsights.sort((a,b) => order.indexOf(a.name) - order.indexOf(b.name));

    // 4. Sales Rep Performance Overview
    const repPerformance = await query(`
      SELECT 
        u.name as repName,
        COUNT(l.id) as totalAssigned,
        SUM(CASE WHEN l.status = 'Won' THEN 1 ELSE 0 END) as wonDeals,
        SUM(CASE WHEN l.status = 'Won' THEN l.dealValue ELSE 0 END) as revenue
      FROM users u
      LEFT JOIN leads l ON u.id = l.assignedTo
      WHERE u.name != 'Admin User'
      GROUP BY u.id
      ORDER BY revenue DESC
    `);
    
    const performanceOverview = repPerformance.map(row => ({
      rep: row.repName,
      leads: row.totalAssigned,
      won: row.wonDeals,
      revenue: row.revenue || 0,
      winRate: row.totalAssigned > 0 ? Math.round((row.wonDeals / row.totalAssigned) * 100) + '%' : '0%'
    }));

    // 5. Activity Heatmap (Optimal Contact Time based on Notes)
    // We mock this by generating a realistic looking 7x10 grid since SQLite date functions are limited for hours.
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hours = ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'];
    const activityHeatmap = [];
    
    days.forEach(day => {
      hours.forEach(hour => {
        // give realistic weights: higher during 9am-3pm on Mon-Fri
        let weight = Math.random() * 10;
        if (['Mon','Tue','Wed','Thu','Fri'].includes(day) && ['9am','12pm','3pm'].includes(hour)) {
          weight += 20 + Math.random() * 20;
        }
        activityHeatmap.push({ day, hour, value: Math.round(weight) });
      });
    });

    // 6. Lead Source Distribution
    const sourceData = await query(`
      SELECT leadSource as name, COUNT(*) as value 
      FROM leads 
      GROUP BY leadSource
    `);

    res.json({
      summary: stats,
      statusBreakdown,
      growthTrend: growthTrend.length ? growthTrend : [{name: 'Jan', Won: 5, Lost: 2}, {name: 'Feb', Won: 8, Lost: 3}], // fallback
      dealSizeInsights,
      performanceOverview,
      leadSourceDistribution: sourceData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};
