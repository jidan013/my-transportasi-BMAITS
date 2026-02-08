"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  submitBooking,
  getAvailableVehicles,
} from "@/lib/services/booking-service";
import type { BookingPayload } from "@/types/booking";
import type { Vehicle } from "@/types/vehicle";

/* ================= DATA UNIT KERJA ITS ================= */

const UNIT_KERJA_ITS = {
  direktorat: [
    "Direktorat Pendidikan Sarjana dan Pascasarjana",
    "Direktorat Kemahasiswaan",
    "Direktorat Pengembangan Akademik dan Inovasi Pembelajaran",
    "Direktorat Perencanaan dan Pengembangan Strategis",
    "Direktorat Sumber Daya Manusia dan Organisasi",
    "Direktorat Teknologi dan Pengembangan Sistem Informasi",
    "Direktorat Riset dan Pengabdian kepada Masyarakat",
    "Direktorat Inovasi dan Science Techno Park",
    "Direktorat Kerja Sama dan Pengelolaan Usaha",
    "Direktorat Kemitraan Global",
    "Biro Manajemen Aset",
    "Biro Keuangan",
  ],
  fakultas: [
    "Fakultas Sains dan Analitika Data",
    "Fakultas Teknologi Industri dan Sistem Rekayasa",
    "Fakultas Teknik Sipil, Perencanaan, dan Kebumian",
    "Fakultas Teknologi Kelautan",
    "Fakultas Teknologi Elektro dan Informatika Cerdas",
    "Fakultas Desain Kreatif dan Bisnis Digital",
    "Fakultas Vokasi",
    "Fakultas Kedokteran dan Kesehatan",
  ],
};

/* ================= TYPES ================= */

interface BorrowFormData {
  nama: string;
  nrp: string;
  unit_kerja: string;
  vehicle_id: string;
  tanggal_peminjaman: string;
  tanggal_kembali: string;
  keperluan: string;
}

interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

/* ================= COMPONENT ================= */

