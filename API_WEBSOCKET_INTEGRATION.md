# API & WebSocket Integration Guide

Complete guide to integrating REST API + WebSocket with your Next.js frontend.

## 📋 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App                          │
├─────────────────────────────────────────────────────────┤
│  React Components                                        │
│  ├── Read from React Query (static data)               │
│  ├── Read from Zustand (realtime data)                 │
│  └── Use Hooks (useApi, useWebSocket)                 │
├─────────────────────────────────────────────────────────┤
│  Hooks Layer (lib/hooks/useApi.ts)                     │
│  ├── useGet, usePost, usePut, useDelete               │
│  ├── Domain-specific: useGetBalances, useCreateOrder  │
│  └── Handle queries + mutations                        │
├─────────────────────────────────────────────────────────┤
│  Services Layer                                        │
│  ├── API Services: balanceApi, tradingApi, marketApi  │
│  ├── WebSocket Service (wsService)                    │
│  └── Axios Instance (with interceptors)               │
├─────────────────────────────────────────────────────────┤
│  State Management                                       │
│  ├── React Query (TanStack Query) - Server state       │
│  ├── Zustand (realtimeStore) - Realtime state         │
│  └── localStorage (auth tokens)                        │
├─────────────────────────────────────────────────────────┤
│  Backend                                               │
│  ├── REST API: /api/balances, /api/orders, etc        │
│  └── WebSocket: ws://localhost:3001                   │
└─────────────────────────────────────────────────────────┘
```

## 📦 Installation

Dependencies are already added to `package.json`:
- `axios` - HTTP client
- `@tanstack/react-query` - Data fetching & caching
- `zustand` - State management (already had)

Install them:
```bash
npm install
```

## 🔧 Core Concepts

### 1. Axios Instance (`lib/axios.ts`)

Centralized HTTP client with:
- Base URL configuration
- Request interceptors (auth token injection)
- Response interceptors (error handling, 401 redirects)

```typescript
import { axiosInstance } from '@/lib/axios';

// Automatically includes auth token in all requests
const data = await axiosInstance.get('/balances');
```

### 2. React Query (`lib/queryClient.ts`)

Manages server state with:
- Automatic caching
- Background refetching
- Request deduplication
- Stale time configuration

```typescript
const { data, isLoading, error } = useGetBalances();
```

### 3. WebSocket Service (`services/websocket.ts`)

Handles real-time connections:
- Auto-reconnection with exponential backoff
- Message queuing during disconnection
- Event listeners & unsubscribers
- Connection status tracking

```typescript
// Subscribe to price updates
wsService.on('PRICE_UPDATE', (payload) => {
  console.log('New price:', payload);
});
```

### 4. Zustand Store (`store/realtimeStore.ts`)

Stores real-time data from WebSocket:
- Maps for efficient lookups
- Selectors to avoid unnecessary re-renders
- Automatic synchronization from WebSocket

```typescript
const price = useRealtimeStore(selectPrice('BTC/USDT'));
```

## 🚀 Usage Patterns

### Pattern 1: Simple Data Fetching

```typescript
'use client';
import { useGetBalances } from '@/hooks/useApi';

export function BalanceList() {
  const { data: balances, isLoading, error } = useGetBalances();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {balances?.map((b) => (
        <li key={b.asset}>
          {b.asset}: {b.available}
        </li>
      ))}
    </ul>
  );
}
```

### Pattern 2: Mutation (Create/Update/Delete)

```typescript
'use client';
import { useCreateOrder } from '@/hooks/useApi';

