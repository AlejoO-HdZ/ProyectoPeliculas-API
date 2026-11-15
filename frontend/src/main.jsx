/**
 * ==============================================================================
 * ARCHIVO: src/main.jsx
 * MÓDULO: Punto de Entrada de React
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Inicializa la aplicación React en el DOM montando el componente principal
 * App dentro del elemento raíz (#root), importa los estilos globales de Tailwind
 * y activa StrictMode para detectar posibles problemas en desarrollo.
 * ==============================================================================
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

/* Busca el contenedor #root en index.html y renderiza la aplicación */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);