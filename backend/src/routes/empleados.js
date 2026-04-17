const express = require('express');
const pool    = require('../db');
const auth    = require('../middleware/auth');
const router  = express.Router();

// GET /api/empleados
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT e.*,
              COUNT(v.id)               AS total_ventas,
              COALESCE(SUM(v.total), 0) AS ingresos_generados
       FROM empleados e
       LEFT JOIN ventas v ON v.empleado_id = e.id AND v.estado = 'completada'
       GROUP BY e.id
       ORDER BY e.apellido, e.nombre`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/empleados/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT e.*,
              COUNT(v.id)               AS total_ventas,
              COALESCE(SUM(v.total), 0) AS ingresos_generados
       FROM empleados e
       LEFT JOIN ventas v ON v.empleado_id = e.id AND v.estado = 'completada'
       WHERE e.id = $1
       GROUP BY e.id`,
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/empleados
router.post('/', auth, async (req, res) => {
  const { nombre, apellido, cargo, telefono, email, salario } = req.body;
  if (!nombre || !apellido || !cargo || !salario)
    return res.status(400).json({ error: 'Nombre, apellido, cargo y salario son obligatorios' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO empleados (nombre, apellido, cargo, telefono, email, salario)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [nombre, apellido, cargo, telefono, email, salario]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505')
      return res.status(400).json({ error: 'Ya existe un empleado con ese email' });
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/empleados/:id
router.put('/:id', auth, async (req, res) => {
  const { nombre, apellido, cargo, telefono, email, salario, activo } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE empleados SET
         nombre   = COALESCE($1, nombre),
         apellido = COALESCE($2, apellido),
         cargo    = COALESCE($3, cargo),
         telefono = COALESCE($4, telefono),
         email    = COALESCE($5, email),
         salario  = COALESCE($6, salario),
         activo   = COALESCE($7, activo)
       WHERE id = $8 RETURNING *`,
      [nombre, apellido, cargo, telefono, email, salario, activo, req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/empleados/:id (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE empleados SET activo = FALSE WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json({ message: 'Empleado desactivado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;