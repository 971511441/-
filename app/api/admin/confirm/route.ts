import { NextRequest, NextResponse } from "next/server";
import { confirmPayment } from "@/lib/orders";

const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || "aiming2026admin";

export async function POST(req: NextRequest) {
  try {
    const { orderId, key } = await req.json();
    if (key !== ADMIN_KEY) {
      return NextResponse.json({ error: "密钥错误" }, { status: 403 });
    }
    const order = confirmPayment(orderId);
    if (!order) {
      return NextResponse.json({ error: "订单不存在或已确认" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "确认失败" }, { status: 500 });
  }
}
