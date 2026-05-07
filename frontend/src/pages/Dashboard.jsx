import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Target, CheckCircle, XCircle, DollarSign, Briefcase } from 'lucide-react';
import API from '../api/axios';
import StatCard from '../components/dashboard/StatCard';
import StatusPieChart from '../components/dashboard/StatusPieChart';
import LeadsTrendChart from '../components/dashboard/LeadsTrendChart';
import RecentLeadsTable from '../components/dashboard/RecentLeadsTable';

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

  return (
    <div className="max-w-[1600px] mx-auto space-y-10">
      
      {/* KPI Stats Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        <StatCard title="Total Pipeline" value={data.summary?.totalLeads || 0} icon={Users} color="bg-blue-600" trend={12.5} />
        <StatCard title="Qualified Leads" value={data.summary?.qualifiedLeads || 0} icon={Target} color="bg-amber-500" trend={4.2} />
        <StatCard title="Total Deal Value" value={`$${(data.summary?.totalDealValue || 0).toLocaleString()}`} icon={DollarSign} color="bg-indigo-600" trend={-2.4} />
        <StatCard title="Conversion Value" value={`$${(data.summary?.totalWonValue || 0).toLocaleString()}`} icon={CheckCircle} color="bg-emerald-600" trend={18.3} />
      </motion.section>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <StatusPieChart data={data.statusBreakdown || {}} />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <LeadsTrendChart data={data.leadsOverTime || []} />
        </motion.div>
      </div>

      {/* Operational Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
          className="xl:col-span-2"
        >
          <RecentLeadsTable leads={data.recentLeads || []} />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col"
        >
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Source Distribution</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Lead acquisition by channel</p>
          </div>
          <div className="space-y-8 flex-1">
            {Object.entries(data.leadSourceDistribution || {}).map(([source, count], idx) => (
              <div key={source} className="group">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-blue-600 transition-colors">{source}</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">{count}</span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / (data.summary?.totalLeads || 1)) * 100}%` }}
                    transition={{ duration: 1.5, delay: 0.6 + (idx * 0.1), ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-5 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
            <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center">
              Top Channel: {Object.entries(data.leadSourceDistribution || {}).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
