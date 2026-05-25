import { NextRequest, NextResponse } from "next/server";
import { listArticles } from "@/lib/storage";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const ordersDir = path.join(process.cwd(), "data", "orders");
  let todayOrders = 0;
  let todayRevenue = 0;
  let totalOrders = 0;

  if (fs.existsSync(ordersDir)) {
    const today = new Date().toISOString().split("T")[0];
    const files = fs.readdirSync(ordersDir);
    totalOrders = files.length;
    for (const file of files) {
      try {
        const order = JSON.parse(fs.readFileSync(path.join(ordersDir, file), "utf-8"));
        if (order.status === "paid") {
          if (order.createdAt?.startsWith(today)) {
            todayOrders++;
            todayRevenue += order.amount || 0;
          }
        }
      } catch {
        // Skip corrupted files
      }
    }
  }

  return NextResponse.json({
    todayOrders,
    todayRevenue,
    totalOrders,
    totalArticles: listArticles().length,
  });
}
