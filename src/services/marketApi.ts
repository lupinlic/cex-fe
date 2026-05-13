/**
 * Market Data API Service
 * Handles market data and price information
 */

import { axiosInstance } from '@/lib/axios';

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  volumeUSDT24h: number;
  timestamp: number;
}

export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBook {
  symbol: string;
  bids: Array<[number, number]>; // [price, quantity]
  asks: Array<[number, number]>;
  timestamp: number;
}

export interface Ticker {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
}

export interface MarketToken {
  id: string;
  createdAt: string;
  updatedAt: string;
  symbol: string;
  isActive: boolean;
}

export type Interval = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w' | '1M';

export const marketApi = {
  /**
   * Get current price of a symbol
   */
  getPrice: async (symbol: string): Promise<{ symbol: string; price: number }> => {
    return axiosInstance.get(`/market/price/${symbol}`);
  },

  /**
   * Get market data for a symbol
   */
  getMarketData: async (symbol: string): Promise<MarketData> => {
    return axiosInstance.get(`/market/data/${symbol}`);
  },

  /**
   * Get market data for multiple symbols
   */
  getMarketDataList: async (symbols: string[]): Promise<MarketData[]> => {
    const params = new URLSearchParams({
      symbols: symbols.join(','),
    });
    return axiosInstance.get(`/market/data?${params}`);
  },

  /**
   * Get OHLCV (candlestick) data
   */
  getCandles: async (
    symbol: string,
    interval: Interval = '1h',
    limit: number = 100
  ): Promise<OHLCV[]> => {
    const params = new URLSearchParams({
      interval,
      limit: limit.toString(),
    });
    return axiosInstance.get(`/market/candles/${symbol}?${params}`);
  },

  /**
   * Get order book
   */
  getOrderBook: async (symbol: string, limit: number = 20): Promise<OrderBook> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });
    return axiosInstance.get(`/market/orderbook/${symbol}?${params}`);
  },

  /**
   * Get recent trades
   */
  getRecentTrades: async (symbol: string, limit: number = 20) => {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });
    return axiosInstance.get(`/market/trades/${symbol}?${params}`);
  },

  /**
   * Get 24h tickers
   */
  getTickers: async (): Promise<Ticker[]> => {
    return axiosInstance.get('/market/tickers');
  },

  /**
   * Get ticker for specific symbol
   */
  getTicker: async (symbol: string): Promise<Ticker> => {
    return axiosInstance.get(`/market/ticker/${symbol}`);
  },

  /**
   * Get trading pairs
   */
  getPairs: async (): Promise<string[]> => {
    return axiosInstance.get('/market/pairs');
  },

  /**
   * Get exchange info (limits, fees, etc.)
   */
  getExchangeInfo: async () => {
    return axiosInstance.get('/market/exchange-info');
  },

  /**
   * Get all market tokens
   */
  getMarketTokens: async (): Promise<MarketToken[]> => {
    return axiosInstance.get('/market-tokens');
  },
};
