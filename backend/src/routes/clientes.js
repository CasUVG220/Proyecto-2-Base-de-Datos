const express = require('express');
const pool    = require('../db');
const auth    = require('../middleware/auth');
const router  = express.Router();

// GET /api/clientes
router.get('/', auth, async (req, res) => {
  try {
    const { search } = req.query;
    let query = `
      SELECT c.*,
             COUNT(v.id)        AS total_compras,
             COALESCE(SUM(v.total), 0) AS total_gastado
      FROM clientes c
      LEFT JOIN ventas v ON v.cliente_id = c.id AND v.estado = 'completada'
      WHERE 1=1`;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (c.nombre ILIKE $${params.length}
                   OR c.apellido ILIKE $${params.length}
                   OR c.email ILIKE $${params.length})`;
    }
    query += ' GROUP BY c.id ORDER BY c.apellido, c.nombre';

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/clientes/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.*,
              COUNT(v.id)               AS total_compras,
              COALESCE(SUM(v.total), 0) AS total_gastado
       FROM clientes c
       LEFT JOIN ventas v ON v.cliente_id = c.id AND v.estado = 'completada'
       WHERE c.id = $1
       GROUP BY c.id`,
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/clientes
router.post('/', auth, async (req, res) => {
  const { nombre, apellido, email, telefono, direccion } = req.body;
  if (!nombre || !apellido)
    return res.status(400).json({ error: 'Nombre y apellido son obligatorios' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO clientes (nombre, apellido, email, telefono, direccion)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [nombre, apellido, email, telefono, direccion]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505')
      return res.status(400).json({ error: 'Ya existe un cliente con ese email' });
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/clientes/:id
router.put('/:id', auth, async (req, res) => {
  const { nombre, apellido, email, telefono, direccion, activo } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE clientes SET
         nombre    = COALESCE($1, nombre),
         apellido  = COALESCE($2, apellido),
         email     = COALESCE($3, email),
         telefono  = COALESCE($4, telefono),
         direccion = COALESCE($5, direccion),
         activo    = COALESCE($6, activo)
       WHERE id = $7 RETURNING *`,
      [nombre, apellido, email, telefono, direccion, activo, req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/clientes/:id (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE clientes SET activo = FALSE WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ message: 'Cliente desactivado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;