'use client';

import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  UseQueryOptions,
  UseMutationOptions,
  UseInfiniteQueryOptions,
  QueryKey,
} from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { AxiosError } from 'axios';

/**
 * Generic query hook for fetching data
 * Usage: useGet('/users/123', ['user', '123'])
 */
export function useGet<T = any>(
  url: string,
  queryKey: QueryKey,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, Error>({
    queryKey,
    queryFn: () => axiosInstance.get<T>(url).then((res: any) => res.data),
    ...options,
  });
}

/**
 * Generic mutation hook for creating/updating/deleting data
 * Usage: const mutation = usePost('/users', ['users'])
 *        mutation.mutate({ name: 'John' })
 */
export function usePost<T = any, V = any>(
  url: string,
  invalidateKeys?: QueryKey[],
  options?: UseMutationOptions<T, AxiosError, V>
) {
  return useMutation<T, AxiosError, V>({
    mutationFn: (data) => axiosInstance.post<T>(url, data).then((res: any) => res.data),
    ...options,
  });
}

/**
 * Generic mutation hook for updating data
 */
export function usePut<T = any, V = any>(
  url: string,
  invalidateKeys?: QueryKey[],
  options?: UseMutationOptions<T, AxiosError, V>
) {
  return useMutation<T, AxiosError, V>({
    mutationFn: (data) => axiosInstance.put<T>(url, data).then((res: any) => res.data),
    ...options,
  });
}

/**
 * Generic mutation hook for patching data
 */
export function usePatch<T = any, V = any>(
  url: string,
  invalidateKeys?: QueryKey[],
  options?: UseMutationOptions<T, AxiosError, V>
) {
  return useMutation<T, AxiosError, V>({
    mutationFn: (data) => axiosInstance.patch<T>(url, data).then((res: any) => res.data),
    ...options,
  });
}

/**
 * Generic mutation hook for deleting data
 */
export function useDelete<T = any>(
  url: string,
  invalidateKeys?: QueryKey[],
  options?: UseMutationOptions<T, AxiosError, void>
) {
  return useMutation<T, AxiosError, void>({
    mutationFn: () => axiosInstance.delete<T>(url).then((res: any) => res.data),
    ...options,
  });
}

/**
 * Generic hook for pagination
 * Usage: const { data, hasNextPage, fetchNextPage } = usePaginated('/users?page=1', ['users'])
 */
export function usePaginated<T = any>(
  baseUrl: string,
  queryKey: QueryKey,
  options?: Omit<UseInfiniteQueryOptions<T>, 'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'>
) {
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) =>
      axiosInstance.get<T>(`${baseUrl}&page=${pageParam}`).then((res: any) => res.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) =>
      lastPage?.hasNextPage ? lastPage.nextPage : undefined,
    ...options,
  });
}

/**
 * Example domain-specific hooks
 * Customize based on your API structure
 */

// User hooks
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export function useGetUser(userId: string) {
  return useGet<User>(
    `/users/${userId}`,
    ['user', userId],
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
}

export function useGetUsers(params?: Record<string, any>) {
  const queryString = params ? new URLSearchParams(params).toString() : '';
  return useGet<{ data: User[]; total: number }>(
    `/users${queryString ? `?${queryString}` : ''}`,
    ['users', params]
  );
}

export function useCreateUser() {
  return usePost<User, Partial<User>>(`/users`);
}

export function useUpdateUser(userId: string) {
  return usePut<User, Partial<User>>(`/users/${userId}`);
}

export function useDeleteUser(userId: string) {
  return useDelete(`/users/${userId}`);
}

// Balance hooks
export interface Balance {
  asset: string;
  available: number;
  locked: number;
  reserved: number;
}

export function useGetBalances() {
  return useGet<Balance[]>(
    '/balances',
    ['balances'],
    {
      staleTime: 2 * 60 * 1000, // 2 minutes - balance data changes frequently
      refetchInterval: 30 * 1000, // Refetch every 30 seconds
    }
  );
}

export function useGetBalance(asset: string) {
  return useGet<Balance>(
    `/balances/${asset}`,
    ['balance', asset],
    {
      staleTime: 1 * 60 * 1000, // 1 minute
      refetchInterval: 30 * 1000,
    }
  );
}

export function useTransferBalance() {
  return usePost<void, {
    fromWallet: string;
    toWallet: string;
    asset: string;
    amount: number;
  }>('/balances/transfer');
}

// Order hooks
export interface Order {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  filled: number;
  status: string;
  createdAt: string;
}

export function useGetOrders(params?: Record<string, any>) {
  const queryString = params ? new URLSearchParams(params).toString() : '';
  return useGet<{ data: Order[]; total: number }>(
    `/orders${queryString ? `?${queryString}` : ''}`,
    ['orders', params],
    {
      staleTime: 1 * 60 * 1000,
      refetchInterval: 10 * 1000, // Refetch every 10 seconds for order status updates
    }
  );
}

export function useGetOrder(orderId: string) {
  return useGet<Order>(
    `/orders/${orderId}`,
    ['order', orderId],
    {
      staleTime: 30 * 1000,
      refetchInterval: 5 * 1000,
    }
  );
}

export function useCreateOrder() {
  return usePost<Order, {
    symbol: string;
    side: 'BUY' | 'SELL';
    price: number;
    quantity: number;
  }>('/orders');
}

export function useCancelOrder(orderId: string) {
  return useDelete(`/orders/${orderId}`);
}

// Position hooks (for futures)
export interface Position {
  id: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  pnlPercent: number;
}

export function useGetPositions() {
  return useGet<Position[]>(
    '/positions',
    ['positions'],
    {
      staleTime: 5 * 1000, // Positions update frequently
      refetchInterval: 5 * 1000,
    }
  );
}

export function useGetPosition(positionId: string) {
  return useGet<Position>(
    `/positions/${positionId}`,
    ['position', positionId],
    {
      staleTime: 5 * 1000,
      refetchInterval: 5 * 1000,
    }
  );
}

export function useClosePosition(positionId: string) {
  return usePut<void, any>(`/positions/${positionId}/close`);
}

// Trade hooks
export interface Trade {
  id: string;
  symbol: string;
  price: number;
  quantity: number;
  side: 'BUY' | 'SELL';
  timestamp: string;
}

export function useGetTrades(params?: Record<string, any>) {
  const queryString = params ? new URLSearchParams(params).toString() : '';
  return useGet<{ data: Trade[]; total: number }>(
    `/trades${queryString ? `?${queryString}` : ''}`,
    ['trades', params],
    {
      staleTime: 1 * 60 * 1000,
    }
  );
}

// Market data hooks
export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}

export function useGetMarketData(symbol: string) {
  return useGet<MarketData>(
    `/market/${symbol}`,
    ['market', symbol],
    {
      staleTime: 5 * 1000, // 5 seconds for market data
      refetchInterval: 5 * 1000,
    }
  );
}

export function useGetMarketDataList(symbols?: string[]) {
  const queryString = symbols ? new URLSearchParams({ symbols: symbols.join(',') }).toString() : '';
  return useGet<MarketData[]>(
    `/market${queryString ? `?${queryString}` : ''}`,
    ['market', symbols],
    {
      staleTime: 5 * 1000,
      refetchInterval: 5 * 1000,
    }
  );
}
