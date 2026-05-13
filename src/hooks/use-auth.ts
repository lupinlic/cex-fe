"use client";

import { useState, useEffect, useCallback } from "react";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshAuth = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  if (typeof window === "undefined") {
    return {
      user: null,
      isLoggedIn: false,
      refreshAuth,
    };
  }

  useEffect(() => {
    const User = localStorage.getItem("user");

    if (User) {
      try {
        setUser(JSON.parse(User));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [refreshTrigger]);

  // Listen for auth changes (login/logout)
  useEffect(() => {
    const handleAuthChange = () => {
      refreshAuth();
    };

    window.addEventListener("auth-changed", handleAuthChange);
    return () => window.removeEventListener("auth-changed", handleAuthChange);
  }, [refreshAuth]);

  return {
    user,
    isLoggedIn: !!user,
    refreshAuth,
  };
}