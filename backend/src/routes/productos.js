const express = require('express');
const pool    = require('../db');
const auth    = require('../middleware/auth');
const router  = express.Router();

// GET /api/productos — usa la VIEW v_productos_completo
router.get('/', auth, async (req, res) => {
  try {
    const { search, categoria_id, activo } = req.query;
    let query = 'SELECT * FROM v_productos_completo WHERE 1=1';
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND nombre ILIKE $${params.length}`;
    }
    if (categoria_id) {
      params.push(categoria_id);
      query += ` AND id IN (SELECT id FROM productos WHERE categoria_id = $${params.length})`;
    }
    if (activo !== undefined) {
      params.push(activo === 'true');
      query += ` AND activo = $${params.length}`;
    }
    query += ' ORDER BY nombre';

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/productos/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM v_productos_completo WHERE id = $1',
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/productos
router.post('/', auth, async (req, res) => {
  const { categoria_id, proveedor_id, nombre, descripcion,
          precio_compra, precio_venta, stock, stock_minimo } = req.body;

  if (!categoria_id || !proveedor_id || !nombre || !precio_compra || !precio_venta)
    return res.status(400).json({ error: 'Faltan campos obligatorios' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO productos
         (categoria_id, proveedor_id, nombre, descripcion,
          precio_compra, precio_venta, stock, stock_minimo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [categoria_id, proveedor_id, nombre, descripcion,
       precio_compra, precio_venta, stock || 0, stock_minimo || 5]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/productos/:id
router.put('/:id', auth, async (req, res) => {
  const { categoria_id, proveedor_id, nombre, descripcion,
          precio_compra, precio_venta, stock, stock_minimo, activo } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE productos SET
         categoria_id   = COALESCE($1, categoria_id),
         proveedor_id   = COALESCE($2, proveedor_id),
         nombre         = COALESCE($3, nombre),
         descripcion    = COALESCE($4, descripcion),
         precio_compra  = COALESCE($5, precio_compra),
         precio_venta   = COALESCE($6, precio_venta),
         stock          = COALESCE($7, stock),
         stock_minimo   = COALESCE($8, stock_minimo),
         activo         = COALESCE($9, activo),
         actualizado_en = NOW()
       WHERE id = $10
       RETURNING *`,
      [categoria_id, proveedor_id, nombre, descripcion,
       precio_compra, precio_venta, stock, stock_minimo, activo, req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/productos/:id (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE productos SET activo = FALSE WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto desactivado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;