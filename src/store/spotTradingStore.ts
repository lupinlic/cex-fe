import { create } from "zustand";
import { Time } from "lightweight-charts";
import { wsService } from "@/services/websocket";
import toast from "react-hot-toast";

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

interface SpotTradingDataState {
  latestBlock: any[];
  setLatestBlock: (value: any[]) => void;
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
  fundingRate: { funding: string; countdown: string } | null;
  setFundingRate: (data: { funding: string; countdown: string } | null) => void;
  tickerChange: TickerChangeData[];
  setTickerChange: (data: TickerChangeData[]) => void;
  orderbook: OrderBookData | null;
  setOrderbook: (data: OrderBookData | null) => void;
  summary: SummaryData | null;
  setSummary: (data: SummaryData | null) => void;
}

const parseCandle = (k: Record<string, any>): CandleData => ({
  time: Math.floor(Number(k.start_time ?? k.startTime) / 1000) as Time,
  open: parseFloat(k.o ?? k.open ?? "0"),
  high: parseFloat(k.h ?? k.high ?? "0"),
  low: parseFloat(k.l ?? k.low ?? "0"),
  close: parseFloat(k.c ?? k.close ?? "0"),
});

const parseVolume = (k: Record<string, any>): VolumeData => ({
  time: Math.floor(Number(k.start_time ?? k.startTime) / 1000) as Time,
  value: parseFloat(k.volume ?? k.v ?? "0"),
  color:
    parseFloat(k.c ?? k.close ?? "0") >=
    parseFloat(k.o ?? k.open ?? "0")
      ? "#26a69a"
      : "#ef5350",
});

const parseTicker = (payload: Record<string, any>): TickerData => ({
  lastPrice: String(payload.lastPrice ?? payload.c ?? payload.price ?? "0"),
  changePercent: String(payload.changePercent ?? payload.P ?? payload.percent ?? "0"),
  high24h: String(payload.high24h ?? payload.h ?? payload.high ?? "0"),
  low24h: String(payload.low24h ?? payload.l ?? payload.low ?? "0"),
  volumeBase: String(payload.volumeBase ?? payload.v ?? payload.volume ?? "0"),
  volumeQuote: String(payload.volumeQuote ?? payload.q ?? payload.quoteVolume ?? "0"),
});

const parseOrderbookSide = (items: any[]): { price: number; quantity: number }[] =>
  items?.map(([price, quantity]: [string, string]) => ({
    price: parseFloat(price),
    quantity: parseFloat(quantity),
  })) ?? [];

export const useSpotTradingStore = create<SpotTradingDataState>((set) => ({
  latestBlock: [],
  setLatestBlock: (value: any[]) => set({ latestBlock: value }),
  candles: [],
  setCandles: (data) => set({ candles: data }),
  interval: "1m",
  setInterval: (intv) => set({ interval: intv }),
  volume: [],
  setVolume: (data) => set({ volume: data }),
  symbol: "BTCUSDT",
  setSymbol: (sym) => set({ symbol: sym }),
  ticker: null,
  setTicker: (data) => set({ ticker: data }),
  fundingRate: null,
  setFundingRate: (data) => set({ fundingRate: data }),
  tickerChange: [],
  setTickerChange: (data) => set({ tickerChange: data }),
  orderbook: null,
  setOrderbook: (data) => set({ orderbook: data }),
  summary: null,
  setSummary: (data) => set({ summary: data }),
}));

export const useSpotTradingData = () => useSpotTradingStore();
