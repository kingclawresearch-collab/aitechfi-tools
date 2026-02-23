export interface ToolMeta {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: "business" | "entertainment" | "utility";
  href: string;
}

export const tools: ToolMeta[] = [
  {
    id: "mail-toxicity",
    name: "メール毒性チェッカー",
    description: "ビジネスメールの攻撃性をAIがスコア化。送信前の最終チェックに。",
    emoji: "☠️",
    category: "business",
    href: "/tools/mail-toxicity",
  },
  {
    id: "mail-true-meaning",
    name: "メールの真意翻訳",
    description: "「検討します」の本当の意味、知ってますか？ビジネスメールの本音を暴く。",
    emoji: "🎭",
    category: "business",
    href: "/tools/mail-true-meaning",
  },
  {
    id: "power-level",
    name: "AI戦闘力スコア",
    description: "あなたの社会的戦闘力をドラゴンボール風に数値化。",
    emoji: "⚡",
    category: "entertainment",
    href: "/tools/power-level",
  },
  {
    id: "wikipedia",
    name: "Wikipediaに書くと",
    description: "あなたの人生をWikipedia風の記事にAIが変換。",
    emoji: "📖",
    category: "entertainment",
    href: "/tools/wikipedia",
  },
  {
    id: "prompt-checker",
    name: "プロンプト品質チェッカー",
    description: "ChatGPTへのプロンプトをAIが採点。改善案も提示。",
    emoji: "🔍",
    category: "utility",
    href: "/tools/prompt-checker",
  },
  {
    id: "mounting",
    name: "マウンティング翻訳機",
    description: "会話に隠されたマウンティングをAIが検出・翻訳。",
    emoji: "🦚",
    category: "entertainment",
    href: "/tools/mounting",
  },
  {
    id: "edo-period",
    name: "江戸時代に生まれてたら",
    description: "あなたの現代スキルは江戸時代でどんな職業になる？",
    emoji: "🏯",
    category: "entertainment",
    href: "/tools/edo-period",
  },
  {
    id: "mercari-listing",
    name: "メルカリ出品文生成",
    description: "売れる商品説明文をAIが即座に生成。コピペでそのまま使える。",
    emoji: "🛒",
    category: "utility",
    href: "/tools/mercari-listing",
  },
  {
    id: "goshugi",
    name: "ご祝儀・香典相場判定",
    description: "結婚式・葬儀・入学祝い…いくら包めばいい？AIが相場を判定。",
    emoji: "💰",
    category: "utility",
    href: "/tools/goshugi",
  },
];
