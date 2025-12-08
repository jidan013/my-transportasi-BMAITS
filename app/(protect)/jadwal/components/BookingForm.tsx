'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import idLocale from '@fullcalendar/core/locales/id';
import type { EventClickArg } from '@fullcalendar/core';
import { useMemo } from 'react';

// Data kendaraan
const vehicles = [
  { id: '1', name: 'Toyota Avanza',    plate: 'B 1234 XYZ', color: '#003366' },
  { id: '2', name: 'Honda Jazz',       plate: 'B 5678 ABC', color: '#00509e' },
  { id: '3', name: 'Daihatsu Xenia',   plate: 'B 9012 DEF', color: '#0066cc' },
  { id: '4', name: 'Mitsubishi Pajero',plate: 'B 9999 ZZZ', color: '#0077b6' },
  { id: '5', name: 'Suzuki Ertiga',    plate: 'B 8888 ERT', color: '#0099cc' },
] as const;

// Data peminjaman
const bookings = [
  { vehicleId: '1', borrower: 'Budi Santoso', purpose: 'Kunjungan ke klien Jakarta', start: '2025-12-03', end: '2025-12-07', notes: 'Bawa dokumen penting' },
  { vehicleId: '2', borrower: 'Siti Aminah', purpose: 'Antar barang ke Bandung', start: '2025-12-05', end: '2025-12-08' },
  { vehicleId: '3', borrower: 'Ahmad Fauzi', purpose: 'Survey lapangan', start: '2025-12-04', end: '2025-12-05' },
  { vehicleId: '1', borrower: 'Rina Wulandari', purpose: 'Rapat di kantor pusat', start: '2025-12-10', end: '2025-12-12' },
] as const;

export default function CalendarPage() {
  const events = useMemo(() => {
    return bookings.map((booking) => {
      const vehicle = vehicles.find((v) => v.id === booking.vehicleId)!;
      return {
        title: vehicle.name,
        start: booking.start,
        end: booking.end,
        backgroundColor: vehicle.color,
        borderColor: vehicle.color,
        textColor: 'white',
        extendedProps: {
          borrower: booking.borrower,
          purpose: booking.purpose,
          notes: booking.notes ?? '-',
          plate: vehicle.plate,
        } as const,
      };
    });
  }, []);

  const handleEventClick = (clickInfo: EventClickArg) => {
    const e = clickInfo.event.extendedProps;
    const startDate = clickInfo.event.start
      ? clickInfo.event.start.toLocaleDateString('id-ID', { dateStyle: 'full' })
      : '';
    const endDate = clickInfo.event.end
      ? new Date(clickInfo.event.end.getTime() - 86400000).toLocaleDateString('id-ID', { dateStyle: 'full' })
      : startDate;

    alert(
      `KENDARAAN\n${clickInfo.event.title}\n${e.plate}\n\n` +
      `PEMINJAM\n${e.borrower}\n\n` +
      `KEPERLUAN\n${e.purpose}\n\n` +
      `CATATAN\n${e.notes}\n\n` +
      `PERIODE\n${startDate}${endDate !== startDate ? `\ns/d\n${endDate}` : ''}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header ITS */}
      <div className="bg-gradient-to-r from-[#003366] to-[#00509e] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-10 text-white">
          <h1 className="text-4xl font-bold">Jadwal Peminjaman Kendaraan Dinas</h1>
          <p className="mt-2 text-blue-100">Institut Teknologi Sepuluh Nopember</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Legend */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: v.color }} />
              <div>
                <div className="font-semibold text-gray-800">{v.name}</div>
                <div className="text-xs text-gray-500 font-mono">{v.plate}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Kalender */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            height="760px"
            locales={[idLocale]}
            locale="id"
            events={events}
            eventClick={handleEventClick}
            buttonText={{
              today: 'Hari Ini',
              month: 'Bulan',
              week: 'Minggu',
              day: 'Hari',
            }}
            dayMaxEvents={3}
            moreLinkContent={(args) => `+${args.num} lagi`}
            eventClassNames="cursor-pointer font-medium rounded-lg transition-all hover:shadow-xl hover:-translate-y-1"
          />
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-gray-600">
          <p className="text-lg">
            Total Peminjaman Aktif:{' '}
            <span className="font-bold text-3xl text-[#003366]">{events.length}</span>
          </p>
          <p className="mt-2 text-sm text-gray-500">Sistem Informasi Kendaraan • ITS Surabaya</p>
        </div>
      </div>
    </div>
  );
}