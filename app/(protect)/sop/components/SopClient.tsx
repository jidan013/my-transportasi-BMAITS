"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  ChevronDown,
  FileText,
  ClipboardList,
  FolderKanban,
  CheckCircle,
  FileSignature,
  Workflow,
  BookOpen,
  LucideIcon,
} from "lucide-react"
import * as React from "react"

function MotionContent({
  children,
  isOpen,
}: {
  children: React.ReactNode
  isOpen: boolean
}) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="motion-content"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="overflow-hidden text-gray-700 leading-relaxed mt-3"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SmoothTrigger({
  icon: Icon,
  children,
  isOpen,
}: {
  icon: LucideIcon
  children: React.ReactNode
  isOpen: boolean
}) {
  return (
    <div
      className={`flex justify-between items-center rounded-xl px-6 py-5 transition-all duration-300 shadow-sm ${isOpen
          ? "bg-gradient-to-r from-blue-50 to-white border border-blue-200"
          : "bg-white hover:bg-blue-50 border border-gray-200"
        }`}
    >
      <div className="flex items-center gap-3 text-gray-900 font-semibold text-lg">
        <Icon className="w-5 h-5 text-blue-600" />
        {children}
      </div>
      <motion.div
        initial={false}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronDown className="w-5 h-5 text-blue-600" />
      </motion.div>
    </div>
  )
}

