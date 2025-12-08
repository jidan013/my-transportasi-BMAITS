'use client';

import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, startOfWeek, getDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { useMemo } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Fix type react-big-calendar agar support resource & generic type
declare module 'react-big-calendar' {
  interface Event {
    resource?: any;
  }
}

// Setup bahasa Indonesia
const locales = { id };
const localizer = dateFnsLocalizer({
  format,
  startOfWeek,
  getDay,
  locales,
});

// Data kendaraan
const vehicles = [
  { id: '1', name: 'Toyota Avanza', plate: 'B 1234 XYZ', color: '#3B82F6' },
  { id: '2', name: 'Honda Jazz', plate: 'B 5678 ABC', color: '#EF4444' },
  { id: '3', name: 'Daihatsu Xenia', plate: 'B 9012 DEF', color: '#10B981' },
  { id: '4', name: 'Mitsubishi Pajero', plate: 'B 9999 ZZZ', color: '#F59E0B' },
  { id: '5', name: 'Suzuki Ertiga', plate: 'B 8888 ERT', color: '#8B5CF6' },
] as const;

// Custom Event Type
interface CustomEvent {
  title: string;
  start: Date;
  end: Date;
  color?: string;
  resource: {
    vehicle: (typeof vehicles)[number];
    borrower: string;
    purpose: string;
    notes: string;
  };
}

// Data peminjaman (contoh)
const rawBookings = [
  {
    vehicleId: '1',
    borrower: 'Budi Santoso',
    purpose: 'Kunjungan ke klien Jakarta',
    startDate: '2025-12-03',
    endDate: '2025-12-06',
    notes: 'Bawa dokumen penting',
  },
  {
    vehicleId: '2',
    borrower: 'Siti Aminah',
    purpose: 'Antar barang ke Bandung',
    startDate: '2025-12-05',
    endDate: '2025-12-07',
  },
  {
    vehicleId: '3',
    borrower: 'Ahmad Fauzi',
    purpose: 'Survey lapangan',
    startDate: '2025-12-04',
    endDate: '2025-12-04',
  },
  {
    vehicleId: '1',
    borrower: 'Rina Wulandari',
    purpose: 'Rapat di kantor pusat',
    startDate: '2025-12-10',
    endDate: '2025-12-11',
  },
] as const;

export default function CalendarPage() {
  const events = useMemo<CustomEvent[]>(() => {
    return rawBookings.map((booking) => {
      const vehicle = vehicles.find((v) => v.id === booking.vehicleId)!;
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);

      // Biar event tampil full satu hari
      end.setHours(23, 59, 59, 999);

      return {
        title: `${vehicle.name} - ${booking.borrower}`,
        start,
        end,
        color: vehicle.color,
        resource: {
          vehicle,
          borrower: booking.borrower,
          purpose: booking.purpose,
          notes: booking.notes ?? '-',
        },
      };
    });
  }, []);

  const eventStyleGetter = (event: CustomEvent) => ({
    style: {
      backgroundColor: event.color ?? '#3B82F6',
      borderRadius: '8px',
      opacity: 0.95,
      color: 'white',
      border: 'none',
      fontWeight: 600,
      fontSize: '0.875rem',
      padding: '4px 8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Jadwal Peminjaman Kendaraan
            </h1>
            <p className="text-gray-600 mb-8">Klik event untuk melihat detail peminjaman</p>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-10">
              {vehicles.map((v) => (
                <div key={v.id} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-lg shadow-md"
                    style={{ backgroundColor: v.color }}
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    {v.name} <span className="font-mono text-gray-500">({v.plate})</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Kalender */}
            <div className="border border-gray-200 rounded-xl overflow-hidden" style={{ height: '750px' }}>
              <Calendar<CustomEvent>
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%', backgroundColor: 'white' }}
                eventPropGetter={eventStyleGetter}
                messages={{
                  next: '→',
                  previous: '←',
                  today: 'Hari Ini',
                  month: 'Bulan',
                  week: 'Minggu',
                  day: 'Hari',
                  agenda: 'Agenda',
                  noEventsInRange: 'Tidak ada peminjaman',
                  showMore: (count) => `+${count} lagi`,
                }}
                views={['month', 'week', 'day']}
                defaultView={Views.MONTH}
                popup
                onSelectEvent={(event) => {
                  const r = event.resource;
                  alert(
                    `Kendaraan: ${r.vehicle.name}\n` +
                    `Plat: ${r.vehicle.plate}\n` +
                    `Peminjam: ${r.borrower}\n` +
                    `Keperluan: ${r.purpose}\n` +
                    `Catatan: ${r.notes}\n\n` +
                    `Periode:\n${format(event.start, 'EEEE, dd MMMM yyyy', { locale: id })} →\n` +
                    `${format(event.end, 'EEEE, dd MMMM yyyy', { locale: id })}`
                  );
                }}
              />
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Total jadwal aktif:{' '}
                <span className="font-bold text-lg text-blue-600">{events.length}</span> peminjaman
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}