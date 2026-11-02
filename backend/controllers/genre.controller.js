/**
 * ==============================================================================
 * ARCHIVO: genre.controller.js
 * MÓDULO: Género (Controller)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Contiene la lógica de negocio para gestionar los géneros de las películas y series.
 * Realiza operaciones CRUD (Crear, Listar, Consultar por ID, Actualizar, Eliminar).
 * Normalización de texto y códigos HTTP estandarizados.
 * CÓDIGOS HTTP UTILIZADOS:
 * - 200: Operación exitosa / Consulta o actualización correcta.
 * - 201: Recurso creado exitosamente.
 * - 400: Error en la solicitud del cliente (datos faltantes o inválidos).
 * - 404: Recurso no encontrado.
 * - 500: Error interno del servidor.
 * ==============================================================================
 */

const Genre = require('../models/genre.model');

const createGenre = async (req, res) => {
    try {
        let { name, status, description } = req.body;
        
        if (name) {
            name = name.trim();
            // Normalizar primera letra en mayúscula
            name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        }

        const newGenre = new Genre({ name, status, description });
        const savedGenre = await newGenre.save();
        
        return res.status(201).json({
            status: 'success',
            message: 'Género creado exitosamente',
            data: savedGenre
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error al crear el género (es posible que ya exista)',
            error: error.message
        });
    }
};

const getGenres = async (req, res) => {
    try {
        const genres = await Genre.find();
        return res.status(200).json({
            status: 'success',
            count: genres.length,
            data: genres
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al consultar los géneros',
            error: error.message
        });
    }
};

const getGenreById = async (req, res) => {
    try {
        const { id } = req.params;
        const genre = await Genre.findById(id);

        if (!genre) {
            return res.status(404).json({
                status: 'error',
                message: 'Género no encontrado'
            });
        }

        return res.status(200).json({
            status: 'success',
            data: genre
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'ID inválido o error en la consulta',
            error: error.message
        });
    }
};

const updateGenre = async (req, res) => {
    try {
        const { id } = req.params;
        let updatedData = req.body;

        if (updatedData.name) {
            updatedData.name = updatedData.name.trim();
            updatedData.name = updatedData.name.charAt(0).toUpperCase() + updatedData.name.slice(1).toLowerCase();
        }

        const genre = await Genre.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

        if (!genre) {
            return res.status(404).json({
                status: 'error',
                message: 'Género no encontrado para actualizar'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Género actualizado exitosamente',
            data: genre
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error al actualizar el género',
            error: error.message
        });
    }
};

const deleteGenre = async (req, res) => {
    try {
        const { id } = req.params;
        const genre = await Genre.findByIdAndDelete(id);

        if (!genre) {
            return res.status(404).json({
                status: 'error',
                message: 'Género no encontrado para eliminar'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Género eliminado exitosamente'
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error al eliminar el género',
            error: error.message
        });
    }
};

module.exports = {
    createGenre,
    getGenres,
    getGenreById,
    updateGenre,
    deleteGenre
};