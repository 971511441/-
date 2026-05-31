"use client";

import { useState } from "react";

interface BabyParams {
  surname: string;
  gender: "male" | "female" | "unknown";
  birthDate: string;
  style: string;
}

interface CompanyParams {
  industry: string;
  keywords: string;
  style: string;
}

export type GenerateParams = { type: "baby" } & BabyParams | { type: "company" } & CompanyParams;

interface NameFormProps {
  type: "baby" | "company";
  onGenerate: (params: GenerateParams) => void;
  loading: boolean;
}

const babyStyles = ["现代", "诗经", "楚辞", "英文名"];
const companyStyles = ["科技感", "传统", "简约", "国际范"];

export function NameForm({ type, onGenerate, loading }: NameFormProps) {
  const [surname, setSurname] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "unknown">("unknown");
  const [birthDate, setBirthDate] = useState("");
  const [babyStyle, setBabyStyle] = useState("现代");
  const [industry, setIndustry] = useState("");
  const [keywords, setKeywords] = useState("");
  const [companyStyle, setCompanyStyle] = useState("科技感");

  const isBaby = type === "baby";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (isBaby) {
      onGenerate({
        type: "baby",
        surname: surname || "张",
        gender,
        birthDate,
        style: babyStyle,
      });
    } else {
      onGenerate({
        type: "company",
        industry: industry || "互联网",
        keywords,
        style: companyStyle,
      });
    }
  };

  const inputClass = isBaby
    ? "w-full px-4 py-2.5 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-transparent outline-none bg-white/70"
    : "w-full px-4 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none bg-white/70";

  const labelClass = isBaby
    ? "block text-sm font-medium text-rose-600 mb-1.5"
    : "block text-sm font-medium text-indigo-600 mb-1.5";

  const radioClass = isBaby
    ? "text-pink-500 focus:ring-pink-400"
    : "text-blue-500 focus:ring-blue-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {isBaby ? (
        <>
          <div>
            <label className={labelClass}>姓氏</label>
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="请输入姓氏"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>性别</label>
            <div className="flex gap-4">
              {[
                { value: "unknown", label: "未知" },
                { value: "male", label: "男孩" },
                { value: "female", label: "女孩" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={opt.value}
                    checked={gender === opt.value}
                    onChange={() => setGender(opt.value as "male" | "female" | "unknown")}
                    className={radioClass}
                  />
                  <span className="text-sm text-rose-500">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>出生日期（选填）</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>风格</label>
            <div className="flex flex-wrap gap-2">
              {babyStyles.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setBabyStyle(s)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
                    babyStyle === s
                      ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                      : "bg-white/60 text-rose-500 border-pink-200 hover:border-rose-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <label className={labelClass}>行业</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="例如：互联网、餐饮、教育"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>关键词（选填）</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="例如：创新、科技、绿色"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>风格</label>
            <div className="flex flex-wrap gap-2">
              {companyStyles.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setCompanyStyle(s)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition border ${
                    companyStyle === s
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white/60 text-indigo-600 border-blue-200 hover:border-indigo-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-6 rounded-2xl text-white font-bold transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
          loading
            ? "bg-gray-400"
            : isBaby
            ? "bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:via-rose-600 hover:to-amber-600 shadow-lg shadow-rose-200/50"
            : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-blue-200/50"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            AI 生成中...
          </span>
        ) : isBaby ? (
          "开始起名"
        ) : (
          "生成品牌名"
        )}
      </button>
    </form>
  );
}
