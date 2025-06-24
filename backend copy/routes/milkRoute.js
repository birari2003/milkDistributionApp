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

router.post('/api/milk-report', (req, res) => {
  const {
    name,
    phone,
    address,
    got_today_cow,
    got_today_buffalo,
    will_get_tomorrow_cow,
    will_get_tomorrow_buffalo,
    extra_today,
    extra_tomorrow
  } = req.body;

  if (!name || !phone || !address) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

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

    const insertQuery = `
      INSERT INTO milkreport 
        (name, phone, address, got_today_cow, got_today_buffalo, will_get_tomorrow_cow, will_get_tomorrow_buffalo, extra_today, extra_tomorrow, area_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(insertQuery, [
      name,
      phone,
      address,
      got_today_cow ? 1 : 0,
      got_today_buffalo ? 1 : 0,
      will_get_tomorrow_cow ? 1 : 0,
      will_get_tomorrow_buffalo ? 1 : 0,
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




// router.get('/api/todays-milk-report', (req, res) => {
//   const sql = `
//     SELECT 
//       e.name AS employee_name,
//       e.contact AS employee_phone,
//       a.landmark AS area_landmark,
//       a.id AS area_id,

//       -- Date fields
//       CURDATE() AS today_date,
//       CURDATE() + INTERVAL 1 DAY AS tomorrow_date,

//       -- 1. Total customers who got milk today
//       SUM(mr.got_today = 1) AS total_customers_today,

//       -- 2. Total customers who will get milk tomorrow
//       SUM(mr.will_get_tomorrow = 1) AS total_customers_tomorrow,

//       -- 3. Total milk distributed today
//       SUM(
//         CASE 
//           WHEN mr.got_today = 1 THEN 
//             CASE 
//               WHEN mr.extra_today > 0 THEN mr.extra_today 
//               ELSE c.daily_milk_needed 
//             END 
//           ELSE 0 
//         END
//       ) AS total_milk_today,

//       -- 4. Total milk required for tomorrow
//       SUM(
//         CASE 
//           WHEN mr.will_get_tomorrow = 1 THEN 
//             CASE 
//               WHEN mr.extra_tomorrow > 0 THEN mr.extra_tomorrow 
//               ELSE c.daily_milk_needed 
//             END 
//           ELSE 0 
//         END
//       ) AS total_milk_tomorrow

//     FROM employees e
//     JOIN area a ON a.id = e.area_id
//     JOIN customer c ON c.area_id = a.id AND c.status = 'active'
//     LEFT JOIN milkreport mr ON mr.phone = c.phone AND mr.area_id = a.id

//     GROUP BY a.id;
//   `;


//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching milk report:', err);
//       return res.status(500).json({ success: false, message: 'Database error' });
//     }
//     res.json({ success: true, data: results });
//   });
// });



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

    FROM milkreport mr
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
