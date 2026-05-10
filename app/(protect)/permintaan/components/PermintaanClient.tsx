"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Car,
  RefreshCw,
  MapPin,
  Users,
  CalendarDays,
  AlertCircle,
  ChevronDown,
  FileText,
  ShieldCheck,
} from "lucide-react";
import {
  getAllBookings,
  approveBooking,
  rejectBooking,
} from "@/lib/services/booking-service";
import type { Booking } from "@/types/booking";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Booking["status_booking"] }) {
  if (status === "disetujui")
    return (
      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-full text-[11px] font-semibold">
        <CheckCircle className="w-3 h-3" /> Disetujui
      </span>
    );
  if (status === "ditolak")
    return (
      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2.5 py-1 rounded-full text-[11px] font-semibold">
        <XCircle className="w-3 h-3" /> Ditolak
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-1 rounded-full text-[11px] font-semibold">
      <Clock className="w-3 h-3" /> Menunggu
    </span>
  );
}

// ─── Request Card ─────────────────────────────────────────────────────────────

interface RequestCardProps {
  booking: Booking;
  selected: boolean;
  actionLoading: number | null;
  onSelect: (b: Booking) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

function RequestCard({
  booking,
  selected,
  actionLoading,
  onSelect,
  onApprove,
  onReject,
}: RequestCardProps) {
  const isPending = booking.status_booking === "menunggu";
  const isLoading = actionLoading === booking.id;

  return (
    <div
      onClick={() => isPending && onSelect(booking)}
      className={`rounded-2xl border p-4 transition-all duration-200 ${
        isPending ? "cursor-pointer" : ""
      } ${
        selected
          ? "border-[#002D72] bg-[#002D72]/5 dark:border-[#00AEEF] dark:bg-[#00AEEF]/5 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm"
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white text-sm">
            {booking.nama}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {booking.unit_kerja}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={booking.status_booking} />
          <span className="text-[11px] text-gray-400">
            {formatDateTime(booking.tanggal_pinjam)}
          </span>
        </div>
      </div>

      {/* Info row */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="truncate">{booking.keperluan}</span>
        </div>
        {booking.vehicle && (
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <Car className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>
              {booking.vehicle.nama_kendaraan}{" "}
              <span className="text-gray-400">
                · {booking.vehicle.nomor_polisi}
              </span>
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
          <CalendarDays className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span>
            {formatDate(booking.tanggal_pinjam)} →{" "}
            {formatDate(booking.tanggal_kembali)}
          </span>
        </div>
      </div>

      {/* Action buttons — only for pending */}
      {isPending && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApprove(booking.id);
            }}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#002D72] dark:bg-[#00AEEF] text-white text-xs font-semibold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle className="w-3.5 h-3.5" />
            )}
            Setujui
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReject(booking.id);
            }}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            <XCircle className="w-3.5 h-3.5" />
            Tolak
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Finalize Panel ───────────────────────────────────────────────────────────

interface FinalizePanelProps {
  booking: Booking;
  actionLoading: number | null;
  onConfirm: (id: number) => void;
  onCancel: () => void;
}

function FinalizePanel({
  booking,
  actionLoading,
  onConfirm,
  onCancel,
}: FinalizePanelProps) {
  const isLoading = actionLoading === booking.id;

  return (
    <div className="bg-[#002D72] dark:bg-gray-900 rounded-2xl p-6 text-white h-full flex flex-col gap-5 shadow-xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-amber-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-bold text-lg leading-tight">Finalize Approval</p>
          <p className="text-sm text-blue-200 dark:text-gray-400 mt-0.5">
            Assigning assets for {booking.nama}
          </p>
        </div>
      </div>

      {/* Booking detail */}
      <div className="bg-white/10 dark:bg-white/5 rounded-xl p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-sm text-blue-100 dark:text-gray-300">
          <Users className="w-4 h-4 opacity-70 shrink-0" />
          <span>
            <span className="font-medium text-white">{booking.nama}</span>{" "}
            <span className="opacity-60 text-xs">({booking.nrp})</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-100 dark:text-gray-300">
          <MapPin className="w-4 h-4 opacity-70 shrink-0" />
          <span className="truncate">{booking.keperluan}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-100 dark:text-gray-300">
          <CalendarDays className="w-4 h-4 opacity-70 shrink-0" />
          <span>
            {formatDate(booking.tanggal_pinjam)} →{" "}
            {formatDate(booking.tanggal_kembali)}
          </span>
        </div>
      </div>

      {/* Vehicle info */}
      {booking.vehicle && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-300 dark:text-gray-500 mb-2">
            Kendaraan Ditugaskan
          </p>
          <div className="flex items-center gap-3 bg-white/10 dark:bg-white/5 rounded-xl px-4 py-3">
            <Car className="w-4 h-4 text-blue-200 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">
                {booking.vehicle.nama_kendaraan}
              </p>
              <p className="text-xs text-blue-200 dark:text-gray-400">
                {booking.vehicle.nomor_polisi}
              </p>
            </div>
            <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
              Tersedia
            </span>
          </div>
        </div>
      )}

      {/* Confirm buttons */}
      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={() => onConfirm(booking.id)}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold text-sm transition-all disabled:opacity-60"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          Confirm Assignment
        </button>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="w-full py-2.5 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 text-sm font-medium transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Reject Modal ─────────────────────────────────────────────────────────────

interface RejectModalProps {
  id: number;
  loading: boolean;
  error: string | null;
  onConfirm: (alasan: string) => void;
  onClose: () => void;
}

function RejectModal({ id, loading, error, onConfirm, onClose }: RejectModalProps) {
  const [alasan, setAlasan] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-4 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Tolak Permintaan
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Peminjaman #{id}
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
            Alasan Penolakan <span className="text-red-500">*</span>
          </label>
          <textarea
            value={alasan}
            onChange={(e) => setAlasan(e.target.value)}
            placeholder="Contoh: Kendaraan sedang dalam perawatan..."
            rows={4}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-700 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>

        <div className="flex gap-3 justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(alasan)}
            disabled={loading || !alasan.trim()}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 transition-all"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            Konfirmasi Tolak
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PermintaanClient() {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });
  const [rejectError, setRejectError] = useState<string | null>(null);

  // FIXED: fetchData moved inside useEffect to avoid ESLint warning
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getAllBookings();
        setData(result);
      } catch {
        setError("Gagal memuat data permintaan.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Create refresh function for manual refresh
  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllBookings();
      setData(result);
    } catch {
      setError("Gagal memuat data permintaan.");
    } finally {
      setLoading(false);
    }
  };

  const pendingBookings = data.filter((b) => b.status_booking === "menunggu");
  const processedBookings = data.filter((b) => b.status_booking !== "menunggu");

  const handleApprove = async (id: number) => {
    try {
      setActionLoading(id);
      setSuccessMsg(null);
      setError(null);

      // ambil data terbaru dulu (anti mismatch status)
      const freshData = await getAllBookings();
      const current = freshData.find((b) => b.id === id);

      if (!current) {
        throw new Error("Data booking tidak ditemukan");
      }

      if (current.status_booking !== "menunggu") {
        throw new Error("Status sudah berubah, silakan refresh data");
      }

      // lanjut approve
      const result = await approveBooking(id);

      if (result.downloadUrl) {
        setDownloadUrl(result.downloadUrl);
      }

      setSuccessMsg(`Peminjaman #${id} berhasil disetujui!`);
      setSelectedBooking(null);

      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyetujui peminjaman");
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (id: number) => {
    setRejectModal({ open: true, id });
    setRejectError(null);
    setSuccessMsg(null);
  };

  const handleReject = async (alasan: string) => {
    if (!rejectModal.id) return;
    if (!alasan.trim()) {
      setRejectError("Alasan penolakan wajib diisi.");
      return;
    }
    try {
      setActionLoading(rejectModal.id);
      setRejectError(null);
      await rejectBooking(rejectModal.id);
      setSuccessMsg(`Peminjaman #${rejectModal.id} berhasil ditolak.`);
      setRejectModal({ open: false, id: null });
      setSelectedBooking(null);
      await refreshData();
    } catch (err) {
      setRejectError(err instanceof Error ? err.message : "Gagal menolak peminjaman");
    } finally {
      setActionLoading(null);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-8 py-7 space-y-6">

      {/* ── Reject Modal ──────────────────────────────────────────────────── */}
      {rejectModal.open && rejectModal.id && (
        <RejectModal
          id={rejectModal.id}
          loading={actionLoading !== null}
          error={rejectError}
          onConfirm={handleReject}
          onClose={() => { setRejectModal({ open: false, id: null }); setRejectError(null); }}
        />
      )}

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Fleet Operations & Approvals
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Real-time oversight of vehicle requests and active movements.
          </p>
        </div>
        <button
          onClick={refreshData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── Alerts ────────────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-400 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold ml-4">✕</button>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-700 dark:text-emerald-400 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            {successMsg}
          </div>
          <div className="flex items-center gap-3 ml-4">
            {downloadUrl && (
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 underline font-medium text-emerald-800 dark:text-emerald-300">
                <FileText className="w-3.5 h-3.5" /> Download Surat PDF
              </a>
            )}
            <button onClick={() => { setSuccessMsg(null); setDownloadUrl(null); }}
              className="text-emerald-400 hover:text-emerald-600 font-bold">✕</button>
          </div>
        </div>
      )}

      {/* ── Main Two-Column Layout ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* ── Left: Pending Requests ─────────────────────────────────────── */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Pending Requests
              </h2>
            </div>
            {pendingBookings.length > 0 && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#002D72] dark:bg-[#00AEEF] text-white">
                {pendingBookings.length} NEW
              </span>
            )}
          </div>

          {/* Cards */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[560px]">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse space-y-3">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <div className="h-3.5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                    <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  </div>
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="flex gap-2 pt-1">
                    <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                    <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                  </div>
                </div>
              ))
            ) : pendingBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <CheckCircle className="w-10 h-10 text-emerald-400 mb-3" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Semua Sudah Diproses</p>
                <p className="text-xs text-gray-400 mt-1">Tidak ada permintaan yang menunggu.</p>
              </div>
            ) : (
              pendingBookings.map((b) => (
                <RequestCard
                  key={b.id}
                  booking={b}
                  selected={selectedBooking?.id === b.id}
                  actionLoading={actionLoading}
                  onSelect={setSelectedBooking}
                  onApprove={handleApprove}
                  onReject={openRejectModal}
                />
              ))
            )}
          </div>

