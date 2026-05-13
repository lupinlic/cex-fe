/**
 * Balance API Service
 * Handles all balance-related API calls
 */

import { axiosInstance } from '@/lib/axios';
import axios from 'axios';

const API_BASE2 = process.env.NEXT_PUBLIC_API_URL2;

// Create axios instance for API_BASE2 endpoints
const axiosInstance2 = axios.create({
  baseURL: API_BASE2,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to API_BASE2 requests
axiosInstance2.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface WalletToken {
  id: string;
  createdAt: string;
  updatedAt: string;
  asset: string;
  name: string;
  is_native: boolean;
}

export interface WalletBalanceItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  available: string;
  locked: string;
  avgPrice: string;
  costPrice: string;
  token: WalletToken;
}

export interface BalanceItem {
  asset: string;
  available: string;
  locked: string;
  reserved: string;
  avgPrice?: string;
  costPrice?: string;
}

export interface BalanceSnapshotItem {
  balance: {
    id: string;
    createdAt: string;
    updatedAt: string;
    available: string;
    locked: string;
    avgPrice: string;
    costPrice: string;
    token: {
      id: string;
      createdAt: string;
      updatedAt: string;
      asset: string;
      name: string;
      is_native: boolean;
    };
  };
  pnl: string;
}

export interface BalanceResponse {
  spot: BalanceItem[];
  funding: BalanceItem[];
  futures: BalanceItem[];
}

export interface DepositHistoryItem {
  id: string;
  amount: string;
  token: {
    asset: string;
  };
  excuAddress: string;
  createdAt: string;
  status: 'confirmed' | 'pending' | 'failed';
}

export interface DepositAddressResponse {
  address: string;
}

export interface TransferPayload {
  fromWalletType: 'SPOT' | 'FUNDING' | 'FUTURES';
  toWalletType: 'SPOT' | 'FUNDING' | 'FUTURES';
  assetToken: string;
  amount: string;
}

const normalizeWalletItem = (item: WalletBalanceItem): BalanceItem => ({
  asset: item.token.asset,
  available: item.available,
  locked: item.locked,
  reserved: '0',
  avgPrice: item.avgPrice,
  costPrice: item.costPrice,
});

export const balanceApi = {
  /**
   * Get all balances from all wallets
   */
  getBalances: async (): Promise<BalanceResponse> => {
    try {
      const [spotRes, fundingRes, futuresRes] = await Promise.all([
        axiosInstance.get<WalletBalanceItem[]>('/wallets/spot').catch(() => ({ data: [] })),
        axiosInstance.get<WalletBalanceItem[]>('/wallets/funding').catch(() => ({ data: [] })),
        axiosInstance.get<WalletBalanceItem[]>('/wallets/futures').catch(() => ({ data: [] })),
      ]);

      return {
        spot: (spotRes.data || []).map(normalizeWalletItem),
        funding: (fundingRes.data || []).map(normalizeWalletItem),
        futures: (futuresRes.data || []).map(normalizeWalletItem),
      };
    } catch (error) {
      console.error('Error fetching balances:', error);
      // Return empty balances instead of throwing error
      return {
        spot: [],
        funding: [],
        futures: [],
      };
    }
  },

  /**
   * Get specific wallet balance
   */
  getWalletBalance: async (wallet: 'spot' | 'funding' | 'futures'): Promise<BalanceItem[]> => {
    try {
      const response = await axiosInstance.get<WalletBalanceItem[]>(`/wallets/${wallet}`);
      return (response.data || []).map(normalizeWalletItem);
    } catch (error) {
      console.error(`Error fetching ${wallet} balance:`, error);
      // Return empty array instead of throwing error
      return [];
    }
  },

  /**
   * Get balance for specific asset
   */
  getAssetBalance: async (asset: string): Promise<BalanceItem | null> => {
    try {
      const response = await axiosInstance.get<WalletBalanceItem[]>(`/wallets/spot?asset=${asset}`);
      const item = response.data?.[0];
      return item ? normalizeWalletItem(item) : null;
    } catch (error) {
      console.error(`Error fetching asset ${asset} balance:`, error);
      throw error;
    }
  },

  /**
   * Get current spot balances from /balances snapshot endpoint
   */
  getBalancesSnapshot: async (): Promise<BalanceSnapshotItem[]> => {
    return axiosInstance.get('/balances');
  },

  /**
   * Transfer between wallets
   */
  transfer: async (payload: TransferPayload): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post<{ success: boolean; message: string }>('/wallets/transfer', payload);
    return response.data;
  },

  /**
   * Get balance history
   */
  getBalanceHistory: async (asset?: string, limit: number = 100) => {
    const params = new URLSearchParams();
    if (asset) params.append('asset', asset);
    params.append('limit', limit.toString());
    return axiosInstance.get(`/wallets/history?${params}`);
  },

  getDepositHistory: async () => {
    return axiosInstance.get<DepositHistoryItem[]>('/transactions/deposits').then((res) => res.data);
  },

  getDepositAddress: async (payload: {
    user_id: string;
    vm_name: string;
  }) => {
    return axiosInstance2
      .post<DepositAddressResponse>('/user_address', payload)
      .then((res) => res.data);
  },
};
