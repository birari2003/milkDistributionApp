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
    employee_assigned,
    daily_milk_needed,
    milk_category,
    delivery_time,
    gender
  } = req.body;

  if (!name || !phone || !password || !address || !area_id || !employee_assigned || !milk_category || !delivery_time || !gender) {
    return res.status(400).json({ success: false, message: 'All required fields must be filled' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      `INSERT INTO customer 
      (name, phone, password, address, area_id, employee_assigned, daily_milk_needed, status, milk_category, delivery_time, gender) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)`,
      [
        name,
        phone,
        hashedPassword,
        address,
        area_id,
        employee_assigned,
        daily_milk_needed || 0,
        milk_category,
        delivery_time,
        gender
      ]
    );

    res.json({ success: true, message: 'Customer added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});




router.get('/api/customers', (req, res) => {
  const { area_id, employee_id } = req.query;

  let query = `
    SELECT c.id, c.name, c.phone, c.address, c.delivery_time,
           a.landmark AS area_name,
           e.name AS employee_name
    FROM customer c
    JOIN area a ON c.area_id = a.id
    JOIN employees e ON a.id = e.area_id
    WHERE c.status = 'active'
  `;
  const params = [];

  if (area_id) {
    query += ' AND c.area_id = ?';
    params.push(area_id);
  } else if (employee_id) {
    query += ' AND e.id = ?';
    params.push(employee_id);
  }

  db.query(query, params, (err, results) => {
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

  console.log('Incoming PUT request:', { id, name, phone, daily_milk_needed, milk_category, });

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

// API to fetch today's assigned milk for a customer
router.post('/api/customer-today-milk', (req, res) => {
  const { customer_id } = req.body;
  if (!customer_id) {
    return res.status(400).json({ success: false, message: "Customer ID is required" });
  }

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const sql = `
    SELECT 
      got_cow_milk_today, 
      got_buffalo_milk_today, 
      got_cow_milk_extra_today, 
      got_buffalo_milk_extra_today,  
      created_at 
    FROM daily_report_updated 
    WHERE customer_id = ? AND DATE(created_at) = ?
    ORDER BY created_at DESC 
    LIMIT 1
  `;

  db.query(sql, [customer_id, today], (err, results) => {
    if (err) {
      console.error("Customer milk fetch error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length === 0) {
      return res.json({ success: true, cow: 0, buffalo: 0, extra: 0 });
    }

    const row = results[0];
    const cow = Number(row.got_cow_milk_today) || 0;
    const buffalo = Number(row.got_buffalo_milk_today) || 0;
    const extra = Number(row.extra_today) || 0;

    res.json({
      success: true,
      cow,
      buffalo,
      extra,
      total: cow + buffalo
    });
  });
});


// API Endpoint: /api/customer-monthly-milk-summary
router.post('/api/customer-monthly-milk-summary', (req, res) => {
  const { customer_id, year, month } = req.body;

  if (!customer_id || !year || !month) {
    return res.status(400).json({ success: false, message: 'customer_id, year, and month are required' });
  }

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const sql = `
    SELECT 
  DATE_FORMAT(created_at, '%Y-%m-%d') AS date,
  SUM(got_cow_milk_today) AS cow,
  SUM(got_buffalo_milk_today) AS buffalo,
  SUM(got_cow_milk_extra_today) AS extra,
  SUM(got_buffalo_milk_extra_today) AS extra
FROM daily_report_updated
WHERE customer_id = ? 
  AND DATE(created_at) BETWEEN ? AND ?
GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
ORDER BY DATE(created_at)
  `;

  db.query(sql, [customer_id, startDate, endDate], (err, results) => {
    if (err) {
      console.error("Monthly milk summary error:", err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    const daily = {};
    let totalCow = 0;
    let totalBuffalo = 0;
    let totalExtra = 0;

    results.forEach(row => {
      const date = row.date;
      const cow = parseFloat(row.cow) || 0;
      const buffalo = parseFloat(row.buffalo) || 0;
      const extra = parseFloat(row.extra) || 0;

      daily[date] = {
        cow,
        buffalo,
        extra,
        total: cow + buffalo + extra
      };

      totalCow += cow;
      totalBuffalo += buffalo;
      totalExtra += extra;
    });


    res.json({
      success: true,
      daily,
      totals: {
        cow: totalCow,
        buffalo: totalBuffalo,
        grand: totalCow + totalBuffalo + totalExtra
      }
    });
  });
});





export default router;
