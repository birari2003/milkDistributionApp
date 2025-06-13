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
// app.post('/api/owner/login', (req, res) => {
//     const { phone, password } = req.body;
//     db.query('SELECT * FROM owners WHERE phone = ?', [phone], async (err, results) => {
//         if (err) return res.status(500).json({ error: 'Server error' });

//         if (results.length === 0) {
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }

//         const owner = results[0]; 
//         const isMatch = await bcrypt.compare(password, owner.password);

//         if (!isMatch) {
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }

//         // Generate JWT
//         const token = jwt.sign({ id: owner.id, phone: owner.phone }, JWT_SECRET, { expiresIn: '7d' });

//         res.json({ success: true, token, owner: { id: owner.id, name: owner.name, phone: owner.phone } });
//     });
// });


app.post('/api/login', async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ success: false, message: 'Phone and password are required' });
  }

  try {
    // Check in owners table
    const [owners] = await db.promise().execute('SELECT * FROM owners WHERE phone = ?', [phone]);
    if (owners.length > 0) {
      const owner = owners[0];
      const match = await bcrypt.compare(password, owner.password);
      if (!match) return res.json({ success: false, message: 'Invalid password' });

      const token = jwt.sign({ id: owner.id, role: 'owner' }, 'zyabc123', { expiresIn: '7d' });
      return res.json({ success: true, role: 'owner', token, user: owner });
    }

    // Check in employees table
    const [employees] = await db.promise().execute(
      `SELECT e.*, a.area_name, a.landmark 
       FROM employees e 
       JOIN area a ON e.area_id = a.id 
       WHERE e.contact = ?`,
      [phone]
    );
    if (employees.length > 0) {
      const emp = employees[0];
      const match = await bcrypt.compare(password, emp.password);
      if (!match) return res.json({ success: false, message: 'Invalid password' });

      const token = jwt.sign({ id: emp.id, role: 'employee' }, 'zyabc123', { expiresIn: '7d' });
      return res.json({ success: true, role: 'employee', token, user: emp });
    }

    // Check in customer table
    const [customers] = await db.promise().execute('SELECT * FROM customer WHERE phone = ?', [phone]);
    if (customers.length > 0) {
      const customer = customers[0];
      const match = await bcrypt.compare(password, customer.password);
      if (!match) return res.json({ success: false, message: 'Invalid password' });

      const token = jwt.sign({ id: customer.id, role: 'customer' }, 'zyabc123', { expiresIn: '7d' });
      return res.json({ success: true, role: 'customer', token, user: customer });
    }

    return res.json({ success: false, message: 'User not found' });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



app.get('/api/customers', (req, res) => {
  const query = 'SELECT name, phone, address FROM customer WHERE status = "active"';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching customers:', err);
      return res.status(500).json({ success: false, message: 'DB error' });
    }
    res.json({ success: true, customers: results });
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
 


app.post('/api/add-customer', async (req, res) => {
  const { name, phone, password, address, area_id, daily_milk_needed, extra_milk_if_needed } = req.body;

  if (!name || !phone || !password || !address || !area_id) {
    return res.status(400).json({ success: false, message: 'All required fields must be filled' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      'INSERT INTO customer (name, phone, password, address, area_id, daily_milk_needed, extra_milk_if_needed) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, phone, hashedPassword, address, area_id, daily_milk_needed || 0, extra_milk_if_needed || 0]
    );

    res.json({ success: true, message: 'Customer added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});



app.post('/api/milk-report', (req, res) => {
  const {
    name,
    phone,
    address,
    got_today,
    will_get_tomorrow,
    extra_today,
    extra_tomorrow
  } = req.body;

  if (!name || !phone || !address) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Step 1: Get area_id from customer table
  const areaQuery = `SELECT area_id FROM customer WHERE phone = ? LIMIT 1`;

  db.query(areaQuery, [phone], (err, results) => {
    if (err) {
      console.error('Error fetching area_id:', err);
      return res.status(500).json({ success: false, message: 'Database error while fetching area_id' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const area_id = results[0].area_id;

    // Step 2: Insert milk report with area_id
    const insertQuery = `
      INSERT INTO milkreport 
        (name, phone, address, got_today, will_get_tomorrow, extra_today, extra_tomorrow, area_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(insertQuery, [
      name,
      phone,
      address,
      got_today ? 1 : 0,
      will_get_tomorrow ? 1 : 0,
      extra_today,
      extra_tomorrow,
      area_id
    ], (err, result) => {
      if (err) {
        console.error('Database insert error:', err);
        return res.status(500).json({ success: false, message: 'Database error while inserting report' });
      }

      res.json({ success: true, message: 'Report submitted successfully' });
    });
  });
});



app.get('/api/todays-milk-report', (req, res) => {
  const sql = `
    SELECT 
      e.name AS employee_name,
      e.contact AS employee_phone,
      a.landmark AS area_landmark,
      a.id AS area_id,

      -- Date fields
      CURDATE() AS today_date,
      CURDATE() + INTERVAL 1 DAY AS tomorrow_date,

      -- 1. Total customers who got milk today
      SUM(mr.got_today = 1) AS total_customers_today,

      -- 2. Total customers who will get milk tomorrow
      SUM(mr.will_get_tomorrow = 1) AS total_customers_tomorrow,

      -- 3. Total milk distributed today
      SUM(
        CASE 
          WHEN mr.got_today = 1 THEN 
            CASE 
              WHEN mr.extra_today > 0 THEN mr.extra_today 
              ELSE c.daily_milk_needed 
            END 
          ELSE 0 
        END
      ) AS total_milk_today,

      -- 4. Total milk required for tomorrow
      SUM(
        CASE 
          WHEN mr.will_get_tomorrow = 1 THEN 
            CASE 
              WHEN mr.extra_tomorrow > 0 THEN mr.extra_tomorrow 
              ELSE c.daily_milk_needed 
            END 
          ELSE 0 
        END
      ) AS total_milk_tomorrow

    FROM employees e
    JOIN area a ON a.id = e.area_id
    JOIN customer c ON c.area_id = a.id AND c.status = 'active'
    LEFT JOIN milkreport mr ON mr.phone = c.phone AND mr.area_id = a.id

    GROUP BY a.id;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching milk report:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.json({ success: true, data: results });
  });
});





app.listen(3000, '0.0.0.0', () => {
    console.log("Server running on port 3000");
});
 