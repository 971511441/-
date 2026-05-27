import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

interface Order {
  id: string;
  type: "baby" | "company";
  amount: number;
  status: "pending" | "paid";
  createdAt: string;
  paidAt: string | null;
  result?: unknown;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, "[]", "utf-8");
}

function readOrders(): Order[] {
  ensureDataDir();
  try {
    return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]) {
  ensureDataDir();
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

export function createOrder(type: "baby" | "company"): Order {
  const orders = readOrders();
  const order: Order = {
    id: `ORDER_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    amount: 19.9,
    status: "pending",
    createdAt: new Date().toISOString(),
    paidAt: null,
  };
  orders.push(order);
  writeOrders(orders);
  return order;
}

export function getOrder(id: string): Order | undefined {
  return readOrders().find((o) => o.id === id);
}

export function getAllOrders(): Order[] {
  return readOrders().reverse();
}

export function updateOrderResult(id: string, result: unknown) {
  const orders = readOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) return;
  order.result = result;
  writeOrders(orders);
}

export function confirmPayment(id: string): Order | null {
  const orders = readOrders();
  const order = orders.find((o) => o.id === id);
  if (!order || order.status === "paid") return null;
  order.status = "paid";
  order.paidAt = new Date().toISOString();
  writeOrders(orders);
  return order;
}
