export default function initDB(db) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      console.log('Initializing tables...');
      
      // Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )`);

      // Leads table
      db.run(`CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        leadName TEXT NOT NULL,
        companyName TEXT,
        email TEXT,
        phone TEXT,
        leadSource TEXT,
        assignedTo INTEGER,
        status TEXT DEFAULT 'New',
        dealValue REAL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assignedTo) REFERENCES users(id)
      )`);

      // Notes table
      db.run(`CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        leadId INTEGER NOT NULL,
        content TEXT NOT NULL,
        createdBy INTEGER,
        edited BOOLEAN DEFAULT FALSE,
        deleted BOOLEAN DEFAULT FALSE,
        deletedAt DATETIME,
        deletedBy INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (leadId) REFERENCES leads(id),
        FOREIGN KEY (createdBy) REFERENCES users(id),
        FOREIGN KEY (deletedBy) REFERENCES users(id)
      )`, (err) => {
        if (err) {
          console.error('Error creating tables:', err.message);
          reject(err);
        } else {
          console.log('Tables initialized successfully.');
          resolve();
        }
      });
    });
  });
}
