import React, { useState, useEffect } from 'react';
import type { Huesped, HuespedRequest } from '../../types/domain.ts';

interface GuestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (guest: HuespedRequest) => void;
  guestToEdit: Huesped | null;
}

const GuestFormModal: React.FC<GuestFormModalProps> = ({ isOpen, onClose, onSave, guestToEdit }) => {
  const [formData, setFormData] = useState<HuespedRequest>({
    nombre: '',
    apellido: '',
    email: '',
    identificacion: ''
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && guestToEdit) {
      setFormData(guestToEdit);
    } else if (isOpen && !guestToEdit) {
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        identificacion: ''
      });
    }
    setError(null);
  }, [isOpen, guestToEdit]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.identificacion) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    setError(null);
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {guestToEdit ? 'Editar Huésped' : 'Añadir Huésped'}
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Identificación</label>
            <input
              type="text"
              name="identificacion"
              value={formData.identificacion}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              required
            />
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestFormModal;