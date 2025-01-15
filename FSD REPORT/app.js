const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./users.db');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

// Create users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);

// Signup Route
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function (err) {
    if (err) {
      res.status(400).send('Username already exists.');
    } else {
      res.send('Signup successful!');
    }
  });
});

// Login Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (row) {
      res.send('Login successful!');
    } else {
      res.status(400).send('Invalid credentials.');
    }
  });
});

// Start Server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
