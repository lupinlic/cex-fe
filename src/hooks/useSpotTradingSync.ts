import { useEffect, useRef } from 'react';
import { Time } from 'lightweight-charts';
import { wsService } from '@/services/websocket';
import { useSpotTradingStore } from '@/store/spotTradingStore';
import toast from 'react-hot-toast';

let spotTradingSyncInitialized = false;
const unsubscribeFunctions: (() => void)[] = [];

interface UseSpotTradingSyncProps {
  userId?: string | null;
  enabled?: boolean;
}

export function useSpotTradingSync({
  userId,
  enabled = true,
}: UseSpotTradingSyncProps = {}) {
  const store = useSpotTradingStore();

  useEffect(() => {
    if (!enabled || spotTradingSyncInitialized) return;

    spotTradingSyncInitialized = true;

    // Helper functions
    const parseCandle = (k: Record<string, any>) => ({
      time: Math.floor(Number(k.start_time ?? k.startTime) / 1000) as Time,
      open: parseFloat(k.o ?? k.open ?? "0"),
      high: parseFloat(k.h ?? k.high ?? "0"),
      low: parseFloat(k.l ?? k.low ?? "0"),
      close: parseFloat(k.c ?? k.close ?? "0"),
    });

    const parseVolume = (k: Record<string, any>) => ({
      time: Math.floor(Number(k.start_time ?? k.startTime) / 1000) as Time,
      value: parseFloat(k.volume ?? k.v ?? "0"),
      color:
        parseFloat(k.c ?? k.close ?? "0") >=
        parseFloat(k.o ?? k.open ?? "0")
          ? "#26a69a"
          : "#ef5350",
    });

    const parseTicker = (payload: Record<string, any>) => ({
      lastPrice: String(payload.lastPrice ?? payload.c ?? payload.price ?? "0"),
      changePercent: String(payload.changePercent ?? payload.P ?? payload.percent ?? "0"),
      high24h: String(payload.high24h ?? payload.h ?? payload.high ?? "0"),
      low24h: String(payload.low24h ?? payload.l ?? payload.low ?? "0"),
      volumeBase: String(payload.volumeBase ?? payload.v ?? payload.volume ?? "0"),
      volumeQuote: String(payload.volumeQuote ?? payload.q ?? payload.quoteVolume ?? "0"),
    });

    const parseOrderbookSide = (items: any[]) =>
      items?.map(([price, quantity]: [string, string]) => ({
        price: parseFloat(price),
        quantity: parseFloat(quantity),
      })) ?? [];

    // Listeners
    const unsub1 = wsService.on('spot:init_candle', (data: any) => {
      try {
        const payload = Array.isArray(data) ? data : data?.candles ?? [];
        const candles = payload.map(parseCandle).slice(-500);
        const volume = payload.map(parseVolume).slice(-500);
        store.setCandles(candles);
        store.setVolume(volume);
      } catch (error) {
        console.error('spot:init_candle parse error:', error);
      }
    });

    const unsub2 = wsService.on('spot:timeframe_change', (data: any) => {
      try {
        const candle = parseCandle(data);
        const vol = parseVolume(data);

        const previousCandles = store.candles;
        const updatedCandles = [...previousCandles];
        const candleIndex = updatedCandles.findIndex((c) => c.time === candle.time);
        if (candleIndex !== -1) updatedCandles[candleIndex] = candle;
        else updatedCandles.push(candle);

        const previousVolume = store.volume;
        const updatedVolume = [...previousVolume];
        const volumeIndex = updatedVolume.findIndex((v) => v.time === vol.time);
        if (volumeIndex !== -1) updatedVolume[volumeIndex] = vol;
        else updatedVolume.push(vol);

        // Batch update
        store.setCandles(updatedCandles.slice(-500));
        store.setVolume(updatedVolume.slice(-500));
      } catch (error) {
        console.error('spot:timeframe_change parse error:', error);
      }
    });

    const unsub3 = wsService.on('spot:tickerSnapshot', (data: any) => {
      try {
        const payload = Array.isArray(data) ? data[0] : data;
        store.setTicker(parseTicker(payload));
      } catch (error) {
        console.error('spot:tickerSnapshot parse error:', error);
      }
    });

    const unsub4 = wsService.on('spot:ticker', (data: any) => {
      try {
        store.setTicker(parseTicker(data));
      } catch (error) {
        console.error('spot:ticker parse error:', error);
      }
    });

    const unsub5 = wsService.on('spot:orderbook_update', (data: any) => {
      try {
        const orderbook = {
          asks: parseOrderbookSide(data.asks ?? []),
          bids: parseOrderbookSide(data.bids ?? []),
        };
        store.setOrderbook(orderbook);
      } catch (error) {
        console.error('spot:orderbook_update parse error:', error);
      }
    });

    const unsub6 = wsService.on('spot:ticker:batch', (newItem: any) => {
      try {
        const prev = store.tickerChange;
        const index = prev.findIndex(
          (t) => t.symbol?.toLowerCase() === newItem.symbol?.toLowerCase()
        );
        const updated = [...prev];
        if (index !== -1) {
          updated[index] = { ...updated[index], ...newItem };
        } else {
          updated.push(newItem);
        }
        store.setTickerChange(updated);
      } catch (error) {
        console.error('spot:ticker:batch parse error:', error);
      }
    });

    const unsub7 = wsService.on('spot:trade_match', (data: any) => {
      try {
        if (Array.isArray(data) && userId && data.includes(userId)) {
          // Trigger balance refresh - assuming a balance refresh function exists
          // For now, just log; in real app, call refreshBalances()
          console.log('Trade match for user, refresh balances');
        }
      } catch (error) {
        console.error('spot:trade_match parse error:', error);
      }
    });

    // Deposit event
    let unsub8: (() => void) | undefined;
    if (userId) {
      unsub8 = wsService.on(`CREATEDEPOSIT:${userId}`, (data: any) => {
        try {
          store.setLatestBlock([data]);
          if (data.status === 'confirmed') {
            toast.success(`Nạp tiền thành công: ${data.amount}`);
          }
        } catch (error) {
          console.error('CREATEDEPOSIT parse error:', error);
        }
      });
    }

    // Store unsubscribes
    unsubscribeFunctions.push(unsub1, unsub2, unsub3, unsub4, unsub5, unsub6, unsub7);
    if (unsub8) unsubscribeFunctions.push(unsub8);

    // Cleanup on unmount
    return () => {
      unsubscribeFunctions.forEach(unsub => unsub());
      unsubscribeFunctions.length = 0;
      spotTradingSyncInitialized = false;
    };
  }, [enabled, userId, store]);
}