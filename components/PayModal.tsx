"use client";

import { useState, useEffect, useCallback } from "react";

interface PayModalProps {
  type: "baby" | "company";
  onClose: () => void;
  onPaid: () => void;
}

export function PayModal({ type, onClose, onPaid }: PayModalProps) {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyOrderId = async () => {
    if (!orderId) return;
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
      const el = document.getElementById("order-id-text");
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  };

  const createOrder = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrderId(data.orderId);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "创建订单失败");
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    createOrder();
  }, [createOrder]);

  // Poll for payment status
  useEffect(() => {
    if (!orderId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/order/check?orderId=${orderId}`);
        const data = await res.json();
        if (data.status === "paid") {
          setPaid(true);
          clearInterval(interval);
          // Save order to localStorage for this session
          const paidOrders = JSON.parse(localStorage.getItem("paidOrders") || "[]");
          if (!paidOrders.includes(orderId)) {
            paidOrders.push(orderId);
            localStorage.setItem("paidOrders", JSON.stringify(paidOrders));
          }
          setTimeout(() => onPaid(), 1500);
        }
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, [orderId, onPaid]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          &times;
        </button>

        {paid ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">&#10003;</div>
            <h3 className="text-xl font-bold text-green-600 mb-2">支付成功！</h3>
            <p className="text-gray-500">即将解锁全部内容...</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
              扫码支付 19.9 元
            </h3>

            {loading && (
              <div className="text-center py-8 text-gray-400">创建订单中...</div>
            )}

            {error && (
              <div className="text-center py-4 text-red-500">{error}</div>
            )}

            {orderId && (
              <>
                {/* QR Codes */}
                <div className="flex gap-3 justify-center mb-4">
                  <div className="bg-white border rounded-xl p-2 text-center">
                    <img
                      src="/wechat-qr.png"
                      alt="微信收款码"
                      className="w-36 h-36 object-contain mx-auto"
                    />
                    <p className="text-xs text-gray-500 mt-1">微信</p>
                  </div>
                  <div className="bg-white border rounded-xl p-2 text-center">
                    <img
                      src="/alipay-qr.jpg"
                      alt="支付宝收款码"
                      className="w-36 h-36 object-contain mx-auto"
                    />
                    <p className="text-xs text-gray-500 mt-1">支付宝</p>
                  </div>
                </div>

                {/* Order number */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-amber-700 mb-2 text-center">
                    付款时请备注此订单号：
                  </p>
                  <div className="flex items-center gap-2 bg-white rounded-lg border border-amber-300 px-3 py-2">
                    <span
                      id="order-id-text"
                      className="flex-1 text-base font-mono font-bold text-amber-900 select-all truncate"
                    >
                      {orderId}
                    </span>
                    <button
                      onClick={copyOrderId}
                      className="shrink-0 px-3 py-1.5 bg-amber-600 text-white text-xs rounded-full hover:bg-amber-700 transition active:scale-95"
                    >
                      {copied ? "已复制" : "复制"}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-400 text-center mb-4">
                  付款后系统将自动检测到账，请勿关闭此页面
                </p>

                <button
                  onClick={onClose}
                  className="w-full py-2 text-gray-500 border border-gray-300 rounded-full hover:bg-gray-50 transition"
                >
                  稍后付款
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
