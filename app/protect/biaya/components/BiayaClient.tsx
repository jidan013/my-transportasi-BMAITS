"use client";

import React, { useMemo, useState } from "react";
import { Download, Search, Bus, Car, Truck, Users } from "lucide-react";
import Footer from "@/components/layouts/Footer";

export interface TarifObject {
  [key: string]: number;
}

export interface VehicleItem {
  name: string;
  kategori: string;
  kapasitas: number | null;
  tarif: TarifObject;
}

const VEHICLE_RATES = {
  exclusive: [
    { name: "Hyundai H-1 XG CDRI NEXT GEN A/T", kategori: "Exclusive", kapasitas: 5, tarif: { "B-Dalam": 300000, "B-Luar": 400000, "C-Dalam": 400000, "C-Luar": 500000 } },
    { name: "Toyota Corolla Altis 1.8V A/T", kategori: "Exclusive", kapasitas: 3, tarif: { "B-Dalam": 300000, "B-Luar": 400000, "C-Dalam": 400000, "C-Luar": 500000 } },
    { name: "Toyota Vios G A/T", kategori: "Exclusive", kapasitas: 3, tarif: { "B-Dalam": 300000, "B-Luar": 400000, "C-Dalam": 400000, "C-Luar": 500000 } },
    { name: "Toyota HiAce", kategori: "Exclusive", kapasitas: 16, tarif: { "B-Dalam": 300000, "B-Luar": 400000, "C-Dalam": 400000, "C-Luar": 500000 } },
  ],
  operasional: [
    { name: "Bus Mandiri", kategori: "Operasional", kapasitas: 35, tarif: { "B-Dalam": 350000, "B-Luar": 500000, "C-Dalam": 700000, "C-Luar": 900000 } },
    { name: "Bus Biru", kategori: "Operasional", kapasitas: 27, tarif: { "B-Dalam": 350000, "B-Luar": 500000, "C-Dalam": 600000, "C-Luar": 800000 } },
    { name: "Bus Kuning", kategori: "Operasional", kapasitas: 28, tarif: { "B-Dalam": 350000, "B-Luar": 500000, "C-Dalam": 600000, "C-Luar": 800000 } },
    { name: "Toyota Grand New Innova", kategori: "Operasional", kapasitas: 7, tarif: { "B-Dalam": 200000, "B-Luar": 300000, "C-Dalam": 300000, "C-Luar": 400000 } },
    { name: "Toyota Avanza", kategori: "Operasional", kapasitas: 7, tarif: { "B-Dalam": 200000, "B-Luar": 300000, "C-Dalam": 300000, "C-Luar": 400000 } },
  ],
  angkutanBarang: [
    { name: "Truk Merah", kategori: "Angkutan Barang", kapasitas: null, tarif: { "B-Dalam": 300000, "B-Luar": 400000, "C-Dalam": 400000, "C-Luar": 500000 } },
    { name: "Truk Putih", kategori: "Angkutan Barang", kapasitas: null, tarif: { "B-Dalam": 200000, "B-Luar": 300000, "C-Dalam": 300000, "C-Luar": 400000 } },
    { name: "Grand Max", kategori: "Angkutan Barang", kapasitas: null, tarif: { "B-Dalam": 200000, "B-Luar": 300000, "C-Dalam": 300000, "C-Luar": 400000 } },
  ],
};

const ALL_ITEMS: VehicleItem[] = [
  ...VEHICLE_RATES.exclusive,
  ...VEHICLE_RATES.operasional,
  ...VEHICLE_RATES.angkutanBarang,
];

const CATEGORIES = ["All", "Exclusive", "Operasional", "Angkutan Barang"];
const FILTERS = ["All", "B-Dalam", "B-Luar", "C-Dalam", "C-Luar"];


function formatIDR(value: number): string {
  if (value == null) return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}


export function getIcon(kategori: string): React.ReactNode {
  switch (kategori) {
    case "Exclusive":
      return <Car className="w-5 h-5" />;

    case "Operasional":
      return <Bus className="w-5 h-5" />;

    case "Angkutan Barang":
      return <Truck className="w-5 h-5" />;

    default:
      return null;
  }
}

function getIconSvg(kategori: string): string {
  switch (kategori) {
    case "Exclusive":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"><circle cx="10" cy="10" r="8"/></svg>`;
    case "Operasional":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"><rect x="3" y="6" width="14" height="8"/></svg>`;
    case "Angkutan Barang":
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"><polygon points="3,15 17,15 14,8 3,8"/></svg>`;
    default:
      return "";
  }
}


