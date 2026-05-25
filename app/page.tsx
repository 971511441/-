import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        AI智能起名
      </h1>
      <p className="text-lg text-gray-500 mb-10">
        基于AI大模型，免费生成10个名字，付费解锁深度分析
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Link
          href="/baby-name"
          className="p-8 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 transition"
        >
          <div className="text-3xl mb-2">👶</div>
          <h2 className="text-xl font-semibold text-amber-800">宝宝起名</h2>
          <p className="text-sm text-amber-600 mt-1">
            诗经楚辞 · 八字五行 · 重名度评估
          </p>
        </Link>
        <Link
          href="/company-name"
          className="p-8 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition"
        >
          <div className="text-3xl mb-2">🏢</div>
          <h2 className="text-xl font-semibold text-blue-800">公司起名</h2>
          <p className="text-sm text-blue-600 mt-1">
            品牌命名 · 商标分析 · 域名检测
          </p>
        </Link>
      </div>
    </div>
  );
}
