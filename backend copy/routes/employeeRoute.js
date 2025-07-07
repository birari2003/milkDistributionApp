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
// GET assigned employees for today
router.get('/api/assigned-employees', (req, res) => {
  const today = new Date().toISOString().slice(0, 10); // format: YYYY-MM-DD

  const query = `
    SELECT employee_id 
    FROM assign_milk 
    WHERE DATE(assigned_at) = ?
  `;

  db.query(query, [today], (err, results) => {
    if (err) {
      console.error("Error fetching assigned employees:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    const assignedIds = results.map(row => row.employee_id);
    res.json({ success: true, assigned: assignedIds });
  });
});

// Assuming you already have db = mysql.createConnection(...)
router.post('/api/update-employee', async (req, res) => {
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

  // Hash password only if provided
  if (password && password.trim() !== '') {
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hashing here
      fields.push('password = ?');
      values.push(hashedPassword);
    } catch (err) {
      console.error('Password hash error:', err);
      return res.status(500).json({ success: false, message: 'Error hashing password' });
    }
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


// GET dynamic report of customers for an employee
router.get('/api/employee-customers-report', async (req, res) => {
  const employeeId = req.query.emp_id; // employee_assigned passed as query

  if (!employeeId) {
    return res.status(400).json({ success: false, message: "emp_id is required" });
  }

  const today = new Date().toISOString().slice(0, 10);

  const sql = `
    SELECT c.id AS customer_id, c.name, c.phone,
           dr.got_cow_milk_today, dr.got_buffalo_milk_today
    FROM customer c
    LEFT JOIN daily_report_updated dr
      ON c.id = dr.customer_id AND DATE(dr.created_at) = ?
    WHERE c.employee_assigned = ? AND c.status = 'active'
  `;

  db.query(sql, [today, employeeId], (err, results) => {
    if (err) {
      console.error("Error fetching report:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    const assigned = [];
    const notTaken = [];

    results.forEach(row => {
      const cow = row.got_cow_milk_today || 0;
      const buffalo = row.got_buffalo_milk_today || 0;

      if (cow > 0 || buffalo > 0) {
        assigned.push({
          id: row.customer_id,
          name: row.name,
          phone: row.phone,
          cowMilk: cow,
          buffaloMilk: buffalo
        });
      } else {
        notTaken.push({
          id: row.customer_id,
          name: row.name,
          phone: row.phone
        });
      }
    });

    res.json({
      success: true,
      assignedCustomers: assigned,
      notTakenCustomers: notTaken
    });
  });
});


// GET milk leftover for employee today
router.get('/api/employee-milk-leftover', (req, res) => {
  const employeeId = req.query.emp_id;
  if (!employeeId) {
    return res.status(400).json({ success: false, message: "emp_id is required" });
  }

  const today = new Date().toISOString().slice(0, 10);

  // 1. Get assigned milk
  const assignedSql = `
    SELECT
      IFNULL(SUM(cow_milk + extra_cow_milk), 0) AS assignedCow,
      IFNULL(SUM(buffalo_milk + extra_buffalo_milk), 0) AS assignedBuffalo
    FROM assign_milk
    WHERE employee_id = ? AND DATE(assigned_at) = ?
  `;

  // 2. Get distributed milk
  const distributedSql = `
    SELECT
      IFNULL(SUM(got_cow_milk_today + got_cow_milk_extra_today), 0) AS distributedCow,
      IFNULL(SUM(got_buffalo_milk_today + got_buffalo_milk_extra_today), 0) AS distributedBuffalo
    FROM daily_report_updated
    WHERE assigned_employee_id = ? AND DATE(created_at) = ?
  `;

  db.query(assignedSql, [employeeId, today], (err1, assignedResult) => {
    if (err1) {
      console.error("DB ERROR (assigned):", err1);
      return res.status(500).json({ success: false, message: "DB error in assigned milk" });
    }

    db.query(distributedSql, [employeeId, today], (err2, distResult) => {
      if (err2) {
        console.error("DB ERROR (distributed):", err2);
        return res.status(500).json({ success: false, message: "DB error in distributed milk" });
      }

      const a = assignedResult[0];
      const d = distResult[0];

      const cowLeft = a.assignedCow - d.distributedCow;
      const buffaloLeft = a.assignedBuffalo - d.distributedBuffalo;

      res.json({
        success: true,
        cowLeft,
        buffaloLeft,
        details: {
          assigned: { cow: a.assignedCow, buffalo: a.assignedBuffalo },
          distributed: { cow: d.distributedCow, buffalo: d.distributedBuffalo },
        }
      });
    });
  });
});



// POST /api/return-milk
router.post('/api/return-milk', (req, res) => {
  const { employee_id, returned_cow_milk, returned_buffalo_milk } = req.body;

  if (!employee_id) {
    return res.status(400).json({ success: false, message: "employee_id is required" });
  }

  const today = new Date().toISOString().slice(0, 10);

  const sql = `
    INSERT INTO return_milk (employee_id, return_date, returned_cow_milk, returned_buffalo_milk)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [employee_id, today, returned_cow_milk || 0, returned_buffalo_milk || 0], (err, result) => {
    if (err) {
      console.error("DB INSERT ERROR:", err);
      return res.status(500).json({ success: false, message: "DB insert error" });
    }

    return res.json({ success: true, message: "Milk return recorded successfully" });
  });
});






export default router;