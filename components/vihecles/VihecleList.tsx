"use client";

import { lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SkeletonCard from "../ui/skeleton";

const VehicleCard = lazy(() => import("@/components/vihecles/VihecleCard"));

interface Props {
  vehicles: any[];
  isLoading: boolean;
}

export default function VehicleList({ vehicles, isLoading }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <AnimatePresence mode="popLayout">
        {isLoading ? (
          // tampilkan skeleton
          Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))
        ) : vehicles.length === 0 ? (
          // tidak ada data
          <motion.div
            key="no-data"
            className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Tidak ada kendaraan ditemukan.
          </motion.div>
        ) : (
          // render daftar kendaraan
          vehicles.map((vehicle) => (
            <Suspense key={vehicle.id} fallback={<SkeletonCard />}>
              <VehicleCard vehicle={vehicle} />
            </Suspense>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
