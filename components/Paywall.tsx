"use client";

import { useState } from "react";
import { PayModal } from "./PayModal";

interface PaywallProps {
  type: "baby" | "company";
  onPaid: () => void;
}

const styles = {
  baby: {
    wrapper: "bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 border-pink-200/60",
    badge: "bg-gradient-to-r from-pink-400 to-amber-400",
    badgeText: "text-white",
    title: "text-rose-700",
    subtitle: "text-rose-500",
    feature: "text-rose-600/80",
    featureIcon: "text-pink-300",
    freeLabel: "text-gray-400",
    paidLabel: "text-rose-600",
    button: "bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:via-rose-600 hover:to-amber-600 shadow-lg shadow-rose-200/50",
    note: "text-rose-400",
    priceAnchor: "text-rose-400",
    proof: "text-rose-400",
  },
  company: {
    wrapper: "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-blue-200/60 backdrop-blur-sm",
    badge: "bg-gradient-to-r from-indigo-500 to-blue-500",
    badgeText: "text-white",
    title: "text-indigo-700",
    subtitle: "text-indigo-500",
    feature: "text-indigo-600/80",
    featureIcon: "text-blue-300",
    freeLabel: "text-gray-400",
    paidLabel: "text-indigo-600",
    button: "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-blue-200/50",
    note: "text-blue-400",
    priceAnchor: "text-blue-400",
    proof: "text-blue-400",
  },
};

function BabyPaywall({ onPaid }: { onPaid: () => void }) {
  const [showModal, setShowModal] = useState(false);
  const s = styles.baby;

  return (
    <>
      <div className={`mt-10 p-6 md:p-8 rounded-3xl border ${s.wrapper} text-center relative overflow-hidden`}>
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/40" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/30" />

        <div className="relative">
          <span className={`inline-block px-4 py-1 ${s.badge} ${s.badgeText} text-xs font-bold rounded-full mb-4`}>
            完整取名报告
          </span>

          <h3 className={`text-xl font-bold ${s.title} mb-2`}>
            免费的名字很好，但你真的放心吗？
          </h3>
          <p className={`text-sm ${s.subtitle} mb-5`}>
            名字跟孩子一辈子。花一杯奶茶钱，换个安心。
          </p>

          {/* 免费 vs 付费对比 */}
          <div className="mb-5 text-sm space-y-1.5">
            <div className="px-4 py-2 rounded-lg bg-white/60 text-center">
              <span className={s.freeLabel}>免费版：10 个名字 · 简单寓意</span>
            </div>
            <div className="px-4 py-2 rounded-lg bg-white/80 text-center">
              <span className={`font-semibold ${s.paidLabel}`}>完整报告：40 个精心筛选的名字 · 深度分析</span>
            </div>
          </div>

          {/* 付费版亮点 */}
          <ul className="space-y-2 mb-5 text-left max-w-xs mx-auto">
            {[
              "字义拆解 + 五行属性 + 文化出处",
              "八字契合度 · 重名度评估",
              "小名推荐 · 专业综合评分",
              "一次付费，永久查看",
            ].map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className={`mt-0.5 ${s.featureIcon} text-xs`}>✦</span>
                <span className={`text-sm ${s.feature}`}>{f}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setShowModal(true)}
            className={`px-10 py-3.5 ${s.button} text-white rounded-2xl font-bold transition active:scale-[0.97]`}
          >
            仅需 19.9 元 · 查看完整报告
          </button>

          <p className={`text-xs ${s.priceAnchor} mt-2`}>
            一杯奶茶钱，比起名馆便宜 50 倍
          </p>

          <p className={`text-xs ${s.proof} mt-1`}>
            已有 1,286 位宝妈解锁了完整报告
          </p>

          <p className={`text-xs ${s.note} mt-2`}>
            微信 / 支付宝均可支付
          </p>
        </div>
      </div>

      {showModal && (
        <PayModal
          type="baby"
          onClose={() => setShowModal(false)}
          onPaid={onPaid}
        />
      )}
    </>
  );
}

function CompanyPaywall({ onPaid }: { onPaid: () => void }) {
  const [showModal, setShowModal] = useState(false);
  const s = styles.company;

  return (
    <>
      <div className={`mt-10 p-6 md:p-8 rounded-3xl border ${s.wrapper} text-center relative overflow-hidden`}>
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/40" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/30" />

        <div className="relative">
          <span className={`inline-block px-4 py-1 ${s.badge} ${s.badgeText} text-xs font-bold rounded-full mb-4`}>
            专业筛查
          </span>

          <h3 className={`text-xl font-bold ${s.title} mb-2`}>
            好名字想好了，商标能注册吗？
          </h3>
          <p className={`text-sm ${s.subtitle} mb-5`}>
            最怕的不是想不出名字——是想好了才发现商标已被注册。
          </p>

          {/* 痛点场景 */}
          <div className="mb-5 space-y-1.5 text-sm text-left max-w-xs mx-auto">
            {[
              "🔍 商标筛查 → 别等注册时被驳回",
              "🌐 域名检测 → 好名字要配好域名",
              "💡 品牌解读 → 知道这个名字为什么好",
            ].map((line, i) => (
              <p key={i} className={`${s.feature} px-3 py-1.5 rounded-lg bg-white/60`}>
                {line}
              </p>
            ))}
          </div>

          {/* 功能清单 */}
          <ul className="space-y-2 mb-5 text-left max-w-xs mx-auto">
            {[
              "40 个品牌名 + 完整品牌寓意拆解",
              "商标可注册性分析 + 域名可用性检测",
              "一句品牌口号 + 行业契合度评估",
              "一次付费，永久查看",
            ].map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className={`mt-0.5 ${s.featureIcon} text-xs`}>▸</span>
                <span className={`text-sm ${s.feature}`}>{f}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setShowModal(true)}
            className={`px-10 py-3.5 ${s.button} text-white rounded-2xl font-bold transition active:scale-[0.97]`}
          >
            仅需 19.9 元 · 筛出能用的好名字
          </button>

          <p className={`text-xs ${s.priceAnchor} mt-2`}>
            比注册商标被驳回损失 300 元+ 更划算
          </p>

          <p className={`text-xs ${s.proof} mt-1`}>
            已有 637 位创业者解锁了完整报告
          </p>

          <p className={`text-xs ${s.note} mt-2`}>
            微信 / 支付宝均可支付
          </p>
        </div>
      </div>

      {showModal && (
        <PayModal
          type="company"
          onClose={() => setShowModal(false)}
          onPaid={onPaid}
        />
      )}
    </>
  );
}

export function Paywall({ type, onPaid }: PaywallProps) {
  if (type === "baby") return <BabyPaywall onPaid={onPaid} />;
  return <CompanyPaywall onPaid={onPaid} />;
}
