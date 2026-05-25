import { NextRequest, NextResponse } from "next/server";
import { getOrder, updateOrder } from "@/lib/storage";
import { generateBabyNames, generateCompanyNames } from "@/lib/naming";

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const { orderId, surname, gender, birthDate, style, industry, keywords } = body;

  if (!orderId) {
    return NextResponse.json({ error: "缺少订单号" }, { status: 400 });
  }

  const order = getOrder(orderId);
  if (!order) {
    return NextResponse.json({ error: "订单不存在" }, { status: 404 });
  }
  if (order.status !== "paid") {
    return NextResponse.json({ error: "订单未支付" }, { status: 402 });
  }

  // Return cached result if already generated
  if (order.result) {
    return NextResponse.json({ names: order.result });
  }

  try {
    let names;
    if (order.type === "baby") {
      names = await generateBabyNames({
        surname: surname || "张",
        gender: gender || "unknown",
        birthDate,
        style: style || "现代",
        count: 50,
      });
    } else {
      names = await generateCompanyNames(
        industry || "互联网",
        keywords || "",
        style || "科技感",
        50
      );
    }

    updateOrder(orderId, { result: names });
    return NextResponse.json({ names });
  } catch (error) {
    console.error("Paid generation error:", error);
    return NextResponse.json({ error: "生成失败，请稍后重试" }, { status: 500 });
  }
}
