"use client"

export type VehicleStatus = "available"| "borrowed"| "maintenance";
interface Vehicle {
  id: number
  nama: string
  jenis: string
  warna: string
  plate: string
  bbm: string
  kapasitas: string
  status: VehicleStatus
}

const mockVehicles: Vehicle[] = [
  {
    id: 1,
    nama: "BUS MANDIRI",
    jenis: "Bus",
    warna: "Putih Biru",
    plate: "L 7808 AE",
    bbm: "Dexlite",
    status: "available",
    kapasitas: "35 Orang",
  },
  {
    id: 2,
    nama: "BUS BNI",
    jenis: "Bus",
    warna: "Putih Oren",
    plate: "L 7684 AP",
    bbm: "Dexlite",
    status: "available",
    kapasitas: "28 Orang",
  },
  {
    id: 3,
    nama: "BUS SPS",
    jenis: "Bus",
    warna: "Putih Biru",
    plate: "L 7151 AH",
    bbm: "Dexlite",
    status: "available",
    kapasitas: "28 Orang",
  },
  {
    id: 4,
    nama: "BUS IKOMA",
    jenis: "Bus",
    warna: "Putih Biru",
    plate: "L 7608 AP",
    bbm: "Dexlite",
    status: "available",
    kapasitas: "27 Orang",
  },
  {
    id: 5,
    nama: "HAICE",
    jenis: "Microbus",
    warna: "Hitam",
    plate: "L 7010 N",
    bbm: "Dexlite",
    status: "available",
    kapasitas: "14 Orang",
  },
  {
    id: 6,
    nama: "HYUNDAI",
    jenis: "Kendaraan Dinas",
    warna: "Hitam",
    plate: "L 1843 OD",
    bbm: "Dexlite",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 7,
    nama: "SEDAN VIOS XSK ITS",
    jenis: "Sedan",
    warna: "Hitam",
    plate: "L 1069 OE",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "3 Orang",
  },
  {
    id: 8,
    nama: "SEDAN ALTIS XWR4",
    jenis: "Sedan",
    warna: "Hitam",
    plate: "L 1081 OE",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "3 Orang",
  },
  {
    id: 9,
    nama: "SEDAN ALTIS XWR3",
    jenis: "Sedan",
    warna: "Hitam",
    plate: "L 1080 OE",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "3 Orang",
  },
  {
    id: 10,
    nama: "INNOVA XDPP",
    jenis: "MPV",
    warna: "Hitam",
    plate: "L 1511 EP",
    bbm: "Dexlite",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 11,
    nama: "INNOVA XFTSPK",
    jenis: "MPV",
    warna: "Hitam",
    plate: "L 1852 AP",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 12,
    nama: "INNOVA X ELEKTRO",
    jenis: "MPV",
    warna: "Abu-abu",
    plate: "L 1502 BP",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 13,
    nama: "INNOVA XDRPM",
    jenis: "MPV",
    warna: "Hijau",
    plate: "L 1059 AP",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 14,
    nama: "AVANZA XDKG",
    jenis: "MPV",
    warna: "Hitam",
    plate: "L 1031 CP",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 15,
    nama: "AVANZA X INFORMATIKA",
    jenis: "MPV",
    warna: "Putih",
    plate: "L 6001 DP",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 16,
    nama: "AVANZA XBURB",
    jenis: "MPV",
    warna: "Silver",
    plate: "L 1393 DL",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 17,
    nama: "AVANZA XBK",
    jenis: "MPV",
    warna: "Silver",
    plate: "L 1068 OD",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 18,
    nama: "AVANZA XBSP",
    jenis: "MPV",
    warna: "Silver",
    plate: "L 1171 OD",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
  },
];

interface Props {
  data: Record<string, string>;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  formId: string;
  vehicles: Vehicle[];
}

export default function Step2Details({ data, errors, onChange, formId, vehicles }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label htmlFor={`${formId}-vehicleId`} className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
          Pilih Kendaraan
        </label>
        <select
          id={`${formId}-vehicleId`}
          name="vehicleId"
          value={data.vehicleId}
          onChange={onChange}
          className="mt-1 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
        >
          <option value="">-- Pilih Kendaraan --</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id} disabled={v.status !== "available"}>
              {v.nama} ({v.plate}) ({v.kapasitas}){v.status !== "available" ? " - Tidak tersedia" : ""}
            </option>
          ))}
        </select>
        {errors.vehicleId && <p className="text-red-500 text-sm mt-1">{errors.vehicleId}</p>}
      </div>

      <div>
        <label htmlFor={`${formId}-borrowDate`} className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
          Tanggal Pinjam
        </label>
        <input
          type="date"
          id={`${formId}-borrowDate`}
          name="borrowDate"
          value={data.borrowDate}
          onChange={onChange}
          className="mt-1 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
        />
        {errors.borrowDate && <p className="text-red-500 text-sm mt-1">{errors.borrowDate}</p>}
      </div>

      <div>
        <label htmlFor={`${formId}-returnDate`} className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
          Tanggal Kembali
        </label>
        <input
          type="date"
          id={`${formId}-returnDate`}
          name="returnDate"
          value={data.returnDate}
          onChange={onChange}
          className="mt-1 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
        />
        {errors.returnDate && <p className="text-red-500 text-sm mt-1">{errors.returnDate}</p>}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${formId}-purpose`} className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
          Keperluan
        </label>
        <textarea
          id={`${formId}-purpose`}
          name="purpose"
          value={data.purpose}
          onChange={onChange}
          rows={4}
          className="mt-1 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
          placeholder="Tuliskan keperluan peminjaman kendaraan..."
        />
        {errors.purpose && <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>}
      </div>
    </div>
  );
}
