"use client";
import React, { useState } from "react";
import TableSection from "@/components/shared/components/TableSection";

export default function BottomTabs() {
  const position = [
    "Symbol",
    "Amount",
    "Entry Price",
    "Margin",
    "Funding Fee",
    "unPnL (ROE%)",
    "Margin Ratio",
    "Liq. Price",
    "Action",
  ];
  const openorder = [
    "Time",
    "Symbol",
    "Type",
    "Price",
    "Amount",
    "Filled",
    "Trigger Price",
    "Margin",
    "Action",
  ];
  const orderhistory = [
    "Time",
    "Symbol",
    "Type",
    "Avg. Price",
    "Price",
    "Amount",
    "Filled",
    "Fee",
    "Status",
  ];
  const transactionhistory = [
    "Time",
    "Type",
    "Symbol",
    "Transaction History",
    "Hash",
  ];
  const [portfolio, setPortfolio] = useState<
    "position" | "openorrder" | "orderhistory" | "transactionhistory"
  >("position");
  return (
    <div className="h-[300px] overflow-auto pt-3 border-t   border-gray-600 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center px-5 mb-4 gap-x-5">
          <p
            className={`text-[14px] font-bold cursor-pointer mx-1 ${
              portfolio === "position" ? "text-[#00E3A5] " : "text-[#848E9C]"
            }`}
            onClick={() => setPortfolio("position")}
          >
            Position
          </p>
          <p
            className={`text-[14px] font-bold cursor-pointer mx-1 ${
              portfolio === "openorrder" ? "text-[#00E3A5] " : "text-[#848E9C]"
            }`}
            onClick={() => setPortfolio("openorrder")}
          >
            Open Order
          </p>
          <p
            className={`text-[14px] font-bold cursor-pointer mx-1 ${
              portfolio === "orderhistory"
                ? "text-[#00E3A5] "
                : "text-[#848E9C]"
            }`}
            onClick={() => setPortfolio("orderhistory")}
          >
            Order History
          </p>
          <p
            className={`text-[14px] font-bold cursor-pointer mx-1 ${
              portfolio === "transactionhistory"
                ? "text-[#00E3A5] "
                : "text-[#848E9C]"
            }`}
            onClick={() => setPortfolio("transactionhistory")}
          >
            Transaction History
          </p>
        </div>
        <div className="flex items-center">
          <label className="flex items-center  space-x-2">
            <input
              type="checkbox"
              className="accent-green-500"
              // checked={enabledCheck}
              // onChange={() => setEnabledCheck(!enabledCheck)}
            />
            <span className="text-[#848E9C] text-[12px] hover:text-green-500 cursor-pointer">
              Hide Other Symbols
            </span>
          </label>
          <p className="mx-2 text-[#fff] text-[12px]">USD / Coin</p>
        </div>
      </div>

      {/* Content based on selected tab */}
      <div className="h-[220px]">
        {portfolio === "position" && (
          <TableSection headers={position} rows={[]} />
        )}
        {portfolio === "openorrder" && (
          <TableSection headers={openorder} rows={[]} />
        )}
        {portfolio === "orderhistory" && (
          <TableSection headers={orderhistory} rows={[]} />
        )}
        {portfolio === "transactionhistory" && (
          <TableSection headers={transactionhistory} rows={[]} />
        )}
      </div>
    </div>
  );
}
