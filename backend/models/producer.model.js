/**
 * ==============================================================================
 * ARCHIVO: producer.model.js
 * MÓDULO: Productora (Producer)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Define el esquema de Mongoose para la colección de productoras (ej. Disney, 
 * Warner, Paramount, etc.) en la base de datos `db_peliculas`.
 * Esquema con validación Case-Insensitive para el nombre.
 * 
 * REGLAS DEL MODELO:
 * - El nombre de la productora es obligatorio y único.
 * - Maneja un estado operativo ('Activo' o 'Inactivo').
 * - Permite almacenar un eslogan opcional e incluye una descripción obligatoria.
 * - Administra marcas de tiempo para control de cambios (createdAt y updatedAt).
 * ==============================================================================
 */

const { Schema, model } = require('mongoose');

const ProducerSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la productora es obligatorio'],
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Activo', 'Inactivo'],
        default: 'Activo'
    },
    slogan: {
        type: String,
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

ProducerSchema.index({ name: 1 }, { unique: true, collation: { locale: 'es', strength: 2 } });

module.exports = model('Producer', ProducerSchema);