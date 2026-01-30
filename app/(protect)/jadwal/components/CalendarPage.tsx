"use client";

import { useEffect, useState } from "react";
import { getBookingSchedule } from "@/lib/services/booking-service";
import type { Booking } from "@/types/booking";

export default function KalenderPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  /* ================= FETCH SCHEDULE ================= */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const start = new Date(year, month, 1)
        .toISOString()
        .split("T")[0];

      const end = new Date(year, month + 1, 0)
        .toISOString()
        .split("T")[0];

      const res = await getBookingSchedule({
        start_date: start,
        end_date: end,
      });

      setBookings(
        res.filter((b) => b.status_pengajuan === "disetujui")
      );

      setLoading(false);
    };

    fetchData();
  }, [year, month]);

  /* ================= DATE HELPERS ================= */
  const startDay = new Date(year, month, 1).getDay() || 7; // Senin = 1
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const isBooked = (date: string) =>
    bookings.some(
      (b) =>
        date >= b.tanggal_peminjam &&
        date <= b.tanggal_kembali
    );

  const todayStr = new Date().toISOString().split("T")[0];

  /* ================= NAVIGATION ================= */
  const prevMonth = () =>
    setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(year, month + 1, 1));
  const today = () => setCurrentDate(new Date());

  return (
    <div className="">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Kalender Kendaraan</h1>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm"
        >
          🔄 Refresh
        </button>
      </div>

      {/* CONTROLS */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={prevMonth} className="px-3 py-1 border rounded">
          ◀
        </button>
        <button onClick={nextMonth} className="px-3 py-1 border rounded">
          ▶
        </button>
        <button
          onClick={today}
          className="px-3 py-1 bg-gray-600 text-white rounded"
        >
          Hari Ini
        </button>

        <h2 className="ml-4 text-xl font-semibold">
          {currentDate.toLocaleString("id-ID", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <div className="ml-auto flex gap-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded">
            Bulan
          </button>
          <button className="px-3 py-1 border rounded">Minggu</button>
          <button className="px-3 py-1 border rounded">Hari</button>
        </div>
      </div>

      {/* CALENDAR */}
      <div className="border rounded-xl overflow-hidden bg-white">
        <div className="grid grid-cols-7 border-b">
          {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
            <div
              key={d}
              className="p-2 text-center font-semibold border-r last:border-r-0"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {/* PREV MONTH */}
          {Array.from({ length: startDay - 1 }).map((_, i) => (
            <div
              key={`prev-${i}`}
              className="h-24 p-2 text-gray-400 border"
            >
              {prevMonthDays - (startDay - 2 - i)}
            </div>
          ))}

          {/* CURRENT MONTH */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(
              2,
              "0"
            )}-${String(day).padStart(2, "0")}`;

            const booked = isBooked(dateStr);

            return (
              <div
                key={day}
                className={`h-24 p-2 border relative ${
                  dateStr === todayStr
                    ? "bg-yellow-50"
                    : ""
                }`}
              >
                <div className="font-semibold">{day}</div>

                {booked && (
                  <div className="absolute bottom-2 left-2 right-2 bg-yellow-200 text-xs rounded px-2 py-1">
                    Dipinjam
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {loading && (
        <p className="mt-4 text-gray-500">Memuat jadwal…</p>
      )}
    </div>
  );
}
