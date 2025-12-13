"use client"

import { lazy, Suspense } from "react"
import { AnimatePresence, motion } from "framer-motion"
import SkeletonCard from "../ui/skeleton"
import { LucideIcon } from "lucide-react"

// Lazy load komponen kartu kendaraan
const VehicleCard = lazy(() => import("@/components/vihecles/VihecleCard"))

// Definisi tipe data kendaraan
export interface Vehicle {
  id: number
  icon: LucideIcon
  nama: string
  jenis: string
  plat: string
  warna: string
  bbm: string
  status: "available" | "borrowed" | "maintenance"
  borrower?: string
  returnDate?: string
  image: string
  kapasitas: string
}

// Props untuk VehicleList
interface VehicleListProps {
  vehicles: Vehicle[]
  isLoading: boolean
}

export default function VehicleList({ vehicles, isLoading }: VehicleListProps) {
  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
      role="list"
      aria-label="Daftar kendaraan"
    >
      <AnimatePresence mode="popLayout">
        {isLoading ? (
          // Skeleton loading state - fixed key pattern
          Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={`skeleton-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SkeletonCard />
            </motion.div>
          ))
        ) : vehicles.length === 0 ? (
          // Empty state dengan lebih baik accessibility
          <motion.div
            key="no-data"
            className="col-span-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 py-12 gap-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            role="alert"
            aria-live="polite"
          >
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-4">
              🚗
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Tidak ada kendaraan ditemukan
            </h3>
            <p className="text-sm">
              Silakan tambahkan kendaraan baru atau periksa filter Anda.
            </p>
          </motion.div>
        ) : (
          // List kendaraan dengan proper keys dan accessibility
          vehicles.map((vehicle) => (
            <Suspense key={vehicle.id.toString()} fallback={<SkeletonCard />}>
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                role="listitem"
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
