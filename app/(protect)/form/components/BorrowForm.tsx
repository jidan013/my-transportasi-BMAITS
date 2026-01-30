"use client";

import { useState, useId } from "react";
import Step1Identity from "./Step1Identity";
import Step2Details from "./Step2Details";
import {
  submitBooking,
  getAvailableVehicles,
} from "@/lib/services/booking-service";
import type { BookingPayload } from "@/types/booking";
import type { Vehicle } from "@/types/vehicle";

interface BorrowFormData {
  nama: string;
  nrp: string;
  unit: string;
  vehicle_id: string;
  tanggal_peminjaman: string;
  tanggal_kembali: string;
  keperluan: string;
}

export default function BorrowForm() {
  const formId = useId();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<BorrowFormData>({
    nama: "",
    nrp: "",
    unit: "",
    vehicle_id: "",
    tanggal_peminjaman: "",
    tanggal_kembali: "",
    keperluan: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // 🔥 CONNECT TANGGAL → API
  const handleDatesChange = async ({
    start,
    end,
  }: {
    start: string;
    end: string;
  }) => {
    setFormData((p) => ({
      ...p,
      tanggal_peminjaman: start,
      tanggal_kembali: end,
      vehicle_id: "",
    }));

    setLoadingAvailable(true);
    try {
      const vehicles = await getAvailableVehicles({
        tanggal_peminjaman: start,
        tanggal_kembali: end,
      });
      setAvailableVehicles(vehicles ?? []);
    } catch {
      setAvailableVehicles([]);
    } finally {
      setLoadingAvailable(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload: BookingPayload = {
        nama: formData.nama,
        nrp: formData.nrp,
        unit_kerja: formData.unit,
        vehicle_id: Number(formData.vehicle_id),
        tanggal_peminjaman: formData.tanggal_peminjaman,
        tanggal_kembali: formData.tanggal_kembali,
        detail_keperluan: formData.keperluan,
      };

      await submitBooking(payload);
      alert("✅ Booking berhasil");
      setStep(1);
      setFormData({
        nama: "",
        nrp: "",
        unit: "",
        vehicle_id: "",
        tanggal_peminjaman: "",
        tanggal_kembali: "",
        keperluan: "",
      });
      setAvailableVehicles([]);
    } catch {
      alert("❌ Gagal submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 border-2 border-gray-500 rounded-3xl">
      {step === 1 ? (
        <Step1Identity
          data={formData}
          errors={errors}
          onChange={handleChange}
          formId={formId}
        />
      ) : (
        <Step2Details
          data={formData}
          errors={errors}
          onChange={handleChange}
          onDatesChange={handleDatesChange}
          formId={formId}
          availableVehicles={availableVehicles}
          loading={loading}
          loadingAvailable={loadingAvailable}
        />
      )}

      <div className="flex justify-end mt-6">
        <button
          onClick={() => (step === 1 ? setStep(2) : handleSubmit())}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl"
        >
          {step === 1 ? "Lanjut" : "Ajukan"}
        </button>
      </div>
    </div>
  );
}
