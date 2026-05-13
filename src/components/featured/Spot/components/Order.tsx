"use client";

import React, { useEffect, useState } from "react";
import TableSection from "@/components/shared/components/TableSection";
import { useSpotTradingData } from "@/store/spotTradingStore";
import { useBalances, useCloseOrder, useLedger, useOrderHistory, useOrderSnapshot, OrderHistoryItem } from "@/hooks/useOrder";
import { useMarketTokens } from "@/hooks/useMarketTokens";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

interface BalanceApiItem {
  balance: {
    id: string;
    createdAt: string;
    updatedAt: string;
    available: string;
    locked: string;
    avgPrice: string;
    costPrice: string;
    token: {
      id: string;
      createdAt: string;
      updatedAt: string;
      asset: string;
      name: string;
      is_native: boolean;
    };
  };
  pnl: string;
}

interface OrderSnapshotItem {
  id: string;
  side: "BUY" | "SELL";
  price: string;
  quantity: string;
  filled_quote_quantity: string;
  quote_quantity: string;
}

interface LedgerItem {
  createdAt: string;
  reason: string;
  token?: { asset: string };
  delta: number;
}

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
  const [ledgerRows, setLedgerRows] = useState<
    (React.ReactNode | string | number)[][]
  >([]);
  const [orderHistoryRows, setOrderHistoryRows] = useState<
    (React.ReactNode | string | number)[][]
  >([]);
  const [openOrderRows, setOpenOrderRows] = useState<
    (React.ReactNode | string | number)[][]
  >([]);

  const { ticker, symbol } = useSpotTradingData();
  const { marketTokens } = useMarketTokens();
  const { data: balancesData, refetch: refetchBalances } = useBalances();

  const selectedTokenFromList = marketTokens.find(
    (token) => token.symbol.toLowerCase() === symbol?.toLowerCase()
  );
  const marketTokenId = selectedTokenFromList?.id;

  const { data: orderSnapshotData, refetch: refetchOrderSnapshot } = useOrderSnapshot(marketTokenId);
  const { data: orderHistoryData, refetch: refetchOrderHistory } = useOrderHistory(marketTokenId);
  const { data: ledgerApiData, refetch: refetchLedger } = useLedger(symbol);
  const { mutateAsync: closeOrder } = useCloseOrder();

  const assetResponse = balancesData as BalanceApiItem[] | undefined;
  const openOrderResponse = orderSnapshotData as OrderSnapshotItem[] | undefined;
  const orderHistoryResponse = orderHistoryData as OrderHistoryItem[] | undefined;
  const ledgerResponse = ledgerApiData as LedgerItem[] | undefined;

  const handleRefresh = async () => {
    try {
      await Promise.all([
        refetchBalances?.(),
        refetchOrderSnapshot?.(),
        refetchOrderHistory?.(),
        refetchLedger?.(),
      ]);
      toast.success("Dữ liệu đã được làm mới!");
    } catch (error) {
      toast.error("Làm mới dữ liệu thất bại.");
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!marketTokenId) {
      toast.error("Không tìm thấy marketToken_id để hủy lệnh.");
      return;
    }

    try {
      await closeOrder({ order_id: orderId, marketToken_id: marketTokenId });
      toast.success("Lệnh đã được hủy thành công!");
      await Promise.all([
        refetchBalances?.(),
        refetchOrderSnapshot?.(),
        refetchOrderHistory?.(),
        refetchLedger?.(),
      ]);
    } catch (error) {
      toast.error("Hủy lệnh thất bại!");
    }
  };

  // === MAP BALANCE API TO TABLE ROWS ===
  useEffect(() => {
    if (!assetResponse || !Array.isArray(assetResponse)) return;

    const rows: (React.ReactNode | string | number)[][] = assetResponse.map(
        ({ balance, pnl }) => {
          const amount =
            parseFloat(balance.available) + parseFloat(balance.locked);
          const avgPrice = parseFloat(balance.avgPrice ?? "0");
          const price = ticker?.lastPrice
            ? parseFloat(ticker.lastPrice)
            : 50000;
          const value = amount * price;
          const pnlValue = parseFloat(pnl ?? "0");

          const plPercent =
            avgPrice > 0 ? ((price - avgPrice) / avgPrice) * 100 : 0;
          const plColor = plPercent >= 0 ? "text-green-500" : "text-red-500";

          return [
            balance.token.asset,
            amount.toFixed(4),
            parseFloat(balance.available).toFixed(4),
            parseFloat(balance.locked).toFixed(4),
            avgPrice.toFixed(2),
            price.toFixed(2),
            value.toFixed(2),
            <span
              key={balance.token.asset + "-pl"}
              className={plColor}
              title={`P/L: ${pnlValue.toFixed(2)}%`}
            >
              {pnlValue.toFixed(2)}%
            </span>,
            "",
          ];
        },
      );
      setAssetRows(rows);
  }, [assetResponse, ticker]);
  //  === MAP OPEN ORDER  API TO TABLE ROWS ===
  useEffect(() => {
    if (!openOrderResponse || !Array.isArray(openOrderResponse)) return;

    const rows = openOrderResponse.map((order: OrderSnapshotItem) => {
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
  }, [openOrderResponse, symbol]);

  // === MAP ORDER HISTORY API TO TABLE ROWS ===
  useEffect(() => {
    if (!orderHistoryResponse || !Array.isArray(orderHistoryResponse)) return;

    const rows = orderHistoryResponse.map((order: OrderHistoryItem) => [
      new Date(order.createdAt).toLocaleString(),
      symbol || "BTCUSDT",
      order.side,
      parseFloat(order.price).toFixed(2),
      parseFloat(order.quantity).toFixed(4),
      parseFloat(order.filled_quantity ?? "0").toFixed(4),
      parseFloat(order.filled_quote_quantity ?? "0").toFixed(2),
      order.status,
    ]);

    setOrderHistoryRows(rows);
  }, [orderHistoryResponse, symbol]);

  // === MAP LEDGER API TO TABLE ROWS ===
  useEffect(() => {
    if (!ledgerResponse || !Array.isArray(ledgerResponse)) return;

    const rows = ledgerResponse.map((item: any) => [
      new Date(item.createdAt).toLocaleString(),
      item.reason,
      item.token?.asset,
      item.delta?.toFixed?.(4) ?? "0",
    ]);

    setLedgerRows(rows);
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
      balancefluctuations: ledgerRows || [],
    };

  return (
    <div className="h-75 w-full overflow-y-auto pt-3 border-t-3 border-border">
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
          <p className="text-white text-[12px]">USD / Tiền tệ</p>
        </div>
      </div>

      <div className="h-55 overflow-auto px-5">
        {tab === "asset" ? (
          <div className="flex flex-col gap-4">
            {(assetResponse ?? []).map((asset) => {
              const available = parseFloat(asset.balance.available);
              const reserved = parseFloat(asset.balance.locked);
              const total = available + reserved;
              const avgPrice = parseFloat(asset.balance.avgPrice ?? "0");
              const price = ticker?.lastPrice
                ? parseFloat(ticker.lastPrice)
                : 0;
              const value = total * price;
              const breakeven = avgPrice > 0 ? avgPrice.toFixed(2) : "-";
              const pnlValue = parseFloat(asset.pnl ?? "0");

              return (
                <div
                  key={asset.balance.id}
                  className="border border-border rounded-xl p-4"
                >
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
                            pnlValue >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {pnlValue >= 0 ? "+" : ""}
                          {pnlValue.toFixed(2)}%
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
