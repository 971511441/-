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
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
        公司起名
      </h1>
      <p className="text-center text-gray-500 mb-8">
        {isPaid
          ? "已解锁全部50个名字 + 完整分析"
          : "免费生成10个品牌名，付费解锁50个名字 + 商标分析 + 域名检测"}
      </p>

      <NameForm type="company" onGenerate={handleGenerate} loading={loading} />

      {error && (
        <p className="text-center text-red-500 mt-4">{error}</p>
      )}

      {names.length > 0 && (
        <>
          <NameResults names={names} isPaid={isPaid} />
          {!isPaid && (
            <Paywall type="company" onPaid={handlePaid} />
          )}
        </>
      )}
    </div>
  );
}
