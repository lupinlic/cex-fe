"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";
import { useSpotTradingData } from "@/store/spotTradingStore";

interface Order {
  price: number;
  amount: number;
  total: number;
}

const MAX_ROWS = 10;

export default function OrderBook(): JSX.Element {
  const { orderbook, symbol, ticker } = useSpotTradingData();
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

  // --- SELL ORDERS (đỏ) ---
  const sellOrders: Order[] = useMemo(() => {
    if (!orderbook?.asks) return [];
    let total = 0;
    return orderbook.asks.slice(0, MAX_ROWS).map((item: { price: number; quantity: number }) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      total += quantity;
      return { price, amount: quantity, total };
    });
  }, [orderbook]);

  // --- BUY ORDERS (xanh) ---
  const buyOrders: Order[] = useMemo(() => {
    if (!orderbook?.bids) return [];
    let total = 0;
    return orderbook.bids.slice(0, MAX_ROWS).map((item: { price: number; quantity: number }) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      total += quantity;
      return { price, amount: quantity, total };
    });
  }, [orderbook]);

  // --- Giá khớp hiện tại ---
  const bestAsk = sellOrders[0]?.price ?? 0;
  const bestBid = buyOrders[0]?.price ?? 0;
  const currentPrice = useMemo(() => {
    const tickerPrice = Number(ticker?.lastPrice);
    if (!Number.isNaN(tickerPrice) && tickerPrice > 0) return tickerPrice;
    return bestAsk && bestBid ? (bestAsk + bestBid) / 2 : 0;
  }, [ticker, bestAsk, bestBid]);

  // --- Tổng khối lượng ---
  const buyVolume = useMemo(() => buyOrders.reduce((sum, o) => sum + o.amount, 0), [buyOrders]);
  const sellVolume = useMemo(() => sellOrders.reduce((sum, o) => sum + o.amount, 0), [sellOrders]);

  const totalVolume = buyVolume + sellVolume;
  const buyPercent = totalVolume > 0 ? (buyVolume / totalVolume) * 100 : 0;
  const sellPercent = 100 - buyPercent;

  // --- Hiệu ứng flash khi thay đổi orderbook ---
  useEffect(() => {
    if (!orderbook) return undefined;
    const randomIndex = Math.floor(Math.random() * MAX_ROWS);
    setHighlightIndex(randomIndex);
    const timeout = setTimeout(() => setHighlightIndex(null), 300);
    return () => clearTimeout(timeout);
  }, [orderbook]);

  // --- Đảm bảo có đủ 10 hàng ---
  const paddedSellOrders = useMemo(() => {
    const list = [...sellOrders];
    while (list.length < MAX_ROWS) list.push({ price: 0, amount: 0, total: 0 });
    return list;
  }, [sellOrders]);

  const paddedBuyOrders = useMemo(() => {
    const list = [...buyOrders];
    while (list.length < MAX_ROWS) list.push({ price: 0, amount: 0, total: 0 });
    return list;
  }, [buyOrders]);

  return (
    <div className="dark:text-white w-full p-4 select-none">
      <h2 className="text-sm font-semibold mb-2">Sổ lệnh</h2>

      {/* --- SELL ORDERS --- */}
      <div className="text-xs mb-2">
        <div className="grid grid-cols-3 text-gray-400 mb-1">
          <span>Giá</span>
          <span className="text-right">
            Số lượng ({symbol?.toUpperCase() || ""})
          </span>
          <span className="text-right">
            Tổng ({symbol?.toUpperCase() || ""})
          </span>
        </div>

        <div className="h-[170px] relative">
          {paddedSellOrders.map((o, i) => (
            <div
              key={`sell-${i.toString()}`}
              className={`grid grid-cols-3 mb-0.5 relative overflow-hidden rounded-sm transition-all duration-200 ${
                highlightIndex === i ? "brightness-125" : ""
              }`}
            >
              <div
                className="absolute top-0 left-0 h-full bg-red-300/15"
                style={{ width: `${(o.amount / (sellVolume || 1)) * 100}%` }}
              />
              <span className="text-red-500 z-10">
                {o.price ? o.price.toFixed(2) : "-"}
              </span>
              <span className="text-right z-10">
                {o.amount ? o.amount.toFixed(2) : "-"}
              </span>
              <span className="text-right z-10">
                {o.total ? o.total.toFixed(2) : "-"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- CURRENT PRICE --- */}
      <div className="flex justify-between items-center text-lg font-bold my-2">
        <span className="text-green-500">{currentPrice.toFixed(2)}</span>
        <span className="text-gray-500 text-sm">
          {(currentPrice + 0.04).toFixed(2)}
        </span>
      </div>

      {/* --- BUY ORDERS --- */}
      <div className="text-xs mb-2 h-[170px] relative">
        {paddedBuyOrders.map((o, i) => (
          <div
            key={`buy-${i.toString()}`}
            className={`grid grid-cols-3 mb-0.5 relative overflow-hidden rounded-sm transition-all duration-200 ${
              highlightIndex === i ? "brightness-125" : ""
            }`}
          >
            <div
              className="absolute top-0 left-0 h-full bg-green-200/10"
              style={{ width: `${(o.amount / (buyVolume || 1)) * 100}%` }}
            />
            <span className="text-green-500 z-10">
              {o.price ? o.price.toFixed(2) : "-"}
            </span>
            <span className="text-right z-10">
              {o.amount ? o.amount.toFixed(2) : "-"}
            </span>
            <span className="text-right z-10">
              {o.total ? o.total.toFixed(2) : "-"}
            </span>
          </div>
        ))}
      </div>

      {/* --- BUY/SELL RATIO BAR --- */}
      <div className="flex items-center h-2 mt-2 rounded overflow-hidden">
        <div
          className="bg-green-600 h-full transition-all duration-300"
          style={{ width: `${buyPercent}%` }}
        />
        <div
          className="bg-red-600 h-full transition-all duration-300"
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
