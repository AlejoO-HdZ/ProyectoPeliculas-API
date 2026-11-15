/**
 * ==============================================================================
 * ARCHIVO: postcss.config.js
 * MÓDULO: Procesamiento de Estilos / PostCSS
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Configura los plugins de PostCSS ejecutados durante el build de Vite.
 * Habilita Tailwind CSS para generar las clases utilitarias y Autoprefixer
 * para añadir prefijos de compatibilidad entre navegadores.
 * ==============================================================================
 */

/* Exporta la configuración de plugins de PostCSS para el proyecto */
export default {
  plugins: {
    /* Procesa las directivas y clases utilitarias de Tailwind CSS */
    tailwindcss: {},
    /* Agrega prefijos vendor automáticamente según navegadores objetivo */
    autoprefixer: {},
  },
};