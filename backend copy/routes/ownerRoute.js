import express from 'express';
const router = express.Router();
import db from '../database/db.js';
import bcrypt from 'bcrypt';


// Signup API
router.post('/api/owner/signup', async (req, res) => {
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


router.post('/api/assign-milk', (req, res) => {
  const { id, cow_milk, buffalo_milk, extra_cow_milk, extra_buffalo_milk } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: "Employee ID is required" });
  }

  const query = `
    INSERT INTO assign_milk 
      (employee_id, cow_milk, buffalo_milk, extra_cow_milk, extra_buffalo_milk) 
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      cow_milk = VALUES(cow_milk), 
      buffalo_milk = VALUES(buffalo_milk),
      extra_cow_milk = VALUES(extra_cow_milk),
      extra_buffalo_milk = VALUES(extra_buffalo_milk),
      assigned_at = CURRENT_TIMESTAMP
  `;

  const values = [id, cow_milk, buffalo_milk, extra_cow_milk, extra_buffalo_milk];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error assigning milk:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true, message: "Milk assigned successfully" });
  });
});
// in routes file (e.g., index.js or milk.js)
router.post('/api/employee-milk-summary', (req, res) => {
  const { employee_id } = req.body;

  if (!employee_id) {
    return res.status(400).json({ success: false, message: 'Employee ID is required' });
  }

  const query = `
    SELECT 
      cow_milk, 
      buffalo_milk, 
      extra_cow_milk, 
      extra_buffalo_milk 
    FROM assign_milk 
    WHERE employee_id = ? 
      AND DATE(assigned_at) = CURDATE()
  `;

  db.query(query, [employee_id], (err, results) => {
    if (err) {
      console.error('Error fetching assigned milk:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length === 0) {
      return res.json({ success: true, cow: 0, buffalo: 0, total: 0 });
    }

    const milk = results[0];
    const cow = (milk.cow_milk || 0) + (milk.extra_cow_milk || 0);
    const buffalo = (milk.buffalo_milk || 0) + (milk.extra_buffalo_milk || 0);
    const total = cow + buffalo;

    res.json({ success: true, cow, buffalo, total });
  });
});

router.get('/api/employee-milk-summary-dash', (req, res) => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const query = `
    SELECT 
      e.id AS employee_id,
      e.name AS employee_name,
      e.contact AS employee_phone,
      IFNULL(SUM(dr.got_cow_milk_today + dr.extra_today * (c.milk_category = 'cow')), 0) AS total_cow_milk,
      IFNULL(SUM(dr.got_buffalo_milk_today + dr.extra_today * (c.milk_category = 'buffalo')), 0) AS total_buffalo_milk
    FROM employees e
    LEFT JOIN daily_report dr ON e.id = dr.assigned_employee_id AND DATE(dr.created_at) = ?
    LEFT JOIN customer c ON dr.customer_id = c.id
    GROUP BY e.id
  `;

  db.query(query, [today], (err, results) => {
    if (err) {
      console.error('Error fetching employee milk summary:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    res.json({ success: true, data: results });
  });
});


// GET /api/return-milk-summary
router.get('/api/return-milk-summary', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);

  const sql = `
    SELECT 
      SUM(returned_cow_milk) AS returned_cow_milk,
      SUM(returned_buffalo_milk) AS returned_buffalo_milk
    FROM return_milk
    WHERE return_date = ?
  `;

  db.query(sql, [today], (err, results) => {
    if (err) {
      console.error("Return milk summary error:", err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    const row = results[0] || {};
    const cow = Number(row.returned_cow_milk) || 0;
    const buffalo = Number(row.returned_buffalo_milk) || 0;

    res.json({
      success: true,
      returned_cow_milk: cow,
      returned_buffalo_milk: buffalo,
      total: cow + buffalo,
    });
  });
});


router.get('/api/employee-milk-need-tomorrow', (req, res) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate()); // still "today", since we check will_get_*_tomorrow
  const todayStr = tomorrow.toISOString().slice(0, 10);

  const sql = `
    SELECT 
      dr.customer_id,
      dr.assigned_employee_id,
      dr.will_get_cow_milk_tomorrow,
      dr.will_get_buffalo_milk_tomorrow,
      dr.extra_tomorrow,
      c.milk_category,
      c.daily_milk_needed
    FROM daily_report dr
    JOIN customer c ON dr.customer_id = c.id
    WHERE DATE(dr.created_at) = ?
  `;

  db.query(sql, [todayStr], (err, results) => {
    if (err) {
      console.error("Milk need calculation error:", err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    const employeeMilkMap = {};
    results.forEach(row => {
  console.log('Row:', row);  // 👈 log everything for this row

  const empId = row.assigned_employee_id;
  const milkType = row.milk_category;
  const extraTomorrow = parseFloat(row.extra_tomorrow || 0);
  const dailyNeed = parseFloat(row.daily_milk_needed || 0);

  if (!employeeMilkMap[empId]) {
    employeeMilkMap[empId] = {
      employee_id: empId,
      estimated_cow_milk: 0,
      estimated_buffalo_milk: 0
    };
  }

  if (row.will_get_cow_milk_tomorrow == 1) {
    console.log(`Adding ${extraTomorrow || dailyNeed} cow milk for emp ${empId}`);
    employeeMilkMap[empId].estimated_cow_milk += extraTomorrow > 0 ? extraTomorrow : dailyNeed;
  }

  if (row.will_get_buffalo_milk_tomorrow == 1) {
    console.log(`Adding ${extraTomorrow || dailyNeed} buffalo milk for emp ${empId}`);
    employeeMilkMap[empId].estimated_buffalo_milk += extraTomorrow > 0 ? extraTomorrow : dailyNeed;
  }
});


    const result = Object.values(employeeMilkMap);
    res.json({ success: true, data: result });
  });
});



// In your backend (Node.js + Express + MySQL)
router.get('/api/owner-dashboard-summary', (req, res) => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const sql = `
    SELECT 
      dr.customer_id,
      dr.got_cow_milk_today,
      dr.got_buffalo_milk_today,
      dr.got_cow_milk_extra_today,
      dr.got_buffalo_milk_extra_today
    FROM daily_report_updated dr
    WHERE DATE(dr.created_at) = ?
  `;

  db.query(sql, [today], (err, results) => {
    if (err) {
      console.error("Dashboard summary error:", err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    let total_cow_milk = 0;
    let total_buffalo_milk = 0;

    results.forEach(row => {
      total_cow_milk += Number(row.got_cow_milk_today || 0);
      total_cow_milk += Number(row.got_cow_milk_extra_today || 0);

      total_buffalo_milk += Number(row.got_buffalo_milk_today || 0);
      total_buffalo_milk += Number(row.got_buffalo_milk_extra_today || 0);
    });

    res.json({
      success: true,
      total_cow_milk,
      total_buffalo_milk,
      total: total_cow_milk + total_buffalo_milk,
    });
  });
});






router.post('/api/customer-payment-summary', (req, res) => {
  const { customer_id, year, month } = req.body;

  if (!customer_id || !year || !month) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

  const sql = `
    SELECT 
      SUM(dr.total_milk_price) AS total_price,
      SUM(dr.amount_paid) AS total_paid,
      SUM(dr.amount_remain) AS total_remaining
    FROM daily_report_updated dr
    WHERE dr.customer_id = ? AND DATE(dr.created_at) BETWEEN ? AND ?
  `;

  db.query(sql, [customer_id, startDate, endDate], (err, results) => {
    if (err) {
      console.error('Payment summary error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    const row = results[0] || {};
    res.json({
      success: true,
      total_price: parseFloat(row.total_price || 0),
      total_paid: parseFloat(row.total_paid || 0),
      total_due: parseFloat(row.total_price || 0) - parseFloat(row.total_paid || 0),
    });
  });
});

router.get('/api/owner-payments-summary', (req, res) => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

  const sql = `
    SELECT
      SUM(total_milk_price) AS total_expected,
      SUM(amount_paid) AS total_paid,
      SUM(CASE WHEN payment_type = 'cash' THEN amount_paid ELSE 0 END) AS cash_paid,
      SUM(CASE WHEN payment_type = 'online' THEN amount_paid ELSE 0 END) AS online_paid
    FROM daily_report_updated
    WHERE DATE(created_at) BETWEEN ? AND ?
  `;

  db.query(sql, [startDate, endDate], (err, results) => {
    if (err) {
      console.error('Owner summary error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    const row = results[0] || {};
    const total_expected = parseFloat(row.total_expected || 0);
    const total_paid = parseFloat(row.total_paid || 0);
    const cash_paid = parseFloat(row.cash_paid || 0);
    const online_paid = parseFloat(row.online_paid || 0);
    const amount_remaining = total_expected - total_paid;

    res.json({
      success: true,
      total_expected,
      total_paid,
      cash_paid,
      online_paid,
      amount_remaining,
    });
  });
});





// GET: /api/employee-milk-today/:employeeId
router.get('/api/employee-milk-today/:employeeId', async (req, res) => {
  const { employeeId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT 
         cow_milk, 
         buffalo_milk, 
         extra_cow_milk, 
         extra_buffalo_milk 
       FROM assignmilk 
       WHERE employee_id = ? AND assigned_date = CURDATE()`,
      [employeeId]
    );

    if (rows.length === 0) {
      return res.json({ success: true, data: null });
    }

    const data = rows[0];
    const total =
      (data.cow_milk || 0) +
      (data.buffalo_milk || 0) +
      (data.extra_cow_milk || 0) +
      (data.extra_buffalo_milk || 0);

    res.json({ success: true, data: { ...data, total } });
  } catch (err) {
    console.error('Milk fetch error:', err);
    res.status(500).json({ success: false, message: 'Database error.' });
  }
});


router.post('/api/pay-salary', (req, res) => {
  const {
    employee_id,
    employee_name,
    area_id,           // previously zone
    contact,           // previously mobile
    amount,
    pay_mode,
    month,
  } = req.body;

  if (!employee_id || !employee_name || !amount || !pay_mode || !month) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const sql = `
    INSERT INTO employee_salary
    (employee_id, employee_name, area_id, contact, amount, pay_mode, month)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [employee_id, employee_name, area_id, contact, amount, pay_mode, month], (err) => {
    if (err) {
      console.error('Salary payment error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    res.json({ success: true, message: 'Salary paid successfully' });
  });
});
router.get('/api/salary-history', (req, res) => {
  const sql = `
  SELECT 
    es.id,
    es.employee_id,
    es.employee_name,
    es.amount,
    es.pay_mode,
    es.status,
    es.month,
    es.contact,
    a.area_name,
    es.created_at
  FROM employee_salary es
  LEFT JOIN area a ON es.area_id = a.id
  ORDER BY es.created_at DESC
  LIMIT 50
`;


  db.query(sql, (err, results) => {
    if (err) {
      console.error('Fetch salary history error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    res.json({ success: true, history: results });
  });
});




export default router;