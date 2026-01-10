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

import type { User } from "@/types/auth";

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
import Logo from "@/public/Logo.png";
import Link from "next/link";

import { getMe } from "@/lib/services/auth";


const NAV_MAIN = [
  { title: "Dashboard", url: "/", icon: IconDashboard },
  { title: "Jadwal Kendaraan", url: "/jadwal", icon: IconCalendar },
  { title: "Form Peminjaman", url: "/form", icon: IconFile },
  { title: "Status Peminjaman", url: "/status", icon: IconHistory },
  { title: "Permintaan", url: "/permintaan", icon: IconDatabase, role: "admin" },
  { title: "Laporan Peminjaman", url: "/laporan", icon: IconReport, role: "admin" },
];

const DOCUMENTS = [
  { name: "SOP Kendaraan", url: "/sop", icon: IconReport },
  { name: "Foto Kendaraan", url: "/foto", icon: IconPhoto },
  { name: "Jenis Kendaraan", url: "/jenis-kendaraan", icon: IconCar },
  { name: "Biaya Kendaraan", url: "/biaya", icon: IconCurrencyDollar },
  { name: "Kontak Admin", url: "/kontak", icon: IconHelp },
];


export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const filteredNavMain = React.useMemo(
    () =>
      NAV_MAIN.filter(
        (item) => !item.role || item.role === user?.role
      ),
    [user]
  );

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/">
              <SidebarMenuButton>
                <Image src={Logo} alt="Logo" width={250} height={50} />
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavDocuments items={DOCUMENTS} />
        <NavSecondary items={[]} className="mt-auto" />
      </SidebarContent>

      {/* Footer */}
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
