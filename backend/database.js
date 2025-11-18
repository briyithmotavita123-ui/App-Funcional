// database.js
// Configuración de la conexión a MongoDB con Mongoose

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno desde .env

// Función para conectarse a MongoDB
const connectDB = async () => {
  try {
    // Intentar la conexión a MongoDB usando la URI del .env
    await mongoose.connect(process.env.MONGODB_URI);

    // Mensaje de éxito si la conexión fue exitosa
    console.log(`✅ Conectado a MongoDB: ${process.env.MONGODB_URI}`);
  } catch (error) {
    // Mensaje de error detallado si falla la conexión
    console.error('❌ Error de conexión a MongoDB:', error.message);

    // Terminar el proceso si la conexión falla
    process.exit(1);
  }
};

// Eventos de Mongoose para monitoreo
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose: Conexión abierta');
});

mongoose.connection.on('error', (err) => {
  console.error('⚠️ Mongoose: Error de conexión', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ Mongoose: Conexión cerrada');
});

// Capturar Ctrl+C o cierre del proceso para desconectar correctamente
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🚪 Mongoose: Conexión cerrada por terminación de la app');
  process.exit(0);
});

// Exportar la función para usar en index.js o server.js
export default connectDB;
