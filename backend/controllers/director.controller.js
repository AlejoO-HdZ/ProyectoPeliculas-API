/**
 * ==============================================================================
 * ARCHIVO: director.controller.js
 * MÓDULO: Director (Controller)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Lógica de negocio para gestionar los directores principales de las producciones.
 * Permite registrar, consultar, actualizar y eliminar directores con control estricto de estados.
  * Lógica CRUD para Directores con normalización y códigos HTTP estandarizados.
 * ==============================================================================
  * Controlador CRUD completo para Directores. Gestiona la creación, listado, 
 * consulta por ID, actualización y eliminación.
 * ==============================================================================
 */

const Director = require('../models/director.model');

// 1. Crear director
const createDirector = async (req, res) => {
    try {
        let { names, status } = req.body;
        
        if (names) {
            names = names.trim();
            names = names.charAt(0).toUpperCase() + names.slice(1).toLowerCase();
        }

        const newDirector = new Director({ names, status });
        const savedDirector = await newDirector.save();

        return res.status(201).json({
            status: 'success',
            message: 'Director creado exitosamente',
            data: savedDirector
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error al crear el director (es posible que ya exista)',
            error: error.message
        });
    }
};

// 2. Listar todos los directores
const getDirectors = async (req, res) => {
    try {
        const directors = await Director.find();
        return res.status(200).json({
            status: 'success',
            count: directors.length,
            data: directors
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al consultar los directores',
            error: error.message
        });
    }
};

// 3. Obtener un director por su ID (GET por ID)
const getDirectorById = async (req, res) => {
    try {
        const { id } = req.params;
        const director = await Director.findById(id);

        if (!director) {
            return res.status(404).json({
                status: 'error',
                message: 'Director no encontrado'
            });
        }

        return res.status(200).json({
            status: 'success',
            data: director
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'ID de director inválido o malformado',
            error: error.message
        });
    }
};

// 4. Actualizar un director (PUT)
const updateDirector = async (req, res) => {
    try {
        const { id } = req.params;
        let updatedData = req.body;

        if (updatedData.names) {
            updatedData.names = updatedData.names.trim();
            updatedData.names = updatedData.names.charAt(0).toUpperCase() + updatedData.names.slice(1).toLowerCase();
        }

        const director = await Director.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

        if (!director) {
            return res.status(404).json({
                status: 'error',
                message: 'Director no encontrado para actualizar'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Director actualizado exitosamente',
            data: director
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error al actualizar el director',
            error: error.message
        });
    }
};

// 5. Eliminar un director (DELETE)
const deleteDirector = async (req, res) => {
    try {
        const { id } = req.params;
        const director = await Director.findByIdAndDelete(id);

        if (!director) {
            return res.status(404).json({
                status: 'error',
                message: 'Director no encontrado para eliminar'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Director eliminado exitosamente'
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'ID inválido o error al eliminar el director',
            error: error.message
        });
    }
};

module.exports = {
    createDirector,
    getDirectors,
    getDirectorById,
    updateDirector,
    deleteDirector
};