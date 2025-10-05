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

// Tüm öğrencileri getir
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, 
             COUNT(l.id) as active_lessons,
             STRING_AGG(DISTINCT l.lesson_type, ', ') as lesson_types,
             STRING_AGG(DISTINCT l.instrument, ', ') as instruments
      FROM students s
      LEFT JOIN lessons l ON s.id = l.student_id AND l.is_active = true
      WHERE s.is_active = true
      GROUP BY s.id
      ORDER BY s.first_name, s.last_name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Öğrenciler getirilemedi' });
  }
});

// ID'ye göre öğrenci getir
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT s.*, 
             COUNT(l.id) as active_lessons,
             STRING_AGG(DISTINCT l.lesson_type, ', ') as lesson_types,
             STRING_AGG(DISTINCT l.instrument, ', ') as instruments
      FROM students s
      LEFT JOIN lessons l ON s.id = l.student_id AND l.is_active = true
      WHERE s.id = $1
      GROUP BY s.id
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Öğrenci bulunamadı' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Öğrenci getirilemedi' });
  }
});

// Yeni öğrenci oluştur
router.post('/', async (req, res) => {
  try {
    const { 
      first_name, 
      last_name, 
      email, 
      phone, 
      birth_date, 
      parent_name, 
      parent_phone, 
      address 
    } = req.body;
    
    const result = await pool.query(
      'INSERT INTO students (first_name, last_name, email, phone, birth_date, parent_name, parent_phone, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [first_name, last_name, email, phone, birth_date, parent_name, parent_phone, address]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Öğrenci oluşturulamadı' });
  }
});

// Öğrenci güncelle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      first_name, 
      last_name, 
      email, 
      phone, 
      birth_date, 
      parent_name, 
      parent_phone, 
      address, 
      is_active 
    } = req.body;
    
    const result = await pool.query(
      'UPDATE students SET first_name = $1, last_name = $2, email = $3, phone = $4, birth_date = $5, parent_name = $6, parent_phone = $7, address = $8, is_active = $9 WHERE id = $10 RETURNING *',
      [first_name, last_name, email, phone, birth_date, parent_name, parent_phone, address, is_active, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Öğrenci bulunamadı' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Öğrenci güncellenemedi' });
  }
});

// Öğrencinin derslerini getir
router.get('/:id/lessons', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT l.*, 
             t.first_name as teacher_first_name,
             t.last_name as teacher_last_name,
             c.name as classroom_name,
             c.type as classroom_type
      FROM lessons l
      JOIN teachers t ON l.teacher_id = t.id
      JOIN classrooms c ON l.classroom_id = c.id
      WHERE l.student_id = $1 AND l.is_active = true
      ORDER BY l.created_at DESC
    `, [id]);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Dersler getirilemedi' });
  }
});

module.exports = router;