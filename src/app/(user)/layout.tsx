import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "../theme-provider";

export const metadata: Metadata = {
  title: "Trang người dùng",
};

export default function UserLayout({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
