const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'zyabc123';
 
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
app.post('/api/owner/signup', async (req, res) => {
    const { name, phone, email, address, password } = req.body;

    try {
        // Generate hashed password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Insert into database
        db.query(
            'INSERT INTO owners (name, phone, email, address, password) VALUES (?, ?, ?, ?, ?)',
            [name, phone, email, address, hashedPassword],
            (err, result) => {
                if (err) return res.status(400).json({ error: 'Email already exists or error occurred' });
                res.json({ success: true });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// Login API
app.post('/api/owner/login', (req, res) => {
    const { phone, password } = req.body;
    db.query('SELECT * FROM owners WHERE phone = ?', [phone], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Server error' });

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const owner = results[0]; 
        const isMatch = await bcrypt.compare(password, owner.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ id: owner.id, phone: owner.phone }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ success: true, token, owner: { id: owner.id, name: owner.name, phone: owner.phone } });
    });
});


app.post('/api/add-area', (req, res) => {
  const { area_name, landmark } = req.body;

  if (!area_name || !landmark) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const query = 'INSERT INTO area (area_name, landmark) VALUES (?, ?)';
  db.query(query, [area_name, landmark], (err, result) => {
    if (err) {
      console.error('Error inserting area:', err);
      return res.status(500).json({ success: false, message: 'Failed to add area' });
    }

    res.json({ success: true, message: 'Area added successfully' });
  });
});


app.get('/api/areas', (req, res) => {
  db.query('SELECT id, landmark FROM area', (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'DB error' });
    res.json({ success: true, areas: results });
  });
});

app.post('/api/add-employee', async (req, res) => {
  const { name, contact, address, password, area_id } = req.body;

  if (!name || !contact || !address || !password || !area_id) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO employees (name, contact, address, password, status, area_id) VALUES (?, ?, ?, ?, 'active', ?)`;
    db.query(sql, [name, contact, address, hashedPassword, area_id], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'DB insert failed' });
      res.json({ success: true, message: 'Employee added successfully' });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error hashing password' });
  }
});



app.get('/api/employees', (req, res) => {
  const query = `
    SELECT e.id, e.name, e.address, e.contact, a.landmark AS area_name 
    FROM employee e 
    JOIN area a ON e.area_id = a.id 
    WHERE e.status = 'active'
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching employees:", err); // 👈 shows exact DB error
      return res.status(500).json({ success: false, message: "Database error" });
    }

    res.json({ success: true, employees: results });
  });
});



app.listen(3000, '0.0.0.0', () => {
    console.log("Server running on port 3000");
});
