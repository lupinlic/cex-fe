"use client";

import { ChevronDown } from "lucide-react";
import ActiveDropdown from "@/components/shared/components/ActiveDropdown";
import { useRef, useState, useEffect } from "react";
import { Token } from "@/util/Token";
import { useSpotTradingData } from "@/store/spotTradingStore";
import TokenPriceChange from "@/components/shared/components/TokenPriceChange";

interface MarketInfoBarProps {
  tokenList: Token[];
  selectedToken: Token;
  setSelectedToken: (token: Token) => void;
}

export default function PriceBar({
  tokenList,
  selectedToken,
  setSelectedToken,
}: MarketInfoBarProps) {
  const { symbol, setSymbol, summary, ticker, tickerChange } = useSpotTradingData();
  const [color, setColor] = useState("text-white");
  const prevPriceRef = useRef<number | null>(null);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    if (!ticker?.lastPrice) return;
    const lastPrice = Number(ticker.lastPrice);
    if (prevPriceRef.current !== null) {
      if (lastPrice > prevPriceRef.current) {
        setColor("text-[#00E3A5]");
      } else if (lastPrice < prevPriceRef.current) {
        setColor("text-red-500");
      } else {
        setColor("text-white"); 
      }
    }
    prevPriceRef.current = lastPrice;
  }, [ticker?.lastPrice]);

  const lastPriceNumber = Number(ticker?.lastPrice ?? 0);
  console.log("Ticker :", ticker);


  return (
    <div className="border-3 border-l-0 border-r-0 border-border gap-4 px-4 py-2 w-full md:flex block items-center">
      {/* Left: Token Dropdown + Price */}
      <div className="flex items-center gap-4  sm:justify-start justify-between">
        <ActiveDropdown
          trigger={
            <div
              className="relative group flex items-center cursor-pointer"
            >
              {/* Token icons + symbol */}
              <div className="">
                <img
                  src={selectedToken?.icon1}
                  alt="icon1"
                  className="rounded-full border border-black w-6 h-6"
                />
              </div>
              <div className="flex items-center mx-1">
                <p className="dark:text-white text-[16px] font-bold">
                  {selectedToken?.symbol}
                </p>
                <ChevronDown size={16} className="dark:text-white mx-1" />
              </div>
        
            </div>
          }
        >
          {(close) => (
            <div className="md:w-[400px] w-[300px] p-3 max-h-[400px] overflow-auto">
              {/* Header */}
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-400 font-semibold pb-2 text-[12px]">
                <div>Tên</div>
                <div>Giá gần nhất</div>
                <div>Thay đổi</div>
              </div>

              {/* Token List */}
              {tokenList.map((token) => {
                const item = tickerChange.find(
                  (s) => s.symbol?.toUpperCase() === token.symbol?.toUpperCase()
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
                    <div className="flex items-center gap-2 w-1/3">
                      <div className="">
                        <img
                          src={token.icon1}
                          alt="icon1"
                          className="rounded-full border border-black sm:w-6 sm:h-6 w-4 h-4"
                        />
              
                      </div>
                      <span className="md:text-[14px] text-[10px]">
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

        <p className={`${color} text-[20px] mx-2`}>
          {lastPriceNumber.toLocaleString("vi-VN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      {/* Right: 24h Stats */}
      <div className="flex items-center gap-4 overflow-x-auto">
        <div className="text-[12px] mx-2 hidden md:block">
          <p className="text-[#848E9C]"> Thay đổi 24h </p>
          <p
            className={`font-medium ${
              Number(ticker?.changePercent ?? 0) > 0
                ? "text-green-500"
                : Number(ticker?.changePercent ?? 0) < 0
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            {ticker?.changePercent ?? 0}%
          </p>
        </div>
        <div className="text-[12px] mx-2">
          <p className="text-[#848E9C]">Giá cao 24h</p>
          <p
            className={
              ticker?.high24h?.toString().startsWith("-")
                ? "text-red-500"
                : ticker?.high24h?.toString().startsWith("+")
                ? "text-green-500"
                : "dark:text-white"
            }
          >
            {ticker?.high24h ?? 0}
          </p>
        </div>
        <div className="text-[12px] mx-2 hidden md:block">
          <p className="text-[#848E9C]">Giá thấp 24h</p>
          <p className="dark:text-white">{ticker?.low24h ?? 0}</p>
        </div>
        <div className="text-[12px] mx-2">
          <p className="text-[#848E9C]">KL 24h ({selectedToken?.symbol?.slice(0,-4)})</p>
          <p className="dark:text-white">
            {ticker?.volumeBase && !isNaN(Number(ticker.volumeBase))
              ? Number(ticker.volumeBase).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00"}
          </p>
        </div>
        <div className="text-[12px] mx-2">
          <p className="text-[#848E9C]">Giá trị 24h (USDT)</p>
          <p className="dark:text-white">
            {ticker?.volumeQuote && !isNaN(Number(ticker.volumeQuote))
              ? Number(ticker.volumeQuote).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00"}
          </p>
        </div>
      </div>
    </div>
  );
}
