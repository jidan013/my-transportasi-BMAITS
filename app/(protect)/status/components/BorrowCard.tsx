"use client";

import { motion } from "framer-motion";
import {
  IconCar,
  IconClock,
  IconCheck,
  IconX,
  IconFileCheck,
  IconMail,
  IconDownload,
} from "@tabler/icons-react";
import type { IconProps } from "@tabler/icons-react";
import type { ComponentType, ReactNode } from "react";
import { jsPDF } from "jspdf";
import type {
  BorrowStatus,
  TimelineKey,
  BorrowCardProps,
} from "@/types/times";

/* =====================
   TYPES
===================== */
type IconComponent = ComponentType<IconProps>;

/* =====================
   CONFIG
===================== */
const timelineIcons: Record<TimelineKey, IconComponent> = {
  diajukan: IconClock,
  ditinjau: IconFileCheck,
  disetujui: IconCheck,
  diterbitkan: IconMail,
};

const statusConfig: Record<
  BorrowStatus,
  { label: string; icon: ReactNode; className: string }
> = {
  pending: {
    label: "Menunggu",
    icon: <IconClock size={14} />,
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/40 dark:text-yellow-300",
  },
  approved: {
    label: "Disetujui",
    icon: <IconCheck size={14} />,
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-800/40 dark:text-emerald-300",
  },
  rejected: {
    label: "Ditolak",
    icon: <IconX size={14} />,
    className:
      "bg-red-100 text-red-800 dark:bg-red-800/40 dark:text-red-300",
  },
  terbit: {
    label: "Surat Terbit",
    icon: <IconMail size={14} />,
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-800/40 dark:text-blue-300",
  },
};

