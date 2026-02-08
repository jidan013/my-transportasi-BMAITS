// "use client";

// import type { Vehicle, VehicleStatus } from "@/types/vehicle";

// interface FormData {
//   nama: string;
//   nrp: string;
//   unit_kerja: string;
//   vehicle_id: string;
//   tanggal_peminjaman: string;
//   tanggal_kembali: string;
//   keperluan: string;
// }

// interface Props {
//   data: FormData;
//   errors: Record<string, string>;
//   onChange: React.ChangeEventHandler<
//     HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//   >;
//   onDatesChange: (dates: { start: string; end: string }) => void;
//   availableVehicles?: Vehicle[];
//   loading: boolean;
//   loadingAvailable: boolean;
// }

// export default function Step2Details({
//   data,
//   errors,
//   onChange,
//   onDatesChange,
//   availableVehicles = [],
//   loading,
//   loadingAvailable,
// }: Props) {
//   const renderStatus = (status: VehicleStatus) =>
//     status === "tersedia" ? "✅ Tersedia" : "🚗 Dipinjam";

//   /* ================= TANGGAL ================= */
//   const handleDateChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { name, value } = e.target;
//     onChange(e);

//     const start =
//       name === "tanggal_peminjaman" ? value : data.tanggal_peminjaman;
//     const end =
//       name === "tanggal_kembali" ? value : data.tanggal_kembali;

//     // 🔐 API hanya dipanggil jika dua tanggal valid
//     if (start && end && start <= end) {
//       onDatesChange({ start, end });
//     }
//   };

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//       {/* Kendaraan */}
//       <div>
//         <label className="font-semibold mb-2 block">
//           Kendaraan *
//         </label>

//         <select
//           name="vehicle_id"
//           value={data.vehicle_id}
//           onChange={onChange}
//           disabled={
//             loading ||
//             loadingAvailable ||
//             !data.tanggal_peminjaman ||
//             !data.tanggal_kembali
//           }
//           className="w-full px-4 py-3 border rounded-xl"
//         >
//           <option value="">
//             {!data.tanggal_peminjaman || !data.tanggal_kembali
//               ? "Pilih tanggal terlebih dahulu"
//               : loadingAvailable
//               ? "Memuat kendaraan..."
//               : availableVehicles.length === 0
//               ? "Tidak ada kendaraan tersedia"
//               : "Pilih kendaraan"}
//           </option>

//           {availableVehicles.map((v) => (
//             <option key={v.id} value={String(v.id)}>
//               {v.nama_kendaraan} ({v.nomor_polisi}) –{" "}
//               {renderStatus(v.status_ketersediaan)}
//             </option>
//           ))}
//         </select>

//         {errors.vehicle_id && (
//           <p className="text-red-500 text-sm mt-1">
//             {errors.vehicle_id}
//           </p>
//         )}
//       </div>

//       {/* Tanggal Pinjam */}
//       <div>
//         <label className="font-semibold mb-2 block">
//           Tanggal Pinjam *
//         </label>
//         <input
//           type="date"
//           name="tanggal_peminjaman"
//           value={data.tanggal_peminjaman}
//           onChange={handleDateChange}
//           className="w-full px-4 py-3 border rounded-xl"
//         />
//       </div>

//       {/* Tanggal Kembali */}
//       <div>
//         <label className="font-semibold mb-2 block">
//           Tanggal Kembali *
//         </label>
//         <input
//           type="date"
//           name="tanggal_kembali"
//           min={data.tanggal_peminjaman}
//           value={data.tanggal_kembali}
//           onChange={handleDateChange}
//           className="w-full px-4 py-3 border rounded-xl"
//         />
//       </div>

//       {/* Keperluan */}
//       <div className="sm:col-span-2">
//         <label className="font-semibold mb-2 block">
//           Keperluan *
//         </label>
//         <textarea
//           name="keperluan"
//           rows={4}
//           value={data.keperluan}
//           onChange={onChange}
//           className="w-full px-4 py-3 border rounded-xl"
//         />
//       </div>
//     </div>
//   );
// }
