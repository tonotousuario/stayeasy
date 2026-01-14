// frontend/src/components/Reception/CheckInForm.tsx
import React, { useState } from 'react';

const CheckInForm: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [reservationFound, setReservationFound] = useState<boolean>(false);
  const [identityValidated, setIdentityValidated] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would call an API to search for a reservation
    console.log('Searching for reservation:', searchQuery);
    // Simulate a search result
    if (searchQuery.toLowerCase().includes('reserva123') || searchQuery.toLowerCase().includes('perez')) {
      setReservationFound(true);
    } else {
      setReservationFound(false);
    }
  };

  const handleIdentityValidation = () => {
    // Simulate identity validation
    setIdentityValidated(true);
    alert('Identidad validada.');
  };

  const handleProcessCheckIn = () => {
    if (reservationFound && identityValidated) {
      alert('Check-in procesado con éxito!');
      // In a real application, this would call an API to update reservation status
      setSearchQuery('');
      setReservationFound(false);
      setIdentityValidated(false);
    } else {
      alert('Por favor, busque una reserva y valide la identidad primero.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Formulario de Check-in</h2>

      {/* Search Reservation */}
      <form onSubmit={handleSearch} className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Buscar Reserva (ID o Apellido):
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            id="search"
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ej. reserva123 o Perez"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Buscar
          </button>
        </div>
      </form>

      {reservationFound && (
        <div className="border border-gray-200 p-4 rounded-md mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Detalles de la Reserva</h3>
          <p><strong>ID de Reserva:</strong> RES-12345</p>
          <p><strong>Huésped:</strong> Juan Perez</p>
          <p><strong>Habitación:</strong> 101 - Doble</p>
          <p><strong>Check-in:</strong> 15 Ene 2026</p>
          <p><strong>Check-out:</strong> 18 Ene 2026</p>

          {/* Identity Validation */}
          <div className="mt-4">
            <label htmlFor="identity" className="block text-sm font-medium text-gray-700 mb-2">
              Documento de Identidad (INE/Pasaporte):
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                id="identity"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Número de documento"
                disabled={identityValidated}
              />
              <button
                onClick={handleIdentityValidation}
                className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  identityValidated ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500'
                }`}
                disabled={identityValidated}
              >
                {identityValidated ? 'Validado' : 'Validar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Process Check-in Button */}
      <button
        onClick={handleProcessCheckIn}
        className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
          reservationFound && identityValidated ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500' : 'bg-gray-400 cursor-not-allowed'
        }`}
        disabled={!reservationFound || !identityValidated}
      >
        Procesar Check-in
      </button>
    </div>
  );
};

export default CheckInForm;
