"use client";
import { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { ChevronDown, Eye, Search, Inbox, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBalanceStore } from "@/store/balanceStore";

interface BalanceItem {
  token?: { asset?: string };
  available?: string | number;
}

export default function BalanceView() {
  const [activeTab, setActiveTab] = useState<"taiSan" | "taiKhoan">("taiSan");
  const { balances, rates, isLoading, error, refreshBalances } = useBalanceStore();
  const router = useRouter();

  useEffect(() => {
    refreshBalances();
  }, [refreshBalances]);

  const handleTransferClick = () => {
    router.push("/balance/tranfer");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg font-semibold">{error}</p>
          <p className="text-muted-foreground mt-2">Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  // Dữ liệu ví dụ cho biểu đồ nhỏ
  const chartData = [
    { value: 5 },
    { value: 0.44 },
    { value: 0.5 },
    { value: 0.45 },
    { value: 0.7 },
  ];

  // Hàm quy đổi tổng USDT của từng loại ví
  const calcTotalUSDT = (arr: BalanceItem[]) =>
    arr.reduce((sum, b) => {
      const asset = b.token?.asset || "USDT";
      const rate = rates[asset] || 0;
      const valueInUSDT = Number(b.available || 0) * rate;
      return sum + valueInUSDT;
    }, 0);

  const totalBalances = {
    USDT:
      calcTotalUSDT(balances.spot) +
      calcTotalUSDT(balances.funding) +
      calcTotalUSDT(balances.futures),
  };

  const accountsData = [
    {
      name: "Spot",
      amount: calcTotalUSDT(balances.spot),
      vnd:
        "≈ " +
        (calcTotalUSDT(balances.spot) * 26000).toLocaleString("vi-VN") +
        " VND",
      percent: 0,
    },
    {
      name: "Funding",
      amount: calcTotalUSDT(balances.funding),
      vnd:
        "≈ " +
        (calcTotalUSDT(balances.funding) * 26000).toLocaleString("vi-VN") +
        " VND",
      percent: 0,
    },
    {
      name: "Futures",
      amount: calcTotalUSDT(balances.futures),
      vnd:
        "≈ " +
        (calcTotalUSDT(balances.futures) * 26000).toLocaleString("vi-VN") +
        " VND",
      percent: 0,
    },
  ];

  // Tính tỷ lệ phần trăm
  const total = accountsData.reduce((sum, acc) => sum + acc.amount, 0);
  accountsData.forEach((acc) => {
    acc.percent = total
      ? parseFloat(((acc.amount / total) * 100).toFixed(2))
      : 0;
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-6 space-y-6">
      <p className="text-2xl font-bold">Tài sản</p>
      {/* Tổng số dư */}
      <div className="p-6 rounded-xl border border-border bg-card text-card-foreground flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Left side */}
        <div className="space-y-2">
          <div className="flex items-center gap-2  text-sm">
            <span>Tổng số dư</span>
            <Eye size={16} />
          </div>
          <div className="text-4xl font-bold">
            {totalBalances["USDT"]?.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            }) || 0}
            <span className=" text-lg font-medium mx-2">USDT</span>
          </div>
          <div className="text-primary text-sm">
            ≈ {(Number(totalBalances["USDT"]) * 26000).toLocaleString("vi-VN")}{" "}
            VND
          </div>

          {/* Nút hành động */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button className="px-5 py-2 cursor-pointer rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/80 transition flex items-center gap-1"
            onClick={
              ()=>router.push('/deposit')
            }
            >
              Nạp <ChevronDown size={16} />
            </button>
            <button className="px-5 cursor-pointer py-2 rounded-md bg-sidebar text-sidebar-foreground hover:bg-sidebar-border font-medium">
              Mua Crypto
            </button>
            <button className="px-5 cursor-pointer py-2 rounded-md bg-sidebar text-sidebar-foreground hover:bg-sidebar-border font-medium flex items-center gap-1">
              Rút <ChevronDown size={16} />
            </button>
            <button
              className="px-5 py-2 cursor-pointer rounded-md bg-sidebar text-sidebar-foreground hover:bg-sidebar-border font-medium"
              onClick={handleTransferClick}
            >
              Chuyển
            </button>
          </div>
        </div>

        {/* Biểu đồ bên phải */}
        <div className="w-full md:w-1/3 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#00C6FF"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs: Tài sản / Tài khoản */}
      <div className="p-4 rounded-xl border border-border bg-card text-card-foreground">
        <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
          {/* Tabs */}
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("taiSan")}
              className={`pb-2 font-medium cursor-pointer ${
                activeTab === "taiSan"
                  ? " border-b-2 border-foreground "
                  : " "
              }`}
            >
              Tài sản
            </button>
            <button
              onClick={() => setActiveTab("taiKhoan")}
              className={`pb-2 font-medium cursor-pointer ${
                activeTab === "taiKhoan"
                  ? " border-b-2 border-foreground "
                  : ""
              }`}
            >
              Tài khoản
            </button>
          </div>

          {/* Ô tìm kiếm */}
          <div className="flex items-center bg-[var(--popover)] px-3 py-1.5 rounded-md border border-border text-sm text-muted w-56">
            <Search size={16} className="mr-2" />
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="bg-transparent outline-none text-foreground w-full"
            />
          </div>
        </div>

        {/* Bảng nội dung */}
        {activeTab === "taiSan" ? (
          <div className="text-sm flex justify-center items-center py-8">
            <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
              <Inbox size={40} />
              <span className="mt-2">Không có dữ liệu</span>
            </div>
          </div>
        ) : (
          <div className="text-sm ">
            <div className="grid grid-cols-4  mb-2">
              <span>Tài khoản</span>
              <span className="text-center">Số lượng</span>
              <span className="text-center">Tỷ lệ</span>
              <span className="text-right">Hoạt động</span>
            </div>

            {accountsData.map((acc, i) => (
              <div
                key={i}
                className="grid grid-cols-4 items-center py-3 border-t border-border cursor-pointer hover:bg-muted px-2"
              >
                {/* Cột 1: Tài khoản */}
                <div className="flex items-center gap-3">
                  <span className="font-medium">{acc.name}</span>
                </div>

                {/* Cột 2: Số lượng */}
                <div className="text-center">
                  <div className=" font-semibold">{acc.amount}</div>
                  <div className=" text-xs">{acc.vnd}</div>
                </div>

                {/* Cột 3: Tỷ lệ */}
                <div className="text-center">
                  <div className="">{acc.percent}%</div>
                  <div className="bg-[#2b2b2b] h-1.5 rounded-full mt-1 overflow-hidden">
                    <div
                      className="bg-[#00C6FF] h-1.5"
                      style={{ width: `${acc.percent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Cột 4: Hoạt động */}
                <div className="flex justify-end">
                  <MoreVertical
                    size={18}
                    className="  cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
