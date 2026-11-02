/**
 * ==============================================================================
 * ARCHIVO: genre.model.js
 * MÓDULO: Género (Genre)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Define el esquema de Mongoose para la colección de géneros en la base de datos
 * `db_peliculas`. Permite registrar categorías como acción, comedia, drama, etc.
 * Esquema de Mongoose para la colección de géneros. Incluye validación de unicidad
 * que ignora mayúsculas y minúsculas (Case-Insensitive).
 * 
 * REGLAS DEL MODELO:
 * - El nombre del género es obligatorio y debe ser único.
 * - Cuenta con un estado que por defecto es 'Activo' (admite 'Inactivo').
 * - La descripción es requerida para contextualizar el género.
 * - Incorpora automáticamente marcas de tiempo UTC (createdAt y updatedAt).
 * ==============================================================================
 */

const { Schema, model } = require('mongoose');

const GenreSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre del género es obligatorio'],
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Activo', 'Inactivo'],
        default: 'Activo'
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Índice único ignorando mayúsculas y minúsculas (ej: 'Accion' y 'ACCION' dan error)
GenreSchema.index({ name: 1 }, { unique: true, collation: { locale: 'es', strength: 2 } });

module.exports = model('Genre', GenreSchema);