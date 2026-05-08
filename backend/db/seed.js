import bcrypt from 'bcryptjs';

const USERS = [
  { name: 'Admin User', email: 'admin@example.com', role: 'Admin' },
  { name: 'Sarah Jenkins', email: 'sarah.j@example.com', role: 'Team Lead' },
  { name: 'Marcus Chen', email: 'marcus.c@example.com', role: 'Sales Rep' },
  { name: 'Elena Rodriguez', email: 'elena.r@example.com', role: 'Sales Rep' },
  { name: 'David Kim', email: 'david.k@example.com', role: 'Team Lead' }
];

const COMPANIES = ['Acme Corp', 'Stark Industries', 'Wayne Enterprises', 'Globex', 'Soylent Corp', 'Initech', 'Umbrella Corp', 'Cyberdyne Systems', 'Gringotts', 'Ollivanders', 'Daily Planet', 'Hooli', 'Pied Piper', 'Massive Dynamic', 'Veep'];
const FIRST_NAMES = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'Richard', 'Barbara', 'Joseph', 'Susan', 'Thomas', 'Jessica', 'Charles', 'Sarah', 'Christopher', 'Karen'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

const SOURCES = ['Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event', 'Facebook Ads'];
const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const generateNotesForLead = (leadId, users, leadCreatedAt) => {
  const notes = [];
  const numNotes = getRandomInt(1, 4);
  const now = new Date();
  
  const noteTemplates = [
    "Initial outreach completed. Sent introductory email.",
    "Follow-up scheduled for next week. They seem interested but need budget approval.",
    "Client requested proposal. Putting together the figures now.",
    "Demo meeting completed. Great feedback on the dashboard features.",
    "Awaiting approval from their legal team.",
    "Left a voicemail.",
    "Connected on LinkedIn and exchanged a few messages.",
    "Discussed pricing. They asked for a 10% discount.",
    "Competitor XYZ is also in the mix. Need to highlight our unique features.",
    "Send case study about similar implementations."
  ];

  for (let i = 0; i < numNotes; i++) {
    const noteDate = getRandomDate(new Date(leadCreatedAt), now);
    const isEdited = Math.random() > 0.8;
    const isDeleted = Math.random() > 0.9;
    
    notes.push({
      leadId,
      content: getRandomItem(noteTemplates),
      createdBy: getRandomItem(users).id,
      edited: isEdited ? 1 : 0,
      deleted: isDeleted ? 1 : 0,
      createdAt: noteDate.toISOString(),
      updatedAt: isEdited ? getRandomDate(noteDate, now).toISOString() : noteDate.toISOString(),
      deletedAt: isDeleted ? getRandomDate(noteDate, now).toISOString() : null,
      deletedBy: isDeleted ? getRandomItem(users).id : null
    });
  }
  
  // Sort notes so they make temporal sense
  notes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  return notes;
};

export default async function seedDB(db) {
  const defaultPassword = 'password123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM leads', async (err, row) => {
      if (err) return reject(err);
      
      // Only seed if less than 10 leads exist
      // Only seed if less than 10 leads exist
      if (row.count > 10) {
        console.log('Database already populated with leads. Skipping seed.');
        return resolve();
      }

      console.log('Seeding database with realistic dummy data...');

      db.serialize(() => {
        // Clear existing data to ensure a clean slate
        db.run('DELETE FROM notes');
        db.run('DELETE FROM leads');
        db.run('DELETE FROM users WHERE email != ?', ['admin@example.com']);

        // Insert Users
        const stmtUsers = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
        const insertedUsers = [];
        
        let usersCompleted = 0;
        
        USERS.forEach(user => {
          db.get('SELECT id FROM users WHERE email = ?', [user.email], (err, row) => {
            if (row) {
              insertedUsers.push({ id: row.id, ...user });
              usersCompleted++;
              checkUsersDone();
            } else {
              stmtUsers.run([user.name, user.email, hashedPassword], function(err) {
                if (!err) insertedUsers.push({ id: this.lastID, ...user });
                usersCompleted++;
                checkUsersDone();
              });
            }
          });
        });

        function checkUsersDone() {
          if (usersCompleted === USERS.length) {
            stmtUsers.finalize();
            seedLeadsAndNotes(insertedUsers);
          }
        }

        function seedLeadsAndNotes(users) {
          const stmtLeads = db.prepare(`
            INSERT INTO leads (leadName, companyName, email, phone, leadSource, assignedTo, status, dealValue, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          const stmtNotes = db.prepare(`
            INSERT INTO notes (leadId, content, createdBy, edited, deleted, createdAt, updatedAt, deletedAt, deletedBy)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);

          const now = new Date();
          const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
          
          let leadsCompleted = 0;
          const targetLeads = 35;

          for (let i = 0; i < targetLeads; i++) {
            const firstName = getRandomItem(FIRST_NAMES);
            const lastName = getRandomItem(LAST_NAMES);
            const company = Math.random() > 0.05 ? getRandomItem(COMPANIES) : 'Private'; // Most leads have a company, or 'Private' if individual
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company ? company.replace(/\s+/g, '').toLowerCase() + '.com' : 'email.com'}`;
            const phone = `555-${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`;
            const dealValue = getRandomInt(10, 500) * 100;
            const createdAt = getRandomDate(sixMonthsAgo, now);
            const updatedAt = getRandomDate(createdAt, now);
            
            stmtLeads.run([
              `${firstName} ${lastName}`,
              company,
              email,
              phone,
              getRandomItem(SOURCES),
              getRandomItem(users).id, // Randomly assign
              getRandomItem(STATUSES),
              dealValue,
              createdAt.toISOString(),
              updatedAt.toISOString()
            ], function(err) {
              if (err) console.error('Error inserting lead', err);
              else {
                const leadId = this.lastID;
                const notes = generateNotesForLead(leadId, users, createdAt);
                
                notes.forEach(note => {
                  stmtNotes.run([
                    note.leadId, note.content, note.createdBy, note.edited, note.deleted,
                    note.createdAt, note.updatedAt, note.deletedAt, note.deletedBy
                  ]);
                });
              }
              
              leadsCompleted++;
              if (leadsCompleted === targetLeads) {
                stmtLeads.finalize();
                stmtNotes.finalize();
                console.log('Seeding complete! Added 35 leads and associated notes.');
                resolve();
              }
            });
          }
        }
      });
    });
  });
}
