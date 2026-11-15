/**
 * ==============================================================================
 * ARCHIVO: src/App.jsx
 * MÓDULO: Enrutamiento y Navegación Principal
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Define la estructura principal de la aplicación, la barra de navegación con
 * acceso a los 5 módulos requeridos (Media, Género, Director, Productora y Tipo)
 * y las rutas asociadas a cada pantalla.
 * ==============================================================================
 */

import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import MediaPage from './pages/MediaPage';
import GenresPage from './pages/GenresPage';
import DirectorsPage from './pages/DirectorsPage';
import ProducersPage from './pages/ProducersPage';
import MediaTypesPage from './pages/MediaTypesPage';

/* Lista de rutas visibles en la navegación superior para los 5 módulos */
const NAV_ITEMS = [
  { to: '/media', label: 'Media' },
  { to: '/genres', label: 'Género' },
  { to: '/directors', label: 'Director' },
  { to: '/producers', label: 'Productora' },
  { to: '/media-types', label: 'Tipo' },
];

/**
 * Componente principal de la aplicación.
 * Renderiza el layout de ancho completo, el menú de navegación y el router.
 */
export default function App() {
  /* Genera las clases CSS del enlace según si la ruta está activa o no */
  const linkClass = ({ isActive }) =>
    `px-3.5 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
      isActive
        ? 'bg-purple-600 text-white'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col">
        {/* Barra de navegación superior */}
        <nav className="w-full border-b border-slate-800 bg-slate-900/90 px-4 sm:px-8 py-3">
          <div className="w-full flex flex-wrap items-center justify-between gap-3">
            <span className="font-bold text-lg text-purple-400">Web Entretenimiento - IUDigital de Antioquia</span>
            <div className="flex flex-wrap items-center gap-2">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Contenedor principal donde se monta la pantalla de la ruta activa */}
        <main className="w-full flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/media" replace />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/genres" element={<GenresPage />} />
            <Route path="/directors" element={<DirectorsPage />} />
            <Route path="/producers" element={<ProducersPage />} />
            <Route path="/media-types" element={<MediaTypesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}