// backend/server.js
// Punto de entrada principal del servidor backend

import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./database.js"; // Asegúrate que database.js usa export default

// Importación de rutas
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import productsRoutes from "./routes/products.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import empleadosRoutes from "./routes/empleados.routes.js"; // Importación correcta de Empleados

dotenv.config();
const app = express();

// Puerto (toma de .env o fallback a 3000)
const PORT = process.env.PORT || 3000;

// Configurar CORS
// Usando la variable de entorno del archivo .env
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3001';
app.use(cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// Middlewares globales
app.use(morgan("dev"));
app.use(express.json({ limit: '10mb' })); // Parseo JSON con límite de carga
app.use(express.urlencoded({ extended: true }));

// Conexión a Base de Datos
connectDB(); // Función de conexión a MongoDB

// Rutas base
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/empleados', empleadosRoutes); // Montamos la ruta de empleados

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
    res.status(404).json({ error: 'Endpoint no encontrado 😟' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('ERROR GLOBAL:', err);
    res.status(500).json({ error: 'Error interno del servidor 🚨', details: err.message });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
    console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
    console.log(`CORS origin: ${allowedOrigin}`);
});