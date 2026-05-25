import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI起名 - 智能宝宝取名、公司品牌起名",
    template: "%s | AI起名",
  },
  description:
    "AI智能起名工具，支持宝宝取名、公司起名、品牌命名。免费生成10个名字，付费解锁50个名字+详细寓意分析。诗经楚辞、现代简约多种风格可选。",
  keywords: ["起名", "取名", "宝宝取名", "公司起名", "AI起名", "免费起名"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
