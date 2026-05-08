import db from '../config/db.js';

// Create Lead
export const createLead = (req, res) => {
  const { leadName, companyName, email, phone, leadSource, assignedTo, dealValue } = req.body;

  // Validation
  if (!leadName || !companyName || !email || !phone || !leadSource || !assignedTo || dealValue === undefined) {
    return res.status(400).json({ message: 'All required fields must be provided: leadName, companyName, email, phone, leadSource, assignedTo, dealValue' });
  }

  const query = `INSERT INTO leads (leadName, companyName, email, phone, leadSource, assignedTo, dealValue) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [leadName, companyName, email, phone, leadSource, assignedTo, dealValue];

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error creating lead', error: err.message });
    }
    res.status(201).json({ 
      id: this.lastID, 
      message: 'Lead created successfully' 
    });
  });
};

// Get All Leads with filters and search
export const getLeads = (req, res) => {
  const { status, leadSource, assignedTo, search } = req.query;
  
  let query = 'SELECT * FROM leads WHERE 1=1';
  let params = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (leadSource) {
    query += ' AND leadSource = ?';
    params.push(leadSource);
  }
  if (assignedTo) {
    query += ' AND assignedTo = ?';
    params.push(assignedTo);
  }
  if (search) {
    query += ' AND (leadName LIKE ? OR companyName LIKE ? OR email LIKE ?)';
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam);
  }

  query += ' ORDER BY createdAt DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching leads', error: err.message });
    }
    res.json(rows);
  });
};

// Get Single Lead
export const getLeadById = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT l.*, u.name as assignedToName 
    FROM leads l
    LEFT JOIN users u ON l.assignedTo = u.id
    WHERE l.id = ?
  `;
  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching lead', error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(row);
  });
};

// Update Lead
export const updateLead = (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  // Remove id and createdAt from updates to be safe
  delete updates.id;
  delete updates.createdAt;
  
  // Set updatedAt
  updates.updatedAt = new Date().toISOString();

  const keys = Object.keys(updates);
  const query = `UPDATE leads SET ${keys.map(key => `${key} = ?`).join(', ')} WHERE id = ?`;
  const params = [...Object.values(updates), id];

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating lead', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json({ message: 'Lead updated successfully' });
  });
};

// Delete Lead
export const deleteLead = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM leads WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting lead', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json({ message: 'Lead deleted successfully' });
  });
};
