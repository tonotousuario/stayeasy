// frontend/src/types/domain.ts

/**
 * Roles de usuario para el sistema.
 */
export type UserRole = "ADMIN" | "RECEPTIONIST";

/**
 * Representa un usuario del sistema.
 */
export interface User {
  id: string; // UUID
  username: string;
  role: UserRole;
}

/**
 * Request para el login de usuario.
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Response del login de usuario. Contiene el token JWT.
 */
export interface LoginResponse {
  token: string;
}

/**
 * Request para el registro de usuario.
 */
export interface RegisterRequest {
  username: string;
  password: string;
  role: UserRole;
}

/**
 * Representa a un cliente del hotel.
 */
export interface Huesped {
  id: string; // UUID
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  identificacion: string;
}

/**
 * Request para crear o actualizar un Huésped.
 */
export interface HuespedRequest {
  id?: string; // Optional for creation
  nombre: string;
  apellido: string;
  email: string;
  identificacion: string;
}

/**
 * Define los tipos de habitaciones disponibles (ej. Suite, Doble, King).
 */
export interface TipoHabitacion {
  id: string; // UUID
  nombre: string;
  capacidadMaxima: number;
  tarifaBase: number;
}

/**
 * Define los posibles estados de una habitación (ej. Limpia, Sucia, Mantenimiento).
 */
export interface EstadoHabitacion {
  codigo: string;
  descripcion: string;
}

/**
 * Representa una habitación física en el hotel.
 */
export interface Habitacion {
  id: string; // UUID
  numero: number;
  tipoHabitacionId: string; // UUID
  estado: string; // FK a EstadoHabitacion.codigo
  descripcion?: string;
}

/**
 * Response para una Habitación.
 */
export interface HabitacionResponse {
  id: string; // UUID
  numero: number;
  tipoId: string; // UUID
  estado: string; // EstadoHabitacion.name
  descripcion?: string;
}

/**
 * Representa el estado de una reservación.
 */
export type EstadoReservacion =
  | "CONFIRMADA"
  | "CHECK_IN"
  | "CHECK_OUT"
  | "CANCELADA";

/**
 * Representa una reservación hecha por un huésped.
 */
export interface Reservacion {
  id: string; // UUID
  huespedId: string; // UUID
  habitacionId: string; // UUID
  fechaCheckIn: string; // ISO Date String
  fechaCheckOut: string; // ISO Date String
  numAdultos: number;
  tarifaTotal: number;
  estado: EstadoReservacion;
  fechaCreacion: string; // ISO Date String
}

/**
 * Representa el estado de una factura.
 */
export type EstadoFactura = "PAGADA" | "PENDIENTE" | "ANULADA";

/**
 * Representa una factura asociada a una reservación.
 */
export interface Factura {
  id: string; // UUID
  reservacionId: string; // UUID
  subtotal: number;
  iva: number;
  total: number;
  fechaEmision: string; // ISO Date String
  estado: EstadoFactura;
}

