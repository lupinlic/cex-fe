import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { balanceApi, type BalanceItem as ApiBalanceItem, type BalanceResponse as ApiBalanceResponse } from "@/services/balanceApi";

export interface BalanceToken {
  asset: string;
}

export interface BalanceItem {
  token: BalanceToken;
  available: string;
  locked?: string;
  reserved?: string;
  avg_price?: number | null;
  pnl?: number | null;
}

export interface Balances {
  spot: BalanceItem[];
  funding: BalanceItem[];
  futures: BalanceItem[];
}

export interface BalanceState {
  balances: Balances;
  rates: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  setBalances: (next: Balances) => void;
  setRates: (next: Record<string, number>) => void;
  refreshBalances: () => Promise<void>;
  refreshRates: () => Promise<void>;
  transfer: (payload: {
    fromWalletType: "SPOT" | "FUNDING" | "FUTURES";
    toWalletType: "SPOT" | "FUNDING" | "FUTURES";
    amount: string;
    assetToken: string;
  }) => Promise<void>;
}

const normalizeBalanceItem = (item: ApiBalanceItem): BalanceItem => ({
  token: { asset: item.asset },
  available: item.available,
  locked: item.locked,
  reserved: String(item.reserved ?? 0),
});

const normalizeBalances = (data: ApiBalanceResponse): Balances => ({
  spot: data.spot?.map(normalizeBalanceItem) ?? [],
  funding: data.funding?.map(normalizeBalanceItem) ?? [],
  futures: data.futures?.map(normalizeBalanceItem) ?? [],
});

const emptyBalances: Balances = {
  spot: [],
  funding: [],
  futures: [],
};

const defaultRates: Record<string, number> = {
  USDT: 1,
};

export const useBalanceStore = create<BalanceState>((set) => ({
  balances: emptyBalances,
  rates: defaultRates,
  isLoading: true,
  error: null,
  setBalances: (next) => set({ balances: next }),
  setRates: (next) => set({ rates: next }),
  refreshBalances: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await balanceApi.getBalances();
      set({ balances: normalizeBalances(response), isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch balances";
      console.error("Failed to refresh balances:", error);
      set({ error: errorMessage, isLoading: false });
    }
  },
  refreshRates: async () => {
    try {
      const response = await axiosInstance.get<{ symbol: string; lastPrice: string }[]>("/ticker/24hr");
      const tickerData = response.data ?? [];
      const nextRates = tickerData.reduce<Record<string, number>>((acc, item) => {
        const symbol = item.symbol?.toUpperCase() || "";
        if (symbol.endsWith("USDT")) {
          const asset = symbol.slice(0, -4);
          acc[asset] = Number(item.lastPrice) || 0;
        }
        return acc;
      }, { USDT: 1 });

      set({ rates: { USDT: 1, ...nextRates } });
    } catch (error) {
      console.error("Failed to refresh ticker rates:", error);
    }
  },
  transfer: async ({ fromWalletType, toWalletType, amount, assetToken }) => {
    try {
      const result = await balanceApi.transfer({
        fromWalletType,
        toWalletType,
        assetToken,
        amount,
      });

      if (!result.success) {
        throw new Error(result.message || "Transfer failed");
      }

      const response = await balanceApi.getBalances();
      set({ balances: normalizeBalances(response) });
    } catch (error) {
      console.error("Transfer failed:", error);
      throw error;
    }
  },
}));
