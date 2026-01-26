'use client';

import Image from 'next/image';
import { Bus, Car, LucideIcon } from 'lucide-react';
import { useState } from 'react';

const VehicleImageMap: Record<string, string> = {
  // BUS
  L7808AE: "/FotoKendaraan/MANDIRI.png",
  L7684AP: "/FotoKendaraan/BNI.png",
  L7151AH: "/FotoKendaraan/SPS.png",
  L7608AP: "/FotoKendaraan/IKOMA.png",

  // MOBIL
  L1511EP: "/FotoKendaraan/L1511EP.png",
  L1502BP: "/FotoKendaraan/L1502BP.png",
  L1031CP: "/FotoKendaraan/L1031CP.png",
  L1393DL: "/FotoKendaraan/L1393DL.png",
  L1843OD: "/FotoKendaraan/L1843OD.png",
  L1081OE: "/FotoKendaraan/L1081OE.png",
  L1080OE: "/FotoKendaraan/L1080OE.png",

  DEFAULT: "/FotoKendaraan/Default.jpeg",
};


const resolveImage = (plat: string) => {
  const key = plat.replace(/\s+/g, '').toUpperCase();
  return VehicleImageMap[key] || VehicleImageMap.DEFAULT;
};

interface Kendaraan {
  id: number;
  icon: LucideIcon;
  nama: string;
  jenis: string;
  plat: string;
  warna: string;
  bbm: string;
  status: "available" | "borrowed" | "maintenance";
  borrower?: string;
  returnDate?: string;
  kapasitas: string;
}

const kendaraanAwal: Kendaraan[] = [
  {
    id: 1,
    icon: Bus,
    nama: "BUS MANDIRI",
    jenis: "Bus",
    warna: "Putih Biru",
    plat: "L 7808 AE",
    bbm: "Dexlite",
    status: "available",
    kapasitas: "35 Orang",
  },
  {
    id: 2,
    icon: Bus,
    nama: "BUS BNI",
    jenis: "Bus",
    warna: "Putih Oren",
    plat: "L 7684 AP",
    bbm: "Dexlite",
    status: "available",
    kapasitas: "28 Orang",
  },
  {
    id: 3,
    icon: Bus,
    nama: "BUS SPS",
    jenis: "Bus",
    warna: "Putih Biru",
    plat: "L 7151 AH",
    bbm: "Dexlite",
    status: "available",
    kapasitas: "28 Orang",
  },
  {
    id: 4,
    icon: Bus,
    nama: "BUS IKOMA",
    jenis: "Bus",
    warna: "Putih Biru",
    plat: "L 7608 AP",
    bbm: "Dexlite",
    status: "available",
    kapasitas: "27 Orang",
  },
  {
    id: 5,
    icon: Bus,
    nama: "HAICE",
    jenis: "Microbus",
    warna: "Hitam",
    plat: "L 7010 N",
    bbm: "Dexlite",
    status: "available",
    kapasitas: "14 Orang",
  },
  {
    id: 6,
    icon: Car,
    nama: "HYUNDAI",
    jenis: "Kendaraan Dinas",
    warna: "Hitam",
    plat: "L 1843 OD",
    bbm: "Dexlite",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 7,
    icon: Car,
    nama: "SEDAN VIOS XSK ITS",
    jenis: "Sedan",
    warna: "Hitam",
    plat: "L 1069 OD",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "3 Orang",
  },
  {
    id: 8,
    icon: Car,
    nama: "SEDAN ALTIS XWR4",
    jenis: "Sedan",
    warna: "Hitam",
    plat: "L 1081 OE",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "3 Orang",
  },
  {
    id: 9,
    icon: Car,
    nama: "SEDAN ALTIS XWR3",
    jenis: "Sedan",
    warna: "Hitam",
    plat: "L 1080 OE",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "3 Orang",
  },
  {
    id: 10,
    icon: Car,
    nama: "INNOVA XDPP",
    jenis: "MPV",
    warna: "Hitam",
    plat: "L 1511 EP",
    bbm: "Dexlite",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 11,
    icon: Car,
    nama: "INNOVA XFTSPK",
    jenis: "MPV",
    warna: "Hitam",
    plat: "L 1852 AP",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 12,
    icon: Car,
    nama: "INNOVA X ELEKTRO",
    jenis: "MPV",
    warna: "Abu-abu",
    plat: "L 1502 BP",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 13,
    icon: Car,
    nama: "INNOVA XDRPM",
    jenis: "MPV",
    warna: "Hijau",
    plat: "L 1059 AP",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 14,
    icon: Car,
    nama: "AVANZA XDKG",
    jenis: "MPV",
    warna: "Hitam",
    plat: "L 1031 CP",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 15,
    icon: Car,
    nama: "AVANZA X INFORMATIKA",
    jenis: "MPV",
    warna: "Putih",
    plat: "L 6001 DP",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 16,
    icon: Car,
    nama: "AVANZA XBURB",
    jenis: "MPV",
    warna: "Silver",
    plat: "L 1393 DL",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 17,
    icon: Car,
    nama: "AVANZA XBK",
    jenis: "MPV",
    warna: "Silver",
    plat: "L 1068 OD",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 18,
    icon: Car,
    nama: "AVANZA XBSP",
    jenis: "MPV",
    warna: "Silver",
    plat: "L 1171 OD",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
  },
];


