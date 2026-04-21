"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Car, RefreshCw } from "lucide-react";
import {
  getAllBookings,
  approveBooking,
  rejectBooking,
} from "@/lib/services/booking-service";
import type { Booking } from "@/types/booking";

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function PermintaanClient() {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });
  const [alasan, setAlasan] = useState("");

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      setActionLoading(id);
      setSuccessMsg(null);
      setError(null);
      const result = await approveBooking(id);
      if (result.downloadUrl) {
        setDownloadUrl(result.downloadUrl);
      }
      setSuccessMsg(`Peminjaman #${id} berhasil disetujui!`);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyetujui peminjaman");
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (id: number) => {
    setRejectModal({ open: true, id });
    setAlasan("");
    setError(null);
    setSuccessMsg(null);
  };

  const handleReject = async () => {
    if (!rejectModal.id) return;
    if (!alasan.trim()) {
      setError("Alasan penolakan wajib diisi.");
      return;
    }

    try {
      setActionLoading(rejectModal.id);
      setError(null);
      await rejectBooking(rejectModal.id);
      setSuccessMsg(`Peminjaman #${rejectModal.id} berhasil ditolak.`);
      setRejectModal({ open: false, id: null });
      setAlasan("");
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menolak peminjaman");
    } finally {
      setActionLoading(null);
    }
  };

  const statusBadge = (status: Booking["status_booking"]) => {
    switch (status) {
      case "disetujui":
        return (
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs flex items-center gap-1 w-fit mx-auto">
            <CheckCircle className="w-3 h-3" /> Disetujui
          </span>
        );
      case "ditolak":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs flex items-center gap-1 w-fit mx-auto">
            <XCircle className="w-3 h-3" /> Ditolak
          </span>
        );
      default:
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs flex items-center gap-1 w-fit mx-auto">
            <Clock className="w-3 h-3" /> Menunggu
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* ===== Modal Tolak ===== */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold">Alasan Penolakan</h2>
            <p className="text-sm text-gray-500">
              Masukkan alasan penolakan untuk peminjaman #{rejectModal.id}
            </p>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <textarea
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder="Contoh: Kendaraan sedang dalam perawatan..."
              rows={4}
              className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-400 resize-none"
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setRejectModal({ open: false, id: null });
                  setError(null);
                }}
                className="px-4 py-2 rounded-xl border text-sm hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading !== null}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading !== null ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Header ===== */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Permintaan Peminjaman Kendaraan</h1>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-800 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ===== Alert Error ===== */}
      {error && !rejectModal.open && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* ===== Alert Sukses ===== */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <div className="flex items-center gap-3">
            {downloadUrl && (

              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium text-emerald-800"
              >
                Download Surat PDF
              </a>
            )}
            <button
              onClick={() => { setSuccessMsg(null); setDownloadUrl(null); }}
              className="text-emerald-400 hover:text-emerald-600 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ===== Tabel ===== */}
      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Unit Kerja</th>
              <th className="p-3 text-left">Kendaraan</th>
              <th className="p-3 text-left">Tanggal Pinjam</th>
              <th className="p-3 text-left">Tanggal Kembali</th>
              <th className="p-3 text-left">Keperluan</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center p-8 text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Memuat data...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-8 text-gray-500">
                  Tidak ada data peminjaman
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{item.nama}</td>
                  <td className="p-3">{item.unit_kerja}</td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>
                        {item.vehicle?.nama_kendaraan ?? "-"}{" "}
                        <span className="text-gray-400">
                          ({item.vehicle?.nomor_polisi ?? "-"})
                        </span>
                      </span>
                    </div>
                  </td>

                  <td className="p-3">{formatDate(item.tanggal_pinjam)}</td>
                  <td className="p-3">{formatDate(item.tanggal_kembali)}</td>

                  <td className="p-3 max-w-[160px] truncate" title={item.keperluan}>
                    {item.keperluan}
                  </td>

                  <td className="p-3 text-center">
                    {statusBadge(item.status_booking)}
                  </td>

                  <td className="p-3 text-center">
                    {item.status_booking === "menunggu" ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleApprove(item.id)}
                          disabled={actionLoading === item.id}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                        >
                          {actionLoading === item.id ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          Setujui
                        </button>

                        <button
                          onClick={() => openRejectModal(item.id)}
                          disabled={actionLoading === item.id}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                        >
                          <XCircle className="w-3 h-3" />
                          Tolak
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        Sudah diproses
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}