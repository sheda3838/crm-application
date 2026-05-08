import React from 'react';
import { motion } from 'framer-motion';

const ActivityHeatmap = ({ data }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'];

  // Helper to get color intensity based on value (max value around 50 for our mock)
  const getCellColor = (value) => {
    if (value === 0) return 'bg-slate-100 dark:bg-slate-800';
    if (value < 10) return 'bg-orange-200 dark:bg-orange-900/40';
    if (value < 25) return 'bg-orange-300 dark:bg-orange-700/60';
    if (value < 40) return 'bg-orange-400 dark:bg-orange-500/80';
    return 'bg-orange-500 dark:bg-orange-500';
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Optimal Contact Time</h3>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex h-[240px]">
          {/* Y-Axis: Days */}
          <div className="flex flex-col justify-between pr-4 pb-4 w-10">
            {days.map(day => (
              <span key={day} className="text-[10px] font-semibold text-slate-400">{day}</span>
            ))}
          </div>
          
          {/* Grid */}
          <div className="flex-1 flex flex-col justify-between pb-4">
            {days.map(day => (
              <div key={day} className="flex gap-1 flex-1">
                {hours.map(hour => {
                  const cellData = data.find(d => d.day === day && d.hour === hour);
                  const value = cellData ? cellData.value : 0;
                  return (
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      key={`${day}-${hour}`} 
                      className={`flex-1 rounded-sm ${getCellColor(value)} transition-colors cursor-pointer group relative`}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                        {day} {hour}: {value} interactions
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* X-Axis: Hours */}
        <div className="flex justify-between ml-10 text-[10px] font-semibold text-slate-400 pt-2 pl-1 pr-1">
          {hours.map(hour => (
            <span key={hour} className="w-8 text-center">{hour}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
