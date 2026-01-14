import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { reservationService, habitacionService } from '../../services/api';
import type { Reservacion } from '../../types/domain.ts';
import { FaEdit, FaTrash, FaSignOutAlt } from 'react-icons/fa';

interface ReservationCalendarProps {
  onEditReservation: (reservation: Reservacion) => void;
  onDeleteReservation: (reservationId: string) => Promise<void>;
  onCheckOutReservation: (reservationId: string) => Promise<void>;
  onReservationChange: () => void; // Added prop
}

const ReservationCalendar = forwardRef<any, ReservationCalendarProps>((props, ref) => {
  const { onEditReservation, onDeleteReservation, onCheckOutReservation, onReservationChange } = props;
  const [rooms, setRooms] = useState<any[]>([]);
  const [reservations, setReservations] = useState<Reservacion[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date(); 
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const dates: Date[] = [];
  for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, reservationsRes] = await Promise.all([
        habitacionService.getHabitaciones(),
        reservationService.getReservations()
      ]);

      if (roomsRes.data) {
        const sortedRooms = roomsRes.data.sort((a: any, b: any) => a.numero - b.numero);
        setRooms(sortedRooms);
      }
      if (reservationsRes.data) {
        setReservations(reservationsRes.data);
        if (onReservationChange) onReservationChange();
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Expose fetchData to parent component via ref
  useImperativeHandle(ref, () => ({
    fetchData
  }));


  const getReservationForRoomAndDate = (roomId: string, date: Date) => {
    return reservations.find(res => {
      const checkIn = new Date(res.fechaCheckIn);
      const checkOut = new Date(res.fechaCheckOut);
      
      const currentDate = new Date(date);
      currentDate.setHours(0, 0, 0, 0);
      
      const resCheckIn = new Date(checkIn);
      resCheckIn.setHours(0,0,0,0);
      
      const resCheckOut = new Date(checkOut);
      resCheckOut.setHours(0,0,0,0);

      return res.habitacionId === roomId && currentDate >= resCheckIn && currentDate < resCheckOut;
    });
  };

  const getCellColorClass = (estado: string) => {
    switch (estado) {
      case 'CONFIRMADA': return 'bg-blue-500 text-white';
      case 'CHECK_IN': return 'bg-green-500 text-white';
      case 'CANCELADA': return 'bg-red-200 text-red-800';
      case 'CHECK_OUT': return 'bg-gray-400 text-white';
      default: return 'bg-gray-100';
    }
  };

  if (loading) return <div className="p-4">Cargando calendario...</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Calendario de Reservaciones</h2>
        <button onClick={fetchData} className="text-sm text-blue-600 hover:underline">Actualizar</button>
      </div>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Header Row */}
          <div className="flex border-b border-gray-200">
            <div className="sticky left-0 bg-white z-20 p-2 border-r border-gray-200 font-bold w-32 flex-shrink-0">
              Habitación
            </div>
            {dates.map((date, index) => (
              <div key={index} className="p-2 border-r border-gray-200 text-center w-16 flex-shrink-0">
                <p className="text-xs font-semibold">{date.getDate()}</p>
                <p className="text-xs text-gray-500">{date.toLocaleString('es-ES', { weekday: 'short' }).slice(0, 1)}</p>
              </div>
            ))}
          </div>

          {/* Room Rows */}
          {rooms.map(room => (
            <div key={room.id} className="flex border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
              {/* Room Column */}
              <div className="sticky left-0 bg-white z-10 p-2 border-r border-gray-200 w-32 flex-shrink-0 flex flex-col justify-center">
                <p className="font-semibold text-sm">Hab. {room.numero}</p>
                <p className="text-xs text-gray-500">{room.descripcion || 'Estándar'}</p>
              </div>

              {/* Days Columns */}
              {dates.map((date, index) => {
                const reservation = getReservationForRoomAndDate(room.id, date);
                
                let isStart = false;
                if (reservation) {
                   const checkIn = new Date(reservation.fechaCheckIn);
                   checkIn.setHours(0,0,0,0);
                   const current = new Date(date);
                   current.setHours(0,0,0,0);
                   isStart = checkIn.getTime() === current.getTime();
                }

                return (
                  <div
                    key={index}
                    className={`border-r border-gray-100 w-16 h-12 flex-shrink-0 relative text-xs ${reservation ? getCellColorClass(reservation.estado) : ''}`}
                    title={reservation ? `Reserva ID: ${reservation.id}\nCheck-in: ${new Date(reservation.fechaCheckIn).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}\nCheck-out: ${new Date(reservation.fechaCheckOut).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}\nEstado: ${reservation.estado}` : ''}
                  >
                    {isStart && reservation && (
                      <div className="absolute left-0 top-0 bottom-0 flex items-center pl-1 whitespace-nowrap overflow-visible z-10 font-semibold drop-shadow-md cursor-pointer group">
                         Reservado
                         <div className="absolute top-0 right-0 p-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white shadow-lg rounded-bl-lg">
                            <button onClick={(e) => { e.stopPropagation(); onEditReservation(reservation); }} className="text-blue-500 hover:text-blue-700">
                                <FaEdit size={12} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onDeleteReservation(reservation.id); }} className="text-red-500 hover:text-red-700">
                                <FaTrash size={12} />
                            </button>
                            {reservation.estado === 'CHECK_IN' && (
                                <button onClick={(e) => { e.stopPropagation(); onCheckOutReservation(reservation.id); }} className="text-green-500 hover:text-green-700">
                                    <FaSignOutAlt size={12} />
                                </button>
                            )}
                         </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default ReservationCalendar;
