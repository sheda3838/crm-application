import bcrypt from 'bcryptjs';

export default async function seedDB(db) {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'password123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [adminEmail], (err, row) => {
      if (err) {
        console.error('Error checking for existing admin:', err.message);
        reject(err);
        return;
      }

      if (!row) {
        db.run(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          ['Admin User', adminEmail, hashedPassword],
          (err) => {
            if (err) {
              console.error('Error seeding admin user:', err.message);
              reject(err);
            } else {
              console.log('Default admin user seeded.');
              resolve();
            }
          }
        );
      } else {
        console.log('Admin user already exists. Skipping seed.');
        resolve();
      }
    });
  });
}