/* =====================
   COMPONENT
===================== */
export default function BorrowCard({
  id,
  borrower,
  vehicle,
  plate,
  borrowDate,
  returnDate,
  status,
  timeline,
}: BorrowCardProps) {
  const statusMeta = statusConfig[status];

  /* =====================
     PDF GENERATOR — OFFICIAL ITS
  ===================== */
  const handleDownloadESurat = () => {
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const marginLeft = 25;
  const marginRight = 25;
  const contentWidth = pageWidth - marginLeft - marginRight;

  let y = 30;

  /* =====================
     KOP SURAT (ITS STYLE)
  ===================== */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(
    "INSTITUT TEKNOLOGI SEPULUH NOPEMBER",
    pageWidth / 2,
    y,
    { align: "center" }
  );

  y += 7;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Kampus ITS Sukolilo, Surabaya 60111, Indonesia",
    pageWidth / 2,
    y,
    { align: "center" }
  );

  y += 5;
  doc.text(
    "Telepon (031) 5994251 | https://www.its.ac.id",
    pageWidth / 2,
    y,
    { align: "center" }
  );

  y += 6;
  doc.setLineWidth(0.8);
  doc.line(marginLeft, y, pageWidth - marginRight, y);

  /* =====================
     JUDUL SURAT
  ===================== */
  y += 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(
    "SURAT IZIN PEMINJAMAN KENDARAAN DINAS",
    pageWidth / 2,
    y,
    { align: "center" }
  );

  /* =====================
     NOMOR & PERIHAL
  ===================== */
  y += 15;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Nomor   : ${id}/ITS/BMA/2025`, marginLeft, y);
  y += 6;
  doc.text("Perihal : Izin Peminjaman Kendaraan Dinas", marginLeft, y);

  /* =====================
     TUJUAN
  ===================== */
  y += 16;
  doc.text("Kepada Yth.", marginLeft, y);
  y += 6;
  doc.text("Kepala Biro Manajemen Aset", marginLeft, y);
  y += 6;
  doc.text("Institut Teknologi Sepuluh Nopember", marginLeft, y);
  y += 6;
  doc.text("Surabaya", marginLeft, y);

  /* =====================
     ISI SURAT
  ===================== */
  y += 14;
  const isiSurat = `
Dengan hormat,

Sehubungan dengan pelaksanaan kegiatan kedinasan di lingkungan
Institut Teknologi Sepuluh Nopember, bersama ini kami mengajukan
permohonan izin peminjaman kendaraan dinas dengan rincian sebagai berikut:
  `.trim();

  doc.text(isiSurat, marginLeft, y, {
    maxWidth: contentWidth,
    lineHeightFactor: 1.5,
  });

  /* =====================
     DATA PEMINJAMAN
  ===================== */
  y += 34;
  doc.setFont("helvetica", "bold");
  doc.text("DATA PEMINJAMAN", marginLeft, y);

  y += 10;
  doc.setFont("helvetica", "normal");

  const labelX = marginLeft;
  const valueX = marginLeft + 45;

  doc.text("Nama Peminjam", labelX, y);
  doc.text(`: ${borrower}`, valueX, y);

  y += 7;
  doc.text("Jenis Kendaraan", labelX, y);
  doc.text(`: ${vehicle}`, valueX, y);

  y += 7;
  doc.text("Nomor Polisi", labelX, y);
  doc.text(`: ${plate}`, valueX, y);

  y += 7;
  doc.text("Tanggal Peminjaman", labelX, y);
  doc.text(
    `: ${new Date(borrowDate).toLocaleDateString("id-ID")} s.d. ${new Date(
      returnDate
    ).toLocaleDateString("id-ID")}`,
    valueX,
    y
  );

  /* =====================
     PENUTUP
  ===================== */
  y += 16;
  const penutup = `
Demikian permohonan izin ini kami sampaikan. Atas perhatian dan
kerja sama Bapak/Ibu, kami ucapkan terima kasih.
  `.trim();

  doc.text(penutup, marginLeft, y, {
    maxWidth: contentWidth,
    lineHeightFactor: 1.5,
  });

  /* =====================
     TANDA TANGAN
  ===================== */
  y += 35;
  const ttdX = pageWidth - marginRight - 70;

  doc.text("Surabaya, ........................................", ttdX, y);
  y += 18;
  doc.text("Kepala Biro Manajemen Aset", ttdX, y);
  y += 22;
  doc.setFont("helvetica", "bold");
  doc.text("Yayuk Pamikatsih, S.Pd.", ttdX, y);


  /* =====================
     SAVE
  ===================== */
  doc.save(`E-Surat-Peminjaman-Kendaraan-ITS-${id}.pdf`);
};
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg
                 border border-gray-200 dark:border-gray-700 p-6"
    >
      {/* HEADER */}
      <div className="flex justify-between mb-5">
        <div className="flex gap-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#00AEEF] to-[#002D72]">
            <IconCar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {vehicle}
            </h3>
            <p className="text-xs text-gray-500">{plate}</p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs ${statusMeta.className}`}>
          {statusMeta.icon} {statusMeta.label}
        </span>
      </div>

      {/* INFO */}
      <div className="grid grid-cols-2 text-sm gap-y-2">
        <p className="col-span-2">
          <strong>Peminjam:</strong> {borrower}
        </p>
        <p>
          <strong>Pinjam:</strong>{" "}
          {new Date(borrowDate).toLocaleDateString("id-ID")}
        </p>
        <p>
          <strong>Kembali:</strong>{" "}
          {new Date(returnDate).toLocaleDateString("id-ID")}
        </p>
      </div>

      {/* TIMELINE */}
      <div className="mt-6 pt-4 border-t">
        {timeline.map((t) => {
          const Icon = timelineIcons[t.key];
          return (
            <div key={t.time} className="flex gap-3 mb-3">
              <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center">
                <Icon size={14} />
              </div>
              <div>
                <p className="text-sm font-medium">{t.label}</p>
                <p className="text-xs text-gray-500">{t.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTION */}
      {status === "terbit" && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleDownloadESurat}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                       bg-blue-600 text-white text-sm font-semibold
                       hover:bg-blue-700 shadow"
          >
            <IconDownload size={16} />
            Unduh E-Surat
          </button>
        </div>
      )}
    </motion.div>
  );
}