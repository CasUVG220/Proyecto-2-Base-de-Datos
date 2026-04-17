const express = require('express');
const pool    = require('../db');
const auth    = require('../middleware/auth');
const router  = express.Router();

// GET /api/proveedores
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, COUNT(pr.id) AS total_productos
       FROM proveedores p
       LEFT JOIN productos pr ON pr.proveedor_id = p.id AND pr.activo = TRUE
       GROUP BY p.id
       ORDER BY p.nombre`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/proveedores/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM proveedores WHERE id = $1',
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/proveedores
router.post('/', auth, async (req, res) => {
  const { nombre, contacto, telefono, email, direccion } = req.body;
  if (!nombre)
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO proveedores (nombre, contacto, telefono, email, direccion)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [nombre, contacto, telefono, email, direccion]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/proveedores/:id
router.put('/:id', auth, async (req, res) => {
  const { nombre, contacto, telefono, email, direccion, activo } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE proveedores SET
         nombre    = COALESCE($1, nombre),
         contacto  = COALESCE($2, contacto),
         telefono  = COALESCE($3, telefono),
         email     = COALESCE($4, email),
         direccion = COALESCE($5, direccion),
         activo    = COALESCE($6, activo)
       WHERE id = $7 RETURNING *`,
      [nombre, contacto, telefono, email, direccion, activo, req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/proveedores/:id (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE proveedores SET activo = FALSE WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json({ message: 'Proveedor desactivado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;