"use client"

import * as React from "react"
import {
    IconBook,
  IconCalendar,
  IconCamera,
  IconCar,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFile,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconHistory,
  IconReport,
  IconSearch,
  IconSettings,
  IconCurrencyDollar,
  IconPhoto
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/home/navbar-document"
import { NavMain } from "@/components/home/navbar-main"
import { NavSecondary } from "@/components/home/navbar-second"
import { NavUser } from "@/components/home/navbar-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import Image from "next/image"
import Logo from "@/public/Logo.png"
import Link from "next/link"

const data = {
  user: {
    name: "Mr. Amir Montero",
    email: "amir@its.ac.id",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Dashboard", url: "#", icon: IconDashboard },
    { title: "Form Peminjaman", url: "#", icon: IconFile },
    { title: "Riwayat Peminjaman", url: "#", icon: IconHistory },
    { title: "SOP", url: "#", icon: IconBook },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        { title: "Active Proposals", url: "#" },
        { title: "Archived", url: "#" },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        { title: "Active Proposals", url: "#" },
        { title: "Archived", url: "#" },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        { title: "Active Proposals", url: "#" },
        { title: "Archived", url: "#" },
      ],
    },
  ],
  navSecondary: [
    { title: "Settings", url: "#", icon: IconSettings },
  ],
  documents: [
    { name: "Jenis Kendaraan", url: "#", icon: IconCar },
    { name: "SOP Kendaraan", url: "#", icon: IconReport },
    { name: "Jadwal Kendaraan", url: "#", icon: IconCalendar },
    { name: "Biaya Kendaraan", url: "#", icon: IconCurrencyDollar },
    { name: "Foto Kendaraan", url: "#", icon: IconPhoto },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* === Header (Logo) === */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="p-1.5">
              <Link href="#">
                <Image
                  src={Logo}
                  alt="Logo"
                  width={250}
                  height={50}
                  className="py-2 px-2 rounded-full"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* === Sidebar Content === */}
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      {/* === Footer (User Info) === */}
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar