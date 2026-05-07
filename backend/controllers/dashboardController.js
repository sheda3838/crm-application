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
    // 1. Status and Value breakdown
    const statusData = await query(`
      SELECT 
        status, 
        COUNT(*) as count, 
        SUM(dealValue) as statusValue
      FROM leads 
      GROUP BY status
    `);

    // 2. Leads Over Time
    const trendData = await query(`
      SELECT date(createdAt) as date, COUNT(*) as count 
      FROM leads 
      GROUP BY date(createdAt) 
      ORDER BY date ASC 
      LIMIT 30
    `);

    // 3. Lead Source Distribution
    const sourceData = await query(`
      SELECT leadSource, COUNT(*) as count 
      FROM leads 
      GROUP BY leadSource
    `);

    // Initialize defaults
    const stats = {
      totalLeads: 0,
      newLeads: 0,
      contactedLeads: 0,
      qualifiedLeads: 0,
      proposalSentLeads: 0,
      wonLeads: 0,
      lostLeads: 0,
      totalDealValue: 0,
      totalWonValue: 0
    };

    const statusBreakdown = {
      "New": 0,
      "Contacted": 0,
      "Qualified": 0,
      "Proposal Sent": 0,
      "Won": 0,
      "Lost": 0
    };

    // Process Status Data
    statusData.forEach(row => {
      const count = row.count || 0;
      const value = row.statusValue || 0;
      
      stats.totalLeads += count;
      stats.totalDealValue += value;
      
      if (row.status === 'New') { stats.newLeads = count; statusBreakdown['New'] = count; }
      if (row.status === 'Contacted') { stats.contactedLeads = count; statusBreakdown['Contacted'] = count; }
      if (row.status === 'Qualified') { stats.qualifiedLeads = count; statusBreakdown['Qualified'] = count; }
      if (row.status === 'Proposal Sent') { stats.proposalSentLeads = count; statusBreakdown['Proposal Sent'] = count; }
      if (row.status === 'Won') { 
        stats.wonLeads = count; 
        stats.totalWonValue = value; 
        statusBreakdown['Won'] = count; 
      }
      if (row.status === 'Lost') { stats.lostLeads = count; statusBreakdown['Lost'] = count; }
    });

    // Process Source Data
    const leadSourceDistribution = {};
    sourceData.forEach(row => {
      if (row.leadSource) {
        leadSourceDistribution[row.leadSource] = row.count;
      }
    });

    // Format Trend Data
    const leadsOverTime = trendData.map(row => ({
      date: row.date,
      count: row.count
    }));

    // 4. Recent Leads
    const recentLeads = await query(`
      SELECT id, leadName, companyName, email, status, dealValue 
      FROM leads 
      ORDER BY createdAt DESC 
      LIMIT 5
    `);

    res.json({
      summary: stats,
      statusBreakdown,
      leadSourceDistribution,
      leadsOverTime,
      recentLeads
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};
