/**
 * ==============================================================================
 * ARCHIVO: director.model.js
 * MÓDULO: Director (Director)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Define el esquema de Mongoose para la colección de directores en la base de datos
 * `db_peliculas`. Se encarga de gestionar la información del director principal
 * de cada producción cinematográfica o serie.
 * Esquema de Mongoose para la colección de directores contiene índice único Case-Insensitive.
 * 
 * REGLAS:
 * - Los nombres del director son obligatorios.
 * - Incluye un control de estado ('Activo' o 'Inactivo') para filtrar directores
 *   disponibles al momento de asociarlos a una película/serie.
 * - Genera de forma automática los campos de auditoría (fechas de creación y actualización UTC).
 * ==============================================================================
 */

const { Schema, model } = require('mongoose');

const DirectorSchema = new Schema({
    names: {
        type: String,
        required: [true, 'Los nombres del director son obligatorios'],
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Activo', 'Inactivo'],
        default: 'Activo'
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Índice único ignorando mayúsculas y minúsculas
DirectorSchema.index({ names: 1 }, { unique: true, collation: { locale: 'es', strength: 2 } });

module.exports = model('Director', DirectorSchema);