"use client";

import { useAuth } from "@/hooks/use-auth";
import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  const { user } = useAuth();

  const router = useRouter();

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      localStorage.clear();

      window.dispatchEvent(
        new CustomEvent("auth-changed")
      );

      toast.success("Đăng xuất thành công");

      router.push("/account/login");
    } catch (error) {
      console.error(error);

      toast.error(
        "Có lỗi xảy ra khi đăng xuất"
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">
      {/* Search */}
      <div className="relative w-[400px]">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search anything..."
          className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white transition hover:bg-gray-100">
          <Bell size={18} />
        </button>

        <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white transition hover:bg-gray-100">
          <Settings size={18} />
        </button>

        {/* User Dropdown */}
        <div
          className="relative"
          ref={dropdownRef}
        >
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-2 shadow-sm transition hover:bg-gray-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
              {user?.username?.charAt(0) || "A"}
            </div>

            <div className="text-left">
              <h3 className="text-sm font-semibold text-gray-900">
                {user?.username || "Admin"}
              </h3>

              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>

            <ChevronDown
              size={18}
              className={`transition ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-16 w-60 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
              <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-100">
                <User size={18} />
                Profile
              </button>

              <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-100">
                <Settings size={18} />
                Settings
              </button>

              <div className="my-2 border-t border-gray-100" />

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogOut size={18} />

                {isLoggingOut
                  ? "Logging out..."
                  : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}