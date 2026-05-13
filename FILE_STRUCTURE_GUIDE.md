# 📂 Project Structure & File Reference

## File Tree

```
src/
├── 📁 app/
│   ├── layout.tsx                    ✏️ UPDATED - Added Providers wrapper
│   ├── theme-provider.tsx
│   ├── globals.css
│   ├── page.tsx
│   └── ... [other pages]
│
├── 📁 api/                           ⚠️ DEPRECATED - Use services/ instead
│   ├── balanceApi.ts                 ⚠️ Replace with services/balanceApi.ts
│   └── tokenApi.ts
│
├── 📁 services/                      ✅ NEW - API service layer
│   ├── websocket.ts                  ✅ NEW - WebSocket manager
│   ├── balanceApi.ts                 ✅ NEW - Balance endpoints
│   ├── tradingApi.ts                 ✅ NEW - Trading endpoints
│   └── marketApi.ts                  ✅ NEW - Market data endpoints
│
├── 📁 lib/                           ✅ NEW - Core infrastructure
│   ├── axios.ts                      ✅ NEW - HTTP client
│   ├── queryClient.ts                ✅ NEW - React Query config
│   └── utils.ts
│
├── 📁 hooks/                         ✅ UPDATED - Added useApi.ts
│   ├── use-auth.ts
│   ├── useApi.ts                     ✅ NEW - Generic + domain hooks
│   └── use-pagination.ts (optional)
│
├── 📁 store/                         ✅ UPDATED
│   ├── balanceStore.ts               ⚠️ Keep for backward compatibility
│   ├── futureTradingStore.ts
│   ├── spotTradingStore.ts
│   ├── tradingdataStore.ts
│   └── realtimeStore.ts              ✅ NEW - Real-time data from WebSocket
│
├── 📁 components/                    📝 TO UPDATE - Replace mock data
│   ├── 📁 featured/
│   │   ├── 📁 account/               📝 Update login/register
│   │   ├── 📁 balance/               📝 Use useGetBalances()
│   │   ├── 📁 deposit/               📝 Use API
│   │   ├── 📁 withdraw/              📝 Use API
│   │   ├── 📁 Spot/                  📝 Use useGetOrders()
│   │   ├── 📁 Future/                📝 Use useGetPositions()
│   │   └── 📁 Home/                  📝 Replace coin.ts
│   └── 📁 shared/
│       ├── components/
│       │   ├── Header.tsx            📝 Add WebSocket status
│       │   └── ... [other components]
│       └── ui/
│           └── ... [shadcn components]
│
├── 📁 data/
│   └── coin.ts                       ⚠️ DEPRECATED - Use marketApi instead
│
├── 📁 util/
│   └── Token.ts
│
├── 📁 public/
│   └── images/
│
├── 📁 examples/                      ✅ NEW - Integration examples
│   └── INTEGRATION_GUIDE.tsx          ✅ NEW - Code samples
│
├── providers.tsx                     ✅ NEW - App providers wrapper
│
└── 📁 [other config files]
    ├── package.json                  ✏️ UPDATED - Added dependencies
    ├── tsconfig.json
    ├── next.config.ts
    ├── eslint.config.mjs
    └── postcss.config.mjs

📄 Documentation Files:
├── QUICK_START.md                    ✅ NEW - 5-minute setup
├── API_WEBSOCKET_INTEGRATION.md      ✅ NEW - Complete reference
├── INTEGRATION_SETUP_SUMMARY.md      ✅ NEW - Architecture overview
└── .env.local                        📝 TODO - Create with API URL
```

---

## 🎯 What to Update Next

### Priority 1: Core Setup
- [ ] Run `npm install`
- [ ] Create `.env.local` with API_URL and WS_URL
- [ ] Start backend server
- [ ] Test WebSocket connection in console

### Priority 2: Component Migration
- [ ] `components/featured/balance/` → Use `useGetBalances()`
- [ ] `components/featured/Spot/` → Use `useGetOrders()` + `useCreateOrder()`
- [ ] `components/featured/Future/` → Use `useGetPositions()` + `useClosePosition()`
- [ ] `components/featured/Home/` → Replace `coin.ts` with `useGetMarketData()`
- [ ] `components/shared/Header.tsx` → Add WebSocket status indicator

### Priority 3: State Management Cleanup
- [ ] Move away from mock stores (`balanceStore.ts`, etc.)
- [ ] Use Zustand `realtimeStore.ts` for real-time data
- [ ] Use React Query hooks for initial data
- [ ] Update URL paths for backward compatibility

### Priority 4: Enhancements
- [ ] Add error toast notifications
- [ ] Add loading skeleton states
- [ ] Add empty state messages
- [ ] Optimize query stale times
- [ ] Add cache invalidation logic

---

## 📚 File Purpose Reference

### Infrastructure Layer

| File | Purpose | Used By |
|------|---------|---------|
| `lib/axios.ts` | HTTP client with auth | All API services |
| `lib/queryClient.ts` | Query cache config | providers.tsx |
| `services/websocket.ts` | WebSocket manager | providers.tsx, components |
| `providers.tsx` | App root wrapper | app/layout.tsx |

