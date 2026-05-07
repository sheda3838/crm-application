import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, MoreVertical, Edit2, Trash2, Check, X } from 'lucide-react';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);
  const [showActions, setShowActions] = useState(false);

  const handleSave = () => {
    if (editContent.trim() !== note.content) {
      onEdit(note.id, editContent);
    }
    setIsEditing(false);
    setShowActions(false);
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative pl-8 sm:pl-12 py-4 group"
    >
      {/* Timeline Node */}
      <div className={`absolute left-0 top-6 w-3 h-3 rounded-full ring-4 ring-slate-50 dark:ring-slate-900 z-10 ${note.deleted ? 'bg-red-400' : 'bg-blue-500'}`} />
      
      <div className={`border rounded-2xl p-5 shadow-sm relative transition-all ${note.deleted ? 'bg-slate-50 dark:bg-slate-800/30 border-dashed border-slate-300 dark:border-slate-700' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md'}`}>
        {note.deleted ? (
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 italic text-sm">
            <Trash2 size={16} />
            <p>
              This note was deleted {note.deleterName ? `by ${note.deleterName}` : ''} at {formatDate(note.deletedAt)}
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs uppercase">
                  {note.authorName ? note.authorName.substring(0, 2) : 'US'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {note.authorName || 'Sales Rep'} 
                    {note.edited ? <span className="text-slate-400 text-xs ml-2 font-normal">(edited at {formatDate(note.updatedAt)})</span> : ''}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(note.createdAt)}</p>
                </div>
              </div>

              {/* Actions Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowActions(!showActions)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical size={16} />
                </button>
                
                {showActions && (
                  <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                    <button 
                      onClick={() => { setIsEditing(true); setShowActions(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => { onDelete(note.id); setShowActions(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="mt-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 dark:text-white min-h-[80px]"
                />
                <div className="flex justify-end gap-2 mt-3">
                  <button 
                    onClick={() => { setIsEditing(false); setEditContent(note.content); }}
                    className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1"
                  >
                    <X size={14} /> Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center gap-1"
                  >
                    <Check size={14} /> Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {note.content}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default NoteCard;