          {/* View All link */}
          {!loading && data.length > pendingBookings.length && (
            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 text-center">
              <button className="text-xs font-medium text-[#002D72] dark:text-[#00AEEF] hover:underline">
                VIEW ALL REQUESTS
              </button>
            </div>
          )}
        </div>

        {/* ── Right: Finalize Panel or Processed Table ───────────────────── */}
        <div className="lg:col-span-3 flex flex-col gap-5">

          {/* Finalize Panel — shows when a pending card is selected */}
          {selectedBooking ? (
            <FinalizePanel
              booking={selectedBooking}
              actionLoading={actionLoading}
              onConfirm={handleApprove}
              onCancel={() => setSelectedBooking(null)}
            />
          ) : (
            <div className="bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Pilih permintaan untuk mereview detail
              </p>
              <p className="text-xs text-gray-400">
                Klik pada kartu permintaan di sebelah kiri untuk memulai proses persetujuan.
              </p>
            </div>
          )}

          {/* Processed bookings table */}
          {processedBookings.length > 0 && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Riwayat Pemrosesan
                </h3>
                <span className="text-xs text-gray-400">
                  {processedBookings.length} entri
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      <th className="text-left px-5 py-3">Peminjam</th>
                      <th className="text-left px-5 py-3">Kendaraan</th>
                      <th className="text-left px-5 py-3">Tgl Pinjam</th>
                      <th className="text-left px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {processedBookings.slice(0, 8).map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-900 dark:text-white text-xs">{b.nama}</p>
                          <p className="text-[11px] text-gray-400">{b.unit_kerja}</p>
                        </td>
                        <td className="px-5 py-3 text-xs text-gray-600 dark:text-gray-300">
                          {b.vehicle ? (
                            <>
                              <p>{b.vehicle.nama_kendaraan}</p>
                              <p className="text-[11px] text-gray-400">{b.vehicle.nomor_polisi}</p>
                            </>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {formatDate(b.tanggal_pinjam)}
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={b.status_booking} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}