export const BABY_NAME_KEYWORDS = [
  { keyword: "龙年男孩取名", volume: 8000, competition: "medium" },
  { keyword: "2026年宝宝取名", volume: 5000, competition: "low" },
  { keyword: "诗经取名男孩", volume: 4500, competition: "medium" },
  { keyword: "楚辞取名女孩", volume: 3500, competition: "low" },
  { keyword: "独特好听男孩名字", volume: 6000, competition: "high" },
  { keyword: "古风女孩名字", volume: 4000, competition: "medium" },
  { keyword: "姓王的男孩名字大全", volume: 3000, competition: "low" },
  { keyword: "姓李的女孩名字", volume: 2500, competition: "low" },
  { keyword: "三个字男孩名字", volume: 5000, competition: "high" },
  { keyword: "有寓意的名字", volume: 7000, competition: "high" },
  { keyword: "宝宝取名禁忌", volume: 3000, competition: "low" },
  { keyword: "公司起名技巧", volume: 2500, competition: "low" },
  { keyword: "品牌命名规则", volume: 1500, competition: "low" },
  { keyword: "商标注册名字注意事项", volume: 2000, competition: "low" },
  { keyword: "宝宝取名宜用字", volume: 4000, competition: "low" },
  { keyword: "男孩取名常用字", volume: 3500, competition: "medium" },
  { keyword: "女孩名字大全优雅", volume: 4500, competition: "medium" },
  { keyword: "男孩名字大全霸气", volume: 3000, competition: "medium" },
  { keyword: "属龙宝宝取名", volume: 2500, competition: "low" },
  { keyword: "2026年公司起名大全", volume: 1500, competition: "low" },
];

export function pickKeyword(): { keyword: string; volume: number; competition: string } {
  const kw = BABY_NAME_KEYWORDS[Math.floor(Math.random() * BABY_NAME_KEYWORDS.length)];
  return { keyword: kw.keyword, volume: kw.volume, competition: kw.competition };
}
