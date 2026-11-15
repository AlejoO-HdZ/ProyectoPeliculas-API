/**
 * ==============================================================================
 * ARCHIVO: src/api/axiosClient.js
 * MÓDULO: Cliente HTTP / Conexión con API REST (Node.js)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Crea y configura una instancia centralizada de Axios con la URL base del
 * servidor backend en Node.js, cabeceras JSON por defecto y manejo uniforme de
 * errores HTTP para todas las peticiones de los módulos.
 * ==============================================================================
 */

import axios from 'axios';

/* Obtiene la URL base desde variables de entorno o usa un valor por defecto */
const baseURL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/* Instancia compartida de Axios utilizada por las páginas y componentes */
const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/* Interceptor de respuesta para centralizar el registro o depuración de errores */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;