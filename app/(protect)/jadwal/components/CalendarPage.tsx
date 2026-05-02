"use client";

import { useEffect, useState } from "react";
import type { Booking } from "@/types/booking";
import { getBookingSchedule } from "@/lib/services/booking-service";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Clock,
  Users,
  Building,
  FileText,
  BarChart2,
  CalendarCheck,
  Wrench,
  ExternalLink,
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

type ViewMode = "month" | "week" | "day";

/* ─── colour tokens ─────────────────────────────────────────────────────────── */
const NAVY   = "#1a2744";
const AMBER  = "#EF9F27";

export default function KalenderPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [bookings,    setBookings]    = useState<Booking[]>([]);
  const [loading,     setLoading]     = useState<boolean>(false);
  const [viewMode,    setViewMode]    = useState<ViewMode>("month");

  const formatDate = (d: Date): string => format(d, "yyyy-MM-dd");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const start = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        const end   = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0));
        const data  = await getBookingSchedule({ start_date: start, end_date: end });
        setBookings(data);
      } catch (error) {
        console.error("Gagal memuat jadwal:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentDate.getFullYear(), currentDate.getMonth()]);

  /* ─── helpers ──────────────────────────────────────────────────────────── */
  const getBookingsForDay = (dateStr: string): Booking[] =>
    bookings.filter((b) => {
      if (!b.tanggal_pinjam || !b.tanggal_kembali) return false;
      const start  = parseISO(b.tanggal_pinjam);
      const end    = parseISO(b.tanggal_kembali);
      const target = parseISO(dateStr);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || isNaN(target.getTime())) return false;
      return isWithinInterval(target, { start, end });
    });

  const todayStr = formatDate(new Date());

  /* ─── navigation ───────────────────────────────────────────────────────── */
  const goPrev = () => {
    if (viewMode === "month") setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    else if (viewMode === "week") setCurrentDate(addDays(currentDate, -7));
    else setCurrentDate(addDays(currentDate, -1));
  };
  const goNext = () => {
    if (viewMode === "month") setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    else if (viewMode === "week") setCurrentDate(addDays(currentDate, 7));
    else setCurrentDate(addDays(currentDate, 1));
  };
  const goToday = () => setCurrentDate(new Date());

  /* ─── calendar math ────────────────────────────────────────────────────── */
  const year         = currentDate.getFullYear();
  const month        = currentDate.getMonth();
  const firstDay     = new Date(year, month, 1).getDay() || 7;   // Mon=1…Sun=7
  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const prevMonthDays= new Date(year, month, 0).getDate();
  const weekStart    = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sun-start to match image
  const weekDays: Date[] = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const currentDayStr = formatDate(currentDate);
  const dayBookings   = getBookingsForDay(currentDayStr);

  const title: string = {
    month: format(currentDate, "MMMM yyyy", { locale: id }),
    week:  `${format(weekStart, "d MMM", { locale: id })} – ${format(endOfWeek(weekStart, { weekStartsOn: 0 }), "d MMM yyyy", { locale: id })}`,
    day:   format(currentDate, "EEEE, dd MMMM yyyy", { locale: id }),
  }[viewMode];

  const handleDayClick = (date: Date) => { setCurrentDate(date); setViewMode("day"); };

  const formatTanggal = (raw?: string): string => {
    if (!raw) return "—";
    try { return format(parseISO(raw), "dd MMMM yyyy", { locale: id }); }
    catch { return raw; }
  };

  /* ─── stat cards (static placeholders — swap for real data if available) ── */
  const totalBookings   = bookings.length;
  const activeBookings  = bookings.filter((b) => getBookingsForDay(todayStr).includes(b)).length;
  const utilRate        = totalBookings > 0 ? Math.min(Math.round((activeBookings / Math.max(totalBookings, 1)) * 100 + 60), 99) : 0;

  /* ─── today's schedule list ────────────────────────────────────────────── */
  const todaySchedule   = getBookingsForDay(currentDayStr);

  /* ─── shared cell pill colors ──────────────────────────────────────────── */
  const pillColors = [
    "bg-[#1a2744] text-white",
    "bg-amber-400 text-gray-900",
    "bg-emerald-600 text-white",
    "bg-sky-600 text-white",
  ];

  /* ─── Sun/Mon header based on image ─────────────────────────────────────── */
  const DOW_MONTH = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  // firstDay in image uses Sun=0 index
  const firstDaySun = new Date(year, month, 1).getDay(); // 0=Sun

  /* ──────────────────────────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6 lg:px-10">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jadwal Kendaraan</h1>
            <p className="text-sm text-gray-500 mt-1">
              Real-time monitoring of institutional asset usage and bookings.
            </p>
          </div>

          {/* View toggle + controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Month / Week / Day toggle */}
            <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {(["month", "week", "day"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 text-sm font-semibold transition-colors ${
                    viewMode === mode
                      ? "bg-[#1a2744] text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {mode === "month" ? "Month" : mode === "week" ? "Week" : "Day"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Calendar Card ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Calendar toolbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Legend */}
              {viewMode === "month" && (
                <div className="hidden sm:flex items-center gap-4 mr-4 text-xs font-medium text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1a2744]" />
                    Active Booking
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    Completed
                  </span>
                </div>
              )}

              <button
                onClick={goPrev}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>

              <button
                onClick={goToday}
                className="px-3 py-1.5 text-sm font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              >
                Today
              </button>

              <button
                onClick={goNext}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* ════ MONTH VIEW ════ */}
          {viewMode === "month" && (
            <>
              {/* DOW headers */}
              <div className="grid grid-cols-7 border-b border-gray-100">
                {DOW_MONTH.map((d) => (
                  <div
                    key={d}
                    className="py-3 text-center text-xs font-semibold text-gray-400 tracking-wider border-r border-gray-100 last:border-r-0"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-7">
                {/* Prev month filler (Sun-based) */}
                {Array.from({ length: firstDaySun }).map((_, i) => {
                  const day = prevMonthDays - (firstDaySun - 1 - i);
                  return (
                    <div
                      key={`prev-${i}`}
                      onClick={() => handleDayClick(new Date(year, month - 1, day))}
                      className="min-h-[90px] lg:min-h-[110px] p-2 border-b border-r border-gray-100 bg-gray-50/60 cursor-pointer hover:bg-gray-100/50 transition-colors"
                    >
                      <span className="text-sm text-gray-300 font-medium">{day}</span>
                    </div>
                  );
                })}

                {/* Current month days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day      = i + 1;
                  const date     = new Date(year, month, day);
                  const dateStr  = formatDate(date);
                  const isToday  = dateStr === todayStr;
                  const dayBkgs  = getBookingsForDay(dateStr);

                  return (
                    <div
                      key={day}
                      onClick={() => handleDayClick(date)}
                      className={`min-h-[90px] lg:min-h-[110px] p-2 border-b border-r border-gray-100 cursor-pointer transition-colors group
                        ${isToday ? "bg-blue-50/40" : "hover:bg-gray-50/70"}
                      `}
                    >
                      {/* Date number */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-colors
                            ${isToday
                              ? "bg-[#1a2744] text-white"
                              : "text-gray-700 group-hover:bg-gray-100"
                            }`}
                        >
                          {day}
                        </span>
                        {isToday && (
                          <span className="text-[9px] font-bold text-[#1a2744] tracking-wider">TODAY</span>
                        )}
                      </div>

                      {/* Booking pills */}
                      <div className="space-y-1">
                        {dayBkgs.slice(0, 2).map((b, idx) => (
                          <div
                            key={idx}
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md truncate ${pillColors[idx % pillColors.length]}`}
                          >
                            {b.vehicle?.nama_kendaraan ?? "Kendaraan"}
                          </div>
                        ))}
                        {dayBkgs.length > 2 && (
                          <div className="text-[10px] font-semibold text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded-md">
                            + {dayBkgs.length - 2} more units
                          </div>
                        )}
                        {dayBkgs.length === 1 && (
                          <div className="text-[10px] text-gray-400 px-1.5">
                            {/* subtle occupied indicator already shown via pill */}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Next month filler */}
                {Array.from({ length: (7 - ((firstDaySun + daysInMonth) % 7)) % 7 }).map((_, i) => (
                  <div
                    key={`next-${i}`}
                    onClick={() => handleDayClick(new Date(year, month + 1, i + 1))}
                    className="min-h-[90px] lg:min-h-[110px] p-2 border-b border-r border-gray-100 bg-gray-50/60 cursor-pointer hover:bg-gray-100/50 transition-colors"
                  >
                    <span className="text-sm text-gray-300 font-medium">{i + 1}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ════ WEEK VIEW ════ */}
          {viewMode === "week" && (
            <>
              <div className="grid grid-cols-7 border-b border-gray-100">
                {weekDays.map((date) => {
                  const isToday = formatDate(date) === todayStr;
                  return (
                    <div
                      key={formatDate(date)}
                      className="py-3 text-center border-r border-gray-100 last:border-r-0"
                    >
                      <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase block">
                        {format(date, "EEE", { locale: id })}
                      </span>
                      <span
                        className={`text-lg font-bold mt-0.5 w-9 h-9 mx-auto flex items-center justify-center rounded-full
                          ${isToday ? "bg-[#1a2744] text-white" : "text-gray-700"}`}
                      >
                        {format(date, "d")}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-7 divide-x divide-gray-100">
                {weekDays.map((date) => {
                  const dateStr = formatDate(date);
                  const isToday = dateStr === todayStr;
                  const dayBkgs = getBookingsForDay(dateStr);
                  return (
                    <div
                      key={dateStr}
                      onClick={() => handleDayClick(date)}
                      className={`min-h-[200px] p-3 cursor-pointer transition-colors
                        ${isToday ? "bg-blue-50/30" : "hover:bg-gray-50/70"}`}
                    >
                      {dayBkgs.length > 0 ? (
                        <div className="space-y-2">
                          {dayBkgs.slice(0, 3).map((b, idx) => (
                            <div
                              key={idx}
                              className={`text-[11px] font-semibold px-2 py-1.5 rounded-lg ${pillColors[idx % pillColors.length]}`}
                            >
                              <div className="truncate">{b.vehicle?.nama_kendaraan ?? "Kendaraan"}</div>
                              <div className={`text-[10px] font-normal truncate mt-0.5 ${idx === 0 ? "text-white/70" : idx === 1 ? "text-gray-700/70" : "text-white/70"}`}>
                                {b.nama}
                              </div>
                            </div>
                          ))}
                          {dayBkgs.length > 3 && (
                            <div className="text-[10px] text-gray-500 text-center font-medium">
                              +{dayBkgs.length - 3} lagi
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full min-h-[160px]">
                          <span className="text-xs text-gray-300 font-medium">Tersedia</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ════ DAY VIEW ════ */}
          {viewMode === "day" && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-[#1a2744]" />
                <h3 className="text-base font-bold text-gray-900">Detail Peminjaman</h3>
                {isSameDay(currentDate, new Date()) && (
                  <span className="text-xs font-bold text-[#1a2744] bg-blue-50 px-2.5 py-1 rounded-full">Hari Ini</span>
                )}
              </div>

              {dayBookings.length > 0 ? (
                <div className="space-y-4">
                  {dayBookings.map((b, idx) => (
                    <div
                      key={b.id ?? idx}
                      className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-xl bg-[#1a2744]/10 flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4 text-[#1a2744]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">
                            {b.vehicle?.nama_kendaraan ?? "Kendaraan Tidak Diketahui"}
                          </h4>
                          {b.vehicle?.nomor_polisi && (
                            <span className="text-xs text-gray-400 font-mono">{b.vehicle.nomor_polisi}</span>
                          )}
                        </div>
                        <div className="ml-auto">
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700">
                            Disetujui
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Peminjam</p>
                          <p className="font-medium text-gray-800">{b.nama}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">NRP</p>
                          <p className="font-medium text-gray-800 font-mono">{b.nrp}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Unit Kerja</p>
                          <p className="font-medium text-gray-800 text-xs">{b.unit_kerja}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Keperluan</p>
                          <p className="text-gray-700 text-xs">{b.keperluan || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tgl Pinjam</p>
                          <p className="font-medium text-gray-800 text-xs">{formatTanggal(b.tanggal_pinjam)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tgl Kembali</p>
                          <p className="font-medium text-gray-800 text-xs">{formatTanggal(b.tanggal_kembali)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-400 text-sm">
                  Tidak ada peminjaman — semua kendaraan tersedia.
                </div>
              )}
            </div>
          )}

          {/* Loading overlay inside card */}
          {loading && (
            <div className="flex items-center justify-center gap-3 py-10 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin text-[#1a2744]" />
              <span className="text-sm font-medium">Memuat jadwal...</span>
            </div>
          )}
        </div>

        {/* ── Stat Cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Utilization Rate */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#1a2744]/10 flex items-center justify-center shrink-0">
              <BarChart2 className="w-5 h-5 text-[#1a2744]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Utilization Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{utilRate}%</p>
              <p className="text-xs text-emerald-600 font-semibold mt-0.5">↑ 4% from last month</p>
            </div>
          </div>

          {/* Upcoming Bookings */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#1a2744]/10 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-5 h-5 text-[#1a2744]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Upcoming Bookings</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{totalBookings} Units</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Scheduled for next 7 days</p>
            </div>
          </div>

          {/* Pending Maintenance */}
          
        </div>

        {/* ── Today's Schedule List ───────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">
              Schedule for {format(currentDate, "MMMM d, yyyy")}
            </h2>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-[#1a2744] hover:underline">
              View Detailed List
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Memuat...</span>
            </div>
          ) : todaySchedule.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400">
              Tidak ada jadwal untuk hari ini.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {todaySchedule.map((b, idx) => (
                <div key={b.id ?? idx} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                  {/* Vehicle icon placeholder */}
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    <CalendarDays className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Name + subtitle */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {b.vehicle?.nama_kendaraan ?? "Kendaraan"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {b.vehicle?.nomor_polisi} • {b.unit_kerja}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">TIME</p>
                    <p className="text-xs font-semibold text-gray-700 mt-0.5">Full Day</p>
                  </div>

                  {/* Status */}
                  <div className="text-right shrink-0 min-w-[90px]">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">STATUS</p>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1a2744]" />
                      <span className="text-xs font-bold text-[#1a2744]">IN PROGRESS</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}