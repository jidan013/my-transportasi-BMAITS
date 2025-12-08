"use client";

import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import {
  IconSend,
  IconCircleCheckFilled,
} from "@tabler/icons-react";
import ProgressBar from "./ProgressBar";
import Step1Identity from "./Step1Identity";
import Step2Details from "./Step2Details";

interface Vehicle {
  id: string;
  name: string;
  plate: string;
  status: "available" | "borrowed" | "maintenance";
}

const mockVehicles: Vehicle[] = [
  { id: "1", name: "Toyota Avanza", plate: "B 1234 XYZ", status: "available" },
  { id: "2", name: "Mitsubishi Pajero", plate: "B 5678 ABC", status: "available" },
  { id: "3", name: "Daihatsu Xenia", plate: "B 9012 DEF", status: "maintenance" },
];

export default function BorrowForm() {
  const reduced = useReducedMotion();
  const formId = useId();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userName: "",
    userNip: "",
    department: "",
    vehicleId: "",
    borrowDate: "",
    returnDate: "",
    purpose: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // 🧩 Handle Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ Validasi Step 1
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.userName.trim()) newErrors.userName = "Nama wajib diisi";
    if (!formData.userNip.trim()) newErrors.userNip = "NIP wajib diisi";
    if (!formData.department.trim()) newErrors.department = "Unit kerja wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Validasi Step 2
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.vehicleId) newErrors.vehicleId = "Pilih kendaraan";
    if (!formData.borrowDate) newErrors.borrowDate = "Tanggal pinjam wajib diisi";
    if (!formData.returnDate) newErrors.returnDate = "Tanggal kembali wajib diisi";
    else if (new Date(formData.returnDate) <= new Date(formData.borrowDate)) {
      newErrors.returnDate = "Tanggal kembali harus setelah tanggal pinjam";
    }
    if (!formData.purpose.trim()) newErrors.purpose = "Keperluan wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) handleSubmit();
  };

  // Submit Data
  const handleSubmit = () => {
    // Bisa kirim ke API di sini pakai fetch/axios
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setStep(1);
      setFormData({
        userName: "",
        userNip: "",
        department: "",
        vehicleId: "",
        borrowDate: "",
        returnDate: "",
        purpose: "",
      });
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <ProgressBar currentStep={step} totalSteps={2} />

      <motion.div
        initial={{ opacity: 0, x: reduced ? 0 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700"
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                🧍‍♂️ Identitas Pemohon
              </h2>
              <Step1Identity
                data={formData}
                errors={errors}
                onChange={handleChange}
                formId={formId}
              />
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                🚗 Detail Peminjaman
              </h2>
              <Step2Details
                data={formData}
                errors={errors}
                onChange={handleChange}
                formId={formId}
                vehicles={mockVehicles}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🔘 Tombol Navigasi */}
        <div className="flex justify-between mt-8">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              ← Kembali
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className={`ml-auto px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 ${
              step === 2
                ? "bg-gradient-to-r from-[#002D72] to-[#00AEEF] shadow-xl hover:shadow-2xl"
                : "bg-gradient-to-r from-[#00AEEF] to-[#FFC107] shadow-lg"
            }`}
          >
            {step === 2 ? (
              <>
                <IconSend className="w-5 h-5" />
                Ajukan
              </>
            ) : (
              <>Lanjut →</>
            )}
          </button>
        </div>
      </motion.div>

      {/* ✅ Toast Sukses */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-lg"
          >
            <IconCircleCheckFilled className="w-7 h-7 animate-pulse" />
            Pengajuan berhasil dikirim!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
