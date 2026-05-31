import { NextRequest, NextResponse } from "next/server";
import { generateBabyNamesFree, generateCompanyNamesFree } from "@/lib/naming";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const rl = rateLimit(ip, 5, 3600_000); // 5 free generations per hour per IP
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "免费次数已用完，请稍后再试或付费解锁无限生成" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": String(rl.remaining),
          "X-RateLimit-Reset": String(rl.resetAt),
        },
      }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const { type, surname, gender, birthDate, style, industry, keywords } = body;

  // Sanitize user inputs against prompt injection
  const sanitize = (s: string, maxLen: number) =>
    (s || "").replace(/[\n\r\t\\"`]/g, "").slice(0, maxLen);

  try {
    let names;
    if (type === "baby") {
      const safeSurname = sanitize(surname, 4) || "张";
      names = await generateBabyNamesFree({
        surname: safeSurname,
        gender: gender || "unknown",
        birthDate: sanitize(birthDate || "", 20),
        style: sanitize(style || "现代", 20),
        count: 10,
      });
    } else if (type === "company") {
      names = await generateCompanyNamesFree(
        sanitize(industry || "互联网", 50),
        sanitize(keywords || "", 50),
        sanitize(style || "科技感", 20),
        10
      );
    } else {
      return NextResponse.json({ error: "请指定 type: 'baby' 或 'company'" }, { status: 400 });
    }

    return NextResponse.json(
      { names, remaining: rl.remaining },
      {
        headers: {
          "X-RateLimit-Remaining": String(rl.remaining),
          "X-RateLimit-Reset": String(rl.resetAt),
        },
      }
    );
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: "生成失败，请稍后重试" }, { status: 500 });
  }
}
