import { type ComponentType } from "react";

/* =====================
   Shared Icon Props
===================== */
export type TablerIconProps = {
  size?: number | string;
  stroke?: number;
  className?: string;
};

/* =====================
   Role
===================== */
export type NavRole = "admin";

/* =====================
   Navigation Item
===================== */
export interface NavItem {
  title: string;
  url: string;
  icon: ComponentType<TablerIconProps>;
  role?: NavRole;
}

/* =====================
   Document Item
===================== */
export interface DocumentItem {
  name: string;
  url: string;
  icon: ComponentType<TablerIconProps>;
}

/* =====================
   User Props
===================== */
export interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar?: string | null;
  };
}
