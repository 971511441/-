// Xiaohongshu auto-publish script using Playwright
// Usage: npx tsx scripts/xiaohongshu-publish.ts

import { chromium } from "playwright";
import fs from "fs";

const STATE_FILE = "data/xhs-state.json";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";

async function callDeepSeek(messages: { role: string; content: string }[]): Promise<string> {
  const res = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({ model: "deepseek-chat", messages, temperature: 0.9, max_tokens: 800 }),
  });
  const data = await res.json();
  return data.choices[0].message.content;
}

async function generateNote(): Promise<{ title: string; content: string; tags: string[] }> {
  const prompts = [
    "写一篇小红书笔记：帮粉丝起了10个超好听的名字分享出来。用✨分隔，语气可爱活泼。标题抓眼球。",
    "写一篇：做母婴博主3年整理的取名秘籍，分享4个取名原则。语气温柔有经验感。",
    "写一篇：分享5个出自诗经的绝美女孩名字，每个名字讲典故。语气文艺。",
  ];

  const prompt = prompts[Math.floor(Math.random() * prompts.length)];
  const formatPrompt = `${prompt}\n\n返回JSON：{"title": "标题15字内含emoji", "content": "正文用\\n换行300-500字", "tags": ["标签1", "标签2", "标签3"]}`;

  const response = await callDeepSeek([
    { role: "system", content: "你是小红书博主，笔记真实有互动感。只返回JSON。" },
    { role: "user", content: formatPrompt },
  ]);

  return JSON.parse(response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
}

async function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  } catch {}
  return {};
}

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: await loadState(),
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();

  try {
    await page.goto("https://creator.xiaohongshu.com");
    await page.waitForSelector(".creator-container", { timeout: 5000 });
    console.log("Already logged in.");
  } catch {
    console.log("Not logged in. Login manually (scan QR, 60s)...");
    await page.goto("https://creator.xiaohongshu.com");
    await page.waitForTimeout(60000);
    await context.storageState({ path: STATE_FILE });
    console.log("State saved.");
  }

  const note = await generateNote();
  console.log(`Publishing: ${note.title}`);

  try {
    await page.click("text=发布笔记");
    await page.waitForTimeout(2000);
    await page.fill('[placeholder*="标题"]', note.title);
    await page.fill('[placeholder*="正文"]', note.content);
    for (const tag of note.tags.slice(0, 5)) {
      await page.fill('[placeholder*="标签"]', `#${tag}`);
      await page.keyboard.press("Enter");
      await page.waitForTimeout(500);
    }
    await page.click("button:has-text('发布')");
    await page.waitForTimeout(5000);
    console.log("  ✅ Published");
  } catch (e) {
    console.error(`  ❌ Failed: ${e}`);
  }

  await browser.close();
}

main().catch(console.error);
