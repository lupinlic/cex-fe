/**
 * INTEGRATION GUIDE - Complete Examples
 * 
 * This file shows how to integrate API and WebSocket with existing components
 * 
 * Key Patterns:
 * 1. Use React Query hooks for initial data and static updates
 * 2. Use Zustand selectors for realtime data
 * 3. Combine both for optimal performance
 */

// ============================================================================
// EXAMPLE 1: Balance Component Integration
// ============================================================================

import { useGetBalances, useTransferBalance } from '@/hooks/useApi';
import { useRealtimeStore, selectAllBalances } from '@/store/realtimeStore';
import { useState } from 'react';

/**
 * Updated Balance Component
 * 
 * Data Flow:
 * - useGetBalances(): Fetches initial balance data on mount
 * - WebSocket: Pushes realtime balance updates to Zustand
 * - Component reads from Zustand for latest balances
 */
export function BalanceComponentExample() {
  const { data: initialBalances, isLoading, error } = useGetBalances();
  
  // Get realtime balances from WebSocket stream
  const realtimeBalances = useRealtimeStore(selectAllBalances());
  
  // Use realtime data if available, fallback to initial data
  const balances = realtimeBalances.length > 0 ? realtimeBalances : (initialBalances || []);

  if (isLoading) return <div>Loading balances...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <h2>Account Balances</h2>
      {balances.map((balance) => (
        <div key={balance.asset} className="p-4 border rounded">
          <p className="font-bold">{balance.asset}</p>
          <p>Available: {balance.available}</p>
          <p>Locked: {balance.locked}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Transfer Component with Mutation
 */
export function TransferComponentExample() {
  const [fromWallet, setFromWallet] = useState<string>('SPOT');
  const [toWallet, setToWallet] = useState<string>('FUNDING');
  const [asset, setAsset] = useState<string>('USDT');
  const [amount, setAmount] = useState<string>('');

  const transferMutation = useTransferBalance();

  const handleTransfer = async () => {
    try {
      await transferMutation.mutateAsync({
        fromWallet: fromWallet as 'SPOT' | 'FUNDING' | 'FUTURES',
        toWallet: toWallet as 'SPOT' | 'FUNDING' | 'FUTURES',
        asset,
        amount: parseFloat(amount),
      });
      // Show success message
      alert('Transfer successful!');
    } catch (error) {
      alert('Transfer failed: ' + (error as any).message);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded">
      <h3>Transfer Between Wallets</h3>
      
      <select value={fromWallet} onChange={(e) => setFromWallet(e.target.value)}>
        <option value="SPOT">Spot</option>
        <option value="FUNDING">Funding</option>
        <option value="FUTURES">Futures</option>
      </select>

      <select value={toWallet} onChange={(e) => setToWallet(e.target.value)}>
        <option value="SPOT">Spot</option>
        <option value="FUNDING">Funding</option>
        <option value="FUTURES">Futures</option>
      </select>

      <input
        type="text"
        placeholder="Asset"
        value={asset}
        onChange={(e) => setAsset(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        onClick={handleTransfer}
        disabled={transferMutation.isPending}
      >
        {transferMutation.isPending ? 'Transferring...' : 'Transfer'}
      </button>

      {transferMutation.isError && (
        <p className="text-red-500">Error: {(transferMutation.error as any).message}</p>
      )}
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Orders/Trading Component Integration
// ============================================================================

import { useGetOrders, useGetOrder, useCreateOrder, useCancelOrder } from '@/hooks/useApi';
import { wsService } from '@/services/websocket';

/**
 * Orders List Component
 * 
 * Data Flow:
 * - useGetOrders(): Fetches orders with polling (every 10 seconds)
 * - WebSocket: Pushes ORDER_UPDATE events for real-time status changes
 * - Combine both for complete coverage
 */
export function OrdersListExample() {
  const { data: orders = [], isLoading, refetch } = useGetOrders({ status: 'PENDING' });

  // Listen to order updates from WebSocket
  React.useEffect(() => {
    const unsubscribe = wsService.on('ORDER_UPDATE', (payload) => {
      console.log('Order updated:', payload);
      // React Query will automatically update due to staleTime
      refetch();
    });

    return unsubscribe;
  }, [refetch]);

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-2">
      <h3>Active Orders</h3>
      {orders?.length === 0 ? (
        <p>No active orders</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Side</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Filled</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <OrderRowExample key={order.id} order={order} onOrderUpdate={refetch} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/**
 * Single Order Row with Cancel Button
 */
function OrderRowExample({ order, onOrderUpdate }: { order: any; onOrderUpdate: () => void }) {
  const cancelMutation = useCancelOrder(order.id);

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync();
      onOrderUpdate();
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  return (
    <tr>
      <td>{order.symbol}</td>
      <td className={order.side === 'BUY' ? 'text-green-600' : 'text-red-600'}>
        {order.side}
      </td>
      <td>${order.price}</td>
      <td>{order.quantity}</td>
      <td>{order.filled}</td>
      <td>{order.status}</td>
      <td>
        {order.status === 'PENDING' && (
          <button onClick={handleCancel} disabled={cancelMutation.isPending}>
            {cancelMutation.isPending ? 'Cancelling...' : 'Cancel'}
          </button>
        )}
      </td>
    </tr>
  );
}

/**
 * Create Order Component
 */
export function CreateOrderExample() {
  const [symbol, setSymbol] = useState<string>('BTC/USDT');
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');

  const createOrderMutation = useCreateOrder();

  const handleCreateOrder = async () => {
    try {
      await createOrderMutation.mutateAsync({
        symbol,
        side,
        type: 'LIMIT',
        price: parseFloat(price),
        quantity: parseFloat(quantity),
      });
      // Clear form
      setPrice('');
      setQuantity('');
      alert('Order created successfully!');
    } catch (error) {
      alert('Failed to create order: ' + (error as any).message);
    }
  };

  return (
    <div className="p-4 border rounded space-y-4">
      <h3>Create Order</h3>

      <input
        type="text"
        placeholder="Symbol (e.g., BTC/USDT)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />

      <div className="flex gap-2">
        <button
          onClick={() => setSide('BUY')}
          className={side === 'BUY' ? 'bg-green-500 text-white p-2' : 'p-2 border'}
        >
          Buy
        </button>
        <button
          onClick={() => setSide('SELL')}
          className={side === 'SELL' ? 'bg-red-500 text-white p-2' : 'p-2 border'}
        >
          Sell
        </button>
      </div>

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        step="0.01"
      />

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        step="0.001"
      />

      <button
        onClick={handleCreateOrder}
        disabled={createOrderMutation.isPending}
        className="w-full p-2 bg-blue-500 text-white rounded"
      >
        {createOrderMutation.isPending ? 'Creating...' : 'Create Order'}
      </button>

      {createOrderMutation.isError && (
        <p className="text-red-500">Error: {(createOrderMutation.error as any).message}</p>
      )}
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Market Data / Price Chart Component Integration
// ============================================================================

import { useGetMarketData } from '@/hooks/useApi';
import { useRealtimeStore, selectPrice } from '@/store/realtimeStore';

/**
 * Price Ticker Component
 * 
 * Data Flow:
 * - useGetMarketData(): Gets initial market data
 * - WebSocket PRICE_UPDATE: Updates price in realtime
 * - Component displays both historical and realtime data
 */
export function PriceTickerExample({ symbol }: { symbol: string }) {
  const { data: marketData, isLoading } = useGetMarketData(symbol);
  
  // Get realtime price from WebSocket
  const realtimePrice = useRealtimeStore(selectPrice(symbol));
  
  // Use realtime price if available
  const displayPrice = realtimePrice?.price ?? marketData?.price;
  const displayChange24h = realtimePrice?.change24h ?? marketData?.change24h;

  if (isLoading && !displayPrice) return <div>Loading...</div>;

  return (
    <div className="p-4 border rounded bg-card">
      <h3>{symbol}</h3>
      <div className="text-3xl font-bold">
        ${displayPrice?.toFixed(2)}
      </div>
      <div className={displayChange24h >= 0 ? 'text-green-600' : 'text-red-600'}>
        {displayChange24h >= 0 ? '+' : ''}{displayChange24h?.toFixed(2)}%
      </div>
      <div className="text-sm text-muted-foreground mt-2">
        24h High: ${marketData?.high24h?.toFixed(2)}
        <br />
        24h Low: ${marketData?.low24h?.toFixed(2)}
        <br />
        Volume: {(marketData?.volume24h / 1000000)?.toFixed(2)}M
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Real-time Notifications
// ============================================================================

/**
 * Notification Center
 * 
 * Displays notifications from WebSocket in real-time
 */
export function NotificationCenterExample() {
  const notifications = useRealtimeStore((state) => state.notifications);
  const removeNotification = useRealtimeStore((state) => state.removeNotification);

  return (
    <div className="fixed top-4 right-4 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded shadow-lg text-white ${
            notification.type === 'ERROR'
              ? 'bg-red-500'
              : notification.type === 'SUCCESS'
              ? 'bg-green-500'
              : notification.type === 'WARNING'
              ? 'bg-yellow-500'
              : 'bg-blue-500'
          }`}
        >
          <div className="font-bold">{notification.title}</div>
          <div className="text-sm">{notification.message}</div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="mt-2 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// SUMMARY: How to Use in Your Existing Components
// ============================================================================

/**
 * 1. REPLACE MOCK DATA with API calls:
 *    Before: const { balances } = useBalanceStore();
 *    After:  const { data: balances } = useGetBalances();
 * 
 * 2. ADD REALTIME UPDATES:
 *    const realtimeBalances = useRealtimeStore(selectAllBalances());
 *    const balances = realtimeBalances.length > 0 ? realtimeBalances : initialBalances;
 * 
 * 3. COMBINE BOTH:
 *    - React Query for: initial load, periodic polls, manual refetch
 *    - WebSocket/Zustand for: real-time updates, instant feedback
 * 
 * 4. MUTATIONS:
 *    const mutation = useCreateOrder();
 *    mutation.mutate({ /* data */ });
 *    if (mutation.isPending) return <Loading />;
 *    if (mutation.isError) return <Error />;
 * 
 * 5. SETUP:
 *    - Dependencies are installed (axios, react-query)
 *    - Providers are wrapped around app (in app/layout.tsx)
 *    - WebSocket connects on app mount
 *    - All realtime listeners are initialized
 */
