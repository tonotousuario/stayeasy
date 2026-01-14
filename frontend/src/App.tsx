import { useState } from 'react';
import './App.css';
import StatsCard from './components/Dashboard/StatsCard';
import QuickActions from './components/Dashboard/QuickActions';
import ReservationCalendar from './components/Calendar/ReservationCalendar';
import CheckInForm from './components/Reception/CheckInForm';
import NewReservationModal from './components/Dashboard/NewReservationModal';
import { FaBed, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

function App() {
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  const handleNewReservation = () => {
    setIsReservationModalOpen(true);
  };

  const handleCheckIn = () => {
    alert('Navegar a Check-in');
  };

  const handleReservationSuccess = () => {
    console.log('Reserva creada, actualizar calendario...');
    // Aquí podrías recargar los datos del calendario si estuviera conectado
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard StayEasy</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title="% Ocupación"
          value="85%"
          description="Basado en 100 habitaciones"
          icon={<FaBed />}
        />
        <StatsCard
          title="Llegadas Hoy"
          value={12}
          description="Reservas confirmadas"
          icon={<FaSignInAlt />}
        />
        <StatsCard
          title="Salidas Hoy"
          value={8}
          description="Check-outs esperados"
          icon={<FaSignOutAlt />}
        />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
      <QuickActions onNewReservation={handleNewReservation} onCheckIn={handleCheckIn} />

      <div className="mt-8">
        <ReservationCalendar />
      </div>

      <div className="mt-8">
        <CheckInForm />
      </div>

      <NewReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        onSuccess={handleReservationSuccess}
      />
    </div>
  );
}

export default App;
