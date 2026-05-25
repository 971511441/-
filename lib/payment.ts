import crypto from "crypto";

const APP_KEY = process.env.MIANBAODUO_APP_KEY!;
const APP_SECRET = process.env.MIANBAODUO_APP_SECRET!;
const NOTIFY_URL = process.env.MIANBAODUO_NOTIFY_URL!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

interface CreateOrderParams {
  amount: number;
  productName: string;
  outTradeNo: string;
}

export async function createOrder(params: CreateOrderParams) {
  const body: Record<string, string | number> = {
    app_key: APP_KEY,
    amount: params.amount,
    product_name: params.productName,
    out_trade_no: params.outTradeNo,
    notify_url: NOTIFY_URL,
    return_url: `${SITE_URL}/pay/success?order=${params.outTradeNo}`,
  };

  const res = await fetch("https://api.mianbaoduo.com/v1/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`创建订单失败: ${res.status} ${text}`);
  }

  return res.json() as Promise<{ order_id: string; pay_url: string; qrcode_url?: string }>;
}

export function verifyCallback(payload: Record<string, unknown>, signature: string): boolean {
  const computed = crypto
    .createHmac("sha256", APP_SECRET)
    .update(JSON.stringify(payload))
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computed));
  } catch {
    return false;
  }
}
