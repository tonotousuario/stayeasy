import React, { useState } from 'react';
import { reservationService } from '../../services/api';

const CheckInForm: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [foundReservations, setFoundReservations] = useState<any[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setFoundReservations([]);
    setSelectedReservation(null);

    const response = await reservationService.searchReservations(searchQuery);
    setIsLoading(false);

    if (response.error) {
      setError(response.error);
    } else if (response.data && response.data.length > 0) {
      setFoundReservations(response.data);
    } else {
      setError('No se encontraron reservaciones.');
    }
  };

  const handleProcessCheckIn = async () => {
    if (!selectedReservation) return;

    setIsLoading(true);
    setError(null);

    const response = await reservationService.performCheckIn(selectedReservation.id);
    setIsLoading(false);

    if (response.error) {
      setError(`Error al hacer check-in: ${response.error}`);
    } else {
      alert('Check-in procesado con éxito!');
      // Resetear el formulario
      setSearchQuery('');
      setFoundReservations([]);
      setSelectedReservation(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Formulario de Check-in</h2>

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
            placeholder="Ej. Juan o a0eebc99-..."
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Resultados de búsqueda */}
      {foundReservations.length > 0 && !selectedReservation && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Resultados Encontrados:</h3>
          <ul className="border border-gray-200 rounded-md mt-2">
            {foundReservations.map((res) => (
              <li
                key={res.id}
                onClick={() => setSelectedReservation(res)}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
              >
                ID: {res.id.substring(0, 8)}... | Check-In: {new Date(res.fechaCheckIn).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detalles de la reserva seleccionada */}
      {selectedReservation && (
        <div className="border border-gray-200 p-4 rounded-md mb-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Detalles de la Reserva</h3>
          <p><strong>ID:</strong> {selectedReservation.id}</p>
          <p><strong>Habitación ID:</strong> {selectedReservation.habitacionId}</p>
          <p><strong>Check-in:</strong> {new Date(selectedReservation.fechaCheckIn).toLocaleString()}</p>
          <p><strong>Check-out:</strong> {new Date(selectedReservation.fechaCheckOut).toLocaleString()}</p>
          <p><strong>Estado:</strong> <span className="font-mono bg-gray-200 px-2 py-1 rounded">{selectedReservation.estado}</span></p>
          
          <button
            onClick={handleProcessCheckIn}
            disabled={isLoading || selectedReservation.estado !== 'CONFIRMADA'}
            className="w-full mt-4 px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-green-500 hover:bg-green-600 disabled:bg-gray-400"
          >
            {isLoading ? 'Procesando...' : 'Procesar Check-in'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckInForm;