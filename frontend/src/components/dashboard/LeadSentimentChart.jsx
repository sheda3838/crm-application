import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const LeadSentimentChart = ({ data }) => {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  const STATUS_COLORS = {
    'Won': '#10b981',
    'Lost': '#ef4444',
    'New': '#38bdf8',
    'Contacted': '#818cf8',
    'Qualified': '#c084fc',
    'Proposal Sent': '#f472b6'
  };

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] h-[380px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Lead Sentiment</h3>
        <select className="text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-2 py-1 outline-none">
          <option>All Status</option>
        </select>
      </div>
      
      <div className="h-[280px] w-full flex items-center justify-center mt-4 min-h-0 min-w-0 relative">
        <PieChart width={350} height={280}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
        
        {/* Total Overlay - Perfectly Centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-9">
          <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">{total}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total</div>
        </div>
      </div>
    </div>
  );
};

export default LeadSentimentChart;
