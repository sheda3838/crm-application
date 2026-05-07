import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2 } from 'lucide-react';
import API from '../api/axios';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import LeadsTable from '../components/leads/LeadsTable';
import LeadFilters from '../components/leads/LeadFilters';
import LeadFormModal from '../components/leads/LeadFormModal';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    source: ''
  });

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

  useEffect(() => {
    fetchLeads();
  }, [filters.status, filters.source]); // Only refetch on status/source change, search is frontend filtered for speed

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.source) params.source = filters.source;
      
      const response = await API.get('/leads', { params });
      setLeads(response.data);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    setModalLoading(true);
    try {
      if (editingLead) {
        await API.patch(`/leads/${editingLead.id}`, formData);
      } else {
        await API.post('/leads', formData);
      }
      setIsModalOpen(false);
      fetchLeads(); // Refresh data
    } catch (err) {
      console.error('Error saving lead:', err);
      alert('Error saving lead: ' + (err.response?.data?.message || err.message));
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) return;
    try {
      await API.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err) {
      console.error('Error deleting lead:', err);
      alert('Error deleting lead.');
    }
  };

  const openAddModal = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const openEditModal = (lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  // Client-side search filtering
  const filteredLeads = leads.filter(lead => {
    const searchLower = filters.search.toLowerCase();
    return (
      lead.leadName?.toLowerCase().includes(searchLower) ||
      lead.companyName?.toLowerCase().includes(searchLower) ||
      lead.email?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0a0514] transition-colors duration-300">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} title="Leads Management" />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-[1600px] mx-auto space-y-8">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Pipeline</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage and track your active leads.</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openAddModal}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/30 transition-all flex items-center gap-2"
              >
                <Plus size={20} />
                New Lead
              </motion.button>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <LeadFilters filters={filters} setFilters={setFilters} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                  <p className="text-slate-500 font-bold">Loading Leads...</p>
                </div>
              ) : (
                <LeadsTable 
                  leads={filteredLeads} 
                  onEdit={openEditModal} 
                  onDelete={handleDelete} 
                />
              )}
            </motion.div>

          </div>
        </main>
      </div>

      <LeadFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingLead}
        loading={modalLoading}
      />
    </div>
  );
};

export default Leads;
