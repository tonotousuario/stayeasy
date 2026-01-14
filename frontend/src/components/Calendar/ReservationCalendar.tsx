// frontend/src/components/Calendar/ReservationCalendar.tsx
import React from 'react';

// Dummy data for rooms
const dummyRooms = [
  { id: '101', number: 101, type: 'Doble' },
  { id: '102', number: 102, type: 'Doble' },
  { id: '201', number: 201, type: 'King' },
  { id: '301', number: 301, type: 'Suite' },
];

// Dummy data for reservations (simplified)
const dummyReservations = [
  { roomId: '101', checkIn: '2026-01-10', checkOut: '2026-01-12', guest: 'Juan Perez', status: 'CONFIRMADA' },
  { roomId: '201', checkIn: '2026-01-15', checkOut: '2026-01-18', guest: 'Maria Lopez', status: 'CHECK_IN' },
  { roomId: '301', checkIn: '2026-01-05', checkOut: '2026-01-07', guest: 'Carlos Garcia', status: 'MANTENIMIENTO' }, // Example for maintenance
];

const ReservationCalendar: React.FC = () => {
  const today = new Date('2026-01-14'); // Fixed date for demonstration
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const dates = [];
  for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }

  const getReservationForRoomAndDate = (roomId: string, date: Date) => {
    return dummyReservations.find(res => {
      const checkInDate = new Date(res.checkIn);
      const checkOutDate = new Date(res.checkOut);
      // Check if the date falls within the reservation period
      return res.roomId === roomId && date >= checkInDate && date < checkOutDate;
    });
  };

  const getCellColorClass = (reservationStatus: string | undefined) => {
    switch (reservationStatus) {
      case 'CONFIRMADA':
        return 'bg-blue-200';
      case 'CHECK_IN':
        return 'bg-green-200';
      case 'MANTENIMIENTO': // Using a status for maintenance for now
        return 'bg-red-200';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Calendario de Reservaciones</h2>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex border-b border-gray-200">
            {/* Corner for Room/Date Header */}
            <div className="sticky left-0 bg-white z-10 p-2 border-r border-gray-200" style={{ minWidth: '120px' }}>
              <span className="font-semibold text-sm">Habitación</span>
            </div>
            {/* Date Headers */}
            {dates.map((date, index) => (
              <div key={index} className="p-2 border-r border-gray-200 text-center" style={{ minWidth: '80px' }}>
                <p className="text-xs font-semibold">{date.getDate()}</p>
                <p className="text-xs text-gray-500">{date.toLocaleString('es-ES', { weekday: 'short' })}</p>
              </div>
            ))}
          </div>

          {dummyRooms.map(room => (
            <div key={room.id} className="flex border-b border-gray-100 last:border-b-0">
              {/* Room Header */}
              <div className="sticky left-0 bg-white z-10 p-2 border-r border-gray-200" style={{ minWidth: '120px' }}>
                <p className="font-semibold text-sm">{room.number}</p>
                <p className="text-xs text-gray-500">{room.type}</p>
              </div>
              {/* Reservation Cells */}
              {dates.map((date, index) => {
                const reservation = getReservationForRoomAndDate(room.id, date);
                const isReservationStart = reservation && new Date(reservation.checkIn).toDateString() === date.toDateString();
                const cellClass = getCellColorClass(reservation?.status);

                return (
                  <div
                    key={index}
                    className={`p-2 border-r border-gray-100 relative ${cellClass}`}
                    style={{ minWidth: '80px', height: '60px' }}
                    title={reservation ? `${reservation.guest} (${reservation.status})` : ''}
                  >
                    {isReservationStart && reservation ? (
                      <div className="absolute inset-0 flex items-center justify-center text-xs p-1">
                        {reservation.guest}
                      </div>
                    ) : null}
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
