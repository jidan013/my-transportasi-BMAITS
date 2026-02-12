"use client";

import { useEffect, useState } from "react";
import { getBookingSchedule } from "@/lib/services/booking-service";
import type { Booking } from "@/types/booking"; // pastikan path sesuai
import { CalendarDays, ChevronLeft, ChevronRight, Loader2, Clock, Users, Building, FileText } from "lucide-react";
import { format, startOfWeek, endOfWeek, addDays, isSameDay, isWithinInterval, parseISO } from "date-fns";
import { id } from "date-fns/locale";

// Warna ITS resmi (berdasarkan brand assets: Congress Blue #20417F sebagai navy utama)
const ITS_PRIMARY = "#20417F";
const ITS_GRADIENT = "linear-gradient(to right, #20417F, #3a5ca3)";
const ITS_LIGHT_BG = "#f0f5ff";

type ViewMode = "month" | "week" | "day";

export default function KalenderPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  const formatDate = (d: Date) => format(d, "yyyy-MM-dd");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const start = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        const end = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0));

        const res = await getBookingSchedule({ start_date: start, end_date: end });
        setBookings(res.filter((b) => b.status_pengajuan === "disetujui"));
      } catch (err) {
        console.error("Gagal memuat jadwal:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentDate.getFullYear(), currentDate.getMonth()]);

  const getBookingsForDay = (dateStr: string) =>
    bookings.filter((b) =>
      isWithinInterval(parseISO(dateStr), {
        start: parseISO(b.tanggal_peminjam),
        end: parseISO(b.tanggal_kembali),
      })
    );

  const isBooked = (dateStr: string) => getBookingsForDay(dateStr).length > 0;

  const todayStr = formatDate(new Date());

  const goPrev = () => {
    if (viewMode === "month") setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    else if (viewMode === "week") setCurrentDate(addDays(currentDate, -7));
    else if (viewMode === "day") setCurrentDate(addDays(currentDate, -1));
  };

  const goNext = () => {
    if (viewMode === "month") setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    else if (viewMode === "week") setCurrentDate(addDays(currentDate, 7));
    else if (viewMode === "day") setCurrentDate(addDays(currentDate, 1));
  };

  const goToday = () => setCurrentDate(new Date());

  // Month helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay() || 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Week helpers
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Day helpers
  const currentDayStr = formatDate(currentDate);
  const dayBookings = getBookingsForDay(currentDayStr);

  const title = {
    month: format(currentDate, "MMMM yyyy", { locale: id }),
    week: `${format(weekStart, "d MMM", { locale: id })} – ${format(endOfWeek(weekStart, { weekStartsOn: 1 }), "d MMM yyyy", { locale: id })}`,
    day: format(currentDate, "EEEE, dd MMMM yyyy", { locale: id }),
  }[viewMode];

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setViewMode("day");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <h1
            className="text-3xl md:text-3xl lg:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent"
            style={{ backgroundImage: ITS_GRADIENT }}
          >
            Kalender Peminjaman Kendaraan
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl">
            Monitoring real-time jadwal kendaraan resmi ITS
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={goPrev}
              className="p-3.5 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 shadow hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            <button
              onClick={goNext}
              className="p-3.5 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 shadow hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            <button
              onClick={goToday}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ backgroundImage: ITS_GRADIENT }}
            >
              <CalendarDays className="w-5 h-5" />
              Hari Ini
            </button>

            <h2 className="text-3xl font-bold text-gray-900 ml-2 lg:ml-6">{title}</h2>
          </div>

          <div className="inline-flex bg-white/90 backdrop-blur-lg p-1.5 rounded-2xl shadow-xl border border-gray-200/70">
            {(["month", "week", "day"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all duration-300 relative
                  ${viewMode === mode ? "text-white shadow-lg scale-105" : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/60"}
                `}
                style={viewMode === mode ? { backgroundImage: ITS_GRADIENT } : {}}
              >
                {mode === "month" ? "Bulan" : mode === "week" ? "Minggu" : "Hari"}
                {viewMode === mode && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/50 rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Views */}
        <div className="transition-all duration-500">
          {viewMode === "month" && (
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100/80 overflow-hidden">
              <div className="grid grid-cols-7" style={{ backgroundImage: ITS_GRADIENT }}>
                {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
                  <div key={d} className="py-6 text-center font-semibold text-white text-base border-r border-blue-900/30 last:border-r-0">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {/* Prev month */}
                {Array.from({ length: firstDay - 1 }).map((_, i) => {
                  const day = prevMonthDays - (firstDay - 2 - i);
                  return (
                    <div
                      key={`prev-${i}`}
                      className="min-h-[120px] lg:min-h-[180px] p-4 border-b border-r border-gray-100 bg-gray-50/50 text-gray-400 text-sm font-medium cursor-pointer hover:bg-gray-100/70"
                      onClick={() => handleDayClick(new Date(year, month - 1, day))}
                    >
                      {day}
                    </div>
                  );
                })}

                {/* Current month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const date = new Date(year, month, day);
                  const dateStr = formatDate(date);
                  const isToday = dateStr === todayStr;
                  const bookedCount = getBookingsForDay(dateStr).length;

                  return (
                    <div
                      key={day}
                      className={`
                        group relative min-h-[120px] lg:min-h-[180px] p-5 border-b border-r border-gray-100 
                        transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] cursor-pointer
                        ${isToday ? "bg-gradient-to-br from-blue-50 to-white" : "hover:bg-blue-50/30"}
                        ${bookedCount > 0 ? "bg-amber-50/40" : ""}
                      `}
                      onClick={() => handleDayClick(date)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-2xl font-bold ${isToday ? "text-[#20417F]" : "text-gray-800"}`}>{day}</span>
                        {isToday && <span className="text-xs bg-blue-100 text-[#20417F] px-2.5 py-1 rounded-full">HARI INI</span>}
                      </div>

                      {bookedCount > 0 && (
                        <div className="mt-2 text-sm text-gray-600 font-medium">
                          {bookedCount} peminjaman
                        </div>
                      )}

                      {bookedCount > 0 && (
                        <div className="absolute bottom-5 left-5 right-5">
                          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md">
                            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                            DIPINJAM
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                  );
                })}

                {/* Next month filler */}
                {Array.from({ length: (7 - ((firstDay - 1 + daysInMonth) % 7)) % 7 }).map((_, i) => (
                  <div
                    key={`next-${i}`}
                    className="min-h-[120px] lg:min-h-[180px] p-4 border-b border-r border-gray-100 bg-gray-50/50 text-gray-400 text-sm font-medium cursor-pointer hover:bg-gray-100/70"
                    onClick={() => handleDayClick(new Date(year, month + 1, i + 1))}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === "week" && (
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100/80 overflow-hidden">
              <div className="grid grid-cols-7" style={{ backgroundImage: ITS_GRADIENT }}>
                {weekDays.map((date) => (
                  <div
                    key={formatDate(date)}
                    className="py-6 text-center font-semibold text-white text-base border-r border-blue-900/30 last:border-r-0"
                  >
                    {format(date, "EEE d", { locale: id })}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {weekDays.map((date) => {
                  const dateStr = formatDate(date);
                  const isToday = dateStr === todayStr;
                  const dayBookings = getBookingsForDay(dateStr);

                  return (
                    <div
                      key={dateStr}
                      className={`
                        group relative min-h-[220px] lg:min-h-[320px] p-5 border-r border-gray-100 last:border-r-0
                        transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer
                        ${isToday ? "bg-gradient-to-br from-blue-50 to-white" : "hover:bg-blue-50/30"}
                        ${dayBookings.length > 0 ? "bg-amber-50/40" : ""}
                      `}
                      onClick={() => handleDayClick(date)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-3xl font-bold ${isToday ? "text-[#20417F]" : "text-gray-800"}`}>
                          {format(date, "d")}
                        </span>
                        {isToday && <span className="text-sm bg-blue-100 text-[#20417F] px-3 py-1.5 rounded-full">HARI INI</span>}
                      </div>

                      {dayBookings.length > 0 ? (
                        <div className="space-y-3">
                          {dayBookings.slice(0, 3).map((b, idx) => (
                            <div key={idx} className="bg-amber-100/60 p-3 rounded-lg text-sm">
                              <div className="font-semibold truncate">{b.vehicle?.nama_kendaraan || "Kendaraan"}</div>
                              <div className="text-gray-600 truncate">Oleh: {b.nama}</div>
                            </div>
                          ))}
                          {dayBookings.length > 3 && (
                            <div className="text-center text-sm text-gray-500">+{dayBookings.length - 3} lagi</div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 mt-16 font-medium">Tersedia</div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === "day" && (
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100/80 p-8 lg:p-12">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <Clock className="w-8 h-8 text-[#20417F]" />
                  <h3 className="text-3xl font-bold text-gray-900">Detail Peminjaman</h3>
                </div>
                {isSameDay(currentDate, new Date()) && (
                  <span className="text-sm font-medium bg-blue-100 text-[#20417F] px-4 py-2 rounded-full">Hari Ini</span>
                )}
              </div>

              {dayBookings.length > 0 ? (
                <div className="space-y-8">
                  {dayBookings.map((b, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-amber-50 to-white p-7 rounded-2xl shadow-md border border-amber-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
                    >
                      <div className="flex items-center gap-4 mb-5">
                        <Users className="w-7 h-7 text-amber-700" />
                        <h4 className="text-2xl font-semibold text-gray-800">
                          {b.vehicle?.nama_kendaraan || "Kendaraan Tidak Diketahui"}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700">
                        <div className="flex items-start gap-3">
                          <Users className="w-5 h-5 text-gray-600 mt-0.5" />
                          <div>
                            <div className="font-medium">Peminjam</div>
                            <div>{b.nama}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="font-medium text-gray-600">NRP</span>
                          <div>{b.nrp}</div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Building className="w-5 h-5 text-gray-600 mt-0.5" />
                          <div>
                            <div className="font-medium">Unit Kerja</div>
                            <div>{b.unit_kerja}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
                          <div>
                            <div className="font-medium">Keperluan</div>
                            <div>{b.keperluan || "—"}</div>
                          </div>
                        </div>

                        <div>
                          <div className="font-medium">Mulai</div>
                          <div>{b.tanggal_peminjam}</div>
                        </div>

                        <div>
                          <div className="font-medium">Kembali</div>
                          <div>{b.tanggal_kembali}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-600 text-xl font-medium">
                  Tidak ada peminjaman hari ini — Semua kendaraan tersedia!
                </div>
              )}
            </div>
          )}
        </div>

        {loading && (
          <div className="mt-20 flex flex-col items-center text-[#20417F] animate-pulse">
            <Loader2 className="w-14 h-14 animate-spin mb-6" />
            <p className="text-xl font-semibold">Memuat jadwal peminjaman kendaraan...</p>
          </div>
        )}
      </div>
    </div>
  );
}