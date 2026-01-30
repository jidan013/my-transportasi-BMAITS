"use client";

import type { Vehicle, VehicleStatus } from "@/types/vehicle";

interface FormData {
  nama: string;
  nrp: string;
  vehicle_id: string;
  tanggal_peminjaman: string;
  tanggal_kembali: string;
  keperluan: string;
}

interface Props {
  data: FormData;
  errors: Record<string, string>;
  onChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >;
  onDatesChange: (dates: { start: string; end: string }) => void;
  formId: string;
  availableVehicles?: Vehicle[];  
  loading: boolean;
  loadingAvailable: boolean;
}

export default function Step2Details({
  data,
  errors,
  onChange,
  onDatesChange,
  availableVehicles = [],          // ✅ default []
  loading,
  loadingAvailable,
}: Props) {
  const renderStatus = (status: VehicleStatus): string => {
    switch (status) {
      case "tersedia":
        return "✅ Tersedia";
      case "dipinjam":
        return "🚗 Dipinjam";
      default:
        return status;
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const start = e.target.value;
    onChange(e);

    if (start) {
      onDatesChange({
        start,
        end: data.tanggal_kembali || start,
      });
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const end = e.target.value;
    onChange(e);

    if (data.tanggal_peminjaman && end) {
      onDatesChange({
        start: data.tanggal_peminjaman,
        end,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Kendaraan */}
      <div>
        <label className="block font-semibold mb-2">
          Kendaraan <span className="text-red-500">*</span>
        </label>

        <select
          name="vehicle_id"
          value={data.vehicle_id}
          onChange={onChange}
          disabled={loading || loadingAvailable || availableVehicles.length === 0}
          className="w-full px-4 py-3 border rounded-xl"
        >
          <option value="">
            {loadingAvailable
              ? "Memuat kendaraan..."
              : availableVehicles.length === 0
              ? "Tidak ada kendaraan tersedia"
              : "Pilih kendaraan"}
          </option>

          {availableVehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.nama_kendaraan} ({v.nomor_polisi}) –{" "}
              {renderStatus(v.status_ketersediaan)}
            </option>
          ))}
        </select>

        {errors.vehicle_id && (
          <p className="text-red-500 text-sm mt-1">{errors.vehicle_id}</p>
        )}
      </div>

      {/* Tanggal Pinjam */}
      <div>
        <label className="block font-semibold mb-2">Tanggal Pinjam *</label>
        <input
          type="date"
          name="tanggal_peminjaman"
          value={data.tanggal_peminjaman}
          onChange={handleStartDateChange}
          className="w-full px-4 py-3 border rounded-xl"
        />
        {errors.tanggal_peminjaman && (
          <p className="text-red-500 text-sm mt-1">
            {errors.tanggal_peminjaman}
          </p>
        )}
      </div>

      {/* Tanggal Kembali */}
      <div>
        <label className="block font-semibold mb-2">Tanggal Kembali *</label>
        <input
          type="date"
          name="tanggal_kembali"
          value={data.tanggal_kembali}
          onChange={handleEndDateChange}
          min={data.tanggal_peminjaman}
          className="w-full px-4 py-3 border rounded-xl"
        />
        {errors.tanggal_kembali && (
          <p className="text-red-500 text-sm mt-1">
            {errors.tanggal_kembali}
          </p>
        )}
      </div>

      {/* Keperluan */}
      <div className="sm:col-span-2">
        <label className="block font-semibold mb-2">Keperluan *</label>
        <textarea
          name="keperluan"
          value={data.keperluan}
          onChange={onChange}
          rows={4}
          className="w-full px-4 py-3 border rounded-xl"
        />
        {errors.keperluan && (
          <p className="text-red-500 text-sm mt-1">{errors.keperluan}</p>
        )}
      </div>
    </div>
  );
}
