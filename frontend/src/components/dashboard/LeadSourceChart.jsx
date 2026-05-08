import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#fb923c', '#4ade80'];

const LeadSourceChart = ({ data }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] h-[440px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Lead Source Breakdown</h3>
        <select className="text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-2 py-1 outline-none">
          <option>All Sources</option>
        </select>
      </div>
      
      <div className="flex-1 w-full flex justify-center min-h-0">
        <BarChart
          width={450}
          height={260}
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis 
            type="category" 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
            width={80}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-x-4 gap-y-2">
        {data.slice(0, 6).map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight truncate">{entry.name}</span>
            <span className="ml-auto text-[10px] font-black text-slate-900 dark:text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadSourceChart;
