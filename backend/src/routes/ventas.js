const express = require('express');
const pool    = require('../db');
const auth    = require('../middleware/auth');
const router  = express.Router();

// GET /api/ventas — usa la VIEW v_ventas_resumen
router.get('/', auth, async (req, res) => {
  try {
    const { desde, hasta, estado, empleado_id, cliente_id } = req.query;
    let query = 'SELECT * FROM v_ventas_resumen WHERE 1=1';
    const params = [];

    if (desde) {
      params.push(desde);
      query += ` AND fecha >= $${params.length}`;
    }
    if (hasta) {
      params.push(hasta);
      query += ` AND fecha <= $${params.length}`;
    }
    if (estado) {
      params.push(estado);
      query += ` AND estado = $${params.length}`;
    }
    query += ' ORDER BY fecha DESC';

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/ventas/:id — detalle completo con líneas
router.get('/:id', auth, async (req, res) => {
  try {
    // JOIN múltiple 1: venta + cliente + empleado
    const ventaQ = await pool.query(
      `SELECT v.*,
              CONCAT(c.nombre, ' ', c.apellido) AS cliente,
              c.email                            AS cliente_email,
              CONCAT(e.nombre, ' ', e.apellido) AS empleado,
              e.cargo                            AS empleado_cargo
       FROM  ventas v
       JOIN  clientes  c ON c.id = v.cliente_id
       JOIN  empleados e ON e.id = v.empleado_id
       WHERE v.id = $1`,
      [req.params.id]
    );
    if (ventaQ.rows.length === 0)
      return res.status(404).json({ error: 'Venta no encontrada' });

    // JOIN múltiple 2: detalle + producto + categoría
    const detalleQ = await pool.query(
      `SELECT dv.*,
              p.nombre       AS producto,
              p.descripcion  AS producto_descripcion,
              cat.nombre     AS categoria
       FROM  detalle_ventas dv
       JOIN  productos  p   ON p.id   = dv.producto_id
       JOIN  categorias cat ON cat.id = p.categoria_id
       WHERE dv.venta_id = $1
       ORDER BY dv.id`,
      [req.params.id]
    );

    res.json({ ...ventaQ.rows[0], lineas: detalleQ.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ventas — transacción explícita con ROLLBACK
router.post('/', auth, async (req, res) => {
  const { cliente_id, empleado_id, lineas, notas } = req.body;

  if (!cliente_id || !empleado_id || !lineas || lineas.length === 0)
    return res.status(400).json({ error: 'cliente_id, empleado_id y lineas son obligatorios' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Verificar stock suficiente para cada producto
    for (const linea of lineas) {
      const stockQ = await client.query(
        'SELECT stock, nombre FROM productos WHERE id = $1 AND activo = TRUE',
        [linea.producto_id]
      );
      if (stockQ.rows.length === 0)
        throw new Error(`Producto ID ${linea.producto_id} no encontrado o inactivo`);
      if (stockQ.rows[0].stock < linea.cantidad)
        throw new Error(`Stock insuficiente para "${stockQ.rows[0].nombre}". Disponible: ${stockQ.rows[0].stock}`);
    }

    // 2. Crear cabecera de venta
    const ventaQ = await client.query(
      `INSERT INTO ventas (cliente_id, empleado_id, notas)
       VALUES ($1, $2, $3) RETURNING id`,
      [cliente_id, empleado_id, notas]
    );
    const venta_id = ventaQ.rows[0].id;

    // 3. Insertar líneas (el trigger descuenta el stock automáticamente)
    let subtotal = 0;
    for (const linea of lineas) {
      const precioQ = await client.query(
        'SELECT precio_venta FROM productos WHERE id = $1',
        [linea.producto_id]
      );
      const precio = parseFloat(precioQ.rows[0].precio_venta);
      const lineaSubtotal = precio * linea.cantidad;
      subtotal += lineaSubtotal;

      await client.query(
        `INSERT INTO detalle_ventas
           (venta_id, producto_id, cantidad, precio_unitario, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [venta_id, linea.producto_id, linea.cantidad, precio, lineaSubtotal]
      );
    }

    // 4. Actualizar totales con IVA 12%
    const impuesto = Math.round(subtotal * 0.12 * 100) / 100;
    const total    = Math.round((subtotal + impuesto) * 100) / 100;

    await client.query(
      'UPDATE ventas SET subtotal=$1, impuesto=$2, total=$3 WHERE id=$4',
      [subtotal, impuesto, total, venta_id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Venta registrada correctamente',
      venta_id,
      subtotal,
      impuesto,
      total
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

// PUT /api/ventas/:id/anular — anula una venta (restaura stock via trigger)
router.put('/:id/anular', auth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const ventaQ = await client.query(
      'SELECT * FROM ventas WHERE id = $1',
      [req.params.id]
    );
    if (ventaQ.rows.length === 0)
      throw new Error('Venta no encontrada');
    if (ventaQ.rows[0].estado === 'anulada')
      throw new Error('La venta ya está anulada');

    // El trigger trg_restaurar_stock restaura el stock automáticamente
    await client.query(
      "UPDATE ventas SET estado = 'anulada' WHERE id = $1",
      [req.params.id]
    );

    await client.query('COMMIT');
    res.json({ message: 'Venta anulada correctamente' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;