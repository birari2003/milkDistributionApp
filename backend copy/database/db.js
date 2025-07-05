
const mysql = require('mysql2');

const db = mysql.createConnection({ 
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'milk_distribution_app'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    throw err; 
  }
  console.log('✅ MySQL Connected');
});

module.exports = db;
