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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {isBaby ? (
        <>
          {/* Baby name fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">姓氏</label>
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="请输入姓氏"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">性别</label>
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
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-600">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">出生日期（选填）</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">风格</label>
            <select
              value={babyStyle}
              onChange={(e) => setBabyStyle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            >
              <option value="现代">现代</option>
              <option value="诗经">诗经</option>
              <option value="楚辞">楚辞</option>
              <option value="英文名">英文名</option>
            </select>
          </div>
        </>
      ) : (
        <>
          {/* Company name fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">行业</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="例如：互联网、餐饮、教育"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">关键词（选填）</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="例如：创新、科技、绿色"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">风格</label>
            <select
              value={companyStyle}
              onChange={(e) => setCompanyStyle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="科技感">科技感</option>
              <option value="传统">传统</option>
              <option value="简约">简约</option>
              <option value="国际范">国际范</option>
            </select>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : isBaby
            ? "bg-amber-600 hover:bg-amber-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "AI生成中..." : isBaby ? "开始起名" : "生成公司名"}
      </button>
    </form>
  );
}
