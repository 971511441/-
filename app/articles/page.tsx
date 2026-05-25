import { listArticles } from "@/lib/storage";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ArticlesPage() {
  const articles = listArticles();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
        起名攻略
      </h1>
      <p className="text-center text-gray-500 mb-8">
        精选起名知识和技巧，帮你取个好名字
      </p>
      {articles.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">📝</p>
          <p>文章正在赶来中，请稍后再来</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/articles/${a.slug}`}
              className="p-6 rounded-xl border hover:border-amber-300 hover:shadow-md transition group"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-amber-700">
                {a.title}
              </h2>
              <time className="text-xs text-gray-400">
                {a.createdAt.split("T")[0]}
              </time>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
