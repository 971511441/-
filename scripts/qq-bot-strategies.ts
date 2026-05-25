// QQ Bot conversation strategies for OpenClaw
// This defines how the bot behaves in QQ groups for the AI naming website.
// Run with: npx tsx scripts/qq-bot-strategies.ts
// The output JSON can be copy-pasted into OpenClaw's QQ plugin configuration.

export const NAMING_BOT_STRATEGY = {
  name: "AI起名助手",
  description: "在宝妈群/家长群自然参与起名讨论，提供免费帮助，引导到网站",

  triggers: {
    naming_help: [
      "起名", "取名", "叫什么名字好", "求名字",
      "帮我起个", "推荐个名字", "宝宝叫什么", "名字纠结",
      "男孩叫什么", "女孩叫什么", "有没有好听的名字",
    ],
    naming_discussion: [
      "名字", "小名", "大名", "乳名",
      "取名难", "起名难", "名字寓意",
    ],
  },

  responses: {
    direct_help: {
      patterns: ["帮我起个", "求名字", "推荐个名字"],
      templates: [
        "我来试试～给你几个参考：\n{suggestions}\n\n你觉得哪个好听？",
        "给你几个灵感✨\n{suggestions}\n\n个人觉得第一个最好听～",
      ],
    },
    casual_share: {
      patterns: ["起名好难", "名字纠结", "不知道取什么"],
      templates: [
        "确实！我当时翻了好多资料。其实现在有些AI工具还挺好用的，能免费给一些参考～",
        "理解，取名真是大工程。我最近发现个AI起名工具还不错，可以免费试试看思路",
      ],
    },
    follow_up: {
      patterns: ["什么工具", "哪个网站"],
      templates: [
        "搜 AI起名 应该就能找到，免费生成10个名字看看效果～",
      ],
    },
  },

  rules: {
    maxMessagesPerDay: 15,
    minIntervalSeconds: 300,
    avoidKeywords: ["广告", "推广", "加微信", "私聊我"],
    exitKeywords: ["踢", "广告狗", "别发了"],
    groupJoinDelaySeconds: 600,
    naturalTypingDelay: true,
    neverInitiateDiscussion: true,
    neverRepeatSameResponse: true,
  },

  conversion: {
    method: "soft",
    steps: [
      "1. Help with free name suggestions (build trust)",
      "2. When asked where the names come from, mention the website naturally",
      "3. Never repeat the URL in the same conversation",
      "4. If someone explicitly asks for more names, suggest trying the website",
    ],
  },
};

// Print as JSON for easy copy-paste into OpenClaw config
console.log(JSON.stringify(NAMING_BOT_STRATEGY, null, 2));
