import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/payment";
import { saveOrder } from "@/lib/storage";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const { type } = body;
  if (type !== "baby" && type !== "company") {
    return NextResponse.json({ error: "请指定正确的 type" }, { status: 400 });
  }

  const outTradeNo = `name_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

  try {
    const order = await createOrder({
      amount: 1990, // 19.90 RMB in cents
      productName: type === "baby" ? "宝宝起名-深度分析" : "公司起名-深度分析",
      outTradeNo,
    });

    saveOrder(outTradeNo, {
      type,
      amount: 1990,
      status: "pending",
      createdAt: new Date().toISOString(),
      paidAt: null,
    });

    return NextResponse.json({
      outTradeNo,
      payUrl: order.pay_url,
      qrcodeUrl: order.qrcode_url || null,
    });
  } catch (error: any) {
    console.error("Payment create error:", error);
    return NextResponse.json({ error: error.message || "创建订单失败" }, { status: 500 });
  }
}
