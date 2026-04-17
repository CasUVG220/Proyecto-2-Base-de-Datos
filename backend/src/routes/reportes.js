const express = require('express');
const pool    = require('../db');
const auth    = require('../middleware/auth');
const router  = express.Router();

// GET /api/reportes/ventas-por-empleado
// JOIN múltiple + GROUP BY + HAVING + funciones de agregación
router.get('/ventas-por-empleado', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM v_ventas_por_empleado
       ORDER BY ingresos_totales DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reportes/productos-mas-vendidos
// CTE (WITH) visible en UI
router.get('/productos-mas-vendidos', auth, async (req, res) => {
  try {
    const { limite = 10 } = req.query;
    const { rows } = await pool.query(
      `WITH ranking_productos AS (
         SELECT *,
                RANK() OVER (ORDER BY unidades_vendidas DESC) AS ranking
         FROM v_productos_vendidos
       ),
       top_categorias AS (
         SELECT categoria,
                SUM(unidades_vendidas) AS total_unidades_categoria,
                SUM(ingresos_totales)  AS total_ingresos_categoria
         FROM v_productos_vendidos
         GROUP BY categoria
       )
       SELECT rp.*, tc.total_unidades_categoria, tc.total_ingresos_categoria
       FROM  ranking_productos rp
       JOIN  top_categorias tc ON tc.categoria = rp.categoria
       ORDER BY rp.ranking
       LIMIT $1`,
      [limite]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reportes/stock-bajo
// Subquery con EXISTS
router.get('/stock-bajo', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.id, p.nombre, p.stock, p.stock_minimo,
              c.nombre AS categoria,
              pr.nombre AS proveedor,
              pr.email  AS proveedor_email,
              (p.stock_minimo - p.stock) AS unidades_faltantes
       FROM productos p
       JOIN categorias  c  ON c.id  = p.categoria_id
       JOIN proveedores pr ON pr.id = p.proveedor_id
       WHERE EXISTS (
         SELECT 1 FROM productos p2
         WHERE p2.id = p.id
           AND p2.stock <= p2.stock_minimo
           AND p2.activo = TRUE
       )
       ORDER BY unidades_faltantes DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reportes/ventas-por-categoria
// GROUP BY + HAVING + funciones de agregación
router.get('/ventas-por-categoria', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         cat.nombre                        AS categoria,
         COUNT(DISTINCT v.id)              AS total_ventas,
         SUM(dv.cantidad)                  AS unidades_vendidas,
         SUM(dv.subtotal)                  AS ingresos_totales,
         AVG(dv.precio_unitario)           AS precio_promedio,
         MAX(dv.precio_unitario)           AS precio_maximo,
         MIN(dv.precio_unitario)           AS precio_minimo
       FROM  detalle_ventas dv
       JOIN  productos   p   ON p.id   = dv.producto_id
       JOIN  categorias  cat ON cat.id = p.categoria_id
       JOIN  ventas      v   ON v.id   = dv.venta_id
       WHERE v.estado = 'completada'
       GROUP BY cat.nombre
       HAVING SUM(dv.subtotal) > 0
       ORDER BY ingresos_totales DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reportes/clientes-top
// Subquery en FROM (tabla derivada)
router.get('/clientes-top', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         sub.cliente_id,
         sub.cliente,
         sub.total_compras,
         sub.total_gastado,
         sub.ticket_promedio,
         CASE
           WHEN sub.total_gastado >= 5000 THEN 'VIP'
           WHEN sub.total_gastado >= 2000 THEN 'Frecuente'
           ELSE 'Regular'
         END AS segmento
       FROM (
         SELECT
           c.id                              AS cliente_id,
           CONCAT(c.nombre,' ',c.apellido)   AS cliente,
           COUNT(v.id)                       AS total_compras,
           COALESCE(SUM(v.total), 0)         AS total_gastado,
           COALESCE(AVG(v.total), 0)         AS ticket_promedio
         FROM clientes c
         LEFT JOIN ventas v ON v.cliente_id = c.id
                            AND v.estado = 'completada'
         GROUP BY c.id, c.nombre, c.apellido
       ) sub
       WHERE sub.total_compras > 0
       ORDER BY sub.total_gastado DESC
       LIMIT 20`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reportes/ventas-mensuales
// CTE + GROUP BY para gráfica de tendencia
router.get('/ventas-mensuales', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `WITH meses AS (
         SELECT
           DATE_TRUNC('month', fecha)         AS mes,
           COUNT(*)                           AS total_ventas,
           SUM(total)                         AS ingresos,
           AVG(total)                         AS ticket_promedio,
           SUM(CASE WHEN estado='anulada'
                    THEN 1 ELSE 0 END)        AS ventas_anuladas
         FROM ventas
         GROUP BY DATE_TRUNC('month', fecha)
       )
       SELECT
         TO_CHAR(mes, 'YYYY-MM')  AS mes,
         total_ventas,
         ROUND(ingresos::numeric, 2)          AS ingresos,
         ROUND(ticket_promedio::numeric, 2)   AS ticket_promedio,
         ventas_anuladas
       FROM meses
       ORDER BY mes DESC
       LIMIT 12`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reportes/exportar-csv
// Exporta ventas a CSV
router.get('/exportar-csv', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         v.id,
         TO_CHAR(v.fecha, 'YYYY-MM-DD HH24:MI') AS fecha,
         CONCAT(c.nombre,' ',c.apellido)          AS cliente,
         CONCAT(e.nombre,' ',e.apellido)          AS empleado,
         v.subtotal, v.impuesto, v.total,
         v.estado
       FROM  ventas v
       JOIN  clientes  c ON c.id = v.cliente_id
       JOIN  empleados e ON e.id = v.empleado_id
       ORDER BY v.fecha DESC`
    );

    const headers = ['ID','Fecha','Cliente','Empleado','Subtotal','Impuesto','Total','Estado'];
    const csv = [
      headers.join(','),
      ...rows.map(r =>
        [r.id, r.fecha, `"${r.cliente}"`, `"${r.empleado}"`,
         r.subtotal, r.impuesto, r.total, r.estado].join(',')
      )
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="ventas.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;