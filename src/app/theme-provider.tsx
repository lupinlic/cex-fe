"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Header } from "@/components/shared/components/Header";
import { Footer } from "@/components/shared/components/Footer";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <Header />
      <div className="pt-16">
      {children}
      </div>
      <Footer />
    </NextThemesProvider>
  );
}
