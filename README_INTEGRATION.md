# 🎯 API + WebSocket Integration - Complete Setup

Your Next.js frontend is now ready for **production-grade API and WebSocket integration**.

## ✅ What's Ready

```
✓ Centralized Axios instance with auth interceptors
✓ React Query for smart data fetching & caching
✓ WebSocket service with auto-reconnect
✓ Zustand store for real-time data
✓ 20+ pre-built API hooks
✓ Complete integration examples
✓ Comprehensive documentation
✓ Clean architecture & best practices
```

## 🚀 Get Started in 3 Steps

### Step 1: Install & Setup (2 minutes)

```bash
# Install dependencies
npm install

# Create environment file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001
EOF

# Start your app
npm run dev
```

### Step 2: Start Your Backend

Make sure your backend is running on `http://localhost:3001` (or update `.env.local`).

### Step 3: Test Integration (1 minute)

Open browser console and run:

```typescript
// Check API
const data = await axiosInstance.get('/balances')
console.log(data)

// Check WebSocket
wsService.isConnected() // Should be true

// Check real-time data
useRealtimeStore.getState().prices // Should have prices
```

**Done!** Your integration is working.

---

## 📂 File Structure

All new files have been created in these locations:

```
src/
├── lib/
│   ├── axios.ts              # ✅ HTTP client
│   └── queryClient.ts        # ✅ React Query config
│
├── services/
│   ├── websocket.ts          # ✅ WebSocket service
│   ├── balanceApi.ts         # ✅ Balance endpoints
│   ├── tradingApi.ts         # ✅ Trading endpoints
│   └── marketApi.ts          # ✅ Market data
│
├── store/
│   └── realtimeStore.ts      # ✅ Real-time data
│
├── hooks/
│   └── useApi.ts             # ✅ API hooks
│
├── providers.tsx             # ✅ App wrapper
│
├── app/
│   └── layout.tsx            # ✏️ Updated
│
└── examples/
    ├── INTEGRATION_GUIDE.tsx # ✅ Code samples
    └── MIGRATION_EXAMPLE.tsx # ✅ Before/after
```

Full details: [FILE_STRUCTURE_GUIDE.md](./FILE_STRUCTURE_GUIDE.md)

---

## 📖 Documentation

Choose where to start:

| Document | Purpose | Time |
|----------|---------|------|
| [QUICK_START.md](./QUICK_START.md) | Get running fast | 5 min |
| [FILE_STRUCTURE_GUIDE.md](./FILE_STRUCTURE_GUIDE.md) | Understand the layout | 10 min |
| [API_WEBSOCKET_INTEGRATION.md](./API_WEBSOCKET_INTEGRATION.md) | Complete reference | 30 min |
| [INTEGRATION_SETUP_SUMMARY.md](./INTEGRATION_SETUP_SUMMARY.md) | Architecture overview | 15 min |
| [src/examples/](./src/examples/) | Code samples | 10 min |

**Recommended Reading Order:**
1. This file (you are here)
2. QUICK_START.md
3. FILE_STRUCTURE_GUIDE.md
4. examples/MIGRATION_EXAMPLE.tsx
5. API_WEBSOCKET_INTEGRATION.md (as reference)

---

## 🎯 Next: Migrate Your Components

Your components still use mock data. Time to connect them to real APIs.

### Example: Migrating Balance Component

**Before (Mock Data):**
```typescript
const { balances } = useBalanceStore(); // ❌ Fake
```

**After (Real API + WebSocket):**
```typescript
// Real data from API
const { data: initialBalances } = useGetBalances();

// Real-time updates from WebSocket
const realtimeBalances = useRealtimeStore(selectAllBalances());

// Use whichever is latest
const balances = realtimeBalances.length > 0 
  ? realtimeBalances 
  : initialBalances;
```

**See full example:** [src/examples/MIGRATION_EXAMPLE.tsx](./src/examples/MIGRATION_EXAMPLE.tsx)

---

## 🔑 Available API Hooks

All ready to use:

### Balance Hooks
- `useGetBalances()` - Fetch all balances
- `useGetBalance(asset)` - Fetch single balance
- `useTransferBalance()` - Transfer between wallets

### Trading Hooks
- `useGetOrders(params?)` - List orders
- `useGetOrder(id)` - Get single order
- `useCreateOrder()` - Create order
- `useCancelOrder(id)` - Cancel order

### Futures Hooks
- `useGetPositions()` - List positions
- `useGetPosition(id)` - Get single position
- `useClosePosition(id)` - Close position

### Market Data Hooks
- `useGetMarketData(symbol)` - Get market data
- `useGetMarketDataList(symbols)` - Get multiple

### Generic Hooks
- `useGet(url, queryKey)` - GET request
- `usePost(url)` - POST request
- `usePut(url)` - PUT request
- `useDelete(url)` - DELETE request

Full reference: [API_WEBSOCKET_INTEGRATION.md](./API_WEBSOCKET_INTEGRATION.md)

---

## 🌐 WebSocket Events

Your backend can push these events in real-time:

| Event | Data | Use Case |
|-------|------|----------|
| `PRICE_UPDATE` | Current price, change % | Price tickers |
| `ORDER_UPDATE` | Order status, filled qty | Order status |
| `BALANCE_UPDATE` | Asset, available, locked | Account balance |
| `TRADE_UPDATE` | Trade details | Trade history |
| `POSITION_UPDATE` | Position PnL, entry price | Futures tracking |
| `NOTIFICATION` | Title, message, type | Alerts & toasts |

All automatically stored in Zustand for instant access.

---

## 💻 Component Migration Checklist

For each component using mock data:

