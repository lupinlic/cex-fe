import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({
  open,
  onClose,
  children,
  className = "",
}: ModalProps) {
  if (!open) return null;

  return (
    <>
      {/* Nền mờ */}
      <div
        className="fixed inset-0 backdrop-blur-[0.1px] bg-black/50 z-40"
        onClick={onClose}
      ></div>

      {/* Khung modal */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#202229] rounded-lg  z-50 shadow-lg ${className}`}
      >
        {children}
      </div>
    </>
  );
}
