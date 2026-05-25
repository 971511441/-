// Daily SEO article generator — designed to run via cron or manual trigger
// Usage: npx tsx scripts/seo-generate.ts [count]

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function generateArticle() {
  const res = await fetch(`${SITE_URL}/api/articles/generate`, {
    method: "POST",
    headers: { "x-admin-key": ADMIN_SECRET },
  });

  if (!res.ok) {
    console.error(`Failed: ${res.status} ${await res.text()}`);
    return null;
  }

  return res.json();
}

async function main() {
  console.log(`[${new Date().toISOString()}] Starting SEO article generation...`);

  const count = parseInt(process.argv[2] || "10", 10);
  let success = 0;

  for (let i = 0; i < count; i++) {
    const article = await generateArticle();
    if (article) {
      success++;
      console.log(`  ✅ [${i + 1}/${count}] ${article.title}`);
    } else {
      console.log(`  ❌ [${i + 1}/${count}] Failed`);
    }
    // Delay between requests to avoid API rate limits
    await new Promise((r) => setTimeout(r, 3000));
  }

  console.log(`Done: ${success}/${count} articles generated.`);
}

main().catch(console.error);
