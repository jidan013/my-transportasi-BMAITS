"use client";

import Link from "next/link";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import {
  IconMail,
  IconMapPin,
  IconPhone,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandYoutube,
} from "@tabler/icons-react";

export default function Footer() {
  const socialLinks = [
    { icon: IconBrandFacebook, href: "#", label: "Facebook" },
    { icon: IconBrandInstagram, href: "#", label: "Instagram" },
    { icon: IconBrandLinkedin, href: "#", label: "LinkedIn" },
    { icon: IconBrandYoutube, href: "#", label: "YouTube" },
  ];

  return (
    <LazyMotion features={domAnimation}>
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo dan deskripsi */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#002D72] to-[#00AEEF] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-lg font-extrabold text-white">ITS</span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold">ITS</h3>
                  <p className="text-xs text-cyan-400">Biro Manajemen Aset</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Sistem peminjaman kendaraan dinas ITS dengan teknologi modern
                untuk efisiensi maksimal.
              </p>
            </div>

            {/* Layanan */}
            <div>
              <h4 className="font-bold text-lg mb-4">Layanan</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {["Peminjaman Kendaraan", "Jadwal Maintenance", "Laporan Penggunaan", "Bantuan"].map(
                  (item, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="hover:text-[#00AEEF] transition focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                        tabIndex={0}
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Kontak */}
            <div>
              <h4 className="font-bold text-lg mb-4">Kontak</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <IconMapPin className="w-4 h-4 text-[#00AEEF]" aria-hidden="true" />
                  <span>Kampus ITS Sukolilo, Surabaya 60111</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconPhone className="w-4 h-4 text-[#00AEEF]" aria-hidden="true" />
                  <span>(031) 599-1234</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconMail className="w-4 h-4 text-[#00AEEF]" aria-hidden="true" />
                  <span>transportasi@its.ac.id</span>
                </li>
              </ul>
            </div>

            {/* Media Sosial */}
            <div>
              <h4 className="font-bold text-lg mb-4">Ikuti Kami</h4>
              <div className="flex gap-3">
                {socialLinks.map((social, i) => (
                  <motion.a
                    key={`social-${i}`}
                    href={social.href}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-[#00AEEF] transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                    aria-label={`Ikuti kami di ${social.label}`}
                    tabIndex={0}
                  >
                    <social.icon className="w-5 h-5" aria-hidden="true" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-10 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
            <p>
              © 2025{" "}
              <span className="text-[#00AEEF] font-bold">
                Institut Teknologi Sepuluh Nopember
              </span>
              . Hak Cipta Dilindungi.
            </p>
            <p className="mt-2">
              Sistem Peminjaman Kendaraan • Bagian Umum & Transportasi
            </p>
          </div>
        </div>
      </footer>
    </LazyMotion>
  );
}
