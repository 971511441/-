"use client";

import { useState, useRef, useCallback } from "react";
import { NameForm, type GenerateParams } from "@/components/NameForm";
import { NameResults } from "@/components/NameResults";
import { Paywall } from "@/components/Paywall";
import type { NameEntry } from "@/lib/types";

export default function BabyNamePage() {
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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-200 to-amber-200 mb-4 shadow-lg">
          <span className="text-3xl">👶</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-amber-600 to-rose-500 bg-clip-text text-transparent">
          宝宝起名
        </h1>
        <p className="text-rose-400/70 mt-2 text-sm">
          {isPaid
            ? "已解锁全部40个名字 + 完整分析"
            : "免费生成10个 · 付费解锁40个名字 + 详细寓意分析"}
        </p>
        <div className="flex justify-center gap-1 mt-3">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="text-amber-300 text-xs">✦</span>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 rounded-3xl p-6 md:p-8 shadow-sm border border-pink-100/50">
        <NameForm type="baby" onGenerate={handleGenerate} loading={loading} />
      </div>

      {loading && (
        <div className="mt-6 text-center py-8 px-4 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 rounded-2xl border border-pink-100/50">
          <div className="text-4xl mb-3">🔮</div>
          <p className="text-rose-600 font-semibold mb-2">正在逐个推敲名字...</p>
          <p className="text-sm text-rose-400">
            {isPaid
              ? "40 个名字逐一分析字义、五行、八字契合度"
              : "10 个名字逐一分析字义"}
          </p>
          <p className="text-xs text-rose-300 mt-2">
            {isPaid
              ? "预计 2-3 分钟，建议先去倒杯水 🍵"
              : "预计 30 秒，建议先去倒杯水 🍵"}
          </p>
          <div className="mt-4 flex justify-center">
            <div className="w-32 h-1.5 bg-rose-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-rose-400 to-amber-400 rounded-full animate-pulse" style={{width: '60%'}} />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 text-center">
          <span className="inline-block px-4 py-2 bg-red-50 text-red-500 text-sm rounded-full border border-red-200">
            {error}
          </span>
        </div>
      )}

      {names.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-5 bg-gradient-to-b from-pink-400 to-amber-400 rounded-full" />
            <h2 className="text-lg font-semibold text-rose-700">推荐名字</h2>
          </div>
          <NameResults names={names} isPaid={isPaid} />
          {!isPaid && (
            <Paywall type="baby" onPaid={handlePaid} />
          )}
        </div>
      )}
    </div>
  );
}
