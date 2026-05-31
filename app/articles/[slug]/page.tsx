import { getArticle } from "@/lib/storage";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = getArticle(params.slug);
  if (!article) return { title: "文章未找到" };
  return {
    title: article.title as string,
    description: article.description as string,
    keywords: (article.keyword as string) || "",
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const jsonLd = article.jsonld as string | undefined;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      <article className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/articles"
          className="text-sm text-amber-600 hover:underline mb-4 inline-block"
        >
          ← 返回文章列表
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {article.title as string}
        </h1>
        <time className="text-sm text-gray-400">
          {(article.createdAt as string).split("T")[0]}
        </time>
        <div
          className="mt-6 prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{
            __html: (article.content as string)
              .replace(/\\n/g, "<br/>")
              .replace(/\n/g, "<br/>"),
          }}
        />
        <div className="mt-12 p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center">
          <p className="text-amber-800 mb-3">
            想要更多好名字？试试AI智能起名工具
          </p>
          <Link
            href="/baby-name"
            className="inline-block px-6 py-2 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition"
          >
            免费生成10个名字 →
          </Link>
        </div>
      </article>
    </>
  );
}
