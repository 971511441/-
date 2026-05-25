"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PaySuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const [status, setStatus] = useState<string>("checking");

  useEffect(() => {
    if (!orderId) {
      setStatus("error");
      return;
    }
    const check = async () => {
      try {
        const res = await fetch(`/api/generate-paid/info?order=${orderId}`);
        const data = await res.json();
        if (data.paid) {
          setStatus("paid");
        }
      } catch {
        // Retry on next interval
      }
    };
    check();
    const interval = setInterval(check, 2000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (status === "error") {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-red-500">订单信息缺失，请联系客服</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">支付成功！</h1>
      <p className="text-gray-500 mb-8">
        正在为你生成50个优质名字和详细分析...
      </p>
      {status === "paid" && orderId && (
        <Link
          href={`/result/${orderId}`}
          className="inline-block px-8 py-3 bg-amber-600 text-white rounded-full font-bold hover:bg-amber-700 transition"
        >
          查看完整结果 →
        </Link>
      )}
      {status === "checking" && (
        <div className="animate-pulse text-gray-400">确认支付状态中...</div>
      )}
    </div>
  );
}
