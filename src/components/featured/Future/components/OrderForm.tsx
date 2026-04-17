"use client";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Modal from  "@/components/shared/components/Modal";
import React from "react";
import { Token } from "@/util/Token";
import ActiveDropdown from "@/components/shared/components/ActiveDropdown";
import BottomTabs from "./BottomTabs";
import Image from "next/image";
import { useTradingData } from "@/store/tradingdataStore";

type Coin = {
  name: string;
  icon: string;
};

interface OrderFormProps {
  tokenList: Token[];
  selectedToken: Token;
  setSelectedToken: (token: Token) => void;
}

export default function OrderForm({
  tokenList,
  selectedToken,
}: // setSelectedToken,
OrderFormProps) {
  const { summary, ticker } = useTradingData();
  const [orderType, setOrderType] = useState<"open" | "close" | "position">(
    "open"
  );
  const [priceType, setPriceType] = useState<"Market" | "Limit">("Market");
  const [enabled, setEnabled] = useState(false);
  const [enabledCheck, setEnabledCheck] = useState(false);
  const [price, setPrice] = useState(0);
  const [percent, setPercent] = useState(0);
  const [tp, setTp] = useState("");
  const [sl, setSl] = useState("");
  const [open, setOpen] = useState(false);

  const [selectedCoin, setSelectedCoin] = useState<Coin>({
    name: "USDT",
    icon: "https://image.myx.finance/s3/67d7b856e4b06079c66e0241.webp",
  });
  useEffect(() => {
      // Cập nhật giá khi chọn token mới
      setPrice(ticker?.lastPrice ? Number(ticker.lastPrice) : 0);
  }, [ticker?.lastPrice]);
  // đòn bẩy
  const [leverage, setLeverage] = useState(1);
  //   tăng /giảm
  const handleDecrease = () => {
    if (leverage > 1) setLeverage(leverage - 1);
  };

  const handleIncrease = () => {
    if (leverage < 50) setLeverage(leverage + 1);
  };

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");

    const handleResize = () => {
      if (mq.matches && orderType === "position") {
        setOrderType("open"); // reset khi qua desktop
      }
    };

    // Gọi ngay lần đầu
    handleResize();

    // Lắng nghe khi thay đổi kích thước
    mq.addEventListener("change", handleResize);

    return () => mq.removeEventListener("change", handleResize);
  }, [orderType]);

  const marks = [0, 25, 50, 75, 100];

  return (
    <div className="w-full relative">
      <img src="https://png.pngtree.com/png-vector/20230903/ourmid/pngtree-portrait-of-winter-character-cute-snowman-png-image_9944676.png" alt="bg" 
      className="absolute inset-0 w-10 h-10 object-cover rounded-xl pointer-events-none bottom-0 right-0" />
      <div className="">
        <div className="flex rounded">
          <button
            className={`flex-1 py-2 rounded-tl-md rounded-bl-md cursor-pointer ${
              orderType === "open"
                ? "bg-[#184C48] text-[#00E3A5]"
                : "bg-[#1D1E24] text-white"
            }`}
            onClick={() => setOrderType("open")}
          >
            Open
          </button>
          <button
            className={`flex-1 py-2 rounded-tr-md rounded-br-md cursor-pointer ${
              orderType === "close"
                ? "bg-[#184C48] text-[#00E3A5]"
                : "bg-[#1D1E24] text-white"
            }`}
            onClick={() => setOrderType("close")}
          >
            Close
          </button>
          <button
            className={`flex-1 py-2 md:hidden block rounded-tr-md rounded-br-md cursor-pointer ${
              orderType === "position"
                ? "bg-[#184C48] text-[#00E3A5]"
                : "bg-[#1D1E24] text-white"
            }`}
            onClick={() => setOrderType("position")}
          >
            Positions
          </button>
        </div>
        {orderType === "position" ? (
          <div className="">
            <BottomTabs />
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mt-5">
              <div className="flex space-x-4 text-sm ">
                <button
                  className={`cursor-pointer ${
                    priceType === "Market" ? "text-[#00E3A5]" : "text-[#848E9C]"
                  }`}
                  onClick={() => {
                    setPriceType("Market");
                    setPrice(ticker?.lastPrice ? Number(ticker.lastPrice) : 0);
                  }}
                >
                  Market
                </button>
                <button
                  className={`cursor-pointer ${
                    priceType === "Limit" ? "text-[#00E3A5]" : "text-[#848E9C]"
                  }`}
                  onClick={() => setPriceType("Limit")}
                >
                  Limit
                </button>
              </div>
              <div className="flex justify-between">
                <button className="bg-[#1D1E24] px-3 py-1 rounded text-[12px] mx-2 text-[#848E9C]">
                  Isolated
                </button>
                <button
                  className="bg-[#1D1E24] px-2 py-1 cursor-pointer rounded text-[12px] flex items-center space-x-1 text-[#fff]"
                  onClick={() => setOpen(true)}
                >
                  <span className="flex items-center">
                    {leverage}x{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
            {/* mở khung đòn bẩy */}
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              className="w-[400px]"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6 py-5 border-b px-6 border-b-gray-600">
                <h2 className="text-white text-[16px] font-semibold">
                  Adjust Leverage
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  x
                </button>
              </div>

              {/* Slider */}
              <div className="flex items-center justify-between mx-6 border border-gray-500 p-3 rounded-xl bg-[#18191F]">
                <button
                  className="bg-[#2B2D33] w-5 h-5 cursor-pointer flex items-center justify-center rounded-full"
                  onClick={handleDecrease}
                >
                  –
                </button>
                <span className="text-white font-semibold">{leverage}x</span>
                <button
                  className="bg-[#2B2D33] w-5 h-5 cursor-pointer flex items-center justify-center rounded-full"
                  onClick={handleIncrease}
                >
                  +
                </button>
              </div>
              <div className="p-6 relative">
                {/* thanh trượt */}
                {/* Input range */}
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  value={leverage}
                  onChange={(e) => setLeverage(Number(e.target.value))}
                  className="w-full cursor-pointer "
                />

                {/* Mô tả */}
                <p className="text-gray-400 text-xs mt-4 mb-6">
                  Leverage adjustments will impact your new opening orders. When
                  opening a new position, your minimum maintenance margin will
                  be calculated according to the new leverage.
                </p>

                {/* Nút Confirm */}
                <button
                  className="w-full py-2 rounded-xl  text-black cursor-pointer"
                  style={{
                    background: "linear-gradient(90deg, #00E3A5, #6AFFB3)",
                  }}
                  onClick={() => {setOpen(false);
                  }
                  }
                >
                  Confirm
                </button>
              </div>
            </Modal>
            {/* auto margin */}
            {orderType === "open" && (
              <label className="flex items-center justify-end space-x-2  mt-5">
                <input
                  type="checkbox"
                  className="accent-green-500"
                  checked={enabled}
                  onChange={() => setEnabled(!enabled)}
                />
                <span
                  className="text-[#848E9C] text-[12px]"
                  style={{
                    textDecoration: "underline",
                    textDecorationStyle: "dashed",
                    textUnderlineOffset: "4px",
                  }}
                >
                  Automated Margin Transfer
                </span>
              </label>
            )}
            {/* chọn auto margin */}
            {!enabled && orderType === "open" && (
              <div
                className="border border-gray-500 dark:bg-[#000] p-3 rounded-xl mt-3"
                style={{
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="dark:text-white text-[14px]">Add Margin</p>
                  <p>
                    <span className="text-[12px] text-[#848E9C]">Balance</span>
                    <span className="dark:text-white mx-1">----</span>
                  </p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[16px] text-[#848E9C]">0.00</p>
                  <div className="bg-[#2D3138] p-2 rounded-2xl flex items-center">
                    <Image
                      src="https://image.myx.finance/s3/67d7b856e4b06079c66e0241.webp" // icon USDT
                      alt="USDT"
                      className="rounded-full"
                      width={16}
                      height={16}
                    />
                    <p className="text-white text-[12px] mx-1">USDT</p>
                  </div>
                </div>
              </div>
            )}
            {/* price */}
            <div
              className="border border-gray-500 dark:bg-[#000] p-3 rounded-xl mt-3"
              style={{
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
              }}
            >
              <span className="text-[#848E9C] text-[14px]">Price</span>
              <div className="flex">
                <input
                  type="number"
                  value={price ?? 0}
                  disabled={priceType === "Market"}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className={`w-full bg-transparent text-xl outline-none ${
                    priceType === "Market" ? "text-gray-500" : "dark:text-white"
                  }`}
                />
                {/* chọn market , limit */}
                <ActiveDropdown
                  trigger={
                    <div className="bg-[#2D3138] p-2 rounded-2xl flex items-center">
                      <p className="text-white text-[12px] mx-1">{priceType}</p>
                      <ChevronDown size={16} className="text-white mx-1" />
                    </div>
                  }
                >
                  {(close) => (
                    <div>
                      <div
                        className="flex items-center  w-25 right-0 mt-1 cursor-pointer p-2 rounded hover:bg-[#22242A] transition-colors duration-200"
                        onClick={() => {
                          setPriceType("Market");
                          setPrice(ticker?.lastPrice ? Number(ticker.lastPrice) : 0);
                          close();
                        }}
                      >
                        <p
                          className={` text-[14px] ${
                            priceType === "Market"
                              ? "text-[#00E3A5]"
                              : "text-[#848E9C]"
                          }`}
                        >
                          Market
                        </p>
                      </div>
                      <div
                        className="flex items-center w-25 right-0 mt-1 cursor-pointer p-2 rounded hover:bg-[#22242A] transition-colors duration-200"
                        onClick={() => {
                          setPriceType("Limit");
                          close();
                        }}
                      >
                        <p
                          className={` text-[14px] ${
                            priceType === "Limit"
                              ? "text-[#00E3A5]"
                              : "text-[#848E9C]"
                          }`}
                        >
                          Limit
                        </p>
                      </div>
                    </div>
                  )}
                </ActiveDropdown>
              </div>
            </div>
            {/* Amount */}
            <div
              className="border border-gray-500 dark:bg-[#000] p-3 rounded-xl mt-3 hover:border-[#00E3A5] cursor-pointer"
              style={{
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
              }}
            >
              <span className="dark:text-[#fff] text-[14px]">Amount</span>
              <div className="flex items-center justify-between">
                <p className="text-[#848E9C] text-[18px] font-bold">
                  {percent}%
                </p>

                {/* chọn token */}
                <ActiveDropdown
                  trigger={
                    <div className="bg-[#2D3138] p-2 rounded-2xl flex items-center">
                      <Image
                        src={selectedCoin.icon} // icon USDT
                        alt=""
                        className="rounded-full"
                        width={16}
                        height={16}
                      />
                      <p className="text-white text-[12px] mx-1">
                        {selectedCoin.name}
                      </p>
                      <ChevronDown size={16} className="text-white mx-1" />
                    </div>
                  }
                >
                  {(close) => (
                    <div>
                      <div
                        className="flex items-center w-25 right-0 mt-1 cursor-pointer p-2 rounded hover:bg-[#22242A] transition-colors duration-200"
                        onClick={() => {
                          setSelectedCoin({
                            name: "USDT",
                            icon: "https://image.myx.finance/s3/67d7b856e4b06079c66e0241.webp",
                          });
                          close();
                        }}
                      >
                        <Image
                          src="https://image.myx.finance/s3/67d7b856e4b06079c66e0241.webp"
                          alt=""
                          className="rounded-full mx-1 "
                          width={16}
                          height={16}
                        />
                        <p>USDT</p>
                      </div>
                      <div
                        className="flex items-center w-25 right-0 mt-1 cursor-pointer p-2 rounded hover:bg-[#22242A] transition-colors duration-200"
                        onClick={() => {
                          setSelectedCoin({
                            name: selectedToken.name,
                            icon: selectedToken.icon1,
                          });
                          close();
                        }}
                      >
                        <Image
                          src={selectedToken.icon1}
                          alt=""
                          className="rounded-full mx-1"
                          width={16}
                          height={16}
                        />
                        <p>{selectedToken.name}</p>
                      </div>
                    </div>
                  )}
                </ActiveDropdown>
              </div>
              {/* thanh kéo */}
              <div className="mt-4 relative px-[6px]">
                {/* Track */}
                <div className="h-[2px] bg-gray-600 absolute top-1/2 left-[6px] right-[6px] -translate-y-1/2 z-0"></div>
                {/* Active track */}
                <div
                  className="h-[2px] bg-[#00E3A5] absolute top-1/2 left-[6px] -translate-y-1/2 z-0"
                  style={{ width: `calc(${percent}% - 6px)` }}
                ></div>
                {/* Marks */}
                <div className="flex justify-between relative z-10 pointer-events-none">
                  {marks.map((mark) => (
                    <div
                      key={mark}
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        percent >= mark ? "bg-[#00E3A5]" : "bg-gray-700"
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-[#1D1E24]"></div>
                    </div>
                  ))}
                </div>
                {/* Input range */}
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={percent}
                  onChange={(e) => setPercent(Number(e.target.value))}
                  className="absolute top-0 left-0 w-full h-6 opacity-0 cursor-pointer z-20"
                />
              </div>
              {/* Long / Short info */}
              {percent > 0 && (
                <div className="flex justify-between text-sm mt-3">
                  <p className="text-[#848E9C] text-[12px]">
                    Long{" "}
                    <span className="text-white font-bold">
                      0.0 {selectedToken.name}
                    </span>
                  </p>
                  <p className="text-[#848E9C] text-[12px]">
                    Short{" "}
                    <span className="text-white font-bold">
                      0.0 {selectedToken.name}
                    </span>
                  </p>
                </div>
              )}
            </div>
            {/* tp/sl */}
            <label className="flex items-center  space-x-2  mt-5 ">
              <input
                type="checkbox"
                className="accent-green-500"
                checked={enabledCheck}
                onChange={() => setEnabledCheck(!enabledCheck)}
              />
              <span className="text-[#848E9C] text-[12px] hover:text-green-500 cursor-pointer">
                TP/SL
              </span>
            </label>

            {enabledCheck && (
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={tp}
                  onChange={(e) => setTp(e.target.value)}
                  placeholder="TP"
                  className="border text-white border-gray-500 bg-[#1D1E24] p-2 rounded mt-3 w-full mr-2 hover:border-[#00E3A5] focus:border-[#00E3A5] focus:outline-none"
                  style={{
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
                  }}
                />
                <input
                  type="text"
                  value={sl}
                  onChange={(e) => setSl(e.target.value)}
                  placeholder="SL"
                  className="border text-white border-gray-500 bg-[#1D1E24] p-2 rounded mt-3 w-full ml-2 hover:border-[#00E3A5] focus:border-[#00E3A5] focus:outline-none"
                  style={{
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
                  }}
                />
              </div>
            )}
            {/* long/short */}
            <div className="flex items-center space-x-4 mt-3">
              <button
                className="px-6 py-2 rounded-lg font-medium text-black w-40 cursor-pointer "
                style={{
                  background: "linear-gradient(90deg, #00E3A5, #6AFFB3)",
                }}
              >
                Open Long
              </button>

              {/* Open Short */}
              <button
                className="px-6 py-2 rounded-lg font-medium text-black w-40 cursor-pointer"
                style={{
                  background: "linear-gradient(90deg, #FF6464, #FF4B4B)",
                }}
              >
                Open Short
              </button>
            </div>
            {/*  */}
            <div className="flex items-center justify-between mt-3">
              <div>
                <p>
                  <span className="text-[#848E9C] text-[12px]">Avbl</span>
                  <span className="dark:text-[#fff] text-[12px] mx-1">
                    0.0 {selectedToken.name}
                  </span>
                </p>
                <p>
                  <span className="text-[#848E9C] text-[12px]">Margin</span>
                  <span className="dark:text-[#fff] text-[12px] mx-1">0.0 USDT</span>
                </p>
              </div>
              <div>
                <p>
                  <span className="text-[#848E9C] text-[12px]">Avbl</span>
                  <span className="dark:text-[#fff] text-[12px] mx-1">
                    0.0 {selectedToken.name}
                  </span>
                </p>
                <p>
                  <span className="text-[#848E9C] text-[12px]">Margin</span>
                  <span className="dark:text-[#fff] text-[12px] mx-1">0.0 USDT</span>
                </p>
              </div>
            </div>
            {/* noel */}
            <img src="https://png.pngtree.com/png-vector/20230903/ourmid/pngtree-portrait-of-winter-character-cute-snowman-png-image_9944676.png" alt="bg" 
            className="w-50 mt-20 mx-10 h-50 object-cover rounded-xl pointer-events-none" />
          </div>
        )}
      </div>
      {/*  */}
      
    </div>
  );
}
