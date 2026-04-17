"use client";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import ActiveDropdown from "@/components/shared/components/ActiveDropdown";
import { Token } from "@/util/Token";
import { useSpotTradingData } from "@/store/spotTradingStore";
import { useBalanceStore } from "@/store/balanceStore";
import toast, { Toaster } from "react-hot-toast";
import Decimal from "decimal.js";

interface SpotOrderFormProps {
  tokenList: Token[];
  selectedToken: Token;
  setSelectedToken: (token: Token) => void;
}

type DecimalLike =
  | string
  | number
  | InstanceType<typeof Decimal>
  | null
  | undefined;

const D = (v: DecimalLike) => new Decimal(v || 0);
const formatNum = (v: DecimalLike, digits = 6) =>
  D(v || 0).toFixed(digits, Decimal.ROUND_DOWN);
export default function Trading({
  tokenList,
  selectedToken,
  setSelectedToken,
}: SpotOrderFormProps) {
  const { ticker, symbol } = useSpotTradingData();
  const { balances, refreshBalances } = useBalanceStore();

  const [orderType, setOrderType] = useState<"BUY" | "SELL">("BUY");
  const [priceType, setPriceType] = useState<"MARKET" | "LIMIT">("MARKET");
  const [price, setPrice] = useState<string>("0");
  const [percent, setPercent] = useState(0);
  const [usdtAmount, setUsdtAmount] = useState<string>("");
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [lastChanged, setLastChanged] = useState<
    "usdt" | "token" | "percent" | null
  >(null);

  const NUM_PUMPKINS = 10;
  const pumpkins = Array.from({ length: NUM_PUMPKINS }).map((_, i) => ({
    id: i,
    x: Math.random() * 100 - 50, // -50 -> +50 px ngang
    y: Math.random() * -50 - 20, // -20 -> -70 px lên trên
    rotate: Math.random() * 360,
    delay: Math.random() * 0.3,
  }));

  const marks = [0, 25, 50, 75, 100];

  // --- Balances ---
  const availableUSDT = D(
    balances.spot?.find((b) => b.token.asset === "USDT")?.available ?? 0,
  );
  const availableToken = D(
    balances.spot?.find(
      (b) =>
        b.token.asset ===
        selectedToken?.symbol.toUpperCase().replace("USDT", ""),
    )?.available ?? 0,
  );
  const formatDisplay = (value: DecimalLike) => {
  if (!value) return "";

  const num = Number(value);

  // Giới hạn 6 số thập phân
  const fixed = num.toFixed(6);

  // Xóa số 0 dư phía sau
  return fixed.replace(/\.?0+$/, "");
};

  // --- Update price if MARKET ---
  useEffect(() => {
    if (priceType === "MARKET") setPrice(ticker?.lastPrice?.toString() || "0");
  }, [ticker?.lastPrice, priceType]);

  // --- Auto update USDT/token when price changes ---
  useEffect(() => {
    if (!price || D(price).lte(0)) return;
    if (lastChanged === "usdt") {
      const newToken = D(usdtAmount).div(D(price));
      setTokenAmount(formatNum(newToken));
    } else if (lastChanged === "token") {
      const newUsdt = D(tokenAmount).times(D(price));
      setUsdtAmount(formatNum(newUsdt));
    } else if (lastChanged === "percent") {
      const usdt = availableUSDT.times(percent).div(100);
      setUsdtAmount(formatNum(usdt));
      setTokenAmount(formatNum(usdt.div(D(price))));
    }
  }, [price]);

  // --- Input handler ---
  const handleInputChange = (type: "usdt" | "token", rawVal: string) => {
    let val = rawVal.replace(/[^0-9.]/g, "");
    if (val.startsWith("0") && !val.startsWith("0."))
      val = val.replace(/^0+/, "");
    const parts = val.split(".");
    if (parts.length > 2) val = parts[0] + "." + parts[1];
    const d = D(val || 0);
    if (d.isNaN()) return;

    if (type === "usdt") {
      if (d.gt(availableUSDT)) val = availableUSDT.toString();
      setLastChanged("usdt");
      setUsdtAmount(val);
      setTokenAmount(formatNum(D(val).div(D(price || 0))));
      const denom = availableUSDT.eq(0) ? new Decimal(1) : availableUSDT;
      setPercent(D(val).div(denom).times(100).toNumber());
    } else {
      if (d.gt(availableToken)) val = availableToken.toString();
      setLastChanged("token");
      setTokenAmount(val);
      const usdt = D(val).times(D(price || 0));
      setUsdtAmount(formatNum(usdt));
      const denom = availableUSDT.eq(0) ? new Decimal(1) : availableUSDT;
      setPercent(usdt.div(denom).times(100).toNumber());
    }
  };

  // --- Submit Order ---
  const handleSubmit = async () => {
    if (D(usdtAmount).lte(0) || D(tokenAmount).lte(0)) {
      toast.error("Please enter amount");
      return;
    }
    if (orderType === "BUY" && D(usdtAmount).gt(availableUSDT)) {
      toast.error("Insufficient USDT balance");
      return;
    }
    if (orderType === "SELL" && D(tokenAmount).gt(availableToken)) {
      toast.error(
        `Insufficient ${selectedToken?.symbol.toUpperCase()} balance`,
      );
      return;
    }

    try {
      const orderPayload = {
        symbol: symbol?.toUpperCase() ?? "BTCUSDT",
        side: orderType,
        type: priceType,
        walletType: "SPOT",
        price,
        quantity: tokenAmount,
        quote_quantity: usdtAmount,
        client_order_id: Date.now().toString(),
      };
      console.log("Fake placing spot order:", orderPayload);
      toast.success("Order placed successfully!");
      refreshBalances();
    } catch (error: any) {
      console.error(
        "Order error:",
        error?.response?.data || error?.message || error,
      );
      toast.error("Failed to place order");
    }
  };

  // --- Button hover style ---
  const buttonStyle = {
    background:
      orderType === "BUY"
        ? "linear-gradient(90deg, #00E3A5, #6AFFB3)"
        : "linear-gradient(90deg, #FF6464, #FF4B4B)",
    color: "#fff",
    transition: "all 0.25s ease",
  };

  return (
    <div className="w-full">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: "#333", color: "#fff", zIndex: 10000 },
          success: { iconTheme: { primary: "#4ade80", secondary: "#fff" } },
        }}
      />
      {/* --- Tabs: Buy / Sell --- */}
      <div className="flex mt-2 bg-[#1F2023] rounded-md mt-4">
        {["BUY", "SELL"].map((type) => (
          <button
            key={type}
            className={`flex-1 py-2 text-[12px] cursor-pointer rounded-md  ${
              orderType === type
                ? type === "BUY"
                  ? "bg-[#26C99B] text-white"
                  : "bg-[#F1493F] text-white"
                : "bg-transparent text-white"
            }`}
            onClick={() => setOrderType(type as "BUY" | "SELL")}
          >
            {type==="BUY" ? "Mua" : "Bán"}
          </button>
        ))}
      </div>

      {/* --- Price Type --- */}
      <div className="flex items-center mt-5 text-[12px] space-x-4">
        {["MARKET", "LIMIT"].map((type) => (
          <button
            key={type}
            className={`cursor-pointer ${
              priceType === type
                ? "text-foreground border-b-2 border-foreground py-1"
                : "text-[#848E9C]"
            }`}
            onClick={() => {
              setPriceType(type as "MARKET" | "LIMIT");
              if (type === "MARKET")
                setPrice(ticker?.lastPrice?.toString() || "0");
            }}
          >
            {type==="MARKET" ? "Thị trường" : "Giới hạn"}
          </button>
        ))}
      </div>

      {/* --- Price Input --- */}
      <div className="mt-4">
        <span className="text-gray-500 text-[13px]">Giá</span>
        <div className="flex items-center justify-between mt-1 bg-[#1D1E24] p-1 rounded">
          <input
            type="text"
            inputMode="decimal"
            value={price}
            onChange={(e) => {
              let val = e.target.value.replace(/[^0-9.]/g, "");
              const parts = val.split(".");
              if (parts.length > 2) val = parts[0] + "." + parts[1];

              if (
                val.length > 1 &&
                val.startsWith("0") &&
                !val.startsWith("0.")
              ) {
                val = val.replace(/^0+/, "");
              }

              if (val === "") val = "0";

              setPrice(val);
            }}
            className={`w-[200px] bg-[#1D1E24] text-[14px] p-2 outline-none rounded-sm  ${
              priceType === "MARKET" ? "text-gray-500" : "text-foreground"
            }`}
          />
          <p className="text-gray-500 text-[14px] mx-3">USDT</p>
        </div>
      </div>

      {/* --- Amount Inputs --- */}
      <div className="mt-4">
        <span className="text-gray-500 text-[13px]">Số lượng</span>
        <div className="flex items-center justify-between mt-1 bg-[#1D1E24] p-1 rounded">
          <input
            type="text"
            inputMode="decimal"
            value={formatDisplay(usdtAmount)}
            onChange={(e) => handleInputChange("usdt", e.target.value)}
            className=" text-white p-2 rounded w-full outline-none"
          />
          <p className="text-gray-500 text-[14px] mx-3">USDT</p>
        </div>
        {/* --- Slider --- */}
        <div className="my-4 relative px-[6px]">
          <div className="h-[2px] bg-gray-600 absolute top-1/2 left-[6px] right-[6px] -translate-y-1/2 z-0" />
          <div
            className="h-[2px] bg-[#00E3A5] absolute top-1/2 left-[6px] -translate-y-1/2 z-0"
            style={{ width: `calc(${percent}% - 6px)` }}
          />
          <div className="flex justify-between relative z-10 pointer-events-none">
            {marks.map((mark) => (
              <div
                key={mark}
                className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  percent >= mark ? "bg-[#00E3A5]" : "bg-gray-700"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-[#1D1E24]" />
              </div>
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={percent}
            onChange={(e) => {
              const p = Number(e.target.value);
              setLastChanged("percent");
              setPercent(p);
              const usdt = availableUSDT.times(p).div(100);
              setUsdtAmount(formatNum(usdt));
              setTokenAmount(formatNum(D(usdt).div(D(price || 0))));
            }}
            className="absolute top-0 left-0 w-full h-6 opacity-0 cursor-pointer z-20"
          />
        </div>
        <span className="text-gray-500 text-[13px]">Tổng({selectedToken?.symbol.toUpperCase().slice(0, -4)})</span>

        <div className="flex items-center justify-between mt-1 bg-[#1D1E24] p-1 rounded">
          <input
            type="text"
            inputMode="decimal"
            value={formatDisplay(tokenAmount)}
            onChange={(e) => handleInputChange("token", e.target.value)}
            className="bg-[#1D1E24] text-white p-2 rounded w-full outline-none"
          />
          <span className="text-gray-500 text-[14px] mx-3">
            {selectedToken?.symbol.toUpperCase().slice(0, -4)}
          </span>
        </div>

        {/* --- Submit Button --- */}
        <div className="relative w-full inline-block">
          <button
            className="mt-4 px-6 py-2 rounded-lg font-medium text-black w-full cursor-pointer"
            style={buttonStyle}
            onClick={handleSubmit}
          >
            {orderType==="BUY" ? "Mua" : "Bán"} {selectedToken?.symbol.toUpperCase().slice(0, -4)}
          </button>
        </div>

        {/* --- Balances --- */}
        <div className="mt-3 space-y-2 text-[12px]">
          {(() => {
            const baseAsset = selectedToken?.symbol
              ?.toUpperCase()
              ?.replace("USDT", ""); // VD: ETH từ ETHUSDT
            const displayAssets = ["USDT", baseAsset];

            // Tìm số dư từng loại
            const getBalance = (asset: string) => {
              const found = balances.spot?.find((b) => b.token.asset === asset);
              return {
                asset,
                available: found ? formatNum(found.available, 4) : "0.0000",
                locked: found ? formatNum(found.locked, 4) : "0.0000",
              };
            };

            // Luôn trả về cả 2 loại coin
            const displayBalances = displayAssets.map((asset) =>
              getBalance(asset),
            );
            return displayBalances.map((b, index) => (
              <div key={index} className="flex justify-between">
                <p className="text-[#848E9C]">
                  Khả dụng:{" "}
                  <span className="text-white">
                    {formatDisplay(b.available)} {b.asset}
                  </span>
                </p>
                <p className="text-[#848E9C]">
                  Khóa:{" "}
                  <span className="text-white">
                    {formatDisplay(b.locked)} {b.asset}
                  </span>
                </p>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}
