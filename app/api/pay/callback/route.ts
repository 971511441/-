import { NextRequest, NextResponse } from "next/server";
import { verifyCallback } from "@/lib/payment";
import { updateOrder } from "@/lib/storage";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const signature = req.headers.get("x-mbd-signature") || "";

  if (!verifyCallback(body, signature)) {
    return NextResponse.json({ error: "签名验证失败" }, { status: 403 });
  }

  const { out_trade_no, status } = body;

  if (status === "paid" && out_trade_no) {
    updateOrder(out_trade_no as string, {
      status: "paid",
      paidAt: new Date().toISOString(),
      tradeNo: body.trade_no,
    });
  }

  return NextResponse.json({ code: 0 });
}
