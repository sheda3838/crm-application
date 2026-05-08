import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Target, Activity } from 'lucide-react';
import API from '../api/axios';

import StatCard from '../components/dashboard/StatCard';
import DealsGrowthChart from '../components/dashboard/DealsGrowthChart';
import DealSizeInsightsChart from '../components/dashboard/DealSizeInsightsChart';
import LeadSentimentChart from '../components/dashboard/LeadSentimentChart';
import RepPerformanceTable from '../components/dashboard/RepPerformanceTable';
import LeadSourceChart from '../components/dashboard/LeadSourceChart';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await API.get('/dashboard');
      setData(response.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 font-bold animate-pulse">Syncing CRM Analytics...</p>
      </div>
    );
  }

  const summary = data?.summary || {
    totalLeads: { value: 0, trend: '0%' },
    totalRevenue: { value: 0, trend: '0%' },
    conversionRate: { value: 0, trend: '0%' },
    activeDeals: { value: 0, trend: '0%' }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      
      {/* Header Area */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">Sales Analytics Overview</h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Track pipeline performance, rep engagement, and revenue growth in one place.</p>
      </div>

      {/* Top Stat Cards Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard title="Total Pipeline" value={summary.totalLeads.value} trend={summary.totalLeads.trend} icon={Users} color="bg-rose-500" iconColor="text-rose-500" bgLight="bg-rose-100" />
        <StatCard title="Total Revenue" value={`$${summary.totalRevenue.value.toLocaleString()}`} trend={summary.totalRevenue.trend} icon={DollarSign} color="bg-blue-500" iconColor="text-blue-500" bgLight="bg-blue-100" />
        <StatCard title="Conversion Rate" value={`${summary.conversionRate.value}%`} trend={summary.conversionRate.trend} icon={Target} color="bg-amber-500" iconColor="text-amber-500" bgLight="bg-amber-100" />
        <StatCard title="Active Deals" value={summary.activeDeals.value} trend={summary.activeDeals.trend} icon={Activity} color="bg-fuchsia-500" iconColor="text-fuchsia-500" bgLight="bg-fuchsia-100" />
      </motion.section>

      {/* Middle Row: 3 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <DealsGrowthChart data={data?.growthTrend || []} />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <DealSizeInsightsChart data={data?.dealSizeInsights || []} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <LeadSentimentChart data={data?.statusBreakdown || {}} />
        </motion.div>
      </div>

      {/* Bottom Row: Table & Source Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <RepPerformanceTable data={data?.performanceOverview || []} />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <LeadSourceChart data={data?.leadSourceDistribution || []} />
        </motion.div>
      </div>

    </div>
  );
};

export default Dashboard;
