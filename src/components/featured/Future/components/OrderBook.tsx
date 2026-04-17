"use client";
import { useTradingData } from "@/store/tradingdataStore";
import React, { useMemo } from "react";

type Order = {
  price: number;
  amount: number;
  total: number;
};

export default function OrderBook() {
  const { orderbook,ticker,symbol  } = useTradingData();
  const sellOrders: Order[] = useMemo(() => {
    if (!orderbook) return [];
    let total = 0;
    return orderbook.asks.slice(0, 10).map(({ price, quantity }) => {
      total += quantity;
      return { price, amount: quantity, total };
    });
  }, [orderbook]);

  const buyOrders: Order[] = useMemo(() => {
    if (!orderbook) return [];
    let total = 0;
    return orderbook.bids.slice(0, 10).map(({ price, quantity }) => {
      total += quantity;
      return { price, amount: quantity, total };
    });
  }, [orderbook]);

  // Current price (giá khớp gần nhất thường lấy từ ticker)
  const bestAsk = sellOrders[0]?.price;
  const bestBid = buyOrders[0]?.price;
  const currentPrice = ticker?.lastPrice 
    ? Number(ticker.lastPrice) 
    : (bestAsk && bestBid ? (bestAsk + bestBid) / 2 : 50000);

  // Tính % buy/sell theo tổng khối lượng
  const buyVolume = buyOrders.reduce((sum, o) => sum + o.amount, 0);
  const sellVolume = sellOrders.reduce((sum, o) => sum + o.amount, 0);
  const totalVolume = buyVolume + sellVolume;
  const buyPercent = totalVolume > 0 ? (buyVolume / totalVolume) * 100 : 0;
  const sellPercent = 100 - buyPercent;

  return (
    <div className="dark:text-white w-full rounded-lg ">
      <h2 className="text-sm font-semibold mb-2">Sổ lệnh</h2>

      {/* SELL ORDERS */}
      <div className="text-xs mb-2">
        <div className="grid grid-cols-3 text-gray-400 mb-1">
          <span>Giá</span>
          <span className="text-right">Số lượng ({symbol.toLocaleUpperCase()})</span>
          <span className="text-right">Tổng ({symbol.toLocaleUpperCase()})</span>
        </div>
        {sellOrders.map((o, i) => (
          <div key={i} className="grid grid-cols-3 mb-0.5 relative">
            <span className="text-red-600">{o.price.toFixed(2)}</span>
            <span className="text-right">{o.amount.toFixed(2)}</span>
            <span className="text-right">{o.total.toFixed(2)}</span>
            <div
              className="absolute top-0 left-0 h-full bg-red-900 opacity-30 -z-10"
              style={{ width: `${(o.amount / (sellVolume || 1)) * 100}%` }}
            />
          </div>
        ))}
      </div>

      {/* CURRENT PRICE */}
      <div className="flex justify-between items-center text-lg font-bold my-2">
        <span className="text-green-500">{currentPrice.toFixed(2)}</span>
        <span className="text-gray-500 text-sm">
          {(currentPrice + 0.04).toFixed(2)}
        </span>
      </div>

      {/* BUY ORDERS */}
      <div className="text-xs mb-2">
        {buyOrders.map((o, i) => (
          <div key={i} className="grid grid-cols-3 mb-0.5 relative">
            <span className="text-green-600">{o.price.toFixed(2)}</span>
            <span className="text-right">{o.amount.toFixed(2)}</span>
            <span className="text-right">{o.total.toFixed(2)}</span>
            <div
              className="absolute top-0 left-0 h-full bg-green-900 opacity-30 -z-10"
              style={{ width: `${(o.amount / (buyVolume || 1)) * 100}%` }}
            />
          </div>
        ))}
      </div>

      {/* BUY/SELL RATIO BAR */}
      <div className="flex items-center h-2 mt-2">
        <div
          className="bg-green-600 h-full"
          style={{ width: `${buyPercent}%` }}
        />
        <div
          className="bg-red-600 h-full"
          style={{ width: `${sellPercent}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>B {buyPercent.toFixed(0)}%</span>
        <span>S {sellPercent.toFixed(0)}%</span>
      </div>
    </div>
  );
}
