"use client";

import { ChevronDown } from "lucide-react";
import ActiveDropdown from "@/components/shared/components/ActiveDropdown";
import { useRef, useState, useEffect } from "react";
import { Token } from "@/util/Token";
import { useTradingData } from "@/store/tradingdataStore";
import TokenPriceChange from "@/components/shared/components/TokenPriceChange";

interface MarketInfoBarProps {
  tokenList: Token[];
  selectedToken: Token;
  setSelectedToken: (token: Token) => void;
}

export default function MarketInfoBar({
  tokenList,
  selectedToken,
  setSelectedToken,
}: MarketInfoBarProps) {
  const { symbol, setSymbol, fundingRate, tickerChange, ticker } =
    useTradingData();

  // đổi màu
  const [color, setColor] = useState("text-white");
  const prevPriceRef = useRef<number | null>(null);
  useEffect(() => {
    if (!ticker?.lastPrice) return;
    if (prevPriceRef.current !== null) {
      if (Number(ticker.lastPrice) > Number(prevPriceRef.current)) {
        setColor("text-[#00E3A5]");
      } else if (Number(ticker.lastPrice) < Number(prevPriceRef.current)) {
        setColor("text-red-500");
      }
    }
    prevPriceRef.current = Number(ticker.lastPrice);
  }, [ticker?.lastPrice]);

  return (
    <div className="border border-l-0 border-r-0 border-gray-500  p-5 w-full md:flex block justify-between items-center">
      <div className="flex items-center gap-4 sm:justify-start justify-between">
        <ActiveDropdown
          trigger={
            <div className="flex items-center">
              <div className="flex -space-x-2 items-center">
                <img
                  src={selectedToken.icon1}
                  alt="icon1"
                  className="rounded-full border border-black w-6 h-6"
                />
                <img
                  src={selectedToken.icon2}
                  alt="icon2"
                  className="rounded-full border border-black w-6 h-6"
                />
              </div>
              <div className="flex items-center mx-1">
                <p className=" dark:text-white text-[18px] font-bold">
                  {selectedToken.symbol}
                </p>
                <ChevronDown size={16} className="dark:text-white mx-1" />
              </div>
            </div>
          }
        >
          {(close) => (
            <div className="md:w-[400px] w-[300px] p-3">
              {/* Header */}
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-400 font-semibold pb-2 text-[12px]">
                <div>Pair</div>
                <div>LastPrice</div>
                <div>24h Change</div>
              </div>
              {/* Rows */}
              {tokenList.map((token) => {
                const item = tickerChange.find(
                  (s) => s.symbol?.toLowerCase() === token.symbol?.toLowerCase()
                );

                return (
                  <div
                    key={token.symbol}
                    onClick={() => {
                      setSelectedToken(token);
                      setSymbol(token.symbol.toLowerCase());
                      close();
                    }}
                    className="flex mt-2 gap-4 items-center text-sm py-2 cursor-pointer hover:bg-[#22242A] transition-colors duration-200"
                  >
                    {/* Icon + Symbol */}
                    <div className="flex items-center gap-2 flex-1/3">
                      <div className="flex -space-x-2 items-center">
                        <img
                          src={token.icon1}
                          alt="icon1"
                          className="rounded-full border border-black sm:w-6 sm:h-6 w-4 h-4"
                        />
                        <img
                          src={token.icon2}
                          alt="icon2"
                          className="rounded-full border border-black sm:w-6 sm:h-6 w-4 h-4"
                        />
                      </div>
                      <span className="md:text-[16px] text-[10px]">
                        {token.symbol}
                      </span>
                    </div>

                    {/* Giá và Change */}
                    {item ? (
                      <TokenPriceChange item={item} />
                    ) : (
                      <div className="col-span-2 text-gray-400 text-sm">--</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ActiveDropdown>

        <p className={`${color} text-[24px]   mx-2`}>
          {ticker?.lastPrice && !isNaN(Number(ticker.lastPrice))
            ? Number(ticker.lastPrice).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : "0.00"}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-[12px] mx-2 hidden md:block">
          <p className="text-[#848E9C]">24h Change</p>
          <p>{ticker?.changePercent ?? 0}</p>
        </div>
        <div className="text-[12px] mx-2 ">
          <p className="text-[#848E9C]">24h High</p>
          <p
            className={
              ticker?.high24h?.toString().startsWith("-")
                ? " text-red-500"
                : ticker?.high24h?.toString().startsWith("+")
                ? "text-green-500"
                : "dark:text-white"
            }
          >
            {ticker?.high24h ?? 0}
          </p>
        </div>
        <div className="text-[12px] mx-2 hidden md:block">
          <p className="text-[#848E9C]">24h Low</p>
          <p className="dark:text-[#fff]">{ticker?.low24h ?? 0}</p>
        </div>
        <div className="text-[12px] mx-2">
          <p className="text-[#848E9C]">24h Volume (BTC)</p>
          <p className="text-dark:[#fff]">
            {ticker?.volumeBase && !isNaN(Number(ticker.volumeBase))
              ? Number(ticker.volumeBase).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00"}
          </p>
        </div>

        <div className="text-[12px] mx-2">
          <p className="text-[#848E9C]">24h Volume (USDT)</p>
          <p className="dark:text-[#fff]">
            {ticker?.volumeQuote && !isNaN(Number(ticker.volumeQuote))
              ? Number(ticker.volumeQuote).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00"}
          </p>
        </div>
        <div className="text-[12px] mx-2">
          <p className="text-[#848E9C]">Funding/Countdown</p>
          <p>
            <span className="text-[#F29D39]">{fundingRate?.funding ?? 0}</span>
            <span>/{fundingRate?.countdown ?? 0}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
