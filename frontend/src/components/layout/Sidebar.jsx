import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, LogOut, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = ({ collapsed, setCollapsed, isOpen, setIsOpen }) => {
  const { logout } = useContext(AuthContext);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Leads', path: '/leads' },
  ];

  const sidebarWidth = collapsed ? 80 : 280;

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: typeof window !== 'undefined' && window.innerWidth < 768 ? 280 : sidebarWidth,
        x: typeof window !== 'undefined' && window.innerWidth < 768 ? (isOpen ? 0 : -280) : 0
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 flex flex-col transition-colors duration-300 z-50 overflow-hidden fixed md:sticky left-0"
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="min-w-[32px] w-8 h-8">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          {(!collapsed || (typeof window !== 'undefined' && window.innerWidth < 768)) && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-xl text-slate-900 dark:text-white tracking-tight whitespace-nowrap"
            >
              Torch Labs CRM
            </motion.span>
          )}
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-2 -mr-2 text-slate-400 hover:text-slate-600 md:hidden"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            onClick={(e) => { if(item.label === 'Settings') e.preventDefault(); }}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <item.icon size={22} className="shrink-0" />
            {(!collapsed || (typeof window !== 'undefined' && window.innerWidth < 768)) && (
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-4 px-4 py-3.5 w-full rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-medium group"
        >
          <LogOut size={22} className="shrink-0" />
          {(!collapsed || (typeof window !== 'undefined' && window.innerWidth < 768)) && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap">
              Logout
            </motion.span>
          )}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full p-1.5 text-slate-400 hover:text-blue-600 shadow-xl z-50 hidden md:block transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </motion.aside>
  );
};

export default Sidebar;
