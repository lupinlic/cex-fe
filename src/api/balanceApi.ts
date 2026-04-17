"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface DepositHistoryItem {
  id: string;
  amount: string;
  token: {
    asset: string;
  };
  excuAddress: string;
  createdAt: string;
  status: "confirmed" | "pending" | "failed";
}

const fakeDepositHistory: DepositHistoryItem[] = [
  {
    id: "dh-1",
    amount: "0.035",
    token: { asset: "BTC" },
    excuAddress: "bc1qfakeaddress1234567890",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: "confirmed",
  },
  {
    id: "dh-2",
    amount: "12.5",
    token: { asset: "USDT" },
    excuAddress: "0xFAKEUSDTADDRESS12345",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: "pending",
  },
  {
    id: "dh-3",
    amount: "1.82",
    token: { asset: "ETH" },
    excuAddress: "0xFAKEETHADDRESS67890",
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    status: "failed",
  },
];

export function useGetDepositHistory() {
  const [data, setData] = useState<DepositHistoryItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<number | null>(null);

  const loadHistory = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    setIsLoading(true);
    timerRef.current = window.setTimeout(() => {
      setData([...fakeDepositHistory]);
      setIsLoading(false);
      timerRef.current = null;
    }, 150);
  }, []);

  useEffect(() => {
    loadHistory();
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [loadHistory]);

  return { data, isLoading, refetch: loadHistory };
}

interface UseDepositParams {
  user_id: string;
  vm_name: string;
}

export function useDeposit(params: UseDepositParams) {
  const [data, setData] = useState<{ address: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<number | null>(null);

  const createAddress = useCallback(() => {
    if (!params.user_id || !params.vm_name) {
      setData(null);
      setLoading(false);
      return;
    }

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    setLoading(true);
    timerRef.current = window.setTimeout(() => {
      const prefix = params.vm_name.slice(0, 3).toUpperCase();
      const suffix = params.user_id.slice(-4) || "0000";
      setData({ address: `${prefix}-${suffix}-${Math.random().toString(16).slice(2, 10).toUpperCase()}` });
      setLoading(false);
      timerRef.current = null;
    }, 300);
  }, [params.user_id, params.vm_name]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { data, refetch: createAddress, loading };
}

export interface WithdrawHistoryItem {
  id: string;
  amount: string;
  token: {
    asset: string;
  };
  excuAddress: string;
  txHash: string;
  createdAt: string;
  status: "confirmed" | "pending" | "failed";
}

const fakeWithdrawHistory: WithdrawHistoryItem[] = [
  {
    id: "wh-1",
    amount: "0.120",
    token: { asset: "ETH" },
    excuAddress: "0xWITHDRAWADDRESS12345",
    txHash: "0xTXHASHFAKE123",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: "confirmed",
  },
  {
    id: "wh-2",
    amount: "100",
    token: { asset: "USDT" },
    excuAddress: "0xUSDTWITHDRAW67890",
    txHash: "0xTXHASHFAKE456",
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    status: "pending",
  },
  {
    id: "wh-3",
    amount: "0.005",
    token: { asset: "BTC" },
    excuAddress: "bc1qwithdrawfake0000",
    txHash: "0xTXHASHFAKE789",
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    status: "failed",
  },
];

export function useGetWithdrawHistory() {
  const [data, setData] = useState<WithdrawHistoryItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<number | null>(null);

  const loadHistory = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    setIsLoading(true);
    timerRef.current = window.setTimeout(() => {
      setData([...fakeWithdrawHistory]);
      setIsLoading(false);
      timerRef.current = null;
    }, 150);
  }, []);

  useEffect(() => {
    loadHistory();
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [loadHistory]);

  return { data, isLoading, refetch: loadHistory };
}

interface WithdrawParams {
  network_id: string;
  token_id: string;
  to_address: string;
  amount: string;
}

export function useWithDraw() {
  return useCallback((params: WithdrawParams) => {
    return new Promise<{ status: "confirmed" | "pending" | "failed"; txHash: string }>((resolve) => {
      window.setTimeout(() => {
        const hash = `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
        resolve({ status: "confirmed", txHash: hash });
      }, 400);
    });
  }, []);
}
