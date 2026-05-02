'use client';

import Image from 'next/image';
import { Bus, Car, SlidersHorizontal, Search, ZoomIn, LucideIcon } from 'lucide-react';
import { useState } from 'react';

// ─── Image Map ────────────────────────────────────────────────────────────────

const VehicleImageMap: Record<string, string> = {
  L7808AE: '/FotoKendaraan/MANDIRI.png',
  L7684AP: '/FotoKendaraan/BNI.png',
  L7151AH: '/FotoKendaraan/SPS.png',
  L7608AP: '/FotoKendaraan/IKOMA.png',
  L1511EP: '/FotoKendaraan/L1511EP.png',
  L1502BP: '/FotoKendaraan/L1502BP.png',
  L1031CP: '/FotoKendaraan/L1031CP.png',
  L1393DL: '/FotoKendaraan/L1393DL.png',
  L1843OD: '/FotoKendaraan/L1843OD.png',
  L1081OE: '/FotoKendaraan/L1081OE.png',
  L1080OE: '/FotoKendaraan/L1080OE.png',
  DEFAULT: '/FotoKendaraan/Default.jpeg',
};

const resolveImage = (plat: string) => {
  const key = plat.replace(/\s+/g, '').toUpperCase();
  return VehicleImageMap[key] ?? VehicleImageMap.DEFAULT;
};

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusType = 'available' | 'borrowed' | 'maintenance';
type FilterType = 'Semua' | 'Bus' | 'Dinas' | 'Resmi';

