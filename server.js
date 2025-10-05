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
    const { rows } = await pool.query('SELECT id, name, type FROM rooms ORDER BY id ASC');
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ error: 'rooms_query_failed' });
  }
});

// Teachers
app.get('/api/teachers', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, hourly_rate, can_teach_art FROM teachers ORDER BY id DESC');
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ error: 'teachers_query_failed' });
  }
});

// Students
app.get('/api/students', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, parent_name, phone FROM students ORDER BY id DESC');
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ error: 'students_query_failed' });
  }
});

// Lessons
app.get('/api/lessons', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, student_id, teacher_id, room_id, subject, starts_at, ends_at, price
      FROM lessons ORDER BY starts_at DESC
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
      SELECT id, teacher_id, amount, paid_at, note
      FROM payments ORDER BY paid_at DESC
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
      SELECT l.id, l.starts_at, l.ends_at, l.subject,
             s.name AS student_name, t.name AS teacher_name, r.name AS room_name
      FROM lessons l
      LEFT JOIN students s ON s.id = l.student_id
      LEFT JOIN teachers t ON t.id = l.teacher_id
      LEFT JOIN rooms r ON r.id = l.room_id
      ORDER BY l.starts_at DESC
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
      SELECT t.id AS teacher_id, t.name AS teacher_name,
             DATE_TRUNC('month', l.starts_at) AS month,
             COALESCE(SUM(l.price), 0) AS revenue
      FROM teachers t
      LEFT JOIN lessons l ON l.teacher_id = t.id
      GROUP BY t.id, t.name, DATE_TRUNC('month', l.starts_at)
      ORDER BY month DESC, teacher_name ASC
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
