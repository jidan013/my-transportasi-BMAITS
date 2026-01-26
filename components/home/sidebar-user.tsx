"use client";

import * as React from "react";
import {
  IconCalendar, IconCar, IconDashboard, IconDatabase, 
  IconFile, IconHistory, IconReport, IconHelp, 
  IconCurrencyDollar, IconPhoto,
} from "@tabler/icons-react";

import type { Admin } from "@/types/auth";
import type { NavItem, DocumentItem } from "@/types/navigation";

import { NavDocuments } from "@/components/home/navbar-document";
import { NavMain } from "@/components/home/navbar-main";
import { NavSecondary } from "@/components/home/navbar-second";
import { NavUser } from "@/components/home/navbar-user";

import {
  Sidebar, SidebarContent, SidebarFooter, 
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";

import Image from "next/image";
import Logo from "@/public/Logo.png";
import Link from "next/link";
import { getAdminMe } from "@/lib/services/auth-service";

/* =====================
   NAV CONFIG - DENGAN ROLE
===================== */
export const NAV_MAIN: (NavItem & { role?: 'admin' })[] = [
  { title: "Dashboard", url: "/", icon: IconDashboard },
  { title: "Jadwal Kendaraan", url: "/jadwal", icon: IconCalendar },
  { title: "Form Peminjaman", url: "/form", icon: IconFile },
  { title: "Status Peminjaman", url: "/status", icon: IconHistory },
  { title: "Permintaan", url: "/permintaan", icon: IconDatabase, },
  { title: "Laporan Peminjaman", url: "/laporan", icon: IconReport, },
];

export const DOCUMENTS: DocumentItem[] = [
  { name: "SOP Kendaraan", url: "/sop", icon: IconReport },
  { name: "Foto Kendaraan", url: "/foto", icon: IconPhoto },
  { name: "Jenis Kendaraan", url: "/jenis-kendaraan", icon: IconCar },
  { name: "Biaya Kendaraan", url: "/biaya", icon: IconCurrencyDollar },
  { name: "Kontak Admin", url: "/kontak", icon: IconHelp },
];

/* =====================
   COMPONENT
===================== */
export function AppSidebar(props: React.ComponentPropsWithRef<typeof Sidebar>) {
  const [user, setUser] = React.useState<Admin | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const token = localStorage.getItem("admin_token");
    
    if (!token) {
      setLoading(false);
      return;
    }

    getAdminMe()
      .then(setUser)
      .catch((err) => {
        console.error("Failed to fetch admin:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          document.cookie = "admin_token=; path=/; max-age=0";
          window.location.href = "/adminbma/login";
        }
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // FILTER MENU BERDASARKAN ROLE ADMIN
  const filteredNavMain = React.useMemo((): NavItem[] => {
    if (!user || user.role !== "admin") {
      // Hilangkan menu dengan role='admin'
      return NAV_MAIN.filter(item => !item.role || item.role !== 'admin');
    }
    return NAV_MAIN;
  }, [user]);

  if (loading) return null;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/">
              <SidebarMenuButton>
                <Image src={Logo} alt="Logo" width={220} height={48} priority />
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
          <NavUser
            user={{
              name: user.name,
              email: user.email,
              avatar: user.avatar ?? "/avatars/default.png",
            }}
          />
        ) : (
          <div className="p-4 text-xs text-muted-foreground text-center">
            USER
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
