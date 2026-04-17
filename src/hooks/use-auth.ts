"use client";

import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  if (typeof window === "undefined") {
    return {
      user: null,
      isLoggedIn: false,
    };
  }

  useEffect(() => {
    const User = localStorage.getItem("user");

    if (User) {
      setUser(JSON.parse(User));
    }
  }, []);

  return {
    user,
    isLoggedIn: !!user,
  };
}