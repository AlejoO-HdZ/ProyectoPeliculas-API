# Proyecto Películas IUD

---
# EA1 (Etapa Backend):  API REST - Sistema de Gestión de Películas y Series

API REST desarrollada con Node.js (utilizando JavaScript del lado del servidor), Express y MongoDB (Mongoose) para la gestión integral de producciones multimedia, catálogos de géneros, directores, productoras y tipos de multimedia; Orientada al rol Administrador para la gestión y cargue de contenidos.

## 🚀 Características Principales

* **Arquitectura Modular**: Organización en carpetas (`models`, `controllers`, `routes`, `config`).
* **Integridad de Datos**: Esquemas estrictos con validaciones de tipos, control de años (sin futuros, sin decimales, mayores a 1888) y campos obligatorios.
* **Unicidad Case-Insensitive**: Índices únicos configurados para ignorar mayúsculas y minúsculas en nombres, seriales y URLs (ej. evita duplicar campos. Ejemplo: Genero "Acción" con "ACCION").
* **Validación Cruzada de Negocio**: Al crear o actualizar una producción (`Media`), el sistema valida obligatoriamente que las entidades relacionadas (Género, Director, Productora) existan y se encuentren en estado **`Activo`**.
* **Respuestas Estandarizadas**: Uso de códigos de estado HTTP correctos (`200`, `201`, `400`, `404`, `500`) y marcas de tiempo UTC (`timestamps`).
* **Población de Relaciones**: Consultas optimizadas con `.populate()` para desplegar la información completa de las entidades asociadas.

---

# EA2 (Etapa Frontend): Front End - ReactJs

Aplicación web construida con React, Vite y Tailwind CSS que consume la API REST de la actividad anterior (EA1: API REST NodeJs) mediante Axios. Incluye navegación principal entre módulos, la gestión completa de producciones en Media (Películas y Series), con cartelera interactiva al pasar el cursor, formulario desplegable centrado, validación de año, manejo de duplicados en serial/URL y enfoque automático al crear, editar o mostrar errores, junto con la administración de sus catálogos relacionados (Géneros, Directores, Productoras y Tipos).

* **Conexión con la API REST (axiosClient)**: Consumo de endpoints para producciones (/media) y catálogos relacionados (/genres, /directors, /producers, /media-types) con manejo centralizado de respuestas y errores.

* **Navegación entre módulos**: Estructura organizada en frontend/src/App.jsx y frontend/src/pages/ para alternar entre Media (Películas y Series) y los módulos de catálogos (Géneros, Directores, Productoras y Tipos), apoyada en la vista compartida CatalogModuleView.jsx.

* **Cartelera interactiva en MediaPage.jsx**: Listado visual en cuadrícula con respaldo si falla la imagen de portada y panel de detalles y acciones (Enlace, Editar, Eliminar) al pasar el cursor.

* **Gestión de Producciones desplegable y centrada**: Activada desde el encabezado con un único disparador (+) que despliega el formulario centrado, hace scroll suave y enfoca el campo Serial.

* **Validaciones y retroalimentación inteligente**: Validación del año de estreno (entero entre 1889 y 2026), detección de Serial o URL duplicados con mensajes claros y enfoque automático hacia el error cuando ocurre un fallo; al guardar o actualizar sin errores, cierra el formulario y enfoca/resalta la producción resultante.

* **Selección de catálogos activos: Filtrado de registros activos (status === 'Activo') en los selectores de género, director y productora al registrar o editar producciones.

* **Módulos y rutas**: La aplicación organiza la navegación en pantallas dedicadas conectadas al backend:
    • Media (/media): Gestión completa (CRUD) de películas y series, vinculando cada registro con su género, director, productora y tipo.
    • Géneros (/genres): Creación, consulta, actualización y gestión de géneros.
    • Directores (/directors): Creación, consulta, actualización y gestión de directores.
    • Productoras (/producers): Creación, consulta, actualización y gestión de productoras.
    • Tipos (/media-types): Creación, consulta, actualización y gestión de tipos de media.

---

## 📐 Metodología de Desarrollo

El desarrollo del backend se ejecutó bajo un enfoque estructurado, modular y centrado en la **integridad de datos**, dividido en las siguientes fases:

1. **Diseño de Arquitectura Modular**:
   * Separación estricta de responsabilidades en capas lógicas: `config` (conexión a base de datos), `models` (esquemas y reglas Mongoose), `controllers` (lógica de negocio y control de errores) y `routes` (endpoints de la API).

2. **Modelado de Datos e Integridad Estricta**:
   * Creación de esquemas robustos con validación de tipos de datos, control de rangos (ej. años de producción válidos) y campos obligatorios.
   * Implementación de **índices únicos Case-Insensitive** para evitar duplicados por diferencias de mayúsculas y minúsculas.

3. **Validación Cruzada de Negocio**:
   * Programación de validaciones a nivel de controlador/modelo en la entidad `Media` para garantizar que las referencias cruzadas (Géneros, Directores, Productoras) existan y se encuentren obligatoriamente en estado **`Activo`** antes de permitir la creación o actualización.

4. **Estandarización de Respuestas y Pruebas**:
   * Implementación consistente de códigos de estado HTTP (`200`, `201`, `400`, `404`, `500`) para una comunicación predecible con el cliente.
   * Verificación local mediante **MongoDB Compass** para inspección de colecciones (`database`) y pruebas unitarias de endpoints con **Postman**.

Y el desarrollo del backend se ejecutó bajo una arquitectura modular por capas y dominios: 

5. **Organización del código dentro de frontend/** separando configuración y herramientas de compilación (package.json, vite.config.js, tailwind.config.js, eslint.config.js), cliente HTTP centralizado (src/api/axiosClient.js), componentes compartidos (src/components/CatalogModuleView.jsx) y pantallas por módulo (MediaPage.jsx, GenresPage.jsx, DirectorsPage.jsx, ProducersPage.jsx, MediaTypesPage.jsx).

6. **Desarrollo incremental por funcionalidades:** Construcción progresiva partiendo de la base de entorno y estilos, integrando el consumo de la API REST de EA1: API REST NodeJs, implementando las vistas de catálogos y el módulo principal de Media (Películas y Series), y refinando la experiencia de usuario con formulario desplegable centrado, validación de datos, manejo de duplicados y enfoque automático.

7. **Control de versiones con Conventional Commits:** Registro trazable del trabajo en Git mediante commits atómicos y mensajes estandarizados en español con prefijos chore:, feat: y docs: (abarcando configuración, cliente HTTP/vista compartida, páginas/navegación y documentación).

8. **Validación continua frente al backend y la UI:** Pruebas directas de operaciones CRUD, filtrado de catálogos activos (status === 'Activo'), validación de año (1889 a 2026), control de errores de duplicidad en serial o URL y verificación visual de la cartelera y el flujo del formulario.

---

## 🛠️ Tecnologías Utilizadas

### Para EA1: Backend:
* [Node.js](https://nodejs.org/) - Entorno de ejecución para JavaScript.
* [Express](https://expressjs.com/) - Framework web para Node.js.
* [MongoDB](https://www.mongodb.com/) - Base de datos NoSQL.
* [Mongoose](https://mongoosejs.com/) - ODM para modelado de datos de MongoDB.
* [CORS](https://www.npmjs.com/package/cors) - Habilitación de recursos de origen cruzado para futuras integraciones Frontend (React).
* [Dotenv](https://www.npmjs.com/package/dotenv) - Gestión de variables de entorno.

### Para EA2: Frontend:

* React: Biblioteca principal para construir la interfaz por componentes, manejar estados, efectos (useEffect) y referencias (useRef) en las vistas y formularios.
* Vite: Herramienta de desarrollo y empaquetado rápida para el servidor local y la compilación de producción del frontend.
* Tailwind CSS: Framework de utilidades CSS para el diseño responsivo, el tema oscuro, la cuadrícula de la cartelera y el formulario centrado.
* Axios (axiosClient): Cliente HTTP configurado para consumir los endpoints de la API REST (EA1: API REST NodeJs) en /media, /genres, /directors, /producers y /media-types.
* Lucide React: Librería de íconos vectoriales (Film, Plus, ChevronUp, Pencil, Trash2, ExternalLink, X) para la navegación, acciones en tarjetas y controles desplegables.
* ESLint: Herramienta de análisis estático para mantener la calidad y consistencia del código JavaScript/JSX.
* Git y Conventional Commits: Control de versiones con mensajes estandarizados en español (chore:, feat:, docs:) para documentar el avance del proyecto.


## 📦 Dependencias del Proyecto

El archivo del Backend: `package.json` incluye los siguientes paquetes principales para el funcionamiento del backend:

* **`express`**: Framework minimalista para la creación de rutas, middlewares y gestión del servidor HTTP.
* **`mongoose`**: ODM (Object Data Modeling) para MongoDB, encargado de definir esquemas estrictos, validaciones, índices y métodos relacionales (`.populate()`).
* **`dotenv`**: Librería para la carga segura de variables de entorno desde el archivo `.env`.
* **`cors`**: Middleware de Express para habilitar el intercambio de recursos de origen cruzado (CORS), permitiendo futuras conexiones con clientes frontend (como React).
* **`nodemon`** *(Dependencia de desarrollo)*: Herramienta que reinicia automáticamente el servidor Node.js al detectar cambios en el código durante la fase de desarrollo.

El archivo del Frontend: `package.json` incluye los siguientes paquetes principales para el funcionamiento del Frontend:

* **`react y react-dom`**: Biblioteca base de React para la construcción de la interfaz por componentes y su renderizado en el navegador.
* **`axios`**: Cliente HTTP utilizado a través de src/api/axiosClient.js para realizar peticiones (GET, POST, PUT, DELETE) a la API REST de EA1: API REST NodeJs.
* **`lucide-react`**: Conjunto de íconos (Film, Plus, ChevronUp, Pencil, Trash2, ExternalLink, X) empleados en encabezados, botones desplegables y acciones de la cartelera y catálogos.

Dependencias de desarrollo (devDependencies)
* **`vite y @vitejs/plugin-react`**: Servidor de desarrollo rápido y empaquetador para compilar la aplicación React.
* **`tailwindcss y @tailwindcss/vite`** (o postcss / autoprefixer, según la versión configurada en el proyecto): Framework CSS utilitario para el diseño responsivo, el tema oscuro y la maquetación de vistas y formularios.
* **`eslint`**: @eslint/js, globals, eslint-plugin-react-hooks y eslint-plugin-react-refresh: Herramientas de análisis estático y reglas de calidad para mantener el código limpio y consistente.
---

## 📂 Estructura del Proyecto (BACKEND)

```text
backend/
├── config/
│   └── database.js       # Conexión a MongoDB con Mongoose
├── controllers/   
│   ├── director.controller.js
│   ├── genre.controller.js
│   ├── media-type.controller.js
│   ├── media.controller.js
│   └── producer.controller.js
├── models/   
│   ├── director.model.js
│   ├── genre.model.js
│   ├── media-type.model.js
│   ├── media.model.js
│   └── producer.model.js
├── routes/
│   ├── director.routes.js
│   ├── genre.routes.js
│   ├── media-type.routes.js
│   ├── media.routes.js
│   └── producer.routes.js
├── app.js                # Configuración de Express y middlewares
├── index.js              # Punto de entrada de la aplicación
├── .env                  # Variables de entorno locales(Privado)
└── .env.example          # Plantilla de variables de entorno (Público)
```
## 📂 Estructura del Proyecto (FRONTEND)
```text
frontend/
├── src/
│   ├── api/
│   │   └── axiosClient.js          # Cliente HTTP centralizado (Axios + VITE_API_URL / localhost:3000)
│   ├── components/
│   │   └── CatalogModuleView.jsx   # Vista reutilizable para CRUD de catálogos
│   ├── pages/
│   │   ├── MediaPage.jsx           # Módulo principal: películas y series
│   │   ├── GenresPage.jsx          # Módulo de géneros
│   │   ├── DirectorsPage.jsx       # Módulo de directores
│   │   ├── ProducersPage.jsx       # Módulo de productoras
│   │   └── MediaTypesPage.jsx      # Módulo de tipos de media
│   ├── App.jsx                     # Navegación y rutas entre módulos
│   ├── App.css                     # Estilos específicos de App
│   ├── index.css                   # Estilos globales y directivas de Tailwind CSS
│   └── main.jsx                    # Punto de entrada de React en Vite
├── index.html                      # Plantilla HTML principal
├── package.json                    # Dependencias y scripts (dev, build, lint)
├── package-lock.json               # Bloqueo exacto de versiones instaladas
├── eslint.config.js                # Reglas de calidad y estilo de código
├── postcss.config.js               # Configuración de PostCSS
├── tailwind.config.js              # Configuración de Tailwind CSS
├── vite.config.js                  # Configuración de Vite
├── .gitignore                      # Exclusiones para Git (node_modules, dist, .env)
└── README.md                       # Documentación del proyecto

```

## ⚙️ Guía de Instalación y Configuración Local

Sigue estos pasos para clonar y poner en marcha el proyecto en la máquina local:

### 1. Clonar el repositorio y acceder a la carpeta

```bash
git clone <url-del-repositorio>
cd nombre-de-la-carpeta/backend

###  2. Instalar Dependencias

```bash
npm install

###  3. Configurar las variables de entorno
- Duplica el archivo .env.example y renómbralo a .env.

- Configura los valores de conexión según tu entorno local:
```bash
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/db_peliculas

###  4. Ejecutar el servidor
- Modo Desarrollo (con auto-recarga si usas nodemon):
```bash
npm run dev

- Modo Producción:
```bash
node index.js

###  5. El backend de EA1: API REST NodeJs en ejecución y accesible desde el navegador.

###  6. Para el Frontend: Requisitos previos: Node.js (versión 18 o superior recomendada) y npm.

- Crear el proyecto con Vite: Abre la terminal y ejecuta:
```bash
npm create vite@latest frontend -- --template react

- Ubícate en el directorio del frontend:
```bash
cd frontend

- Instala las dependencias del proyecto (principal, Tailwind CSS PostCSS y eslint)
# Instalar dependencias
npm install

# Librerías principales
npm install axios lucide-react react-router-dom

# Tailwind CSS 4
npm install tailwindcss @tailwindcss/vite

# PostCSS y Autoprefixer
npm install -D postcss autoprefixer

# ESLint
npm install -D eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh globals

- Configura la URL base de la API REST (axiosClient.js):
- Revisa src/api/axiosClient.js (y variables de entorno como VITE_API_URL, si las utilizas) para que apunten a la dirección y puerto donde corre tu API de EA1: API REST NodeJs (por ejemplo, http://localhost:4000/api o la ruta configurada en el backend). Asegúrate de que CORS esté habilitado en el servidor.
- Instala 
- Inicia el servidor de desarrollo:
```bash
npm run dev

- Abre en el navegador la URL local que muestre Vite (habitualmente http://localhost:517X).
- Compila para producción (opcional):
```bash
npm run build
Genera los archivos estáticos listos para despliegue dentro de dist/.
```
## 🔌 Endpoints Principales de la API en el Backend

| Módulo | Método | Endpoint | Descripción |
| :--- | :---: | :--- | :--- |
| **Géneros** | `POST` | `/api/genres` | Crea un nuevo género (Case-Insensitive) |
| | `GET` | `/api/genres` | Lista todos los géneros |
| | `GET` | `/api/genres/:id` | Consulta un género por ID |
| | `PUT` | `/api/genres/:id` | Actualiza un género |
| | `DEL` | `/api/genres/:id` | Elimina un género |
| **Directores** | `POST` | `/api/directors` | Crea un director |
| | `GET` | `/api/directors` | Lista todos los directores |
| | `GET` | `/api/directors/:id` | Consulta un director por ID |
| | `PUT` | `/api/directors/:id` | Actualiza un director |
| | `DEL` | `/api/directors/:id` | Elimina un director |
| **Productoras** | `POST` | `/api/producers` | Crea una productora |
| | `GET` | `/api/producers` | Lista todas las productoras |
| | `GET` | `/api/producers/:id` | Consulta una productora por ID |
| | `PUT` | `/api/producers/:id` | Actualiza una productora |
| | `DEL` | `/api/producers/:id` | Elimina una productora |
| **Tipos de Media**| `POST` | `/api/media-types` | Crea un tipo de multimedia |
| | `GET` | `/api/media-types` | Lista todos los tipos |
| | `GET` | `/api/media-types/:id`| Consulta un tipo por ID |
| | `PUT` | `/api/media-types/:id`| Actualiza un tipo |
| | `DEL` | `/api/media-types/:id`| Elimina un tipo |
| **Media** | `POST` | `/api/media` | Crea una película/serie (Valida relaciones Activas y año) |
| | `GET` | `/api/media` | Lista todas las producciones (con Populate) |
| | `GET` | `/api/media/:id` | Consulta una producción por ID |
| | `PUT` | `/api/media/:id` | Actualiza una producción |
| | `DEL` | `/api/media/:id` | Elimina una producción |


## 🔌 Endpoints Principales de la API en el Frontend

| Recurso / Módulo | Endpoint base | Operaciones consumidas desde el frontend | Uso en la aplicación |
| :--- | :--- | :--- | :--- |
| **Producciones (`Media`)** | `/media` | `GET /media`, `POST /media`, `PUT /media/:id`, `DELETE /media/:id` | Listado en cartelera, creación, edición y eliminación de películas y series (con `serial` y `url` únicos y `releaseYear` entre `1889` y `2026`). |
| **Géneros (`Genres`)** | `/genres` | `GET /genres` (y CRUD en su vista de catálogo) | Población del selector de géneros activos en `MediaPage.jsx` y administración del catálogo. |
| **Directores (`Directors`)** | `/directors` | `GET /directors` (y CRUD en su vista de catálogo) | Población del selector de directores activos en `MediaPage.jsx` y administración del catálogo. |
| **Productoras (`Producers`)** | `/producers` | `GET /producers` (y CRUD en su vista de catálogo) | Población del selector de productoras activas en `MediaPage.jsx` y administración del catálogo. |
| **Tipos de Media (`Media Types`)** | `/media-types` | `GET /media-types` (y CRUD en su vista de catálogo) | Población del selector de tipo de producción en `MediaPage.jsx` y administración del catálogo. |

> **Nota:** Si API de *EA1* backend expone las rutas bajo un prefijo (por ejemplo `/api`), configúrar en URL base de `axiosClient.js` y tener en cuenta que estas rutas se consumen relativas a dicha base.

## ⚠️ Códigos de Respuesta HTTP

La API utiliza códigos estándar para informar el resultado de cada solicitud:

* `200 OK`: La solicitud se completó correctamente (Lectura o Actualización exitosa).
* `201 Created`: El recurso se creó exitosamente (POST).
* `400 Bad Request`: Error de validación (faltan campos obligatorios, el año es inválido, relaciones inactivas o duplicados).
* `404 Not Found`: El recurso solicitado por ID no existe en la base de datos.
* `500 Internal Server Error`: Error inesperado en el servidor o fallo de conexión con MongoDB.

## 💻 Entorno de Desarrollo y Pruebas

El sistema fue probado y verificado bajo el siguiente entorno local:

* **Node.js**: `v26.12.1` (Entorno de ejecución JavaScript)
* **Express**: `v5.3.0` (Framework web)
* **Mongoose / MongoDB Driver**: Conectividad y modelado robusto de datos.
* **Base de Datos**: `database_peliculas` (Gestionada localmente en MongoDB).
* **Herramientas de Apoyo**: 
  * **MongoDB Compass**: Conectado exitosamente a `localhost:` para la inspección visual de colecciones (ej. `generos`, `media`, etc.).
  * **Postman**: Utilizado para la validación de endpoints y códigos de estado HTTP.

* **Entorno Local Frontend**: 
   * Entorno local: Verificado en equipo local con el servidor de desarrollo de Vite (npm run dev) conectado a la API REST en Node.js ejecutándose en http://localhost:3000/api (y su base de datos asociada).
   * Pruebas funcionales: Validación de carga de datos, creación, edición y eliminación de registros, así como del comportamiento ante respuestas exitosas y errores HTTP.

## 👤 Acerca del Proyecto
Desarrollado como parte 1 y 2 (Etapa 1 y 2) del sistema de gestión de backend con Node.js y MongoDB y Frontend con React-Vite, Tailwind CSS y PostCSS.

```
