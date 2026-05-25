import { listArticles } from "@/lib/storage";
import { NextResponse } from "next/server";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aiqiming.vercel.app";
  const articles = listArticles();

  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/baby-name", priority: "0.9", changefreq: "weekly" },
    { url: "/company-name", priority: "0.9", changefreq: "weekly" },
    { url: "/articles", priority: "0.8", changefreq: "daily" },
  ];

  const articlePages = articles.map((a) => ({
    url: `/articles/${a.slug}`,
    priority: "0.7",
    changefreq: "monthly",
  }));

  const allPages = [...staticPages, ...articlePages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (p) => `  <url>
    <loc>${siteUrl}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
}
