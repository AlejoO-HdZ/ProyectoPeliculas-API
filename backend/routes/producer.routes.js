/**
 * ==============================================================================
 * ARCHIVO: producer.routes.js
 * MÓDULO: Productora (Routes)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Define los endpoints HTTP para el módulo de Productora.
 * ==============================================================================
 */

const { Router } = require('express');
const {
    createProducer,
    getProducers,
    getProducerById,
    updateProducer,
    deleteProducer
} = require('../controllers/producer.controller');

const router = Router();

router.post('/', createProducer);
router.get('/', getProducers);
router.get('/:id', getProducerById);
router.put('/:id', updateProducer);
router.delete('/:id', deleteProducer);

module.exports = router;