import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("order");
  if (!orderId) {
    return NextResponse.json({ error: "缺少订单号" }, { status: 400 });
  }

  const order = getOrder(orderId);
  if (!order) {
    return NextResponse.json({ error: "订单不存在" }, { status: 404 });
  }

  return NextResponse.json({
    paid: order.status === "paid",
    type: order.type,
    hasResult: !!order.result,
  });
}
