import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const location = useLocation();

  // Sync Theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Determine Title based on current path
  const getPageTitle = () => {
    if (location.pathname.startsWith('/leads/')) return 'Lead Profile';
    if (location.pathname === '/leads') return 'Leads Management';
    if (location.pathname === '/dashboard') return 'Business Overview';
    return 'CRM Application';
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0a0514] transition-colors duration-300">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} title={getPageTitle()} />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
