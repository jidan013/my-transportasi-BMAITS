"use client";

import { useState, useCallback } from "react";
import { getVehicles } from "@/lib/services/vehicle";
import { getApprovedBookings } from "@/lib/services/booking-service";

export type VehicleStatus = "tersedia" | "dipinjam";

export interface Vehicle {
  id: number;
  nama_kendaraan: string;
  jenis_kendaraan: string;
  warna_kendaraan: string;
  nomor_polisi: string;
  bahan_bakar: string;
  kapasitas_penumpang: number;
  status_ketersediaan: VehicleStatus;
  created_at: string;
  updated_at: string;
}


export interface Booking {
  id: number;
  nama: string;
  nrp: number;
  unit_kerja: string;
  vehicle_id: number;
  tanggal_peminjam: string;
  tanggal_kembali: string;
  keperluan: string;
  status_pengajuan: "menunggu" | "disetujui" | "ditolak" | "dikembalikan";
  created_at: string;
  updated_at: string;
  vehicle?: Vehicle;
}

interface ApiError {
  message: string;
}

export default function TestAPIPage() {
  const [vehiclesData, setVehiclesData] = useState<Vehicle[] | null>(null);
  const [bookingsData, setBookingsData] = useState<Booking[] | null>(null);
  const [loadingVehicles, setLoadingVehicles] = useState<boolean>(false);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const testVehicles = useCallback(async (): Promise<void> => {
    setLoadingVehicles(true);
    setError(null);
    
    try {
      console.log("🚀 Testing GET /v1/vehicles...");
      const data: Vehicle[] = await getVehicles();
      
      console.log("✅ Vehicles Response:", data);
      console.table(data.map(v => ({
        ID: v.id,
        Nama: v.nama_kendaraan,
        Jenis: v.jenis_kendaraan,
        Status: v.status_ketersediaan,
        Polisi: v.nomor_polisi
      })));
      
      setVehiclesData(data);
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.message || 
                          (err as Error)?.message || 
                          "Gagal mengambil data kendaraan";
      console.error("❌ Error fetching vehicles:", err);
      setError(errorMessage);
    } finally {
      setLoadingVehicles(false);
    }
  }, []);

  const testBookings = useCallback(async (): Promise<void> => {
    setLoadingBookings(true);
    setError(null);
    
    try {
      console.log("🚀 Testing GET /v1/booking/approved...");
      const data: Booking[] = await getApprovedBookings();
      
      console.log("✅ Bookings Response:", data);
      console.table(data.map(b => ({
        ID: b.id,
        Nama: b.nama,
        NRP: b.nrp,
        Status: b.status_pengajuan,
        Vehicle: b.vehicle_id,
        Mulai: b.tanggal_peminjam.slice(0, 10)
      })));
      
      setBookingsData(data);
    } catch (err: unknown) {
      const errorMessage = (err as ApiError)?.message || 
                          (err as Error)?.message || 
                          "Gagal mengambil data booking";
      console.error("❌ Error fetching bookings:", err);
      setError(errorMessage);
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">🧪 Halaman Testing API</h1>

      {error && (
        <div className="mb-6 p-5 bg-red-50 border border-red-200 rounded-xl text-red-800">
          <div className="font-semibold mb-2 flex items-center gap-2">
            ❌ Terjadi Kesalahan
          </div>
          <div className="text-sm bg-red-100 p-3 rounded">{error}</div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Test Vehicles */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            🚗 Test Kendaraan
          </h2>
          <button
            onClick={testVehicles}
            disabled={loadingVehicles}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            aria-label="Test API Kendaraan"
          >
            {loadingVehicles ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Memuat kendaraan...
              </>
            ) : (
              "Test /v1/vehicles"
            )}
          </button>

          {vehiclesData && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <p className="font-semibold text-emerald-800">
                  ✅ Berhasil! Ditemukan <span className="font-mono">{vehiclesData.length}</span> kendaraan
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                {vehiclesData.slice(0, 6).map((vehicle) => (
                  <div key={vehicle.id} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="font-mono text-sm text-gray-900">{vehicle.nama_kendaraan}</div>
                    <div className="text-xs text-gray-600">
                      {vehicle.jenis_kendaraan} • {vehicle.nomor_polisi}
                    </div>
                    <div className={`text-xs font-medium mt-1 px-2 py-1 rounded-full w-fit ${
                      vehicle.status_ketersediaan === 'tersedia' 
                        ? 'bg-green-100 text-green-800' 
                        : vehicle.status_ketersediaan === 'dipinjam'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.status_ketersediaan ===  'tersedia' }
                       {vehicle.status_ketersediaan ===  'dipinjam' }
                    </div>
                  </div>
                ))}
                {vehiclesData.length > 6 && (
                  <div className="p-3 text-center text-gray-500 text-sm col-span-full">
                    +{vehiclesData.length - 6} kendaraan lainnya...
                  </div>
                )}
              </div>
              <pre className="text-xs overflow-auto max-h-48 bg-gray-900 text-green-400 rounded-md p-4 font-mono border-2 border-gray-800">
                {JSON.stringify(vehiclesData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Test Bookings */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            📋 Test Booking Approved
          </h2>
          <button
            onClick={testBookings}
            disabled={loadingBookings}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            aria-label="Test API Booking Approved"
          >
            {loadingBookings ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Memuat booking...
              </>
            ) : (
              "Test /v1/booking/approved"
            )}
          </button>

          {bookingsData && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <p className="font-semibold text-emerald-800">
                  ✅ Berhasil! Ditemukan <span className="font-mono">{bookingsData.length}</span> booking disetujui
                </p>
              </div>
              <div className="space-y-3 mb-4">
                {bookingsData.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="p-4 bg-gray-50 rounded-lg border flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <div className="font-semibold text-sm">{booking.nama}</div>
                      <div className="text-xs text-gray-600">NRP: {booking.nrp} • {booking.unit_kerja}</div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
                      <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-mono">
                        {new Date(booking.tanggal_peminjam).toLocaleDateString('id-ID')}
                      </div>
                      <span className="text-xs text-gray-500">→</span>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-mono">
                        {new Date(booking.tanggal_kembali).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </div>
                ))}
                {bookingsData.length > 5 && (
                  <div className="p-3 text-center text-gray-500 text-sm">
                    +{bookingsData.length - 5} booking lainnya...
                  </div>
                )}
              </div>
              <pre className="text-xs overflow-auto max-h-48 bg-gray-900 text-green-400 rounded-md p-4 font-mono border-2 border-gray-800">
                {JSON.stringify(bookingsData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Console Instructions */}
      <div className="p-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">📋</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Petunjuk Penggunaan</h3>
            <p className="text-amber-800">Ikuti langkah berikut untuk testing API:</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-amber-900">
          <div>
            <ol className="list-decimal list-inside space-y-2">
              <li>Buka browser console (F12)</li>
              <li>Klik tombol Test Kendaraan</li>
              <li>Lihat hasil di console + preview</li>
            </ol>
          </div>
          <div>
            <ol className="list-decimal list-inside space-y-2 start-4">
              <li>Klik tombol Test Booking Approved</li>
              <li>Lihat hasil di console + preview</li>
              <li>Periksa console.table untuk ringkasan</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
