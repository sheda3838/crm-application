import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

const LeadFormModal = ({ isOpen, onClose, onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    leadName: '',
    companyName: '',
    email: '',
    phone: '',
    leadSource: 'Organic Search',
    assignedTo: '',
    status: 'New',
    dealValue: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        dealValue: initialData.dealValue || 0
      });
    } else {
      setFormData({
        leadName: '',
        companyName: '',
        email: '',
        phone: '',
        leadSource: 'Organic Search',
        assignedTo: '',
        status: 'New',
        dealValue: 0
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'dealValue' ? Number(value) : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all";
  const labelClasses = "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#0a0514] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {initialData ? 'Edit Lead' : 'Create New Lead'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="col-span-1 sm:col-span-2">
                <label className={labelClasses}>Lead Name <span className="text-red-500">*</span></label>
                <input required type="text" name="leadName" value={formData.leadName} onChange={handleChange} className={inputClasses} placeholder="John Doe" />
              </div>

              <div>
                <label className={labelClasses}>Company Name <span className="text-red-500">*</span></label>
                <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} className={inputClasses} placeholder="Acme Corp" />
              </div>

              <div>
                <label className={labelClasses}>Deal Value ($) <span className="text-red-500">*</span></label>
                <input required type="number" min="0" name="dealValue" value={formData.dealValue} onChange={handleChange} className={inputClasses} placeholder="10000" />
              </div>

              <div>
                <label className={labelClasses}>Email <span className="text-red-500">*</span></label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} placeholder="john@example.com" />
              </div>

              <div>
                <label className={labelClasses}>Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputClasses} placeholder="+1 (555) 000-0000" />
              </div>

              <div>
                <label className={labelClasses}>Lead Source</label>
                <select name="leadSource" value={formData.leadSource} onChange={handleChange} className={inputClasses}>
                  <option value="Organic Search">Organic Search</option>
                  <option value="Referral">Referral</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Email Campaign">Email Campaign</option>
                </select>
              </div>

              <div>
                <label className={labelClasses}>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className={inputClasses}>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center min-w-[120px]"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : (initialData ? 'Save Changes' : 'Create Lead')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LeadFormModal;
