"use client";

import { useState } from "react";
import { NameForm } from "@/components/NameForm";
import { NameResults } from "@/components/NameResults";
import { Paywall } from "@/components/Paywall";

export default function CompanyNamePage() {
  const [names, setNames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (params: any) => {
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
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
        公司起名
      </h1>
      <p className="text-center text-gray-500 mb-8">
        免费生成10个品牌名，付费解锁50个名字 + 商标分析 + 域名检测
      </p>

      <NameForm type="company" onGenerate={handleGenerate} loading={loading} />

      {error && (
        <p className="text-center text-red-500 mt-4">{error}</p>
      )}

      {names.length > 0 && (
        <>
          <NameResults names={names} isPaid={false} />
          <Paywall
            type="company"
            onUnlock={() => {
              window.location.href = "/pay/create?type=company";
            }}
          />
        </>
      )}
    </div>
  );
}
