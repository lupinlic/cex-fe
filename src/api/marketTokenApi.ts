"use client";

import { useQuery } from "@tanstack/react-query";
import { usePost } from "@/hooks/useApi";
import { axiosInstance } from "@/lib/axios";

export interface MarketTokenItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  symbol: string;
  isActive: boolean;
}

export interface CreateMarketTokenPayload {
  baseAsset: string;
  quoteAsset: string;
}

export interface ActivateMarketTokenPayload {
  symbol: string;
  initPrice: string;
  isActive: string;
}

export function useGetMarketTokens() {
  return useQuery<MarketTokenItem[]>({
    queryKey: ["market-tokens"],
    queryFn: () => axiosInstance.get<MarketTokenItem[]>("/market-tokens").then((res) => res.data),
  });
}

export function useCreateMarketToken() {
  return usePost<MarketTokenItem, CreateMarketTokenPayload>("/market-tokens");
}

export function useActivateMarketToken() {
  return usePost<MarketTokenItem, ActivateMarketTokenPayload>("/market-tokens/active");
}
