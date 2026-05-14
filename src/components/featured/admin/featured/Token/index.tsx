"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGet } from "@/hooks/useApi";
import { useCreateToken, TokenItem } from "@/api/tokenApi";

function Token() {
  const queryClient = useQueryClient();
  const { data: tokens, isLoading, isError, error } = useGet<TokenItem[]>("/tokens", ["tokens"]);
  const createTokenMutation = useCreateToken();

  const [asset, setAsset] = useState("");
  const [name, setName] = useState("");
  const [isNative, setIsNative] = useState(false);
  const [formError, setFormError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!asset.trim() || !name.trim()) {
      setFormError("Asset và Name là bắt buộc.");
      return;
    }

    try {
      await createTokenMutation.mutateAsync({
        asset: asset.trim(),
        name: name.trim(),
        is_native: isNative,
      });
      setAsset("");
      setName("");
      setIsNative(false);
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["tokens"] });
    } catch (submitError) {
      console.error(submitError);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-slate-50 text-slate-900">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Quản lý Token</h2>
        <p className="mt-2 text-sm text-slate-600">Xem dữ liệu token và tạo token mới nhanh chóng.</p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Danh sách Token</h3>
            <p className="text-sm text-slate-600">Dữ liệu được xuất ra dưới dạng bảng, rõ ràng và dễ quản lý.</p>
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
                <label className="block text-sm font-medium text-slate-700">Asset</label>
                <input
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
                  placeholder="BTC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
                  placeholder="Bitcoin"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="is_native"
                type="checkbox"
                checked={isNative}
                onChange={(e) => setIsNative(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
              <label htmlFor="is_native" className="text-sm font-medium text-slate-700">
                Native token
              </label>
            </div>

            {formError ? <p className="text-sm text-rose-500">{formError}</p> : null}
            {createTokenMutation.error ? (
              <p className="text-sm text-rose-500">{createTokenMutation.error.message}</p>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={createTokenMutation.isPending}
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createTokenMutation.isPending ? "Đang lưu..." : "Tạo token"}
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
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-slate-500">Asset</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-slate-500">Name</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-slate-500">Native</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-slate-500">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    Đang tải token...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-rose-500">
                    Có lỗi khi tải token: {(error as Error)?.message}
                  </td>
                </tr>
              ) : !tokens || tokens.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    Chưa có token nào.
                  </td>
                </tr>
              ) : (
                tokens.map((token) => (
                  <tr key={token.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-4">{token.asset}</td>
                    <td className="whitespace-nowrap px-4 py-4">{token.name}</td>
                    <td className="whitespace-nowrap px-4 py-4">{token.is_native ? "Yes" : "No"}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-500">{token.id}</td>
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

export default Token