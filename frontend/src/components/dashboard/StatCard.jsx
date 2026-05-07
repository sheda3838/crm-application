import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all"
    >
      <div className="flex justify-between items-start mb-5">
        <div className={`p-4 rounded-2xl ${color} shadow-lg shadow-blue-500/10`}>
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
            trend > 0 
              ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' 
              : 'text-rose-600 bg-rose-50 dark:bg-rose-500/10'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{value}</h3>
      </div>
    </motion.div>
  );
};

export default StatCard;
