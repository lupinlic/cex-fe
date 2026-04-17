"use client";

import React, { useEffect, useMemo, useState } from "react";
import TableSection from "@/components/shared/components/TableSection";
import { useSpotTradingData } from "@/store/spotTradingStore";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

// Fake data types
interface FakeBalance {
  id: string;
  balance: {
    token: { asset: string };
    available: string;
    locked: string;
    avgPrice: string;
  };
  pnl: number;
}

interface FakeOpenOrder {
  id: string;
  side: "BUY" | "SELL";
  price: string;
  quantity: string;
  filled_quote_quantity: string;
  quote_quantity: string;
}

interface FakeOrder {
  createdAt: string;
  side: "BUY" | "SELL";
  price: string;
  quantity: string;
  filled_quantity: string;
  filled_quote_quantity: string;
  status: string;
}

interface FakeLedger {
  createdAt: string;
  reason: string;
  token: { asset: string };
  delta: number;
}

// Fake data generators
const fakeAssets: FakeBalance[] = [
  {
    id: "1",
    balance: {
      token: { asset: "BTC" },
      available: "0.5",
      locked: "0.1",
      avgPrice: "45000",
    },
    pnl: 8.5,
  },
  {
    id: "2",
    balance: {
      token: { asset: "ETH" },
      available: "2.0",
      locked: "0.5",
      avgPrice: "2500",
    },
    pnl: 5.2,
  },
  {
    id: "3",
    balance: {
      token: { asset: "USDT" },
      available: "5000",
      locked: "1000",
      avgPrice: "1",
    },
    pnl: 0,
  },
];

const fakeOpenOrders: FakeOpenOrder[] = [
  {
    id: "ord1",
    side: "BUY",
    price: "48000",
    quantity: "0.5",
    filled_quote_quantity: "12000",
    quote_quantity: "24000",
  },
  {
    id: "ord2",
    side: "SELL",
    price: "3200",
    quantity: "1.0",
    filled_quote_quantity: "1600",
    quote_quantity: "3200",
  },
];

const fakeOrderHistory: FakeOrder[] = [
  {
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    side: "BUY",
    price: "47500",
    quantity: "1.0",
    filled_quantity: "1.0",
    filled_quote_quantity: "47500",
    status: "FILLED",
  },
  {
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    side: "SELL",
    price: "3100",
    quantity: "2.0",
    filled_quantity: "2.0",
    filled_quote_quantity: "6200",
    status: "FILLED",
  },
  {
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    side: "BUY",
    price: "2800",
    quantity: "5.0",
    filled_quantity: "3.0",
    filled_quote_quantity: "8400",
    status: "PARTIALLY_FILLED",
  },
];

const fakeLedger: FakeLedger[] = [
  {
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    reason: "Trade",
    token: { asset: "BTC" },
    delta: 0.5,
  },
  {
    createdAt: new Date(Date.now() - 5400000).toISOString(),
    reason: "Deposit",
    token: { asset: "USDT" },
    delta: 5000,
  },
  {
    createdAt: new Date(Date.now() - 9000000).toISOString(),
    reason: "Trade",
    token: { asset: "ETH" },
    delta: 2.0,
  },
];

type PortfolioTab =
  | "asset"
  | "openorder"
  | "orderhistory"
  | "balancefluctuations";

interface SpotOrderProps {
  data?: {
    asset?: (React.ReactNode | string | number)[][];
    openorder?: (React.ReactNode | string | number)[][];
    orderhistory?: (React.ReactNode | string | number)[][];
    balancefluctuations?: (React.ReactNode | string | number)[][];
  };
}

