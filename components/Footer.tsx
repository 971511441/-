import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6 text-center text-sm text-gray-400">
      <p>AI起名 - 智能取名工具 · 基于AI大模型生成</p>
      <p className="mt-1">
        <Link href="/about" className="hover:text-amber-700">关于我们</Link>
      </p>
    </footer>
  );
}
