import Link from "next/link";

export function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-amber-700">
          AI起名
        </Link>
        <div className="flex gap-6 text-sm text-gray-600">
          <Link href="/baby-name" className="hover:text-amber-700">
            宝宝起名
          </Link>
          <Link href="/company-name" className="hover:text-amber-700">
            公司起名
          </Link>
          <Link href="/articles" className="hover:text-amber-700">
            起名攻略
          </Link>
        </div>
      </nav>
    </header>
  );
}
