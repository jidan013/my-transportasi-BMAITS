// "use client";

// import { useEffect, useState } from "react";
// import { Download, FileText } from "lucide-react";
// import { useSearchParams } from "next/navigation";
// import Footer from "@/components/layouts/Footer";

// interface ESuratData {
//   borrower: string;
//   unit: string;
//   vehicle: string;
//   plate: string;
//   borrowDate: string;
//   returnDate: string;
// }

// export default function ESuratPage() {
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id");

//   const [data, setData] = useState<ESuratData | null>(null);

//   useEffect(() => {
//     if (!id) return;

//     fetch(`/api/borrow/${id}`)
//       .then((res) => res.ok && res.json())
//       .then(setData)
//       .catch(() => {});
//   }, [id]);

//   if (!id) {
//     return (
//       <div className="p-10 text-center text-gray-500">
//         ID peminjaman tidak ditemukan
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50
//                      dark:from-gray-900 dark:to-gray-800 py-8 px-4">
//       <div className="max-w-6xl mx-auto">

//         {/* HEADER */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
//           <div className="flex items-center justify-between gap-4">
//             <div className="flex items-center gap-3">
//               <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
//                 <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   E-Surat Peminjaman Kendaraan
//                 </h1>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   Dokumen resmi peminjaman kendaraan ITS
//                 </p>
//               </div>
//             </div>

//             <a
//               href={`/api/e-surat/${id}?download=true`}
//               className="inline-flex items-center gap-2 px-4 py-2
//                          bg-blue-600 text-white rounded-xl text-sm
//                          hover:bg-blue-700"
//             >
//               <Download className="w-4 h-4" />
//               Download PDF
//             </a>
//           </div>
//         </div>

//         {/* INFO */}
//         {data && (
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-8">
//             <div className="grid md:grid-cols-2 gap-4 text-sm">
//               <div><strong>Nama Peminjam:</strong> {data.borrower}</div>
//               <div><strong>Unit:</strong> {data.unit}</div>
//               <div><strong>Kendaraan:</strong> {data.vehicle}</div>
//               <div><strong>Plat:</strong> {data.plate}</div>
//               <div><strong>Tanggal Pinjam:</strong> {data.borrowDate}</div>
//               <div><strong>Tanggal Kembali:</strong> {data.returnDate}</div>
//             </div>
//           </div>
//         )}

//         {/* PDF VIEW */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
//           <iframe
//             src={`/api/e-surat/${id}`}
//             className="w-full h-[85vh]"
//           />
//         </div>

//         {/* NOTE */}
//         <div className="mt-10 bg-amber-50 dark:bg-amber-900/20
//                         border border-amber-200 dark:border-amber-800
//                         rounded-xl p-5">
//           <p className="text-sm text-amber-800 dark:text-amber-300">
//             <strong>Catatan:</strong> E-Surat ini sah tanpa tanda tangan basah.
//           </p>
//         </div>
//       </div>

//       <Footer />
//     </main>
//   );
// }