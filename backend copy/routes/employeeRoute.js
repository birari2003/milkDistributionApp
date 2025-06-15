import express from 'express';
const router = express.Router();
import db from '../database/db.js';
import bcrypt from 'bcrypt';


router.post('/api/add-employee', async (req, res) => {
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



router.get('/api/employees', (req, res) => {
  const query = `
    SELECT e.id, e.name, e.address, e.contact, a.landmark AS area_name 
    FROM employees e 
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
 


export default router;