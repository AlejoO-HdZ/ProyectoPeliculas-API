/**
 * ==============================================================================
 * ARCHIVO: media.controller.js
 * MÓDULO: Media / Películas y Series (Controller)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Controlador principal para gestionar las producciones (películas y series). Incluye validaciones
 * de serial/URL únicos y población de relaciones.
 * relaciones (Género, Director, Productora y Tipo) existan y estén en estado 'Activo'.
 * Utiliza `.populate()` de Mongoose para traer la información completa relacionada
 * de Género, Director, Productora y Tipo al realizar consultas.
 * ==============================================================================
 */

const Media = require('../models/media.model');
const Genre = require('../models/genre.model');
const Director = require('../models/director.model');
const Producer = require('../models/producer.model');
const MediaType = require('../models/media-type.model');

const createMedia = async (req, res) => {
    try {
        let { serial, title, synopsis, url, coverImage, releaseYear, genre, director, producer, mediaType } = req.body;

        if (serial) serial = serial.trim();
        if (title) title = title.trim();
        if (url) url = url.trim();

        // 1. Validar que el Género exista y esté ACTIVO
        const genreFound = await Genre.findById(genre);
        if (!genreFound || genreFound.status !== 'Activo') {
            return res.status(400).json({
                status: 'error',
                message: 'El género seleccionado no existe o se encuentra inactivo.'
            });
        }

        // 2. Validar que el Director exista y esté ACTIVO
        const directorFound = await Director.findById(director);
        if (!directorFound || directorFound.status !== 'Activo') {
            return res.status(400).json({
                status: 'error',
                message: 'El director seleccionado no existe o se encuentra inactivo.'
            });
        }

        // 3. Validar que la Productora exista y esté ACTIVA
        const producerFound = await Producer.findById(producer);
        if (!producerFound || producerFound.status !== 'Activo') {
            return res.status(400).json({
                status: 'error',
                message: 'La productora seleccionada no existe o se encuentra inactiva.'
            });
        }

        // 4. Validar que el Tipo de Media exista (los MediaType no manejan campo status según rúbrica básica, pero validamos existencia)
        const mediaTypeFound = await MediaType.findById(mediaType);
        if (!mediaTypeFound) {
            return res.status(400).json({
                status: 'error',
                message: 'El tipo de multimedia seleccionado no existe.'
            });
        }

        // Si pasa todas las validaciones, creamos la Media
        const newMedia = new Media({
            serial,
            title,
            synopsis,
            url,
            coverImage,
            releaseYear,
            genre,
            director,
            producer,
            mediaType
        });

        const savedMedia = await newMedia.save();

        return res.status(201).json({
            status: 'success',
            message: 'Producción multimedia creada exitosamente',
            data: savedMedia
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error al crear la producción multimedia (verifique unicidad de serial/URL)',
            error: error.message
        });
    }
};

const getMedias = async (req, res) => {
    try {
        const medias = await Media.find()
            .populate('genre', 'name status description')
            .populate('director', 'names status')
            .populate('producer', 'name status slogan description')
            .populate('mediaType', 'name description');

        return res.status(200).json({
            status: 'success',
            count: medias.length,
            data: medias
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al consultar las producciones',
            error: error.message
        });
    }
};

const getMediaById = async (req, res) => {
    try {
        const { id } = req.params;
        const media = await Media.findById(id)
            .populate('genre', 'name status description')
            .populate('director', 'names status')
            .populate('producer', 'name status slogan description')
            .populate('mediaType', 'name description');

        if (!media) {
            return res.status(404).json({
                status: 'error',
                message: 'Producción multimedia no encontrada'
            });
        }

        return res.status(200).json({
            status: 'success',
            data: media
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'ID inválido o error en la consulta',
            error: error.message
        });
    }
};

const updateMedia = async (req, res) => {
    try {
        const { id } = req.params;
        let updatedData = req.body;

        if (updatedData.serial) updatedData.serial = updatedData.serial.trim();
        if (updatedData.title) updatedData.title = updatedData.title.trim();
        if (updatedData.url) updatedData.url = updatedData.url.trim();

        // Si mandan a actualizar relaciones, validamos que existan y estén activos igual que en el create
        if (updatedData.genre) {
            const genreFound = await Genre.findById(updatedData.genre);
            if (!genreFound || genreFound.status !== 'Activo') {
                return res.status(400).json({ status: 'error', message: 'El género seleccionado no existe o está inactivo.' });
            }
        }
        if (updatedData.director) {
            const directorFound = await Director.findById(updatedData.director);
            if (!directorFound || directorFound.status !== 'Activo') {
                return res.status(400).json({ status: 'error', message: 'El director seleccionado no existe o está inactivo.' });
            }
        }
        if (updatedData.producer) {
            const producerFound = await Producer.findById(updatedData.producer);
            if (!producerFound || producerFound.status !== 'Activo') {
                return res.status(400).json({ status: 'error', message: 'La productora seleccionada no existe o está inactiva.' });
            }
        }
        if (updatedData.mediaType) {
            const mediaTypeFound = await MediaType.findById(updatedData.mediaType);
            if (!mediaTypeFound) {
                return res.status(400).json({ status: 'error', message: 'El tipo de multimedia no existe.' });
            }
        }

        const media = await Media.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true })
            .populate('genre')
            .populate('director')
            .populate('producer')
            .populate('mediaType');

        if (!media) {
            return res.status(404).json({
                status: 'error',
                message: 'Producción multimedia no encontrada para actualizar'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Producción multimedia actualizada exitosamente',
            data: media
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error al actualizar la producción multimedia',
            error: error.message
        });
    }
};

const deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const media = await Media.findByIdAndDelete(id);

        if (!media) {
            return res.status(404).json({
                status: 'error',
                message: 'Producción multimedia no encontrada para eliminar'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Producción multimedia eliminada exitosamente'
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error al eliminar la producción multimedia',
            error: error.message
        });
    }
};

module.exports = {
    createMedia,
    getMedias,
    getMediaById,
    updateMedia,
    deleteMedia
};