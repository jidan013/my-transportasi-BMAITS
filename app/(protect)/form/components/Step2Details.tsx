"use client";

interface Vehicle {
  id: string;
  name: string;
  plate: string;
  status: "available" | "borrowed" | "maintenance";
}

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
              {v.name} ({v.plate}) {v.status !== "available" ? " - Tidak tersedia" : ""}
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
