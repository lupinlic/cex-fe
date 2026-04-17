"use client";
import { useState, useEffect, useMemo } from "react";
import CustomSelect from "@/components/shared/components/CustomSelect";
import { CheckCheck, Copy, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { useGetTokens, useGetNetworks } from "@/api/tokenApi";
import { useGetDepositHistory, useDeposit } from "@/api/balanceApi";
import { useTradingDataStore } from "@/store/tradingdataStore";

export default function DepositView() {
  const [coin, setCoin] = useState("");
  const [coinId, setCoinId] = useState("");
  const [network, setNetwork] = useState("");
  const [userId, setUserId] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const latestBlock = useTradingDataStore((state) => state.latestBlock);
  const { data: DepositHistory, refetch: refreshHistory } = useGetDepositHistory();

  useEffect(() => {
    setUserId(localStorage.getItem("user_id") || "");
  }, []);

  const { data: tokenList } = useGetTokens();

  const coinOptions = useMemo(
    () => tokenList?.map((t) => t.name) ?? [],
    [tokenList]
  );

  useEffect(() => {
    const token = tokenList?.find((t) => t.name === coin);
    setCoinId(token?.id ?? "");
    setNetwork("");
  }, [coin, tokenList]);

  const { data: networkList } = useGetNetworks(coinId.toString());

  const networkOptions = useMemo(
    () => networkList?.map((n) => n.network.name) ?? [],
    [networkList]
  );

  const selectedNetwork = networkList?.find((n) => n.network.name === network);
  const evmName = selectedNetwork?.network?.vmSystem?.name || "";

  const {
    data: depositRes,
    refetch: createAddress,
    loading: depositLoading,
  } = useDeposit({ user_id: userId, vm_name: evmName });

  useEffect(() => {
    if (!network || !coin) return;
    createAddress();
  }, [network]);

  useEffect(() => {
    refreshHistory();
  }, [latestBlock]);

  const walletAddress = depositRes?.address || "";

  useEffect(() => {
    if (!coin) setCurrentStep(1);
    else if (coin && !network) setCurrentStep(2);
    else setCurrentStep(3);
  }, [coin, network]);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1400);
  };

  return (
    <div className="bg-black text-white w-full p-6 flex lg:flex-row flex-col gap-10 justify-center">
      {/* LEFT - Step UI */}
      <div className="flex justify-center lg:justify-start">
        <div className="relative flex flex-col items-center py-8">
          <div className="absolute h-[250px] left-1/2 top-10 w-0.5 bg-gray-700 -translate-x-1/2" />
          <div className="relative z-10 flex flex-col gap-24 items-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center gap-2">
                <div
                  className={`w-6 h-6 flex rotate-45 items-center justify-center font-semibold text-base duration-300
                  ${
                    step < currentStep
                      ? "bg-white text-black"
                      : step === currentStep
                      ? "bg-white text-black scale-110"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {step < currentStep ? (
                    <Check
                      className="w-4 h-4 rotate-[-45deg]"
                      strokeWidth={3}
                    />
                  ) : (
                    <span className="rotate-[-45deg] text-xs">{step}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CENTER - Main UI */}
      <div className="w-full max-w-[460px] space-y-12">
        <CustomSelect
          label="Lựa chọn coin"
          options={coinOptions}
          value={coin}
          onChange={setCoin}
        />

        <CustomSelect
          label="Chọn mạng lưới"
          options={networkOptions}
          value={network}
          onChange={setNetwork}
        />

        {depositLoading && (
          <p className="text-xs text-blue-400 animate-pulse">
            Đang tạo địa chỉ ví...
          </p>
        )}

        {walletAddress && (
          <div>
            <label className="block mb-2 text-sm">Địa chỉ nạp tiền</label>
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-4 flex gap-4 items-center">
              <div className="w-24 h-24 bg-white p-2 rounded flex items-center justify-center">
                <QRCodeSVG value={walletAddress} size={88} />
              </div>

              <div className="flex-1">
                <p className="text-xs text-gray-400">Địa chỉ</p>
                <p className="text-sm font-mono break-words mb-2">
                  {walletAddress}
                </p>

                <button
                  onClick={handleCopy}
                  className="text-xs px-3 py-1 border border-gray-700 rounded flex items-center gap-1 hover:border-gray-400"
                >
                  {isCopied ? (
                    <>
                      <CheckCheck size={14} className="text-green-400" />
                      <span className="text-green-400">Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT - FAQ */}
      <div className="w-[500px] space-y-3 mt-10">
        <h3 className="font-semibold text-sm">FAQ</h3>
        <ul className="space-y-2 text-xs text-gray-300">
          <li className="hover:text-white cursor-pointer">
            Cách nạp tiền mã hóa? (Video)
          </li>
          <li className="hover:text-white cursor-pointer">
            Hướng dẫn nạp tiền từng bước
          </li>
          <li className="hover:text-white cursor-pointer">
            Tiền đã nạp vẫn chưa vào?
          </li>
          <li className="hover:text-white cursor-pointer">
            Truy vấn trạng thái nạp/rút
          </li>
        </ul>

        <div className="pt-8 border-t border-gray-800">
          <h3 className="font-semibold mb-4 text-sm">
            Giao dịch rút tiền gần đây
          </h3>
          <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto">
            {DepositHistory?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500 text-sm">
                📄 Không có lịch sử rút tiền gần đây
              </div>
            ) : (
              DepositHistory?.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-center bg-gray-800/50 rounded px-3 py-2 hover:bg-gray-700/70 transition-all text-xs"
                >
                  <div className="flex flex-col">
                    <span>
                      {tx.amount} {tx.token.asset}
                    </span>
                    <span className="text-gray-400 truncate max-w-[200px]">
                      {tx.excuAddress}
                    </span>
                    <span className="text-gray-500 text-[10px] mt-1">
                      {new Date(tx.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                      tx.status === "confirmed"
                        ? "bg-green-500/20 text-green-400"
                        : tx.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