export default function Page() {
  const [category, setCategory] = useState("All");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return ALL_ITEMS.filter((item) => {
      if (category !== "All" && item.kategori !== category) return false;
      if (query && !item.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [category, query]);

  function getTarifDisplay(item: VehicleItem): TarifObject {
    if (filter === "All") return item.tarif;
    return { [filter]: item.tarif[filter] ?? null };
  }

  function exportCSV() {
    const rows = [];
    const header = ["Kategori", "Nama Kendaraan", "Kapasitas", "Jenis Layanan", "Tarif (per 12 jam) (Rp)"];
    rows.push(header.join(","));

    filtered.forEach((item) => {
      const tarifs = getTarifDisplay(item);
      Object.entries(tarifs).forEach(([jenis, tarif]) => {
        rows.push([
          item.kategori,
          item.name,
          item.kapasitas ?? "-",
          jenis,
          tarif ?? "",
        ].map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","));
      });
    });

    const csv = rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tarif-kendaraan-its-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPDF() {
    const printableItems = filtered
      .map((item) => {
        const tarifs = getTarifDisplay(item);
        const rows = Object.entries(tarifs)
          .map(
            ([jenis, val]) => `
              <tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${jenis}</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: right;">${
                  val ? formatIDR(val).replace("Rp", "Rp ")
                  : "-"
                }</td>
              </tr>`
          )
          .join("");

          const iconSvg = getIconSvg(item.kategori);

        return `
          <div style="margin-bottom: 32px; page-break-inside: avoid; font-family: 'Segoe UI', sans-serif;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            ${iconSvg ? `<span style="color: #3b82f6; width: 20px; height: 20px;">${iconSvg}</span>` : ""}
            <h3 style="margin: 0; font-size: 1.1rem; font-weight: 600;">${item.name}</h3>
          </div>
          <div style="font-size: 0.9rem; color: #666; margin-bottom: 8px;">
            <strong>Kategori:</strong> ${item.kategori} | 
            <strong>Kapasitas:</strong> ${item.kapasitas ?? "Tidak tersedia"}
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="text-align: left; padding: 8px 12px; border-bottom: 2px solid #ddd;">Jenis Layanan</th>
                <th style="text-align: right; padding: 8px 12px; border-bottom: 2px solid #ddd;">Tarif (Rp)</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        `;
      })
      .join("<hr style='border: 0; border-top: 1px dashed #ccc; margin: 24px 0;'>");

    const html = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Tarif Peminjaman Kendaraan - ITS</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1f2937; background: white; }
          h1 { font-size: 1.8rem; margin-bottom: 8px; color: #1e40af; }
          .header { margin-bottom: 32px; border-bottom: 2px solid #e5e7eb; padding-bottom: 16px; }
          .meta { color: #6b7280; font-size: 0.9rem; }
          @media print {
            body { padding: 20px; }
            hr { page-break-after: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Tarif Peminjaman Kendaraan — ITS</h1>
          <p class="meta">Berdasarkan Keputusan Rektor Tahun 2024</p>
          <p class="meta">Dicetak pada: ${new Date().toLocaleString("id-ID")}</p>
        </div>
        ${printableItems}
        <div style="margin-top: 40px; font-size: 0.8rem; color: #9ca3af; text-align: center;">
          © Institut Teknologi Sepuluh Nopember
        </div>
      </body>
      </html>
    `;

    const win = window.open("", "_blank", "width=1000,height=800");
    if (!win) {
      alert("Popup diblokir. Izinkan popup untuk mencetak PDF.");
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 600);
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Tarif Peminjaman Kendaraan
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Daftar tarif resmi ITS per 12 jam (Keputusan Rektor 2024)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportCSV}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
              <button
                onClick={exportPDF}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Pills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Kategori Kendaraan</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(category === c ? "All" : c)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      category === c
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {c === "All" ? "Semua" : c}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter & Search */}
            <div className="md:col-span-2 space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter & Pencarian</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {FILTERS.map((f) => (
                    <option key={f} value={f}>
                      {f === "All" ? "Semua Jenis Layanan" : f}
                    </option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari nama kendaraan..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Tidak ada kendaraan yang sesuai dengan filter.</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const tarifs = getTarifDisplay(item);
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400">
                      {getIcon(item.kategori)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {item.kategori}
                      </p>
                    </div>
                  </div>

                  {item.kapasitas && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <Users className="w-4 h-4" />
                      <span>Kapasitas: {item.kapasitas} orang</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    {Object.entries(tarifs).map(([jenis, val]) => (
                      <div
                        key={jenis}
                        className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{jenis}</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {val ? formatIDR(val) : "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Note */}
        <div className="my-12 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>Catatan:</strong> Tarif di atas adalah tarif <strong>per 12 jam</strong>. Biaya tambahan seperti pengemudi, BBM, tol, atau parkir dapat dikenakan sesuai ketentuan layanan. Hubungi bagian logistik untuk informasi lebih lanjut.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}