import db from '../config/db.js';

// Add Note
export const addNote = (req, res) => {
  const { id: leadId } = req.params;
  const { content } = req.body;
  const createdBy = req.user.id;

  if (!content) {
    return res.status(400).json({ message: 'Note content is required' });
  }

  // Check if lead exists
  db.get('SELECT id FROM leads WHERE id = ?', [leadId], (err, lead) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const query = `INSERT INTO notes (leadId, content, createdBy) VALUES (?, ?, ?)`;
    db.run(query, [leadId, content, createdBy], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error adding note', error: err.message });
      }
      
      db.get('SELECT * FROM notes WHERE id = ?', [this.lastID], (err, newNote) => {
        res.status(201).json(newNote);
      });
    });
  });
};

// Get Notes for a Lead
export const getLeadNotes = (req, res) => {
  const { id: leadId } = req.params;

  const query = `
    SELECT n.*, u.name as authorName 
    FROM notes n
    LEFT JOIN users u ON n.createdBy = u.id
    WHERE n.leadId = ? AND n.deleted = 0
    ORDER BY n.createdAt DESC
  `;

  db.all(query, [leadId], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching notes', error: err.message });
    }
    res.json(rows);
  });
};

// Update Note (Audit-style)
export const updateNote = (req, res) => {
  const { noteId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Note content is required' });
  }

  db.get('SELECT * FROM notes WHERE id = ? AND deleted = 0', [noteId], (err, note) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!note) {
      return res.status(404).json({ message: 'Note not found or already deleted' });
    }

    const query = `UPDATE notes SET content = ?, edited = 1, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
    db.run(query, [content, noteId], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating note', error: err.message });
      }
      res.json({ message: 'Note updated successfully' });
    });
  });
};

// Soft Delete Note
export const deleteNote = (req, res) => {
  const { noteId } = req.params;
  const deletedBy = req.user.id;

  db.get('SELECT * FROM notes WHERE id = ? AND deleted = 0', [noteId], (err, note) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!note) {
      return res.status(404).json({ message: 'Note not found or already deleted' });
    }

    const query = `UPDATE notes SET deleted = 1, deletedAt = CURRENT_TIMESTAMP, deletedBy = ? WHERE id = ?`;
    db.run(query, [deletedBy, noteId], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error deleting note', error: err.message });
      }
      res.json({ message: 'Note deleted successfully' });
    });
  });
};
