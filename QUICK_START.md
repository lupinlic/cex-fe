# 🚀 Quick Start Guide

Get your API + WebSocket integration running in 5 minutes.

## Step 1: Install Dependencies

```bash
npm install
```

This installs:
- `axios` - HTTP client
- `@tanstack/react-query` - Data fetching

## Step 2: Set Environment Variables

Create `.env.local` in your project root:

```env
# API Endpoints
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

Update these URLs to match your backend.

## Step 3: Verify Setup

The following files should exist:

```
src/
├── lib/
│   ├── axios.ts          ✓ (Centralized HTTP client)
│   ├── queryClient.ts    ✓ (React Query config)
│   └── utils.ts
├── services/
│   ├── websocket.ts      ✓ (WebSocket manager)
│   ├── balanceApi.ts     ✓ (Balance endpoints)
│   ├── tradingApi.ts     ✓ (Trading endpoints)
│   └── marketApi.ts      ✓ (Market data)
├── store/
│   ├── realtimeStore.ts  ✓ (Zustand realtime store)
│   └── balanceStore.ts
├── hooks/
│   ├── useApi.ts         ✓ (React Query hooks)
│   └── use-auth.ts
├── app/
│   ├── layout.tsx        ✓ (Updated with Providers)
│   └── theme-provider.tsx
└── providers.tsx         ✓ (QueryClient + WebSocket)
```

## Step 4: Update Your Components

### Example: Replace Mock Data with API

**Before (Mock Data):**

```typescript
import { useBalanceStore } from '@/store/balanceStore';

export function Balance() {
  const { balances } = useBalanceStore();
  
  return (
    <div>
      {balances.spot.map((b) => (
        <div>{b.token.asset}: {b.available}</div>
      ))}
    </div>
  );
}
```

**After (Real API + WebSocket):**

```typescript
import { useGetBalances } from '@/hooks/useApi';
import { useRealtimeStore, selectAllBalances } from '@/store/realtimeStore';

export function Balance() {
  // Fetch initial data
  const { data: initialBalances } = useGetBalances();
  
  // Get real-time updates
  const realtimeBalances = useRealtimeStore(selectAllBalances());
  
  // Display real-time if available
  const balances = realtimeBalances.length > 0 
    ? realtimeBalances 
    : initialBalances;

  return (
    <div>
      {balances?.map((b) => (
        <div>{b.asset}: {b.available}</div>
      ))}
    </div>
  );
}
```

## Step 5: Start Your App

```bash
npm run dev
```

Your app will:
1. ✓ Wrap with React Query Provider
2. ✓ Connect to WebSocket
3. ✓ Listen for real-time events
4. ✓ Auto-sync data from server

Open http://localhost:3000 and check browser console for:

```
✓ WebSocket connected
```

## 🎯 Common Tasks

### Fetch Data

```typescript
import { useGetBalances } from '@/hooks/useApi';

function MyComponent() {
  const { data, isLoading, error } = useGetBalances();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  
  return <div>{JSON.stringify(data)}</div>;
}
```

### Create/Update/Delete

```typescript
import { useCreateOrder, useCancelOrder } from '@/hooks/useApi';

function OrderForm() {
  const createMutation = useCreateOrder();
  
  const handleCreate = async (orderData) => {
    try {
      const result = await createMutation.mutateAsync(orderData);
      console.log('Created:', result);
    } catch (error) {
      console.error('Failed:', error);
    }
  };

  return (
    <button 
      onClick={() => handleCreate({ /* data */ })}
      disabled={createMutation.isPending}
    >
      {createMutation.isPending ? 'Creating...' : 'Create'}
    </button>
  );
}
```

### Real-time Updates

```typescript
import { useRealtimeStore, selectPrice } from '@/store/realtimeStore';

function PriceTicker() {
  // Only updates when THIS price changes (no unnecessary re-renders)
  const price = useRealtimeStore(selectPrice('BTC/USDT'));
  
  return <div>BTC: ${price?.price}</div>;
}
```

### Listen to WebSocket

```typescript
import { wsService } from '@/services/websocket';
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    // Subscribe to events
    const unsubscribe = wsService.on('PRICE_UPDATE', (payload) => {
      console.log('New price:', payload);
    });

    // Cleanup
    return unsubscribe;
  }, []);

  return <div>Check console for updates</div>;
}
```

## 🔍 Debug Checklist

### API not working?

```typescript
// Check if axios has token
console.log(localStorage.getItem('accessToken'));

// Test API call
import { axiosInstance } from '@/lib/axios';
const result = await axiosInstance.get('/balances');
console.log(result);
```

### WebSocket not connecting?

```typescript
import { wsService } from '@/services/websocket';

console.log('Connected:', wsService.isConnected());
console.log('State:', wsService.getReadyState());

// Try manual connect
await wsService.connect();
```

### Real-time data not updating?

```typescript
import { useRealtimeStore } from '@/store/realtimeStore';

// Check store data
console.log('Prices:', useRealtimeStore.getState().prices);
console.log('Orders:', useRealtimeStore.getState().orders);

// Check if listener is working
wsService.on('PRICE_UPDATE', (payload) => {
  console.log('Got update:', payload);
});
```

### Too many re-renders?

```typescript
// ❌ This subscribes to ENTIRE store
const state = useRealtimeStore();

// ✅ This only listens to prices
const prices = useRealtimeStore(selectPrice('BTC/USDT'));

// ✅ Better: Create selector once
const selectPriceData = (symbol: string) => (state) => 
  state.prices.get(symbol);
const price = useRealtimeStore(selectPriceData('BTC/USDT'));
```

## 📚 Next Steps

1. **Integrate all components** - Replace mock data in each component
2. **Test with backend** - Make sure API endpoints match
3. **Add error handling** - Show error toasts
4. **Add loading states** - Show skeletons while loading
5. **Add empty states** - Show message when no data
6. **Optimize queries** - Adjust staleTime based on data freshness
7. **Monitor performance** - Check DevTools → Network tab

## 📖 Full Documentation

See [API_WEBSOCKET_INTEGRATION.md](./API_WEBSOCKET_INTEGRATION.md) for:
- Complete API Reference
- All available hooks
- WebSocket events
- Performance tips
- Troubleshooting

## 💡 Pro Tips

### Tip 1: Use Constants for Query Keys

```typescript
// Create query key factory
export const queryKeys = {
  balances: () => ['balances'],
  balance: (asset: string) => ['balance', asset],
  orders: () => ['orders'],
  order: (id: string) => ['order', id],
} as const;

// Use in hooks
useGet('/balances', queryKeys.balances());
```

### Tip 2: Create Custom Hooks for Complex Queries

```typescript
// Instead of duplicating this everywhere...
const { data, isLoading } = useGet('/balances', ['balances']);

// Create once and reuse
export function useMyBalances() {
  return useGet('/balances', ['balances'], {
    staleTime: 2 * 60 * 1000,
    refetchInterval: 30 * 1000,
  });
}

// Use everywhere
const { data } = useMyBalances();
```

### Tip 3: Batch Requests

```typescript
// Fetch multiple things at once
const balances = useGetBalances();
const orders = useGetOrders();
const positions = useGetPositions();

// Wait for all
if (balances.isLoading || orders.isLoading || positions.isLoading) {
  return <Loading />;
}
```

### Tip 4: Invalidate Cache After Mutation

```typescript
const { queryClient } = useQueryClient();

const createOrderMutation = useCreateOrder({
  onSuccess: () => {
    // Refresh orders after creating
    queryClient.invalidateQueries(['orders']);
  },
});
```

---

**Ready?** Start updating your components! 🚀
