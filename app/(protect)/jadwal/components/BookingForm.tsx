'use client';

import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import id from 'date-fns/locale/id';
import { useMemo } from 'react';

// Setup lokal bahasa Indonesia
const locales = { 'id': id };
const localizer = dateFnsLocalizer({
  format,
  parse,
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
];

// Data peminjaman contoh (bisa diganti dari API nanti)
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
];

export default function CalendarPage() {
  // Ubah data booking jadi format event untuk kalender
  const events: Event[] = useMemo(() => {
    return rawBookings.map((booking) => {
      const vehicle = vehicles.find((v) => v.id === booking.vehicleId)!;
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      // Supaya tampil sampai akhir hari
      end.setHours(23, 59, 59);

      return {
        title: `${vehicle.name} - ${booking.borrower}`,
        start,
        end,
        resource: {
          vehicle,
          borrower: booking.borrower,
          purpose: booking.purpose,
          notes: booking.notes || '-',
        },
        // Warna sesuai kendaraan
        color: vehicle.color,
      };
    });
  }, []);

  // Custom tampilan event
  const eventStyleGetter = (event: any) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '8px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontWeight: '600',
        fontSize: '0.9rem',
      },
    };
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Jadwal Peminjaman Kendaraan
        </h1>
        <p className="text-gray-600 mb-6">Klik event untuk lihat detail</p>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          {vehicles.map((v) => (
            <div key={v.id} className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: v.color }}
              ></div>
              <span className="text-sm font-medium">
                {v.name} ({v.plate})
              </span>
            </div>
          ))}
        </div>

        <div style={{ height: '700px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            eventPropGetter={eventStyleGetter}
            messages={{
              next: 'Berikutnya',
              previous: 'Sebelumnya',
              today: 'Hari ini',
              month: 'Bulan',
              week: 'Minggu',
              day: 'Hari',
              agenda: 'Agenda',
              date: 'Tanggal',
              time: 'Waktu',
              event: 'Event',
              noEventsInRange: 'Tidak ada peminjaman di rentang ini',
            }}
            views={['month', 'week', 'day', 'agenda']}
            defaultView="month"
            popup
            onSelectEvent={(event: any) => {
              alert(
                `Kendaraan: ${event.resource.vehicle.name} - ${event.resource.vehicle.plate}\n` +
                `Peminjam: ${event.resource.borrower}\n` +
                `Keperluan: ${event.resource.purpose}\n` +
                `Catatan: ${event.resource.notes}\n` +
                `Periode: ${format(event.start, 'dd MMM yyyy')} → ${format(event.end, 'dd MMM yyyy')}`
              );
            }}
          />
        </div>

        <div className="mt-6 text-sm text-gray-500 text-center">
          Total peminjaman aktif: {events.length} jadwal
        </div>
      </div>
    </div>
  );
}