import React from 'react';
import { motion } from 'framer-motion';

const RepPerformanceTable = ({ data }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Rep Performance Overview</h3>
      </div>
      
      <div className="flex-1 overflow-auto hide-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rep Name</th>
              <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Leads</th>
              <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Won</th>
              <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Revenue</th>
              <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Win Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {data.map((row, index) => (
              <motion.tr 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={row.rep}
                className="group"
              >
                <td className="py-3.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
                    {row.rep}
                  </span>
                </td>
                <td className="py-3.5 text-center">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{row.leads}</span>
                </td>
                <td className="py-3.5 text-center">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{row.won}</span>
                </td>
                <td className="py-3.5 text-right">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">${row.revenue.toLocaleString()}</span>
                </td>
                <td className="py-3.5 text-right">
                  <span className="text-[11px] font-bold text-emerald-500 flex items-center justify-end gap-0.5">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                    {row.winRate}
                  </span>
                </td>
              </motion.tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-xs text-slate-400 font-medium">No performance data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepPerformanceTable;
