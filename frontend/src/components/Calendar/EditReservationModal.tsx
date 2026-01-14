import React, { useState, useEffect } from 'react';
import { reservationService, huespedService, habitacionService } from '../../services/api';
import type { Reservacion, Huesped, HabitacionResponse } from '../../types/domain.ts';

interface EditReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  reservationToEdit: Reservacion | null;
}

const EditReservationModal: React.FC<EditReservationModalProps> = ({ isOpen, onClose, onSuccess, reservationToEdit }) => {
  const [formData, setFormData] = useState({
    huespedId: '',
    habitacionId: '',
    fechaCheckIn: '',
    fechaCheckOut: '',
    numAdultos: 1,
    tarifaTotal: 0,
    estado: ''
  });
  
  const [huespedes, setHuespedes] = useState<Huesped[]>([]);
  const [habitaciones, setHabitaciones] = useState<HabitacionResponse[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && reservationToEdit) {
      loadData();
      // Populate form with existing reservation data
      setFormData({
        huespedId: reservationToEdit.huespedId,
        habitacionId: reservationToEdit.habitacionId,
        fechaCheckIn: reservationToEdit.fechaCheckIn.substring(0, 16), // Format for datetime-local
        fechaCheckOut: reservationToEdit.fechaCheckOut.substring(0, 16), // Format for datetime-local
        numAdultos: reservationToEdit.numAdultos,
        tarifaTotal: reservationToEdit.tarifaTotal,
        estado: reservationToEdit.estado
      });
    } else if (isOpen && !reservationToEdit) {
        // If modal is open but no reservation to edit (e.g., for new reservation flow, though this modal is for EDIT)
        // Reset form or handle as appropriate. For now, this is assumed to be an edit modal.
        setFormData({
            huespedId: '',
            habitacionId: '',
            fechaCheckIn: '',
            fechaCheckOut: '',
            numAdultos: 1,
            tarifaTotal: 0,
            estado: ''
        });
    }
  }, [isOpen, reservationToEdit]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [huespedesRes, habitacionesRes] = await Promise.all([
        huespedService.getHuespedes(),
        habitacionService.getHabitaciones()
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

    if (!reservationToEdit) {
        setError("No hay reservación para editar.");
        setLoadingSubmit(false);
        return;
    }

    const payload = {
      ...formData,
      fechaCheckIn: formData.fechaCheckIn, // YYYY-MM-DDTHH:mm
      fechaCheckOut: formData.fechaCheckOut, // YYYY-MM-DDTHH:mm
    };

    const response = await reservationService.updateReservation(reservationToEdit.id, payload);

    setLoadingSubmit(false);
    if (response.error) {
      setError('Error al actualizar reserva: ' + response.error);
    } else {
      alert('Reserva actualizada exitosamente!');
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Editar Reservación {reservationToEdit?.id.substring(0, 8)}...</h2>
        
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

            <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <select
                    name="estado"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    value={formData.estado}
                    onChange={handleChange}
                >
                    <option value="CONFIRMADA">CONFIRMADA</option>
                    <option value="CHECK_IN">CHECK_IN</option>
                    <option value="CANCELADA">CANCELADA</option>
                    <option value="CHECK_OUT">CHECK_OUT</option> {/* Should be set by checkout action, not manual edit */}
                </select>
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
                {loadingSubmit ? 'Actualizando...' : 'Actualizar Reserva'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditReservationModal;