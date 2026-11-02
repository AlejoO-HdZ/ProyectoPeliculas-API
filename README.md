# API REST - Sistema de Gestión de Películas y Series

# EA1 (Etapa Backend)

API REST desarrollada con Node.js (utilizando JavaScript del lado del servidor), Express y MongoDB (Mongoose) para la gestión integral de producciones multimedia, catálogos de géneros, directores, productoras y tipos de multimedia.
---

## 🚀 Características Principales

* **Arquitectura Modular**: Organización en carpetas (`models`, `controllers`, `routes`, `config`).
* **Integridad de Datos**: Esquemas estrictos con validaciones de tipos, control de años (sin futuros, sin decimales, mayores a 1888) y campos obligatorios.
* **Unicidad Case-Insensitive**: Índices únicos configurados para ignorar mayúsculas y minúsculas en nombres, seriales y URLs (ej. evita duplicar campos. Ejemplo: Genero "Acción" con "ACCION").
* **Validación Cruzada de Negocio**: Al crear o actualizar una producción (`Media`), el sistema valida obligatoriamente que las entidades relacionadas (Género, Director, Productora) existan y se encuentren en estado **`Activo`**.
* **Respuestas Estandarizadas**: Uso de códigos de estado HTTP correctos (`200`, `201`, `400`, `404`, `500`) y marcas de tiempo UTC (`timestamps`).
* **Población de Relaciones**: Consultas optimizadas con `.populate()` para desplegar la información completa de las entidades asociadas.

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

---

## 🛠️ Tecnologías Utilizadas

* [Node.js](https://nodejs.org/) - Entorno de ejecución para JavaScript.
* [Express](https://expressjs.com/) - Framework web para Node.js.
* [MongoDB](https://www.mongodb.com/) - Base de datos NoSQL.
* [Mongoose](https://mongoosejs.com/) - ODM para modelado de datos de MongoDB.
* [CORS](https://www.npmjs.com/package/cors) - Habilitación de recursos de origen cruzado para futuras integraciones Frontend (React).
* [Dotenv](https://www.npmjs.com/package/dotenv) - Gestión de variables de entorno.

## 📦 Dependencias del Proyecto

El archivo `package.json` incluye los siguientes paquetes principales para el funcionamiento del backend:

* **`express`**: Framework minimalista para la creación de rutas, middlewares y gestión del servidor HTTP.
* **`mongoose`**: ODM (Object Data Modeling) para MongoDB, encargado de definir esquemas estrictos, validaciones, índices y métodos relacionales (`.populate()`).
* **`dotenv`**: Librería para la carga segura de variables de entorno desde el archivo `.env`.
* **`cors`**: Middleware de Express para habilitar el intercambio de recursos de origen cruzado (CORS), permitiendo futuras conexiones con clientes frontend (como React).
* **`nodemon`** *(Dependencia de desarrollo)*: Herramienta que reinicia automáticamente el servidor Node.js al detectar cambios en el código durante la fase de desarrollo.

---

## 📂 Estructura del Proyecto

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

## ⚙️ Guía de Instalación y Configuración Local

Sigue estos pasos para clonar y poner en marcha el proyecto en tu máquina local:

### 1. Clonar el repositorio y acceder a la carpeta
```bash
git clone <url-de-tu-repositorio>
cd nombre-de-la-carpeta/backend

###  2. Instalar las dependencias
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

## 🔌 Endpoints Principales de la API

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

## 👤 Acerca del Proyecto
Desarrollado como parte 1 (Etapa 1) del sistema de gestión de backend con Node.js y MongoDB