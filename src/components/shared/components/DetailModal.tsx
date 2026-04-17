"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BalanceDetailResponse {
  symbol: string;
  daily_pnlPercent: string;
  daily_pnl: string;
  cost_pnlPercent: string;
  cost_pnl: string;
  cumulative_pnlPercent: string;
  cumulative_pnl: string;
  avgPrice: string;
  costPrice: string;
  marketPrice: string;
}

interface ChartPoint {
  time: string;
  pl: number;
}

interface DetailModalProps {
  visible: boolean;
  onClose: () => void;
  asset: string;
}

const timeFrames = ["Day", "Week", "Month", "Year"] as const;

const fakeDetail: BalanceDetailResponse = {
  symbol: "BTC",
  daily_pnlPercent: "5.23",
  daily_pnl: "123.45",
  cost_pnlPercent: "10.5",
  cost_pnl: "250.0",
  cumulative_pnlPercent: "15.7",
  cumulative_pnl: "375.0",
  avgPrice: "100.0",
  costPrice: "95.0",
  marketPrice: "105.0",
};

const DetailModal: React.FC<DetailModalProps> = ({
  visible,
  onClose,
  asset,
}) => {
  const [detail, setDetail] = useState<BalanceDetailResponse | null>(null);
  const [timeFrame, setTimeFrame] =
    useState<(typeof timeFrames)[number]>("Day");
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  // --- Load chi tiết tài sản khi mở modal ---
  useEffect(() => {
    if (!visible || !asset) return;

    setDetail({ ...fakeDetail, symbol: asset });

    generateChartData(timeFrame);
  }, [visible, asset, timeFrame]);

  // --- Sinh dữ liệu biểu đồ ngẫu nhiên ---
  const generateChartData = (tf: string) => {
  const points =
    tf === "Day" ? 24 : tf === "Week" ? 7 : tf === "Month" ? 30 : 12;

  const pnlValue = Number(detail?.cumulative_pnl ?? 0);

  const data: ChartPoint[] = Array.from({ length: points }, (_, i) => ({
    time: `${i + 1}`,
    pl: pnlValue,
  }));

  setChartData(data);
};

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="relative bg-gray-900 text-white rounded-xl max-w-5xl w-full z-10 shadow-lg p-6 grid grid-cols-2 gap-6">
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-white font-bold text-lg cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {/* Left: Asset Info */}
        {detail && (
          <div>
            <div className="flex items-center mb-6">
              <h2 className="text-xl font-semibold">{detail.symbol}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: "Avg. Price", value: `$${Number(detail.avgPrice).toLocaleString()}` },
                { label: "Cost Price", value: `$${Number(detail.costPrice).toLocaleString()}` },
                { label: "Market Price", value: `$${Number(detail.marketPrice).toLocaleString()}` },
                { label: "Daily P/L", value: `$${Number(detail.daily_pnl).toLocaleString()}` },
                { label: "Daily P/L (%)", value: `${detail.daily_pnlPercent}%` },
                { label: "Cost P/L", value: `$${Number(detail.cost_pnl).toLocaleString()}` },
                { label: "Cost P/L (%)", value: `${detail.cost_pnlPercent}%` },
                { label: "Cumulative P/L", value: `$${Number(detail.cumulative_pnl).toLocaleString()}` },
                { label: "Cumulative P/L (%)", value: `${detail.cumulative_pnlPercent}%` },
              ].map((item) => (
                <div key={item.label} className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-gray-400 text-xs">{item.label}</p>
                  <p className="font-medium">{item.value}</p>
                </div>
              ))}

              <div className="col-span-2 bg-gray-800 p-3 rounded-lg">
                <p className="text-gray-400 text-xs">P/L (%)</p>
                <p
                  className={`font-medium ${
                    parseFloat(detail.daily_pnlPercent) < 0
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {detail.daily_pnlPercent}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Right: P/L Chart */}
        <div className="flex flex-col h-full mt-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">P/L Chart</h3>
            <div className="flex space-x-2">
              {timeFrames.map((tf) => (
                <button
                  key={tf}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    timeFrame === tf
                      ? "bg-gradient-to-r from-green-400 to-green-600 text-white shadow"
                      : "bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => setTimeFrame(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="plGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00E3A5" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#00E3A5" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#2a2b33" strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f1f25",
                    border: "none",
                  }}
                  labelStyle={{ color: "#aaa" }}
                />
                <Line
                  type="monotone"
                  dataKey="pl"
                  stroke={
                    parseFloat(detail?.daily_pnlPercent || "0") >= 0
                      ? "#00E3A5"
                      : "#FF4D4F"
                  }
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                  fillOpacity={0.3}
                  fill="url(#plGradient)"
                  isAnimationActive
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
