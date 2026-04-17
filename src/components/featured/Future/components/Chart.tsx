"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickSeries,
  HistogramSeries,
} from "lightweight-charts";
import { useTheme } from "next-themes";
import {
  Move,
  LineChart,
  Ruler,
  Square,
  Circle,
  Pencil,
  Type,
  Eraser,
  Cross,
  ArrowDownUp,
  Star,
  Minus,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import {
  BarChart2,
  Camera,
  Settings,
  Clock,
  Activity,
  Plus,
  Maximize2,
} from "lucide-react";
import { useTradingData } from "@/store/tradingdataStore";

/** --- Cấu hình --- */
const TOOLBAR_HEIGHT = 450; // px, chiều cao cố định của toolbar (theo yêu cầu)

const intervals: ("1m" | "5m" | "15m" | "1h" | "4h" | "1d")[] = [
  "1m",
  "5m",
  "15m",
  "1h",
  "4h",
  "1d",
];

export default function Chart() {
  const { theme } = useTheme();
  const { candles, interval, setInterval, volume, symbol, ticker } =
    useTradingData();
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  // showMore: khi true => trượt lên (lộ những icon ẩn)
  const [showMore, setShowMore] = useState(false);
  // translateY (px) để dịch chuyển danh sách icon (âm => trượt lên)
  const [translateY, setTranslateY] = useState<number>(0);
  const iconsListRef = useRef<HTMLDivElement | null>(null);

  // Setup chart
  useEffect(() => {
    let isMounted = true;

    if (!chartContainerRef.current) return;

    // Xóa chart cũ nếu có
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    }

    const isDark = theme === "dark";

    const chartOptions = {
      layout: {
        background: { color: isDark ? "#000000" : "#ffffff" },
        textColor: isDark ? "#B2BDC8" : "#222222",
      },
      grid: {
        vertLines: { color: isDark ? "#1C232B" : "#E5E7EB" },
        horzLines: { color: isDark ? "#1C232B" : "#E5E7EB" },
      },
      crosshair: { mode: 0 },
      timeScale: {
        borderColor: isDark ? "#1C232B" : "#D1D5DB",
        timeVisible: true,
      },
      rightPriceScale: { borderColor: isDark ? "#1C232B" : "#D1D5DB" },
    };

    const chart = createChart(chartContainerRef.current, {
      ...chartOptions,
      width: chartContainerRef.current.clientWidth,
      height: 470,
    });
    chartRef.current = chart;

    candleSeriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
      upColor: "#26A69A",
      downColor: "#EF5350",
      borderDownColor: "#EF5350",
      borderUpColor: "#26A69A",
      wickDownColor: "#EF5350",
      wickUpColor: "#26A69A",
    });

    volumeSeriesRef.current = chartRef.current.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });
    volumeSeriesRef.current
      .priceScale()
      .applyOptions({ scaleMargins: { top: 0.9, bottom: 0 } });

    const handleResize = () => {
      if (isMounted && chartContainerRef.current && chartRef.current) {
        chartRef.current.resize(chartContainerRef.current.clientWidth, 470);
        recalcTranslate();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, [theme]);

  // ✅ Update candles safely
  useEffect(() => {
    if (!chartRef.current || !candleSeriesRef.current || candles.length === 0) return;
    try {
      candleSeriesRef.current.setData(candles);
    } catch {
      console.warn("Chart disposed, skipping candle update");
    }
  }, [candles]);

  // ✅ Update volume safely
  useEffect(() => {
    if (!chartRef.current || !volumeSeriesRef.current || volume.length === 0) return;
    try {
      volumeSeriesRef.current.setData(volume);
    } catch {
      console.warn("Chart disposed, skipping volume update");
    }
  }, [volume]);

  const recalcTranslate = () => {
    const listEl = iconsListRef.current;
    if (!listEl) return setTranslateY(0);

    const totalHeight = listEl.scrollHeight;
    const visible = TOOLBAR_HEIGHT - 70;
    const maxMove = Math.max(0, totalHeight - visible);

    if (showMore) {
      setTranslateY(-maxMove);
    } else {
      setTranslateY(0);
    }
  };

  useEffect(() => {
    recalcTranslate();
  }, [showMore, iconsListRef.current]);

  // đảm bảo re-calc khi mount nội dung
  useEffect(() => {
    const t = setTimeout(() => recalcTranslate(), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      {/* Chọn khung thời gian */}
      <div className="w-full flex items-center justify-between  dark:text-gray-300 px-6 pt-4 pb-1 text-sm">
        <div className="flex items-center gap-2">
          T.gian
          {intervals.map((intv) => (
            <button
              key={intv}
              className={`p rounded ${
                interval === intv
                  ? "bg-[#184C48] text-[#00E3A5]"
                  : "text-gray-500"
              } cursor-pointer hover:bg-[#184C48] hover:text-[#00E3A5] mx-1 px-1`}
              onClick={() => setInterval(intv as typeof interval)}
            >
              {intv}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Activity size={16} className="cursor-pointer " />
          <BarChart2 size={16} className="cursor-pointer " />
          <Clock size={16} className="cursor-pointer " />
          <Camera size={16} className="cursor-pointer " />
          <Settings size={16} className="cursor-pointer " />
          <Plus size={16} className="cursor-pointer " />
          <Maximize2 size={16} className="cursor-pointer " />
        </div>
      </div>
      <div className="h-[480px] dark:bg-[#000] pl-[80px]  border-t border-gray-700 mt-2 flex flex-col">
        {/* Chart + Toolbar */}
        <div className="relative" ref={chartContainerRef}>
          {/* Toolbar bên trái, cố định chiều cao 200px, overflow hidden */}
          <div className="absolute top-3 dark:text-gray-500 left-2 z-20">
            {symbol.toUpperCase()} vĩnh cửu giá gần nhất ·{" "}
            {interval.toUpperCase()} · LVS · O ·{" "}
            <span className="text-[#00E3A5]"> {ticker?.lastPrice}</span> · L ·{" "}
            <span className="text-[#00E3A5]"> {ticker?.low24h}</span> · H ·{" "}
            <span className="text-[#00E3A5]"> {ticker?.high24h}</span>{" "}
          </div>
          <div
            className="absolute top-0 left-[-70px] z-10  rounded p-2 shadow-lg"
            style={{ height: `${TOOLBAR_HEIGHT}px`, width: "56px" }}
          >
            {/* wrapper overflow hidden */}
            <div className="relative h-full w-full overflow-hidden flex flex-col items-center">
              {/* icons list (sẽ translateY) */}
              <div
                ref={iconsListRef}
                style={{
                  transform: `translateY(${translateY}px)`,
                  transition: "transform 350ms ease",
                  willChange: "transform",
                }}
                className="flex flex-col items-center gap-3 py-3"
              >
                <ToolIcon icon={<Move size={18} />} label="Select" />
                <ToolIcon icon={<LineChart size={18} />} label="Trendline" />
                <ToolIcon icon={<Ruler size={18} />} label="Measure" />
                <ToolIcon icon={<Square size={18} />} label="Rectangle" />
                <ToolIcon icon={<Circle size={18} />} label="Circle" />
                <ToolIcon icon={<ArrowDownUp size={18} />} label="Fib" />
                <ToolIcon icon={<Minus size={18} />} label="H-Line" />
                <ToolIcon icon={<ArrowUpRight size={18} />} label="Arrow" />
                <ToolIcon icon={<Pencil size={18} />} label="Draw" />
                <ToolIcon icon={<Type size={18} />} label="Text" />
                <ToolIcon icon={<Star size={18} />} label="Favorite" />
                <ToolIcon icon={<Eraser size={18} />} label="Clear" />
                <ToolIcon icon={<Cross size={18} />} label="Crosshair" />
                {/* Bạn có thể thêm nhiều icon hơn nếu muốn */}
              </div>

              {/* Chevron (luôn ở đáy toolbar) */}
              <div
                className="absolute bottom-[-10px] left-1/2 -translate-x-1/2"
                style={{ width: "100%" }}
              >
                <div className="flex justify-center">
                  <button
                    aria-label={showMore ? "Hide tools" : "Show more tools"}
                    onClick={() => setShowMore((prev) => !prev)}
                    className={`p-1 rounded-full bg-transparent dark:text-gray-400 hover:text-white transition-transform ${
                      showMore ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Chart area stays here */}
        </div>
      </div>
    </div>
  );
}

function ToolIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="group relative flex flex-col items-center cursor-pointer dark:text-gray-300 hover:text-white">
      <div className="p-2 hover:bg-gray-700 rounded-md">{icon}</div>
      {/* Tooltip */}
      <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
