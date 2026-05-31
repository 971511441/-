"use client";

import { NameEntry } from "@/lib/types";
import { usePathname } from "next/navigation";

interface NameResultsProps {
  names: NameEntry[];
  isPaid: boolean;
}

function BabyCard({ entry }: { entry: NameEntry }) {
  return (
    <div className="group relative bg-white/80 border border-pink-100 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100/50 rounded-2xl p-5 transition-all">
      {/* Header: name + score */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-2xl font-bold text-rose-800">{entry.name}</h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-rose-50 text-rose-600 border border-rose-200">
          {entry.score}分
        </span>
      </div>

      {/* Meaning */}
      <p className="text-sm leading-relaxed text-rose-700/70">{entry.meaning}</p>

      {/* Paid-only details */}
      {entry.analysis && (
        <div className="mt-3 pt-3 border-t border-pink-100 space-y-2">
          {/* 字义拆解 */}
          <div className="flex gap-2">
            <span className="text-xs mt-0.5 shrink-0">🏷</span>
            <p className="text-xs leading-relaxed text-rose-500">
              <span className="font-medium text-rose-600">字义：</span>
              {entry.analysis}
            </p>
          </div>

          {/* 八字五行 */}
          {entry.bazi && (
            <div className="flex gap-2">
              <span className="text-xs mt-0.5 shrink-0">🔮</span>
              <p className="text-xs leading-relaxed text-rose-500">
                <span className="font-medium text-rose-600">八字五行：</span>
                {entry.bazi}
              </p>
            </div>
          )}

          {/* 重名度 */}
          {entry.popularity && (
            <div className="flex gap-2">
              <span className="text-xs mt-0.5 shrink-0">📊</span>
              <p className="text-xs leading-relaxed text-rose-500">
                <span className="font-medium text-rose-600">重名度：</span>
                {entry.popularity}
              </p>
            </div>
          )}

          {/* 小名推荐 */}
          {entry.nickname && (
            <div className="flex gap-2">
              <span className="text-xs mt-0.5 shrink-0">🍼</span>
              <p className="text-xs leading-relaxed text-rose-500">
                <span className="font-medium text-rose-600">小名：</span>
                {entry.nickname}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CompanyCard({ entry }: { entry: NameEntry }) {
  return (
    <div className="group relative bg-white/80 border border-blue-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-blue-100/50 rounded-xl p-5 transition-all">
      {/* Header: name + score */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-2xl font-bold text-indigo-800">{entry.name}</h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-50 text-indigo-600 border border-indigo-200">
          {entry.score}分
        </span>
      </div>

      {/* Meaning */}
      <p className="text-sm leading-relaxed text-indigo-700/70">{entry.meaning}</p>

      {/* Tagline */}
      {entry.tagline && (
        <p className="mt-2 text-sm italic text-blue-500">「{entry.tagline}」</p>
      )}

      {/* Paid-only details */}
      {(entry.trademark || entry.domain) && (
        <div className="mt-3 pt-3 border-t border-blue-100 space-y-2">
          {/* 商标分析 */}
          {entry.trademark && (
            <div className="flex gap-2">
              <span className="text-xs mt-0.5 shrink-0">⚖</span>
              <p className="text-xs leading-relaxed text-indigo-500">
                <span className="font-medium text-indigo-600">商标分析：</span>
                {entry.trademark}
              </p>
            </div>
          )}

          {/* 域名建议 */}
          {entry.domain && (
            <div className="flex gap-2">
              <span className="text-xs mt-0.5 shrink-0">🌐</span>
              <p className="text-xs leading-relaxed text-indigo-500">
                <span className="font-medium text-indigo-600">域名建议：</span>
                {entry.domain}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function NameResults({ names, isPaid }: NameResultsProps) {
  const pathname = usePathname();
  void isPaid;
  const isBaby = pathname === "/baby-name";

  if (names.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {names.map((entry, index) =>
        isBaby ? (
          <BabyCard key={index} entry={entry} />
        ) : (
          <CompanyCard key={index} entry={entry} />
        )
      )}
    </div>
  );
}
