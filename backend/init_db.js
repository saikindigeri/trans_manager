const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to your database file
const dbPath = path.join(__dirname, 'transactions.db');

// Open the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }

  console.log('Connected to the SQLite database.');

  // Create the transactions table if it doesn't exist
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    type TEXT,
    amount REAL,
    description TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Transactions table created or already exists.');
    }

    // Close the database
    db.close((err) => {
      if (err) {
        console.error('Error closing the database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  });
});
