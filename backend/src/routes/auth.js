const express = require('express');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const pool    = require('../db');
const router  = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña requeridos' });

  try {
    const { rows } = await pool.query(
      `SELECT u.*, e.nombre, e.apellido, e.cargo
       FROM usuarios u
       LEFT JOIN empleados e ON e.id = u.empleado_id
       WHERE u.email = $1 AND u.activo = TRUE`,
      [email]
    );

    if (rows.length === 0)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    // Actualizar ultimo_login
    await pool.query(
      'UPDATE usuarios SET ultimo_login = NOW() WHERE id = $1',
      [user.id]
    );

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
      token,
      user: {
        id:       user.id,
        email:    user.email,
        rol:      user.rol,
        nombre:   user.nombre,
        apellido: user.apellido,
        cargo:    user.cargo,
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor', detail: err.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Sesión cerrada correctamente' });
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.email, u.rol, u.ultimo_login,
              e.nombre, e.apellido, e.cargo
       FROM usuarios u
       LEFT JOIN empleados e ON e.id = u.empleado_id
       WHERE u.id = $1`,
      [req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;