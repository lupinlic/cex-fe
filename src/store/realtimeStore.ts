import { create } from 'zustand';
import { wsService, WebSocketEventType } from '@/services/websocket';

/**
 * Realtime price data
 */
export interface PriceUpdate {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  timestamp: number;
}

/**
 * Realtime order data
 */
export interface OrderUpdate {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  filled: number;
  status: 'PENDING' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED';
  timestamp: number;
}

/**
 * Realtime balance data
 */
export interface BalanceUpdate {
  asset: string;
  available: number;
  locked: number;
  reserved: number;
}

/**
 * Realtime trade data
 */
export interface TradeUpdate {
  id: string;
  symbol: string;
  price: number;
  quantity: number;
  side: 'BUY' | 'SELL';
  timestamp: number;
}

/**
 * Realtime position data (for futures)
 */
export interface PositionUpdate {
  id: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  pnlPercent: number;
  timestamp: number;
}

/**
 * Notification from server
 */
export interface NotificationMessage {
  id: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title: string;
  message: string;
  timestamp: number;
}

/**
 * Zustand store for realtime data
 */
interface RealtimeState {
  // Price data
  prices: Map<string, PriceUpdate>;
  updatePrice: (data: PriceUpdate) => void;

  // Order data
  orders: Map<string, OrderUpdate>;
  updateOrder: (data: OrderUpdate) => void;

  // Balance data
  balances: Map<string, BalanceUpdate>;
  updateBalance: (data: BalanceUpdate) => void;

  // Trade data
  trades: Map<string, TradeUpdate>;
  addTrade: (data: TradeUpdate) => void;
  getTrades: (limit?: number) => TradeUpdate[];

  // Position data (futures)
  positions: Map<string, PositionUpdate>;
  updatePosition: (data: PositionUpdate) => void;

  // Notifications
  notifications: NotificationMessage[];
  addNotification: (notification: NotificationMessage) => void;
  removeNotification: (id: string) => void;

  // Connection status
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;

  // Clear all data
  clearAll: () => void;
}

export const useRealtimeStore = create<RealtimeState>((set, get) => ({
  // Prices
  prices: new Map(),
  updatePrice: (data: PriceUpdate) => {
    set((state) => {
      const newPrices = new Map(state.prices);
      newPrices.set(data.symbol, data);
      return { prices: newPrices };
    });
  },

  // Orders
  orders: new Map(),
  updateOrder: (data: OrderUpdate) => {
    set((state) => {
      const newOrders = new Map(state.orders);
      newOrders.set(data.id, data);
      return { orders: newOrders };
    });
  },

  // Balances
  balances: new Map(),
  updateBalance: (data: BalanceUpdate) => {
    set((state) => {
      const newBalances = new Map(state.balances);
      newBalances.set(data.asset, data);
      return { balances: newBalances };
    });
  },

  // Trades
  trades: new Map(),
  addTrade: (data: TradeUpdate) => {
    set((state) => {
      const newTrades = new Map(state.trades);
      newTrades.set(data.id, data);
      return { trades: newTrades };
    });
  },
  getTrades: (limit: number = 50): TradeUpdate[] => {
    const { trades } = get();
    return Array.from(trades.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  },

  // Positions
  positions: new Map(),
  updatePosition: (data: PositionUpdate) => {
    set((state) => {
      const newPositions = new Map(state.positions);
      newPositions.set(data.id, data);
      return { positions: newPositions };
    });
  },

  // Notifications
  notifications: [],
  addNotification: (notification: NotificationMessage) => {
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 50), // Keep last 50
    }));
  },
  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  // Connection status
  isConnected: false,
  setIsConnected: (connected: boolean) => {
    set({ isConnected: connected });
  },

  // Clear all
  clearAll: () => {
    set({
      prices: new Map(),
      orders: new Map(),
      balances: new Map(),
      trades: new Map(),
      positions: new Map(),
      notifications: [],
      isConnected: false,
    });
  },
}));

/**
 * Initialize WebSocket listeners and connect realtime store to WebSocket
 */
let realtimeSyncInitialized = false;
const realtimeUnsubscribeFunctions: (() => void)[] = [];

export const initializeRealtimeSync = () => {
  if (realtimeSyncInitialized) return;

  realtimeSyncInitialized = true;

  // Listen to price updates
  const unsub1 = wsService.on('PRICE_UPDATE', (payload: PriceUpdate) => {
    useRealtimeStore.getState().updatePrice(payload);
  });

  // Listen to order updates
  const unsub2 = wsService.on('ORDER_UPDATE', (payload: OrderUpdate) => {
    useRealtimeStore.getState().updateOrder(payload);
  });

  // Listen to balance updates
  const unsub3 = wsService.on('BALANCE_UPDATE', (payload: BalanceUpdate) => {
    useRealtimeStore.getState().updateBalance(payload);
  });

  // Listen to trade updates
  const unsub4 = wsService.on('TRADE_UPDATE', (payload: TradeUpdate) => {
    useRealtimeStore.getState().addTrade(payload);
  });

  // Listen to position updates
  const unsub5 = wsService.on('POSITION_UPDATE', (payload: PositionUpdate) => {
    useRealtimeStore.getState().updatePosition(payload);
  });

  // Listen to notifications
  const unsub6 = wsService.on('NOTIFICATION', (payload: NotificationMessage) => {
    useRealtimeStore.getState().addNotification(payload);
  });

  // Connection status
  const unsub7 = wsService.on('connect', () => {
    useRealtimeStore.getState().setIsConnected(true);
  });

  const unsub8 = wsService.on('disconnect', () => {
    useRealtimeStore.getState().setIsConnected(false);
  });

  // Store unsubscribes
  realtimeUnsubscribeFunctions.push(unsub1, unsub2, unsub3, unsub4, unsub5, unsub6, unsub7, unsub8);
};

/**
 * Selector: Get price by symbol
 */
export const selectPrice = (symbol: string) => (state: RealtimeState) =>
  state.prices.get(symbol);

/**
 * Selector: Get all prices
 */
export const selectPrices = () => (state: RealtimeState) => Array.from(state.prices.values());

/**
 * Selector: Get order by id
 */
export const selectOrder = (id: string) => (state: RealtimeState) => state.orders.get(id);

/**
 * Selector: Get all orders
 */
export const selectOrders = () => (state: RealtimeState) => Array.from(state.orders.values());

/**
 * Selector: Get balance by asset
 */
export const selectBalance = (asset: string) => (state: RealtimeState) =>
  state.balances.get(asset);

/**
 * Selector: Get all balances
 */
export const selectAllBalances = () => (state: RealtimeState) =>
  Array.from(state.balances.values());

/**
 * Selector: Get connection status
 */
export const selectIsConnected = () => (state: RealtimeState) => state.isConnected;
