"use client"

import CalendarPage from "./components/CalendarPage"

export default function JadwalPage() {
  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">
        📅 Jadwal & Booking Kendaraan
      </h1>

      <CalendarPage />
    </div>
  )
}
