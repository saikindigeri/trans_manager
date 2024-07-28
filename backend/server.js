const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Path to your database file
const dbPath = path.join(__dirname, 'transactions.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// API endpoints
app.get('/api/transactions', (req, res) => {
  db.all('SELECT * FROM transactions', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

app.post('/api/transactions', (req, res) => {
  const { type, amount, description } = req.body;
  const date = new Date().toISOString().split('T')[0];
  db.run(`INSERT INTO transactions (date, type, amount, description) VALUES (?, ?, ?, ?)`, [date, type, amount, description], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: {
        id: this.lastID,
        date,
        type,
        amount,
        description
      }
    });
  });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
