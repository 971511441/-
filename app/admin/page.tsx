"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (key.length < 5) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/stats?key=${key}`);
      if (res.ok) {
        sessionStorage.setItem("admin_key", key);
        setAuthenticated(true);
        setStats(await res.json());
      } else {
        alert("密钥错误");
      }
    } catch {
      alert("请求失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_key");
    if (saved) {
      setKey(saved);
      setAuthenticated(true);
      fetch(`/api/admin/stats?key=${saved}`)
        .then(r => r.json())
        .then(setStats);
    }
  }, []);

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold mb-4">管理后台</h1>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
          placeholder="输入管理密钥"
          className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-gray-300 outline-none"
        />
        <button
          onClick={login}
          disabled={loading}
          className="w-full py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "验证中..." : "进入"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">管理后台</h1>
      {stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="今日订单" value={stats.todayOrders || 0} />
          <StatCard label="今日收入(元)" value={(stats.todayRevenue || 0) / 100} />
          <StatCard label="总文章数" value={stats.totalArticles || 0} />
          <StatCard label="总订单数" value={stats.totalOrders || 0} />
        </div>
      ) : (
        <p className="text-gray-400">加载中...</p>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 rounded-xl border bg-white">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
