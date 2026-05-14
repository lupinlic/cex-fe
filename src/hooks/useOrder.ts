'use client';

import { useGet, usePost } from './useApi';

export function usePlaceOrder() {
  return usePost('/orders', [
    ['balances'] as const,
    ['orders', 'open'] as const,
    ['orders', 'history'] as const,
  ]);
}

export interface OrderSnapshotItem {
  id: string;
  side: 'BUY' | 'SELL';
  price: string;
  quantity: string;
  filled_quote_quantity: string;
  quote_quantity: string;
}

export interface OrderHistoryItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP' | string;
  price: string;
  quantity: string;
  quote_quantity: string;
  filled_quantity: string;
  filled_quote_quantity: string;
  avg_price: string;
  status: 'NEW' | 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELLED' | 'REJECTED' | string;
  client_order_id: string;
  time_in_force: string | null;
  stop_price: string | null;
  post_only: boolean;
}

export function useBalances() {
  return useGet('/balances', ['balances'] as const);
}

export function useOpenOrders(marketTokenId?: string) {
  const queryKey = marketTokenId 
    ? ['orders', 'open', marketTokenId] as const 
    : ['orders', 'open'] as const;
  return useGet(`/orders/open${marketTokenId ? `?marketToken_id=${marketTokenId}` : ''}`, queryKey);
}

export interface CloseOrderPayload {
  order_id: string;
  marketToken_id: string;
}

export function useOrderSnapshot(marketTokenId?: string) {
  const queryKey = marketTokenId
    ? ['orders', 'snapshot', marketTokenId] as const
    : ['orders', 'snapshot'] as const;

  return useGet<OrderSnapshotItem[]>(
    `/orders/snapshot${marketTokenId ? `?marketToken_id=${marketTokenId}` : ''}`,
    queryKey,
    {
      staleTime: 30 * 1000,
      refetchInterval: 30 * 1000,
    }
  );
}

export function useCloseOrder() {
  return usePost<any, CloseOrderPayload>('/orders/closeOrder');
}

export function useOrderHistory(marketTokenId?: string) {
  const queryKey = marketTokenId 
    ? ['orders', 'history', marketTokenId] as const 
    : ['orders', 'history'] as const;
  return useGet<OrderHistoryItem[]>(
    `/orders/history${marketTokenId ? `?marketToken_id=${marketTokenId}` : ''}`,
    queryKey,
    {
      staleTime: 30 * 1000,
      refetchInterval: 30 * 1000,
    }
  );
}

export function useLedger(assetToken?: string) {
  const queryKey = assetToken ? ['ledger', assetToken] as const : ['ledger'] as const;
  const queryString = assetToken
    ? `?walletType=SPOT&assetToken=${assetToken.slice(0, -4).toUpperCase()}`
    : '?walletType=SPOT';

  return useGet(`/ledger${queryString}`, queryKey, {
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}