// AppSidebar.tsx - FULLY FIXED (copy langsung)
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
import api from "@/lib/axios";
import { logoutAdmin } from "@/lib/services/auth-service";
import { useRouter } from "next/navigation";

const NAV_MAIN: (NavItem & { adminOnly?: boolean })[] = [
  { title: "Dashboard", url: "/", icon: IconDashboard },
  { title: "Jadwal Kendaraan", url: "/jadwal", icon: IconCalendar },
  { title: "Form Peminjaman", url: "/form", icon: IconFile },
  { title: "Status Peminjaman", url: "/status", icon: IconHistory },
  { title: "Permintaan", url: "/permintaan", icon: IconDatabase, adminOnly: true },
  { title: "Laporan Peminjaman", url: "/laporan", icon: IconReport, adminOnly: true },
];

const DOCUMENTS: DocumentItem[] = [
  { name: "SOP Kendaraan", url: "/sop", icon: IconReport },
  { name: "Foto Kendaraan", url: "/foto", icon: IconPhoto },
  { name: "Jenis Kendaraan", url: "/jenis-kendaraan", icon: IconCar },
  { name: "Biaya Kendaraan", url: "/biaya", icon: IconCurrencyDollar },
  { name: "Kontak Admin", url: "/kontak", icon: IconHelp },
];

export default function AppSidebar(props: React.ComponentPropsWithRef<typeof Sidebar>) {
  const [user, setUser] = React.useState<Admin | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    api
      .get<{ user: Admin }>("/v1/adminbma/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try { await logoutAdmin(); } catch {}
    window.location.replace("/adminbma/login");  // ✅ FULL PAGE
  };

  if (loading) {
    return (
      <Sidebar {...props}>
        <SidebarHeader className="p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
        </SidebarHeader>
      </Sidebar>
    );
  }

  const filteredNavMain = NAV_MAIN.filter((item) =>
    item.adminOnly ? user?.role === "admin" : true  // ✅ NO ERROR
  );

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/">
              <SidebarMenuButton>
                <Image src="/Logo.png" alt="Logo" width={220} height={48} priority />
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavDocuments items={DOCUMENTS} />
        <NavSecondary items={[]} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        {user ? (
          <NavUser user={{ name: user.name, email: user.email }} onLogout={handleLogout} />
        ) : (
          <NavUser isGuest />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}