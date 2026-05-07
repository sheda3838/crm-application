import React from 'react';
import { Search, Filter } from 'lucide-react';

const LeadFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center w-full bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
      
      {/* Search Bar */}
      <div className="relative flex-1 w-full group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search by name, company, or email..."
          className="w-full pl-12 pr-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-500 transition-all"
        />
      </div>

      {/* Filters */}
      <div className="flex w-full md:w-auto gap-4">
        <div className="relative w-full md:w-48 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Filter size={16} />
          </div>
          <select 
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full pl-10 pr-8 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-bold text-slate-700 dark:text-slate-300 appearance-none cursor-pointer transition-all"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div className="relative w-full md:w-48 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Filter size={16} />
          </div>
          <select 
            name="source"
            value={filters.source}
            onChange={handleChange}
            className="w-full pl-10 pr-8 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-bold text-slate-700 dark:text-slate-300 appearance-none cursor-pointer transition-all"
          >
            <option value="">All Sources</option>
            <option value="Organic Search">Organic Search</option>
            <option value="Referral">Referral</option>
            <option value="Social Media">Social Media</option>
            <option value="Cold Call">Cold Call</option>
            <option value="Email Campaign">Email Campaign</option>
          </select>
        </div>
      </div>

    </div>
  );
};

export default LeadFilters;
