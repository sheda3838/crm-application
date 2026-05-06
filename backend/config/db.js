import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import initDB from '../db/init.js';
import seedDB from '../db/seed.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'database.sqlite');

const db = new (sqlite3.verbose()).Database(dbPath, async (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    try {
      await initDB(db);
      await seedDB(db);
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }
});

export default db;
