"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGet } from "@/hooks/useApi";
import {
  useCreateMarketToken,
  useActivateMarketToken,
  MarketTokenItem,
} from "@/api/marketTokenApi";

function MarketToken() {
  const queryClient = useQueryClient();
  const { data: marketTokens, isLoading, isError, error } = useGet<MarketTokenItem[]>(
    "/market-tokens",
    ["market-tokens"]
  );
  const createMarketTokenMutation = useCreateMarketToken();
  const activateMarketTokenMutation = useActivateMarketToken();

  const [baseAsset, setBaseAsset] = useState("");
  const [quoteAsset, setQuoteAsset] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [initPriceBySymbol, setInitPriceBySymbol] = useState<Record<string, string>>({});
  const [activationError, setActivationError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!baseAsset.trim() || !quoteAsset.trim()) {
      setFormError("Base Asset và Quote Asset là bắt buộc.");
      return;
    }

    try {
      await createMarketTokenMutation.mutateAsync({
        baseAsset: baseAsset.trim(),
        quoteAsset: quoteAsset.trim(),
      });
      setBaseAsset("");
      setQuoteAsset("");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["market-tokens"] });
    } catch (submitError) {
      console.error(submitError);
    }
  };

  const handleActivate = async (symbol: string) => {
    setActivationError("");
    const initPrice = initPriceBySymbol[symbol] ?? "";

    if (!initPrice.trim()) {
      setActivationError("Init Price là bắt buộc để kích hoạt.");
      return;
    }

    try {
      await activateMarketTokenMutation.mutateAsync({
        symbol,
        initPrice: initPrice.trim(),
        isActive: "true",
      });
      setInitPriceBySymbol((prev) => ({ ...prev, [symbol]: "" }));
      queryClient.invalidateQueries({ queryKey: ["market-tokens"] });
    } catch (error) {
      console.error(error);
      setActivationError("Kích hoạt thất bại, vui lòng thử lại.");
    }
  };

  const handleInitPriceChange = (symbol: string, value: string) => {
    setInitPriceBySymbol((prev) => ({ ...prev, [symbol]: value }));
  };

  return (
    <div className="space-y-6 p-6 bg-slate-50 text-slate-900">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Quản lý Market Token</h2>
        <p className="mt-2 text-sm text-slate-600">Xem danh sách thị trường và tạo cặp mới.</p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Danh sách Market Token</h3>
            <p className="text-sm text-slate-600">Dữ liệu hiển thị ra bảng, dễ quản lý và cập nhật.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {showForm ? "Đóng khung tạo" : "Tạo mới"}
          </button>
        </div>

        {showForm ? (
          <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Base Asset</label>
                <input
                  value={baseAsset}
                  onChange={(e) => setBaseAsset(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
                  placeholder="BTC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Quote Asset</label>
                <input
                  value={quoteAsset}
                  onChange={(e) => setQuoteAsset(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
                  placeholder="USDT"
                />
              </div>
            </div>

            {formError ? <p className="text-sm text-rose-500">{formError}</p> : null}
            {createMarketTokenMutation.error ? (
              <p className="text-sm text-rose-500">{createMarketTokenMutation.error.message}</p>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={createMarketTokenMutation.isPending}
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createMarketTokenMutation.isPending ? "Đang lưu..." : "Tạo market token"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                Hủy
              </button>
            </div>
          </form>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 bg-white text-slate-900">
            <thead className="bg-slate-50">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-slate-500">Symbol</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-slate-500">Active</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-slate-500">Created At</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-slate-500">Updated At</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-slate-500">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                    Đang tải market token...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-rose-500">
                    Có lỗi khi tải market token: {(error as Error)?.message}
                  </td>
                </tr>
              ) : !marketTokens || marketTokens.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                    Chưa có market token nào.
                  </td>
                </tr>
              ) : (
                marketTokens.map((marketToken) => (
                  <tr key={marketToken.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-4">{marketToken.symbol}</td>
                    <td className="whitespace-nowrap px-4 py-4">
                      {marketToken.isActive ? (
                        "Yes"
                      ) : (
                        <div className="flex flex-col gap-2">
                          <input
                            value={initPriceBySymbol[marketToken.symbol] ?? ""}
                            onChange={(e) => handleInitPriceChange(marketToken.symbol, e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
                            placeholder="Init Price"
                          />
                          <button
                            type="button"
                            onClick={() => handleActivate(marketToken.symbol)}
                            disabled={activateMarketTokenMutation.isPending}
                            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Active
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">{new Date(marketToken.createdAt).toLocaleString()}</td>
                    <td className="whitespace-nowrap px-4 py-4">{new Date(marketToken.updatedAt).toLocaleString()}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-500">{marketToken.id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MarketToken;
