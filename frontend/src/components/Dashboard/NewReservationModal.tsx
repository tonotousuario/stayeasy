import React, { useState, useEffect } from 'react';
import { reservationService } from '../../services/api';

interface NewReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewReservationModal: React.FC<NewReservationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    huespedId: '',
    habitacionId: '',
    fechaCheckIn: '',
    fechaCheckOut: '',
    numAdultos: 1,
    tarifaTotal: 0,
  });
  
  const [huespedes, setHuespedes] = useState<any[]>([]);
  const [habitaciones, setHabitaciones] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [huespedesRes, habitacionesRes] = await Promise.all([
        reservationService.getHuespedes(),
        reservationService.getHabitaciones()
      ]);
      
      if (huespedesRes.data) setHuespedes(huespedesRes.data);
      if (habitacionesRes.data) setHabitaciones(habitacionesRes.data);
    } catch (err) {
      console.error("Error cargando datos", err);
      setError("No se pudieron cargar las listas de huéspedes o habitaciones.");
    } finally {
      setLoadingData(false);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numAdultos' || name === 'tarifaTotal' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setError(null);

    const payload = {
      ...formData,
      fechaCheckIn: new Date(formData.fechaCheckIn).toISOString(),
      fechaCheckOut: new Date(formData.fechaCheckOut).toISOString(),
    };

    const response = await reservationService.createReservation(payload);

    setLoadingSubmit(false);
    if (response.error) {
      setError('Error al crear reserva: ' + response.error);
    } else {
      alert('Reserva creada exitosamente!');
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Nueva Reservación</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loadingData ? (
          <p className="text-center py-4">Cargando datos...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Huésped</label>
              <select
                name="huespedId"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                value={formData.huespedId}
                onChange={handleChange}
              >
                <option value="">Seleccione un huésped</option>
                {huespedes.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.nombre} {h.apellido} ({h.identificacion})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Habitación</label>
              <select
                name="habitacionId"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                value={formData.habitacionId}
                onChange={handleChange}
              >
                <option value="">Seleccione una habitación</option>
                {habitaciones.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.numero} - {h.estado}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Check-In</label>
                <input
                  type="datetime-local"
                  name="fechaCheckIn"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={formData.fechaCheckIn}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Check-Out</label>
                <input
                  type="datetime-local"
                  name="fechaCheckOut"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={formData.fechaCheckOut}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Adultos</label>
                <input
                  type="number"
                  name="numAdultos"
                  min="1"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={formData.numAdultos}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tarifa Total</label>
                <input
                  type="number"
                  name="tarifaTotal"
                  min="0"
                  step="0.01"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={formData.tarifaTotal}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loadingSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loadingSubmit ? 'Guardando...' : 'Crear Reserva'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewReservationModal;