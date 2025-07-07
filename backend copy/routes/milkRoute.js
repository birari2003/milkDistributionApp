import express from 'express';
const router = express.Router();
import db from '../database/db.js';

router.post('/api/add-area', (req, res) => {
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


router.get('/api/areas', (req, res) => {
  db.query('SELECT id, landmark FROM area', (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'DB error' });
    res.json({ success: true, areas: results });
  });
});



// Express route for POST /api/add-daily-report
router.post('/api/add-daily-report', (req, res) => {
  const {
    customer_id,
    got_cow_milk_today,
    got_buffalo_milk_today,
    will_get_cow_milk_tomorrow,
    will_get_buffalo_milk_tomorrow,
    extra_today,
    extra_tomorrow,
    assigned_employee_id,
    override = false, // optional flag to allow edit
  } = req.body;

  if (!customer_id || !assigned_employee_id) {
    return res.status(400).json({ success: false, message: 'Customer ID and Employee ID are required' });
  }

  const today = new Date().toISOString().slice(0, 10);

  const checkQuery = `
    SELECT id FROM daily_report
    WHERE customer_id = ? AND DATE(created_at) = ?
  `;

  db.query(checkQuery, [customer_id, today], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Check query error:', checkErr);
      return res.status(500).json({ success: false, message: 'Database error during check' });
    }

    if (checkResults.length > 0) {
      if (!override) {
        return res.status(409).json({ success: false, message: 'Report already submitted for today', alreadySubmitted: true });
      }

      // Update existing record
      const updateQuery = `
        UPDATE daily_report SET
          got_cow_milk_today = ?,
          got_buffalo_milk_today = ?,
          will_get_cow_milk_tomorrow = ?,
          will_get_buffalo_milk_tomorrow = ?,
          extra_today = ?,
          extra_tomorrow = ?,
          assigned_employee_id = ?
        WHERE id = ?
      `; 
      const values = [
        !!got_cow_milk_today,
        !!got_buffalo_milk_today,
        !!will_get_cow_milk_tomorrow,
        !!will_get_buffalo_milk_tomorrow,
        parseFloat(extra_today || 0),
        parseFloat(extra_tomorrow || 0),
        assigned_employee_id,
        checkResults[0].id
      ];

      return db.query(updateQuery, values, (updateErr) => {
        if (updateErr) {
          console.error('Update error:', updateErr);
          return res.status(500).json({ success: false, message: 'DB update failed' });
        }

        return res.json({ success: true, message: 'Report updated successfully' });
      });
    }

    // Insert new entry
    const insertQuery = `
      INSERT INTO daily_report (
        customer_id,
        got_cow_milk_today,
        got_buffalo_milk_today,
        will_get_cow_milk_tomorrow,
        will_get_buffalo_milk_tomorrow,
        extra_today,
        extra_tomorrow,
        assigned_employee_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      customer_id,
      !!got_cow_milk_today,
      !!got_buffalo_milk_today,
      !!will_get_cow_milk_tomorrow,
      !!will_get_buffalo_milk_tomorrow,
      parseFloat(extra_today || 0),
      parseFloat(extra_tomorrow || 0),
      assigned_employee_id,
    ];

    db.query(insertQuery, values, (insertErr) => {
      if (insertErr) {
        console.error('Insert error:', insertErr);
        return res.status(500).json({ success: false, message: 'DB insert failed' });
      }

      res.json({ success: true, message: 'Report added successfully' });
    });
  });
});
// This checks if report exists for today and customer_id
router.get('/api/check-daily-report', (req, res) => {
  const { customer_id } = req.query;

  if (!customer_id) {
    return res.status(400).json({ success: false, message: 'Customer ID required' });
  }

  const today = new Date().toISOString().slice(0, 10);

  const sql = `SELECT id FROM daily_report WHERE customer_id = ? AND DATE(created_at) = ?`;

  db.query(sql, [customer_id, today], (err, results) => {
    if (err) {
      console.error('Check error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length > 0) {
      return res.json({ success: true, exists: true });
    } else {
      return res.json({ success: true, exists: false });
    }
  });
});




router.post('/api/add-daily-report-updated', (req, res) => {
  const {
    customer_id,
    got_cow_milk_today = 0,
    got_buffalo_milk_today = 0,
    got_cow_milk_extra_today = 0,
    got_buffalo_milk_extra_today = 0,
    payment_type,
    amount_paid = 0,
    amount_remain = 0,
    assigned_employee_id,
  } = req.body;

  if (!customer_id || !payment_type || !assigned_employee_id) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Step 1: Get current milk prices
  const priceQuery = `SELECT cow_milk_price, buffalo_milk_price FROM milk_prices WHERE flag = 1 LIMIT 1`;
  db.query(priceQuery, (err, priceResult) => {
    if (err || !priceResult.length) {
      console.error('Milk price fetch error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch milk prices' });
    }

    const cowRate = parseFloat(priceResult[0].cow_milk_price || 0);
    const buffaloRate = parseFloat(priceResult[0].buffalo_milk_price || 0);

    // Step 2: Calculate total liters per type
    const total_cow_litre = parseFloat(got_cow_milk_today) + parseFloat(got_cow_milk_extra_today);
    const total_buffalo_litre = parseFloat(got_buffalo_milk_today) + parseFloat(got_buffalo_milk_extra_today);

    // Step 3: Calculate total cost per type (not rate)
    const cow_milk_price = total_cow_litre * cowRate;
    const buffalo_milk_price = total_buffalo_litre * buffaloRate;
    const total_milk_price = cow_milk_price + buffalo_milk_price;

    // Step 4: Insert
    const insertSQL = `
      INSERT INTO daily_report_updated (
        customer_id,
        got_cow_milk_today,
        got_buffalo_milk_today,
        got_cow_milk_extra_today,
        got_buffalo_milk_extra_today,
        payment_type,
        amount_paid,
        amount_remain,
        assigned_employee_id,
        cow_milk_price,
        buffalo_milk_price,
        total_milk_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      customer_id,
      got_cow_milk_today,
      got_buffalo_milk_today,
      got_cow_milk_extra_today,
      got_buffalo_milk_extra_today,
      payment_type,
      amount_paid,
      amount_remain,
      assigned_employee_id,
      cow_milk_price,
      buffalo_milk_price,
      total_milk_price,
    ];

    db.query(insertSQL, values, (err, result) => {
      if (err) {
        console.error('Insert error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      res.json({ success: true, message: 'Report added successfully with calculated prices' });
    });
  });
});




