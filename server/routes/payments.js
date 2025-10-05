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

// Tüm ödemeleri getir
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, 
             t.first_name as teacher_first_name,
             t.last_name as teacher_last_name
      FROM payments p
      JOIN teachers t ON p.teacher_id = t.id
      ORDER BY p.year DESC, p.month DESC, p.payment_date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ödemeler getirilemedi' });
  }
});

// Belirli bir ayın ödemelerini getir
router.get('/month/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    const result = await pool.query(`
      SELECT p.*, 
             t.first_name as teacher_first_name,
             t.last_name as teacher_last_name
      FROM payments p
      JOIN teachers t ON p.teacher_id = t.id
      WHERE p.year = $1 AND p.month = $2
      ORDER BY p.payment_date DESC
    `, [year, month]);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Aylık ödemeler getirilemedi' });
  }
});

// Öğretmenin ödemelerini getir
router.get('/teacher/:teacher_id', async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const result = await pool.query(`
      SELECT p.*, 
             t.first_name as teacher_first_name,
             t.last_name as teacher_last_name
      FROM payments p
      JOIN teachers t ON p.teacher_id = t.id
      WHERE p.teacher_id = $1
      ORDER BY p.year DESC, p.month DESC, p.payment_date DESC
    `, [teacher_id]);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Öğretmen ödemeleri getirilemedi' });
  }
});

// Yeni ödeme oluştur
router.post('/', async (req, res) => {
  try {
    const { teacher_id, amount, payment_date, month, year, status, notes } = req.body;
    
    const result = await pool.query(
      'INSERT INTO payments (teacher_id, amount, payment_date, month, year, status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [teacher_id, amount, payment_date, month, year, status, notes]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ödeme oluşturulamadı' });
  }
});

// Ödeme güncelle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, payment_date, month, year, status, notes } = req.body;
    
    const result = await pool.query(
      'UPDATE payments SET amount = $1, payment_date = $2, month = $3, year = $4, status = $5, notes = $6 WHERE id = $7 RETURNING *',
      [amount, payment_date, month, year, status, notes, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ödeme bulunamadı' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ödeme güncellenemedi' });
  }
});

// Ödeme sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM payments WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ödeme bulunamadı' });
    }
    
    res.json({ message: 'Ödeme silindi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ödeme silinemedi' });
  }
});

// Aylık kazanç raporu oluştur
router.post('/generate-monthly', async (req, res) => {
  try {
    const { year, month } = req.body;
    
    // Öğretmenlerin o ayki kazançlarını hesapla
    const earningsResult = await pool.query(`
      SELECT 
        l.teacher_id,
        t.first_name,
        t.last_name,
        l.id as lesson_id,
        l.lesson_type,
        l.instrument,
        l.hourly_rate,
        COUNT(s.id) as lesson_count,
        l.hourly_rate * COUNT(s.id) as total_amount
      FROM lessons l
      JOIN teachers t ON l.teacher_id = t.id
      LEFT JOIN schedule s ON l.id = s.lesson_id
        AND EXTRACT(YEAR FROM s.start_date) = $1
        AND EXTRACT(MONTH FROM s.start_date) = $2
      WHERE l.is_active = true
      GROUP BY l.teacher_id, t.first_name, t.last_name, l.id, l.lesson_type, l.instrument, l.hourly_rate
      HAVING COUNT(s.id) > 0
    `, [year, month]);
    
    // Her öğretmen için ödeme kaydı oluştur
    const payments = [];
    const teacherTotals = {};
    
    // Öğretmenlerin toplam kazançlarını hesapla
    earningsResult.rows.forEach(row => {
      if (!teacherTotals[row.teacher_id]) {
        teacherTotals[row.teacher_id] = {
          teacher_id: row.teacher_id,
          first_name: row.first_name,
          last_name: row.last_name,
          total_amount: 0,
          lessons: []
        };
      }
      teacherTotals[row.teacher_id].total_amount += parseFloat(row.total_amount);
      teacherTotals[row.teacher_id].lessons.push(row);
    });
    
    // Her öğretmen için ödeme kaydı oluştur
    for (const teacherId in teacherTotals) {
      const teacher = teacherTotals[teacherId];
      
      if (teacher.total_amount > 0) {
        const paymentResult = await pool.query(
          'INSERT INTO payments (teacher_id, amount, payment_date, month, year, status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [teacherId, teacher.total_amount, new Date(), month, year, 'pending', `Otomatik oluşturulan ${month}/${year} ödemesi`]
        );
        
        payments.push(paymentResult.rows[0]);
      }
    }
    
    res.json({
      message: `${month}/${year} için ${payments.length} ödeme kaydı oluşturuldu`,
      payments: payments,
      total_teachers: Object.keys(teacherTotals).length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Aylık rapor oluşturulamadı' });
  }
});

module.exports = router;