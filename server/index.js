const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/classrooms', require('./routes/classrooms'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/students', require('./routes/students'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/schedule', require('./routes/schedule'));

// Reports route (simple version)
app.get('/api/reports', async (req, res) => {
  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    const { rows } = await pool.query(`
      SELECT t.id AS teacher_id, t.first_name, t.last_name,
             p.month, p.year,
             COALESCE(SUM(p.amount), 0) AS revenue
      FROM teachers t
      LEFT JOIN payments p ON p.teacher_id = t.id AND p.status = 'paid'
      GROUP BY t.id, t.first_name, t.last_name, p.month, p.year
      ORDER BY p.year DESC, p.month DESC, t.first_name ASC
    `);
    
    await pool.end();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Raporlar getirilemedi' });
  }
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Bir hata oluştu!' });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});