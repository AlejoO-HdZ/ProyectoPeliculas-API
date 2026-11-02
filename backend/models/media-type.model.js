/**
 * ==============================================================================
 * ARCHIVO: media-type.model.js
 * MÓDULO: Tipo de Multimedia (MediaType)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Define el esquema de Mongoose para clasificar el tipo de producción multimedia
 * (por ejemplo: Película, Serie, Documental, etc.) dentro de `db_peliculas`.
 * Esquema de Mongoose para el tipo de multimedia con unicidad Case-Insensitive.
 * 
 * REGLAS DEL MODELO:
 * - El nombre del tipo es obligatorio y único en el sistema.
 * - La descripción detalla el propósito de esta clasificación multimedia.
 * - Incorpora automáticamente las fechas de registro y actualización UTC.
 * ==============================================================================
  */

const { Schema, model } = require('mongoose');

const MediaTypeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre del tipo es obligatorio'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

MediaTypeSchema.index({ name: 1 }, { unique: true, collation: { locale: 'es', strength: 2 } });

module.exports = model('MediaType', MediaTypeSchema);