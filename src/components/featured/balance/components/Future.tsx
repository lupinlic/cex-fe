"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FutureView() {
  const [hideZero, setHideZero] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const assets = [
    {
      coin: "ETH",
      icon: "https://image.myx.finance/s3/67cfe6d7e4b06079318bb24e.webp",
      balance: 0.0000989,
      available: 0.0000989,
      reserved: 0,
      avgPrice: null,
      pnl: null,
      vndValue: 10884.78,
    },
    {
      coin: "BTC",
      icon: "https://image.myx.finance/s3/67da721fe4b06079cab893b5.webp",
      balance: 0,
      available: 0,
      reserved: 0,
      avgPrice: null,
      pnl: null,
      vndValue: 0,
    },
  ];

  const filteredAssets = assets.filter(
    (a) =>
      (!hideZero || a.balance > 0) &&
      a.coin.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const router = useRouter();
    const handleTransferClick = () => {
    router.push("/balance/tranfer");
    }
    const handleTradeClick = () => {
    router.push("/future");
    }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Tài khoản Future</h1>
        <div className="flex space-x-2">
          <button
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/80 transition"
            onClick={handleTransferClick}
          >
            Nạp
          </button>
          <button
            className="px-5 cursor-pointer py-2 rounded-md bg-sidebar text-sidebar-foreground hover:bg-sidebar-border font-medium"
            onClick={handleTransferClick}
          >
            Mua Crypto
          </button>
          <button
            className="px-5 cursor-pointer py-2 rounded-md bg-sidebar text-sidebar-foreground hover:bg-sidebar-border font-medium"
            onClick={handleTransferClick}
          >
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
      <div className=" border border-border rounded-xl p-6">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-sm text-gray-400">Tổng số dư</div>
            <div className="text-4xl font-semibold mt-1">0.41 USDT</div>
            <div className="text-gray-400 text-sm mt-1">≈ 10,884.78 VND</div>
          </div>
          <div className="text-green-400 text-sm mt-2">
            Lời/Lỗ hôm nay +1,116.69 VND
          </div>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex space-x-4 text-sm">
          <button className=" border-b-2 border-primary pb-1">
            Tài sản
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
            <Search
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
            />
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
        </div>
      </div>

      {/* Bảng tài sản */}
      <div className=" border border-border rounded-xl mt-2 overflow-hidden">
        <table className="w-full text-sm">
          <thead className=" border-b border-border">
            <tr className="text-left">
              <th className="p-4 font-medium">Coin</th>
              <th className="p-4 font-medium">Số dư ví</th>
              <th className="p-4 font-medium">Khả dụng</th>
              <th className="p-4 font-medium">Đóng băng</th>
              <th className="p-4 font-medium">Tiền thưởng giao dịch</th>
              <th className="p-4 font-medium">Tiền thưởng vị thế</th>
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
                  className="border-b border-border hover:bg-muted"
                >
                  <td className="p-4 flex items-center space-x-2">
                    <img src={a.icon} alt="" className="w-5 h-5" />
                    <span>{a.coin}</span>
                  </td>
                  <td className="p-4">{a.balance.toFixed(7)}</td>
                  <td className="p-4">{a.available.toFixed(7)}</td>
                  <td className="p-4">{a.reserved.toFixed(2)}</td>
                  <td className="p-4 text-gray-500">--</td>
                  <td className="p-4 text-gray-500">--</td>
                  <td className="p-4 flex space-x-3 text-sky-400">
                    <button className="hover:underline cursor-pointer" onClick={handleTransferClick}>Chuyển</button>
                    <button className="hover:underline cursor-pointer" onClick={handleTradeClick}>Giao dịch</button>
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
