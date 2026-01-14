// frontend/src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import type { Reservacion } from '../types/domain';

const dummyReservations: Reservacion[] = [
  {
    id: 'res-1',
    huespedId: 'huesped-1',
    habitacionId: 'room-101',
    fechaCheckIn: '2026-01-20T10:00:00Z',
    fechaCheckOut: '2026-01-25T12:00:00Z',
    numAdultos: 2,
    tarifaTotal: 500.00,
    estado: 'CONFIRMADA',
    fechaCreacion: '2026-01-01T08:00:00Z',
  },
  {
    id: 'res-2',
    huespedId: 'huesped-2',
    habitacionId: 'room-102',
    fechaCheckIn: '2026-01-22T14:00:00Z',
    fechaCheckOut: '2026-01-24T11:00:00Z',
    numAdultos: 1,
    tarifaTotal: 200.00,
    estado: 'CHECK_IN',
    fechaCreacion: '2026-01-10T09:00:00Z',
  },
];

export const handlers = [
  http.get('http://localhost:8080/api/v1/reservas', () => {
    return HttpResponse.json(dummyReservations);
  }),

  // Add more handlers for other endpoints (POST, PUT, DELETE, etc.)
  // and other resources (guests, rooms, etc.) as needed.
];