export default function GaleriKendaraan() {
  const [selected, setSelected] = useState<Kendaraan | null>(null);

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Foto Kendaraan Dinas
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {kendaraanAwal.map((k) => (
              <div
                key={k.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-full group"
                onClick={() => setSelected(k)}
              >
                <div className="relative h-64 w-full bg-gray-200 shrink-0 overflow-hidden group-hover:brightness-110">
                  <Image
                    src={resolveImage(k.plat)}
                    alt={k.nama}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 text-white bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                    <k.icon size={20} />
                    <span className="text-sm font-semibold">{k.jenis}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">{k.nama}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold text-gray-800">Plat:</span> {k.plat}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold text-gray-800">Warna:</span> {k.warna}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">Kapasitas:</span> {k.kapasitas}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className={`text-xs font-medium px-4 py-2 rounded-full capitalize transition-all duration-300 ${
                      k.status === 'available' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200 shadow-md' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200 shadow-md'
                    }`}>
                      {k.status}
                    </span>
                    <span className="text-xs text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-lg">
                      {k.bbm}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Detail */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/95 z-1000 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200"
          onClick={() => setSelected(null)}
        >
          <div 
            className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header dengan Close Button */}
            <div className="relative h-96 w-full shrink-0 overflow-hidden rounded-t-3xl">
              <Image
                src={resolveImage(selected.plat)}
                alt={selected.nama}
                fill
                className="object-contain"
                priority
              />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-gray-800 text-2xl hover:bg-white hover:scale-110 transition-all duration-200 shadow-2xl z-20"
                aria-label="Tutup"
              >
                ×
              </button>
            </div>

            {/* Info Section */}
            <div className="p-8 pb-12">
              <h2 className="text-3xl font-black mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {selected.nama}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <selected.icon size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Jenis Kendaraan</p>
                      <p className="text-xl font-bold text-gray-900">{selected.jenis}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-linear-to-r from-emerald-50 to-teal-50 rounded-2xl">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Kapasitas</p>
                    <p className="text-2xl font-black text-emerald-700">{selected.kapasitas}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-linear-to-r from-orange-50 to-amber-50 rounded-2xl">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Nomor Plat</p>
                    <p className="text-2xl font-black text-gray-900">{selected.plat}</p>
                  </div>
                  
                  <div className="p-4 bg-linear-to-r from-purple-50 to-violet-50 rounded-2xl">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Warna</p>
                    <p className="text-xl font-bold text-gray-900 capitalize">{selected.warna}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
                <span className={`px-6 py-3 rounded-2xl font-bold text-sm uppercase shadow-lg transition-all duration-200 ${
                  selected.status === 'available'
                    ? 'bg-linear-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-xl hover:-translate-y-1'
                    : 'bg-linear-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 hover:shadow-xl hover:-translate-y-1'
                }`}>
                  {selected.status === 'available' ? '✅ Tersedia' : '❌ Tidak Tersedia'}
                </span>
                <span className="px-6 py-3 bg-linear-to-r from-gray-100 to-gray-200 text-gray-800 font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all duration-200">
                  BBM: {selected.bbm}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
