import express from 'express';
const router = express.Router();
import db from '../database/db.js';
import bcrypt from 'bcrypt';

router.post('/api/add-customer', async (req, res) => {
  const {
    name,
    phone,
    password,
    address,
    area_id,
    daily_milk_needed,
    extra_milk_if_needed,
    milk_category,
  } = req.body;

  if (!name || !phone || !password || !address || !area_id || !milk_category) {
    return res.status(400).json({ success: false, message: 'All required fields must be filled' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      'INSERT INTO customer (name, phone, password, address, area_id, daily_milk_needed, extra_milk_if_needed, milk_category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        name,
        phone,
        hashedPassword,
        address,
        area_id,
        daily_milk_needed || 0,
        extra_milk_if_needed || 0,
        milk_category,
      ]
    );

    res.json({ success: true, message: 'Customer added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});



router.get('/api/customers', (req, res) => {
  const areaId = req.query.area_id;

  if (!areaId) {
    return res.status(400).json({ success: false, message: 'area_id is required' });
  }

  const query = `
    SELECT id, name, phone, address
    FROM customer
    WHERE status = 'active' AND area_id = ?
  `;

  db.query(query, [areaId], (err, results) => {
    if (err) {
      console.error('Error fetching customers:', err);
      return res.status(500).json({ success: false, message: 'DB error' });
    }

    res.json({ success: true, customers: results });
  });
});


router.put('/api/customer/:id', (req, res) => {
  const { id } = req.params;
  const { name, phone, daily_milk_needed, milk_category } = req.body;

  console.log('Incoming PUT request:', { id, name, phone, daily_milk_needed, milk_category });

  if (!name || !phone || !daily_milk_needed) { 
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const sql = `UPDATE customer SET name = ?, phone = ?, daily_milk_needed = ?, milk_category = ? WHERE id = ?`;

  db.query(sql, [name, phone, daily_milk_needed, milk_category, id], (err, result) => {
    if (err) {
      console.error('Error updating customer:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, message: 'Customer updated successfully' });
  });
});


export default router;
