"use client";

import { useState } from "react";
import { usePost } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UseLoginReturn {
  // Form state
  formData: {
    email: string;
    password: string;
  };
  showPassword: boolean;

  // UI state
  activeTab: "phone" | "email" | "qr";
  isLoading: boolean;
  error: string | null;

  // Actions
  setFormData: (data: Partial<{ email: string; password: string }>) => void;
  setShowPassword: (show: boolean) => void;
  setActiveTab: (tab: "phone" | "email" | "qr") => void;
  handleLogin: (e: React.FormEvent) => void;
  resetError: () => void;
}

export function useLogin(): UseLoginReturn {
  const [formData, setFormDataState] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"phone" | "email" | "qr">("email");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Login mutation
  const loginMutation = usePost<LoginResponse, LoginRequest>("/auth/login", [], {
    onSuccess: (data) => {
      console.log("Login success - raw data:", data);
      console.log("Login success - data type:", typeof data);
      console.log("Login success - data keys:", data ? Object.keys(data) : "no keys");

      // Validate response structure
      if (!data || typeof data !== 'object') {
        console.error("Invalid response format:", data);
        toast.error("Phản hồi từ server không hợp lệ");
        return;
      }

      // Check if response has required fields
      if (!data.access_token || !data.user) {
        console.error("Missing required fields in response:", data);
        toast.error("Phản hồi từ server thiếu thông tin cần thiết");
        return;
      }

      // Save tokens to localStorage
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", "");
      localStorage.setItem("user", JSON.stringify(data.user));

      // Dispatch custom event to notify auth state change
      window.dispatchEvent(new CustomEvent('auth-changed'));

      // Reset error state
      setError(null);

      // Show success toast
      toast.success(`Chào mừng ${data.user.email}! Đăng nhập thành công.`);

      // Redirect to dashboard or home after a short delay to show toast
      setTimeout(() => {
        router.push("/");
      }, 1000);
    },
    onError: (error: any) => {
      console.error("Login failed - full error:", error);
      console.error("Login failed - error response:", error?.response);
      console.error("Login failed - error message:", error?.message);
      console.error("Login failed - error status:", error?.response?.status);

      // Show specific error message based on status
      if (error?.response?.status === 401) {
        toast.error("Email hoặc mật khẩu không đúng");
      } else if (error?.response?.status === 400) {
        toast.error("Dữ liệu không hợp lệ");
      } else if (error?.response?.status >= 500) {
        toast.error("Lỗi máy chủ, vui lòng thử lại sau");
      } else {
        toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }

      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    },
  });

  const setFormData = (data: Partial<{ email: string; password: string }>) => {
    setFormDataState(prev => ({
      ...prev,
      ...data
    }));
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email.trim()) {
      const errorMsg = activeTab === "phone" ? "Vui lòng nhập số điện thoại" : "Vui lòng nhập email";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (!formData.password.trim()) {
      const errorMsg = "Vui lòng nhập mật khẩu";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // For phone tab, we might want to validate phone format
    if (activeTab === "phone" && !/^\d{10,11}$/.test(formData.email.replace(/\D/g, ""))) {
      const errorMsg = "Số điện thoại không hợp lệ";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // For email tab, validate email format
    if (activeTab === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      const errorMsg = "Email không hợp lệ";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  const resetError = () => {
    setError(null);
  };

  return {
    // Form state
    formData,
    showPassword,

    // UI state
    activeTab,
    isLoading: loginMutation.isPending,
    error,

    // Actions
    setFormData,
    setShowPassword,
    setActiveTab,
    handleLogin,
    resetError,
  };
}