### API Layer

| File | Purpose | Used By |
|------|---------|---------|
| `services/balanceApi.ts` | Balance endpoints | hooks, components |
| `services/tradingApi.ts` | Trading endpoints | hooks, components |
| `services/marketApi.ts` | Market data | hooks, components |

### Hooks Layer

| File | Purpose | Used By |
|------|---------|---------|
| `hooks/useApi.ts` | Generic + domain hooks | Components |
| `hooks/use-auth.ts` | Auth management | Login/Register pages |

### Store Layer

| File | Purpose | Status |
|------|---------|--------|
| `store/realtimeStore.ts` | Real-time data from WS | ✅ Active |
| `store/balanceStore.ts` | Legacy mock data | ⚠️ Deprecated |
| `store/futureTradingStore.ts` | Legacy mock data | ⚠️ Deprecated |

---

## 🔄 Data Flow by Feature

### Balance View
```
Component: components/featured/balance/index.tsx
   ↓
Hook: useGetBalances() from hooks/useApi.ts
   ↓
Service: balanceApi.getBalances() from services/balanceApi.ts
   ↓
HTTP: axios.get('/balances')
   ↓
Backend: GET /api/balances
   
Real-time:
   ↓
WebSocket: BALANCE_UPDATE event
   ↓
Store: realtimeStore.updateBalance()
   ↓
Component reads: useRealtimeStore(selectBalance(asset))
```

### Trading (Orders)
```
Component: components/featured/Spot/index.tsx
   ↓
Hook: useGetOrders(), useCreateOrder()
   ↓
Service: tradingApi.spot.getOrders(), createOrder()
   ↓
HTTP: axios.get/post
   ↓
Backend: GET/POST /api/trading/spot/orders

Real-time:
   ↓
WebSocket: ORDER_UPDATE event
   ↓
Store: realtimeStore.updateOrder()
```

### Market Data
```
Component: components/featured/Home/index.tsx
   ↓
Hook: useGetMarketData(), useGetMarketDataList()
   ↓
Service: marketApi.getMarketData()
   ↓
HTTP: axios.get()
   ↓
Backend: GET /api/market/:symbol

Real-time:
   ↓
WebSocket: PRICE_UPDATE event
   ↓
Store: realtimeStore.updatePrice()
```

---

## 🔑 Environment Variables

Create `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Optional: Authentication
NEXT_PUBLIC_AUTH_TOKEN_KEY=accessToken

# Optional: Debugging
NEXT_PUBLIC_DEBUG_MODE=false
```

---

## 📞 Quick Reference

### Import Patterns

```typescript
// API Hooks
import { 
  useGetBalances, 
  useCreateOrder, 
  useGetMarketData 
} from '@/hooks/useApi';

// Real-time Data
import { 
  useRealtimeStore, 
  selectPrice,
  selectAllBalances 
} from '@/store/realtimeStore';

// WebSocket Management
import { wsService } from '@/services/websocket';

// HTTP Client
import { axiosInstance } from '@/lib/axios';

// API Services
import { balanceApi } from '@/services/balanceApi';
import { tradingApi } from '@/services/tradingApi';
import { marketApi } from '@/services/marketApi';
```

### Common Patterns

```typescript
// Fetch Data
const { data, isLoading, error } = useGetBalances();

// Mutation
const mutation = useCreateOrder();
await mutation.mutateAsync({ /* data */ });

// Real-time
const price = useRealtimeStore(selectPrice('BTC/USDT'));

// WebSocket
wsService.on('PRICE_UPDATE', (payload) => { /* ... */ });
```

---

## ✅ Verification Checklist

```
[ ] npm install completed
[ ] .env.local created
[ ] Backend running on correct port
[ ] WebSocket connects (check console)
[ ] API responds to requests (check Network tab)
[ ] Zustand store has real-time data
[ ] Components display API data (not mocks)
[ ] No TypeScript errors
[ ] No console errors
[ ] WebSocket reconnects on disconnect
```

---

## 🆘 Troubleshooting Quick Links

- WebSocket not connecting → See QUICK_START.md → Debug Checklist
- API 401 error → Check localStorage accessToken
- Queries not updating → Check staleTime settings
- Too many re-renders → Use selectors: `selectPrice()` not `prices`
- Types missing → Run `npm install` again

See **QUICK_START.md** for detailed debugging steps.

---

## 📖 Learn More

- [QUICK_START.md](./QUICK_START.md) - Get running in 5 min
- [API_WEBSOCKET_INTEGRATION.md](./API_WEBSOCKET_INTEGRATION.md) - Complete reference
- [INTEGRATION_SETUP_SUMMARY.md](./INTEGRATION_SETUP_SUMMARY.md) - Architecture
- [examples/INTEGRATION_GUIDE.tsx](./src/examples/INTEGRATION_GUIDE.tsx) - Code samples

---

**Ready to integrate?** Start with QUICK_START.md → 🚀
