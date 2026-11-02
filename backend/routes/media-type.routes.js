/**
 * ==============================================================================
 * ARCHIVO: media-type.routes.js
 * MÓDULO: Tipo de Multimedia (Routes)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Define los endpoints HTTP para el módulo de Tipos de Multimedia.
 * ==============================================================================
 */

const { Router } = require('express');
const {
    createMediaType,
    getMediaTypes,
    getMediaTypeById,
    updateMediaType,
    deleteMediaType
} = require('../controllers/media-type.controller');

const router = Router();

router.post('/', createMediaType);
router.get('/', getMediaTypes);
router.get('/:id', getMediaTypeById);
router.put('/:id', updateMediaType);
router.delete('/:id', deleteMediaType);

module.exports = router;