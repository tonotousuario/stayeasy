import React, { useState, useEffect } from 'react';
import { habitacionService } from '../../services/api';
import type { HabitacionResponse } from '../../types/domain.ts';

const RoomManagementPage: React.FC = () => {
  const [habitaciones, setHabitaciones] = useState<HabitacionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const roomStatuses = ["LIMPIA", "SUCIA", "MANTENIMIENTO", "OCUPADA"]; // TODO: Fetch from backend if dynamic

  useEffect(() => {
    fetchHabitaciones();
  }, []);

  const fetchHabitaciones = async () => {
    setLoading(true);
    const response = await habitacionService.getHabitaciones();
    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setHabitaciones(response.data);
    }
    setLoading(false);
  };

  const handleStatusChange = async (habitacionId: string, newStatus: string) => {
    if (window.confirm(`¿Estás seguro de que quieres cambiar el estado de la habitación ${habitacionId.substring(0,4)}... a ${newStatus}?`)) {
      const response = await habitacionService.updateHabitacionStatus(habitacionId, newStatus);
      if (response.error) {
        setError(response.error);
      } else {
        alert('Estado actualizado exitosamente.');
        fetchHabitaciones(); // Refresh the list
      }
    }
  };

  if (loading) return <div className="p-4 text-center">Cargando habitaciones...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Gestión de Habitaciones</h2>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Número
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {habitaciones.map((habitacion) => (
              <tr key={habitacion.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {habitacion.numero}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {habitacion.descripcion || 'N/A'}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                      habitacion.estado === 'LIMPIA' ? 'text-green-900' :
                      habitacion.estado === 'OCUPADA' ? 'text-red-900' :
                      'text-yellow-900'
                  }`}>
                    <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full ${
                        habitacion.estado === 'LIMPIA' ? 'bg-green-200' :
                        habitacion.estado === 'OCUPADA' ? 'bg-red-200' :
                        'bg-yellow-200'
                    }`}></span>
                    <span className="relative">{habitacion.estado}</span>
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <select 
                    value={habitacion.estado} 
                    onChange={(e) => handleStatusChange(habitacion.id, e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
                  >
                    {roomStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomManagementPage;