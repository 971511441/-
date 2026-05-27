"use client";

import { useEffect, useState } from "react";
import { NameResults } from "@/components/NameResults";
import { NameEntry } from "@/lib/types";

export default function ResultPage({ params }: { params: { id: string } }) {
  const [names, setNames] = useState<NameEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const infoRes = await fetch(`/api/generate-paid/info?order=${params.id}`);
        const info = await infoRes.json();
        if (!infoRes.ok || !info.paid) {
          setError("订单未支付或不存在");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/generate-paid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: params.id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setNames(data.names);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "加载失败");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-amber-300 border-t-amber-600 rounded-full mb-4"></div>
        <p className="text-gray-500">AI正在为你精心生成名字...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
        你的专属起名结果
      </h1>
      <p className="text-center text-gray-500 mb-8">
        AI为你生成了50个优质名字，包含详细寓意分析。可分享此页面给家人一起讨论。
      </p>
      <NameResults names={names} isPaid={true} />
      <div className="mt-8 text-center">
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("链接已复制，分享给家人一起选！");
          }}
          className="px-6 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 transition"
        >
          复制分享链接
        </button>
      </div>
    </div>
  );
}