export function CreateOrderForm() {
  const mutation = useCreateOrder();

  const handleSubmit = async (data) => {
    try {
      const result = await mutation.mutateAsync(data);
      console.log('Order created:', result);
    } catch (error) {
      console.error('Failed:', error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({ /* form data */ });
    }}>
      {/* form fields */}
      <button disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### Pattern 3: Real-time Data from WebSocket

```typescript
'use client';
import { useRealtimeStore, selectPrice } from '@/store/realtimeStore';

export function PriceTicker() {
  const price = useRealtimeStore(selectPrice('BTC/USDT'));

  return <div>BTC: ${price?.price}</div>;
}
```

### Pattern 4: Combine Initial Data + Real-time Updates

```typescript
'use client';
import { useGetBalances } from '@/hooks/useApi';
import { useRealtimeStore, selectAllBalances } from '@/store/realtimeStore';

export function BalanceView() {
  // Fetch initial data on mount
  const { data: initialBalances } = useGetBalances();
  
  // Get real-time updates from WebSocket
  const realtimeBalances = useRealtimeStore(selectAllBalances());
  
  // Use real-time if available, else fallback
  const balances = realtimeBalances.length > 0 
    ? realtimeBalances 
    : initialBalances;

  return (
    <div>
      {balances?.map((b) => (
        <div key={b.asset}>
          {b.asset}: {b.available} {/* This updates in real-time */}
        </div>
      ))}
    </div>
  );
}
```

## 📚 API Reference

### Available Hooks (useApi.ts)

#### Generic Hooks
- `useGet<T>(url, queryKey, options)` - GET request
- `usePost<T, V>(url)` - POST request
- `usePut<T, V>(url)` - PUT request
- `usePatch<T, V>(url)` - PATCH request
- `useDelete<T>(url)` - DELETE request
- `usePaginated<T>(baseUrl, queryKey)` - Paginated queries

#### Domain Hooks

**Balance:**
- `useGetBalances()` - Get all balances
- `useGetBalance(asset)` - Get balance for asset
- `useTransferBalance()` - Transfer between wallets

**Orders:**
- `useGetOrders(params?)` - Get orders list
- `useGetOrder(orderId)` - Get specific order
- `useCreateOrder()` - Create order
- `useCancelOrder(orderId)` - Cancel order

**Positions (Futures):**
- `useGetPositions()` - Get all positions
- `useGetPosition(id)` - Get specific position
- `useClosePosition(id)` - Close position

**Market Data:**
- `useGetMarketData(symbol)` - Get market data
- `useGetMarketDataList(symbols)` - Get multiple symbols

## 🌐 WebSocket Events

Events pushed by server → Stored in Zustand:

| Event | Payload | Store Update |
|-------|---------|--------------|
| `PRICE_UPDATE` | `PriceUpdate` | `updatePrice()` |
| `ORDER_UPDATE` | `OrderUpdate` | `updateOrder()` |
| `BALANCE_UPDATE` | `BalanceUpdate` | `updateBalance()` |
| `TRADE_UPDATE` | `TradeUpdate` | `addTrade()` |
| `POSITION_UPDATE` | `PositionUpdate` | `updatePosition()` |
| `NOTIFICATION` | `NotificationMessage` | `addNotification()` |

### Custom Event Listeners

```typescript
import { wsService } from '@/services/websocket';

// Subscribe
const unsubscribe = wsService.on('PRICE_UPDATE', (payload) => {
  console.log('Price:', payload);
});

// Unsubscribe
unsubscribe();

// One-time listener
wsService.once('ORDER_UPDATE', (payload) => {
  console.log('Order updated:', payload);
});

// Send to server
wsService.send('SUBSCRIBE', { symbols: ['BTC/USDT', 'ETH/USDT'] });
```

## 📝 Configuration

### Environment Variables

Create `.env.local`:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Auth
NEXT_PUBLIC_AUTH_TOKEN_KEY=accessToken
```

### Customize Query Settings

In `lib/queryClient.ts`:

```typescript
const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 5 * 60 * 1000,      // 5 minutes
    gcTime: 10 * 60 * 1000,        // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  },
};
```

### Customize WebSocket Settings

In `services/websocket.ts`:

```typescript
class WebSocketService {
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 3000; // 3 seconds
}
```

## 🔐 Authentication

Auth token is automatically added to all API requests:

```typescript
// 1. Store token on login
localStorage.setItem('accessToken', token);

// 2. Axios interceptor adds it to all requests
// Authorization: Bearer <token>

// 3. WebSocket connects with token
// ws://localhost:3001?token=<token>

// 4. On 401 error, redirect to login
```

## 🎯 Performance Optimization

### 1. Prevent Over-Fetching

```typescript
// ❌ Fetches every 30 seconds even if not needed
useGetBalances(); // default refetchInterval: 30s

// ✅ Fetch on mount, cache for 2 minutes
useGet('/balances', ['balances'], {
  staleTime: 2 * 60 * 1000,
  refetchInterval: false,
});
```

### 2. Prevent Unnecessary Re-renders

```typescript
// ❌ Re-renders on every parent update
const balances = useRealtimeStore((state) => state.balances);

// ✅ Only re-renders when price changes
const price = useRealtimeStore(selectPrice('BTC/USDT'));
```

### 3. Use Selectors

```typescript
// ❌ Re-renders on ANY store update
const state = useRealtimeStore();

// ✅ Only re-renders when prices change
const prices = useRealtimeStore(selectPrices());
```

## 🛠️ Development

### Run the app:

```bash
npm run dev
```

### Check for errors:

```bash
npm run lint
```

### Build for production:

```bash
npm run build
npm start
```

## 📚 Example Components

See `src/examples/INTEGRATION_GUIDE.tsx` for complete examples:

1. `BalanceComponentExample` - Fetch + display balances
2. `TransferComponentExample` - Mutation with form
3. `OrdersListExample` - Polling + WebSocket updates
4. `CreateOrderExample` - Create with mutation
5. `PriceTickerExample` - Real-time price updates
6. `NotificationCenterExample` - Display WebSocket notifications

## 🐛 Troubleshooting

### WebSocket won't connect

```typescript
// Check connection status
import { wsService } from '@/services/websocket';

console.log(wsService.isConnected()); // boolean
console.log(wsService.getReadyState()); // WebSocket.OPEN, etc.
```

### API requests return 401

```typescript
// Check if token exists
console.log(localStorage.getItem('accessToken'));

// Login again
window.location.href = '/account/login';
```

### Queries aren't updating

```typescript
// Manually refetch
const { refetch } = useGetBalances();
await refetch();

// Check cache time
staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
gcTime: 10 * 60 * 1000,   // Cache kept for 10 minutes
```

### Real-time updates not showing

```typescript
// Check if WebSocket is listening
const unsubscribe = wsService.on('PRICE_UPDATE', (payload) => {
  console.log('Got update:', payload);
});

// Check if data is in store
useRealtimeStore.getState().prices; // Map of prices
```

## 📚 Reference Docs

- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Axios Docs](https://axios-http.com/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## ✅ Checklist

Before deployment:

- [ ] Dependencies installed: `npm install`
- [ ] Environment variables set: `.env.local`
- [ ] API URL configured correctly
- [ ] WebSocket URL configured correctly
- [ ] Auth token storage implemented
- [ ] Error handlers added
- [ ] Loading states handled
- [ ] Empty states handled
- [ ] WebSocket reconnection tested
- [ ] API errors tested

## 🎓 Next Steps

1. Replace mock data in components with API hooks
2. Test API endpoints with actual backend
3. Monitor network requests in DevTools
4. Add error handling and retry logic
5. Implement loading skeleton states
6. Add analytics/logging
7. Optimize database queries
8. Add caching strategies

---

**Questions?** Check examples in `src/examples/INTEGRATION_GUIDE.tsx`
