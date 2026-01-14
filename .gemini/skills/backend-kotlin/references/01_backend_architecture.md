# 01_backend_architecture.md

## Plan de Implementación: Backend Master (Core + API + DB)

**Rol:** Agente Backend (Fusión de Lógica de Negocio y Adaptadores)
**Objetivo:** Desarrollar el núcleo de la aplicación bajo Arquitectura Hexagonal y exponerlo mediante una API REST, asegurando la persistencia en PostgreSQL.
**Stack:** Kotlin, Ktor 3.x, PostgreSQL, Exposed (ORM), JUnit 5, MockK.

### 1. Principios de Arquitectura (Reglas de Oro)

[cite_start]Para cumplir con el diseño hexagonal definido en el proyecto "StayEasy"[cite: 56]:

1.  **El Dominio es Sagrado:** El paquete `domain` NO debe tener dependencias de frameworks (Ktor, Exposed, SQL). [cite_start]Solo Kotlin puro[cite: 69, 140].
2.  [cite_start]**Puertos (Interfaces):** Toda comunicación hacia afuera (BD, API) se define primero como una `interface` en el dominio[cite: 73].
3.  [cite_start]**Adaptadores:** La implementación real de la base de datos va en `infrastructure/adapters`[cite: 83].

### 2. Tareas de Desarrollo (Flujo TDD)

#### Fase A: El Núcleo (Domain)

_Implementar primero, usando TDD puro (sin levantar servidor)._

1.  **Entidades y Value Objects:**
    - [cite_start]Crear `Huesped`: debe incluir `id_huesped` (UUID), `nombre`, `email` (validar formato), `identificacion` (INE/Pasaporte)[cite: 180].
    - [cite_start]Crear `Habitacion`: incluir `numero`, `tipo` y `estado` (LIMPIA, SUCIA, MANTENIMIENTO)[cite: 186, 184].
    - [cite_start]Crear `Reservacion`: incluir fechas (`check_in`, `check_out`), `tarifa_total` y lógica para calcular días de estancia[cite: 188].

2.  **Puertos (Repository Interfaces):**
    - [cite_start]Definir `ReservacionRepository`: métodos `guardar(reserva)`, `buscarPorFecha(inicio, fin)`, `cancelar(id)`[cite: 80].
    - Definir `HabitacionRepository`: método `obtenerDisponibles()`.

3.  **Servicios de Dominio (Lógica):**
    - _Test:_ "Crear reserva en fecha ocupada debe lanzar error".
    - [cite_start]Implementar `ReservacionService.crear()`: Validar que la habitación no tenga solapamiento de fechas antes de confirmar[cite: 71, 76].

#### Fase B: Adaptadores de Infraestructura (Driven Adapters)

1.  **Persistencia (PostgreSQL + Exposed):**
    - [cite_start]Configurar la conexión a la BD `stayeasy_db`[cite: 145].
    - [cite_start]Crear las tablas SQL (`Table` objects en Exposed) mapeando exactamente el esquema definido (Tablas `huesped`, `habitacion`, `reservacion`, `factura`)[cite: 180, 188, 190].
    - Implementar las interfaces definidas en la Fase A (ej. `PostgresReservacionRepository`).

#### Fase C: Adaptador API (Driving Adapter - Ktor)

1.  **Configuración Ktor:**
    - [cite_start]Configurar Netty, ContentNegotiation (JSON/Gson/Kotlinx.serialization) y manejo de errores (StatusPages)[cite: 141].
2.  **Rutas (Endpoints):**
    - `POST /api/v1/reservas`: Recibe JSON, invoca `ReservacionService`, retorna 201 Created.
    - `GET /api/v1/habitaciones`: Retorna lista de habitaciones y su estado actual.
    - [cite_start]`POST /api/v1/checkin`: Endpoint crítico para cambiar estado a "Ocupada"[cite: 333].

### 3. Entregables del Agente

- Código fuente compilable en Kotlin.
- Tests unitarios (Domain) y de integración (Repositories) pasando en verde.
- Script `init.sql` o migración inicial para la estructura de la base de datos.
