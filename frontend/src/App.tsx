import { useState, useEffect, useRef } from 'react';
import './App.css';
import StatsCard from './components/Dashboard/StatsCard';
import QuickActions from './components/Dashboard/QuickActions';
import ReservationCalendar from './components/Calendar/ReservationCalendar';
import CheckInForm from './components/Reception/CheckInForm';
import NewReservationModal from './components/Dashboard/NewReservationModal';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage'; // Import RegisterPage
import GuestManagementPage from './components/Guest/GuestManagementPage';
import RoomManagementPage from './components/Room/RoomManagementPage';
import EditReservationModal from './components/Calendar/EditReservationModal';
import { FaBed, FaSignInAlt, FaSignOutAlt, FaUsers, FaDoorOpen, FaCalendarAlt } from 'react-icons/fa';
import type { Reservacion } from './types/domain.ts';
import { useAuth } from './context/AuthContext';
import { reservationService } from './services/api';

type View = 'dashboard' | 'guests' | 'rooms';
type AuthView = 'login' | 'register'; // New type for auth view

function App() {
  const auth = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [authView, setAuthView] = useState<AuthView>('login'); // New state for auth view
  const [isNewReservationModalOpen, setIsNewReservationModalOpen] = useState(false);
  const [isEditReservationModalOpen, setIsEditReservationModalOpen] = useState(false);
  const [reservationToEdit, setReservationToEdit] = useState<Reservacion | null>(null);
  const calendarRef = useRef<any>(null);

  useEffect(() => {
    if (!auth.isAuthenticated && auth.token === null) {
      setCurrentView('dashboard');
    } else if (auth.isAuthenticated) {
      setCurrentView('dashboard');
    }
  }, [auth.isAuthenticated, auth.token]);

  const handleNewReservation = () => {
    setIsNewReservationModalOpen(true);
  };

  const handleCheckInScroll = () => {
    document.getElementById('check-in-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReservationSuccess = () => {
    console.log('Reserva creada/actualizada, actualizar calendario...');
    if (calendarRef.current) {
      calendarRef.current.fetchData();
    }
  };

  const handleEditReservation = (reservation: Reservacion) => {
    setReservationToEdit(reservation);
    setIsEditReservationModalOpen(true);
  };

  const handleDeleteReservation = async (reservationId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reservación?')) {
      const response = await reservationService.deleteReservation(reservationId);
      if (response.error) {
        alert(`Error al eliminar reservación: ${response.error}`);
      } else {
        alert('Reservación eliminada exitosamente.');
        handleReservationSuccess();
      }
    }
  };

  const handleCheckOut = async (reservationId: string) => {
    if (window.confirm('¿Estás seguro de que quieres realizar el Check-out para esta reservación?')) {
      const response = await reservationService.performCheckOut(reservationId);
      if (response.error) {
        alert(`Error al realizar Check-out: ${response.error}`);
      } else {
        alert('Check-out realizado exitosamente.');
        handleReservationSuccess();
      }
    }
  };

  // Handlers to switch between login and register views
  const handleSwitchToRegister = () => setAuthView('register');
  const handleSwitchToLogin = () => setAuthView('login');

  if (!auth.isAuthenticated) {
    if (authView === 'login') {
      return <LoginPage onSwitchToRegister={handleSwitchToRegister} />;
    }
    return <RegisterPage onSwitchToLogin={handleSwitchToLogin} />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <nav className="bg-white p-4 rounded-lg shadow-md mb-6 flex justify-around items-center">
        <button onClick={() => setCurrentView('dashboard')} className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
          <FaCalendarAlt /> <span>Dashboard</span>
        </button>
        <button onClick={() => setCurrentView('guests')} className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
          <FaUsers /> <span>Huéspedes</span>
        </button>
        <button onClick={() => setCurrentView('rooms')} className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
          <FaDoorOpen /> <span>Habitaciones</span>
        </button>
        <div className="ml-auto flex items-center space-x-4">
          {auth.user && (
            <span className="text-gray-700 text-sm">Hola, {auth.user.username} ({auth.user.role})</span>
          )}
          <button onClick={auth.logout} className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {currentView === 'guests' && <GuestManagementPage />}
      {currentView === 'rooms' && <RoomManagementPage />}
      
      {currentView === 'dashboard' && (
        <>
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
          <QuickActions onNewReservation={handleNewReservation} onCheckIn={handleCheckInScroll} />

          <div className="mt-8">
            <ReservationCalendar 
              ref={calendarRef} 
              onEditReservation={handleEditReservation} 
              onDeleteReservation={handleDeleteReservation} 
              onCheckOutReservation={handleCheckOut} 
              onReservationChange={handleReservationSuccess} 
            />
          </div>

          <div id="check-in-form-section" className="mt-8">
            <CheckInForm />
          </div>
        </>
      )}

      <NewReservationModal
        isOpen={isNewReservationModalOpen}
        onClose={() => setIsNewReservationModalOpen(false)}
        onSuccess={handleReservationSuccess}
      />

      <EditReservationModal
        isOpen={isEditReservationModalOpen}
        onClose={() => setIsEditReservationModalOpen(false)}
        onSuccess={handleReservationSuccess}
        reservationToEdit={reservationToEdit}
      />
    </div>
  );
}

export default App;
