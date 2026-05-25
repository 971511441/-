import { NextRequest, NextResponse } from "next/server";
import { generateBabyNames, generateCompanyNames } from "@/lib/naming";
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

  const body = await req.json();
  const { type, surname, gender, birthDate, style, industry, keywords } = body;

  try {
    let names;
    if (type === "baby") {
      names = await generateBabyNames({
        surname: surname || "张",
        gender: gender || "unknown",
        birthDate,
        style: style || "现代",
        count: 10,
      });
    } else if (type === "company") {
      names = await generateCompanyNames(
        industry || "互联网",
        keywords || "",
        style || "科技感",
        10
      );
    } else {
      return NextResponse.json({ error: "请指定 type: 'baby' 或 'company'" }, { status: 400 });
    }

    return NextResponse.json({
      names,
      remaining: rl.remaining,
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: "生成失败，请稍后重试" }, { status: 500 });
  }
}
