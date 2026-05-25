import { chat } from "./deepseek";
import { NameEntry } from "./types";

interface GenerateInput {
  surname: string;
  gender: "male" | "female" | "unknown";
  birthDate?: string;
  style: string;
  count: number;
}

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

  return `你是一位专业的起名专家。请为一位${gender}生成${input.count}个中文名字。
姓氏：${input.surname}${birth}
风格要求：${styleHint}

返回JSON数组格式，每个名字包含：
- name: 完整姓名（含姓氏）
- meaning: 名字寓意（50-80字，解释字义、出处、美好寓意）
- score: 综合评分（1-100）
- analysis: 字义拆解（每个字的五行属性和含义）

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

  return `你是一位专业的品牌命名顾问。请为一家${industry}行业的企业生成${count}个品牌/公司名字。
关键词：${keywords}
风格：${styleHint}

返回JSON数组，每个名字包含：
- name: 品牌名
- meaning: 命名寓意（50-80字，解释品牌联想、行业契合度）
- score: 综合评分（1-100）
- tagline: 一句品牌口号

只返回JSON数组，不要其他内容。`;
}

export async function generateBabyNames(input: GenerateInput): Promise<NameEntry[]> {
  const prompt = buildBabyPrompt(input);
  const response = await chat([
    { role: "system", content: "你是一位专业的起名专家，擅长诗经楚辞和现代取名。只返回JSON数组。" },
    { role: "user", content: prompt },
  ]);
  return parseNameResponse(response);
}

export async function generateCompanyNames(
  industry: string,
  keywords: string,
  style: string,
  count: number
): Promise<NameEntry[]> {
  const prompt = buildCompanyPrompt(industry, keywords, style, count);
  const response = await chat([
    { role: "system", content: "你是一位专业的品牌命名顾问。只返回JSON数组。" },
    { role: "user", content: prompt },
  ]);
  return parseNameResponse(response);
}

function parseNameResponse(response: string): NameEntry[] {
  const jsonStr = response.replace(/```json\r?\n?/g, "").replace(/```\r?\n?/g, "").trim();
  try {
    return JSON.parse(jsonStr);
  } catch {
    const match = jsonStr.match(/\[[\s\S]*?\]/);
    if (match) return JSON.parse(match[0]);
    throw new Error(`Failed to parse name response: ${response.slice(0, 200)}`);
  }
}
