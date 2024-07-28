const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');


db.serialize(() => {
  db.run(`CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    amount REAL,
    description TEXT,
    date TEXT,
    total REAL
  )`);
});

module.exports = db;
