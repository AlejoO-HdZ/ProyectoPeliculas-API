/**
 * ==============================================================================
 * ARCHIVO: src/components/CatalogModuleView.jsx
 * MÓDULO: Componente Base de Catálogos (Género, Director, Productora, Tipo)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Componente reutilizable que centraliza el CRUD completo (listar, crear,
 * editar y eliminar), el cambio de estado Activo/Inactivo, el formato de fechas
 * y el manejo de errores para los módulos conectados a axiosClient.
 * ==============================================================================
 */

import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import axiosClient from '../api/axiosClient';

/**
 * Componente genérico para administrar un módulo de catálogo.
 * Recibe configuración de endpoint, campo de nombre y flags de campos opcionales.
 */
export default function CatalogModuleView({
  icon: Icon,
  title,
  subtitle,
  singular,
  endpoint,
  nameField = 'name',
  hasStatus = true,
  hasDescription = false,
  hasSlogan = false,
}) {
  const [items, setItems] = useState([]);
  const [nameValue, setNameValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [sloganValue, setSloganValue] = useState('');
  const [statusValue, setStatusValue] = useState('Activo');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  /* Extrae un arreglo de registros sin importar si el backend responde con { data: [] } o [] */
  const extractArray = (res) => {
    if (Array.isArray(res.data?.data)) return res.data.data;
    if (Array.isArray(res.data)) return res.data;
    return [];
  };

  /* Interpreta mensajes de error o validaciones devueltos por la API REST */
  const getBackendError = (err, fallback) => {
    const data = err.response?.data;
    if (!data) return fallback;
    if (typeof data === 'string') return data;
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.map((e) => e.msg || e.message).join(' | ');
    }
    return data.message || data.error || fallback;
  };

  /* Obtiene el nombre principal del registro según el campo configurado en el módulo */
  const getItemName = (item) =>
    item?.[nameField] ||
    item?.names ||
    item?.name ||
    item?.nombre ||
    item?.title ||
    'Sin nombre';

  /* Obtiene la descripción del registro si existe */
  const getItemDescription = (item) =>
    item?.description || item?.descripcion || '';

  /* Obtiene el slogan del registro si existe */
  const getItemSlogan = (item) => item?.slogan || '';

  /* Formatea fechas ISO a lectura corta en español de Colombia */
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  /* Restablece los campos del formulario y sale del modo edición */
  const resetForm = () => {
    setEditingId(null);
    setNameValue('');
    setDescriptionValue('');
    setSloganValue('');
    setStatusValue(hasStatus ? 'Activo' : '');
  };

  /* Consulta al backend todos los registros del endpoint actual */
  const fetchItems = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await axiosClient.get(endpoint);
      setItems(extractArray(res));
    } catch (err) {
      setErrorMsg(
        getBackendError(err, `No se pudieron cargar los registros de ${title}.`)
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  /* Recarga los datos y limpia mensajes al cambiar de módulo/endpoint */
  useEffect(() => {
    setMessage('');
    setErrorMsg('');
    resetForm();
    fetchItems();
  }, [endpoint]);

  /* Carga un registro existente en el formulario para editarlo */
  const handleStartEdit = (item) => {
    setEditingId(item._id);
    setMessage('');
    setErrorMsg('');
    setNameValue(getItemName(item) === 'Sin nombre' ? '' : getItemName(item));
    setDescriptionValue(getItemDescription(item));
    setSloganValue(getItemSlogan(item));
    if (hasStatus) {
      setStatusValue(item.status || 'Activo');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* Construye el objeto JSON que se enviará en POST o PUT al backend */
  const buildPayload = () => {
    const payload = { [nameField]: nameValue.trim() };
    if (hasDescription && descriptionValue.trim()) {
      payload.description = descriptionValue.trim();
    }
    if (hasSlogan && sloganValue.trim()) {
      payload.slogan = sloganValue.trim();
    }
    if (hasStatus) {
      payload.status = statusValue || 'Activo';
    }
    return payload;
  };

  /* Envía el formulario para crear un nuevo registro o actualizar uno existente */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nameValue.trim()) return;

    setSaving(true);
    setErrorMsg('');
    setMessage('');

    try {
      const payload = buildPayload();
      if (editingId) {
        await axiosClient.put(`${endpoint}/${editingId}`, payload);
        setMessage(`${title} actualizado correctamente.`);
      } else {
        await axiosClient.post(endpoint, payload);
        setMessage(`"${nameValue.trim()}" guardado en ${title}.`);
      }
      resetForm();
      await fetchItems();
    } catch (err) {
      setErrorMsg(
        getBackendError(
          err,
          `No se pudo guardar en ${title}. Verifica que no esté duplicado y que los campos obligatorios estén completos.`
        )
      );
    } finally {
      setSaving(false);
    }
  };

  /* Alterna rápidamente entre estado Activo e Inactivo mediante PUT */
  const handleToggleStatus = async (item) => {
    if (!hasStatus) return;
    const nextStatus = item.status === 'Inactivo' ? 'Activo' : 'Inactivo';
    setErrorMsg('');
    setMessage('');

    try {
      const payload = {
        [nameField]: getItemName(item),
        status: nextStatus,
      };
      if (hasDescription && getItemDescription(item)) {
        payload.description = getItemDescription(item);
      }
      if (hasSlogan && getItemSlogan(item)) {
        payload.slogan = getItemSlogan(item);
      }
      await axiosClient.put(`${endpoint}/${item._id}`, payload);
      setMessage(`Estado cambiado a "${nextStatus}".`);
      await fetchItems();
    } catch (err) {
      setErrorMsg(getBackendError(err, 'No se pudo actualizar el estado.'));
    }
  };

  /* Elimina un registro por su ID en la API */
  const handleDelete = async (id) => {
    setErrorMsg('');
    setMessage('');
    try {
      await axiosClient.delete(`${endpoint}/${id}`);
      if (editingId === id) resetForm();
      setItems((prev) => prev.filter((item) => item._id !== id));
      setMessage('Registro eliminado.');
    } catch (err) {
      setErrorMsg(
        getBackendError(
          err,
          'No se pudo eliminar. Verifica si este registro está asignado a alguna producción.'
        )
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 px-4 sm:px-8 py-6">
      <div className="w-full space-y-6">
        {/* Encabezado del módulo */}
        <header className="flex items-center gap-3 border-b border-slate-800 pb-4">
          {Icon && <Icon className="w-7 h-7 text-purple-400 shrink-0" />}
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-sm text-slate-400">{subtitle}</p>
          </div>
        </header>

        {/* Alertas de error o confirmación */}
        {errorMsg && (
          <div className="bg-red-950/70 border border-red-700 text-red-200 px-4 py-3 rounded-xl text-sm">
            {errorMsg}
          </div>
        )}

        {message && (
          <div className="bg-emerald-950/70 border border-emerald-700 text-emerald-200 px-4 py-3 rounded-xl text-sm">
            {message}
          </div>
        )}

        {/* Formulario de creación y edición */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-purple-300">
              {editingId ? `Editar ${singular}` : `Nuevo registro en ${title}`}
            </h2>
            {editingId && (
              <span className="text-xs text-amber-300 bg-amber-950/60 border border-amber-800 px-2.5 py-1 rounded-lg">
                Editando
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder={`Nombre del ${singular} (Requerida)`}
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              required
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
            />

            {hasStatus && (
              <select
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
                required
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            )}

            {hasSlogan && (
              <input
                type="text"
                placeholder="Slogan (Requerida)"
                value={sloganValue}
                onChange={(e) => setSloganValue(e.target.value)}
                required
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
              />
            )}

            {hasDescription && (
              <input
                type="text"
                placeholder="Descripción (Requerida)"
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
                required
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
              />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Agregar'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2.5 rounded-xl text-sm transition cursor-pointer"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Listado de registros existentes */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-base font-semibold text-slate-200">
            {title} ({items.length})
          </h2>

          {loading ? (
            <p className="text-sm text-slate-400">Cargando...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-slate-400">No hay registros todavía.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {items.map((item) => {
                const status = item.status || 'Activo';
                const isActive = status === 'Activo';
                const desc = getItemDescription(item);
                const slogan = getItemSlogan(item);
                const created = formatDate(item.createdAt);
                const updated = formatDate(item.updatedAt);

                return (
                  <div
                    key={item._id}
                    className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-white font-semibold text-sm">
                          {getItemName(item)}
                        </span>
                        {hasStatus && (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item)}
                            title="Cambiar estado"
                            className={`text-xs px-2.5 py-0.5 rounded-full font-medium cursor-pointer shrink-0 ${
                              isActive
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {status}
                          </button>
                        )}
                      </div>

                      {slogan && (
                        <p className="text-xs italic text-purple-300/90">
                          “{slogan}”
                        </p>
                      )}

                      {desc && <p className="text-xs text-slate-400">{desc}</p>}
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-500 leading-tight">
                        {created && <div>Creado: {created}</div>}
                        {updated && <div>Actualizado: {updated}</div>}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="inline-flex items-center gap-1 text-xs text-purple-300 hover:text-purple-200 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id)}
                          className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}