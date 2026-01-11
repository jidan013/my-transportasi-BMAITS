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
   NAV CONFIG
===================== */
export const NAV_MAIN: NavItem[] = [
  { title: "Dashboard", url: "/", icon: IconDashboard },
  { title: "Jadwal Kendaraan", url: "/jadwal", icon: IconCalendar },
  { title: "Form Peminjaman", url: "/form", icon: IconFile },
  { title: "Status Peminjaman", url: "/status", icon: IconHistory },
  { title: "Permintaan", url: "/permintaan", icon: IconDatabase, role: "admin" },
  { title: "Laporan Peminjaman", url: "/laporan", icon: IconReport, role: "admin" },
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
    getAdminMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const filteredNavMain = React.useMemo((): NavItem[] => {
    if (!user || user.role !== "admin") {
      return NAV_MAIN.filter(item => !item.role);
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
        {user && (
          <NavUser
            user={{
              name: user.name,
              email: user.email,
              avatar: user.avatar ?? "/avatars/default.png",
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
