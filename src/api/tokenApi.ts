"use client";

import { useEffect, useState } from "react";

export interface TokenItem {
  id: string;
  asset: string;
  name: string;
  symbol: string;
}

export const fakeTokenList: TokenItem[] = [
  { id: "1", asset: "USDT", name: "Tether", symbol: "USDT" },
  { id: "2", asset: "BTC", name: "Bitcoin", symbol: "BTC" },
  { id: "3", asset: "ETH", name: "Ethereum", symbol: "ETH" },
  { id: "4", asset: "BUSD", name: "Binance USD", symbol: "BUSD" },
  { id: "5", asset: "LTC", name: "Litecoin", symbol: "LTC" },
  { id: "6", asset: "XRP", name: "Ripple", symbol: "XRP" },
];

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

const fakeNetworkLists: Record<string, NetworkItem[]> = {
  "1": [
    {
      id: "usdt-eth",
      network: { name: "Ethereum", vmSystem: { name: "EVM" } },
      feeWithdraw: "1.0",
      feeWithdrawMin: "10",
    },
    {
      id: "usdt-bsc",
      network: { name: "BSC", vmSystem: { name: "EVM" } },
      feeWithdraw: "0.5",
      feeWithdrawMin: "5",
    },
  ],
  "2": [
    {
      id: "btc-bitcoin",
      network: { name: "Bitcoin", vmSystem: { name: "BTC" } },
      feeWithdraw: "0.0005",
      feeWithdrawMin: "0.001",
    },
  ],
  "3": [
    {
      id: "eth-eth",
      network: { name: "Ethereum", vmSystem: { name: "EVM" } },
      feeWithdraw: "0.01",
      feeWithdrawMin: "0.02",
    },
    {
      id: "eth-arb",
      network: { name: "Arbitrum", vmSystem: { name: "EVM" } },
      feeWithdraw: "0.005",
      feeWithdrawMin: "0.01",
    },
  ],
  "4": [
    {
      id: "busd-bsc",
      network: { name: "BSC", vmSystem: { name: "EVM" } },
      feeWithdraw: "0.5",
      feeWithdrawMin: "5",
    },
    {
      id: "busd-polygon",
      network: { name: "Polygon", vmSystem: { name: "EVM" } },
      feeWithdraw: "0.25",
      feeWithdrawMin: "2",
    },
  ],
  "5": [
    {
      id: "ltc-main",
      network: { name: "Litecoin", vmSystem: { name: "LTC" } },
      feeWithdraw: "0.001",
      feeWithdrawMin: "0.01",
    },
  ],
  "6": [
    {
      id: "xrp-main",
      network: { name: "Ripple", vmSystem: { name: "XRP" } },
      feeWithdraw: "0.2",
      feeWithdrawMin: "1",
    },
  ],
};

export function useGetTokens() {
  const [data, setData] = useState<TokenItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(fakeTokenList);
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
}

export function useGetNetworks(coinId: string) {
  const [data, setData] = useState<NetworkItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(coinId ? fakeNetworkLists[coinId] ?? [] : []);
      setIsLoading(false);
    }, 120);

    return () => clearTimeout(timer);
  }, [coinId]);

  return { data, isLoading };
}
