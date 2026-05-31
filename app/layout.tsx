import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI起名 · 宝宝取名、公司品牌起名 | 找到你最中意的名字",
    template: "%s | AI起名",
  },
  description:
    "从诗经楚辞到八字五行，为宝宝和品牌取一个有温度的名字。AI智能起名，免费生成10个，付费解锁50个+深度寓意分析。",
  keywords: ["起名", "取名", "宝宝取名", "公司起名", "AI起名", "免费起名", "诗经起名", "八字起名"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col text-gray-800">
        <script defer src="https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
