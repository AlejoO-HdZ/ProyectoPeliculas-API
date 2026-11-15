/**
 * ==============================================================================
 * ARCHIVO: src/pages/MediaTypesPage.jsx
 * MÓDULO: Tipo (/media-types)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Pantalla dedicada al módulo de Tipos de multimedia (película, serie, etc.).
 * Configura CatalogModuleView con el endpoint /media-types y descripción
 * requerida.
 * ==============================================================================
 */

import { Tv } from 'lucide-react';
import CatalogModuleView from '../components/CatalogModuleView';

/* Renderiza la pantalla del módulo Tipo conectada a /media-types */
export default function MediaTypesPage() {
  return (
    <CatalogModuleView
      icon={Tv}
      title="Tipos de Multimedia"
      subtitle="Gestión de formatos o tipos de contenido (película, serie, documental)"
      singular="tipo"
      endpoint="/media-types"
      nameField="name"
      hasStatus={false}
      hasDescription={true}
      hasSlogan={false}
    />
  );
}