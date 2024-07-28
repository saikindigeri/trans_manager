const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 5001;

app.use(bodyParser.json());
app.use(cors());


app.get('/api/transactions', (req, res) => {
  db.all('SELECT * FROM transactions', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      data: rows
    });
  });
});


app.post('/api/transactions', (req, res) => {
  const { type, amount, description } = req.body;
  const date = new Date().toLocaleDateString();

  db.get('SELECT total FROM transactions ORDER BY id DESC LIMIT 1', [], (err, row) => {
    const previousTotal = row ? row.total : 0;
    const total = type === 'credit' ? previousTotal + amount : previousTotal - amount;

    db.run(`INSERT INTO transactions (type, amount, description, date, total) VALUES (?, ?, ?, ?, ?)`,
      [type, amount, description, date, total],
      function(err) {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({
          id: this.lastID,
          type,
          amount,
          description,
          date,
          total
        });
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
