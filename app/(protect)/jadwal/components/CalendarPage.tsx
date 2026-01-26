"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import idLocale from "@fullcalendar/core/locales/id";
import type { EventClickArg, EventInput } from "@fullcalendar/core";
import { Loader2, RefreshCw } from "lucide-react";

import { getApprovedBookings } from "@/lib/services/booking-service";
import type { Booking } from "@/types/booking";

/* =========================
   TYPES
========================= */

interface SelectedEvent {
  title: string;
  start: string;
  end: string;
  data: {
    nama: string;
    nrp: string;
    unit_kerja: string;
    keperluan: string;
    plate: string;
  };
}

/* =========================
   COMPONENT
========================= */

export default function CalendarPage() {
  const calendarRef = useRef<FullCalendar | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* =========================
     FETCH
  ========================= */

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getApprovedBookings();
      setBookings(data);

      calendarRef.current?.getApi().refetchEvents();
    } catch {
      setError("Gagal memuat jadwal kendaraan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  /* =========================
     EVENTS (TYPE SAFE)
  ========================= */

  const events: EventInput[] = useMemo(() => {
    return bookings.map((b) => ({
      id: String(b.id),
      title: b.vehicle?.nama_kendaraan ?? "Kendaraan",
      start: b.tanggal_peminjam,
      end: b.tanggal_kembali,
      backgroundColor: "#003366",
      borderColor: "#003366",
      textColor: "#ffffff",
      extendedProps: {
        nama: b.nama,
        nrp: b.nrp,
        unit_kerja: b.unit_kerja,
        keperluan: b.keperluan,
        plate: b.vehicle?.nomor_polisi ?? "-",
      },
    }));
  }, [bookings]);

  /* =========================
     CLICK
  ========================= */

  const handleEventClick = useCallback((info: EventClickArg) => {
    const data = info.event.extendedProps as SelectedEvent["data"];

    const start =
      info.event.start?.toLocaleDateString("id-ID", {
        dateStyle: "full",
      }) ?? "-";

    const end = info.event.end
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

  /* =========================
     LOADING
  ========================= */

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#003366]" />
      </div>
    );
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-xl text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl shadow">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-black text-[#003366]">
            Kalender Kendaraan
          </h1>

          <button
            onClick={fetchBookings}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#003366] text-white rounded-xl"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </button>
        </div>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="id"
          locales={[idLocale]}
          events={events}
          eventClick={handleEventClick}
          height={650}
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
          noEventsText="Tidak ada jadwal"
        />
      </div>

      {/* MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">
              {selectedEvent.title}
            </h2>

            <p><b>Nama:</b> {selectedEvent.data.nama}</p>
            <p><b>NRP:</b> {selectedEvent.data.nrp}</p>
            <p><b>Unit Kerja:</b> {selectedEvent.data.unit_kerja}</p>
            <p><b>Plat:</b> {selectedEvent.data.plate}</p>
            <p><b>Keperluan:</b> {selectedEvent.data.keperluan}</p>

            <p className="mt-4 font-semibold text-green-700">
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
