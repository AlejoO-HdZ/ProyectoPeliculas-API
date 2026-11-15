/**
 * ==============================================================================
 * ARCHIVO: src/pages/GenresPage.jsx
 * MÓDULO: Género (/genres)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Pantalla dedicada al módulo de Géneros cinematográficos y de series.
 * Configura CatalogModuleView con el endpoint /genres, estado Activo/Inactivo
 * y descripción requerida.
 * ==============================================================================
 */

import { Tags } from 'lucide-react';
import CatalogModuleView from '../components/CatalogModuleView';

/* Renderiza la pantalla del módulo Género conectada a /genres */
export default function GenresPage() {
  return (
    <CatalogModuleView
      icon={Tags}
      title="Géneros"
      subtitle="Gestión de géneros cinematográficos y de series"
      singular="género"
      endpoint="/genres"
      nameField="name"
      hasStatus={true}
      hasDescription={true}
      hasSlogan={false}
    />
  );
}