// === COMPONENT ===
export default function SpotOrder({ data = {} }: SpotOrderProps) {
  const [tab, setTab] = useState<PortfolioTab>("asset");
  const [hideOtherSymbols, setHideOtherSymbols] = useState(false);
  const [assetRows, setAssetRows] = useState<
    (React.ReactNode | string | number)[][]
  >([]);
  const [ledgerData, setLedgerData] = useState<
    (React.ReactNode | string | number)[][]
  >([]);
  const [orderHistoryRows, setOrderHistoryRows] = useState<
    (React.ReactNode | string | number)[][]
  >([]);
  const [openOrderRows, setOpenOrderRows] = useState<
    (React.ReactNode | string | number)[][]
  >([]);

  const { ticker, symbol } = useSpotTradingData();

  // Use fake data instead of API calls
  const assetResponse = fakeAssets;
  const openOrderResponse = fakeOpenOrders;
  const orderHistoryResponse = fakeOrderHistory;
  const ledgerResponse = fakeLedger;

  const handleRefresh = () => {
    toast.success("Dữ liệu đã được làm mới!");
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      toast.success("Đã gửi yêu cầu hủy lệnh!");
    } catch (error) {
      toast.error("Hủy lệnh thất bại!");
    }
  };

  // === MAP BALANCE API TO TABLE ROWS ===
  useEffect(() => {
    if (assetResponse && Array.isArray(assetResponse)) {
      const rows: (React.ReactNode | string | number)[][] = assetResponse.map(
        ({ balance, pnl }) => {
          const amount =
            parseFloat(balance.available) + parseFloat(balance.locked);
          const avgPrice = parseFloat(balance.avgPrice ?? "0");
          const price = ticker?.lastPrice
            ? parseFloat(ticker.lastPrice)
            : 50000;
          const value = amount * price;

          const plPercent =
            avgPrice > 0 ? ((price - avgPrice) / avgPrice) * 100 : 0;
          const plColor = plPercent >= 0 ? "text-green-500" : "text-red-500";

          return [
            balance.token.asset,
            amount.toFixed(4),
            parseFloat(balance.available).toFixed(4),
            parseFloat(balance.locked).toFixed(4),
            avgPrice,
            price.toFixed(2),
            value.toFixed(2),
            <span
              key={balance.token.asset + "-pl"}
              className={plColor}
              title={`P/L: ${pnl ?? 0}%`}
            >
              {pnl?.toFixed(2) ?? 0}%
            </span>,
            "",
          ];
        },
      );
      setAssetRows(rows);
    }
  }, [assetResponse, ticker]);
  //  === MAP OPEN ORDER  API TO TABLE ROWS ===
  useEffect(() => {
    if (openOrderResponse && Array.isArray(openOrderResponse)) {
      const rows = openOrderResponse.map((order: FakeOpenOrder) => {
        const filled =
          Number(order.filled_quote_quantity) / Number(order.quote_quantity);
        return [
          symbol || "BTCUSDT",
          order.side,
          parseFloat(order.price).toFixed(2),
          parseFloat(order.quantity).toFixed(4),
          (filled * 100).toFixed(2) + "%",
          parseFloat(order.filled_quote_quantity).toFixed(2),
          <button
            key={`cancel-${order.id}`}
            className="px-2 py-1 text-red-500 hover:underline cursor-pointer"
            onClick={() => handleCancelOrder(order.id)}
            type="button"
          >
            Hủy lệnh
          </button>,
        ];
      });
      setOpenOrderRows(rows);
    }
  }, [openOrderResponse, symbol]);

  // === MAP ORDER HISTORY API TO TABLE ROWS ===
  useEffect(() => {
    if (orderHistoryResponse && Array.isArray(orderHistoryResponse)) {
      const rows = orderHistoryResponse.map((order: FakeOrder) => [
        new Date(order.createdAt).toLocaleString(),
        symbol || "BTCUSDT",
        order.side,
        parseFloat(order.price).toFixed(2),
        parseFloat(order.quantity).toFixed(4),
        parseFloat(order.filled_quantity).toFixed(4),
        parseFloat(order.filled_quote_quantity).toFixed(2),
        order.status,
      ]);
      setOrderHistoryRows(rows);
    }
  }, [orderHistoryResponse, symbol]);

  // === MAP LEDGER API TO TABLE ROWS ===
  useEffect(() => {
    if (ledgerResponse && Array.isArray(ledgerResponse)) {
      const rows = ledgerResponse.map((item: FakeLedger) => [
        new Date(item.createdAt).toLocaleString(),
        item.reason,
        item.token?.asset,
        item.delta.toFixed(4),
      ]);
      setLedgerData(rows);
    }
  }, [ledgerResponse]);

  const headersMap: Record<PortfolioTab, string[]> = {
    asset: [
      "Mã",
      "Số lượng",
      "Khả dụng",
      "Trong lệnh",
      "Giá TB",
      "Giá",
      "Giá trị",
      "Lãi/Lỗ (%)",
      "Hành động",
    ],
    openorder: [
      "Mã",
      "Loại",
      "Giá",
      "Số lượng",
      "Đã khớp",
      "Khớp (USDT)",
      "Hành động",
    ],
    orderhistory: [
      "Thời gian",
      "Mã",
      "Loại",
      "Giá",
      "Số lượng",
      "SL đã khớp",
      "GT đã khớp",
      "Trạng thái",
    ],
    balancefluctuations: ["Thời gian", "Loại", "Mã", "Số lượng"],
  };

  const rowsMap: Record<PortfolioTab, (React.ReactNode | string | number)[][]> =
    {
      asset: assetRows,
      openorder: openOrderRows || [],
      orderhistory: orderHistoryRows || [],
      balancefluctuations: ledgerData || [],
    };

  return (
    <div className="h-[300px] w-full overflow-y-auto pt-3 border-t-3 border-border">
      <div className="flex items-center justify-between px-5 mb-4">
        <div className="flex gap-x-5">
          {(Object.keys(headersMap) as PortfolioTab[]).map((key) => (
            <p
              key={key}
              className={`text-[14px] font-bold cursor-pointer mx-1 ${
                tab === key ? "text-[#00E3A5]" : "text-[#848E9C]"
              }`}
              onClick={() => setTab(key)}
            >
              {key === "asset"
                ? "Tài sản"
                : key === "openorder"
                  ? "Lệnh mở"
                  : key === "orderhistory"
                    ? "Lịch sử lệnh"
                    : key === "balancefluctuations"
                      ? "Biến động số dư"
                      : "Lịch sử giao dịch"}
            </p>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <div
            className="flex gap-2 items-center cursor-pointer text-[#848E9C] hover:text-green-500"
            onClick={() => handleRefresh()}
          >
            <RefreshCw className="w-4 h-4 " />
            Làm mới
          </div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-green-500"
              checked={hideOtherSymbols}
              onChange={() => setHideOtherSymbols((prev) => !prev)}
            />
            <span className="text-[#848E9C] text-[12px] hover:text-green-500">
              Ẩn lệnh đã hủy
            </span>
          </label>
          <p className="text-[#fff] text-[12px]">USD / Tiền tệ</p>
        </div>
      </div>

      <div className="h-[220px] overflow-auto px-5">
        {tab === "asset" ? (
          <div className="flex flex-col gap-4">
            {assetResponse.map((asset) => {
              const available = parseFloat(asset.balance.available);
              const reserved = parseFloat(asset.balance.locked);
              const total = available + reserved;
              const avgPrice = parseFloat(asset.balance.avgPrice ?? "0");
              const price = ticker?.lastPrice
                ? parseFloat(ticker.lastPrice)
                : 0;
              const value = total * price;
              const breakeven = avgPrice > 0 ? avgPrice.toFixed(2) : "-";
              const plPercent =
                avgPrice > 0 ? ((price - avgPrice) / avgPrice) * 100 : 0;

              return (
                <div key={asset.id} className="border border-border rounded-xl p-4">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <img
                      src={`/images/coin/${asset.balance.token.asset.toLowerCase()}.png`}
                      className="w-4 h-4"
                      alt=""
                    />
                    <span className="text-white font-semibold text-sm">
                      {asset.balance.token.asset}
                    </span>
                  </div>

                  {/* Grid 3 cột */}
                  <div className="grid grid-cols-3 gap-6 text-sm mx-6">
                    {/* LEFT */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-8">
                        <p className="text-gray-500 text-[12px]">Tổng</p>
                        <p className="text-white font-medium text-[12px]">
                          {total.toFixed(6)} ≈{value.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="text-gray-500 flex items-center gap-1 text-[12px]">
                          Giá hòa vốn
                        </p>
                        <p className="text-white text-[12px]">{breakeven || "--"}</p>
                      </div>
                    </div>

                    {/* MIDDLE */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-8">
                        <p className="text-gray-500 text-[12px]">Reserved</p>
                        <p className="text-white text-[12px]">
                          {reserved.toFixed(6)} ≈{(reserved * price).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="text-gray-500 text-[12px]">Total PnL</p>
                        <p className="text-white text-[12px]">--</p>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-8">
                        <p className="text-gray-500 text-[12px]">Available</p>
                        <p className="text-white font-medium text-[12px]">
                          {available.toFixed(6)} ≈
                          {(available * price).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        <p className="text-gray-500 text-[12px]">Total ROI</p>
                        <p
                          className={`font-medium text-[12px] ${
                            asset.pnl >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {asset.pnl >= 0 ? "+" : ""}
                          {asset.pnl?.toFixed(2) ?? "--"}%
                        </p>
                      </div>
                    </div>
                    <div>
                      <button className="bg-gray-700 rounded-lg py-2 px-4 text-[12px] hover:bg-gray-600 transition-colors cursor-pointer">
                        Chuyển tiền
                      </button>
                    </div>
                    </div>
                    
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <TableSection
            headers={headersMap[tab]}
            rows={rowsMap[tab]}
            emptyMessage="Không có dữ liệu"
            tab={tab}
          />
        )}
      </div>
    </div>
  );
}
