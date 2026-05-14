"use client";

import { usePathname } from "next/navigation";
import SidebarItem from "./SidebarItem";
import UserProfile from "./UserProfile";

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="relative w-72 border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-gray-200 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
            N
          </div>

          <div>
            <h1 className="text-lg font-bold text-gray-900">
               Admin
            </h1>

            <p className="text-xs text-gray-500">
              Dashboard System
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Main Menu
        </p>

        <nav className="space-y-2">
          <SidebarItem title="Dashboard" active={pathname === "/admin"} link="/admin" />
          <SidebarItem title="Tokens" active={pathname === "/admin/token"} link="/admin/token" />
          <SidebarItem title="Market Tokens" active={pathname === "/admin/market-tokens"} link="/admin/market-tokens" />
          <SidebarItem title="Last Block" active={pathname === "/admin/last-block"} link="/admin/last-block" />
          <SidebarItem title="Settings" active={pathname === "/admin/settings"} link="/admin/settings" />
        </nav>
      </div>

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 w-full border-t border-gray-200 p-4">
        <UserProfile />
      </div>
    </aside>
  );
}