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

const tokenList: Token[] = [
  {
    name: "Bitcoin",
    symbol: "BTCUSDT",
    icon1: "/images/coin/btc.png",
    icon2: "/images/coin/btc.png",
    price: "50000",
    change: "2.5",
    high: "50500",
    low: "49500",
    isActive: true,
    volBTC: "1200",
    volUSDT: "60000000",
    funding: "0.01",
    countdown: "00:00:00",
    lastPrice: "50000",
  },
  {
    name: "Ethereum",
    symbol: "ETHUSDT",
    icon1: "/images/coin/eth.png",
    icon2: "/images/coin/eth.png",
    price: "3000",
    change: "-1.2",
    high: "3050",
    low: "2950",
    isActive: false,
    volBTC: "2400",
    volUSDT: "7200000",
    funding: "0.02",
    countdown: "00:00:00",
    lastPrice: "3000",
  },
  {
    name: "Tether",
    symbol: "USDT",
    icon1: "/images/coin/usdt.png",
    icon2: "/images/coin/usdt.png",
    price: "1",
    change: "0.0",
    high: "1.01",
    low: "0.99",
    isActive: false,
    volBTC: "0",
    volUSDT: "100000000",
    funding: "0.00",
    countdown: "00:00:00",
    lastPrice: "1",
  },
];

export default function Spot() {
  const { setSymbol } = useSpotTradingData();
  const [selectedToken, setSelectedToken] = useState<Token>(tokenList[0]);

  useEffect(() => {
    setSymbol(selectedToken.symbol.toLowerCase());
  }, [selectedToken, setSymbol]);

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
