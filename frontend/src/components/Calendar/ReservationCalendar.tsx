import React, { useState, useEffect } from 'react';
import { reservationService } from '../../services/api';

const ReservationCalendar: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fechas del calendario (fijas para este prototipo o dinámicas)
  // Usaremos el mes actual basado en la fecha del sistema, o un rango fijo si prefieres.
  // Para ver las reservas que acabas de crear, asegúrate de crear reservas en ESTAS fechas.
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
    try {
      const [roomsRes, reservationsRes] = await Promise.all([
        reservationService.getHabitaciones(),
        reservationService.getReservations()
      ]);

      if (roomsRes.data) {
        // Ordenar habitaciones por número
        const sortedRooms = roomsRes.data.sort((a: any, b: any) => a.numero - b.numero);
        setRooms(sortedRooms);
      }
      if (reservationsRes.data) {
        setReservations(reservationsRes.data);
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getReservationForRoomAndDate = (roomId: string, date: Date) => {
    return reservations.find(res => {
      // Las fechas vienen como string ISO desde el backend
      // Ajustamos para comparar solo días (sin hora) para simplificar visualización
      const checkIn = new Date(res.fechaCheckIn);
      const checkOut = new Date(res.fechaCheckOut);
      
      // Normalizamos la fecha actual del bucle a medianoche para comparar
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
                
                // Determinamos si es el día de inicio para mostrar el nombre
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
                    title={reservation ? `Reserva ID: ${reservation.id}\nEstado: ${reservation.estado}` : ''}
                  >
                    {isStart && reservation && (
                      <div className="absolute left-0 top-0 bottom-0 flex items-center pl-1 whitespace-nowrap overflow-visible z-10 font-semibold drop-shadow-md">
                         {/* Nota: En la reserva real solo tenemos huespedId. 
                             Para mostrar el nombre, deberíamos cruzarlo con la lista de huéspedes,
                             pero por ahora mostraremos "Ocupado" o el ID para simplificar,
                             o podemos hacer un cruce rápido si ya tenemos la lista de huéspedes cargada.
                         */}
                         Reservado
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
};

export default ReservationCalendar;