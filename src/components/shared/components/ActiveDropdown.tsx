"use client";
import { useState } from "react";
import React, { useEffect, useRef } from "react";

interface ActiveDropdownProps {
  trigger: React.ReactNode;
  children: (close: () => void) => React.ReactNode;
}
export default function ActiveDropdown({
  trigger,
  children,
}: ActiveDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);

  // Đóng khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center z-50" ref={dropdownRef}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div className="absolute top-7 left-[-10px] mt-2 bg-[#1E1F25] rounded-md shadow-lg z-50 p-2">
          {children(close)}
        </div>
      )}
    </div>
  );
}
