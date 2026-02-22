"use client";

import { useState, useEffect, useCallback } from "react";
import { isAxiosError } from "axios";

import type { BookingPayload } from "@/types/booking";
import type { Vehicle } from "@/types/vehicle";

import {
  submitBooking,
  getAvailableVehicles,
} from "@/lib/services/booking-service";

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
  nrp: number;
  unit_kerja: string;
  vehicle_id: string;
  tanggal_pinjam: string;
  tanggal_kembali: string;
  keperluan: string;
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
    nrp: 0,
    unit_kerja: "",
    vehicle_id: "",
    tanggal_pinjam: "",
    tanggal_kembali: "",
    keperluan: "",
  });

  /* ================= HANDLER ================= */

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: name === "nrp" ? Number(value) || 0 : value,
      }));

      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof BorrowFormData];
        return next;
      });
    },
    []
  );

  /* ================= FETCH AVAILABLE VEHICLES ================= */

  const fetchVehicles = useCallback(async () => {
    const { tanggal_pinjam, tanggal_kembali } = formData;

    if (!tanggal_pinjam || !tanggal_kembali) {
      setAvailableVehicles([]);
      return;
    }

    setLoadingAvailable(true);

    try {
      const vehicles = await getAvailableVehicles({
        tanggal_pinjam,
        tanggal_kembali,
      });

      setAvailableVehicles(vehicles);
    } catch {
      setAvailableVehicles([]);
      setErrors((prev) => ({
        ...prev,
        vehicle_id: "Gagal memuat kendaraan tersedia",
      }));
    } finally {
      setLoadingAvailable(false);
    }
  }, [formData.tanggal_pinjam, formData.tanggal_kembali]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  /* ================= SUBMIT ================= */

  const handleSubmit = useCallback(async () => {
    const newErrors: Partial<Record<keyof BorrowFormData, string>> = {};

    if (!formData.nama.trim()) newErrors.nama = "Nama wajib diisi";
    if (!formData.nrp) newErrors.nrp = "NRP wajib berupa angka";
    if (!formData.unit_kerja) newErrors.unit_kerja = "Unit kerja wajib dipilih";
    if (!formData.vehicle_id) newErrors.vehicle_id = "Pilih kendaraan";
    if (!formData.tanggal_pinjam)
      newErrors.tanggal_pinjam = "Tanggal pinjam wajib";
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
        nrp: formData.nrp,
        unit_kerja: formData.unit_kerja,
        vehicle_id: Number(formData.vehicle_id),
        tanggal_pinjam: formData.tanggal_pinjam,
        tanggal_kembali: formData.tanggal_kembali,
        keperluan: formData.keperluan.trim(),
      };

      await submitBooking(payload);

      alert("✅ Booking berhasil diajukan!");

      setFormData({
        nama: "",
        nrp: 0,
        unit_kerja: "",
        vehicle_id: "",
        tanggal_pinjam: "",
        tanggal_kembali: "",
        keperluan: "",
      });

      setAvailableVehicles([]);
      setErrors({});
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.status === 409) {
        alert(err.response.data.message);
      } else {
        alert("❌ Gagal mengajukan peminjaman");
      }
    } finally {
      setLoading(false);
    }
  }, [formData]);

  /* ================= UI (TIDAK DIUBAH) ================= */

  return (
    <div className="max-w-4xl mx-auto p-6 border-2 border-gray-300 rounded-3xl bg-white shadow-2xl">
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
          <label className="block font-semibold text-sm mb-2">NRP / NIP*</label>
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
            Unit / Departemen *
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
            <option value="">Pilih Unit / Departemen</option>
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
            name="tanggal_pinjam"
            value={formData.tanggal_pinjam}
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
            Jenis Kendaraan *
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
                : "Pilih jenis kendaraan"}
            </option>
            {availableVehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nama_kendaraan} - {v.no_plat}
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