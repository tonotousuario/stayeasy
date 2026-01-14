import React, { useState, useEffect } from 'react';
import { huespedService } from '../../services/api';
import type { Huesped, HuespedRequest } from '../../types/domain.ts';
import GuestFormModal from './GuestFormModal'; // New import

const GuestManagementPage: React.FC = () => {
  const [huespedes, setHuespedes] = useState<Huesped[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // New state for modal visibility
  const [guestToEdit, setGuestToEdit] = useState<Huesped | null>(null); // New state for guest being edited

  useEffect(() => {
    fetchHuespedes();
  }, []);

  const fetchHuespedes = async () => {
    setLoading(true);
    const response = await huespedService.getHuespedes();
    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setHuespedes(response.data);
    }
    setLoading(false);
  };

  const handleAddGuest = () => {
    setGuestToEdit(null); // Clear guestToEdit for new guest
    setIsModalOpen(true);
  };

  const handleEditGuest = (huesped: Huesped) => {
    setGuestToEdit(huesped);
    setIsModalOpen(true);
  };

  const handleSaveGuest = async (guestData: HuespedRequest) => {
    let response;
    if (guestToEdit) {
      // Update existing guest
      response = await huespedService.updateHuesped(guestToEdit.id, guestData);
    } else {
      // Create new guest
      response = await huespedService.createHuesped(guestData);
    }

    if (response.error) {
      setError(response.error);
    } else {
      alert(`Huésped ${guestToEdit ? 'actualizado' : 'añadido'} exitosamente.`);
      setIsModalOpen(false); // Close modal
      fetchHuespedes(); // Refresh the list
    }
  };

  const handleDeleteGuest = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este huésped?')) {
      const response = await huespedService.deleteHuesped(id);
      if (response.error) {
        setError(response.error);
      } else {
        alert('Huésped eliminado exitosamente.');
        fetchHuespedes(); // Refresh the list
      }
    }
  };

  if (loading) return <div className="p-4 text-center">Cargando huéspedes...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Gestión de Huéspedes</h2>
      <button
        onClick={handleAddGuest}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Añadir Nuevo Huésped
      </button>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Apellido
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Identificación
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {huespedes.map((huesped) => (
              <tr key={huesped.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {huesped.nombre}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {huesped.apellido}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {huesped.email}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {huesped.identificacion}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button onClick={() => handleEditGuest(huesped)} className="text-blue-600 hover:text-blue-900 mr-3">
                    Editar
                  </button>
                  <button onClick={() => handleDeleteGuest(huesped.id)} className="text-red-600 hover:text-red-900">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <GuestFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGuest}
        guestToEdit={guestToEdit}
      />
    </div>
  );
};

export default GuestManagementPage;