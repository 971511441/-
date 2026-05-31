import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6 text-center text-sm text-gray-400">
      <p>AI起名 · 找到你最中意的名字</p>
      <p className="mt-1">
        <Link href="/about" className="hover:text-amber-700">关于我们</Link>
        <span className="mx-2">·</span>
        <span suppressHydrationWarning>访客 <span id="busuanzi_value_site_uv">-</span> 人</span>
      </p>
    </footer>
  );
}
