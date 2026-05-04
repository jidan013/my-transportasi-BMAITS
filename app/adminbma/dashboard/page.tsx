"use client";

import { useState, useEffect } from "react";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import type { Transition } from "framer-motion";
import {
  IconCar,
  IconUsers,
  IconClock,
  IconCheck,
  IconX,
  IconRefresh,
  IconAlertCircle,
} from "@tabler/icons-react";
import {
  getAllBookings,
  getPendingBookings,
} from "@/lib/services/booking-service";
import type { Booking } from "@/types/booking";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Kemarin";
  return `${days} hari lalu`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type StatusBooking = Booking["status_booking"];

// ─── fadeUp helper ─────────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.35,
    ease: "easeOut" as const,
    delay,
  } satisfies Transition,
});

// ─── StatusBadge ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: StatusBooking }) {
  const map: Record<StatusBooking, string> = {
    menunggu:  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    disetujui: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    ditolak:   "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  const label: Record<StatusBooking, string> = {
    menunggu:  "Menunggu",
    disetujui: "Disetujui",
    ditolak:   "Ditolak",
  };
  return (
    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wider ${map[status]}`}>
      {label[status]}
    </span>
  );
}

// ─── ActivityAvatar ────────────────────────────────────────────────────────────

type ActivityType = "menunggu" | "disetujui" | "ditolak";

function ActivityAvatar({ type }: { type: ActivityType }) {
  const cfg: Record<ActivityType, { bg: string; icon: React.ReactNode }> = {
    menunggu:  { bg: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",             icon: <IconUsers className="w-4 h-4" /> },
    disetujui: { bg: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400", icon: <IconCheck className="w-4 h-4" /> },
    ditolak:   { bg: "bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400",                 icon: <IconX className="w-4 h-4" /> },
  };
  return (
    <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center ${cfg[type].bg}`}>
      {cfg[type].icon}
    </div>
  );
}

// ─── DonutChart ────────────────────────────────────────────────────────────────

