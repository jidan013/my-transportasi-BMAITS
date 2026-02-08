"use client";

import * as React from "react";
import {
  IconCalendar,
  IconCar,
  IconDashboard,
  IconDatabase,
  IconFile,
  IconHistory,
  IconReport,
  IconHelp,
  IconCurrencyDollar,
  IconPhoto,
} from "@tabler/icons-react";

import type { Admin } from "@/types/auth";
import type { NavItem, DocumentItem } from "@/types/navigation";

import { NavDocuments } from "@/components/home/navbar-document";
import { NavMain } from "@/components/home/navbar-main";
import { NavSecondary } from "@/components/home/navbar-second";
import { NavUser } from "@/components/home/navbar-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";


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

export default function AppSidebar(
  props: React.ComponentPropsWithRef<typeof Sidebar>
) {
  const [user, setUser] = React.useState<Admin | null>(null);
  const [loading, setLoading] = React.useState(true);


  React.useEffect(() => {
    api
      .get<Admin>("/v1/adminbma/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  const filteredNavMain = NAV_MAIN.filter((item) => {
    if (item.adminOnly) {
      return !!user && user.role === "admin";
    }
    return true;
  });

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
          <NavUser user={{ name: user.name, email: user.email }} />
        ) : (
          <div className="p-4 text-xs text-muted-foreground text-center">
            Guest
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}