export default function SopAccordionPage() {
  const [openItem, setOpenItem] = React.useState<string | null>("item-1")

  const renderTrigger = (id: string, label: string, icon: LucideIcon) => (
    <AccordionTrigger
      onClick={() => setOpenItem(openItem === id ? null : id)}
      className="w-full !no-underline !p-0 bg-transparent focus-visible:ring-0 focus-visible:outline-none"
    >
      <SmoothTrigger icon={icon} isOpen={openItem === id}>
        {label}
      </SmoothTrigger>
    </AccordionTrigger>
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 py-16 px-6">
      {/* HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto text-center mb-14"
      >
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
          Standard Operating Procedure
        </h1>
        <h2 className="text-3xl font-semibold text-blue-700">
          Layanan Peminjaman Mobil Dinas
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Nomor: 7.2.4.3.2/IT2.II.3/2020 — Biro Manajemen Aset ITS
        </p>
        <div className="h-[3px] w-24 bg-blue-600 mx-auto mt-6 rounded-full" />
      </motion.header>

      {/* ACCORDION */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-3xl p-10"
      >
        <Accordion
          type="single"
          collapsible
          value={openItem || undefined}
          onValueChange={setOpenItem}
          className="space-y-5"
        >
          {/* 1 */}
          <AccordionItem value="item-1">
            {renderTrigger("item-1", "1. Tujuan", FileText)}
            <MotionContent isOpen={openItem === "item-1"}>
              Memberikan pedoman pelaksanaan layanan peminjaman kendaraan dinas di lingkungan
              Institut Teknologi Sepuluh Nopember (ITS) agar terlaksana secara tertib,
              terkendali, akuntabel, dan sesuai ketentuan yang berlaku.

            </MotionContent>
          </AccordionItem>

          {/* 2 */}
          <AccordionItem value="item-2">
            {renderTrigger("item-2", "2. Ruang Lingkup", FolderKanban)}
            <MotionContent isOpen={openItem === "item-2"}>
              Prosedur ini mencakup proses pengajuan, verifikasi, persetujuan, penugasan sopir,
              penerbitan surat perintah jalan, hingga pengembalian kendaraan dinas yang
              digunakan untuk kepentingan kedinasan.

            </MotionContent>
          </AccordionItem>

          {/* 3 */}
          <AccordionItem value="item-3">
            {renderTrigger("item-3", "3. Definisi", BookOpen)}
            <MotionContent isOpen={openItem === "item-3"}>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <b>Kendaraan Dinas:</b> kendaraan milik ITS yang digunakan untuk mendukung
                  pelaksanaan tugas kedinasan.
                </li>
                <li>
                  <b>Peminjaman Kendaraan Dinas:</b> penggunaan kendaraan dinas oleh unit kerja
                  atau pejabat ITS untuk keperluan resmi.
                </li>
                <li>
                  <b>Surat Permohonan:</b> surat resmi pengajuan peminjaman kendaraan dinas dari
                  unit kerja kepada Biro Manajemen Aset.
                </li>
                <li>
                  <b>Surat Perintah Jalan:</b> dokumen resmi sebagai dasar operasional penggunaan
                  kendaraan dinas.
                </li>
              </ul>

            </MotionContent>
          </AccordionItem>

          {/* 4 */}
          <AccordionItem value="item-4">
            {renderTrigger("item-4", "4. Dokumen Terkait", FileSignature)}
            <MotionContent isOpen={openItem === "item-4"}>
              <ul className="list-disc ml-6 space-y-1">
                <li>Surat Permohonan Peminjaman Kendaraan Dinas</li>
                <li>Surat Perintah Jalan Kendaraan Dinas</li>
                <li>Dokumen pendukung kegiatan kedinasan</li>
              </ul>

            </MotionContent>
          </AccordionItem>

          {/* 5 */}
          <AccordionItem value="item-5">
            {renderTrigger("item-5", "5. Rincian Prosedur", ClipboardList)}
            <MotionContent isOpen={openItem === "item-5"}>
              <table className="min-w-full border border-gray-200 text-sm bg-white rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-gradient-to-r from-blue-100 to-blue-50 text-gray-700 font-semibold">
                  <tr>
                    <th className="border px-3 py-2 text-left w-10">No</th>
                    <th className="border px-3 py-2 text-left w-52">Penanggung Jawab</th>
                    <th className="border px-3 py-2 text-left">Aktivitas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ["Pemohon", "Mengajukan surat permohonan peminjaman sesuai Tata Naskah ITS."],
                    ["Staf Layanan Surat", "Mencatat surat masuk dan meneruskan ke Kepala Biro Manajemen Aset."],
                    ["Kepala Biro Manajemen Aset", "Menelaah dan meneruskan ke Kabag Logistik dan Keamanan."],
                    ["Kabag Logistik & Keamanan", "Menelaah kegiatan serta rekomendasi biaya perawatan & BBM."],
                    ["Kasubbag Layanan Logistik", "Menugaskan sopir dan memerintahkan penerbitan Surat Jalan."],
                    ["Staf", "Menggandakan surat jalan, mengarsipkan, dan menyerahkan kepada sopir."],
                    ["Sopir", "Menerima surat perintah jalan dan melaksanakan kegiatan."],
                  ].map(([a, b], i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="border px-3 py-2">{i + 1}</td>
                      <td className="border px-3 py-2 font-medium">{a}</td>
                      <td className="border px-3 py-2">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </MotionContent>
          </AccordionItem>

          {/* 6 */}
          <AccordionItem value="item-6">
            {renderTrigger("item-6", "6. Record / Catatan Mutu", FileText)}
            <MotionContent isOpen={openItem === "item-6"}>
              <ul className="list-disc ml-6 space-y-1">
                <li>Arsip Surat Permohonan Peminjaman</li>
                <li>Arsip Surat Perintah Jalan</li>
                <li>Catatan penggunaan kendaraan dinas</li>
              </ul>

            </MotionContent>
          </AccordionItem>

          {/* 7 */}
          <AccordionItem value="item-7">
            {renderTrigger("item-7", "7. Indikator Keberhasilan", CheckCircle)}
            <MotionContent isOpen={openItem === "item-7"}>
              Pelayanan peminjaman kendaraan dinas dilaksanakan sesuai prosedur dan
              Surat Perintah Jalan diterbitkan maksimal <b>1 (satu) hari kerja</b>
              setelah permohonan disetujui.

            </MotionContent>
          </AccordionItem>

          {/* 8 */}
          <AccordionItem value="item-8">
            {renderTrigger("item-8", "8. Alur / Flowchart Prosedur", Workflow)}
            <MotionContent isOpen={openItem === "item-8"}>
              <ol className="list-decimal ml-6 space-y-1">
                <li>Unit kerja mengajukan surat permohonan peminjaman kendaraan dinas.</li>
                <li>Surat diterima dan diverifikasi oleh Biro Manajemen Aset.</li>
                <li>Permohonan disetujui oleh pejabat berwenang.</li>
                <li>Kabag Logistik dan Keamanan memberikan rekomendasi operasional.</li>
                <li>Kasubbag Layanan Logistik menugaskan sopir dan kendaraan.</li>
                <li>Surat Perintah Jalan diterbitkan.</li>
                <li>Kendaraan digunakan sesuai ketentuan dan dikembalikan setelah kegiatan selesai.</li>
              </ol>

            </MotionContent>
          </AccordionItem>
        </Accordion>
      </motion.section>

      {/* FOOTER */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="text-center text-gray-500 mt-16 text-sm"
      >
        <div className="h-[2px] w-24 bg-blue-600 mx-auto mb-4 rounded-full" />
        <p className="font-medium">Subbagian Layanan Transportasi</p>
        <p>Biro Manajemen Aset – Institut Teknologi Sepuluh Nopember (ITS)</p>
        <p className="mt-1 text-gray-400 italic">
          Dokumen Internal • Versi Terkendali • © 2025
        </p>
      </motion.footer>
    </main>
  )
}
