"use client";

interface PaywallProps {
  onUnlock: () => void;
}

export function Paywall({ onUnlock }: PaywallProps) {
  return (
    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 text-center">
      <h3 className="text-xl font-bold text-amber-800 mb-2">
        想要更多好名字？
      </h3>
      <p className="text-amber-700 mb-4">
        解锁50个优质名字 + 详细寓意分析 + 八字五行 + 重名度评估
      </p>
      <button
        onClick={onUnlock}
        className="px-8 py-3 bg-amber-600 text-white rounded-full font-bold hover:bg-amber-700 transition shadow-lg"
      >
        仅需19.9元 · 立即解锁
      </button>
      <p className="text-xs text-amber-500 mt-2">
        一次付费，永久查看结果
      </p>
    </div>
  );
}
