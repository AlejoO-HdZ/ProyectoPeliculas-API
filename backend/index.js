/**
 * ==============================================================================
 * ARCHIVO: index.js
 * DESCRIPCIÓN:
 * Punto de entrada principal de la aplicación backend.
 * Carga las variables de entorno, conecta a MongoDB y arranca el servidor Express.
 * ==============================================================================
 */

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3000;

// Inicializar conexión a la base de datos y luego levantar el servidor
const startServer = async () => {
    await connectDB();
    
    app.listen(PORT, () => {
        console.log(`Servidor corriendo exitosamente en el puerto ${PORT}`);
        console.log(`Ruta base de prueba: http://localhost:${PORT}/`);
    });
};

startServer();