interface Kendaraan {
  id: number;
  icon: LucideIcon;
  nama: string;
  jenis: string;
  plat: string;
  warna: string;
  bbm: string;
  status: StatusType;
  kapasitas: string;
  filter: FilterType;
  badge?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const kendaraanAwal: Kendaraan[] = [
  { id: 1,  icon: Bus, nama: 'BUS MANDIRI',          jenis: 'Bus',           plat: 'L 7808 AE', warna: 'Putih Biru',  bbm: 'Dexlite',   status: 'available',    kapasitas: '35 Orang', filter: 'Bus',   badge: 'ARMADA BUS' },
  { id: 2,  icon: Bus, nama: 'BUS BNI',              jenis: 'Bus',           plat: 'L 7684 AP', warna: 'Putih Oren',  bbm: 'Dexlite',   status: 'available',    kapasitas: '28 Orang', filter: 'Bus',   badge: 'ARMADA BUS' },
  { id: 3,  icon: Bus, nama: 'BUS SPS',              jenis: 'Bus',           plat: 'L 7151 AH', warna: 'Putih Biru',  bbm: 'Dexlite',   status: 'available',    kapasitas: '28 Orang', filter: 'Bus' },
  { id: 4,  icon: Bus, nama: 'BUS IKOMA',            jenis: 'Bus',           plat: 'L 7608 AP', warna: 'Putih Biru',  bbm: 'Dexlite',   status: 'available',    kapasitas: '27 Orang', filter: 'Bus' },
  { id: 5,  icon: Bus, nama: 'HAICE',                jenis: 'Microbus',      plat: 'L 7010 N',  warna: 'Hitam',       bbm: 'Dexlite',   status: 'available',    kapasitas: '14 Orang', filter: 'Bus',   badge: 'LOG PEMELIHARAAN' },
  { id: 6,  icon: Car, nama: 'HYUNDAI',              jenis: 'Kendaraan Dinas', plat: 'L 1843 OD', warna: 'Hitam',    bbm: 'Dexlite',   status: 'available',    kapasitas: '5 Orang',  filter: 'Dinas' },
  { id: 7,  icon: Car, nama: 'SEDAN VIOS XSK ITS',  jenis: 'Sedan',         plat: 'L 1069 OD', warna: 'Hitam',       bbm: 'Pertamax',  status: 'available',    kapasitas: '3 Orang',  filter: 'Resmi', badge: 'RESMI' },
  { id: 8,  icon: Car, nama: 'SEDAN ALTIS XWR4',    jenis: 'Sedan',         plat: 'L 1081 OE', warna: 'Hitam',       bbm: 'Pertamax',  status: 'available',    kapasitas: '3 Orang',  filter: 'Resmi', badge: 'RESMI' },
  { id: 9,  icon: Car, nama: 'SEDAN ALTIS XWR3',    jenis: 'Sedan',         plat: 'L 1080 OE', warna: 'Hitam',       bbm: 'Pertamax',  status: 'borrowed',     kapasitas: '3 Orang',  filter: 'Resmi' },
  { id: 10, icon: Car, nama: 'INNOVA XDPP',         jenis: 'MPV',           plat: 'L 1511 EP', warna: 'Hitam',       bbm: 'Dexlite',   status: 'available',    kapasitas: '5 Orang',  filter: 'Dinas' },
  { id: 11, icon: Car, nama: 'INNOVA XFTSPK',       jenis: 'MPV',           plat: 'L 1852 AP', warna: 'Hitam',       bbm: 'Pertamax',  status: 'maintenance',  kapasitas: '5 Orang',  filter: 'Dinas', badge: 'LOG PEMELIHARAAN' },
  { id: 12, icon: Car, nama: 'INNOVA X ELEKTRO',    jenis: 'MPV',           plat: 'L 1502 BP', warna: 'Abu-abu',     bbm: 'Pertamax',  status: 'available',    kapasitas: '5 Orang',  filter: 'Dinas' },
  { id: 13, icon: Car, nama: 'INNOVA XDRPM',        jenis: 'MPV',           plat: 'L 1059 AP', warna: 'Hijau',       bbm: 'Pertamax',  status: 'available',    kapasitas: '5 Orang',  filter: 'Dinas' },
  { id: 14, icon: Car, nama: 'AVANZA XDKG',         jenis: 'MPV',           plat: 'L 1031 CP', warna: 'Hitam',       bbm: 'Pertamax',  status: 'available',    kapasitas: '5 Orang',  filter: 'Dinas' },
  { id: 15, icon: Car, nama: 'AVANZA X INFORMATIKA',jenis: 'MPV',           plat: 'L 6001 DP', warna: 'Putih',       bbm: 'Pertamax',  status: 'available',    kapasitas: '5 Orang',  filter: 'Dinas' },
  { id: 16, icon: Car, nama: 'AVANZA XBURB',        jenis: 'MPV',           plat: 'L 1393 DL', warna: 'Silver',      bbm: 'Pertamax',  status: 'available',    kapasitas: '5 Orang',  filter: 'Dinas' },
  { id: 17, icon: Car, nama: 'AVANZA XBK',          jenis: 'MPV',           plat: 'L 1068 OD', warna: 'Silver',      bbm: 'Pertamax',  status: 'available',    kapasitas: '5 Orang',  filter: 'Dinas' },
  { id: 18, icon: Car, nama: 'AVANZA XBSP',         jenis: 'MPV',           plat: 'L 1171 OD', warna: 'Silver',      bbm: 'Pertamax',  status: 'available',    kapasitas: '5 Orang',  filter: 'Dinas' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusLabel: Record<StatusType, string> = {
  available:   'Tersedia',
  borrowed:    'Dipinjam',
  maintenance: 'Perawatan',
};

const statusStyle: Record<StatusType, string> = {
  available:   'bg-green-500 text-white',
  borrowed:    'bg-blue-500 text-white',
  maintenance: 'bg-amber-500 text-white',
};

const badgeStyle: Record<string, string> = {
  'ARMADA BUS':       'bg-amber-400 text-gray-900',
  'LOG PEMELIHARAAN': 'bg-blue-600 text-white',
  'RESMI':            'bg-gray-900 text-white',
};

// Map filter label to display
const FILTERS: { key: FilterType | 'Semua'; label: string }[] = [
  { key: 'Semua',  label: 'Semua Armada' },
  { key: 'Bus',    label: 'Bus' },
  { key: 'Dinas',  label: 'Dinas' },
  { key: 'Resmi',  label: 'Resmi' },
];

// Assign masonry sizes: first item spans full width, rest vary
const SPAN_PATTERN = ['col-span-2 row-span-2', 'col-span-1 row-span-1', 'col-span-1 row-span-2', 'col-span-1 row-span-1', 'col-span-1 row-span-1', 'col-span-1 row-span-1', 'col-span-2 row-span-1'];

// ─── Card Component ───────────────────────────────────────────────────────────

function VehicleCard({
  k,
  span,
  onClick,
}: {
  k: Kendaraan;
  span: string;
  onClick: () => void;
}) {
  const isLarge = span.includes('col-span-2');
  const isTall  = span.includes('row-span-2');

  return (
    <div
      className={`${span} relative rounded-2xl overflow-hidden cursor-pointer group`}
      style={{ minHeight: isTall ? 320 : isLarge ? 220 : 160 }}
      onClick={onClick}
    >
      {/* image */}
      <Image
        src={resolveImage(k.plat)}
        alt={k.nama}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* badge top-left */}
      {k.badge && (
        <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full ${badgeStyle[k.badge] ?? 'bg-white text-gray-900'}`}>
          {k.badge}
        </span>
      )}

      {/* zoom icon top-right (large cards only) */}
      {isLarge && (
        <div className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <ZoomIn className="w-4 h-4 text-white" />
        </div>
      )}

      {/* bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
        <div>
          {isLarge && (
            <p className="text-white font-bold text-lg leading-tight drop-shadow">
              {k.nama}
            </p>
          )}
          <p className="text-white/70 text-xs mt-0.5">
            {k.plat} &nbsp;·&nbsp; {k.jenis}
          </p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[k.status]}`}>
          {statusLabel[k.status]}
        </span>
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function DetailModal({ k, onClose }: { k: Kendaraan; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-72 w-full bg-gray-200">
          <Image
            src={resolveImage(k.plat)}
            alt={k.nama}
            fill
            className="object-cover"
            priority
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center text-xl text-gray-700 hover:bg-white transition shadow-lg"
          >
            ×
          </button>
          {k.badge && (
            <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full ${badgeStyle[k.badge] ?? 'bg-white text-gray-900'}`}>
              {k.badge}
            </span>
          )}
        </div>

        <div className="p-7">
          <h2 className="text-2xl font-black text-gray-900 mb-5">{k.nama}</h2>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: 'Jenis', value: k.jenis },
              { label: 'Nomor Plat', value: k.plat },
              { label: 'Warna', value: k.warna },
              { label: 'Kapasitas', value: k.kapasitas },
              { label: 'BBM', value: k.bbm },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">{label}</p>
                <p className="text-sm font-bold text-gray-800">{value}</p>
              </div>
            ))}
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Status</p>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusStyle[k.status]}`}>
                {statusLabel[k.status]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

export default function GaleriKendaraan() {
  const [selected, setSelected]     = useState<Kendaraan | null>(null);
  const [activeFilter, setFilter]   = useState<FilterType | 'Semua'>('Semua');
  const [query, setQuery]           = useState('');
  const [shown, setShown]           = useState(PAGE_SIZE);

  const filtered = kendaraanAwal.filter((k) => {
    const matchFilter = activeFilter === 'Semua' || k.filter === activeFilter;
    const matchQuery  = query === '' ||
      k.nama.toLowerCase().includes(query.toLowerCase()) ||
      k.jenis.toLowerCase().includes(query.toLowerCase()) ||
      k.plat.toLowerCase().includes(query.toLowerCase());
    return matchFilter && matchQuery;
  });

  const visible = filtered.slice(0, shown);

  return (
    <>
      <div className="min-h-screen bg-white">

        {/* ── TOP BAR ── */}
        <div className="border-b border-gray-100 px-8 py-3 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari ID kendaraan, jenis, atau pengemudi..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShown(PAGE_SIZE); }}
              className="pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
        </div>

        <div className="px-8 py-7 max-w-screen-xl mx-auto">

          {/* ── BREADCRUMB ── */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-5">
            <span className="hover:text-gray-600 cursor-pointer">Kendaraan</span>
            <span>›</span>
            <span className="text-gray-700 font-medium">Galeri Foto</span>
          </div>

          {/* ── PAGE HEADER ── */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7">
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">Galeri Foto Kendaraan</h1>
              <p className="text-gray-500 text-sm max-w-lg leading-relaxed">
                Katalog visual lengkap armada ITS. Pantau kondisi fisik dan spesifikasi semua
                aset institusional yang terdaftar.
              </p>
            </div>

            {/* filters */}
            <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0">
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                {FILTERS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => { setFilter(key); setShown(PAGE_SIZE); }}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                      activeFilter === key
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 rounded-xl px-4 py-1.5 hover:bg-gray-50 transition">
                <SlidersHorizontal className="w-4 h-4" />
                Filter Lainnya
              </button>
            </div>
          </div>

          {/* ── MASONRY GRID ── */}
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridAutoRows: '160px',
            }}
          >
            {visible.map((k, i) => (
              <VehicleCard
                key={k.id}
                k={k}
                span={SPAN_PATTERN[i % SPAN_PATTERN.length]}
                onClick={() => setSelected(k)}
              />
            ))}
          </div>

          {/* ── LOAD MORE ── */}
          <div className="mt-10 flex flex-col items-center gap-2">
            {shown < filtered.length && (
              <button
                onClick={() => setShown((s) => s + PAGE_SIZE)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow"
              >
                Muat Lebih Banyak Kendaraan
              </button>
            )}
            <p className="text-sm text-gray-400">
              Menampilkan {Math.min(shown, filtered.length)} dari {filtered.length} Aset Armada
            </p>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="border-t border-gray-100 mt-8 px-8 py-5 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200" />
            <span>© 2023 ITS Fleet Command Center. All Rights Reserved.</span>
          </div>
          <div className="flex gap-6">
            <span className="hover:text-gray-600 cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-gray-600 cursor-pointer">Panduan Aset</span>
            <span className="hover:text-gray-600 cursor-pointer">Status Sistem</span>
          </div>
        </footer>
      </div>

      {/* ── MODAL ── */}
      {selected && (
        <DetailModal k={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}