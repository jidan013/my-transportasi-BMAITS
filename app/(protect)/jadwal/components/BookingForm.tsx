'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import idLocale from '@fullcalendar/core/locales/id';
import type { EventClickArg, EventInput } from '@fullcalendar/core';
import { useMemo } from 'react';

// === DATA KENDARAAN ===
const vehicles = [
  { id: '1', name: 'Toyota Avanza',     plate: 'B 1234 XYZ', color: '#003366' },
  { id: '2', name: 'Honda Jazz',        plate: 'B 5678 ABC', color: '#00509e' },
  { id: '3', name: 'Daihatsu Xenia',    plate: 'B 9012 DEF', color: '#0066cc' },
  { id: '4', name: 'Mitsubishi Pajero', plate: 'B 9999 ZZZ', color: '#0077b6' },
  { id: '5', name: 'Suzuki Ertiga',     plate: 'B 8888 ERT', color: '#0099cc' },
] as const;

const bookings : BookingExtendedProps[] = [
  {
    vehicleId: '1',
    borrower: 'Budi Santoso',
    purpose: 'Kunjungan ke klien Jakarta',
    start: '2025-12-03',
    end: '2025-12-07',
    notes: 'Bawa dokumen penting',
  },
  {
    vehicleId: '2',
    borrower: 'Siti Aminah',
    purpose: 'Antar barang ke Bandung',
    start: '2025-12-05',
    end: '2025-12-08',
  },
  {
    vehicleId: '3',
    borrower: 'Ahmad Fauzi',
    purpose: 'Survey lapangan',
    start: '2025-12-04',
    end: '2025-12-05',
  },
  {
    vehicleId: '1',
    borrower: 'Rina Wulandari',
    purpose: 'Rapat di kantor pusat',
    start: '2025-12-10',
    end: '2025-12-12',
  },
] as const;

// === TIPE EXTENDED PROPS (notes selalu string karena kita pakai ?? '-') ===
interface BookingExtendedProps {
  start: string;
  end: string;
  vehicleId: string;
  borrower: string;
  purpose: string;
  notes?: string;
  plate?: string;
}

export default function CalendarPage() {
  const events = useMemo<EventInput[]>(() => {
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
          notes: booking.notes? booking.notes : '-',  
          plate: vehicle.plate,
        },
      };
    });
  }, []);

  const handleEventClick = (info: EventClickArg) => {
    const e = info.event.extendedProps as BookingExtendedProps;

    const startStr = info.event.start?.toLocaleDateString('id-ID', {
      dateStyle: 'full',
    }) ?? 'Tidak diketahui';

    const endStr = info.event.end
      ? new Date(info.event.end.getTime() - 86400000).toLocaleDateString('id-ID', {
          dateStyle: 'full',
        })
      : startStr;

    alert(
      `KENDARAAN\n${info.event.title}\n${e.plate}\n\n` +
      `PEMINJAM\n${e.borrower}\n\n` +
      `KEPERLUAN\n${e.purpose}\n\n` +
      `CATATAN\n${e.notes}\n\n` +
      `PERIODE\n${startStr}${endStr !== startStr ? `\ns/d\n${endStr}` : ''}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header ITS Premium */}
      <div className="bg-gradient-to-r from-[#003366] to-[#00509e] shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-14 text-white text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight">
            Jadwal Kendaraan Dinas
          </h1>
          <p className="mt-4 text-xl text-blue-100 font-light">
            Institut Teknologi Sepuluh Nopember
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Legend Kendaraan */}
        <div className="mb-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="group flex flex-col items-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div
                className="w-full h-24 rounded-xl mb-4 shadow-inner"
                style={{ backgroundColor: v.color }}
              />
              <h3 className="font-bold text-gray-800">{v.name}</h3>
              <p className="text-sm text-gray-500 font-mono mt-1">{v.plate}</p>
            </div>
          ))}
        </div>

        {/* Kalender */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            height="800px"
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
            dayMaxEvents={4}
            moreLinkContent={(args) => `+${args.num} lagi`}
            eventClassNames="cursor-pointer font-bold text-sm rounded-xl transition-all hover:scale-105 hover:shadow-2xl hover:z-10"
          />
        </div>

        {/* Footer */}
        <div className="mt-14 text-center">
          <p className="text-2xl text-gray-700">
            Total Peminjaman Aktif:{' '}
            <span className="text-5xl font-black text-[#003366]">{events.length}</span>
          </p>
          <p className="mt-4 text-gray-500 text-sm">
            Sistem Informasi Kendaraan • BMATS ITS © 2025
          </p>
        </div>
      </div>
    </div>
  );
}