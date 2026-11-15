/**
 * ==============================================================================
 * ARCHIVO: vite.config.js
 * MÓDULO: Configuración de Build y Servidor / Vite
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Define la configuración principal de Vite para el proyecto React. Registra
 * los plugins necesarios (como el soporte para React y Fast Refresh) y permite
 * personalizar el comportamiento del servidor de desarrollo y la compilación.
 * ==============================================================================
 */

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
