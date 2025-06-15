import express from 'express';
const router = express.Router();
import db from '../database/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 


router.post('/api/login', async (req, res) => {
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


export default router;