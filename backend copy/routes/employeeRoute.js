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
    SELECT e.id, e.name, e.address, e.contact, e.status, a.landmark AS area_name, e.area_id
    FROM employees e 
    JOIN area a ON e.area_id = a.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching employees:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    res.json({ success: true, employees: results });
  });
});

 
// Assuming you already have db = mysql.createConnection(...)
router.post('/api/update-employee', (req, res) => {
  const { id, name, contact, address, password, area_id, status } = req.body;

  if (!id || !name || !contact || !address || !area_id || !status) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const fields = [];
  const values = [];

  fields.push('name = ?');
  values.push(name);

  fields.push('contact = ?');
  values.push(contact);

  fields.push('address = ?');
  values.push(address);

  if (password && password.trim() !== '') {
    fields.push('password = ?');
    values.push(password);
  }

  fields.push('area_id = ?');
  values.push(area_id);

  fields.push('status = ?');
  values.push(status);

  values.push(id);

  const query = `UPDATE employees SET ${fields.join(', ')} WHERE id = ?`;

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating employee:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.json({ success: true, message: 'Employee updated successfully' });
  });
});


export default router;