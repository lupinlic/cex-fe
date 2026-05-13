"use client";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBalanceStore } from "@/store/balanceStore";

interface FundingItem {
  token: { asset: string };
  available?: string;
  reserved?: string;
  locked?: string;
}

export default function FundingView() {
  const [hideZero, setHideZero] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { balances, rates, isLoading, error } = useBalanceStore();

  const assets = useMemo(() => {
    if (!balances?.funding) return [];

    return balances.funding.map((item: FundingItem) => {
      const coin = item.token.asset;
      const price = rates[coin?.toUpperCase()] || 0;
      const balance =
        parseFloat(item.available || "0") + parseFloat(item.reserved || "0");

      return {
        coin,
        icon: `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${coin.toLowerCase()}.png`|| "/logo.png",
        balance,
        available: parseFloat(item.available || "0"),
        locked: parseFloat(item.locked || "0"),
        price,
        usdtValue: balance * price,
        vndValue: balance * price * 26000,
      };
    });
  }, [balances, rates]);

  const handleTransferClick = () => {
    router.push("/balance/tranfer");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 space-y-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 space-y-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg font-semibold">{error}</p>
          <p className="text-muted-foreground mt-2">Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  const totalUSDT = assets.reduce((sum, a) => sum + (a.usdtValue || 0), 0);
  const totalVND = assets.reduce((sum, a) => sum + (a.vndValue || 0), 0);

  const filteredAssets = assets.filter(
    (a) =>
      (!hideZero || a.balance > 0) &&
      (a.coin?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Tài khoản Funding</h1>
        <div className="flex space-x-2">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/80 transition" onClick={handleTransferClick}>
            Nạp
          </button>
          <button className="px-5 cursor-pointer py-2 rounded-md bg-sidebar text-sidebar-foreground hover:bg-sidebar-border font-medium" onClick={handleTransferClick}>
            Mua Crypto
          </button>
          <button className="px-5 cursor-pointer py-2 rounded-md bg-sidebar text-sidebar-foreground hover:bg-sidebar-border font-medium" onClick={handleTransferClick}>
            Rút
          </button>
          <button
            className="px-5 cursor-pointer py-2 rounded-md bg-sidebar text-sidebar-foreground hover:bg-sidebar-border font-medium"
            onClick={handleTransferClick}
          >
            Chuyển
          </button>
        </div>
      </div>

      {/* Tổng số dư */}
      <div className="border border-border rounded-xl p-6">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-sm text-gray-500">Tổng số dư</div>
            <div className="text-4xl font-semibold mt-1">
              {totalUSDT.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              <span className="text-gray-400 text-xl">USDT</span>
            </div>
            <div className="text-gray-400 text-sm mt-1">
              ≈ {totalVND.toLocaleString("vi-VN")} VND
            </div>
          </div>
          <div className="text-green-500 text-sm mt-2">
            Lời/Lỗ hôm nay +0.00 VND
          </div>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex space-x-4 text-sm">
          <button className=" border-b-2 border-primary pb-1">
            Tiền điện tử
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background text-sm px-9 py-2 rounded-lg border border-border focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          <label className="flex items-center space-x-2 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={hideZero}
              onChange={(e) => setHideZero(e.target.checked)}
              className="accent-sky-500"
            />
            <span>Ẩn tài sản số dư 0</span>
          </label>
          <button className="flex items-center text-sky-400 text-sm hover:underline">
            <span>Chuyển đổi số lượng nhỏ sang LVS</span>
          </button>
        </div>
      </div>

      {/* Bảng tài sản */}
      <div className="border border-border rounded-xl mt-2 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-primary border-b border-border">
            <tr className="text-left">
              <th className="p-4 font-medium">Coin</th>
              <th className="p-4 font-medium">Tổng số dư</th>
              <th className="p-4 font-medium">Khả dụng</th>
              <th className="p-4 font-medium">Đang khóa</th>
              <th className="p-4 font-medium">Giá (USDT)</th>
              <th className="p-4 font-medium">Giá trị (USDT)</th>
              <th className="p-4 font-medium">Hoạt động</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 py-6">
                  Không có tài sản
                </td>
              </tr>
            ) : (
              filteredAssets.map((a) => (
                <tr
                  key={a.coin}
                  className="border-b border-border hover:bg-muted cursor-pointer"
                >
                  <td className="p-4 flex items-center space-x-2">
                    <img
                      src={a.icon}
                      alt={a.coin}
                      className="w-5 h-5 rounded-full"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src =
                          "/logo.png")
                      }
                    />
                    <span>{a.coin}</span>
                  </td>
                  <td className="p-4">{a.balance.toFixed(2)}</td>
                  <td className="p-4">{a.available.toFixed(2)}</td>
                  <td className="p-4">{a.locked.toFixed(2)}</td>
                  <td className="p-4 text-gray-400">
                    {a.price.toLocaleString("en-US")}
                  </td>
                  <td className="p-4">
                    {a.usdtValue.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="p-4 flex space-x-3 text-sky-400">
                    <button className="hover:underline cursor-pointer">
                      Nạp
                    </button>
                    <button className="hover:underline cursor-pointer">
                      Mua
                    </button>
                    <button className="hover:underline cursor-pointer">
                      Rút
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
