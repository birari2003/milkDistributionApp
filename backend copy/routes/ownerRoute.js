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


// POST: /api/assign-milk
router.post('/api/assign-milk', async (req, res) => {
  const {
    id,
    cow_milk,
    buffalo_milk,
    extra_cow_milk,
    extra_buffalo_milk
  } = req.body;

  if (
    !id ||
    cow_milk == null ||
    buffalo_milk == null ||
    extra_cow_milk == null ||
    extra_buffalo_milk == null
  ) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    await db.execute(
      `UPDATE employees SET 
        cow_milk = ?, 
        buffalo_milk = ?, 
        extra_cow_milk = ?, 
        extra_buffalo_milk = ?, 
        assigned_date = CURDATE() 
      WHERE id = ?`,
      [cow_milk, buffalo_milk, extra_cow_milk, extra_buffalo_milk, id]
    );

    res.json({ success: true, message: 'Milk assigned successfully.' });
  } catch (err) {
    console.error('Assign milk error:', err);
    res.status(500).json({ success: false, message: 'Database error.' });
  }
});


export default router;