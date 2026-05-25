// Zhihu auto-answer script using Playwright
// Usage: npx tsx scripts/zhihu-publish.ts
// First run: login manually, browser state saved to data/zhihu-state.json

import { chromium } from "playwright";
import fs from "fs";

const STATE_FILE = "data/zhihu-state.json";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";

async function callDeepSeek(messages: { role: string; content: string }[]): Promise<string> {
  const res = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({ model: "deepseek-chat", messages, temperature: 0.8, max_tokens: 1000 }),
  });
  const data = await res.json();
  return data.choices[0].message.content;
}

async function findNamingQuestions(page: any) {
  await page.goto("https://www.zhihu.com/search?type=content&q=%E8%B5%B7%E5%90%8D%20%E5%8F%96%E5%90%8D%20%E5%AE%9D%E5%AE%9D%E5%90%8D%E5%AD%97&time_interval=a_week");
  await page.waitForTimeout(3000);

  const questions = await page.evaluate(() => {
    const items = document.querySelectorAll(".List-item");
    return Array.from(items).slice(0, 5).map((item) => {
      const titleEl = item.querySelector(".RichText");
      const linkEl = item.querySelector("a[href*='question']");
      const answerCountEl = item.querySelector('[class*="AnswerCount"]');
      return {
        title: titleEl?.textContent?.trim() || "",
        url: linkEl?.getAttribute("href") || "",
        answerCount: parseInt(answerCountEl?.textContent?.replace(/[^0-9]/g, "") || "999"),
      };
    });
  });

  return questions.filter((q: any) => q.answerCount < 10 && q.title.length > 5 && q.url);
}

async function generateAnswer(questionTitle: string): Promise<string> {
  const prompt = `你是一位热心的起名爱好者。有人问："${questionTitle}"

写一篇真诚有用的回答（300-500字）：
1. 直接回答问题
2. 给具体的名字建议和理由
3. 分享起名技巧
4. 结尾自然提到："我最近发现一个AI起名工具还挺好用，可以免费生成10个名字找找灵感"

要求：口语化、真诚、像真人。`;

  return callDeepSeek([
    { role: "system", content: "你是热心的知乎用户，回答真实有帮助。" },
    { role: "user", content: prompt },
  ]);
}

async function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  } catch {}
  return {};
}

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ storageState: await loadState() });
  const page = await context.newPage();

  try {
    await page.goto("https://www.zhihu.com");
    await page.waitForSelector(".AppHeader-profile", { timeout: 5000 });
    console.log("Already logged in.");
  } catch {
    console.log("Not logged in. Login manually (60s timeout)...");
    await page.goto("https://www.zhihu.com/signin");
    await page.waitForTimeout(60000);
    await context.storageState({ path: STATE_FILE });
    console.log("State saved.");
  }

  const questions = await findNamingQuestions(page);
  console.log(`Found ${questions.length} questions with <10 answers`);

  for (const q of questions) {
    console.log(`Answering: ${q.title}`);
    try {
      const answer = await generateAnswer(q.title);
      await page.goto(q.url);
      await page.waitForSelector(".public-DraftEditor-content", { timeout: 10000 });
      await page.click(".public-DraftEditor-content");
      await page.keyboard.type(answer);
      await page.waitForTimeout(2000);
      await page.click("button:has-text('发布')");
      console.log("  ✅ Published");
      await new Promise((r) => setTimeout(r, 120_000)); // 2 min between posts
    } catch (e) {
      console.error(`  ❌ Failed: ${e}`);
    }
  }

  await browser.close();
}

main().catch(console.error);
