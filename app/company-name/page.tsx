"use client";

import { useState, useRef, useCallback } from "react";
import { NameForm, type GenerateParams } from "@/components/NameForm";
import { NameResults } from "@/components/NameResults";
import { Paywall } from "@/components/Paywall";
import type { NameEntry } from "@/lib/types";

export default function CompanyNamePage() {
  const [names, setNames] = useState<NameEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const lastParams = useRef<GenerateParams | null>(null);

  const handleGenerate = async (params: GenerateParams) => {
    lastParams.current = params;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNames(data.names);
      setIsPaid(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "生成失败");
    } finally {
      setLoading(false);
    }
  };

  const handlePaid = useCallback(async () => {
    if (!lastParams.current) return;

    setLoading(true);
    setError("");

    const paidOrders: string[] = JSON.parse(localStorage.getItem("paidOrders") || "[]");
    const orderId = paidOrders[paidOrders.length - 1];
    if (!orderId) return;

    try {
      const res = await fetch("/api/generate-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lastParams.current, orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNames(data.names);
      setIsPaid(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "生成失败");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Decorative header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 mb-4 shadow-lg shadow-indigo-200/50">
          <span className="text-3xl">🏢</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
          公司起名
        </h1>
        <p className="text-blue-400/70 mt-2 text-sm">
          {isPaid
            ? "已解锁全部40个名字 + 完整分析"
            : "免费生成10个 · 付费解锁40个品牌名 + 商标分析"}
        </p>
        <div className="flex justify-center gap-1 mt-3">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="text-blue-300 text-xs">▣</span>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 shadow-sm border border-blue-100/50 backdrop-blur-sm">
        <NameForm type="company" onGenerate={handleGenerate} loading={loading} />
      </div>

      {loading && (
        <div className="mt-6 text-center py-8 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-indigo-600 font-semibold mb-2">正在逐个筛查品牌名...</p>
          <p className="text-sm text-indigo-400">40 个品牌名逐一排查商标风险 + 域名可用性</p>
          <p className="text-xs text-indigo-300 mt-2">预计 1-2 分钟，建议先去倒杯水 🍵</p>
          <div className="mt-4 flex justify-center">
            <div className="w-32 h-1.5 bg-indigo-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full animate-pulse" style={{width: '60%'}} />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 text-center">
          <span className="inline-block px-4 py-2 bg-red-50 text-red-500 text-sm rounded-lg border border-red-200">
            {error}
          </span>
        </div>
      )}

      {names.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-sm" />
            <h2 className="text-lg font-semibold text-indigo-700">推荐品牌名</h2>
          </div>
          <NameResults names={names} isPaid={isPaid} />
          {!isPaid && (
            <Paywall type="company" onPaid={handlePaid} />
          )}
        </div>
      )}
    </div>
  );
}
