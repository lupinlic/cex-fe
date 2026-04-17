"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import DetailModal from "./DetailModal";

interface TableSectionProps {
  headers: string[];
  rows?: (string | number | React.ReactNode)[][];
  emptyMessage?: string;
  className?: string;
  tab?: string;
}

export interface Particle {
  id: string;
  pos: { x: number; y: number };
  vel: { x: number; y: number };
  life: number;
  col: string;
  size?: number;
  alpha?: number;
}

const TableSection: React.FC<TableSectionProps> = ({
  headers,
  rows = [],
  emptyMessage = "No Records Found",
  className = "",
  tab,
}) => {
  const pathname = usePathname();
  const isSpot = pathname.includes("/spot");

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const handleShowDetail = (asset: string) => {
    setSelectedAsset(asset);
    setModalVisible(true);
  };

  const handleCloseOrder = (row: (string | number | React.ReactNode)[]) => {
    // eslint-disable-next-line no-console
    console.log("Đóng lệnh future:", row);
    alert("Đã gửi yêu cầu đóng lệnh Future!");
  };
  const generateUUID = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // fallback: simple UUID-like string
    return (
      Math.random().toString(36).substring(2, 10) +
      Math.random().toString(36).substring(2, 10)
    );
  };
  const idIndex = headers.findIndex((h) => h.toLowerCase() === "order id");
  const symbolIndex = headers.findIndex((h) => h.toLowerCase() === "symbol");

  return (
    <div className={`overflow-x-auto w-full ${className}`}>
      <table className="w-full text-left text-sm text-gray-300">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="px-5 text-[#9397A3] py-2 font-normal text-[12px]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        {rows.length > 0 && (
          <tbody>
            {rows.map((row) => (
              <tr
                key={
                  typeof row[idIndex] === "string" ||
                  typeof row[idIndex] === "number"
                    ? row[idIndex]
                    : generateUUID()
                }
                className="border-b border-gray-700 hover:bg-[#22242A]"
              >
                {headers.map((header, j) => {
                  let content: React.ReactNode = row[j];

                  // Tab: balancefluctuations → định dạng Amount
                  if (tab === "balancefluctuations" && header === "Amount") {
                    const num = parseFloat(row[j] as string);
                    content = num >= 0 ? `+${num}` : num.toString();
                  }

                  // Tab: Action → xem chi tiết hoặc đóng lệnh
                  if (header === "Action") {
                    content = isSpot ? (
                      <button
                        type="button"
                        className="px-2 py-1 text-white hover:underline cursor-pointer"
                        onClick={() =>
                          handleShowDetail(
                            symbolIndex !== -1 && typeof row[symbolIndex] === "string"
                              ? (row[symbolIndex] as string)
                              : String(row[0])
                          )
                        }
                      >
                        Xem chi tiết
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="px-2 py-1 text-red-500 hover:underline cursor-pointer"
                        onClick={() => handleCloseOrder(row)}
                      >
                        Đóng lệnh
                      </button>
                    );
                  }

                  // Tab: openorder → cột Filled hiển thị vòng tròn tiến độ
                  if (tab === "openorder" && header === "Filled") {
                    const filledValue = row[j];
                    const percent =
                      typeof filledValue === "string"
                        ? parseFloat(filledValue.replace("%", ""))
                        : Number(filledValue) * 100;

                    const typeIndex = headers.findIndex(
                      (h) => h.toLowerCase() === "type"
                    );
                    const orderType =
                      typeIndex !== -1
                        ? String(row[typeIndex]).toLowerCase()
                        : "buy";
                    const filledColor =
                      orderType === "buy" ? "#22c55e" : "#ef4444";

                    const circleSize = 24;
                    const strokeWidth = 5;
                    const radius = (circleSize - strokeWidth) / 2;
                    const circumference = 2 * Math.PI * radius;
                    const dash = (percent / 100) * circumference;

                    content = (
                      <div className="flex items-center">
                        <svg
                          width={circleSize}
                          height={circleSize}
                          className="-rotate-90"
                        >
                          <circle
                            cx={circleSize / 2}
                            cy={circleSize / 2}
                            r={radius}
                            stroke="#4b5563"
                            strokeWidth={strokeWidth}
                            fill="none"
                          />
                          <circle
                            cx={circleSize / 2}
                            cy={circleSize / 2}
                            r={radius}
                            stroke={filledColor}
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={`${dash} ${circumference - dash}`}
                            strokeLinecap="round"
                            style={{
                              transition:
                                "stroke-dasharray 0.4s ease, stroke 0.4s ease",
                            }}
                          />
                        </svg>
                        <span className="ml-2" title={`${percent.toFixed(1)}%`}>
                          {percent.toFixed(0)}%
                        </span>
                      </div>
                    );
                  }

                  const isAmount =
                    tab === "balancefluctuations" &&
                    header === "Amount" &&
                    !Number.isNaN(parseFloat(row[j] as string));

                  return (
                    <td
                      key={`${String(header)}-${j}`}
                      className={`px-4 py-2 ${
                        isAmount
                          ? parseFloat(row[j] as string) < 0
                            ? "text-red-500"
                            : "text-green-500"
                          : ""
                      }`}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        )}
      </table>

      {rows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <Image
            src="https://app.myx.finance/assets/NoData-8a2acdb1.svg"
            width={80}
            height={80}
            alt="No Data"
          />
          <p className="mt-2">{emptyMessage}</p>
        </div>
      )}

      {modalVisible && selectedAsset && (
        <DetailModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          asset={selectedAsset}
        />
      )}
    </div>
  );
};

TableSection.displayName = "TableSection";
export default TableSection;
