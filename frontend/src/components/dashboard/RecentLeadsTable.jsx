import React from 'react';
import { motion } from 'framer-motion';

const RecentLeadsTable = ({ leads }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Won': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400';
      case 'Lost': return 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400';
      case 'New': return 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400';
      case 'Qualified': return 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400';
      case 'Contacted': return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Recent Activity</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Latest lead interactions</p>
        </div>
        <button className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30">
              <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Lead Information</th>
              <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Company</th>
              <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Deal Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {leads.map((lead, index) => (
              <motion.tr 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={lead.id} 
                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-default"
              >
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{lead.leadName}</span>
                    <span className="text-xs text-slate-400 font-medium">{lead.email}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{lead.companyName}</span>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${getStatusStyle(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">${lead.dealValue.toLocaleString()}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentLeadsTable;
