"use client";

interface FormData {
  nama: string;
  nrp: string;
  vehicle_id: string;
  tanggal_peminjaman: string;
  tanggal_kembali: string;
  keperluan: string;
}

import type { Vehicle } from "@/types/vehicle";

interface Props {
  data: FormData;
  errors: Record<string, string>;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  formId: string;
  vehicles: Vehicle[];
  loading: boolean;
}

export default function Step2Details({ 
  data, 
  errors, 
  onChange, 
  formId, 
  vehicles, 
  loading 
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 space-y-4">
      {/* Kendaraan */}
      <div>
        <label htmlFor={`${formId}-vehicle`} className="block text-sm font-semibold mb-2 text-gray-700">
          Pilih Kendaraan <span className="text-red-500">*</span>
          {vehicles.length === 0 && !loading && <span className="text-orange-500 ml-1">(Cek tanggal dulu)</span>}
        </label>
        <select
          id={`${formId}-vehicle`}
          name="vehicle_id"
          value={data.vehicle_id}
          onChange={onChange}
          disabled={loading || vehicles.length === 0}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all input disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">-- Pilih Kendaraan Tersedia --</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id.toString()}>
              {vehicle.nama} ({vehicle.plate}) - {vehicle.jenis}
              {vehicle.status === "available" ? " ✅ Tersedia" : ` [${vehicle.status}]`}
            </option>
          ))}
        </select>
        {errors.vehicle_id && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <span>⚠️</span> {errors.vehicle_id}
          </p>
        )}
        {vehicles.length === 0 && !loading && (
          <p className="text-sm text-gray-500 mt-1">Tidak ada kendaraan tersedia untuk tanggal tersebut</p>
        )}
      </div>

      {/* Tanggal Pinjam */}
      <div>
        <label htmlFor={`${formId}-start`} className="block text-sm font-semibold mb-2 text-gray-700">
          Tanggal Pinjam <span className="text-red-500">*</span>
        </label>
        <input
          id={`${formId}-start`}
          type="date"
          name="tanggal_peminjaman"
          value={data.tanggal_peminjaman}
          onChange={onChange}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all input disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        />
        {errors.tanggal_peminjaman && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <span>⚠️</span> {errors.tanggal_peminjaman}
          </p>
        )}
      </div>

      {/* Tanggal Kembali */}
      <div>
        <label htmlFor={`${formId}-end`} className="block text-sm font-semibold mb-2 text-gray-700">
          Tanggal Kembali <span className="text-red-500">*</span>
        </label>
        <input
          id={`${formId}-end`}
          type="date"
          name="tanggal_kembali"
          value={data.tanggal_kembali}
          onChange={onChange}
          min={data.tanggal_peminjaman || new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all input disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        />
        {errors.tanggal_kembali && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <span>⚠️</span> {errors.tanggal_kembali}
          </p>
        )}
      </div>

      {/* Keperluan */}
      <div className="sm:col-span-2">
        <label htmlFor={`${formId}-purpose`} className="block text-sm font-semibold mb-2 text-gray-700">
          Keperluan Peminjaman <span className="text-red-500">*</span>
        </label>
        <textarea
          id={`${formId}-purpose`}
          name="keperluan"
          value={data.keperluan}
          onChange={onChange}
          rows={4}
          maxLength={500}
          placeholder="Jelaskan secara detail keperluan penggunaan kendaraan (min. 10 karakter)..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all input resize-vertical min-h-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        />
        {errors.keperluan && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <span>⚠️</span> {errors.keperluan}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {data.keperluan.trim().length}/500 karakter
        </p>
      </div>

      {/* Info kendaraan terpilih */}
      {data.vehicle_id && (
        <div className="sm:col-span-2 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm font-medium text-blue-800">
            Kendaraan terpilih akan otomatis dicek ketersediaannya berdasarkan tanggal
          </p>
        </div>
      )}
    </div>
  );
}
