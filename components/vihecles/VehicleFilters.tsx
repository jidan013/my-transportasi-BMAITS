"use client";

import { useCallback } from "react";
import {
  IconSearch,
  IconCar,
  IconCircleCheckFilled,
  IconUsers,
  IconTools,
} from "@tabler/icons-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  filterStatus: null | "available" | "borrowed" | "maintenance";
  setFilterStatus: (
    value: null | "available" | "borrowed" | "maintenance"
  ) => void;
}

export default function VehicleFilters({
  search,
  setSearch,
  filterStatus,
  setFilterStatus,
}: Props) {
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    [setSearch]
  );

  const handleFilter = useCallback(
    (status: null | "available" | "borrowed" | "maintenance") => {
      setFilterStatus(status);
    },
    [setFilterStatus]
  );

  const filters = [
    { label: "Semua", icon: IconCar, value: null },
    { label: "Tersedia", icon: IconCircleCheckFilled, value: "available" as const },
    { label: "Dipinjam", icon: IconUsers, value: "borrowed" as const },
    { label: "Maintenance", icon: IconTools, value: "maintenance" as const },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-8">
      {/* Search */}
      <div className="relative flex-1">
        <IconSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
          aria-hidden
        />
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Cari kendaraan atau plat nomor..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#002D72]"
        />
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.label}
            onClick={() => handleFilter(f.value)}
            className={`px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
              filterStatus === f.value
                ? "bg-gradient-to-r from-[#002D72] to-[#00AEEF] text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            aria-pressed={filterStatus === f.value}
          >
            <f.icon className="w-4 h-4" />
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
