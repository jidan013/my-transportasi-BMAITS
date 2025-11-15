// types/vehicle.ts
export interface Tarif {
  "B-Dalam": number;
  "B-Luar": number;
  "C-Dalam": number;
  "C-Luar": number;
}

export interface Kendaraan {
  name: string;
  kategori: "Exclusive" | "Operasional" | "Angkutan Barang";
  kapasitas: number | null;
  tarif: Tarif;
}

export const CATEGORIES = ["All", "Exclusive", "Operasional", "Angkutan Barang"] as const;
export type CategoryType = typeof CATEGORIES[number];

export const FILTERS = ["All", "B-Dalam", "B-Luar", "C-Dalam", "C-Luar"] as const;
export type FilterType = typeof FILTERS[number];

export const LAYANAN_TYPES = ["B-Dalam", "B-Luar", "C-Dalam", "C-Luar"] as const;
export type LayananType = typeof LAYANAN_TYPES[number];

export const formatIDR = (value: number | null): string => {
  if (value == null) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

export const getIconType = (kategori: CategoryType): "car" | "bus" | "truck" | null => {
  switch (kategori) {
    case "Exclusive": return "car";
    case "Operasional": return "bus";
    case "Angkutan Barang": return "truck";
    default: return null;
  }
};

export const getTarifDisplay = (
  item: Kendaraan,
  filter: FilterType
): Partial<Tarif> => {
  if (filter === "All") return item.tarif;
  const key = filter as LayananType;
  return { [key]: item.tarif[key] ?? null };
};