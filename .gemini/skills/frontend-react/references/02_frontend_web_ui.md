# 02_frontend_web_ui.md

## Plan de Implementación: Frontend Web (Agente UI/UX)

**Rol:** Agente Frontend
[cite_start]**Objetivo:** Construir una interfaz moderna, responsiva y fuertemente tipada para los módulos de Recepción y Administración, asegurando una experiencia de usuario ágil (< 3 min por operación)[cite: 46].
**Stack:** React 18, TypeScript, Vite, TailwindCSS (recomendado para agilidad), Jest + React Testing Library.

### 1. Configuración del Entorno y Tipado Seguro

- [cite_start]**Inicialización:** Crear proyecto con `npm create vite@latest frontend -- --template react-ts`[cite: 147].
- **Contrato de Datos (Mirroring):**
  - Crear `src/types/domain.ts`.
  - [cite_start]**Acción Crítica:** Definir interfaces que repliquen EXACTAMENTE los modelos del Backend para garantizar la integridad[cite: 151].
  - _Ejemplo:_
    ```typescript
    export interface Reservacion {
      id: string;
      huespedId: string;
      fechaCheckIn: string; // ISO Date
      fechaCheckOut: string;
      estado: "CONFIRMADA" | "CHECK_IN" | "CANCELADA";
    }
    ```

### 2. Desarrollo de Módulos (Vistas Principales)

#### 2.1. Dashboard Principal (Resumen Operativo)

- [cite_start]**Requerimiento:** Mostrar métricas clave al iniciar sesión[cite: 293].
- **Componentes a desarrollar:**
  - `StatsCard`: Para mostrar "% Ocupación", "Llegadas Hoy", "Salidas Hoy".
  - `QuickActions`: Botones de acceso directo a "Nueva Reserva" y "Check-in".

#### 2.2. Calendario de Reservaciones (El Corazón del Sistema)

- [cite_start]**Requerimiento:** Visualización mensual/semanal de la ocupación por habitación (Eje Y: Habitaciones, Eje X: Fechas)[cite: 294].
- **Funcionalidad:**
  - Celdas coloreadas según estado (Azul: Confirmada, Verde: Ocupada, Rojo: Mantenimiento).
  - Al hacer clic en celda vacía -> Abrir modal `CreateReservationForm`.
  - [cite_start]Al hacer clic en reserva existente -> Abrir modal de Detalles (Modificar/Cancelar)[cite: 27].

#### 2.3. Módulo de Recepción (Check-in/Check-out)

- [cite_start]**Requerimiento:** Proceso optimizado para reducir tiempo de espera[cite: 47].
- **Formulario de Check-in:**
  - Buscar reserva por apellido o ID.
  - [cite_start]Validar documento de identidad (INE/Pasaporte)[cite: 296].
  - Botón final "Procesar Check-in" que cambia estado a "OCUPADA".

### 3. Integración con API (Capa de Adaptadores)

- **Patrón:** Repository/Service en el Frontend.
- Crear `src/services/api.ts`:
  - Configurar `axios` o `fetch` con la URL base del Backend.
  - Manejar errores HTTP (400, 404, 500) y mostrar alertas amigables (Toast Notifications) al usuario.
- [cite_start]**Mocking:** Si el Backend no está listo, usar **MSW (Mock Service Worker)** para simular respuestas exitosas y continuar el desarrollo de la UI[cite: 97].

### 4. Estrategia de Pruebas (QA Frontend)

- [cite_start]**Herramientas:** Jest + React Testing Library (RTL)[cite: 212].
- **Test Case Prioritario (Check-in):**
  - _Escenario:_ "El botón de confirmar Check-in debe estar deshabilitado si no se ha verificado la identidad del huésped".
- [cite_start]**Validación RNF:** Verificar que la carga del calendario sea menor a 2 segundos con datos simulados[cite: 341].

### Criterios de Aceptación (DoD)

- [ ] La aplicación compila sin errores de TypeScript (`no-implicit-any`).
- [ ] El flujo de "Crear Reserva" genera un JSON válido en la consola.
- [ ] [cite_start]La interfaz es responsiva y funciona en Chrome y Firefox[cite: 345].
