const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Tüm derslikleri getir
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM classrooms ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Derslikler getirilemedi' });
  }
});

// ID'ye göre derslik getir
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM classrooms WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Derslik bulunamadı' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Derslik getirilemedi' });
  }
});

// Yeni derslik oluştur
router.post('/', async (req, res) => {
  try {
    const { name, type, capacity, description } = req.body;
    
    const result = await pool.query(
      'INSERT INTO classrooms (name, type, capacity, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, type, capacity, description]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Derslik oluşturulamadı' });
  }
});

// Derslik güncelle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, capacity, description } = req.body;
    
    const result = await pool.query(
      'UPDATE classrooms SET name = $1, type = $2, capacity = $3, description = $4 WHERE id = $5 RETURNING *',
      [name, type, capacity, description, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Derslik bulunamadı' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Derslik güncellenemedi' });
  }
});

// Derslik sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM classrooms WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Derslik bulunamadı' });
    }
    
    res.json({ message: 'Derslik silindi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Derslik silinemedi' });
  }
});

module.exports = router;