export default function BorrowForm() {
  const [loading, setLoading] = useState(false);
  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [errors, setErrors] = useState<
    Partial<Record<keyof BorrowFormData, string>>
  >({});

  const [formData, setFormData] = useState<BorrowFormData>({
    nama: "",
    nrp: "",
    unit_kerja: "",
    vehicle_id: "",
    tanggal_peminjaman: "",
    tanggal_kembali: "",
    keperluan: "",
  });

  /* ================= HANDLERS ================= */

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;

      setFormData((prev) => ({ ...prev, [name]: value }));

      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof BorrowFormData];
        return next;
      });
    },
    []
  );

  /* ================= FETCH VEHICLES ================= */

  const fetchVehicles = useCallback(async () => {
    const { tanggal_peminjaman, tanggal_kembali } = formData;

    if (!tanggal_peminjaman || !tanggal_kembali) {
      setAvailableVehicles([]);
      return;
    }

    const start = new Date(tanggal_peminjaman);
    const end = new Date(tanggal_kembali);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today || end <= start) {
      setAvailableVehicles([]);
      setErrors((prev) => ({
        ...prev,
        vehicle_id:
          start < today
            ? "Tanggal pinjam harus hari ini atau setelahnya"
            : "Tanggal kembali harus setelah tanggal pinjam",
      }));
      return;
    }

    setLoadingAvailable(true);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.vehicle_id;
      return next;
    });

    try {
      const vehicles = await getAvailableVehicles({
        tanggal_peminjaman,
        tanggal_kembali,
      });

      setAvailableVehicles(vehicles ?? []);
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        setErrors((prev) => ({
          ...prev,
          vehicle_id:
            error.response?.status === 422
              ? "Tidak ada kendaraan tersedia pada tanggal tersebut"
              : error.response?.data?.message ??
                "Gagal memuat kendaraan tersedia",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          vehicle_id: "Terjadi kesalahan tidak terduga",
        }));
      }

      setAvailableVehicles([]);
    } finally {
      setLoadingAvailable(false);
    }
  }, [formData.tanggal_peminjaman, formData.tanggal_kembali]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  /* ================= SUBMIT ================= */

  const handleSubmit = useCallback(async () => {
    const newErrors: Partial<Record<keyof BorrowFormData, string>> = {};

    if (!formData.nama.trim()) newErrors.nama = "Nama wajib diisi";
    if (!formData.nrp.trim()) newErrors.nrp = "NRP wajib diisi";
    if (!/^\d+$/.test(formData.nrp))
      newErrors.nrp = "NRP harus berupa angka";
    if (!formData.unit_kerja)
      newErrors.unit_kerja = "Unit kerja wajib dipilih";
    if (!formData.vehicle_id) newErrors.vehicle_id = "Pilih kendaraan";
    if (!formData.tanggal_peminjaman)
      newErrors.tanggal_peminjaman = "Tanggal pinjam wajib";
    if (!formData.tanggal_kembali)
      newErrors.tanggal_kembali = "Tanggal kembali wajib";
    if (!formData.keperluan.trim())
      newErrors.keperluan = "Keperluan wajib diisi";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      const payload: BookingPayload = {
        nama: formData.nama.trim(),
        nrp: formData.nrp.trim(),
        unit_kerja: formData.unit_kerja,
        vehicle_id: Number(formData.vehicle_id),
        tanggal_peminjaman: formData.tanggal_peminjaman,
        tanggal_kembali: formData.tanggal_kembali,
        detail_keperluan: formData.keperluan.trim(),
      };

      await submitBooking(payload);
      alert("✅ Booking berhasil diajukan!");

      setFormData({
        nama: "",
        nrp: "",
        unit_kerja: "",
        vehicle_id: "",
        tanggal_peminjaman: "",
        tanggal_kembali: "",
        keperluan: "",
      });

      setAvailableVehicles([]);
      setErrors({});
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        alert(
          error.response?.data?.message ??
            "❌ Gagal mengajukan peminjaman"
        );
      } else {
        alert("❌ Terjadi kesalahan sistem");
      }
    } finally {
      setLoading(false);
    }
  }, [formData]);

  /* ================= UI ================= */

  return (
    <div className="max-w-4xl mx-auto p-6 border-2 border-gray-500 rounded-3xl bg-white shadow-2xl">
      {/* <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Peminjaman Kendaraan
      </h1> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold text-sm mb-2">Nama *</label>
          {errors.nama && <p className="text-red-500 text-xs">{errors.nama}</p>}
          <input
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl"
          />
        </div>

        <div>
          <label className="block font-semibold text-sm mb-2">NRP *</label>
          {errors.nrp && <p className="text-red-500 text-xs">{errors.nrp}</p>}
          <input
            name="nrp"
            value={formData.nrp}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold text-sm mb-2">
            Unit Kerja *
          </label>
          {errors.unit_kerja && (
            <p className="text-red-500 text-xs">{errors.unit_kerja}</p>
          )}
          <select
            name="unit_kerja"
            value={formData.unit_kerja}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl"
          >
            <option value="">Pilih Unit Kerja</option>
            <optgroup label="Direktorat">
              {UNIT_KERJA_ITS.direktorat.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </optgroup>
            <optgroup label="Fakultas">
              {UNIT_KERJA_ITS.fakultas.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-sm mb-2">
            Tanggal Pinjam *
          </label>
          <input
            type="date"
            name="tanggal_peminjaman"
            value={formData.tanggal_peminjaman}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl"
          />
        </div>

        <div>
          <label className="block font-semibold text-sm mb-2">
            Tanggal Kembali *
          </label>
          <input
            type="date"
            name="tanggal_kembali"
            value={formData.tanggal_kembali}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold text-sm mb-2">
            Kendaraan *
          </label>
          {errors.vehicle_id && (
            <p className="text-red-500 text-xs">{errors.vehicle_id}</p>
          )}
          <select
            name="vehicle_id"
            value={formData.vehicle_id}
            onChange={handleChange}
            disabled={loadingAvailable || loading}
            className="w-full px-4 py-3 border rounded-xl"
          >
            <option value="">
              {loadingAvailable
                ? "Memuat kendaraan..."
                : "Pilih kendaraan"}
            </option>
            {availableVehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nama_kendaraan} - {v.nomor_polisi}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold text-sm mb-2">
            Keperluan *
          </label>
          <textarea
            name="keperluan"
            value={formData.keperluan}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border rounded-xl"
          />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold"
        >
          {loading ? "Mengirim..." : "Ajukan Peminjaman"}
        </button>
      </div>
    </div>
  );
}
