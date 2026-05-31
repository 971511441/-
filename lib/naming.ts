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
- meaning: 名字寓意（50-70字，解释每个字的含义和整体传达的美好愿景）
- score: 综合评分（1-100，基于音韵、寓意、文化底蕴、与八字的契合度综合判断）
- analysis: 字义拆解（40-60字，分别解释每个字的五行属性和搭配理由）
${input.birthDate ? "- bazi: 八字五行分析（基于出生日期推算八字五行，分析这个名字为什么与宝宝的命理契合或互补。如无法精确推算请标注「基于出生日期推算，仅供参考」）" : "- bazi: 名字的五行属性分析（分析名字用字的五行归属，说明适合什么命理的宝宝）"}
- popularity: 重名度评估（「较低 / 中等 / 较高」+ 一句话理由，如「语瑶」近年热度上升但尚未泛滥）
- nickname: 小名推荐（1-2个亲昵顺口的小名，如「小禾」「安安」）

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

- name: 品牌名（2-4个字，好记好传播）
- meaning: 命名寓意（50-70字，解释品牌联想和行业契合度）
- score: 综合评分（1-100，基于传播力、行业契合度、商标显著性、域名友好度综合判断）
- tagline: 一句品牌口号（8-15字，有记忆点）
- trademark: 商标可注册性分析（40-60字。判断显著性和近似风险，标注「基于名称特征分析，最终以商标局审查为准」）
- domain: 域名建议（推荐1-2个可能可注册的域名格式，如「hechuang.com」「hechuang.cn」，标注「建议在域名注册平台查询实际可用性」）

只返回JSON数组，不要其他内容。`;
}

export async function generateBabyNames(input: GenerateInput): Promise<NameEntry[]> {
  const prompt = buildBabyPrompt(input);
  const response = await chat(
    [
      { role: "system", content: "你是一位专业的起名专家，精通诗经楚辞、八字五行和现代取名。只返回JSON数组。" },
      { role: "user", content: prompt },
    ],
    { max_tokens: 8000 }
  );
  return parseNameResponse(response);
}

export async function generateCompanyNames(
  industry: string,
  keywords: string,
  style: string,
  count: number
): Promise<NameEntry[]> {
  const prompt = buildCompanyPrompt(industry, keywords, style, count);
  const response = await chat(
    [
      { role: "system", content: "你是一位专业的品牌命名顾问，熟悉商标法和域名注册。只返回JSON数组。" },
      { role: "user", content: prompt },
    ],
    { max_tokens: 8000 }
  );
  return parseNameResponse(response);
}

function parseNameResponse(response: string): NameEntry[] {
  const jsonStr = response
    .replace(/```json\r?\n?/g, "")
    .replace(/```\r?\n?/g, "")
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
