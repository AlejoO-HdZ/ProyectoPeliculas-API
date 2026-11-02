/**
 * ==============================================================================
 * ARCHIVO: media.routes.js
 * MÓDULO: Media / Películas y Series (Routes)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Define los endpoints HTTP para el módulo principal de Películas y Series.
 * ==============================================================================
 */

const { Router } = require('express');
const {
    createMedia,
    getMedias,
    getMediaById,
    updateMedia,
    deleteMedia
} = require('../controllers/media.controller');

const router = Router();

router.post('/', createMedia);
router.get('/', getMedias);
router.get('/:id', getMediaById);
router.put('/:id', updateMedia);
router.delete('/:id', deleteMedia);

module.exports = router;