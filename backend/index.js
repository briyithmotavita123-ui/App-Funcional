/**
 * index.js
 * Punto de entrada del servidor backend.
 *
 * - Carga variables de entorno (.env)
 * - Conecta con MongoDB (database.js)
 * - Configura middlewares globales
 * - Monta rutas por recurso (auth, users, products, services)
 * - Lanza el servidor en el puerto indicado
 */

require('dotenv').config(); // Carga variables de entorno desde .env

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Importa la función de conexión a MongoDB
const connectDB = require('./database');

// Rutas
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const productsRoutes = require('./routes/products.routes');
const servicesRoutes = require('./routes/services.routes');

const app = express();

// Puerto (toma de .env o fallback a 3000)
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB (se detiene el proceso si falla)
connectDB();

// Middlewares globales
app.use(morgan('dev'));                // Logs legibles en consola (dev)
app.use(express.json({ limit: '10mb' })); // Parseo JSON con límite de carga
app.use(express.urlencoded({ extended: true }));

// Configurar CORS para permitir solo el frontend autorizado
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:4200';
app.use(cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// Rutas base
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/services', servicesRoutes);

// Ruta base para comprobar que el servidor está vivo
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Backend app_web funcionando',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('ERROR GLOBAL:', err);
    res.status(500).json({ error: 'Error interno del servidor', details: err.message });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
    console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
    console.log(`CORS origin: ${allowedOrigin}`);
});
