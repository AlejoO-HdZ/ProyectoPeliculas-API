/**
 * =============================================================================
 * ARCHIVO: database.js
 * DESCRIPCIÓN:
 * Archivo de configuración para la conexión a la base de datos MongoDB.
 * Utilizo Mongoose para establecer la conexión usando la variable de entorno MONGODB_URI.
 * ===========================================================================
 */

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ Base de datos conectada exitosamente: ${conn.connection.name}`);
    } catch (error) {
        console.error(`❌ Error al conectar a la base de datos: ${error.message}`);
        process.exit(1); // Detiene la aplicación si la base de datos falla
    }
};

module.exports = connectDB;