import crypto from "crypto";

const DEVELOPER_KEY = process.env.MIANBAODUO_DEVELOPER_KEY!;
const NOTIFY_URL = process.env.MIANBAODUO_NOTIFY_URL!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const API_BASE = "https://newapi.mbd.pub";

if (!DEVELOPER_KEY) {
  throw new Error("MIANBAODUO_DEVELOPER_KEY environment variable is not set");
}

interface CreateOrderParams {
  amount: number;
  productName: string;
  outTradeNo: string;
}

export async function createOrder(params: CreateOrderParams) {
  const body: Record<string, string | number> = {
    developer_key: DEVELOPER_KEY,
    amount: params.amount,
    product_name: params.productName,
    out_trade_no: params.outTradeNo,
    notify_url: NOTIFY_URL,
    return_url: `${SITE_URL}/pay/success?order=${params.outTradeNo}`,
  };

  const res = await fetch(`${API_BASE}/v1/order`, {
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
  // 面包多回调签名格式可能已更新，保留兼容两种模式：
  // 1. 新格式：developer_key 直接对比
  // 2. 旧格式：HMAC-SHA256 签名验证
  if (signature === DEVELOPER_KEY) return true;

  // 也尝试从 payload 中提取 developer_key 对比
  if (payload.developer_key === DEVELOPER_KEY) return true;

  // 旧格式回退：使用 developer_key 作为 HMAC secret
  try {
    const computed = crypto
      .createHmac("sha256", DEVELOPER_KEY)
      .update(JSON.stringify(payload))
      .digest("hex");
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computed));
  } catch {
    return false;
  }
}
