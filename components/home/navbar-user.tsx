"use client";

import { IconDotsVertical, IconLogout } from "@tabler/icons-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { toast } from "sonner";  
import type { Admin } from "@/types/auth";

export function NavUser({
  user,
  onLogout,
}: {
  user: Admin | null;
  onLogout?: () => void;
}) {
  const { isMobile } = useSidebar();

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "G";


  const handleLogout = async () => {
 
  const toastId = toast.loading("Sedang keluar...", {
    description: "Mohon tunggu sebentar.",
  });

  try {
    await onLogout?.();

    
    toast.success("Logout berhasil", {
      id: toastId,
      description: "Anda telah keluar dari sistem.",
    });
  } catch {
    
    toast.error("Logout gagal", {
      id: toastId,
      description: "Terjadi kesalahan, coba lagi.",
    });
  }
};

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-slate-300 text-slate-700 font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.email ?? "Tamu"}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {user ? "Administrator" : "Guest"}
                </span>
              </div>

              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-slate-300 text-slate-700">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.email ?? "Tamu"}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user ? "Administrator" : "Guest"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {user ? (
              <DropdownMenuItem
                onClick={handleLogout}  
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <IconLogout className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            ) : (
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                Anda mengakses sebagai tamu
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}