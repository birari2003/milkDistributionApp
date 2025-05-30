const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'milk_distribution'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected');
});

// Signup API
app.post('/api/owner/signup', (req, res) => {
    const { name, phone, email, address, password } = req.body;
    db.query(
        'INSERT INTO owners (name, phone, email, address, password) VALUES (?, ?, ?, ?, ?)',
        [name, phone, email, address, password],
        (err, result) => {
            if (err) return res.status(400).json({ error: 'Email already exists or error occurred' });
            res.json({ success: true });
        }
    );
});

// Login API
app.post('/api/owner/login', (req, res) => {
    const { email, password } = req.body;
    db.query(
        'SELECT * FROM owners WHERE email = ? AND password = ?',
        [email, password],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Server error' });
            if (results.length > 0) {
                res.json({ success: true, owner: results[0] });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        }
    );
});

app.listen(3000, '0.0.0.0', () => {
    console.log("Server running on port 3000");
});
