const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL =
  process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";

if (!DEEPSEEK_API_KEY) {
  throw new Error("DEEPSEEK_API_KEY environment variable is not set");
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chat(
  messages: ChatMessage[],
  options?: { temperature?: number; max_tokens?: number }
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);

  try {
    const res = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        messages,
        temperature: options?.temperature ?? 0.9,
        max_tokens: options?.max_tokens ?? 4000,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`DeepSeek API error: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error(`DeepSeek API returned unexpected response: ${JSON.stringify(data).slice(0, 200)}`);
    }
    return content;
  } finally {
    clearTimeout(timeout);
  }
}
