/**
 * ==============================================================================
 * ARCHIVO: media-type.controller.js
 * MÓDULO: Tipo de Multimedia (Controller)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Lógica de negocio para gestionar los tipos de contenido multimedia (ej. Serie, Película).
 * Controlador CRUD completo para Tipos de Media. Gestiona creación, listado, 
 * Permite registrar, listar, consultar por ID, actualizar y eliminar tipos.
  * ==============================================================================
 */

const MediaType = require('../models/media-type.model');

// 1. Crear tipo de media
const createMediaType = async (req, res) => {
    try {
        let { name, description } = req.body;
        
        if (name) {
            name = name.trim();
            name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        }

        const newMediaType = new MediaType({ name, description });
        const savedMediaType = await newMediaType.save();

        return res.status(201).json({
            status: 'success',
            message: 'Tipo de multimedia creado exitosamente',
            data: savedMediaType
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error al crear el tipo de multimedia (es posible que ya exista)',
            error: error.message
        });
    }
};

// 2. Listar tipos de media
const getMediaTypes = async (req, res) => {
    try {
        const mediaTypes = await MediaType.find();
        return res.status(200).json({
            status: 'success',
            count: mediaTypes.length,
            data: mediaTypes
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al consultar los tipos de multimedia',
            error: error.message
        });
    }
};

// 3. Obtener tipo por ID (GET por ID)
const getMediaTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const mediaType = await MediaType.findById(id);

        if (!mediaType) {
            return res.status(404).json({
                status: 'error',
                message: 'Tipo de multimedia no encontrado'
            });
        }

        return res.status(200).json({
            status: 'success',
            data: mediaType
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'ID de tipo inválido o malformado',
            error: error.message
        });
    }
};

// 4. Actualizar tipo (PUT)
const updateMediaType = async (req, res) => {
    try {
        const { id } = req.params;
        let updatedData = req.body;

        if (updatedData.name) {
            updatedData.name = updatedData.name.trim();
            updatedData.name = updatedData.name.charAt(0).toUpperCase() + updatedData.name.slice(1).toLowerCase();
        }

        const mediaType = await MediaType.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

        if (!mediaType) {
            return res.status(404).json({
                status: 'error',
                message: 'Tipo de multimedia no encontrado para actualizar'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Tipo de multimedia actualizado exitosamente',
            data: mediaType
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error al actualizar el tipo de multimedia',
            error: error.message
        });
    }
};

// 5. Eliminar tipo (DELETE)
const deleteMediaType = async (req, res) => {
    try {
        const { id } = req.params;
        const mediaType = await MediaType.findByIdAndDelete(id);

        if (!mediaType) {
            return res.status(404).json({
                status: 'error',
                message: 'Tipo de multimedia no encontrado para eliminar'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Tipo de multimedia eliminado exitosamente'
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'ID inválido o error al eliminar el tipo de multimedia',
            error: error.message
        });
    }
};

module.exports = {
    createMediaType,
    getMediaTypes,
    getMediaTypeById,
    updateMediaType,
    deleteMediaType
};