# StayEasy - Sistema de Gestión Hotelera

StayEasy es una aplicación web full-stack para la gestión de reservas y operaciones hoteleras. Cuenta con un backend robusto en Kotlin (Ktor) y un frontend interactivo en React (Vite).

## Arquitectura

El proyecto está dividido en dos módulos principales: `backend/` y `frontend/`.

### Backend (`backend/`)
- **Lenguaje:** Kotlin
- **Framework:** Ktor
- **Base de Datos:** PostgreSQL
- **Acceso a Datos:** Exposed (framework de SQL)
- **Principios:** Arquitectura Hexagonal (Puertos y Adaptadores) para un diseño desacoplado y mantenible.

### Frontend (`frontend/`)
- **Framework:** React con Vite
- **Lenguaje:** TypeScript
- **Estilos:** TailwindCSS
- **Componentes:** React Icons para la iconografía.

## Características Implementadas

- **Gestión de Reservas:**
  - Creación de nuevas reservas a través de un modal interactivo.
  - Calendario visual para ver las reservas por habitación y fecha.
- **Check-in:**
  - Formulario para buscar reservas por ID o apellido.
  - Funcionalidad para procesar el check-in, actualizando el estado de la reserva y la habitación.
- **Población de Datos (Seeding):** El backend inserta datos de prueba automáticamente al arrancar si la base de datos está vacía, facilitando las pruebas.
- **API RESTful:** Endpoints para gestionar habitaciones, huéspedes y reservaciones.

---

## Requisitos Previos

- **Java 21:** Para ejecutar el backend.
- **Node.js y npm/pnpm/yarn:** Para el frontend.
- **Docker y Docker Compose:** Para la base de datos PostgreSQL.

---

## Guía de Inicio Rápido

### 1. Configuración de la Base de Datos

El backend utiliza una base de datos PostgreSQL, que puedes levantar fácilmente con Docker.

```bash
# Desde la carpeta /backend
docker compose up -d
```
Esto iniciará un contenedor con una base de datos `stayeasy_db`, usuario `postgres` y contraseña `password`.

Para limpiar la base de datos y empezar de cero:
```bash
# Desde la carpeta /backend
docker compose down -v
```

### 2. Ejecutar el Backend

El backend se ejecuta con el wrapper de Gradle.

```bash
# Navega a la carpeta del backend
cd backend

# Asegúrate de tener JAVA_HOME apuntando a tu JDK 21
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk/ # Ajusta la ruta si es necesario

# Ejecuta la aplicación
./gradlew run
```
El servidor se iniciará en `http://localhost:8080`. Al arrancar por primera vez, poblará la base de datos con datos de prueba.

### 3. Ejecutar el Frontend

En una terminal separada, inicia el frontend.

```bash
# Navega a la carpeta del frontend
cd frontend

# Instala las dependencias (solo la primera vez)
npm install

# Inicia el servidor de desarrollo
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

---

## Endpoints de la API

- `GET /api/v1/habitaciones`: Obtiene la lista de todas las habitaciones.
- `GET /api/v1/huespedes`: Obtiene la lista de todos los huéspedes.
- `GET /api/v1/reservas`: Obtiene la lista de todas las reservaciones.
- `GET /api/v-1/reservas/buscar?q={termino}`: Busca reservaciones por ID o apellido del huésped.
- `POST /api/v1/reservas`: Crea una nueva reserva.
- `PATCH /api/v1/reservas/{id}/check-in`: Realiza el check-in de una reserva.
