"use client";

import { motion } from "framer-motion";

interface Props {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: Props) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-linear-to-r from-[#00AEEF] to-[#002D72]"
        />
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-right font-medium">
        Langkah {currentStep} dari {totalSteps}
      </div>
    </div>
  );
}
