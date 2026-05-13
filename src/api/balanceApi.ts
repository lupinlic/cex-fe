"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { axiosInstance } from '@/lib/axios';

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

export function useGetDepositHistory() {
  const [data, setData] = useState<DepositHistoryItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<DepositHistoryItem[]>('/transactions/deposits');
      setData(response.data);
    } catch (error) {
      console.error('Failed to load deposit history', error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
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
  status: "confirmed" | "pending" | "failed" | "broadcasted";
}

export function useGetWithdrawHistory() {
  const [data, setData] = useState<WithdrawHistoryItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<WithdrawHistoryItem[]>('/transactions/withdrawals');
      setData(response.data);
    } catch (error) {
      console.error('Failed to load withdraw history', error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return { data, isLoading, refetch: loadHistory };
}

interface WithdrawParams {
  network_id: string;
  token_id: string;
  to_address: string;
  amount: string;
}

export interface WithdrawFeeParams {
  network_id: string;
  token_id: string;
  to_address: string;
  amount: string;
}

export interface WithdrawFeeResponse {
  gasPrice: string;
  gasLimit: string;
  fee: string;
}

export function useCalculateWithdrawFee() {
  const [isLoading, setIsLoading] = useState(false);
  const [feeData, setFeeData] = useState<WithdrawFeeResponse | null>(null);

  const calculateFee = useCallback(async (params: WithdrawFeeParams) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post<WithdrawFeeResponse>('/withdraw/caculaterFee', params);
      setFeeData(response.data);
      return response.data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { calculateFee, feeData, isLoading };
}

export function useWithDraw() {
  return useCallback((params: WithdrawParams) => {
    return axiosInstance
      .post<{
        withdrawalId: string;
        txHash: string;
        amount: string;
        fee: string;
        tokenId: string;
        networkId: string;
        status: 'pending' | 'broadcasted' | 'confirmed' | 'failed';
        type: string;
      }>('/withdraw', params)
      .then((res) => res.data);
  }, []);
}
