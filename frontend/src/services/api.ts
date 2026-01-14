// frontend/src/services/api.ts

import type { HabitacionResponse, Huesped, HuespedRequest, LoginRequest, LoginResponse, Reservacion, RegisterRequest } from '../types/domain.ts';

const API_BASE_URL = 'http://localhost:8080/api/v1'; // Assuming backend runs on 8080

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

async function apiCall<T>(
  endpoint: string,
  method: string = 'GET',
  data: any = null,
  authRequired: boolean = false
): Promise<ApiResponse<T>> {
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (authRequired) {
    const token = localStorage.getItem('authToken'); 
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    } else {
      return { data: null, error: 'Authentication required' };
    }
  }

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 204) { // Handle No Content response
      return { data: null, error: null };
    }
    
    if (!response.ok) {
      try {
        const errorData = await response.json();
        return { data: null, error: errorData.error || errorData.message || `Error ${response.status}` };
      } catch (jsonError) {
        return { data: null, error: `Error ${response.status}: ${response.statusText}` };
      }
    }

    const responseData: T = await response.json();
    return { data: responseData, error: null };
  } catch (err: any) {
    console.error('API Call Error:', err);
    return { data: null, error: err.message || 'Network error' };
  }
}

// --- Auth Service ---
export const authService = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiCall('/auth/login', 'POST', credentials, false);
  },
  register: async (userData: RegisterRequest): Promise<ApiResponse<any>> => {
    return apiCall('/auth/register', 'POST', userData, false);
  },
};

// --- Reservation Service ---
export const reservationService = {
  getReservations: async (): Promise<ApiResponse<Reservacion[]>> => {
    return apiCall('/reservas', 'GET', null, true);
  },
  getReservationById: async (id: string): Promise<ApiResponse<Reservacion>> => {
    return apiCall(`/reservas/${id}`, 'GET', null, true);
  },
  createReservation: async (reservationData: any): Promise<ApiResponse<Reservacion>> => {
    return apiCall('/reservas', 'POST', reservationData, true);
  },
  updateReservation: async (id: string, reservationData: any): Promise<ApiResponse<Reservacion>> => {
    return apiCall(`/reservas/${id}`, 'PUT', reservationData, true);
  },
  deleteReservation: async (id: string): Promise<ApiResponse<any>> => {
    return apiCall(`/reservas/${id}`, 'DELETE', null, true);
  },
  searchReservations: async (query: string): Promise<ApiResponse<Reservacion[]>> => {
    return apiCall(`/reservas/buscar?q=${query}`, 'GET', null, true);
  },
  performCheckIn: async (id: string): Promise<ApiResponse<any>> => {
    return apiCall(`/reservas/${id}/check-in`, 'PATCH', null, true);
  },
  performCheckOut: async (id: string): Promise<ApiResponse<any>> => {
    return apiCall(`/reservas/${id}/checkout`, 'POST', null, true);
  },
};

// --- Guest Service ---
export const huespedService = {
  getHuespedes: async (): Promise<ApiResponse<Huesped[]>> => {
    return apiCall('/huespedes', 'GET', null, true);
  },
  getHuespedById: async (id: string): Promise<ApiResponse<Huesped>> => {
    return apiCall(`/huespedes/${id}`, 'GET', null, true);
  },
  createHuesped: async (huespedData: HuespedRequest): Promise<ApiResponse<Huesped>> => {
    return apiCall('/huespedes', 'POST', huespedData, true);
  },
  updateHuesped: async (id: string, huespedData: HuespedRequest): Promise<ApiResponse<Huesped>> => {
    return apiCall(`/huespedes/${id}`, 'PUT', huespedData, true);
  },
  deleteHuesped: async (id: string): Promise<ApiResponse<any>> => {
    return apiCall(`/huespedes/${id}`, 'DELETE', null, true);
  },
};

// --- Habitacion Service ---
export const habitacionService = {
  getHabitaciones: async (): Promise<ApiResponse<HabitacionResponse[]>> => {
    return apiCall('/habitaciones', 'GET', null, true);
  },
  updateHabitacionStatus: async (id: string, estado: string): Promise<ApiResponse<any>> => {
    return apiCall(`/habitaciones/${id}/estado`, 'PATCH', { estado }, true);
  },
};