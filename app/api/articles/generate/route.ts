import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/deepseek";
import { pickKeyword } from "@/lib/seo-keywords";
import { saveArticle } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const key = req.headers.get("x-admin-key") || req.nextUrl.searchParams.get("key");
  if (key !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { keyword, volume, competition } = pickKeyword();

  const prompt = `你是一位专业的SEO内容写手。请写一篇关于"${keyword}"的原创文章。

要求：
1. 标题吸引人，包含关键词
2. 正文1500-2000字，分3-4个小标题
3. 内容实用、有干货，不讲空话
4. SEO友好：包含关键词的自然出现、长尾词覆盖
5. 文末自然引导读者试用AI起名工具："如果你也在为起名发愁，可以试试使用AI智能起名工具，免费生成10个名字，还能查看详细寓意分析。"
6. 返回纯JSON格式：{"title": "标题", "content": "Markdown格式正文", "description": "150字SEO摘要"}

只返回JSON，不要其他内容。`;

  try {
    const response = await chat([
      { role: "system", content: "你是专业的SEO内容写手。只返回JSON，不要markdown代码块。" },
      { role: "user", content: prompt },
    ]);

    const article = JSON.parse(
      response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    );

    const slug =
      article.title
        .replace(/[^一-龥a-zA-Z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60) +
      "-" +
      Date.now().toString(36);

    const articleData = {
      ...article,
      slug,
      keyword,
      volume,
      competition,
      createdAt: new Date().toISOString(),
    };

    saveArticle(slug, articleData);
    return NextResponse.json(articleData);
  } catch (error) {
    console.error("Article generation error:", error);
    return NextResponse.json({ error: "文章生成失败" }, { status: 500 });
  }
}
