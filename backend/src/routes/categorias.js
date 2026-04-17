const express = require('express');
const pool    = require('../db');
const auth    = require('../middleware/auth');
const router  = express.Router();

// GET /api/categorias
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.*, COUNT(p.id) AS total_productos
       FROM categorias c
       LEFT JOIN productos p ON p.categoria_id = c.id AND p.activo = TRUE
       GROUP BY c.id
       ORDER BY c.nombre`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/categorias/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM categorias WHERE id = $1',
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/categorias
router.post('/', auth, async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre)
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [nombre, descripcion]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505')
      return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/categorias/:id
router.put('/:id', auth, async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE categorias SET
         nombre      = COALESCE($1, nombre),
         descripcion = COALESCE($2, descripcion)
       WHERE id = $3 RETURNING *`,
      [nombre, descripcion, req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/categorias/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const check = await pool.query(
      'SELECT COUNT(*) FROM productos WHERE categoria_id = $1 AND activo = TRUE',
      [req.params.id]
    );
    if (parseInt(check.rows[0].count) > 0)
      return res.status(400).json({ error: 'No se puede eliminar: tiene productos activos asociados' });

    await pool.query('DELETE FROM categorias WHERE id = $1', [req.params.id]);
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;