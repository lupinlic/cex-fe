"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

export interface TokenItem {
  id: string;
  asset: string;
  name: string;
  symbol: string;
}

export interface NetworkItem {
  id: string;
  network: {
    name: string;
    vmSystem: {
      name: string;
    };
  };
  feeWithdraw: string;
  feeWithdrawMin: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const API_BASE2 = process.env.NEXT_PUBLIC_API_URL2;

export function useGetTokens() {
  return useQuery<TokenItem[]>({
    queryKey: ["tokens"],
    queryFn: () => axiosInstance.get<TokenItem[]>(`${API_BASE}/tokens`).then((res) => res.data),
  });
}

export function useGetNetworks(id?: string) {
  return useQuery<NetworkItem[]>({
    queryKey: ["networks", id],
    queryFn: () => axiosInstance.get<NetworkItem[]>(`${API_BASE2}/token_network/getNetworks?token_id=${id}`).then((res) => res.data),
    enabled: !!id,
  });
}
