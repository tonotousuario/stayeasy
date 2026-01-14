// frontend/src/services/api.ts

const API_BASE_URL = 'http://localhost:8080/api/v1'; // Assuming backend runs on 8080

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

async function apiCall<T>(
  endpoint: string,
  method: string = 'GET',
  data: any = null
): Promise<ApiResponse<T>> {
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      try {
        const errorData = await response.json();
        // Asumiendo que el backend envía un objeto con una clave 'error' o 'message'
        return { data: null, error: errorData.error || errorData.message || `Error ${response.status}` };
      } catch (jsonError) {
        // Si la respuesta no es JSON o está vacía, manejamos un error genérico
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

// Example usage (can be expanded with specific service functions)
export const reservationService = {
  getReservations: async (): Promise<ApiResponse<any[]>> => {
    return apiCall('/reservas');
  },
  createReservation: async (reservationData: any): Promise<ApiResponse<any>> => {
    return apiCall('/reservas', 'POST', reservationData);
  },
  getHabitaciones: async (): Promise<ApiResponse<any[]>> => {
    return apiCall('/habitaciones');
  },
  getHuespedes: async (): Promise<ApiResponse<any[]>> => {
    return apiCall('/huespedes');
  },
  searchReservations: async (query: string): Promise<ApiResponse<any[]>> => {
    return apiCall(`/reservas/buscar?q=${query}`);
  },
  performCheckIn: async (id: string): Promise<ApiResponse<any>> => {
    return apiCall(`/reservas/${id}/check-in`, 'PATCH');
  }
};

export const guestService = {
  getGuestById: async (id: string): Promise<ApiResponse<any>> => {
    return apiCall(`/guests/${id}`);
  },
  // Add other service methods as needed
};
