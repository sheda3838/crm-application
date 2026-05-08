import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const StatusPieChart = ({ data }) => {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b'];

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm min-h-[420px] flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8 tracking-tight">Lead Status Pipeline</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                borderRadius: '20px', 
                border: 'none', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                backgroundColor: 'rgba(255,255,255,0.95)',
                padding: '12px 20px'
              }}
              itemStyle={{ fontWeight: 'bold' }}
            />
            <Legend 
              iconType="circle" 
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{ paddingTop: '30px', fontSize: '12px', fontWeight: 'bold' }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatusPieChart;
