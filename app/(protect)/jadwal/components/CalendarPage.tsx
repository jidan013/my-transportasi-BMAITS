"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import idLocale from "@fullcalendar/core/locales/id";
import type { EventClickArg, EventInput } from "@fullcalendar/core";
import {
  Car,
  Bus,
  Truck,
  CarFront,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { getApprovedBookings } from "@/lib/services/booking-service";
import type { Booking } from "@/types/booking";

/* ======================================================
   TYPES
====================================================== */

type Vehicle = {
  id: number;
  nama: string;
  plate: string;
  icon: React.ElementType;
};

interface BookingExtendedProps {
  id: number;
  nama: string;
  nrp: number;
  keperluan: string;
  catatan?: string;
  plate: string;
}

interface SelectedEvent {
  title: string;
  start: string;
  end: string;
  data: BookingExtendedProps;
}

/* ======================================================
   STATIC DATA
====================================================== */

const VEHICLES: Vehicle[] = [
  { id: 1, nama: "Toyota Avanza", plate: "B 1234 XYZ", icon: Car },
  { id: 2, nama: "Honda Jazz", plate: "B 5678 ABC", icon: CarFront },
  { id: 3, nama: "Daihatsu Xenia", plate: "B 9012 DEF", icon: Car },
  { id: 4, nama: "Mitsubishi Pajero", plate: "B 9999 ZZZ", icon: Truck },
  { id: 5, nama: "Suzuki Ertiga", plate: "B 8888 ERT", icon: Bus },
];

/* ======================================================
   COMPONENT
====================================================== */

export default function CalendarPage() {
  const calendarRef = useRef<FullCalendar | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedEvent, setSelectedEvent] =
    useState<SelectedEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /* ======================================================
     FETCH
  ====================================================== */

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getApprovedBookings();
      setBookings(data);

      calendarRef.current?.getApi().refetchEvents();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal memuat jadwal booking");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchBookings]);

  /* ======================================================
     EVENTS MAPPING (TYPE SAFE)
  ====================================================== */

  const events: EventInput[] = useMemo(() => {
    return bookings.map((booking) => {
      const vehicle = VEHICLES.find(
        (v) => v.id === booking.vehicle_id
      );

      return {
        id: String(booking.id),
        title: vehicle?.nama ?? "Kendaraan Tidak Diketahui",
        start: booking.tanggal_peminjam,
        end: booking.tanggal_kembali,
        backgroundColor: "#003366",
        borderColor: "#003366",
        textColor: "#fff",
        extendedProps: {
          id: booking.id,
          nama: booking.nama ?? "-",
          nrp: booking.nrp ?? "-",
          keperluan: booking.keperluan ?? "-",
          plate: vehicle?.plate ?? "-",
        } satisfies BookingExtendedProps,
      };
    });
  }, [bookings]);

  /* ======================================================
     HANDLERS
  ====================================================== */

  const handleEventClick = useCallback((info: EventClickArg) => {
    const data = info.event.extendedProps as BookingExtendedProps;

    const start =
      info.event.start?.toLocaleDateString("id-ID", {
        dateStyle: "full",
      }) ?? "-";

    const end =
      info.event.end
        ? new Date(info.event.end.getTime() - 86400000).toLocaleDateString(
            "id-ID",
            { dateStyle: "full" }
          )
        : start;

    setSelectedEvent({
      title: info.event.title,
      start,
      end,
      data,
    });
  }, []);

  /* ======================================================
     LOADING STATE
  ====================================================== */

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="h-12 w-12 animate-spin text-[#003366]" />
      </div>
    );
  }

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-[#002244] to-[#00509e] text-white">
        <div className="px-8 py-16 text-center">
          <h1 className="text-5xl font-black">
            Jadwal Kendaraan Dinas
          </h1>
          <p className="mt-4 text-blue-100">
            Institut Teknologi Sepuluh Nopember
          </p>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 px-8 py-10 space-y-10">
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {/* VEHICLE LIST */}
        <section>
          <h2 className="text-2xl font-bold text-[#003366] mb-6">
            Kendaraan Tersedia
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
            {VEHICLES.map((vehicle) => {
              const Icon = vehicle.icon;
              return (
                <div
                  key={vehicle.id}
                  className="bg-white p-6 rounded-2xl shadow text-center"
                >
                  <Icon className="mx-auto h-10 w-10 text-[#003366]" />
                  <h3 className="mt-3 font-bold">{vehicle.nama}</h3>
                  <p className="text-xs text-gray-500 font-mono">
                    {vehicle.plate}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CALENDAR */}
        <section className="bg-white p-8 rounded-3xl shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black text-[#003366]">
              Kalender Jadwal
            </h2>
            <button
              onClick={fetchBookings}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 bg-[#003366] text-white rounded-xl"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </button>
          </div>

          <div className="h-[650px]">
            <FullCalendar
              ref={calendarRef}
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
              initialView="dayGridMonth"
              locale="id"
              locales={[idLocale]}
              events={events}
              eventClick={handleEventClick}
              height="100%"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              buttonText={{
                today: "Hari Ini",
                month: "Bulan",
                week: "Minggu",
                day: "Hari",
              }}
              dayMaxEvents={3}
              noEventsText="Tidak ada jadwal"
            />
          </div>
        </section>
      </main>

      {/* MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl max-w-lg w-full">
            <h2 className="text-2xl font-black text-[#003366] mb-4">
              {selectedEvent.title}
            </h2>

            <p><b>Peminjam:</b> {selectedEvent.data.nama}</p>
            <p><b>NRP:</b> {selectedEvent.data.nrp}</p>
            <p><b>Plat:</b> {selectedEvent.data.plate}</p>
            <p><b>Keperluan:</b> {selectedEvent.data.keperluan}</p>

            <p className="mt-4 font-bold text-green-700">
              {selectedEvent.start}
              {selectedEvent.end !== selectedEvent.start &&
                ` → ${selectedEvent.end}`}
            </p>

            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-6 w-full bg-[#003366] text-white py-3 rounded-xl"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