function DonutChart({
  menunggu,
  disetujui,
  ditolak,
}: {
  menunggu: number;
  disetujui: number;
  ditolak: number;
}) {
  const total = menunggu + disetujui + ditolak || 1;
  const r = 54, cx = 72, cy = 72, stroke = 16;
  const circ = 2 * Math.PI * r;

  const segments = [
    { value: disetujui, color: "#1D9E75" },
    { value: menunggu,  color: "#EF9F27" },
    { value: ditolak,   color: "#E24B4A" },
  ];
  const legend = [
    { label: "Disetujui", count: disetujui, dot: "bg-emerald-500", countColor: "text-emerald-600 dark:text-emerald-400" },
    { label: "Menunggu",  count: menunggu,  dot: "bg-amber-400",   countColor: "text-amber-600 dark:text-amber-400" },
    { label: "Ditolak",   count: ditolak,   dot: "bg-red-500",     countColor: "text-red-500 dark:text-red-400" },
  ];

  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-36 h-36">
        <svg width="144" height="144" viewBox="0 0 144 144">
          <circle
            cx={cx} cy={cy} r={r} fill="none"
            stroke="#e5e7eb" strokeWidth={stroke}
            className="dark:stroke-gray-700"
          />
          {segments.map((seg, i) => {
            const dash = (seg.value / total) * circ;
            const el = (
              <circle
                key={i} cx={cx} cy={cy} r={r} fill="none"
                stroke={seg.color} strokeWidth={stroke}
                strokeDasharray={`${dash} ${circ}`}
                strokeDashoffset={-(offset / total) * circ}
                transform="rotate(-90 72 72)"
              />
            );
            offset += seg.value;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {menunggu + disetujui + ditolak}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-gray-400">
            booking
          </span>
        </div>
      </div>

      <div className="w-full space-y-3">
        {legend.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <span className={`w-2.5 h-2.5 rounded-full ${item.dot}`} />
              {item.label}
            </span>
            <span className={`font-semibold ${item.countColor}`}>
              {item.count} booking
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Skeletons ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="w-28 h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-5 py-3.5">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

function SkeletonActivity() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-3 animate-pulse">
          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Error State ───────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
      <IconAlertCircle className="w-10 h-10 text-red-400" />
      <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#002D72] dark:bg-[#00AEEF] text-white rounded-xl hover:opacity-90 transition-all"
      >
        <IconRefresh className="w-4 h-4" />
        Coba Lagi
      </button>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function FleetOverviewPage() {
  const [allBookings, setAllBookings]         = useState<Booking[]>([]);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState<string | null>(null);

  const [refreshTick, setRefreshTick] = useState(0);
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [all, pending] = await Promise.all([
          getAllBookings(),
          getPendingBookings(),
        ]);
        if (cancelled) return;
        setAllBookings(all);
        setPendingBookings(pending);
      } catch {
        if (!cancelled) setError("Gagal memuat data. Periksa koneksi atau coba lagi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [refreshTick]);

  // ── Derived stats ──────────────────────────────────────────────────────────

  const countDisetujui = allBookings.filter((b) => b.status_booking === "disetujui").length;
  const countMenunggu  = allBookings.filter((b) => b.status_booking === "menunggu").length;
  const countDitolak   = allBookings.filter((b) => b.status_booking === "ditolak").length;

  const statCards = [
    {
      label: "Total Booking",
      value: allBookings.length,
      badge: `${countMenunggu} menunggu`,
      badgeColor: countMenunggu > 0
        ? "text-amber-600 dark:text-amber-400"
        : "text-gray-400",
      barWidth: `${Math.min((allBookings.length / 50) * 100, 100)}%`,
      icon: <IconCar className="w-5 h-5 text-gray-500 dark:text-gray-400" />,
    },
    {
      label: "Booking Disetujui",
      value: countDisetujui,
      badge: "Aktif",
      badgeColor: "text-emerald-600 dark:text-emerald-400",
      barWidth: allBookings.length
        ? `${Math.round((countDisetujui / allBookings.length) * 100)}%`
        : "0%",
      icon: <IconUsers className="w-5 h-5 text-gray-500 dark:text-gray-400" />,
    },
    {
      label: "Menunggu Persetujuan",
      value: pendingBookings.length,
      badge: pendingBookings.length > 0 ? "Perlu Tindakan" : "Semua Clear",
      badgeColor: pendingBookings.length > 0
        ? "text-amber-600 dark:text-amber-400"
        : "text-emerald-600 dark:text-emerald-400",
      barWidth: allBookings.length
        ? `${Math.round((pendingBookings.length / allBookings.length) * 100)}%`
        : "0%",
      icon: <IconClock className="w-5 h-5 text-gray-500 dark:text-gray-400" />,
    },
    {
      label: "Booking Ditolak",
      value: countDitolak,
      badge: countDitolak > 0 ? "Perlu Tindakan" : "Semua Clear",
      badgeColor: countDitolak > 0
        ? "text-red-600 dark:text-red-400"
        : "text-emerald-600 dark:text-emerald-400",
      barWidth: allBookings.length
        ? `${Math.round((countDitolak / allBookings.length) * 100)}%`
        : "0%",
      icon: <IconX className="w-5 h-5 text-gray-500 dark:text-gray-400" />,
    },
  ];

  // ── Recent activity ────────────────────────────────────────────────────────

  const recentActivity = [...allBookings]
    .sort(
      (a, b) =>
        new Date(b.tanggal_pinjam).getTime() - new Date(a.tanggal_pinjam).getTime()
    )
    .slice(0, 5);

  const activityDesc = (b: Booking): string => {
    if (b.status_booking === "menunggu")  return "mengajukan peminjaman kendaraan";
    if (b.status_booking === "disetujui") return "booking telah disetujui";
    return "booking ditolak";
  };

  // ──────────────────────────────────────────────────────────────────────────

  return (
    <LazyMotion features={domAnimation}>
      <main className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">

        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <motion.div
          {...fadeUp(0)}
          className="flex-shrink-0 flex items-center justify-between px-8 pt-6 pb-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Informasi status kendaraan dan peminjaman.
            </p>
          </div>
        </motion.div>

        {/* ── Scrollable body ───────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-8 pb-6 space-y-5">

          {/* ── Error ──────────────────────────────────────────────────────── */}
          {error && !loading && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
              {/* ✅ ErrorState onRetry juga pakai setRefreshTick */}
              <ErrorState message={error} onRetry={() => setRefreshTick((t) => t + 1)} />
            </div>
          )}

          {/* ── Stat Cards ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {loading
              ? [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
              : statCards.map((card, i) => (
                  <motion.div key={card.label} {...fadeUp(0.05 + i * 0.07)}>
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                          {card.icon}
                        </div>
                        <span className={`text-xs font-semibold ${card.badgeColor}`}>
                          {card.badge}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {card.label}
                      </p>
                      <p className="text-3xl font-bold text-[#002D72] dark:text-[#00AEEF]">
                        {card.value}
                      </p>
                      <div className="mt-3 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#002D72] dark:bg-[#00AEEF] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: card.barWidth }}
                          transition={{
                            duration: 0.6,
                            delay: 0.2 + i * 0.1,
                            ease: "easeOut" as const,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
          </div>

          {/* ── Status Overview + Recent Activity ────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

            {/* Donut */}
            <motion.div {...fadeUp(0.2)} className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm h-full">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
                  Status Overview
                </h2>
                {loading ? (
                  <div className="flex flex-col items-center gap-4 animate-pulse">
                    <div className="w-36 h-36 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="w-full space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <DonutChart
                    menunggu={countMenunggu}
                    disetujui={countDisetujui}
                    ditolak={countDitolak}
                  />
                )}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div {...fadeUp(0.25)} className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm h-full">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Aktivitas Terbaru
                </h2>

                {loading ? (
                  <SkeletonActivity />
                ) : recentActivity.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">
                    Belum ada aktivitas terbaru.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((booking) => (
                      <div key={booking.id} className="flex gap-3 items-start">
                        <ActivityAvatar type={booking.status_booking} />

                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {booking.nama}
                            </span>{" "}
                            {activityDesc(booking)}
                            {booking.vehicle && (
                              <>
                                {" — "}
                                <span className="font-semibold text-[#002D72] dark:text-[#00AEEF]">
                                  {booking.vehicle.nama_kendaraan}
                                </span>{" "}
                                <span className="text-gray-400 text-xs">
                                  ({booking.vehicle.nomor_polisi})
                                </span>
                              </>
                            )}
                          </p>
                          <div className="mt-1.5">
                            <StatusBadge status={booking.status_booking} />
                          </div>
                        </div>

                        <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5 flex-shrink-0">
                          {timeAgo(booking.tanggal_pinjam)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* ── Tabel Booking ──────────────────────────────────────────────── */}
          <motion.div {...fadeUp(0.3)}>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">

              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Daftar Booking
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total:{" "}
                  <span className="font-bold text-[#002D72] dark:text-[#00AEEF]">
                    {allBookings.length}
                  </span>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      <th className="text-left px-5 py-3">Peminjam</th>
                      <th className="text-left px-5 py-3">Unit Kerja</th>
                      <th className="text-left px-5 py-3">Kendaraan</th>
                      <th className="text-left px-5 py-3">Tgl Pinjam</th>
                      <th className="text-left px-5 py-3">Tgl Kembali</th>
                      <th className="text-left px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {loading ? (
                      [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
                    ) : allBookings.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-14 text-center text-sm text-gray-400"
                        >
                          Belum ada data booking.
                        </td>
                      </tr>
                    ) : (
                      allBookings.slice(0, 10).map((booking) => (
                        <tr
                          key={booking.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {booking.nama}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]">
                              {booking.keperluan}
                            </p>
                          </td>

                          <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300 text-xs">
                            {booking.unit_kerja}
                          </td>

                          <td className="px-5 py-3.5">
                            {booking.vehicle ? (
                              <>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {booking.vehicle.nama_kendaraan}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {booking.vehicle.nomor_polisi}
                                </p>
                              </>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>

                          <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300 text-xs whitespace-nowrap">
                            {formatDate(booking.tanggal_pinjam)}
                          </td>

                          <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300 text-xs whitespace-nowrap">
                            {formatDate(booking.tanggal_kembali)}
                          </td>

                          <td className="px-5 py-3.5">
                            <StatusBadge status={booking.status_booking} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {!loading && allBookings.length > 10 && (
                <div className="px-6 py-3.5 border-t border-gray-100 dark:border-gray-800 text-center">
                  <button className="text-sm font-medium text-[#002D72] dark:text-[#00AEEF] hover:underline">
                    Lihat Semua Booking ({allBookings.length})
                  </button>
                </div>
              )}
            </div>
          </motion.div>

        </div>{/* end scrollable body */}
      </main>
    </LazyMotion>
  );
}