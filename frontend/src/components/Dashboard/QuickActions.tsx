// frontend/src/components/Dashboard/QuickActions.tsx
import React from 'react';

interface QuickActionsProps {
  onNewReservation: () => void;
  onCheckIn: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onNewReservation, onCheckIn }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-around space-x-4">
      <button
        onClick={onNewReservation}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Nueva Reserva
      </button>
      <button
        onClick={onCheckIn}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        Check-in
      </button>
    </div>
  );
};

export default QuickActions;
