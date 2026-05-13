"use client";
import { useState, useEffect, useMemo } from "react";
import { ArrowLeftRight } from "lucide-react";
import CustomSelect from "@/components/shared/components/CustomSelect";
import { useBalanceStore } from "@/store/balanceStore";
import toast from "react-hot-toast";
import { useGetTokens } from "@/api/tokenApi";

export default function TransferView() {

  const accounts = ["Spot", "Funding", "Futures"];
  const { balances, transfer } = useBalanceStore();
  const [fromAccount, setFromAccount] = useState("Funding");
  const [toAccount, setToAccount] = useState("Spot");
  const [selectedCoin, setSelectedCoin] = useState("");
  const [amount, setAmount] = useState("");
  const [available, setAvailable] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { data: tokenList } = useGetTokens();
  const coinOptions = useMemo(
      () => tokenList?.map((t) => t.asset) ?? [],
      [tokenList]
    );

  useEffect(() => {
    if (!selectedCoin && tokenList?.length) {
      setSelectedCoin(tokenList[0].asset);
      return;
    }

    const list =
      fromAccount === "Funding"
        ? balances.funding
        : fromAccount === "Spot"
        ? balances.spot
        : balances.futures;

    const coin = list?.find(
      (b) => b.token?.asset?.toUpperCase() === selectedCoin.toUpperCase()
    );

    setAvailable(Number(coin?.available || 0));
    // preserve amount when user changes only account/coin
    if (selectedCoin && coin) {
      setAmount("");
    }
  }, [fromAccount, selectedCoin, balances]);

  const handleSwap = () => {
    setFromAccount(toAccount);
    setToAccount(fromAccount);
    setAmount("");
  };

  const handleTransfer = async () => {
  if (!amount || Number(amount) <= 0) {
    toast.error("Vui lòng nhập số lượng hợp lệ");
    return;
  }

  // 💣 Hiện đại bác và bắn coin
  const cannon = document.getElementById("cannon");
  const container = document.getElementById("coin-container");

  if (cannon && container) {
    // hiện súng
    cannon.classList.add("active");

    // tạo đồng coin
    const coin = document.createElement("div");
    coin.classList.add("coin");

    const coinIcons: Record<"USDT" | "BTC" | "ETH", string> = {
      USDT: "https://png.pngtree.com/png-clipart/20241117/original/pngtree-tether-crypto-coin-in-gold-gradation-color-vector-png-image_17121792.png",
      BTC: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png",
      ETH: "https://s2.coinmarketcap.com/static/img/coins/200x200/1027.png",
    };

    coin.style.backgroundImage = `url(${coinIcons[selectedCoin as keyof typeof coinIcons] || coinIcons.USDT})`;
    container.appendChild(coin);

    // coin và súng tự ẩn sau 3 giây
    setTimeout(() => {
      coin.remove();
      cannon.classList.remove("active");
    }, 3000);
  }

  // ⚙️ Gọi API chuyển tiền
  setIsLoading(true);
  try {
    await transfer({
      fromWalletType: fromAccount.toUpperCase() as "SPOT" | "FUNDING" | "FUTURES",
      toWalletType: toAccount.toUpperCase() as "SPOT" | "FUNDING" | "FUTURES",
      amount: amount,
      assetToken: selectedCoin,
    });
    toast.success("Chuyển thành công");
    setAmount("");
  } catch (err) {
    toast.error("Chuyển thất bại");
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="flex flex-row justify-between relative bg-background text-foreground min-h-screen p-4">
      {/* Form chuyển tiền */}
      <div className="w-full max-w-md space-y-6 bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-md font-semibold mb-2">Chọn tài khoản</h2>

        <div className="rounded-xl p-4 border border-border space-y-4 relative bg-background">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-xs mr-4">Từ</span>
            <CustomSelect
              options={accounts}
              value={fromAccount}
              onChange={setFromAccount}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-2 bg-sidebar hover:bg-sidebar-border rounded-full transition"
            >
              <ArrowLeftRight size={18} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-xs mr-4">Đến</span>
            <CustomSelect
              options={accounts}
              value={toAccount}
              onChange={setToAccount}
            />
          </div>
        </div>

        <div>
          <h2 className="text-md font-semibold mb-2">Chọn coin</h2>
          <CustomSelect
            options={coinOptions}
            value={selectedCoin}
            onChange={setSelectedCoin}
          />
        </div>

        <div>
          <h2 className="text-md font-semibold mb-2">Số lượng chuyển</h2>
          <div className="rounded-xl p-4 flex items-center justify-between border border-border bg-background">
            <input
              type="number"
              placeholder="Nhập vào đây"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent outline-none text-foreground placeholder-muted flex-1"
            />
            <button
              onClick={() => setAmount(String(available))}
              className="text-primary text-sm  ml-3 cursor-pointer hover:underline"
            >
              MAX
            </button>
          </div>

          <div className="text-right text-xs text-muted-foreground mt-1">
            {available.toLocaleString("en-US", { maximumFractionDigits: 6 })}{" "}
            {selectedCoin}
          </div>
        </div>

        <button
          disabled={isLoading}
          onClick={handleTransfer}
          className={`w-full cursor-pointer font-semibold py-3 rounded-xl transition ${
            isLoading
              ? "bg-muted text-muted-foreground"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isLoading ? "Đang xử lý..." : "Xác nhận"}
        </button>
      </div>
    </div>
  );
}
