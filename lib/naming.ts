import { chat } from "./deepseek";
import { NameEntry } from "./types";

interface GenerateInput {
  surname: string;
  gender: "male" | "female" | "unknown";
  birthDate?: string;
  style: string;
  count: number;
}

// ── 免费版 prompt（只出 name / meaning / score，不含付费权益） ──

function buildBabyPromptFree(input: GenerateInput): string {
  const genderMap = { male: "男孩", female: "女孩", unknown: "宝宝" };
  const gender = genderMap[input.gender];
  const birth = input.birthDate ? `，出生日期：${input.birthDate}` : "";

  const styleHints: Record<string, string> = {
    "诗经": "从《诗经》中选取典故，名字要有诗意和文化底蕴",
    "楚辞": "从《楚辞》中选取典故，名字要浪漫飘逸",
    "现代": "选取现代感强、简洁大方的名字",
    "英文名": "同步推荐合适的中英文名字组合",
  };
  const styleHint = styleHints[input.style] || "综合多种风格";

  return `你是一位专业的起名专家。请为一位${gender}生成${input.count}个中文名字。
姓氏：${input.surname}${birth}
风格：${styleHint}

返回JSON数组，每个名字只包含以下字段：
- name: 完整姓名
- meaning: 简短寓意（30-50字）
- score: 综合评分（1-100）

只返回JSON数组，不要其他内容。`;
}

function buildCompanyPromptFree(industry: string, keywords: string, style: string, count: number): string {
  const styleMap: Record<string, string> = {
    "科技感": "简洁、科技感强、国际化",
    "传统": "稳重、大气、有文化底蕴",
    "简约": "简单好记、朗朗上口",
    "国际范": "中英文兼顾、有全球视野感",
  };
  const styleHint = styleMap[style] || "综合多种风格";

  return `你是一位品牌命名顾问。请为${industry}行业生成${count}个品牌名。
关键词：${keywords}
风格：${styleHint}

返回JSON数组，每个名字只包含以下字段：
- name: 品牌名（2-4个字）
- meaning: 简短寓意（30-50字）
- score: 综合评分（1-100）

只返回JSON数组，不要其他内容。`;
}

export async function generateBabyNamesFree(input: GenerateInput): Promise<NameEntry[]> {
  const prompt = buildBabyPromptFree(input);
  const response = await chat([
    { role: "system", content: "你是一位专业的起名专家。只返回JSON数组。" },
    { role: "user", content: prompt },
  ]);
  return parseNameResponse(response);
}

export async function generateCompanyNamesFree(
  industry: string, keywords: string, style: string, count: number
): Promise<NameEntry[]> {
  const prompt = buildCompanyPromptFree(industry, keywords, style, count);
  const response = await chat([
    { role: "system", content: "你是一位品牌命名顾问。只返回JSON数组。" },
    { role: "user", content: prompt },
  ]);
  return parseNameResponse(response);
}

// ── 付费版 prompt（含八字/重名度/小名/商标/域名等付费权益） ──

function buildBabyPrompt(input: GenerateInput): string {
  const genderMap = { male: "男孩", female: "女孩", unknown: "宝宝" };
  const gender = genderMap[input.gender];
  const birth = input.birthDate ? `，出生日期：${input.birthDate}` : "";

  const styleHints: Record<string, string> = {
    "诗经": "从《诗经》中选取典故，名字要有诗意和文化底蕴",
    "楚辞": "从《楚辞》中选取典故，名字要浪漫飘逸",
    "现代": "选取现代感强、简洁大方的名字",
    "英文名": "同步推荐合适的中英文名字组合",
  };

  const styleHint = styleHints[input.style] || "综合多种风格";

  return `你是一位专业的起名专家，精通诗经楚辞、八字五行和现代取名。请为一位${gender}生成${input.count}个中文名字。
姓氏：${input.surname}${birth}
风格要求：${styleHint}

返回JSON数组格式，每个名字包含以下字段：

- name: 完整姓名（含姓氏）
- meaning: 名字寓意（20-30字，精炼解释核心寓意）
- score: 综合评分（1-100）
${input.birthDate ? "- bazi: 八字简析（20字内，基于出生日期的五行简评）" : "- bazi: 五行属性（10字内，名字用字的五行归属）"}
- popularity: 重名度（「低/中/高」）
- nickname: 小名（1个，2-3字）

只返回JSON数组，不要其他内容。`;
}

