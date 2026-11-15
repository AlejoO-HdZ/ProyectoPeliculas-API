/**
 * ==============================================================================
 * ARCHIVO: eslint.config.js
 * MÓDULO: Calidad de Código / Linter (ESLint)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Configura las reglas de análisis estático de código para el proyecto en
 * React + Vite. Ignora la carpeta de compilación (dist), define el entorno
 * del navegador y aplica las reglas recomendadas de JavaScript, React Hooks y
 * React Refresh.
 * ==============================================================================
 */



import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
