import { create } from "zustand";
import { Time } from "lightweight-charts";

// Re-export spot trading store for backward compatibility
export { useSpotTradingStore, useSpotTradingData } from "./spotTradingStore";
// Export future trading store
export { useFutureTradingStore, useFutureTradingData } from "./futureTradingStore";

interface CandleData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface VolumeData {
  time: Time;
  value: number;
  color?: string;
}

interface TickerData {
  lastPrice: string;
  low24h: string;
  high24h: string;
  changePercent?: string;
  volumeBase?: string;
  volumeQuote?: string;
}

interface FundingRateData {
  funding: string;
  countdown: string;
}

interface TickerChangeData {
  symbol: string;
  lastPrice: string;
  change24h: string;
  updatedAt: string;
}

interface OrderBookData {
  asks: { price: number; quantity: number }[];
  bids: { price: number; quantity: number }[];
}

interface SummaryData {
  totalBalance: string;
  unrealizedPnL: string;
  totalMargin: string;
}

interface TradingDataState {
  latestBlock: number;
  setLatestBlock: (value: number) => void;
  candles: CandleData[];
  setCandles: (data: CandleData[]) => void;
  interval: "1m" | "5m" | "15m" | "1h" | "4h" | "1d";
  setInterval: (intv: "1m" | "5m" | "15m" | "1h" | "4h" | "1d") => void;
  volume: VolumeData[];
  setVolume: (data: VolumeData[]) => void;
  symbol: string;
  setSymbol: (sym: string) => void;
  ticker: TickerData | null;
  setTicker: (data: TickerData | null) => void;
  fundingRate: FundingRateData | null;
  setFundingRate: (data: FundingRateData | null) => void;
  tickerChange: TickerChangeData[];
  setTickerChange: (data: TickerChangeData[]) => void;
  orderbook: OrderBookData | null;
  setOrderbook: (data: OrderBookData | null) => void;
  summary: SummaryData | null;
  setSummary: (data: SummaryData | null) => void;
}

export const useTradingDataStore = create<TradingDataState>((set) => ({
  latestBlock: 13918772,
  setLatestBlock: (value: number) => set({ latestBlock: value }),
  candles: [
    { time: (Math.floor(Date.now() / 1000) - 3600) as Time, open: 50000, high: 50500, low: 49900, close: 50200 },
    { time: (Math.floor(Date.now() / 1000) - 3300) as Time, open: 50200, high: 50700, low: 50100, close: 50400 },
    { time: (Math.floor(Date.now() / 1000) - 3000) as Time, open: 50400, high: 50800, low: 50300, close: 50600 },
    // Thêm nhiều hơn nếu cần
  ],
  setCandles: (data) => set({ candles: data }),
  interval: "1m",
  setInterval: (intv) => set({ interval: intv }),
  volume: [
    { time: (Math.floor(Date.now() / 1000) - 3600) as Time, value: 1000 },
    { time: (Math.floor(Date.now() / 1000) - 3300) as Time, value: 1200 },
    { time: (Math.floor(Date.now() / 1000) - 3000) as Time, value: 1100 },
  ],
  setVolume: (data) => set({ volume: data }),
  symbol: "BTCUSDT",
  setSymbol: (sym) => set({ symbol: sym }),
  ticker: { lastPrice: "50000", low24h: "49000", high24h: "51000", changePercent: "2.5", volumeBase: "1000", volumeQuote: "50000000" },
  setTicker: (data) => set({ ticker: data }),
  fundingRate: { funding: "0.01%", countdown: "08:00:00" },
  setFundingRate: (data) => set({ fundingRate: data }),
  tickerChange: [
    { symbol: "btcusdt", lastPrice: "50000", change24h: "2.5", updatedAt: new Date().toISOString() },
    { symbol: "ethusdt", lastPrice: "3000", change24h: "-1.2", updatedAt: new Date().toISOString() },
  ],
  setTickerChange: (data) => set({ tickerChange: data }),
  orderbook: {
    asks: [
      { price: 50100, quantity: 0.5 },
      { price: 50200, quantity: 1.2 },
      { price: 50300, quantity: 0.8 },
      { price: 50400, quantity: 1.5 },
      { price: 50500, quantity: 0.3 },
      { price: 50600, quantity: 0.9 },
      { price: 50700, quantity: 1.1 },
      { price: 50800, quantity: 0.6 },
      { price: 50900, quantity: 1.3 },
      { price: 51000, quantity: 0.7 },
    ],
    bids: [
      { price: 49900, quantity: 0.6 },
      { price: 49800, quantity: 1.1 },
      { price: 49700, quantity: 0.9 },
      { price: 49600, quantity: 1.4 },
      { price: 49500, quantity: 0.5 },
      { price: 49400, quantity: 1.2 },
      { price: 49300, quantity: 0.8 },
      { price: 49200, quantity: 1.3 },
      { price: 49100, quantity: 0.7 },
      { price: 49000, quantity: 0.9 },
    ],
  },
  setOrderbook: (data) => set({ orderbook: data }),
  summary: { totalBalance: "10000", unrealizedPnL: "250", totalMargin: "5000" },
  setSummary: (data) => set({ summary: data }),
}));

export const useTradingData = () => useTradingDataStore();