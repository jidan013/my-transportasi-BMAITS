"use client";

import { useState, useEffect, useMemo, Suspense, lazy } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import Header from "@/components/layouts/header";
import Hero from "@/components/layouts/Hero";
import QuickStats from "@/components/stats/QuickStats";
import RecentActivity from "@/components/activity/RecentActivity";
import VehicleFilters from "@/components/vihecles/VehicleFilters";
import { VEHICLES, ACTIVITIES} from "@/lib/data";
import Skeleton from "@/components/ui/skeleton";
import Footer from "@/components/layouts/Footer";

const VehicleList = lazy(() => import("@/components/vihecles/VihecleList"));

export default function PageUser() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<null | "available" | "borrowed" | "maintenance">(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      total: VEHICLES.length,
      available: VEHICLES.filter(v => v.status === "available").length,
      borrowed: VEHICLES.filter(v => v.status === "borrowed").length,
      dueToday: VEHICLES.filter(v => v.status === "borrowed" && v.returnDate === today).length,
      maintenance: VEHICLES.filter(v => v.status === "maintenance").length,
    };
  }, []);

  const filteredVehicles = useMemo(() => {
    return VEHICLES.filter(v =>
      (v.nama.toLowerCase().includes(search.toLowerCase()) ||
        v.plat.toLowerCase().includes(search.toLowerCase())) &&
      (!filterStatus || v.status === filterStatus)
    );
  }, [search, filterStatus]);

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen font-sans bg-linear-to-br from-blue-50 via-cyan-50 to-indigo-50 dark:bg-gray-950 transition-colors">
        <Header stats={stats} />
        <Hero />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
          <QuickStats stats={stats} />
          <RecentActivity activities={ACTIVITIES} isLoading={isLoading} />
          <section>
            <VehicleFilters search={search} setSearch={setSearch} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
            <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><Skeleton /></div>}>
              <VehicleList vehicles={filteredVehicles} isLoading={isLoading} />
            </Suspense>
          </section>
        </main>
        <Footer />
      </div>
    </LazyMotion>
  );
}