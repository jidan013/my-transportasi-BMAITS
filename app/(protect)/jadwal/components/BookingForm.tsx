"use client";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import idLocale from '@fullcalendar/core/locales/id';
import type { EventClickArg, EventInput } from '@fullcalendar/core';
import { useMemo, useState } from 'react';
import { Car, Bus, Truck, CarFront } from 'lucide-react';

const vehicles = [
  { id: '1', name: 'Toyota Avanza', plate: 'B 1234 XYZ', icon: Car },
  { id: '2', name: 'Honda Jazz', plate: 'B 5678 ABC', icon: CarFront },
  { id: '3', name: 'Daihatsu Xenia', plate: 'B 9012 DEF', icon: Car },
  { id: '4', name: 'Mitsubishi Pajero', plate: 'B 9999 ZZZ', icon: Truck },
  { id: '5', name: 'Suzuki Ertiga', plate: 'B 8888 ERT', icon: Bus },
] as const;

interface Booking {
  vehicleId: string;
  borrower: string;
  purpose: string;
  start: string;
  end: string;
  notes?: string;
}

const bookings: Booking[] = [
  {
    vehicleId: '1',
    borrower: 'Budi Santoso',
    purpose: 'Kunjungan ke klien Jakarta',
    start: '2025-12-03',
    end: '2025-12-07',
  },
  {
    vehicleId: '2',
    borrower: 'Siti Aminah',
    purpose: 'Antar barang ke Bandung',
    start: '2025-12-05',
    end: '2025-12-08',
  },
];

interface BookingExtendedProps {
  borrower: string;
  purpose: string;
  notes: string;
  plate: string;
}

export default function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState<{
    title: string;
    start: string;
    end: string;
    data: BookingExtendedProps;
  } | null>(null);

  const events = useMemo<EventInput[]>(() => {
    return bookings.map((b) => {
      const v = vehicles.find((x) => x.id === b.vehicleId)!;

      return {
        title: v.name,
        start: b.start,
        end: b.end,
        backgroundColor: '#003366',
        borderColor: '#003366',
        textColor: '#fff',
        extendedProps: {
          borrower: b.borrower,
          purpose: b.purpose,
          notes: b.notes ?? '-',
          plate: v.plate,
        },
      };
    });
  }, []);

  const handleEventClick = (info: EventClickArg) => {
    const props = info.event.extendedProps as BookingExtendedProps;

    const start =
      info.event.start?.toLocaleDateString('id-ID', { dateStyle: 'full' }) ?? '-';
    const end = info.event.end
      ? new Date(info.event.end.getTime() - 86400000).toLocaleDateString(
          'id-ID',
          { dateStyle: 'full' }
        )
      : start;

    setSelectedEvent({
      title: info.event.title,
      start,
      end,
      data: props,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-[#002244] to-[#00509e] text-white">
        <div className="px-8 py-16 text-center">
          <h1 className="text-5xl font-black tracking-wide">
            Jadwal Kendaraan Dinas
          </h1>
          <p className="mt-4 text-lg text-blue-100">
            Institut Teknologi Sepuluh Nopember
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 px-8 py-10 space-y-10">
        {/* VEHICLE LEGEND */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
          {vehicles.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.id}
                className="bg-white rounded-2xl p-6 text-center shadow hover:shadow-xl transition"
              >
                <Icon className="mx-auto h-10 w-10 text-[#003366]" />
                <h3 className="mt-3 font-bold">{v.name}</h3>
                <p className="text-xs text-gray-500 font-mono">{v.plate}</p>
              </div>
            );
          })}
        </section>

        {/* CALENDAR FULL WIDTH */}
        <section className="bg-white rounded-3xl shadow-xl p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            locale="id"
            locales={[idLocale]}
            events={events}
            eventClick={handleEventClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            buttonText={{
              today: 'Hari Ini',
              month: 'Bulan',
              week: 'Minggu',
              day: 'Hari',
            }}
            eventClassNames="cursor-pointer font-semibold rounded-xl px-2"
          />
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t text-center py-6 text-sm text-gray-500">
        Sistem Informasi Kendaraan Dinas • BMATS ITS © 2025
      </footer>

      {/* MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-2xl font-black mb-6 text-[#003366]">
              {selectedEvent.title}
            </h2>

            <div className="space-y-3 text-sm">
              <p><strong>Plat:</strong> {selectedEvent.data.plate}</p>
              <p><strong>Peminjam:</strong> {selectedEvent.data.borrower}</p>
              <p><strong>Keperluan:</strong> {selectedEvent.data.purpose}</p>
              <p><strong>Catatan:</strong> {selectedEvent.data.notes}</p>
              <p>
                <strong>Periode:</strong><br />
                {selectedEvent.start}
                {selectedEvent.end !== selectedEvent.start &&
                  ` s/d ${selectedEvent.end}`}
              </p>
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-8 w-full rounded-xl bg-[#003366] py-3 font-semibold text-white hover:bg-[#002244]"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
