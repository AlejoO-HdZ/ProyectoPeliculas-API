/**
 * ==============================================================================
 * ARCHIVO: src/pages/ProducersPage.jsx
 * MÓDULO: Productora (/producers)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Pantalla dedicada al módulo de Productoras. Configura CatalogModuleView con
 * el endpoint /producers e incluye los campos requeridos de slogan y
 * descripción junto con estado Activo/Inactivo.
 * ==============================================================================
 */

import { Building2 } from 'lucide-react';
import CatalogModuleView from '../components/CatalogModuleView';

/* Renderiza la pantalla del módulo Productora conectada a /producers */
export default function ProducersPage() {
  return (
    <CatalogModuleView
      icon={Building2}
      title="Productoras"
      subtitle="Gestión de estudios y casas productoras con slogan y descripción"
      singular="productora"
      endpoint="/producers"
      nameField="name"
      hasStatus={true}
      hasDescription={true}
      hasSlogan={true}
    />
  );
}