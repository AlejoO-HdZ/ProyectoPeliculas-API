/**
 * ==============================================================================
 * ARCHIVO: genre.routes.js
 * MÓDULO: Género (Routes)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Define los endpoints HTTP para el módulo de Género.
 * - POST /api/genres -> Crear género
 * - GET /api/genres -> Listar géneros
 * - GET /api/genres/:id -> Obtener género por ID
 * - PUT /api/genres/:id -> Actualizar género
 * - DELETE /api/genres/:id -> Eliminar género
 * ==============================================================================
 */

const { Router } = require('express');
const {
    createGenre,
    getGenres,
    getGenreById,
    updateGenre,
    deleteGenre
} = require('../controllers/genre.controller');

const router = Router();

router.post('/', createGenre);
router.get('/', getGenres);
router.get('/:id', getGenreById);
router.put('/:id', updateGenre);
router.delete('/:id', deleteGenre);

module.exports = router;