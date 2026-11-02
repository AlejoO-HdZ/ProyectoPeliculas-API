/**
 * ==============================================================================
 * ARCHIVO: director.routes.js
 * MÓDULO: Director (Routes)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Define los endpoints HTTP para el módulo de Director.
 * ==============================================================================
 */

const { Router } = require('express');
const {
    createDirector,
    getDirectors,
    getDirectorById,
    updateDirector,
    deleteDirector
} = require('../controllers/director.controller');

const router = Router();

router.post('/', createDirector);
router.get('/', getDirectors);
router.get('/:id', getDirectorById);
router.put('/:id', updateDirector);
router.delete('/:id', deleteDirector);

module.exports = router;