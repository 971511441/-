import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/orders";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ error: "缺少 orderId" }, { status: 400 });
  }
  const order = getOrder(orderId);
  if (!order) {
    return NextResponse.json({ error: "订单不存在" }, { status: 404 });
  }
  return NextResponse.json({
    status: order.status,
    paidAt: order.paidAt,
  });
}
