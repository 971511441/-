"use client";

import { useState, useEffect, useRef } from "react";

interface Order {
  id: string;
  type: "baby" | "company";
  amount: number;
  status: "pending" | "paid";
  createdAt: string;
  paidAt: string | null;
}

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error">("success");
  const [pendingCount, setPendingCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-login if key is in URL hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setKey(hash);
      verifyKey(hash);
    }
  }, []);

  const verifyKey = async (k: string) => {
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: k }),
      });
      const data = await res.json();
      if (data.ok) setIsAuthed(true);
    } catch {}
  };

  // Auto-refresh every 5 seconds when there are pending orders
  useEffect(() => {
    if (!isAuthed) return;
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [isAuthed]);

  // Track pending count changes for notification
  useEffect(() => {
    const currentPending = orders.filter((o) => o.status === "pending").length;
    if (currentPending > pendingCount) {
      // New pending order detected - play sound + page title flash
      audioRef.current?.play().catch(() => {});
      flashTitle("🆕 有新订单！");
    }
    setPendingCount(currentPending);
  }, [orders]);

  const flashTitle = (text: string) => {
    const orig = document.title;
    document.title = text;
    setTimeout(() => (document.title = orig), 3000);
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      // silent retry
    }
  };

  const login = async () => {
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = await res.json();
      if (data.ok) {
        setIsAuthed(true);
      } else {
        alert("密钥错误");
      }
    } catch {
      alert("验证失败");
    }
  };

  const confirmOrder = async (orderId: string) => {
    setMsg("");
    try {
      const res = await fetch("/api/admin/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, key }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsgType("success");
      setMsg(`订单已确认到账 ✓`);
      fetchOrders();
    } catch (e: unknown) {
      setMsgType("error");
      setMsg(e instanceof Error ? e.message : "未知错误");
    }
  };

  if (!isAuthed) {
    return (
      <div className="max-w-sm mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">管理员登录</h1>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
          placeholder="输入管理密钥"
          className="w-full px-4 py-2 border rounded-lg mb-4 text-center focus:ring-2 focus:ring-blue-300 outline-none"
        />
        <button
          onClick={login}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          登录
        </button>
      </div>
    );
  }

  const pending = orders.filter((o) => o.status === "pending");
  const paid = orders.filter((o) => o.status === "paid");

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Hidden audio element for notification sound */}
      <audio ref={audioRef} preload="none" />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">订单管理</h1>
          <p className="text-sm text-gray-400 mt-1">
            每 5 秒自动刷新 · {pending.length > 0 ? `${pending.length} 个待确认` : "无待确认订单"}
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="text-sm text-blue-600 hover:underline"
        >
          刷新
        </button>
      </div>

      {msg && (
        <p
          className={`text-center text-sm mb-4 ${
            msgType === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {msg}
        </p>
      )}

      {loading && <p className="text-gray-400 text-center py-4">加载中...</p>}

      {/* Pending orders - large touch-friendly buttons for mobile */}
      {pending.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <h2 className="text-lg font-semibold text-amber-700">
              待确认到账 ({pending.length})
            </h2>
          </div>
          <div className="space-y-3">
            {pending.map((order) => (
              <div
                key={order.id}
                className="bg-amber-50 border-2 border-amber-300 rounded-xl px-4 py-4"
              >
                <div className="mb-3">
                  <p className="font-mono text-sm text-gray-800 break-all">
                    {order.id}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.type === "baby" ? "👶 宝宝起名" : "🏢 公司起名"} ·{" "}
                    {order.amount}元 ·{" "}
                    {new Date(order.createdAt).toLocaleString("zh-CN", {
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => confirmOrder(order.id)}
                  className="w-full py-3 bg-green-600 text-white text-base rounded-xl font-bold hover:bg-green-700 transition active:scale-[0.98]"
                >
                  确认到账 ✓
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paid orders */}
      {paid.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            已确认 ({paid.length})
          </h2>
          <div className="space-y-1">
            {paid.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-2"
              >
                <p className="font-mono text-sm text-gray-600 break-all mr-2">
                  {order.id}
                </p>
                <p className="shrink-0 text-xs text-gray-400">
                  {new Date(order.paidAt || "").toLocaleString("zh-CN", {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {orders.length === 0 && !loading && (
        <div className="text-center py-16">
          <p className="text-4xl text-gray-300 mb-2">-</p>
          <p className="text-gray-400">暂无订单</p>
        </div>
      )}
    </div>
  );
}
