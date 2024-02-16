const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const ejs = require('ejs');

const app = express();
const PORT = 3000;

// Create an SQLite database (use a persistent database in production)
const db = new sqlite3.Database(':memory:');

// Create a 'users' table in the database
db.serialize(() => {
  db.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files (like CSS)
app.use(express.static('public'));

// Homepage route
app.get('/', (req, res) => {
  res.render('index');
});

// Register endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user into the database
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.redirect('/dashboard');
  });
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  // Retrieve all users from the database
  db.all('SELECT * FROM users', (err, users) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.render('dashboard', { users });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
