"use client";

interface Props {
  data: Record<string, string>;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formId: string;
}

export default function Step1Identity({ data, errors, onChange, formId }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label htmlFor={`${formId}-userName`} className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
          Nama Lengkap
        </label>
        <input
          id={`${formId}-userName`}
          name="userName"
          value={data.userName}
          onChange={onChange}
          className="mt-1 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
          placeholder="Masukkan nama Anda"
        />
        {errors.userName && <p className="text-red-500 text-sm mt-1">{errors.userName}</p>}
      </div>

      <div>
        <label htmlFor={`${formId}-userNip`} className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
          NRP
        </label>
        <input
          id={`${formId}-userNip`}
          name="userNip"
          value={data.userNip}
          onChange={onChange}
          className="mt-1 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
          placeholder="Masukkan NRP"
        />
        {errors.userNip && <p className="text-red-500 text-sm mt-1">{errors.userNip}</p>}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${formId}-department`} className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
          Unit Kerja / Departemen
        </label>
        <input
          id={`${formId}-department`}
          name="department"
          value={data.department}
          onChange={onChange}
          className="mt-1 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
          placeholder="Contoh: Biro Umum / Keuangan"
        />
        {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
      </div>
    </div>
  );
}
