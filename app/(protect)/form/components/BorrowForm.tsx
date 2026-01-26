"use client";

import { useState, useId, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconSend, IconCircleCheckFilled } from "@tabler/icons-react";
import ProgressBar from "./ProgressBar";
import Step1Identity from "./Step1Identity";
import Step2Details from "./Step2Details";
import { submitBooking, getAvailableVehicles } from "@/lib/services/booking-service";
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

interface Step1Props {
  data: BorrowFormData;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formId: string;
}

interface Step2Props {
  data: BorrowFormData;
  errors: Record<string, string>;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  formId: string;
  vehicles: Vehicle[];
  loading: boolean;
}

export default function BorrowForm() {
  const formId = useId();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);

  const [formData, setFormData] = useState<BorrowFormData>({
    nama: "",
    nrp: "",
    unit: "",          
    vehicle_id: "",
    tanggal_peminjaman: "",
    tanggal_kembali: "",
    keperluan: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const checkAvailableVehicles = useCallback(async () => {
    if (formData.tanggal_peminjaman && formData.tanggal_kembali && step === 2) {
      try {
        const vehicles = await getAvailableVehicles({
          tanggal_peminjaman: formData.tanggal_peminjaman,
          tanggal_kembali: formData.tanggal_kembali,
        });
        setAvailableVehicles(vehicles || []);
        
        if (vehicles?.length > 0) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.vehicle_id;
            return newErrors;
          });
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setAvailableVehicles([]);
        setErrors(prev => ({ 
          ...prev, 
          vehicle_id: "Tidak ada kendaraan tersedia untuk tanggal tersebut" 
        }));
      }
    }
  }, [formData.tanggal_peminjaman, formData.tanggal_kembali, step]);

  useEffect(() => {
    if (step === 2) {
      const timeoutId = setTimeout(checkAvailableVehicles, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [checkAvailableVehicles, step]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name in errors) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  
  const validateStep1 = (): boolean => {
    const err: Record<string, string> = {};
    if (!formData.nama.trim()) err.nama = "Nama lengkap wajib diisi";
    if (!/^\d{8,10}$/.test(formData.nrp)) err.nrp = "NRP harus 8-10 digit angka";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateStep2 = (): boolean => {
    const err: Record<string, string> = {};
    if (!formData.vehicle_id) err.vehicle_id = "Pilih kendaraan yang tersedia";
    if (!formData.tanggal_peminjaman) err.tanggal_peminjaman = "Tanggal pinjam wajib diisi";
    if (!formData.tanggal_kembali) err.tanggal_kembali = "Tanggal kembali wajib diisi";
    
    const startDate = new Date(formData.tanggal_peminjaman + 'T00:00:00');
    const endDate = new Date(formData.tanggal_kembali + 'T00:00:00');
    const todayDate = new Date(new Date().toISOString().split('T')[0] + 'T00:00:00');
    
    if (startDate < todayDate) {
      err.tanggal_peminjaman = "Tanggal pinjam tidak boleh sebelum hari ini";
    }
    if (startDate >= endDate) {
      err.tanggal_kembali = "Tanggal kembali harus setelah tanggal pinjam";
    }
    if (formData.keperluan.trim().length < 10) {
      err.keperluan = "Keperluan minimal 10 karakter";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = async (): Promise<void> => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) await handleSubmit();
    }
  };

const isApiError = (error: unknown): error is { 
  response?: { 
    status: number; 
    data?: { message?: string } 
  } 
} => {
  return (
    error != null &&
    typeof error === 'object' &&
    'response' in error &&
    error.response != null &&
    typeof error.response === 'object' &&
    'status' in error.response &&
    typeof (error.response as { status?: number }).status === 'number'
  );
};

const handleSubmit = async (): Promise<void> => {
  try {
    setLoading(true);
    
    const vehicleId = parseInt(formData.vehicle_id);
    if (isNaN(vehicleId) || vehicleId <= 0) {
      throw new Error("Kendaraan tidak valid");
    }

    const payload: BookingPayload = {
      nrp: formData.nrp.trim(),
      nama: formData.nama.trim(),
      unit_kerja: formData.unit.trim(),
      detail_keperluan: formData.keperluan.trim(),
      tanggal_peminjaman: formData.tanggal_peminjaman,
      tanggal_kembali: formData.tanggal_kembali,
      vehicle_id: vehicleId,
    };

    const result = await submitBooking(payload);
    console.log("✅ Booking berhasil:", result);

    setShowSuccess(true);
    setErrors({});

    setTimeout(() => {
      setShowSuccess(false);
      setStep(1);
      setFormData({
        nama: "", 
        nrp: "", 
        unit: "",      
        vehicle_id: "", 
        tanggal_peminjaman: "", 
        tanggal_kembali: "", 
        keperluan: ""
      });
      setAvailableVehicles([]);
    }, 3000);

  } catch (error: unknown) {
    console.error("❌ Submit error:", error);
    
    let errorMessage = "Gagal mengajukan. Silakan coba lagi.";
    
    // ✅ PERFECT Type-safe error handling
    if (isApiError(error)) {
      if (error.response?.status === 429) {
        errorMessage = "⏰ Terlalu banyak pengajuan. Tunggu 1 menit.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = `Error ${error.response?.status || 'server'}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    setErrors({ _global: errorMessage });
  } finally {
    setLoading(false);
  }
};


  const step1Props: Step1Props = {
    data: formData,
    errors,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e),
    formId
  };

  const step2Props: Step2Props = {
    data: formData,
    errors,
    onChange: handleChange,
    formId,
    vehicles: availableVehicles,
    loading
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ProgressBar currentStep={step} totalSteps={2} />

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Step1Identity {...step1Props} />
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Step2Details {...step2Props} />
            </motion.div>
          )}
        </AnimatePresence>

        {errors._global && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-6 p-4 bg-red-50/90 border border-red-200/50 backdrop-blur-sm rounded-2xl"
          >
            <p className="text-sm text-red-800 font-medium">{errors._global}</p>
          </motion.div>
        )}

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium disabled:opacity-50 transition-all border"
            >
              ← Kembali
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:shadow-none transition-all hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses...
              </>
            ) : step === 2 ? (
              <>
                <IconSend size={20} />
                Ajukan Peminjaman
              </>
            ) : (
              "Lanjut →"
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 shadow-2xl z-50 border border-white/20 backdrop-blur-sm"
          >
            <IconCircleCheckFilled size={24} />
            <span className="font-semibold">Peminjaman berhasil diajukan!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}