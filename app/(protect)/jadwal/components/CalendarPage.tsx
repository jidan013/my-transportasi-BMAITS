"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import idLocale from "@fullcalendar/core/locales/id";
import type { EventClickArg, EventInput } from "@fullcalendar/core";
import { Loader2, RefreshCw, X } from "lucide-react";

import { getApprovedBookings } from "@/lib/services/booking-service";
import type { Booking } from "@/types/booking";

/* =========================
   TYPES
========================= */

interface BookingApiResponse {
  data: Booking[];
}

interface BookingDetailData {
  nama: string;
  nrp: string;
  unit_kerja: string;
  keperluan: string;
  plate: string;
}

interface SelectedEvent {
  title: string;
  start: string;
  end: string;
  data: BookingDetailData;
}

/* =========================
   TYPE GUARDS
========================= */

function isBookingArray(value: unknown): value is Booking[] {
  return Array.isArray(value);
}

function isBookingApiResponse(value: unknown): value is BookingApiResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    Array.isArray((value as BookingApiResponse).data)
  );
}

/* =========================
   PAGE
========================= */

export default function CalendarPage() {
  const calendarRef = useRef<FullCalendar | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [eventDataMap, setEventDataMap] = useState<
    Record<string, BookingDetailData>
  >({});
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /* =========================
     FETCH (TYPE SAFE)
  ========================= */

  const fetchBookings = useCallback(async (): Promise<void> => {
  try {
    setLoading(true);
    setError(null);

    const response = await getApprovedBookings();

    let normalized: Booking[] = [];

    if (Array.isArray(response)) {
      normalized = response;
    } else if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      Array.isArray((response as unknown as BookingApiResponse).data)
    ) {
      normalized = (response as BookingApiResponse).data;
    } else {
      throw new Error("Invalid booking response format");
    }

      setBookings(normalized);

      // Build map untuk detail event (hindari extendedProps typing issue)
      const map: Record<string, BookingDetailData> = {};
      normalized.forEach((b) => {
        const id = String(b.id);
        map[id] = {
          nama: b.nama,
          nrp: String(b.nrp),
          unit_kerja: b.unit_kerja,
          keperluan: b.keperluan,
          plate: b.vehicle?.nomor_polisi ?? "-",
        };
      });

      setEventDataMap(map);

      calendarRef.current?.getApi().refetchEvents();
    } catch (err) {
      console.error("Fetch booking failed:", err);
      setBookings([]);
      setEventDataMap({});
      setError("Gagal memuat jadwal kendaraan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  /* =========================
     EVENTS
  ========================= */

  const events: EventInput[] = useMemo(() => {
    return bookings.map((b): EventInput => ({
      id: String(b.id),
      title: b.vehicle?.nama_kendaraan ?? "Kendaraan",
      start: b.tanggal_peminjam,
      end: b.tanggal_kembali,
      backgroundColor: "#003366",
      borderColor: "#003366",
      textColor: "#ffffff",
    }));
  }, [bookings]);

  /* =========================
     EVENT CLICK
  ========================= */

  const handleEventClick = useCallback(
    (info: EventClickArg): void => {
      const eventId = info.event.id?.toString() ?? "";
      const detail = eventDataMap[eventId];

      if (!detail) {
        console.warn("Event data not found for id:", eventId);
        return;
      }

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
        title: info.event.title || "Kendaraan",
        start,
        end,
        data: detail,
      });
    },
    [eventDataMap]
  );

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
    <div className="min-h-screen bg-slate-100 p-6">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-xl text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-3xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black text-[#003366]">
            Kalender Kendaraan
          </h1>

          <button
            onClick={fetchBookings}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#003366] text-white rounded-xl hover:bg-[#002855] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

      {/* =========================
          MODAL
      ========================= */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setSelectedEvent(null)
          }
        >
          <div className="bg-white p-8 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-[#003366]">
                {selectedEvent.title}
              </h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-500 hover:text-gray-700 p-1 -m-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <p>
                <span className="font-semibold">Nama:</span>{" "}
                {selectedEvent.data.nama}
              </p>
              <p>
                <span className="font-semibold">NRP:</span>{" "}
                {selectedEvent.data.nrp}
              </p>
              <p>
                <span className="font-semibold">Unit Kerja:</span>{" "}
                {selectedEvent.data.unit_kerja}
              </p>
              <p>
                <span className="font-semibold">Plat:</span>{" "}
                {selectedEvent.data.plate}
              </p>
              <p>
                <span className="font-semibold">Keperluan:</span>{" "}
                {selectedEvent.data.keperluan}
              </p>
            </div>

            <p className="font-semibold text-green-700 bg-green-50 p-3 rounded-xl">
              {selectedEvent.start}
              {selectedEvent.end !== selectedEvent.start &&
                ` → ${selectedEvent.end}`}
            </p>

            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-6 w-full bg-[#003366] text-white py-3 rounded-xl hover:bg-[#002855] transition-colors font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
