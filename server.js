const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('memes.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    createTables();
  }
});

// Create necessary tables
function createTables() {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS memes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT,
    expression_type TEXT,
    expression_data TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS saved_memes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    meme_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (meme_id) REFERENCES memes (id)
  )`);
}

// Routes
app.post('/api/analyze-expression', (req, res) => {
  const { expressionData } = req.body;
  // TODO: Implement facial expression analysis and meme matching
  res.json({ success: true, message: 'Expression analyzed' });
});

app.post('/api/save-meme', (req, res) => {
  const { userId, memeId } = req.body;
  db.run('INSERT INTO saved_memes (user_id, meme_id) VALUES (?, ?)', 
    [userId, memeId], 
    function(err) {
      if (err) {
        res.status(500).json({ success: false, error: err.message });
      } else {
        res.json({ success: true, id: this.lastID });
      }
    });
});

app.get('/api/saved-memes/:userId', (req, res) => {
  const userId = req.params.userId;
  db.all(`
    SELECT m.* FROM memes m
    JOIN saved_memes sm ON m.id = sm.meme_id
    WHERE sm.user_id = ?
  `, [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
    } else {
      res.json({ success: true, memes: rows });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 
