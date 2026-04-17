"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface HoverDropdownProps {
  trigger: ReactNode;
  content: ReactNode;
  className?: string;
  showArrow?: boolean;
}

export function HoverDropdown({
  trigger,
  content,
  className,
  showArrow = false,
}: HoverDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <div className="flex items-center gap-1 cursor-pointer">
        <span className="hover:text-primary transition">{trigger}</span>

        {showArrow && (
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        )}
      </div>
      {/* Dropdown */}
      <div
        className={cn(
          "absolute z-999999 left-0 top-full mt-2 min-w-[250px] rounded-sm border border-border bg-white p-3 shadow-md transition-all duration-200",
          open
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-2 invisible",
          className,
        )}
      >
        {content}
      </div>
    </div>
  );
}