function buildCompanyPrompt(industry: string, keywords: string, style: string, count: number): string {
  const styleMap: Record<string, string> = {
    "科技感": "简洁、科技感强、国际化，适合互联网/科技公司",
    "传统": "稳重、大气、有文化底蕴，适合传统行业",
    "简约": "简单好记、朗朗上口、易于传播",
    "国际范": "中英文兼顾、有全球视野感",
  };
  const styleHint = styleMap[style] || "综合多种风格";

  return `你是一位专业的品牌命名顾问，同时了解中国商标法和域名注册实践。请为一家${industry}行业的企业生成${count}个品牌/公司名字。
关键词：${keywords}
风格：${styleHint}

返回JSON数组，每个名字包含以下字段：

- name: 品牌名（2-4个字）
- meaning: 命名寓意（20-30字）
- score: 综合评分（1-100）
- tagline: 品牌口号（8-12字）
- trademark: 商标分析（20字内，显著性+近似风险简述）
- domain: 域名建议（1个，如「hechuang.com」）

只返回JSON数组，不要其他内容。`;
}

async function runBatch(input: GenerateInput, batchIndex: number, batchCount: number): Promise<NameEntry[]> {
  const prompt = buildBabyPrompt(input);
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await chat(
        [
          { role: "system", content: "你是一位专业的起名专家，精通诗经楚辞、八字五行和现代取名。只返回JSON数组。" },
          { role: "user", content: prompt },
        ],
        { max_tokens: 4000 }
      );
      const names = parseNameResponse(response);
      console.log(`generate-paid: batch ${batchIndex}/${batchCount} done, got ${names.length} names`);
      return names;
    } catch (e) {
      console.error(`generate-paid: batch ${batchIndex}/${batchCount} attempt ${attempt + 1} failed:`, e);
      if (attempt === 1) throw e;
    }
  }
  return [];
}

export async function generateBabyNames(input: GenerateInput): Promise<NameEntry[]> {
  const totalCount = input.count;
  const batchSize = 10;
  const batchCount = Math.ceil(totalCount / batchSize);

  console.log(`generate-paid: splitting ${totalCount} names into ${batchCount} batches of ${batchSize} (parallel)`);

  const batchPromises: Promise<NameEntry[]>[] = [];
  for (let i = 0; i < batchCount; i++) {
    const batchInput = { ...input, count: batchSize };
    batchPromises.push(runBatch(batchInput, i + 1, batchCount));
  }

  const results = await Promise.all(batchPromises);
  const allNames = results.flat();
  return allNames.slice(0, totalCount);
}

export async function generateCompanyNames(
  industry: string,
  keywords: string,
  style: string,
  count: number
): Promise<NameEntry[]> {
  const batchSize = 10;
  const batchCount = Math.ceil(count / batchSize);

  console.log(`generate-paid: splitting ${count} names into ${batchCount} batches of ${batchSize} (parallel)`);

  async function runCompanyBatch(batchIndex: number): Promise<NameEntry[]> {
    const prompt = buildCompanyPrompt(industry, keywords, style, batchSize);
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await chat(
          [
            { role: "system", content: "你是一位专业的品牌命名顾问，熟悉商标法和域名注册。只返回JSON数组。" },
            { role: "user", content: prompt },
          ],
          { max_tokens: 4000 }
        );
        const names = parseNameResponse(response);
        console.log(`generate-paid: batch ${batchIndex}/${batchCount} done, got ${names.length} names`);
        return names;
      } catch (e) {
        console.error(`generate-paid: batch ${batchIndex}/${batchCount} attempt ${attempt + 1} failed:`, e);
        if (attempt === 1) throw e;
      }
    }
    return [];
  }

  const batchPromises: Promise<NameEntry[]>[] = [];
  for (let i = 0; i < batchCount; i++) {
    batchPromises.push(runCompanyBatch(i + 1));
  }

  const results = await Promise.all(batchPromises);
  return results.flat().slice(0, count);
}

function parseNameResponse(response: string): NameEntry[] {
  const jsonStr = response
    .replace(/```json\r?\n?/g, "")
    .replace(/```\r?\n?/g, "")
    .replace(/[ -]/g, " ")
    .trim();
  try {
    return JSON.parse(jsonStr);
  } catch {
    // 直接解析失败 → 贪婪匹配完整JSON数组
    const match = jsonStr.match(/\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error(
      `Failed to parse name response: ${response.slice(0, 200)}`
    );
  }
}
