require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');

const authRoutes        = require('./routes/auth');
const productosRoutes   = require('./routes/productos');
const categoriasRoutes  = require('./routes/categorias');
const proveedoresRoutes = require('./routes/proveedores');
const clientesRoutes    = require('./routes/clientes');
const empleadosRoutes   = require('./routes/empleados');
const ventasRoutes      = require('./routes/ventas');
const reportesRoutes    = require('./routes/reportes');

const app  = express();
const PORT = process.env.BACKEND_PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/auth',        authRoutes);
app.use('/api/productos',   productosRoutes);
app.use('/api/categorias',  categoriasRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/clientes',    clientesRoutes);
app.use('/api/empleados',   empleadosRoutes);
app.use('/api/ventas',      ventasRoutes);
app.use('/api/reportes',    reportesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Manejo de errores global 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor', detail: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(` Backend corriendo en http://0.0.0.0:${PORT}`);
});