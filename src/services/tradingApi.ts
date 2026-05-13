/**
 * Trading API Service
 * Handles spot and futures trading operations
 */

import { axiosInstance } from '@/lib/axios';

export interface Order {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'TAKE_PROFIT';
  price: number;
  quantity: number;
  filled: number;
  status: 'PENDING' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'TAKE_PROFIT';
  price?: number;
  quantity: number;
}

export interface Position {
  id: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  pnlPercent: number;
  leverage: number;
  createdAt: string;
}

export interface Trade {
  id: string;
  symbol: string;
  price: number;
  quantity: number;
  side: 'BUY' | 'SELL';
  commission: number;
  timestamp: string;
}

export interface OrderSnapshotItem {
  id: string;
  side: 'BUY' | 'SELL';
  price: string;
  quantity: string;
  filled_quote_quantity: string;
  quote_quantity: string;
}

export const tradingApi = {
  // Spot Trading
  spot: {
    /**
     * Get all spot orders
     */
    getOrders: async (symbol?: string, status?: string): Promise<Order[]> => {
      const params = new URLSearchParams();
      if (symbol) params.append('symbol', symbol);
      if (status) params.append('status', status);
      return axiosInstance.get(`/trading/spot/orders?${params}`);
    },

    /**
     * Get specific spot order
     */
    getOrder: async (orderId: string): Promise<Order> => {
      return axiosInstance.get(`/trading/spot/orders/${orderId}`);
    },

    /**
     * Get snapshot of open spot orders for a market token
     */
    getOrderSnapshot: async (marketTokenId?: string): Promise<OrderSnapshotItem[]> => {
      const query = marketTokenId ? `?marketToken_id=${marketTokenId}` : '';
      return axiosInstance.get(`/orders/snapshot${query}`);
    },

    /**
     * Create spot order
     */
    createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
      return axiosInstance.post('/trading/spot/orders', payload);
    },

    /**
     * Cancel spot order
     */
    cancelOrder: async (orderId: string): Promise<{ success: boolean }> => {
      return axiosInstance.delete(`/trading/spot/orders/${orderId}`);
    },

    /**
     * Get spot trades
     */
    getTrades: async (symbol?: string, limit: number = 100): Promise<Trade[]> => {
      const params = new URLSearchParams();
      if (symbol) params.append('symbol', symbol);
      params.append('limit', limit.toString());
      return axiosInstance.get(`/trading/spot/trades?${params}`);
    },
  },

  // Futures Trading
  futures: {
    /**
     * Get all futures orders
     */
    getOrders: async (symbol?: string, status?: string): Promise<Order[]> => {
      const params = new URLSearchParams();
      if (symbol) params.append('symbol', symbol);
      if (status) params.append('status', status);
      return axiosInstance.get(`/trading/futures/orders?${params}`);
    },

    /**
     * Get specific futures order
     */
    getOrder: async (orderId: string): Promise<Order> => {
      return axiosInstance.get(`/trading/futures/orders/${orderId}`);
    },

    /**
     * Create futures order
     */
    createOrder: async (payload: CreateOrderPayload & { leverage?: number }): Promise<Order> => {
      return axiosInstance.post('/trading/futures/orders', payload);
    },

    /**
     * Cancel futures order
     */
    cancelOrder: async (orderId: string): Promise<{ success: boolean }> => {
      return axiosInstance.delete(`/trading/futures/orders/${orderId}`);
    },

    /**
     * Get all positions
     */
    getPositions: async (symbol?: string): Promise<Position[]> => {
      const params = new URLSearchParams();
      if (symbol) params.append('symbol', symbol);
      return axiosInstance.get(`/trading/futures/positions?${params}`);
    },

    /**
     * Get specific position
     */
    getPosition: async (positionId: string): Promise<Position> => {
      return axiosInstance.get(`/trading/futures/positions/${positionId}`);
    },

    /**
     * Close position
     */
    closePosition: async (positionId: string): Promise<{ success: boolean }> => {
      return axiosInstance.post(`/trading/futures/positions/${positionId}/close`);
    },

    /**
     * Update position leverage
     */
    updateLeverage: async (
      positionId: string,
      leverage: number
    ): Promise<{ success: boolean }> => {
      return axiosInstance.put(`/trading/futures/positions/${positionId}/leverage`, {
        leverage,
      });
    },

    /**
     * Get futures trades
     */
    getTrades: async (symbol?: string, limit: number = 100): Promise<Trade[]> => {
      const params = new URLSearchParams();
      if (symbol) params.append('symbol', symbol);
      params.append('limit', limit.toString());
      return axiosInstance.get(`/trading/futures/trades?${params}`);
    },
  },
};
