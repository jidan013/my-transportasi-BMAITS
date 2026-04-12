"use client";

import * as React from "react";
import {
  IconCalendar, IconCar, IconDashboard, IconDatabase,
  IconFile, IconHistory, IconReport, IconHelp,
  IconCurrencyDollar, IconPhoto
} from "@tabler/icons-react";

import type { Admin } from "@/types/auth";
import type { NavItem, DocumentItem } from "@/types/navigation";

import { NavDocuments } from "@/components/home/navbar-document";
import { NavMain } from "@/components/home/navbar-main";
import { NavSecondary } from "@/components/home/navbar-second";
import { NavUser } from "@/components/home/navbar-user";

import {
  Sidebar, SidebarContent, SidebarFooter,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem
} from "@/components/ui/sidebar";

import Image from "next/image";
import Link from "next/link";
import { getAdminMe, logoutAdmin } from "@/lib/services/auth-service";

const NAV_PUBLIC: NavItem[] = [
  { title: "Dashboard",         url: "/",         icon: IconDashboard },
  { title: "Jadwal Kendaraan",  url: "/jadwal",  icon: IconCalendar  },
  { title: "Form Peminjaman",   url: "/form",    icon: IconFile      },
  { title: "Status Peminjaman", url: "/status",  icon: IconHistory   },
];

const NAV_ADMIN: NavItem[] = [
  { title: "Permintaan",         url: "/permintaan", icon: IconDatabase },
  { title: "Laporan Peminjaman", url: "/laporan",    icon: IconReport   },
];

const DOCUMENTS: DocumentItem[] = [
  { name: "SOP Kendaraan",   url: "/sop",             icon: IconReport         },
  { name: "Foto Kendaraan",  url: "/foto",            icon: IconPhoto          },
  { name: "Jenis Kendaraan", url: "/jenis-kendaraan", icon: IconCar            },
  { name: "Biaya Kendaraan", url: "/biaya",           icon: IconCurrencyDollar },
  { name: "Kontak Admin",    url: "/kontak",          icon: IconHelp           },
];

export default function AppSidebar(props: React.ComponentPropsWithRef<typeof Sidebar>) {
  const [admin, setAdmin] = React.useState<Admin | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find(row => row.startsWith("token="))
      ?.split("=")[1];

    // Tidak ada token → guest, skip hit API
    if (!token) {
      setLoading(false);
      return;
    }

    // Ada token → ambil data admin dari BE
    getAdminMe()
      .then((data) => setAdmin(data))
      .catch(() => {
        // Token invalid → hapus cookie, tetap sebagai guest
        document.cookie = "token=; Path=/; Max-Age=0; SameSite=Lax";
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []); // Dependency array kosong — hanya jalan sekali

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch {
      // clearAuth() di finally auth-service sudah hapus cookie
    } finally {
      window.location.replace("/adminbma/login");
    }
  };

  if (loading) {
    return (
      <Sidebar {...props}>
        <SidebarHeader className="p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto" />
        </SidebarHeader>
      </Sidebar>
    );
  }

  // Admin login → NAV_PUBLIC + NAV_ADMIN (Permintaan & Laporan)
  // Guest      → NAV_PUBLIC saja
  const navItems = admin
    ? [...NAV_PUBLIC, ...NAV_ADMIN]
    : NAV_PUBLIC;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/adminbma/dashboard">
              <SidebarMenuButton>
                <Image
                  src="/Logo.png"
                  alt="Logo"
                  width={220}
                  height={48}
                  style={{ width: "auto", height: "auto" }} // ✅ Fix warning Next.js Image
                  priority
                />
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
        <NavDocuments items={DOCUMENTS} />
        <NavSecondary items={[]} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={admin} onLogout={handleLogout} />
      </SidebarFooter>
    </Sidebar>
  );
}