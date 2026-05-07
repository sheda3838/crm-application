import React, { useState, useEffect } from 'react';
import { Loader2, MessageSquare } from 'lucide-react';
import API from '../../api/axios';
import NoteCard from './NoteCard';
import AddNoteForm from './AddNoteForm';

const NotesTimeline = ({ leadId }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchNotes = async () => {
    try {
      const response = await API.get(`/leads/${leadId}/notes`);
      setNotes(response.data);
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [leadId]);

  const handleAddNote = async (content) => {
    setSubmitting(true);
    try {
      await API.post(`/leads/${leadId}/notes`, { content });
      await fetchNotes();
    } catch (err) {
      console.error('Error adding note:', err);
      alert('Failed to add note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditNote = async (noteId, newContent) => {
    try {
      await API.patch(`/notes/${noteId}`, { content: newContent });
      await fetchNotes();
    } catch (err) {
      console.error('Error editing note:', err);
      alert('Failed to edit note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await API.delete(`/notes/${noteId}`);
      await fetchNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
      alert('Failed to delete note');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6 tracking-tight">
        <MessageSquare size={20} className="text-blue-500" />
        Activity History
      </h3>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-[5px] top-6 bottom-0 w-[2px] bg-slate-200 dark:bg-slate-800" />

        <div className="space-y-2">
          {notes.length === 0 ? (
            <div className="pl-8 py-8 text-slate-500 dark:text-slate-400 font-medium">
              No activity logged yet. Be the first to leave a note!
            </div>
          ) : (
            notes.map((note) => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onEdit={handleEditNote} 
                onDelete={handleDeleteNote} 
              />
            ))
          )}
        </div>
      </div>

      <AddNoteForm onSubmit={handleAddNote} loading={submitting} />
    </div>
  );
};

export default NotesTimeline;
