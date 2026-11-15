/**
 * ==============================================================================
 * ARCHIVO: tailwind.config.js
 * MÓDULO: Configuración de Estilos / Tailwind CSS
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Define los archivos donde Tailwind CSS busca clases utilitarias (content),
 * permite extender el tema visual del proyecto (theme.extend) y registra
 * plugins adicionales si se requieren durante la compilación.
 * ==============================================================================
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}