import React, { useContext } from 'react';
import { Sun, Moon, Search, Bell, User } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Topbar = ({ isDarkMode, setIsDarkMode, title }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-6 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
        <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800/50 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 w-80 group focus-within:border-blue-500 transition-all">
          <Search size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent border-none focus:ring-0 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 w-full ml-3"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="p-2.5 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all relative active:scale-95">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full ring-4 ring-white dark:ring-slate-900"></span>
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

        <div className="flex items-center gap-4 pl-2 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors">{user?.name || 'Admin User'}</p>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">Administrator</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <User size={22} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
