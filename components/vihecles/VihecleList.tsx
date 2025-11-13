"use client"

import { lazy, Suspense } from "react"
import { AnimatePresence, motion } from "framer-motion"
import SkeletonCard from "../ui/skeleton"

// Lazy load komponen kartu kendaraan
const VehicleCard = lazy(() => import("@/components/vihecles/VihecleCard"))

// Definisi tipe data kendaraan
export interface Vehicle {
  id: string;
  name: string;
  type: string;
  plate: string;
  status: "available" | "borrowed" | "maintenance";
  borrower?: string;
  returnDate?: string;
  image: string;
  year: number;
  capacity: string;
}

// Props untuk VehicleList
interface VehicleListProps {
  vehicles: Vehicle[]
  isLoading: boolean
}

export default function VehicleList({ vehicles, isLoading }: VehicleListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <AnimatePresence mode="popLayout">
        {isLoading ? (
          // ⏳ Skeleton loading state
          Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))
        ) : vehicles.length === 0 ? (
          // 🚫 Tidak ada data
          <motion.div
            key="no-data"
            className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Tidak ada kendaraan ditemukan.
          </motion.div>
        ) : (
          // 🚗 Render daftar kendaraan
          vehicles.map((vehicle: Vehicle) => (
            <Suspense key={vehicle.id} fallback={<SkeletonCard />}>
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <VehicleCard vehicle={vehicle} />
              </motion.div>
            </Suspense>
          ))
        )}
      </AnimatePresence>
    </div>
  )
}
