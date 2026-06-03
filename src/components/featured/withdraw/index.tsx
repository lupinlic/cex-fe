"use client";
import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { useBalanceStore } from "@/store/balanceStore";
import toast from "react-hot-toast";
import CustomSelect from "@/components/shared/components/CustomSelect";
import { useGetNetworks, useGetTokens } from "@/api/tokenApi";
import { useGetWithdrawHistory, useWithDraw, useCalculateWithdrawFee } from "@/api/balanceApi";

export default function WithdrawView() {
  const { balances, refreshBalances } = useBalanceStore();
  const [coin, setCoin] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [coinId, setCoinId] = useState("");
  const [network_id, setNetwork_id] = useState("");
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [feeAmount, setFeeAmount] = useState<string>("");
  const [minWithdraw, setMinWithdraw] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { data: withdrawHistory, refetch: refreshHistory, isLoading: historyLoading } = useGetWithdrawHistory();

  // Debug: log withdraw history data
  useEffect(() => {
    console.log("Withdraw history data:", withdrawHistory);
    console.log("Withdraw history loading:", historyLoading);
  }, [withdrawHistory, historyLoading]);

  const { data: tokenList } = useGetTokens();

  const coinOptions = useMemo(
    () => {
      // Chỉ hiển thị những token có balance > 0
      const tokensWithBalance = tokenList?.filter((token) => {
        const fundingBalance = balances.funding.find(
          (b) => b.token?.asset === token.asset
        );
        return Number(fundingBalance?.available || 0) > 0;
      }) ?? [];
      return tokensWithBalance.map((t) => t.asset);
    },
    [tokenList, balances.funding]
  );

  useEffect(() => {
    const token = tokenList?.find((t) => t.asset === coin);
    setCoinId(token?.id ?? "");
    setNetwork("");
  }, [coin, tokenList]);

  const { data: networkList } = useGetNetworks(coinId);
  const networkOptions = useMemo(
    () => networkList?.map((n) => n.network.name) ?? [],
    [networkList]
  );
  const { calculateFee, isLoading: feeLoading } = useCalculateWithdrawFee();

  useEffect(() => {
    const networkchose = networkList?.find((n) => n?.network?.name === network);
    setNetwork_id(networkchose?.network?.id ?? "");
    setFeeAmount(networkchose?.feeWithdraw ?? "");
    setMinWithdraw(networkchose?.feeWithdrawMin ?? "");
  }, [network, networkList]);

  useEffect(() => {
    if (!coinId || !network_id || !address || !amount) {
      return;
    }

    calculateFee({
      network_id,
      token_id: coinId,
      to_address: address,
      amount,
    })
      .then((data) => {
        if (data?.fee) {
          setFeeAmount(String(data.fee));
        }
      })
      .catch((err) => {
        console.error('Withdraw fee calculation failed', err);
      });
  }, [coinId, network_id, address, amount, calculateFee]);
  console.log("Calculated fee:", network_id);

  const getAvailableBalance = (): number => {
    if (!coin) return 0;
    const fundingBalance = balances.funding.find(
      (b) => b.token?.asset === coin
    );
    return Number(fundingBalance?.available || 0);
  };

  const availableBalance = getAvailableBalance();

  useEffect(() => {
    if (!coin) {
      setCurrentStep(1);
    } else if (coin && (!network || !address)) {
      setCurrentStep(2);
    } else if (coin && network && address) {
      setCurrentStep(3);
    }
  }, [coin, network, address]);

  const steps = [{ id: 1 }, { id: 2 }, { id: 3 }];

  const handleMaxAmount = () => {
    const maxAmount = Math.max(0, availableBalance - Number(feeAmount));
    setAmount(maxAmount.toFixed(8));
  };

  const withdraw = useWithDraw();

  const handleSubmit = () => {
    if (coin && network && address && amount) {
      const amountNum = parseFloat(amount);
      if (amountNum < parseFloat(minWithdraw)) {
        toast.error(`Số tiền tối thiểu là ${minWithdraw} ${coin}`);
        return;
      }
      if (amountNum > availableBalance) {
        toast.error("Số dư không đủ!");
        return;
      }

      setIsLoading(true);

      withdraw({
        network_id: network_id,
        token_id: coinId,
        to_address: address,
        amount: amount,
      })
        .then((data) => {
          toast.success(
            `Đã xử lý rút ${amount} ${coin} đến địa chỉ ${address}`
          );

          refreshBalances();
          refreshHistory();

          if (data?.status === "confirmed") {
            toast.success("Rút tiền thành công!");
          }
        })
        .catch((err) => {
          console.error("Lỗi rút tiền:", err);
          toast.error(err.message || "Rút tiền thất bại");
          console.error("Withdraw error details:", {
            network_id,
            token_id: coinId,
            to_address: address,
            amount,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const receiveAmount =
    amount && parseFloat(amount) > 0
      ? Math.max(0, parseFloat(amount) - parseFloat(feeAmount)).toFixed(8)
      : "0";

  return (
    <div className="bg-black text-white w-full p-6 flex lg:flex-row flex-col gap-10 px-20 justify-center">
      <div className="flex justify-center lg:justify-start">
        <div className="relative flex flex-col items-center py-8">
          <div
            className={`absolute left-1/2 top-10 w-0.5 bg-gray-700 -translate-x-1/2 transition-all duration-300 ${
              currentStep >= 3 ? "h-[420px]" : "h-[250px]"
            }`}
          />
          <div className="relative z-10 flex flex-col gap-24 w-full items-center">
            {steps.map((step) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              const marginBottom =
                step.id === 3
                  ? "0"
                  : step.id === 2 && currentStep >= 3
                  ? "160px"
                  : "0px";

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center gap-2"
                  style={{ marginBottom }}
                >
                  <div
                    className={`
                      w-6 h-6 flex rotate-45 items-center justify-center
                      font-semibold text-base transition-all duration-300
                      ${
                        isCompleted
                          ? "bg-white text-black shadow-lg"
                          : isCurrent
                          ? "bg-white text-black shadow-lg scale-110"
                          : "bg-gray-700 text-gray-400"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 rotate-[-45deg]" strokeWidth={3} />
                    ) : (
                      <p className="rotate-[-45deg] text-xs">{step.id}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[460px] mt-6 space-y-12">
        <div>
          <CustomSelect
          label="Chọn đồng coin"
          options={coinOptions}
          value={coin ?? ""}
          onChange={(val) => {
            setCoin(val);
            setAmount("");
          }}
        />
          {coin && (
          <div className="px-1 pt-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-400">Số dư khả dụng</span>
              <span className="text-[10px] text-gray-400">
                {availableBalance.toFixed(2)} {coin}
              </span>
            </div>
          </div>
        )}
        </div>
          <div className="mb-2">
            <label className="block mb-3 text-sm">Rút về</label>
            <div className="flex gap-2">
              <button className="px-4 py-2 border-b-2 border-green-500 text-sm">
                Địa chỉ
              </button>
              <button className="px-4 py-2 text-gray-400 text-sm hover:text-white">
                Người dùng LVS
              </button>
            </div>
          </div>

        {coin && (
          <>
            <div className="mb-2">
              <label className="block mb-2 text-sm text-gray-400">Địa chỉ</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nhập địa chỉ"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-500"
                />
                <button
                  onClick={async () => {
                    const text = await navigator.clipboard.readText();
                    setAddress(text);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs hover:text-white cursor-pointer"
                >
                  Paste
                </button>
              </div>
              {!address && (
                <p className="text-xs text-red-500 mt-1">
                  Vui lòng nhập địa chỉ của người nhận
                </p>
              )}
            </div>

            <CustomSelect
              label="Chọn mạng"
              options={networkOptions}
              value={network ?? ""}
              onChange={(val) => setNetwork(val)}
            />
          </>
        )}

        {coin && network && address && (
          <>
            <div>
              <label className="block mb-2 text-sm">Số lượng</label>
              <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-transparent text-2xl w-full focus:outline-none"
                    step="any"
                  />
                  <span className="text-gray-400 text-sm ml-2">{coin}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    Có thể sử dụng: {availableBalance.toFixed(8)} {coin}
                  </span>
                  <button
                    onClick={handleMaxAmount}
                    className="text-green-500 hover:text-green-400 font-medium cursor-pointer"
                  >
                    Tối đa
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Tối thiểu: {minWithdraw} {coin}
              </p>
            </div>

            <div className="space-y-2 text-sm bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Phí giao dịch</span>
                <span>
                  {feeAmount} {coin}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Nhận được</span>
                <span className="text-white font-medium">
                  {receiveAmount} {coin}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                if (!amount) return;
                setIsLoading(true);
                handleSubmit();
              }}
              disabled={
                !amount ||
                parseFloat(amount) < parseFloat(minWithdraw) ||
                parseFloat(amount) > availableBalance
              }
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-black font-medium py-3 rounded-lg transition-colors cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin mr-2 h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="white"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    />
                  </svg>
                  Sending...
                </>
              ) : (
                "Rút tiền"
              )}
            </button>
          </>
        )}
      </div>

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
            {historyLoading ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400 text-sm">
                Đang tải lịch sử rút tiền...
              </div>
            ) : !withdrawHistory || withdrawHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500 text-sm">
                📄 Không có lịch sử rút tiền gần đây
              </div>
            ) : (
              withdrawHistory.slice(0, 10).map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-center bg-gray-800/50 rounded px-3 py-2 hover:bg-gray-700/70 transition-all text-xs"
                >
                  <div className="flex flex-col">
                    <span>
                      {tx.amount} {tx.token?.asset ?? ""}
                    </span>
                    <span className="text-gray-400 truncate max-w-[200px]">
                      {tx.excuAddress}
                    </span>
                    <span className="text-gray-500 text-[10px] mt-1">
                      {tx.txHash ? `Tx: ${tx.txHash.slice(0, 10)}...` : ""}
                    </span>
                    <span className="text-gray-500 text-[10px] mt-1">
                      {new Date(tx.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                      tx.status === "broadcasted"
                        ? "bg-green-500/20 text-green-400"
                        : tx.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {tx.status === "broadcasted"
                      ? "Confirmed"
                      : tx.status === "pending"
                      ? "Đang chờ"
                      : "Failed"}
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