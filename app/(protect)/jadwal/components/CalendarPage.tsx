"use client";

import { useEffect, useState } from "react";
import { getBookingSchedule } from "@/lib/services/booking-service";
import type { Booking } from "@/types/booking";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Clock,
  Users,
  Building,
  FileText,
} from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { id } from "date-fns/locale";

const ITS_linear = "linear-gradient(to right, #20417F, #3a5ca3)";

type ViewMode = "month" | "week" | "day";

export default function KalenderPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  const formatDate = (d: Date): string => format(d, "yyyy-MM-dd");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const start = formatDate(
          new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        );
        const end = formatDate(
          new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0)
        );

        const res: Booking[] = await getBookingSchedule({
          start_date: start,
          end_date: end,
        });

        setBookings(
          Array.isArray(res)
            ? res.filter((b) => b.status_booking === "disetujui")
            : []
        );
      } catch (error) {
        console.error("Gagal memuat jadwal:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentDate.getFullYear(), currentDate.getMonth()]);

  /* ================= SAFE DATE FILTER ================= */
  const getBookingsForDay = (dateStr: string): Booking[] => {
    return bookings.filter((b) => {
      if (!b.tanggal_pinjam || !b.tanggal_kembali) return false;

      const start = parseISO(b.tanggal_pinjam);
      const end = parseISO(b.tanggal_kembali);
      const target = parseISO(dateStr);

      if (
        isNaN(start.getTime()) ||
        isNaN(end.getTime()) ||
        isNaN(target.getTime())
      ) {
        return false;
      }

      return isWithinInterval(target, { start, end });
    });
  };

  const todayStr = formatDate(new Date());

  /* ================= NAVIGATION ================= */
  const goPrev = () => {
    if (viewMode === "month")
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      );
    else if (viewMode === "week")
      setCurrentDate(addDays(currentDate, -7));
    else setCurrentDate(addDays(currentDate, -1));
  };

  const goNext = () => {
    if (viewMode === "month")
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      );
    else if (viewMode === "week")
      setCurrentDate(addDays(currentDate, 7));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const goToday = () => setCurrentDate(new Date());

  /* ================= HELPERS ================= */
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay() || 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(weekStart, i)
  );

  const currentDayStr = formatDate(currentDate);
  const dayBookings = getBookingsForDay(currentDayStr);

  const title = {
    month: format(currentDate, "MMMM yyyy", { locale: id }),
    week: `${format(weekStart, "d MMM", { locale: id })} – ${format(
      endOfWeek(weekStart, { weekStartsOn: 1 }),
      "d MMM yyyy",
      { locale: id }
    )}`,
    day: format(currentDate, "EEEE, dd MMMM yyyy", { locale: id }),
  }[viewMode];

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setViewMode("day");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

        {/* HEADER */}
        <div className="mb-12 text-center md:text-left">
          <h1
            className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent"
            style={{ backgroundImage: ITS_linear }}
          >
            Kalender Peminjaman Kendaraan
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Monitoring real-time jadwal kendaraan resmi ITS
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <button onClick={goPrev} className="p-3 rounded-xl bg-white shadow">
            <ChevronLeft />
          </button>
          <button onClick={goNext} className="p-3 rounded-xl bg-white shadow">
            <ChevronRight />
          </button>
          <button
            onClick={goToday}
            className="px-6 py-3 rounded-xl text-white font-semibold shadow"
            style={{ backgroundImage: ITS_linear }}
          >
            <CalendarDays className="inline mr-2" />
            Hari Ini
          </button>
          <h2 className="text-2xl font-bold ml-4">{title}</h2>
        </div>

        {/* MONTH VIEW */}
        {viewMode === "month" && (
          <div className="bg-white rounded-3xl shadow overflow-hidden">
            <div
              className="grid grid-cols-7 text-white font-semibold"
              style={{ backgroundImage: ITS_linear }}
            >
              {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
                <div key={d} className="py-4 text-center">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(year, month, day);
                const dateStr = formatDate(date);
                const isToday = dateStr === todayStr;
                const booked = getBookingsForDay(dateStr).length > 0;

                return (
                  <div
                    key={day}
                    onClick={() => handleDayClick(date)}
                    className={`
                      p-4 border cursor-pointer transition
                      ${isToday ? "bg-gradient-to-br from-blue-50 to-white" : ""}
                      ${booked ? "bg-amber-50/40" : "hover:bg-blue-50/30"}
                    `}
                  >
                    <div className="font-bold">{day}</div>

                    {booked && (
                      <span className="inline-block mt-3 px-3 py-1 text-sm text-white rounded-full
                        bg-gradient-to-r from-amber-500 to-amber-600">
                        DIPINJAM
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="mt-20 flex flex-col items-center text-[#20417F]">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-semibold">Memuat jadwal...</p>
          </div>
        )}
      </div>
    </div>
  );
}