/**
 * ===========================================================================
 * ARCHIVO: app.js
 * DESCRIPCIÓN:
 * Configuración principal de Express. Registra middlewares globales y monta
 * todas las rutas de la API bajo el prefijo '/api'.
 * ===========================================================================
 */

const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json()); // Permite interpretar cuerpos de solicitudes en JSON

// Ruta raíz de bienvenida
app.get('/', (req, res) => {
    return res.status(200).json({
        status: 'success',
        message: '¡Bienvenido a la API REST de Películas - EA1!',
        database: 'db_peliculas',
        endpoints: {
            genres: '/api/genres',
            directors: '/api/directors',
            producers: '/api/producers',
            mediaTypes: '/api/media-types',
            media: '/api/media'
        }
    });
});

// Importación de Rutas de los módulos
const genreRoutes = require('./routes/genre.routes');
const directorRoutes = require('./routes/director.routes');
const producerRoutes = require('./routes/producer.routes');
const mediaTypeRoutes = require('./routes/media-type.routes');
const mediaRoutes = require('./routes/media.routes');

// Montaje de Rutas en la aplicación con el prefijo '/api'
app.use('/api/genres', genreRoutes);
app.use('/api/directors', directorRoutes);
app.use('/api/producers', producerRoutes);
app.use('/api/media-types', mediaTypeRoutes);
app.use('/api/media', mediaRoutes);

module.exports = app;