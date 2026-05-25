"use client";

interface PaywallProps {
  type: "baby" | "company";
  onUnlock: () => void;
}

const content = {
  baby: {
    title: "想要更多好名字？",
    features: "解锁50个优质名字 + 详细寓意分析 + 八字五行 + 重名度评估",
    note: "一次付费，永久查看结果",
    color: "amber" as const,
  },
  company: {
    title: "想要更专业的品牌命名方案？",
    features: "解锁50个品牌名 + 商标可注册性分析 + 域名可用性检测 + 品牌寓意拆解",
    note: "一次付费，永久查看结果",
    color: "blue" as const,
  },
} as const;

const colorMap = {
  amber: {
    gradient: "from-amber-100 to-orange-100",
    border: "border-amber-300",
    title: "text-amber-800",
    text: "text-amber-700",
    button: "bg-amber-600 hover:bg-amber-700",
    note: "text-amber-500",
  },
  blue: {
    gradient: "from-blue-100 to-indigo-100",
    border: "border-blue-300",
    title: "text-blue-800",
    text: "text-blue-700",
    button: "bg-blue-600 hover:bg-blue-700",
    note: "text-blue-500",
  },
};

export function Paywall({ type, onUnlock }: PaywallProps) {
  const c = content[type];
  const cl = colorMap[c.color];

  return (
    <div className={`mt-8 p-6 rounded-2xl bg-gradient-to-r ${cl.gradient} border ${cl.border} text-center`}>
      <h3 className={`text-xl font-bold ${cl.title} mb-2`}>
        {c.title}
      </h3>
      <p className={`${cl.text} mb-4`}>
        {c.features}
      </p>
      <button
        onClick={onUnlock}
        className={`px-8 py-3 ${cl.button} text-white rounded-full font-bold transition shadow-lg`}
      >
        仅需19.9元 · 立即解锁
      </button>
      <p className={`text-xs ${cl.note} mt-2`}>
        {c.note}
      </p>
    </div>
  );
}
