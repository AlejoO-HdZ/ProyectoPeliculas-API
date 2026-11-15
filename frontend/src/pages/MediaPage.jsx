/**
 * ==============================================================================
 * ARCHIVO: src/pages/MediaPage.jsx
 * MÓDULO: Media - Películas y Series (/media)
 * ------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 * Pantalla principal para la gestión de películas y series conectada a la API
 * REST mediante axiosClient, con cartelera con vista detallada al pasar el
 * cursor, botón de Gestión de Producciones en el encabezado que despliega un
 * formulario centrado con scroll y foco automático, cierre automático al
 * guardar/actualizar enfocando la producción resultante, enfoque al mensaje de
 * error si falla, catálogos activos y eliminación.
 * ==============================================================================
 */

import { useEffect, useRef, useState } from 'react';
import {
  ChevronUp,
  ExternalLink,
  Film,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import axiosClient from '../api/axiosClient';

/* Valores iniciales limpios para el formulario de películas y series */
const INITIAL_FORM = {
  serial: '',
  title: '',
  synopsis: '',
  url: '',
  coverImage: '',
  releaseYear: '2024',
  genre: '',
  director: '',
  producer: '',
  mediaType: '',
};

/**
 * Pantalla del módulo Media (Películas y series).
 * Administra el listado de producciones, los catálogos relacionados y el
 * formulario desplegable centrado de registro o edición.
 */
export default function MediaPage() {
  const [mediaList, setMediaList] = useState([]);
  const [catalogs, setCatalogs] = useState({
    genres: [],
    directors: [],
    producers: [],
    mediaTypes: [],
  });
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  const [brokenImages, setBrokenImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const formSectionRef = useRef(null);
  const serialInputRef = useRef(null);
  const errorAlertRef = useRef(null);
  const cardRefs = useRef({});

  /* Extrae un arreglo desde respuestas tipo { data: [...] } o [...] */
  const extractArray = (res) => {
    if (Array.isArray(res.data?.data)) return res.data.data;
    if (Array.isArray(res.data)) return res.data;
    return [];
  };

  /* Traduce errores del backend y detecta duplicados en serial o url */
  const getBackendError = (err, fallback) => {
    const data = err.response?.data;
    const rawText = [
      typeof data === 'string' ? data : '',
      data?.message || '',
      data?.error || '',
      Array.isArray(data?.errors)
        ? data.errors.map((e) => e.msg || e.message || '').join(' ')
        : '',
      err.message || '',
    ]
      .join(' ')
      .toLowerCase();

    const isDuplicate =
      err.response?.status === 409 ||
      rawText.includes('e11000') ||
      rawText.includes('duplicate') ||
      rawText.includes('duplicad') ||
      rawText.includes('ya existe');

    const mentionsSerial = rawText.includes('serial');
    const mentionsUrl = rawText.includes('url');

    if (isDuplicate && mentionsSerial && mentionsUrl) {
      return 'El Serial y la URL ya están registrados en otra película o serie. Ambos deben ser únicos.';
    }
    if (isDuplicate && mentionsSerial) {
      return 'Ese Serial ya está en uso por otra película o serie. Escribe un Serial único.';
    }
    if (isDuplicate && mentionsUrl) {
      return 'Esa URL ya está registrada en otra película o serie. Escribe una URL única.';
    }
    if (isDuplicate) {
      return 'Ya existe un registro con un dato único duplicado (revisa el Serial y la URL).';
    }

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors.map((e) => e.msg || e.message).join(' | ');
    }

    if (data?.message && !data.message.toLowerCase().startsWith('error al ')) {
      return data.message;
    }

    return fallback;
  };

  /* Determina si un registro de catálogo está disponible para seleccionarse */
  const isSelectableActive = (item) => {
    if (!item) return false;
    if (typeof item.status === 'undefined' || item.status === null) return true;
    return item.status === 'Activo';
  };

  const activeGenres = catalogs.genres.filter(isSelectableActive);
  const activeDirectors = catalogs.directors.filter(isSelectableActive);
  const activeProducers = catalogs.producers.filter(isSelectableActive);
  const allMediaTypes = catalogs.mediaTypes;

  /* Obtiene los primeros IDs disponibles de cada catálogo como valor por defecto */
  const getDefaultCatalogIds = (cat = catalogs) => {
    const gList = cat.genres.filter(isSelectableActive);
    const dList = cat.directors.filter(isSelectableActive);
    const pList = cat.producers.filter(isSelectableActive);
    const tList = cat.mediaTypes;
    return {
      genre: gList[0]?._id || '',
      director: dList[0]?._id || '',
      producer: pList[0]?._id || '',
      mediaType: tList[0]?._id || '',
    };
  };

  /* Carga en paralelo las producciones y los cuatro catálogos desde la API */
  const loadAllData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [mediaRes, genresRes, directorsRes, producersRes, typesRes] =
        await Promise.all([
          axiosClient.get('/media'),
          axiosClient.get('/genres'),
          axiosClient.get('/directors'),
          axiosClient.get('/producers'),
          axiosClient.get('/media-types'),
        ]);

      const genres = extractArray(genresRes);
      const directors = extractArray(directorsRes);
      const producers = extractArray(producersRes);
      const mediaTypes = extractArray(typesRes);
      const mediaItems = extractArray(mediaRes);

      const gActive = genres.filter(isSelectableActive);
      const dActive = directors.filter(isSelectableActive);
      const pActive = producers.filter(isSelectableActive);

      setMediaList(mediaItems);
      setCatalogs({ genres, directors, producers, mediaTypes });

      setFormData((prev) => ({
        ...prev,
        genre: prev.genre || gActive[0]?._id || '',
        director: prev.director || dActive[0]?._id || '',
        producer: prev.producer || pActive[0]?._id || '',
        mediaType: prev.mediaType || mediaTypes[0]?._id || '',
      }));

      return mediaItems;
    } catch (err) {
      setErrorMsg(
        getBackendError(
          err,
          'No se pudieron cargar los datos. Verifica que el backend esté activo.'
        )
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  /* Carga inicial de datos al montar el componente */
  useEffect(() => {
    loadAllData();
  }, []);

  /* Desplaza y enfoca el formulario cuando se despliega */
  const focusFormSection = () => {
    requestAnimationFrame(() => {
      formSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      setTimeout(() => {
        serialInputRef.current?.focus();
      }, 250);
    });
  };

  /* Desplaza suavemente hacia el mensaje de error y lo resalta */
  const focusErrorAlert = () => {
    requestAnimationFrame(() => {
      errorAlertRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  };

  /* Enfoca y resalta temporalmente una tarjeta en la cartelera */
  const focusMediaCard = (targetId) => {
    if (!targetId) return;
    setHighlightedId(targetId);
    requestAnimationFrame(() => {
      setTimeout(() => {
        cardRefs.current[targetId]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 150);
    });
    setTimeout(() => {
      setHighlightedId((prev) => (prev === targetId ? null : prev));
    }, 2200);
  };

  /* Actualiza un campo del formulario al escribir o seleccionar */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* Abre o cierra el formulario desplegable desde el encabezado */
  const handleToggleForm = () => {
    if (isFormOpen) {
      if (editingId) {
        handleCancelEdit();
      }
      setIsFormOpen(false);
      return;
    }
    setErrorMsg('');
    setIsFormOpen(true);
    focusFormSection();
  };

  /* Precarga los datos de una película o serie en el formulario para editarla */
  const handleStartEdit = (item) => {
    setEditingId(item._id);
    setIsFormOpen(true);
    setErrorMsg('');
    setSuccessMsg('');
    setFormData({
      serial: item.serial || '',
      title: item.title || '',
      synopsis: item.synopsis || '',
      url: item.url || '',
      coverImage: item.coverImage || '',
      releaseYear: String(item.releaseYear ?? '2024'),
      genre: item.genre?._id || item.genre || '',
      director: item.director?._id || item.director || '',
      producer: item.producer?._id || item.producer || '',
      mediaType: item.mediaType?._id || item.mediaType || '',
    });
    focusFormSection();
  };

  /* Cancela la edición y limpia el formulario */
  const handleCancelEdit = () => {
    setEditingId(null);
    setErrorMsg('');
    setFormData({
      ...INITIAL_FORM,
      releaseYear: '2024',
      ...getDefaultCatalogIds(),
    });
  };

  /* Valida y envía el formulario para crear (POST) o actualizar (PUT) */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const yearNum = Number(formData.releaseYear);
    if (!Number.isInteger(yearNum) || yearNum <= 1888 || yearNum > 2026) {
      setErrorMsg(
        'El año debe ser un número entero mayor a 1888 y menor o igual a 2026.'
      );
      focusErrorAlert();
      return;
    }

    const payload = {
      ...formData,
      serial: formData.serial.trim(),
      title: formData.title.trim(),
      synopsis: formData.synopsis.trim(),
      url: formData.url.trim(),
      coverImage: formData.coverImage.trim(),
      releaseYear: yearNum,
    };

    setSubmitting(true);
    try {
      let targetId = editingId;

      if (editingId) {
        const res = await axiosClient.put(`/media/${editingId}`, payload);
        targetId = res.data?.data?._id || res.data?._id || editingId;
        setSuccessMsg('Contenido actualizado correctamente.');
      } else {
        const res = await axiosClient.post('/media', payload);
        targetId = res.data?.data?._id || res.data?._id || null;
        setSuccessMsg('Contenido guardado correctamente.');
      }

      setEditingId(null);
      setIsFormOpen(false);
      setFormData({
        ...INITIAL_FORM,
        releaseYear: '2024',
        ...getDefaultCatalogIds(),
      });

      const updatedList = await loadAllData();
      if (!targetId && payload.serial) {
        const matched = updatedList.find(
          (entry) =>
            entry.serial?.toLowerCase() === payload.serial.toLowerCase()
        );
        targetId = matched?._id || null;
      }

      focusMediaCard(targetId);
    } catch (err) {
      setErrorMsg(
        getBackendError(
          err,
          editingId
            ? 'No se pudo actualizar la producción. Verifica que el Serial y la URL no estén duplicados y que todos los campos sean válidos.'
            : 'No se pudo guardar la producción. Verifica que el Serial y la URL no estén duplicados y que todos los campos sean válidos.'
        )
      );
      focusErrorAlert();
    } finally {
      setSubmitting(false);
    }
  };

  /* Elimina una película o serie por su ID */
  const handleDelete = async (id) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await axiosClient.delete(`/media/${id}`);
      if (editingId === id) {
        setEditingId(null);
        setIsFormOpen(false);
        setFormData({
          ...INITIAL_FORM,
          releaseYear: '2024',
          ...getDefaultCatalogIds(),
        });
      }
      setMediaList((prev) => prev.filter((item) => item._id !== id));
      setSuccessMsg('Contenido eliminado.');
    } catch (err) {
      setErrorMsg(
        getBackendError(err, 'No se pudo eliminar el registro.')
      );
      focusErrorAlert();
    }
  };

  /* Resuelve el nombre legible de una relación poblada o por ID */
  const getLabel = (
    fieldValue,
    list,
    fallbackKeys = ['names', 'name', 'title']
  ) => {
    if (!fieldValue) return 'Sin asignar';

    if (typeof fieldValue === 'object') {
      for (const key of fallbackKeys) {
        if (fieldValue[key]) return fieldValue[key];
      }
      if (!fieldValue._id) return 'Sin asignar';
      const matchInList = list.find((item) => item._id === fieldValue._id);
      if (matchInList) {
        for (const key of fallbackKeys) {
          if (matchInList[key]) return matchInList[key];
        }
      }
      return 'Sin nombre';
    }

    const found = list.find((item) => item._id === fieldValue);
    if (!found) return 'Sin asignar';
    for (const key of fallbackKeys) {
      if (found[key]) return found[key];
    }
    return 'Sin nombre';
  };

  /* Obtiene la etiqueta de un elemento en los select de catálogos */
  const getOptionLabel = (option) =>
    option.names || option.name || option.title || 'Sin nombre';

  /* Formatea fechas de creación o actualización */
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

  /* Marca una imagen como rota para mostrar el respaldo visual */
  const markImageBroken = (id) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 px-4 sm:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Encabezado de la pantalla Media con el único disparador de Gestión de Producciones */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Film className="w-8 h-8 text-purple-400 shrink-0" />
            <div>
              <h1 className="text-2xl font-bold text-white">
                Media (Películas y Series)
              </h1>
              <p className="text-sm text-slate-400">
                Pasa el cursor sobre una portada para ver su información completa
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleForm}
            aria-expanded={isFormOpen}
            className="inline-flex items-center justify-center gap-2 bg-purple-600/20 hover:bg-purple-600/35 border border-purple-500/40 text-purple-200 font-medium px-4 py-2 rounded-xl text-sm transition cursor-pointer shrink-0"
          >
            <span>Gestión de Producciones</span>
            {isFormOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </header>

        {/* Mensajes de error o éxito */}
        {errorMsg && (
          <div
            ref={errorAlertRef}
            role="alert"
            className="max-w-4xl mx-auto bg-red-950/80 border border-red-600 text-red-200 px-4 py-3 rounded-xl text-sm shadow-md"
          >
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="max-w-4xl mx-auto bg-emerald-950/70 border border-emerald-700 text-emerald-200 px-4 py-3 rounded-xl text-sm">
            {successMsg}
          </div>
        )}

        {/* CARTELERA CON DESPLIEGUE AL PASAR EL MOUSE */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-200">
            Registrados ({mediaList.length})
          </h2>

          {loading ? (
            <p className="text-slate-400 text-sm">Cargando contenidos...</p>
          ) : mediaList.length === 0 ? (
            <p className="text-slate-400 text-sm bg-slate-900 border border-slate-800 rounded-xl p-6">
              Aún no hay películas o series registradas. Usa Gestión de Producciones para crear la primera.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {mediaList.map((item) => {
                const isBroken = brokenImages[item._id] || !item.coverImage;
                const isHighlighted = highlightedId === item._id;
                const created = formatDate(item.createdAt);
                const updated = formatDate(item.updatedAt);

                return (
                  <article
                    key={item._id}
                    ref={(el) => {
                      if (el) {
                        cardRefs.current[item._id] = el;
                      } else {
                        delete cardRefs.current[item._id];
                      }
                    }}
                    className={`group relative h-80 bg-slate-900 border rounded-2xl overflow-hidden shadow-md transition-all duration-300 ${
                      isHighlighted
                        ? 'border-purple-400 ring-2 ring-purple-500/80 scale-[1.02]'
                        : 'border-slate-800'
                    }`}
                  >
                    {isBroken ? (
                      <div className="w-full h-full bg-slate-800/90 flex flex-col items-center justify-center p-4 text-center">
                        <span className="text-sm font-semibold text-white">
                          {item.title}
                        </span>
                        <span className="text-xs text-slate-400 mt-1">
                          Portada no disponible
                        </span>
                      </div>
                    ) : (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        onError={() => markImageBroken(item._id)}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}

                    {/* Pie visible en reposo */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent p-3.5 transition-opacity duration-200 group-hover:opacity-0 pointer-events-none">
                      <div className="flex items-center justify-between text-[11px] text-purple-300">
                        <span>{item.serial}</span>
                        <span>{item.releaseYear}</span>
                      </div>
                      <h3 className="font-bold text-sm text-white truncate">
                        {item.title}
                      </h3>
                    </div>

                    {/* Panel de detalles y acciones al pasar el cursor */}
                    <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xs p-4 flex flex-col justify-between opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 overflow-y-auto">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 text-[11px] text-purple-300">
                          <span className="font-semibold">{item.serial}</span>
                          <span>{item.releaseYear}</span>
                        </div>

                        <h3 className="font-bold text-sm text-white leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                          {item.synopsis}
                        </p>

                        <div className="pt-1.5 border-t border-slate-800 text-[11px] text-slate-300 space-y-0.5">
                          <p className="truncate">
                            <span className="text-slate-400">Género:</span>{' '}
                            {getLabel(item.genre, catalogs.genres)}
                          </p>
                          <p className="truncate">
                            <span className="text-slate-400">Director:</span>{' '}
                            {getLabel(item.director, catalogs.directors)}
                          </p>
                          <p className="truncate">
                            <span className="text-slate-400">Productora:</span>{' '}
                            {getLabel(item.producer, catalogs.producers)}
                          </p>
                          <p className="truncate">
                            <span className="text-slate-400">Tipo:</span>{' '}
                            {getLabel(item.mediaType, catalogs.mediaTypes)}
                          </p>
                        </div>

                        {(created || updated) && (
                          <div className="pt-1 text-[10px] text-slate-500 flex flex-wrap gap-x-3">
                            {created && <span>Creado: {created}</span>}
                            {updated && <span>Act.: {updated}</span>}
                          </div>
                        )}
                      </div>

                      <div className="pt-2.5 mt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-purple-300 hover:text-purple-200"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Enlace
                          </a>
                        ) : (
                          <span />
                        )}

                        <div className="flex items-center gap-3">
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
                            <Trash2 className="w-3.5 h-3.5" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* FORMULARIO DESPLEGABLE CENTRADO (CONTROLADO DESDE EL HEADER) */}
        {isFormOpen && (
          <section
            ref={formSectionRef}
            id="media-form-section"
            className="max-w-4xl mx-auto w-full"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base font-semibold text-purple-300">
                    {editingId
                      ? 'Gestión de Producciones — Editar'
                      : 'Gestión de Producciones'}
                  </h2>
                  {editingId && (
                    <span className="text-xs text-amber-300 bg-amber-950/60 border border-amber-800 px-2.5 py-0.5 rounded-lg">
                      Modo edición
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleToggleForm}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Cerrar</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  ref={serialInputRef}
                  type="text"
                  name="serial"
                  placeholder="Serial único (ej. PEL-001)"
                  value={formData.serial}
                  onChange={handleChange}
                  required
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  name="title"
                  placeholder="Título"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                />
                <input
                  type="number"
                  name="releaseYear"
                  placeholder="Año (1889 - 2026)"
                  value={formData.releaseYear}
                  onChange={handleChange}
                  min="1889"
                  max="2026"
                  step="1"
                  required
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="url"
                  placeholder="URL única de la película o serie"
                  value={formData.url}
                  onChange={handleChange}
                  required
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  name="coverImage"
                  placeholder="URL de imagen de portada"
                  value={formData.coverImage}
                  onChange={handleChange}
                  required
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <textarea
                name="synopsis"
                placeholder="Sinopsis..."
                rows="2"
                value={formData.synopsis}
                onChange={handleChange}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Selecciona género activo</option>
                  {activeGenres.map((g) => (
                    <option key={g._id} value={g._id}>
                      {getOptionLabel(g)}
                    </option>
                  ))}
                </select>

                <select
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  required
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Selecciona director activo</option>
                  {activeDirectors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {getOptionLabel(d)}
                    </option>
                  ))}
                </select>

                <select
                  name="producer"
                  value={formData.producer}
                  onChange={handleChange}
                  required
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Selecciona productora activa</option>
                  {activeProducers.map((p) => (
                    <option key={p._id} value={p._id}>
                      {getOptionLabel(p)}
                    </option>
                  ))}
                </select>

                <select
                  name="mediaType"
                  value={formData.mediaType}
                  onChange={handleChange}
                  required
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Selecciona tipo</option>
                  {allMediaTypes.map((t) => (
                    <option key={t._id} value={t._id}>
                      {getOptionLabel(t)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  {submitting
                    ? 'Guardando...'
                    : editingId
                      ? 'Actualizar producción'
                      : 'Guardar producción'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2.5 rounded-xl text-sm transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}