import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LeadStatusBadge from './LeadStatusBadge';

const LeadsTable = ({ leads, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30">
              <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Lead Info</th>
              <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Company</th>
              <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Status</th>
              <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Source</th>
              <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Deal Value</th>
              <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {leads.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-8 py-10 text-center text-slate-500 font-medium">
                  No leads found matching your criteria.
                </td>
              </tr>
            ) : (
              leads.map((lead, index) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={lead.id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span 
                        onClick={() => navigate(`/leads/${lead.id}`)}
                        className="text-sm font-bold text-slate-900 dark:text-white cursor-pointer hover:text-blue-600 transition-colors"
                      >
                        {lead.leadName}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{lead.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{lead.companyName}</span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="text-sm text-slate-500 dark:text-slate-400">{lead.leadSource}</span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="text-sm font-black text-slate-900 dark:text-white">${lead.dealValue?.toLocaleString() || 0}</span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => navigate(`/leads/${lead.id}`)}
                        className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => onEdit(lead)}
                        className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40 rounded-lg transition-colors"
                        title="Edit Lead"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(lead.id)}
                        className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/40 rounded-lg transition-colors"
                        title="Delete Lead"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsTable;
