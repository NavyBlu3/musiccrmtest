const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Tüm öğretmenleri getir
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, 
             COUNT(l.id) as active_lessons,
             COALESCE(SUM(p.amount), 0) as total_earnings
      FROM teachers t
      LEFT JOIN lessons l ON t.id = l.teacher_id AND l.is_active = true
      LEFT JOIN payments p ON t.id = p.teacher_id AND p.status = 'paid'
      WHERE t.is_active = true
      GROUP BY t.id
      ORDER BY t.first_name, t.last_name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Öğretmenler getirilemedi' });
  }
});

// ID'ye göre öğretmen getir
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT t.*, 
             COUNT(l.id) as active_lessons,
             COALESCE(SUM(p.amount), 0) as total_earnings
      FROM teachers t
      LEFT JOIN lessons l ON t.id = l.teacher_id AND l.is_active = true
      LEFT JOIN payments p ON t.id = p.teacher_id AND p.status = 'paid'
      WHERE t.id = $1
      GROUP BY t.id
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Öğretmen bulunamadı' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Öğretmen getirilemedi' });
  }
});

// Yeni öğretmen oluştur
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, hourly_rate, instruments, can_teach_art } = req.body;
    
    const result = await pool.query(
      'INSERT INTO teachers (first_name, last_name, email, phone, hourly_rate, instruments, can_teach_art) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [first_name, last_name, email, phone, hourly_rate, instruments, can_teach_art]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Öğretmen oluşturulamadı' });
  }
});

// Öğretmen güncelle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, hourly_rate, instruments, can_teach_art, is_active } = req.body;
    
    const result = await pool.query(
      'UPDATE teachers SET first_name = $1, last_name = $2, email = $3, phone = $4, hourly_rate = $5, instruments = $6, can_teach_art = $7, is_active = $8 WHERE id = $9 RETURNING *',
      [first_name, last_name, email, phone, hourly_rate, instruments, can_teach_art, is_active, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Öğretmen bulunamadı' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Öğretmen güncellenemedi' });
  }
});

// Öğretmenin aylık kazancını hesapla
router.get('/:id/earnings/:year/:month', async (req, res) => {
  try {
    const { id, year, month } = req.params;
    
    const result = await pool.query(`
      SELECT 
        l.id as lesson_id,
        l.lesson_type,
        l.instrument,
        l.hourly_rate,
        COUNT(s.id) as lesson_count,
        l.hourly_rate * COUNT(s.id) as total_amount
      FROM lessons l
      LEFT JOIN schedule s ON l.id = s.lesson_id
      WHERE l.teacher_id = $1 
        AND l.is_active = true
        AND EXTRACT(YEAR FROM s.start_date) = $2
        AND EXTRACT(MONTH FROM s.start_date) = $3
      GROUP BY l.id, l.lesson_type, l.instrument, l.hourly_rate
    `, [id, year, month]);
    
    const totalEarnings = result.rows.reduce((sum, row) => sum + parseFloat(row.total_amount), 0);
    
    res.json({
      teacher_id: id,
      year: parseInt(year),
      month: parseInt(month),
      lessons: result.rows,
      total_earnings: totalEarnings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Kazanç hesaplanamadı' });
  }
});

module.exports = router;