import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, Building, Briefcase, Calendar, Edit2, Loader2 } from 'lucide-react';
import API from '../api/axios';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import LeadStatusBadge from '../components/leads/LeadStatusBadge';
import NotesTimeline from '../components/notes/NotesTimeline';
import LeadFormModal from '../components/leads/LeadFormModal';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
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

  const fetchLeadDetails = async () => {
    try {
      const response = await API.get(`/leads/${id}`);
      setLead(response.data);
    } catch (err) {
      console.error('Error fetching lead details:', err);
      alert('Failed to load lead details.');
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  const handleUpdateLead = async (formData) => {
    setModalLoading(true);
    try {
      await API.patch(`/leads/${id}`, formData);
      setIsModalOpen(false);
      fetchLeadDetails();
    } catch (err) {
      console.error('Error updating lead:', err);
      alert('Failed to update lead');
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-[#0a0514]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0a0514] transition-colors duration-300">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} title="Lead Profile" />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-[1200px] mx-auto space-y-8">
            
            {/* Header / Actions */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigate('/leads')}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={16} /> Back to Leads
              </button>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Edit2 size={16} /> Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Lead Info Card */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1 space-y-6"
              >
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col">
                  
                  {/* Profile Header */}
                  <div className="flex flex-col items-center text-center pb-8 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-500/20 mb-4">
                      {lead.leadName.substring(0, 2).toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{lead.leadName}</h2>
                    <p className="text-sm font-bold text-slate-500 mt-1">{lead.companyName}</p>
                    <div className="mt-4">
                      <LeadStatusBadge status={lead.status} />
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="pt-8 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl"><Mail size={18} /></div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{lead.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl"><Phone size={18} /></div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{lead.phone || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl"><Briefcase size={18} /></div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Deal Value</p>
                        <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">${lead.dealValue?.toLocaleString() || 0}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl"><Building size={18} /></div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Source</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{lead.leadSource}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-xl"><Calendar size={18} /></div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Created At</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>

              {/* Right Column: Activity / Notes */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2"
              >
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-8 min-h-[600px]">
                  <NotesTimeline leadId={id} />
                </div>
              </motion.div>

            </div>

          </div>
        </main>
      </div>

      <LeadFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdateLead}
        initialData={lead}
        loading={modalLoading}
      />
    </div>
  );
};

export default LeadDetails;
