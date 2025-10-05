const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const moment = require('moment');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Tüm programı getir
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, 
             l.lesson_type,
             l.instrument,
             l.hourly_rate,
             st.first_name as student_first_name,
             st.last_name as student_last_name,
             t.first_name as teacher_first_name,
             t.last_name as teacher_last_name,
             c.name as classroom_name,
             c.type as classroom_type
      FROM schedule s
      JOIN lessons l ON s.lesson_id = l.id
      JOIN students st ON l.student_id = st.id
      JOIN teachers t ON l.teacher_id = t.id
      JOIN classrooms c ON l.classroom_id = c.id
      WHERE l.is_active = true
      ORDER BY s.day_of_week, s.start_time
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Program getirilemedi' });
  }
});

// Belirli bir tarih aralığındaki programı getir
router.get('/range', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    if (!start_date || !end_date) {
      return res.status(400).json({ message: 'Başlangıç ve bitiş tarihi gerekli' });
    }
    
    const result = await pool.query(`
      SELECT s.*, 
             l.lesson_type,
             l.instrument,
             l.hourly_rate,
             st.first_name as student_first_name,
             st.last_name as student_last_name,
             t.first_name as teacher_first_name,
             t.last_name as teacher_last_name,
             c.name as classroom_name,
             c.type as classroom_type
      FROM schedule s
      JOIN lessons l ON s.lesson_id = l.id
      JOIN students st ON l.student_id = st.id
      JOIN teachers t ON l.teacher_id = t.id
      JOIN classrooms c ON l.classroom_id = c.id
      WHERE l.is_active = true
        AND s.start_date <= $2
        AND (s.end_date IS NULL OR s.end_date >= $1)
      ORDER BY s.day_of_week, s.start_time
    `, [start_date, end_date]);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Program getirilemedi' });
  }
});

// Yeni program oluştur
router.post('/', async (req, res) => {
  try {
    const { 
      lesson_id, 
      day_of_week, 
      start_time, 
      end_time, 
      is_recurring, 
      start_date, 
      end_date 
    } = req.body;
    
    // Çakışma kontrolü
    const conflictCheck = await pool.query(`
      SELECT s.id
      FROM schedule s
      JOIN lessons l ON s.lesson_id = l.id
      WHERE l.classroom_id = (
        SELECT classroom_id FROM lessons WHERE id = $1
      )
      AND s.day_of_week = $2
      AND s.start_time < $4
      AND s.end_time > $3
      AND s.start_date <= COALESCE($6, '2099-12-31')
      AND (s.end_date IS NULL OR s.end_date >= $5)
    `, [lesson_id, day_of_week, start_time, end_time, start_date, end_date]);
    
    if (conflictCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Bu saatte derslik dolu' });
    }
    
    const result = await pool.query(
      'INSERT INTO schedule (lesson_id, day_of_week, start_time, end_time, is_recurring, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [lesson_id, day_of_week, start_time, end_time, is_recurring, start_date, end_date]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Program oluşturulamadı' });
  }
});

// Program güncelle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      day_of_week, 
      start_time, 
      end_time, 
      is_recurring, 
      start_date, 
      end_date 
    } = req.body;
    
    const result = await pool.query(
      'UPDATE schedule SET day_of_week = $1, start_time = $2, end_time = $3, is_recurring = $4, start_date = $5, end_date = $6 WHERE id = $7 RETURNING *',
      [day_of_week, start_time, end_time, is_recurring, start_date, end_date, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Program bulunamadı' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Program güncellenemedi' });
  }
});

// Program sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM schedule WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Program bulunamadı' });
    }
    
    res.json({ message: 'Program silindi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Program silinemedi' });
  }
});

// Öğretmenin programını getir
router.get('/teacher/:teacher_id', async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const { start_date, end_date } = req.query;
    
    let query = `
      SELECT s.*, 
             l.lesson_type,
             l.instrument,
             l.hourly_rate,
             st.first_name as student_first_name,
             st.last_name as student_last_name,
             c.name as classroom_name,
             c.type as classroom_type
      FROM schedule s
      JOIN lessons l ON s.lesson_id = l.id
      JOIN students st ON l.student_id = st.id
      JOIN classrooms c ON l.classroom_id = c.id
      WHERE l.teacher_id = $1 AND l.is_active = true
    `;
    
    const params = [teacher_id];
    
    if (start_date && end_date) {
      query += ` AND s.start_date <= $3 AND (s.end_date IS NULL OR s.end_date >= $2)`;
      params.push(start_date, end_date);
    }
    
    query += ` ORDER BY s.day_of_week, s.start_time`;
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Öğretmen programı getirilemedi' });
  }
});

module.exports = router;