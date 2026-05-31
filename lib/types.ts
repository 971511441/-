export interface NameEntry {
  name: string;
  meaning: string;
  score: number;
  analysis?: string;
  tagline?: string;
  /** 八字五行分析 + 与名字的契合度（付费版） */
  bazi?: string;
  /** 重名度评估：高/中/低 + 理由（付费版） */
  popularity?: string;
  /** 小名/乳名推荐（付费版） */
  nickname?: string;
  /** 商标可注册性简要分析（付费版-公司） */
  trademark?: string;
  /** 域名可用性建议（付费版-公司） */
  domain?: string;
}
