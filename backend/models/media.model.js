/**
 * ==============================================================================
 * ARCHIVO: media.model.js
 * MÓDULO: Media / Películas y Series (Media)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Esquema principal de la aplicación. Gestiona las producciones (películas y series) 
 * Contiene validación estricta para el año (sin decimales, sin años futuros y mayor a 1888), 
 * campos obligatorios y serial/URL únicos Case-Insensitive.
 * 
 * REGLAS DE NEGOCIO Y RELACIONES:
 * - Serial único y URL única para evitar duplicidad de contenidos multimedia.
 * - Información básica obligatoria: Título, sinopsis, imagen de portada y año de estreno.
 * - Relaciones (Foreign Keys simuladas con ObjectId de Mongoose y referenciadas a sus colecciones):
 *   1. genre: Vinculado al modelo 'Genre' (Género principal).
 *   2. director: Vinculado al modelo 'Director' (Director principal).
 *   3. producer: Vinculado al modelo 'Producer' (Productora principal).
 *   4. mediaType: Vinculado al modelo 'MediaType' (Tipo de multimedia).
 * - Auditoría automática con marcas de tiempo (createdAt, updatedAt) UTC.
 * ==============================================================================
 */

const { Schema, model } = require('mongoose');

const MediaSchema = new Schema({
    serial: {
        type: String,
        required: [true, 'El serial es obligatorio'],
        trim: true
    },
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true
    },
    synopsis: {
        type: String,
        required: [true, 'La sinopsis es obligatoria'],
        trim: true
    },
    url: {
        type: String,
        required: [true, 'La URL de la película es obligatoria'],
        trim: true
    },
    coverImage: {
        type: String,
        required: [true, 'La imagen o foto de portada es obligatoria'],
        trim: true
    },
    releaseYear: {
        type: Number,
        required: [true, 'El año de estreno es obligatorio'],
        validate: {
            validator: function(v) {
                // Valida que sea número entero, no futuro (máx 2026), no decimal y mayor a 1888
                return Number.isInteger(v) && v <= 2026 && v > 1888;
            },
            message: props => `${props.value} no es un año válido. Debe ser entero, no futuro y mayor a 1888.`
        }
    },
    genre: {
        type: Schema.Types.ObjectId,
        ref: 'Genre',
        required: [true, 'El género principal es obligatorio']
    },
    director: {
        type: Schema.Types.ObjectId,
        ref: 'Director',
        required: [true, 'El director principal es obligatorio']
    },
    producer: {
        type: Schema.Types.ObjectId,
        ref: 'Producer',
        required: [true, 'La productora es obligatoria']
    },
    mediaType: {
        type: Schema.Types.ObjectId,
        ref: 'MediaType',
        required: [true, 'El tipo de multimedia es obligatorio']
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Índices únicos Case-Insensitive para serial y URL
MediaSchema.index({ serial: 1 }, { unique: true, collation: { locale: 'es', strength: 2 } });
MediaSchema.index({ url: 1 }, { unique: true, collation: { locale: 'es', strength: 2 } });

module.exports = model('Media', MediaSchema);