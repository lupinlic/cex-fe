'use client';

import { useGet } from './useApi';
import { Token } from '@/util/Token';
import { MarketToken } from '@/services/marketApi';

interface MarketTokenResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  symbol: string;
  isActive: boolean;
}

export function useMarketTokens() {
  const { data, isLoading, error } = useGet<MarketTokenResponse[]>('/market-tokens', ['market-tokens']);
  const tokenList: Token[] = data
    ? data.map((item) => ({
        name: item.symbol.replace('USDT', ''),
        symbol: item.symbol,
        icon1: `/images/coin/${item.symbol.toLowerCase().replace('usdt', '')}.png`,
        icon2: `/images/coin/${item.symbol.toLowerCase().replace('usdt', '')}.png`,
        price: '0',
        change: '0',
        high: '0',
        low: '0',
        isActive: item.isActive,
        volBTC: '0',
        volUSDT: '0',
        funding: '0',
        countdown: '00:00:00',
        lastPrice: '0',
      }))
    : [];

  return { tokenList, marketTokens: data ?? [], isLoading, error };
}