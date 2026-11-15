/**
 * ==============================================================================
 * ARCHIVO: src/pages/DirectorsPage.jsx
 * MÓDULO: Director (/directors)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Pantalla dedicada al módulo de Directores. Configura CatalogModuleView con el
 * endpoint /directors, campo principal "names" y control de estado
 * Activo/Inactivo.
 * ==============================================================================
 */

import { Clapperboard } from 'lucide-react';
import CatalogModuleView from '../components/CatalogModuleView';

/* Renderiza la pantalla del módulo Director conectada a /directors */
export default function DirectorsPage() {
  return (
    <CatalogModuleView
      icon={Clapperboard}
      title="Directores"
      subtitle="Gestión de directores de películas y series"
      singular="director"
      endpoint="/directors"
      nameField="names"
      hasStatus={true}
      hasDescription={false}
      hasSlogan={false}
    />
  );
}