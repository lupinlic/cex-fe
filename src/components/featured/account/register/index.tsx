"use client";

import { Input } from "@/components/shared/ui/input";
import { Button } from "@/components/shared/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/shared/ui/tabs";
import { ChevronDown, KeyRound, Apple, Send } from "lucide-react";
import Link from "next/link";
import { useRegister } from "@/hooks/useRegister";

export default function RegisterPage() {
  const { formData, isLoading, error, setFormData, handleRegister } =
    useRegister();
  return (
    <div className="grid grid-cols-2 min-h-screen">
      {/* LEFT */}
      <div className="bg-background text-foreground flex flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold mb-4">Bắt đầu hành trình của bạn</h1>

        <p className="text-muted-foreground max-w-md mb-10 text-center">
          Tạo tài khoản để bắt đầu giao dịch tiền mã hóa một cách an toàn, nhanh
          chóng và tiện lợi.
        </p>

        <div className="w-[350px]">
          <img
            src="/images/login.webp"
            alt="preview"
            className="w-full rounded-xl"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center bg-background">
        <div className="w-[400px]">
          <h2 className="text-3xl font-bold mb-6 text-center">Đăng ký</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Phone */}
            <div className="flex gap-2 mb-4">
              <div className="flex items-center gap-1 border border-border rounded-md px-3 bg-muted">
                +84 <ChevronDown className="w-4 h-4" />
              </div>

              <Input
                placeholder="Số điện thoại"
                className="py-5"
                value={formData.phone}
                onChange={(e) => setFormData({ phone: e.target.value })}
              />
            </div>

            {/* Email */}
            <Input
              placeholder="Email"
              className="mb-4 py-5"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ email: e.target.value })}
              required
            />

            {/* Password */}
            <Input
              type="password"
              placeholder="Mật khẩu"
              className="mb-4 py-5"
              value={formData.password}
              onChange={(e) => setFormData({ password: e.target.value })}
              required
            />

            {/* Confirm password */}
            <Input
              type="password"
              placeholder="Xác nhận mật khẩu"
              className="mb-4 py-5"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ confirmPassword: e.target.value })}
              required
            />

            {/* Button */}
            <Button
              type="submit"
              className="w-full rounded-full mb-4 py-5 cursor-pointer hover:bg-primary/90 transition"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </form>

          {/* Login */}
          <p className="text-sm text-center mb-6 text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link
              href="/account/login"
              className="text-foreground font-medium underline hover:opacity-80"
            >
              Đăng nhập
            </Link>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">
              Hoặc đăng ký với
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="rounded-full flex items-center justify-center gap-2 py-5 hover:bg-muted transition"
            >
              <KeyRound className="w-4 h-4" />
              Passkey
            </Button>

            <Button
              variant="outline"
              className="rounded-full flex items-center justify-center gap-2 py-5 hover:bg-muted transition"
            >
              {/* Google */}
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.9 6.1 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.6 16 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.9 6.1 29.2 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.1C29.2 35.7 26.7 36.7 24 36.7c-5.2 0-9.6-3.5-11.2-8.2l-6.5 5C9.6 39.6 16.3 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.4 5.5-6.1 6.9l6.2 5.1C39.9 36.6 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z"
                />
              </svg>
              Google
            </Button>

            <Button
              variant="outline"
              className="rounded-full flex items-center justify-center gap-2 py-5 hover:bg-muted transition"
            >
              <Apple className="w-4 h-4" />
              Apple
            </Button>

            <Button
              variant="outline"
              className="rounded-full flex items-center justify-center gap-2 py-5 hover:bg-muted transition"
            >
              <Send className="w-4 h-4 text-sky-500" />
              Telegram
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
