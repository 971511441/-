"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface PayModalProps {
  type: "baby" | "company";
  onClose: () => void;
  onPaid: () => void;
}

export function PayModal({ type, onClose, onPaid }: PayModalProps) {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inputOrderId, setInputOrderId] = useState("");
  const [step, setStep] = useState<"qr" | "order" | "input">("qr");
  const [countdown, setCountdown] = useState(60);
  const [btnReady, setBtnReady] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 60-second countdown
  useEffect(() => {
    if (!orderId || paid) return;
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [orderId, paid]);

  // 30-second mark: enable "I've paid" button
  useEffect(() => {
    if (countdown <= 30 && !btnReady) {
      setBtnReady(true);
    }
  }, [countdown, btnReady]);

  const copyOrderId = async () => {
    if (!orderId) return;
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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

  const handleEarlyReveal = () => {
    setStep("order");
  };

  const confirmPaid = async () => {
    if (!orderId) return;
    if (step === "order") {
      setStep("input");
      return;
    }
    // Step "input": validate the pasted order id
    if (inputOrderId.trim() !== orderId) {
      setError("订单号不匹配，请重新复制粘贴");
      return;
    }
    setConfirming(true);
    setError("");
    try {
      const res = await fetch("/api/order/self-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "确认失败");
      setPaid(true);
      const paidOrders = JSON.parse(localStorage.getItem("paidOrders") || "[]");
      if (!paidOrders.includes(orderId)) {
        paidOrders.push(orderId);
        localStorage.setItem("paidOrders", JSON.stringify(paidOrders));
      }
      setTimeout(() => onPaid(), 1500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "确认失败，请重试");
    } finally {
      setConfirming(false);
    }
  };

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
          <div className="text-center py-6">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-green-600 mb-2">支付成功！</h3>
            <p className="text-gray-600 mb-3">AI 正在逐个推敲你的名字，先别急~</p>
            <div className="flex items-center justify-center gap-1.5 mb-3">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: "0s" }} />
              <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
              <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
            <p className="text-xs text-gray-400">
              {type === "baby" ? "40 个名字逐一分析，预计 1-2 分钟" : "40 个品牌名逐个筛查，预计 1-2 分钟"}
            </p>
            <p className="text-xs text-gray-400 mt-1">建议先去倒杯水 🍵</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
              扫码支付 19.9 元
            </h3>

            {loading && (
              <div className="text-center py-8 text-gray-400">创建订单中...</div>
            )}

            {error && step !== "input" && (
              <div className="text-center py-4 text-red-500">{error}</div>
            )}

            {orderId && (
              <>
                {/* QR Codes - always visible */}
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

                {/* Countdown: always visible */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400 text-center mb-1">
                    请在规定时间内付款：{countdown}s
                  </p>
                  <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-amber-400 h-1 rounded-full transition-all duration-1000"
                      style={{ width: `${(countdown / 60) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Order section: hidden until revealed */}
                {step === "order" || step === "input" ? (
                  <>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-amber-700 mb-2 text-center">
                        请复制订单号：
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

                    {step === "input" && (
                      <>
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2 text-center">
                            请粘贴订单号以激活权益：
                          </p>
                          <input
                            type="text"
                            value={inputOrderId}
                            onChange={(e) => setInputOrderId(e.target.value)}
                            placeholder="在此粘贴订单号"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-center text-sm font-mono focus:ring-2 focus:ring-amber-300 outline-none"
                          />
                        </div>
                        {error && (
                          <p className="text-center text-sm text-red-500 mb-3">{error}</p>
                        )}
                      </>
                    )}
                  </>
                ) : null}

                {/* Action buttons */}
                {step === "qr" && (
                  <button
                    onClick={handleEarlyReveal}
                    disabled={!btnReady}
                    className="w-full py-3 bg-green-600 text-white text-base rounded-xl font-bold hover:bg-green-700 transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed mb-2"
                  >
                    我已付款 ✓
                  </button>
                )}

                {step === "order" && (
                  <button
                    onClick={confirmPaid}
                    className="w-full py-3 bg-green-600 text-white text-base rounded-xl font-bold hover:bg-green-700 transition active:scale-[0.98] mb-2"
                  >
                    我已付款，复制好了 ✓
                  </button>
                )}

                {step === "input" && (
                  <button
                    onClick={confirmPaid}
                    disabled={confirming || !inputOrderId.trim()}
                    className="w-full py-3 bg-green-600 text-white text-base rounded-xl font-bold hover:bg-green-700 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mb-2"
                  >
                    {confirming ? "确认中..." : "确认激活权益 ✓"}
                  </button>
                )}

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