```
Components to Update:
☐ components/featured/balance/ → useGetBalances()
☐ components/featured/Spot/ → useGetOrders() + useCreateOrder()
☐ components/featured/Future/ → useGetPositions()
☐ components/featured/Home/ → useGetMarketData()
☐ components/featured/deposit/ → usePost()
☐ components/featured/withdraw/ → usePost()
☐ components/featured/account/login/ → usePost()
☐ components/shared/Header.tsx → Add WebSocket indicator
```

Each follows same pattern:
1. Replace `useStore()` with `useGetData()`
2. Add loading/error/empty states
3. Add real-time data from Zustand
4. Test with backend

---

## 🔐 Authentication

Your auth is automatic:

1. **Login** → Save token:
   ```typescript
   localStorage.setItem('accessToken', token);
   ```

2. **HTTP Requests** → Token auto-added:
   ```typescript
   // Authorization: Bearer <token> 
   const data = await axiosInstance.get('/balances');
   ```

3. **WebSocket** → Token passed:
   ```typescript
   // ws://localhost:3001?token=<token>
   await wsService.connect(token);
   ```

4. **Logout** → Redirect to login on 401 error

---

## ⚡ Performance Features

Already optimized:

```typescript
// ✅ Automatic caching
staleTime: 5 * 60 * 1000      // 5 minutes
gcTime: 10 * 60 * 1000        // 10 minutes

// ✅ Smart refetching
refetchOnWindowFocus: false    // Avoid unnecessary fetches
refetchOnReconnect: true       // Refetch when back online

// ✅ Real-time without polling
wsService.on('PRICE_UPDATE')   // Instant updates

// ✅ Prevent unnecessary re-renders
useRealtimeStore(selectPrice)  // Only this field triggers update
```

---

## 🛠️ Development Tools

### Check API Connection
```typescript
import { axiosInstance } from '@/lib/axios';
const result = await axiosInstance.get('/balances');
console.log(result);
```

### Check WebSocket Connection
```typescript
import { wsService } from '@/services/websocket';
console.log('Connected:', wsService.isConnected());
wsService.on('PRICE_UPDATE', (data) => console.log(data));
```

### Check Real-time Data
```typescript
import { useRealtimeStore } from '@/store/realtimeStore';
useRealtimeStore.getState().prices;     // Map of prices
useRealtimeStore.getState().orders;     // Map of orders
useRealtimeStore.getState().balances;   // Map of balances
```

### Check React Query Cache
```typescript
import { queryClient } from '@/lib/queryClient';
queryClient.getQueryCache().getAll();
```

---

## ❓ FAQ

### Q: How do I test the integration?

**A:** 
1. Start backend on port 3001
2. Update .env.local with API_URL and WS_URL
3. Run `npm run dev`
4. Open DevTools → Network tab
5. See API requests happening
6. See WebSocket connected in Console

### Q: Do I need to change the backend?

**A:** Your backend needs:
- REST API endpoints matching our services
- WebSocket server with event emitters
- Same request/response format

See backend examples in docs.

### Q: Can I use different API endpoints?

**A:** Yes! Update the service files:
- `services/balanceApi.ts`
- `services/tradingApi.ts`
- `services/marketApi.ts`

### Q: How do I add custom hooks?

**A:** Create in `hooks/useApi.ts`:
```typescript
export function useMyCustomData() {
  return useGet('/my-endpoint', ['my-data'], {
    staleTime: 5 * 60 * 1000,
  });
}
```

### Q: How do I debug real-time issues?

**A:** 
```typescript
// Log all WebSocket events
wsService.on('*', (message) => {
  console.log('WS event:', message);
});
```

---

## 🎓 Learning Path

1. **Day 1:** Setup & read QUICK_START.md
2. **Day 2:** Migrate 1-2 components using examples
3. **Day 3:** Complete all component migrations
4. **Day 4:** Add error handling & loading states
5. **Day 5:** Optimize caching & performance

---

## 📞 Support

**Having issues?**

1. Check [QUICK_START.md](./QUICK_START.md) → Debug Checklist
2. Read [API_WEBSOCKET_INTEGRATION.md](./API_WEBSOCKET_INTEGRATION.md) → Troubleshooting
3. Review [examples/](./src/examples/) for working code
4. Check browser console for errors

**Common Issues:**
- API 401? → Check localStorage token
- WebSocket not connecting? → Check WS_URL in .env.local
- Queries not updating? → Check staleTime settings
- Too many re-renders? → Use selectors: `selectPrice()` not `prices`

---

## ✨ You're All Set! 

Your frontend now has:

✅ **Production-ready** HTTP client with auth  
✅ **Smart caching** with React Query  
✅ **Real-time updates** with WebSocket  
✅ **Type-safe** hooks and services  
✅ **Error handling** built-in  
✅ **Performance optimized** architecture  
✅ **Developer friendly** with great docs  

**Next Step:** Read [QUICK_START.md](./QUICK_START.md) and start integrating! 🚀

---

## 📚 All Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get running in 5 min
- **[FILE_STRUCTURE_GUIDE.md](./FILE_STRUCTURE_GUIDE.md)** - Project layout
- **[API_WEBSOCKET_INTEGRATION.md](./API_WEBSOCKET_INTEGRATION.md)** - Complete reference
- **[INTEGRATION_SETUP_SUMMARY.md](./INTEGRATION_SETUP_SUMMARY.md)** - Architecture
- **[src/examples/INTEGRATION_GUIDE.tsx](./src/examples/INTEGRATION_GUIDE.tsx)** - Code samples
- **[src/examples/MIGRATION_EXAMPLE.tsx](./src/examples/MIGRATION_EXAMPLE.tsx)** - Before/after

---

**Happy coding!** 🎉
