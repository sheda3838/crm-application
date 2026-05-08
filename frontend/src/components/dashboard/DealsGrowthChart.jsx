import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DealsGrowthChart = ({ data }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] h-[380px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Deals Growth Trend</h3>
        <select className="text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-2 py-1 outline-none">
          <option>6 Month</option>
        </select>
      </div>
      <div className="flex-1 w-full mt-4 min-h-0 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="top" align="right" iconType="circle" />
            <Bar dataKey="Won" stackId="a" fill="#10b981" barSize={30} />
            <Bar dataKey="Lost" stackId="a" fill="#ef4444" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DealsGrowthChart;
