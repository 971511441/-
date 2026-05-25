import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function saveOrder(orderId: string, data: Record<string, unknown>) {
  const dir = path.join(DATA_DIR, "orders");
  ensureDir(dir);
  fs.writeFileSync(path.join(dir, `${orderId}.json`), JSON.stringify(data, null, 2));
}

export function getOrder(orderId: string): Record<string, unknown> | null {
  const file = path.join(DATA_DIR, "orders", `${orderId}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export function updateOrder(orderId: string, updates: Record<string, unknown>) {
  const existing = getOrder(orderId) || {};
  saveOrder(orderId, { ...existing, ...updates });
}

export function saveArticle(slug: string, data: Record<string, unknown>) {
  const dir = path.join(DATA_DIR, "articles");
  ensureDir(dir);
  fs.writeFileSync(path.join(dir, `${slug}.json`), JSON.stringify(data, null, 2));
}

export function getArticle(slug: string): Record<string, unknown> | null {
  const file = path.join(DATA_DIR, "articles", `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export function listArticles(): { slug: string; title: string; createdAt: string }[] {
  const dir = path.join(DATA_DIR, "articles");
  ensureDir(dir);
  return fs.readdirSync(dir)
    .filter(f => f.endsWith(".json"))
    .map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
      return { slug: f.replace(".json", ""), title: data.title as string, createdAt: data.createdAt as string };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
