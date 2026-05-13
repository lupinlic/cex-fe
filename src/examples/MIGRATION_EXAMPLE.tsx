/**
 * COMPLETE EXAMPLE: Migrating Balance Component
 * 
 * Shows before/after of a real component migration
 * This is the balance component with mock data → real API + WebSocket
 */

// ============================================================================
// ❌ BEFORE: Using Mock Data from Zustand
// ============================================================================

/**
 * OLD IMPLEMENTATION - components/featured/balance/BalanceOld.tsx
 * 
 * Problems:
 * - Uses fake data from mock store
 * - No real API calls
 * - No real-time updates
 * - Manual balance calculations
 */

import { useState } from "react";
import { useBalanceStore } from "@/store/balanceStore"; // ❌ Mock store

interface BalanceItem {
  token?: { asset?: string };
  available?: string | number;
}

export function BalanceViewOld() {
  const [activeTab, setActiveTab] = useState<"taiSan" | "taiKhoan">("taiSan");
  const { balances, rates } = useBalanceStore(); // ❌ Mock data

  // Manual calculation with mock data
  const calcTotalUSDT = (arr: BalanceItem[]) =>
    arr.reduce((sum, b) => {
      const asset = b.token?.asset || "USDT";
      const rate = rates[asset] || 0;
      const valueInUSDT = Number(b.available || 0) * rate;
      return sum + valueInUSDT;
    }, 0);

  const totalBalances = {
    USDT:
      calcTotalUSDT(balances.spot) +
      calcTotalUSDT(balances.funding) +
      calcTotalUSDT(balances.futures),
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 space-y-6">
      <p className="text-2xl font-bold">Tài sản</p>
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="text-4xl font-bold">
          {totalBalances["USDT"]?.toLocaleString("en-US")}
          <span className="text-lg font-medium mx-2">USDT</span>
        </div>
        {/* ... rest of component ... */}
      </div>
    </div>
  );
}

// ============================================================================
// ✅ AFTER: Using Real API + WebSocket
// ============================================================================

/**
 * NEW IMPLEMENTATION - components/featured/balance/BalanceNew.tsx
 * 
 * Benefits:
 * ✓ Fetches real data from API
 * ✓ Real-time updates from WebSocket
 * ✓ Proper loading/error states
 * ✓ Automatic caching and refetching
 * ✓ Type-safe data
 */

import { useMemo } from "react";
import { useGetBalances } from "@/hooks/useApi"; // ✅ Real API hook
import { 
  useRealtimeStore, 
  selectAllBalances 
} from "@/store/realtimeStore"; // ✅ Real-time store

