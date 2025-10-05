const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Tüm dersleri getir
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.*, 
             s.first_name as student_first_name,
             s.last_name as student_last_name,
             t.first_name as teacher_first_name,
             t.last_name as teacher_last_name,
             c.name as classroom_name,
             c.type as classroom_type
      FROM lessons l
      JOIN students s ON l.student_id = s.id
      JOIN teachers t ON l.teacher_id = t.id
      JOIN classrooms c ON l.classroom_id = c.id
      WHERE l.is_active = true
      ORDER BY l.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Dersler getirilemedi' });
  }
});

// ID'ye göre ders getir
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT l.*, 
             s.first_name as student_first_name,
             s.last_name as student_last_name,
             t.first_name as teacher_first_name,
             t.last_name as teacher_last_name,
             c.name as classroom_name,
             c.type as classroom_type
      FROM lessons l
      JOIN students s ON l.student_id = s.id
      JOIN teachers t ON l.teacher_id = t.id
      JOIN classrooms c ON l.classroom_id = c.id
      WHERE l.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ders bulunamadı' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ders getirilemedi' });
  }
});

// Yeni ders oluştur
router.post('/', async (req, res) => {
  try {
    const { 
      student_id, 
      teacher_id, 
      classroom_id, 
      lesson_type, 
      instrument, 
      duration_minutes, 
      hourly_rate 
    } = req.body;
    
    // Derslik tipini kontrol et
    const classroomResult = await pool.query('SELECT type FROM classrooms WHERE id = $1', [classroom_id]);
    if (classroomResult.rows.length === 0) {
      return res.status(404).json({ message: 'Derslik bulunamadı' });
    }
    
    const classroomType = classroomResult.rows[0].type;
    
    // Resim dersi sadece resim sınıfında verilebilir
    if (lesson_type === 'art' && classroomType !== 'art') {
      return res.status(400).json({ message: 'Resim dersi sadece resim sınıfında verilebilir' });
    }
    
    // Enstrüman dersi resim sınıfında verilemez
    if (lesson_type === 'instrument' && classroomType === 'art') {
      return res.status(400).json({ message: 'Enstrüman dersi resim sınıfında verilemez' });
    }
    
    const result = await pool.query(
      'INSERT INTO lessons (student_id, teacher_id, classroom_id, lesson_type, instrument, duration_minutes, hourly_rate) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [student_id, teacher_id, classroom_id, lesson_type, instrument, duration_minutes, hourly_rate]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ders oluşturulamadı' });
  }
});

// Ders güncelle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      student_id, 
      teacher_id, 
      classroom_id, 
      lesson_type, 
      instrument, 
      duration_minutes, 
      hourly_rate, 
      is_active 
    } = req.body;
    
    const result = await pool.query(
      'UPDATE lessons SET student_id = $1, teacher_id = $2, classroom_id = $3, lesson_type = $4, instrument = $5, duration_minutes = $6, hourly_rate = $7, is_active = $8 WHERE id = $9 RETURNING *',
      [student_id, teacher_id, classroom_id, lesson_type, instrument, duration_minutes, hourly_rate, is_active, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ders bulunamadı' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ders güncellenemedi' });
  }
});

// Ders sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('UPDATE lessons SET is_active = false WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ders bulunamadı' });
    }
    
    res.json({ message: 'Ders pasif hale getirildi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ders silinemedi' });
  }
});

module.exports = router;