router.get('/api/owner-employee-milk-distribution', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);

  const sql = `
    SELECT 
      e.id AS employee_id,
      e.name,
      e.contact AS phone,
      IFNULL(SUM(dr.got_cow_milk_today), 0) AS cow,
      IFNULL(SUM(dr.got_buffalo_milk_today), 0) AS buffalo
    FROM employees e
    LEFT JOIN daily_report dr 
      ON e.id = dr.assigned_employee_id AND DATE(dr.created_at) = ?
    WHERE e.status = 'active'
    GROUP BY e.id, e.name, e.contact
  `;

  db.query(sql, [today], (err, results) => {
    if (err) {
      console.error('Distribution summary error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    const employees = results.map(row => ({
      employee_id: row.employee_id,
      name: row.name,
      phone: row.phone,
      cow: row.cow || 0,
      buffalo: row.buffalo || 0,
    }));

    res.json({ success: true, employees });
  });
});


router.post('/api/update-milk-price', (req, res) => {
  const { cow_milk_price, buffalo_milk_price } = req.body;

  if (cow_milk_price == null || buffalo_milk_price == null) {
    return res.status(400).json({ success: false, message: "Both prices are required" });
  }

  const resetFlags = `UPDATE milk_prices SET flag = 0`;
  const insertPrice = `
    INSERT INTO milk_prices (cow_milk_price, buffalo_milk_price, flag)
    VALUES (?, ?, 1)
  `;

  db.query(resetFlags, (err1) => {
    if (err1) {
      console.error('Reset flag error:', err1);
      return res.status(500).json({ success: false, message: 'Failed to reset flags' });
    }

    db.query(insertPrice, [cow_milk_price, buffalo_milk_price], (err2, result) => {
      if (err2) {
        console.error('Milk price insert error:', err2);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      res.json({ success: true, message: 'Prices updated successfully' });
    });
  });
});
router.get('/api/get-latest-milk-price', (req, res) => {
  const latestSql = `SELECT * FROM milk_prices WHERE flag = 1 ORDER BY updated_at DESC LIMIT 1`;
  const previousSql = `SELECT * FROM milk_prices WHERE flag = 0 ORDER BY updated_at DESC LIMIT 1`;

  db.query(latestSql, (err1, latestRows) => {
    if (err1) {
      console.error('Fetch latest milk price error:', err1);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    db.query(previousSql, (err2, prevRows) => {
      if (err2) {
        console.error('Fetch previous milk price error:', err2);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      const latest = latestRows[0] || null;
      const previous = prevRows[0] || null;

      res.json({ success: true, latest, previous });
    });
  });
});





router.get('/api/milk-summary', (req, res) => {
  const mainSql = `
    SELECT
      SUM(CASE WHEN got_today_cow = 1 THEN
        CASE WHEN extra_today > 0 THEN extra_today ELSE c.daily_milk_needed END
      ELSE 0 END) AS total_cow_today,

      SUM(CASE WHEN got_today_buffalo = 1 THEN
        CASE WHEN extra_today > 0 THEN extra_today ELSE c.daily_milk_needed END
      ELSE 0 END) AS total_buffalo_today,

      SUM(CASE WHEN will_get_tomorrow_cow = 1 THEN
        CASE WHEN extra_tomorrow > 0 THEN extra_tomorrow ELSE c.daily_milk_needed END
      ELSE 0 END) AS total_cow_tomorrow,

      SUM(CASE WHEN will_get_tomorrow_buffalo = 1 THEN
        CASE WHEN extra_tomorrow > 0 THEN extra_tomorrow ELSE c.daily_milk_needed END
      ELSE 0 END) AS total_buffalo_tomorrow,

      SUM(e.assigned_milk_today) AS total_assigned_today,

      SUM(e.assigned_milk_today) - 
      (
        SUM(CASE WHEN got_today_cow = 1 THEN
          CASE WHEN extra_today > 0 THEN extra_today ELSE c.daily_milk_needed END
        ELSE 0 END) +
        SUM(CASE WHEN got_today_buffalo = 1 THEN
          CASE WHEN extra_today > 0 THEN extra_today ELSE c.daily_milk_needed END
        ELSE 0 END)
      ) AS total_returned_today
    FROM milkreport mr
    JOIN customer c ON mr.phone = c.phone
    JOIN employees e ON c.area_id = e.area_id
    WHERE DATE(mr.created_at) = CURDATE();
  `;

  const employeeSql = `
    SELECT 
      e.id, e.name, e.contact, e.area_id, a.area_name AS area_name,
      e.assigned_milk_today, e.cow_milk, e.buffalo_milk,
      e.extra_cow_milk, e.extra_buffalo_milk, e.assigned_date,

      -- Total milk distributed by this employee today
      (
        SELECT SUM(
          CASE 
            WHEN got_today_cow = 1 THEN 
              CASE WHEN extra_today > 0 THEN extra_today ELSE c.daily_milk_needed END 
            ELSE 0 
          END +
          CASE 
            WHEN got_today_buffalo = 1 THEN 
              CASE WHEN extra_today > 0 THEN extra_today ELSE c.daily_milk_needed END 
            ELSE 0 
          END
        )
        FROM milkreport mr
        JOIN customer c ON mr.phone = c.phone
        WHERE DATE(mr.created_at) = CURDATE()
        AND c.area_id = e.area_id
      ) AS milk_distributed_today,

      (
        e.assigned_milk_today - 
        (
          SELECT SUM(
            CASE 
              WHEN got_today_cow = 1 THEN 
                CASE WHEN extra_today > 0 THEN extra_today ELSE c.daily_milk_needed END 
              ELSE 0 
            END +
            CASE 
              WHEN got_today_buffalo = 1 THEN 
                CASE WHEN extra_today > 0 THEN extra_today ELSE c.daily_milk_needed END 
              ELSE 0 
            END
          )
          FROM milkreport mr
          JOIN customer c ON mr.phone = c.phone
          WHERE DATE(mr.created_at) = CURDATE()
          AND c.area_id = e.area_id
        )
      ) AS milk_returned_today
    FROM employees e
    JOIN area a ON e.area_id = a.id
    WHERE DATE(e.assigned_date) = CURDATE();
  `;

  db.query(mainSql, (err, summaryResult) => {
    if (err) {
      console.error('Milk Summary Error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    db.query(employeeSql, (err, employeeResult) => {
      if (err) {
        console.error('Employee Summary Error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      // Group employees by area_id
      const regionMap = {};
      let totalReturnedCow = 0;
      let totalReturnedBuffalo = 0;

      for (const emp of employeeResult) {
        const areaId = emp.area_id;
        if (!regionMap[areaId]) {
          regionMap[areaId] = {
            name: emp.area_name,
            cow: 0,
            buffalo: 0,
            returnedCow: 0,
            returnedBuffalo: 0,
            employees: [],
          };
        }

        regionMap[areaId].cow += emp.cow_milk || 0;
        regionMap[areaId].buffalo += emp.buffalo_milk || 0;
        regionMap[areaId].returnedCow += emp.extra_cow_milk || 0;
        regionMap[areaId].returnedBuffalo += emp.extra_buffalo_milk || 0;

        totalReturnedCow += emp.extra_cow_milk || 0;
        totalReturnedBuffalo += emp.extra_buffalo_milk || 0;

        regionMap[areaId].employees.push({
          name: emp.name,
          phone: emp.phone,
          cow: emp.cow_milk || 0,
          buffalo: emp.buffalo_milk || 0,
          returnedCow: emp.extra_cow_milk || 0,
          returnedBuffalo: emp.extra_buffalo_milk || 0,
        });
      }

      const regionArray = Object.values(regionMap);

      res.json({
        success: true,
        data: {
          ...summaryResult[0],
          employee_count_today: employeeResult.length,
          employees: employeeResult,
          region_wise: regionArray,
          returned: {
            cow: totalReturnedCow,
            buffalo: totalReturnedBuffalo
          }
        },
      });
    });
  });
});




router.get('/api/area-wise-report', (req, res) => {
  const sql = `
    SELECT
      a.landmark AS area_name,
      e.name AS employee_name,
      e.id AS employee_id, 
      
      -- Assigned
      e.assigned_milk_today,

      -- Distributed Today
      SUM(CASE WHEN got_today_cow = 1 THEN
        CASE WHEN extra_today > 0 THEN extra_today ELSE c.daily_milk_needed END
      ELSE 0 END) AS distributed_cow_today,

      SUM(CASE WHEN got_today_buffalo = 1 THEN
        CASE WHEN extra_today > 0 THEN extra_today ELSE c.daily_milk_needed END
      ELSE 0 END) AS distributed_buffalo_today,

      SUM(CASE WHEN got_today_cow = 1 OR got_today_buffalo = 1 THEN
        CASE WHEN extra_today > 0 THEN extra_today ELSE c.daily_milk_needed END
      ELSE 0 END) AS total_distributed_today,

      -- Returned
      e.assigned_milk_today -
      SUM(CASE WHEN got_today_cow = 1 OR got_today_buffalo = 1 THEN
        CASE WHEN extra_today > 0 THEN extra_today ELSE c.daily_milk_needed END
      ELSE 0 END) AS returned_milk_today,

      -- Customer Counts
      COUNT(DISTINCT CASE WHEN got_today_cow = 1 THEN c.id END) AS cow_customers_today,
      COUNT(DISTINCT CASE WHEN got_today_buffalo = 1 THEN c.id END) AS buffalo_customers_today,

      -- Tomorrow's Need
      SUM(CASE WHEN will_get_tomorrow_cow = 1 THEN
        CASE WHEN extra_tomorrow > 0 THEN extra_tomorrow ELSE c.daily_milk_needed END
      ELSE 0 END) AS cow_tomorrow,

      SUM(CASE WHEN will_get_tomorrow_buffalo = 1 THEN
        CASE WHEN extra_tomorrow > 0 THEN extra_tomorrow ELSE c.daily_milk_needed END
      ELSE 0 END) AS buffalo_tomorrow

    FROM daily_report mr
    JOIN customer c ON mr.phone = c.phone
    JOIN area a ON mr.area_id = a.id
    JOIN employees e ON a.id = e.area_id
    WHERE DATE(mr.created_at) = CURDATE()
    GROUP BY a.id;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Area-wise Report Error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    res.json({ success: true, data: results });
  });
});



export default router;
