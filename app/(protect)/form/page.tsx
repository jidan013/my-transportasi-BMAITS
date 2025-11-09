// app/peminjaman/page.tsx
import BorrowForm from "@/app/(protect)/form/components/BorrowForm";

export default function PeminjamanPage() {
  return (
    <main className="w-full bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 dark:from-gray-950 dark:to-gray-900 py-12">
      <div className="container mx-auto">
        <h1 className="text-4xl font-black text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#002D72] to-[#00AEEF]">
          Form Peminjaman Kendaraan
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Ajukan peminjaman kendaraan dinas dengan mudah dan cepat.
        </p>
        <BorrowForm />
      </div>
    </main>
  );
}