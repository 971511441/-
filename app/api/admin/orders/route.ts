import { NextResponse } from "next/server";
import { getAllOrders } from "@/lib/orders";

export async function GET() {
  const orders = getAllOrders();
  return NextResponse.json({ orders });
}
