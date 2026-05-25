import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我们",
  description: "AI起名 - 基于人工智能大模型的智能起名工具",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">关于AI起名</h1>
      <div className="prose prose-gray max-w-none space-y-4">
        <p>
          AI起名是一个基于人工智能大模型的智能取名工具。我们利用先进的AI技术，
          结合中国传统文化中的诗经、楚辞、八字五行等元素，为宝宝、公司、品牌提供
          优质的起名建议。
        </p>
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">为什么选择AI起名</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>AI生成速度快，10秒内提供10个优质名字</li>
          <li>覆盖多种风格：诗经古风、楚辞浪漫、现代简约</li>
          <li>每个名字附带详细寓意解释和评分</li>
          <li>付费用户享受50个名字+八字五行分析+重名度评估</li>
        </ul>
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">联系我们</h2>
        <p>如有问题或建议，欢迎通过网站留言或邮件联系我们。</p>
      </div>
    </div>
  );
}
