"use client";

import { useRef, useState, useEffect } from "react";

interface TickerItem {
  symbol: string;
  lastPrice: string;
  change24h: string;
  updatedAt: string;
}

function TokenPriceChange({ item }: { item: TickerItem }) {
  const [color, setColor] = useState("text-white");
  const prevPriceRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevPriceRef.current !== null) {
      if (Number(item.lastPrice) > prevPriceRef.current) {
        setColor("text-green-500 font-medium");
      } else if (Number(item.lastPrice) < prevPriceRef.current) {
        setColor("text-red-500 font-medium");
      }

      // reset lại màu sau 0.5s
      const timeout = setTimeout(() => setColor("text-white"), 500);
      return () => clearTimeout(timeout);
    }

    prevPriceRef.current = Number(item.lastPrice);
  }, [item.lastPrice]);

  return (
    <div className="flex  items-center flex-2/3">
      <div className={`${color} text-[12px] md:text-base w-1/2`}>
        {item.lastPrice||"0"}
      </div>
      <div
        className={`md:text-[13px] text-[10px] w-1/2 ${
          Number(item.change24h) >= 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {Number(item.change24h) > 0 ? `+${item.change24h}` : item.change24h}%
      </div>
    </div>
  );
}

export default TokenPriceChange;
