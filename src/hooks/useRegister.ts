"use client";

import { useState } from "react";
import { usePost } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  sucess: boolean;
  message?: string;
}

export interface UseRegisterReturn {
  // Form state
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
  };

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  setFormData: (data: Partial<{ email: string; password: string; confirmPassword: string; phone: string }>) => void;
  handleRegister: (e: React.FormEvent) => void;
  resetError: () => void;
}

export function useRegister(): UseRegisterReturn {
  const [formData, setFormDataState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Register mutation
  const registerMutation = usePost<RegisterResponse, RegisterRequest>("/auth/register", [], {
    onSuccess: (data) => {
      console.log("Register success - raw data:", data);

      // Validate response structure
      if (!data || typeof data !== 'object') {
        console.error("Invalid response format:", data);
        toast.error("Phản hồi từ server không hợp lệ");
        return;
      }

      // Check if registration was successful
      if (data.sucess) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        router.push("/account/login");
      } else {
        // Handle specific error messages from backend
        const errorMessage = data.message || "Đăng ký thất bại";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    },
    onError: (error) => {
      console.error("Register error:", error);

      // Handle specific error messages
      let errorMessage = "Đăng ký thất bại";
      if (error.status === 500) {
        errorMessage = "Tài khoản đã tồn tại hoặc lỗi máy chủ";
      } else if (error.message?.includes("User already exists")) {
        errorMessage = "Tài khoản đã tồn tại";
      } else if (error.message?.includes("Invalid")) {
        errorMessage = "Dữ liệu không hợp lệ";
      }

      setError(errorMessage);
      toast.error(errorMessage);
    },
  });

  const setFormData = (data: Partial<{ email: string; password: string; confirmPassword: string; phone: string }>) => {
    setFormDataState(prev => ({ ...prev, ...data }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email không hợp lệ");
      return;
    }

    try {
      // Only send email and password to API
      await registerMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });
    } catch (err) {
      // Error is handled in onError callback
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    formData,
    isLoading: registerMutation.isPending,
    error,
    setFormData,
    handleRegister,
    resetError,
  };
}