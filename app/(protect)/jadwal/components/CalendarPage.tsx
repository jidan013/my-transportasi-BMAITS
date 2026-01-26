"use client"

import type { Vehicle, VehicleStatus } from "@/types/vehicle"

interface FormData {
  nama: string
  nrp: string
  vehicle_id: string
  tanggal_peminjaman: string
  tanggal_kembali: string
  keperluan: string
}

interface Props {
  data: FormData
  errors: Record<string, string>
  onChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >
  onDatesChange: (dates: { start: string; end: string }) => void
  formId: string
  availableVehicles: Vehicle[]
  loading: boolean
  loadingAvailable: boolean
}

export default function Step2Details({
  data,
  errors,
  onChange,
  onDatesChange,
  formId,
  availableVehicles,
  loading,
  loadingAvailable,
}: Props) {
  const renderStatus = (status: VehicleStatus): string => {
    switch (status) {
      case "tersedia":
        return "✅ Tersedia"
      case "dipinjam":
        return "🚗 Dipinjam"
      default:
        return status
    }
  }

  // Handler khusus tanggal pinjam - trigger API
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = e.target.value
    onChange(e)
    
    // Trigger getAvailableVehicles hanya jika tanggal pinjam diisi
    if (startDate) {
      onDatesChange({ 
        start: startDate, 
        end: data.tanggal_kembali || startDate // default hari yang sama
      })
    }
  }

  // Handler tanggal kembali - tidak trigger API
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Kendaraan */}
      <div>
        <label
          htmlFor={`${formId}-vehicle`}
          className="block text-sm font-semibold mb-2 text-gray-700"
        >
          Pilih Kendaraan <span className="text-red-500">*</span>
        </label>

        <select
          id={`${formId}-vehicle`}
          name="vehicle_id"
          value={data.vehicle_id}
          onChange={onChange}
          disabled={loading || loadingAvailable || availableVehicles.length === 0}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">
            {loadingAvailable 
              ? "-- Memuat kendaraan tersedia..." 
              : availableVehicles.length === 0 && !loadingAvailable
              ? "-- Tidak ada kendaraan tersedia --"
              : "-- Pilih Kendaraan Tersedia --"
            }
          </option>

          {availableVehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id.toString()}>
              {vehicle.nama_kendaraan} ({vehicle.nomor_polisi}) –{" "}
              {vehicle.jenis_kendaraan} |{" "}
              {renderStatus(vehicle.status_ketersediaan)}
            </option>
          ))}
        </select>

        {errors.vehicle_id && (
          <p className="text-red-500 text-sm mt-1">⚠️ {errors.vehicle_id}</p>
        )}

        {availableVehicles.length === 0 && !loadingAvailable && !loading && (
          <p className="text-sm text-gray-500 mt-1">
            Tidak ada kendaraan tersedia untuk tanggal tersebut
          </p>
        )}
      </div>

      {/* Tanggal Pinjam */}
      <div>
        <label
          htmlFor={`${formId}-start`}
          className="block text-sm font-semibold mb-2 text-gray-700"
        >
          Tanggal Pinjam <span className="text-red-500">*</span>
        </label>

        <input
          id={`${formId}-start`}
          type="date"
          name="tanggal_peminjaman"
          value={data.tanggal_peminjaman}
          onChange={handleStartDateChange}
          min={new Date().toISOString().split("T")[0]}
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {errors.tanggal_peminjaman && (
          <p className="text-red-500 text-sm mt-1">⚠️ {errors.tanggal_peminjaman}</p>
        )}
      </div>

      {/* Tanggal Kembali */}
      <div>
        <label
          htmlFor={`${formId}-end`}
          className="block text-sm font-semibold mb-2 text-gray-700"
        >
          Tanggal Kembali <span className="text-red-500">*</span>
        </label>

        <input
          id={`${formId}-end`}
          type="date"
          name="tanggal_kembali"
          value={data.tanggal_kembali}
          onChange={handleEndDateChange}
          min={data.tanggal_peminjaman || new Date().toISOString().split("T")[0]}
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {errors.tanggal_kembali && (
          <p className="text-red-500 text-sm mt-1">⚠️ {errors.tanggal_kembali}</p>
        )}
      </div>

      {/* Nama */}
      <div>
        <label
          htmlFor={`${formId}-nama`}
          className="block text-sm font-semibold mb-2 text-gray-700"
        >
          Nama <span className="text-red-500">*</span>
        </label>

        <input
          id={`${formId}-nama`}
          type="text"
          name="nama"
          value={data.nama}
          onChange={onChange}
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {errors.nama && (
          <p className="text-red-500 text-sm mt-1">⚠️ {errors.nama}</p>
        )}
      </div>

      {/* NRP */}
      <div>
        <label
          htmlFor={`${formId}-nrp`}
          className="block text-sm font-semibold mb-2 text-gray-700"
        >
          NRP <span className="text-red-500">*</span>
        </label>

        <input
          id={`${formId}-nrp`}
          type="text"
          name="nrp"
          value={data.nrp}
          onChange={onChange}
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {errors.nrp && (
          <p className="text-red-500 text-sm mt-1">⚠️ {errors.nrp}</p>
        )}
      </div>

      {/* Keperluan */}
      <div className="sm:col-span-2">
        <label
          htmlFor={`${formId}-purpose`}
          className="block text-sm font-semibold mb-2 text-gray-700"
        >
          Keperluan Peminjaman <span className="text-red-500">*</span>
        </label>

        <textarea
          id={`${formId}-purpose`}
          name="keperluan"
          value={data.keperluan}
          onChange={onChange}
          rows={4}
          maxLength={500}
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition-all resize-vertical min-h-25
                     disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <p className="text-xs text-gray-500 mt-1">
          {data.keperluan.trim().length}/500 karakter
        </p>

        {errors.keperluan && (
          <p className="text-red-500 text-sm mt-1">⚠️ {errors.keperluan}</p>
        )}
      </div>
    </div>
  )
}
