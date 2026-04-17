"use client";

import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  children: ReactNode;
  dropdown?: ReactNode;
}

export function MenuItem({ children, dropdown }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative flex items-center gap-1 cursor-pointer"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Label */}
      <span className="hover:text-primary transition">
        {children}
      </span>

      {/* Arrow */}
      {dropdown && (
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      )}

      {/* Dropdown */}
      {open && dropdown}
    </div>
  );
}