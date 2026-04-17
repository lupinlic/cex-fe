import { create } from "zustand";

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
  setBalances: (next: Balances) => void;
  setRates: (next: Record<string, number>) => void;
  refreshBalances: () => void;
  transfer: (payload: {
    fromWalletType: "SPOT" | "FUNDING" | "FUTURES";
    toWalletType: "SPOT" | "FUNDING" | "FUTURES";
    amount: number;
    assetToken: string;
  }) => Promise<void>;
}

export const fakeBalances: Balances = {
  spot: [
    { token: { asset: "BTC" }, available: "0.012", locked: "0.003", avg_price: 62000, pnl: 120.5 },
    { token: { asset: "ETH" }, available: "0.34", locked: "0.06", avg_price: 3300, pnl: 16.4 },
    { token: { asset: "USDT" }, available: "450", locked: "0" },
  ],
  funding: [
    { token: { asset: "USDT" }, available: "250.5", reserved: "0", locked: "0" },
    { token: { asset: "BUSD" }, available: "150", reserved: "0", locked: "0" },
  ],
  futures: [
    { token: { asset: "ETH" }, available: "0.08", reserved: "0", locked: "0" },
    { token: { asset: "BTC" }, available: "0.001", reserved: "0", locked: "0" },
  ],
};

export const fakeRates: Record<string, number> = {
  USDT: 1,
  BUSD: 1,
  BTC: 62000,
  ETH: 3300,
  LTC: 110,
  XRP: 0.45,
};

export const useBalanceStore = create<BalanceState>((set) => ({
  balances: fakeBalances,
  rates: fakeRates,
  setBalances: (next) => set({ balances: next }),
  setRates: (next) => set({ rates: next }),
  refreshBalances: () => {
    // TODO: Implement API call to refresh balances
    console.log('Refreshing balances...');
  },
  transfer: async ({ fromWalletType, toWalletType, amount, assetToken }) => {
    set((state) => {
      const copy = JSON.parse(JSON.stringify(state.balances)) as Balances;
      const wallets: Record<string, BalanceItem[]> = {
        SPOT: copy.spot,
        FUNDING: copy.funding,
        FUTURES: copy.futures,
      };

      const from = wallets[fromWalletType];
      const to = wallets[toWalletType];
      const assetKey = assetToken.toUpperCase();

      const fromItem = from.find((item) => item.token.asset.toUpperCase() === assetKey);
      if (!fromItem) return state;

      const fromAvailable = Number(fromItem.available || "0");
      if (fromAvailable < amount) return state;

      fromItem.available = String(fromAvailable - amount);

      let toItem = to.find((item) => item.token.asset.toUpperCase() === assetKey);
      if (!toItem) {
        toItem = { token: { asset: assetToken }, available: String(0) };
        to.push(toItem);
      }

      toItem.available = String(Number(toItem.available || "0") + amount);

      return {
        ...state,
        balances: copy,
      };
    });
  },
}));
