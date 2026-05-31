import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";

export async function POST(req: NextRequest) {
  try {
    const { type } = await req.json();
    if (type !== "baby" && type !== "company") {
      return NextResponse.json({ error: "无效的类型" }, { status: 400 });
    }
    const order = createOrder(type);
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
    });
  } catch (e) {
    console.error("[order/create] Error:", e);
    return NextResponse.json({ error: "创建订单失败" }, { status: 500 });
  }
}
