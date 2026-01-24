"use client";

import { useState } from "react";
import { getVehicles } from "@/lib/services/vehicle";
import { getApprovedBookings } from "@/lib/services/booking-service";

export default function TestAPIPage() {
  const [vehiclesData, setVehiclesData] = useState<any>(null);
  const [bookingsData, setBookingsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🚀 Testing GET /v1/vehicles...");
      const data = await getVehicles();
      
      console.log("✅ Vehicles Response:", data);
      setVehiclesData(data);
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const testBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🚀 Testing GET /v1/booking/approved...");
      const data = await getApprovedBookings();
      
      console.log("✅ Bookings Response:", data);
      setBookingsData(data);
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">API Testing Page</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          ❌ Error: {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Test Vehicles */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">1. Test GET Vehicles</h2>
          <button
            onClick={testVehicles}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Test /v1/vehicles"}
          </button>

          {vehiclesData && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <p className="font-mono text-sm">
                ✅ Success! Found {vehiclesData.length} vehicles
              </p>
              <pre className="mt-2 text-xs overflow-auto max-h-40">
                {JSON.stringify(vehiclesData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Test Bookings */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">2. Test GET Approved Bookings</h2>
          <button
            onClick={testBookings}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Test /v1/booking/approved"}
          </button>

          {bookingsData && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <p className="font-mono text-sm">
                ✅ Success! Found {bookingsData.length} approved bookings
              </p>
              <pre className="mt-2 text-xs overflow-auto max-h-40">
                {JSON.stringify(bookingsData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Console Instructions */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="font-bold">📋 Instructions:</p>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Open browser console (F12)</li>
          <li>Click "Test /v1/vehicles" button</li>
          <li>Check console for response</li>
          <li>Click "Test /v1/booking/approved" button</li>
          <li>Check console for response</li>
        </ol>
      </div>
    </div>
  );
}
