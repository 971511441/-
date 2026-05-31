import { NextRequest, NextResponse } from "next/server";
import { getOrder, confirmPayment } from "@/lib/orders";

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch (e) {
    console.error("[order/self-confirm] Body parse error:", e);
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const { orderId } = body;
  if (!orderId) {
    return NextResponse.json({ error: "缺少订单号" }, { status: 400 });
  }

  const order = getOrder(orderId);
  if (!order) {
    return NextResponse.json({ error: "订单不存在" }, { status: 404 });
  }

  if (order.status === "paid") {
    return NextResponse.json({ ok: true, message: "已确认" });
  }

  const confirmed = confirmPayment(orderId);
  if (!confirmed) {
    return NextResponse.json({ error: "确认失败" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
