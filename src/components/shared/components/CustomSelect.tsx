"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CustomSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  label,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-sm text-gray-400 mb-2">{label}</label>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex justify-between items-center w-full px-4 py-3 rounded-lg bg-background border border-gray-700 hover:border-gray-500 transition-all text-foreground text-sm"
      >
        {value || "Chọn..."}
        <ChevronDown
          className={`w-4 h-4 ml-2 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-background border border-gray-700 rounded-lg shadow-lg max-h-56 overflow-y-auto">
          {options.map((option,id) => (
            <div
              key={id}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer text-sm text-foreground  hover:bg-primary hover:text-primary-foreground ${
                option === value ? " text-gray-600" : ""
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

CustomSelect.displayName = "CustomSelect";

export default CustomSelect;
