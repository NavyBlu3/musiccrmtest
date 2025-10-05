const path = require('path');
const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Health
app.get('/health', (req, res) => res.status(200).send('ok'));

// DB (Neon pooled + SSL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// API (static'ten ÖNCE)

// Classrooms (çalışıyor)
app.get('/api/classrooms', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, type FROM classrooms ORDER BY id ASC');
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ error: 'classrooms_query_failed' });
  }
});

// Teachers
app.get('/api/teachers', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, first_name, last_name, hourly_rate, can_teach_art FROM teachers ORDER BY id DESC');
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ error: 'teachers_query_failed' });
  }
});

// Students
app.get('/api/students', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, first_name, last_name, parent_name, phone FROM students ORDER BY id DESC');
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ error: 'students_query_failed' });
  }
});

// Lessons
app.get('/api/lessons', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, student_id, teacher_id, classroom_id, lesson_type, instrument, hourly_rate, is_active
      FROM lessons WHERE is_active = true ORDER BY created_at DESC
    `);
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ error: 'lessons_query_failed' });
  }
});

// Payments
app.get('/api/payments', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, teacher_id, amount, payment_date, month, year, status, notes
      FROM payments ORDER BY payment_date DESC
    `);
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ error: 'payments_query_failed' });
  }
});

// Schedule (örnek: haftalık dersler)
app.get('/api/schedule', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT s.id, s.day_of_week, s.start_time, s.end_time, s.is_recurring, s.start_date, s.end_date,
             l.lesson_type, l.instrument, l.hourly_rate,
             st.first_name AS student_first_name, st.last_name AS student_last_name,
             t.first_name AS teacher_first_name, t.last_name AS teacher_last_name,
             c.name AS classroom_name, c.type AS classroom_type
      FROM schedule s
      JOIN lessons l ON s.lesson_id = l.id
      LEFT JOIN students st ON st.id = l.student_id
      LEFT JOIN teachers t ON t.id = l.teacher_id
      LEFT JOIN classrooms c ON c.id = l.classroom_id
      WHERE l.is_active = true
      ORDER BY s.day_of_week, s.start_time
    `);
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ error: 'schedule_query_failed' });
  }
});

// Reports (örnek: aylık öğretmen kazançları)
app.get('/api/reports', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT t.id AS teacher_id, t.first_name, t.last_name,
             p.month, p.year,
             COALESCE(SUM(p.amount), 0) AS revenue
      FROM teachers t
      LEFT JOIN payments p ON p.teacher_id = t.id AND p.status = 'paid'
      GROUP BY t.id, t.first_name, t.last_name, p.month, p.year
      ORDER BY p.year DESC, p.month DESC, t.first_name ASC
    `);
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ error: 'reports_query_failed' });
  }
});

// STATIC
const clientBuildPath = path.join(__dirname, 'client', 'build');
app.use(express.static(clientBuildPath));

// SPA fallback — /api dışındaki her şeyi index.html'e gönder
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
