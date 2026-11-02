/**
 * ==============================================================================
 * ARCHIVO: producer.controller.js
 * MÓDULO: Productora (Controller)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Lógica de negocio para el manejo de productoras cinematográficas (Disney, Warner, etc.).
 * Implementa las operaciones CRUD completas y respuestas estandarizadas.
 * Normalización de texto (primera letra en mayúscula) y códigos HTTP estandarizados.
 * ==============================================================================
  */

const Producer = require('../models/producer.model');

const createProducer = async (req, res) => {
    try {
        let { name, status, slogan, description } = req.body;
        
        if (name) {
            name = name.trim();
            name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        }

        const newProducer = new Producer({ name, status, slogan, description });
        const savedProducer = await newProducer.save();

        return res.status(201).json({
            status: 'success',
            message: 'Productora creada exitosamente',
            data: savedProducer
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error al crear la productora (es posible que ya exista)',
            error: error.message
        });
    }
};

const getProducers = async (req, res) => {
    try {
        const producers = await Producer.find();
        return res.status(200).json({
            status: 'success',
            count: producers.length,
            data: producers
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al consultar las productoras',
            error: error.message
        });
    }
};

const getProducerById = async (req, res) => {
    try {
        const { id } = req.params;
        const producer = await Producer.findById(id);

        if (!producer) {
            return res.status(404).json({
                status: 'error',
                message: 'Productora no encontrada'
            });
        }

        return res.status(200).json({
            status: 'success',
            data: producer
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'ID inválido o error en la consulta',
            error: error.message
        });
    }
};

const updateProducer = async (req, res) => {
    try {
        const { id } = req.params;
        let updatedData = req.body;

        if (updatedData.name) {
            updatedData.name = updatedData.name.trim();
            updatedData.name = updatedData.name.charAt(0).toUpperCase() + updatedData.name.slice(1).toLowerCase();
        }

        const producer = await Producer.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

        if (!producer) {
            return res.status(404).json({
                status: 'error',
                message: 'Productora no encontrada para actualizar'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Productora actualizada exitosamente',
            data: producer
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error al actualizar la productora',
            error: error.message
        });
    }
};

const deleteProducer = async (req, res) => {
    try {
        const { id } = req.params;
        const producer = await Producer.findByIdAndDelete(id);

        if (!producer) {
            return res.status(404).json({
                status: 'error',
                message: 'Productora no encontrada para eliminar'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Productora eliminada exitosamente'
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error al eliminar la productora',
            error: error.message
        });
    }
};

module.exports = {
    createProducer,
    getProducers,
    getProducerById,
    updateProducer,
    deleteProducer
};