export function BalanceViewNew() {
  const [activeTab, setActiveTab] = useState<"taiSan" | "taiKhoan">("taiSan");

  // ✅ Fetch initial balance data from API
  const { 
    data: initialBalances, 
    isLoading, 
    error, 
    refetch 
  } = useGetBalances();

  // ✅ Get real-time balance updates from WebSocket
  const realtimeBalances = useRealtimeStore(selectAllBalances());

  // ✅ Use real-time if available, else fallback to initial
  const balances = useMemo(() => {
    if (realtimeBalances.length > 0) {
      return realtimeBalances;
    }
    return initialBalances || [];
  }, [realtimeBalances, initialBalances]);

  // ✅ Get exchange rates (could be from separate API)
  // For now, we'll use hardcoded rates (update as needed)
  const rates: Record<string, number> = {
    'USDT': 1,
    'BTC': 68000,
    'ETH': 3500,
    'BUSD': 1,
    'LTC': 85,
    'XRP': 0.5,
  };

  // ✅ Calculate total USDT with real data
  const calcTotalUSDT = (items: typeof balances) =>
    items.reduce((sum, item) => {
      const asset = item.asset || 'USDT';
      const rate = rates[asset] || 0;
      const valueInUSDT = Number(item.available || 0) * rate;
      return sum + valueInUSDT;
    }, 0);

  const totalBalances = {
    USDT: balances ? calcTotalUSDT(balances) : 0,
  };

  // ✅ Group balances by wallet type if needed
  // (This depends on your API structure)
  const accountsData = [
    {
      name: "Spot",
      amount: balances.filter(b => true).reduce((sum, b) => sum + Number(b.available) * rates[b.asset], 0),
      vnd: "≈ ... VND",
      percent: 0,
    },
    // ... more wallets
  ];

  // ✅ Handle loading state
  if (isLoading && !balances) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 space-y-6">
        <p className="text-2xl font-bold">Tài sản</p>
        <div className="p-6 rounded-xl border border-border bg-card animate-pulse">
          <div className="h-12 bg-muted rounded w-1/3"></div>
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
        <p className="text-2xl font-bold text-red-500">Error Loading Balances</p>
        <p className="text-red-400 mt-2">{error.message}</p>
        <button 
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // ✅ Handle empty state
  if (!balances || balances.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
        <p className="text-2xl font-bold">Tài sản</p>
        <div className="p-6 rounded-xl border border-border bg-card">
          <p className="text-muted-foreground">No balances found. Fund your account to get started.</p>
        </div>
      </div>
    );
  }

  // ✅ Render with real data
  return (
    <div className="min-h-screen bg-background text-foreground p-6 space-y-6">
      <p className="text-2xl font-bold">Tài sản</p>

      {/* Total Balance Card */}
      <div className="p-6 rounded-xl border border-border bg-card text-card-foreground flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span>Tổng số dư</span>
            {/* Eye icon */}
          </div>
          <div className="text-4xl font-bold">
            {totalBalances["USDT"]?.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            }) || 0}
            <span className="text-lg font-medium mx-2">USDT</span>
          </div>
        </div>

        {/* Refresh button */}
        <button 
          onClick={() => refetch()}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Balance List - Shows real-time data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {balances.map((balance) => (
          <div 
            key={balance.asset} 
            className="p-4 rounded-lg border border-border bg-card hover:bg-card/80 transition"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{balance.asset}</h3>
              <span className="text-xs bg-muted px-2 py-1 rounded">
                {balance.asset} {/* or token icon */}
              </span>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available:</span>
                <span className="font-mono">{Number(balance.available).toFixed(8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Locked:</span>
                <span className="font-mono">{Number(balance.locked || 0).toFixed(8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reserved:</span>
                <span className="font-mono">{Number(balance.reserved || 0).toFixed(8)}</span>
              </div>
            </div>

            {/* USDT equivalent */}
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Value:</span>
                <span className="font-semibold">
                  ${(Number(balance.available) * rates[balance.asset]).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time status indicator */}
      <div className="p-4 rounded-lg border border-border bg-card/50 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Real-time data: Updates instantly when WebSocket receives balance changes
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 🔄 MIGRATION STEPS (What you did)
// ============================================================================

/**
 * STEP 1: Identify current implementation
 * ❌ OLD: Components using fakeBalances from useBalanceStore()
 * 
 * STEP 2: Find equivalent API endpoint
 * ✅ NEW: GET /api/balances returns Balance[]
 * 
 * STEP 3: Replace state management
 * ❌ OLD: const { balances, rates } = useBalanceStore();
 * ✅ NEW: const { data: initialBalances } = useGetBalances();
 * 
 * STEP 4: Add real-time sync
 * ✅ NEW: const realtimeBalances = useRealtimeStore(selectAllBalances());
 * 
 * STEP 5: Handle loading/error/empty states
 * ✅ NEW: if (isLoading) return <Skeleton />;
 * ✅ NEW: if (error) return <ErrorMessage />;
 * ✅ NEW: if (!balances) return <Empty />;
 * 
 * STEP 6: Use combined data
 * ✅ NEW: const balances = realtimeBalances.length > 0 ? realtimeBalances : initialBalances;
 */

// ============================================================================
// 📊 COMPARISON TABLE
// ============================================================================

/**
 * | Feature | OLD (Mock) | NEW (Real) |
 * |---------|-----------|-----------|
 * | Data Source | Fake store | Real API |
 * | Real-time | ❌ No | ✅ Yes |
 * | Loading State | ❌ No | ✅ Yes |
 * | Error State | ❌ No | ✅ Yes |
 * | Empty State | ❌ No | ✅ Yes |
 * | Auto Refetch | ❌ No | ✅ Yes |
 * | Caching | ❌ No | ✅ Yes |
 * | Type Safety | ❌ Partial | ✅ Full |
 * | Performance | ⚠️ OK | ✅ Optimized |
 * | Maintainability | ⚠️ Hard | ✅ Easy |
 * | Scalability | ⚠️ Limited | ✅ Unlimited |
 */

// ============================================================================
// 💡 KEY DIFFERENCES
// ============================================================================

/**
 * 1. Data Fetching
 *    OLD: const { balances } = useBalanceStore();
 *    NEW: const { data: balances } = useGetBalances();
 * 
 * 2. Real-time Updates
 *    OLD: None - manual store updates only
 *    NEW: WebSocket → Zustand → Component re-render
 * 
 * 3. Error Handling
 *    OLD: Not possible with fake data
 *    NEW: Automatic error handling from API
 * 
 * 4. Loading States
 *    OLD: instant (because data is fake)
 *    NEW: Shows loading skeleton while fetching
 * 
 * 5. Cache Strategy
 *    OLD: Manual invalidation
 *    NEW: Automatic via React Query with staleTime
 * 
 * 6. TypeScript Support
 *    OLD: Partial types
 *    NEW: Full end-to-end types from server to UI
 */

// ============================================================================
// 🚀 HOW TO USE THIS GUIDE
// ============================================================================

/**
 * 1. Copy the "NEW" implementation to your component file
 * 2. Update API endpoint to match your backend
 * 3. Update balance display format to match your UI
 * 4. Update exchange rates calculation if needed
 * 5. Test with real backend
 * 6. Check Network tab for API calls
 * 7. Check Console for WebSocket updates
 * 8. Verify real-time updates appear instantly
 * 
 * That's it! Your component now has:
 * ✓ Real API data
 * ✓ Real-time updates
 * ✓ Proper error handling
 * ✓ Loading states
 * ✓ Automatic caching
 */

// ============================================================================
// 📚 NEXT STEPS
// ============================================================================

/**
 * Apply the same pattern to:
 * 1. components/featured/Spot/index.tsx
 * 2. components/featured/Future/index.tsx
 * 3. components/featured/Home/index.tsx
 * 4. components/featured/deposit/index.tsx
 * 5. components/featured/withdraw/index.tsx
 * 6. All other components using mock data
 * 
 * Each follows the same pattern:
 * 1. Use useGet* hook for initial data
 * 2. Add loading/error/empty states
 * 3. Add real-time data from useRealtimeStore()
 * 4. Combine both for optimal UX
 */
