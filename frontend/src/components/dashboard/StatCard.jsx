import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, iconColor, bgLight, trend }) => {
  const isPositive = trend?.includes('+');
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] transition-all flex flex-col justify-between"
    >
      <div className="flex justify-between items-center mb-4">
        <p className="text-[15px] font-bold text-slate-700 dark:text-slate-300">{title}</p>
        <div className={`p-2.5 rounded-full ${bgLight} ${iconColor} dark:bg-opacity-20`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
      </div>
      <div>
        <div className="flex items-end gap-3">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{value}</h3>
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-bold ${
              isPositive ? 'text-emerald-500' : 'text-rose-500'
            }`}>
              {trend}
            </div>
          )}
        </div>
        <p className="text-xs text-slate-400 font-medium mt-1.5">from last month</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
