"use client";

interface FormData {
  nama: string;
  nrp: string;
  unit: string; 
  vehicle_id: string;
  tanggal_peminjaman: string;
  tanggal_kembali: string;
  keperluan: string;
}

interface Props {
  data: FormData;
  errors: Record<string, string>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  formId: string;
}

export default function Step1Identity({
  data,
  errors,
  onChange,
  formId,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Nama Lengkap */}
      <div>
        <label 
          htmlFor={`${formId}-name`} 
          className="block text-sm font-semibold mb-2 text-gray-700"
        >
          Nama Lengkap <span className="text-red-500">*</span>
        </label>
        <input
          id={`${formId}-name`}
          name="nama"
          type="text"
          value={data.nama}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all input"
          placeholder="Masukkan nama lengkap Anda"
          maxLength={100}
          autoComplete="name"
        />
        {errors.nama && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <span>⚠️</span> {errors.nama}
          </p>
        )}
      </div>

      {/* NRP */}
      <div>
        <label 
          htmlFor={`${formId}-nrp`} 
          className="block text-sm font-semibold mb-2 text-gray-700"
        >
          NRP <span className="text-red-500">*</span>
        </label>
        <input
          id={`${formId}-nrp`}
          name="nrp"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={data.nrp}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all input"
          placeholder="120200001"
          maxLength={10}
          autoComplete="off"
        />
        {errors.nrp && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <span>⚠️</span> {errors.nrp}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">Format: 8-18 digit angka</p>
      </div>

      <div className="sm:col-span-2">
        <label 
          htmlFor={`${formId}-unit`} 
          className="block text-sm font-semibold mb-2 text-gray-700"
        >
          Unit/Departemen/Pensiunan
        </label>
        <input
          id={`${formId}-unit`}
          name="unit"
          type="text"
          value={data.unit || ""}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all input"
          placeholder="Contoh: Biro Keuangan, Departemen Informatika, Pensiunan"
        />
        {errors.unit && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <span>⚠️</span> {errors.unit}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">Opsional - untuk keperluan administrasi</p>
      </div>
    </div>
  );
}
