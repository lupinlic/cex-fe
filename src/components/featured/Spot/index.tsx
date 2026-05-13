"use client";

import { useEffect, useState } from "react";
import Chart from "./components/Chart";
import PriceBar from "./components/PriceBar";
import OrderBook from "./components/Orderbook";
import Trading from "./components/Trading";
import SpotOrder from "./components/Order";
import { Token } from "@/util/Token";
import { useSpotTradingData } from "@/store/spotTradingStore";
import Ticker from "@/components/shared/components/Ticker";
import { useMarketTokens } from "@/hooks/useMarketTokens";
import { useSpotTradingSync } from "@/hooks/useSpotTradingSync";

export default function Spot() {
  const { setSymbol } = useSpotTradingData();
  const { tokenList, isLoading } = useMarketTokens();
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  // Initialize WebSocket listeners for spot trading data
  useSpotTradingSync({ enabled: true });

  useEffect(() => {
    if (tokenList.length > 0 && !selectedToken) {
      setSelectedToken(tokenList[0]);
    }
  }, [tokenList, selectedToken]);

  useEffect(() => {
    if (selectedToken) {
      setSymbol(selectedToken.symbol.toLowerCase());
    }
  }, [selectedToken, setSymbol]);

  if (isLoading || !selectedToken) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex ">
        <div className="flex w-4/5 flex-col border-r-3 border-border">
        <Ticker />
          <PriceBar
            tokenList={tokenList}
            selectedToken={selectedToken}
            setSelectedToken={setSelectedToken}
          />
          <div className="flex md:flex-row flex-col">
            <div className="w-4/5">
              <Chart />
            </div>
            <div className="w-1/5 border-l-3 border-border">
                <OrderBook />
            </div>
          </div>
        </div>
        <div className="w-1/5 px-4">
          <Trading
            tokenList={tokenList}
            selectedToken={selectedToken}
            setSelectedToken={setSelectedToken}
          />
        </div>
      </div>
      <SpotOrder />
    </div>
  );
}
