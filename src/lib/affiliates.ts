export interface AffiliateLink {
  label: string;
  description: string;
  url: string;
  badge?: string;
}

export const affiliatesByTool: Record<string, AffiliateLink[]> = {
  "mail-toxicity": [
    {
      label: "ビジネスメール文例集",
      description: "プロが使うメールテンプレート200選。もう文面で悩まない。",
      url: "https://amzn.to/placeholder-mail-book",
      badge: "おすすめ",
    },
    {
      label: "ビジネスマナー講座",
      description: "オンラインで学べるビジネスコミュニケーション。",
      url: "https://example.com/placeholder-manner",
    },
  ],
  "mail-true-meaning": [
    {
      label: "察しの悪い人のためのビジネス本音辞典",
      description: "ベストセラー。日本語ビジネス会話の裏を読む技術。",
      url: "https://amzn.to/placeholder-honne-book",
      badge: "話題の本",
    },
  ],
  "power-level": [
    {
      label: "年収アップの転職なら",
      description: "戦闘力が高いあなたにふさわしい職場が見つかる。",
      url: "https://example.com/placeholder-tensyoku",
      badge: "PR",
    },
    {
      label: "スキルアップならUdemy",
      description: "戦闘力をさらに上げるオンライン講座。セール中。",
      url: "https://example.com/placeholder-udemy",
    },
  ],
  wikipedia: [
    {
      label: "自分史の書き方ガイド",
      description: "人生を文章にまとめる実用書。贈り物にも。",
      url: "https://amzn.to/placeholder-jibunshi",
    },
  ],
  "prompt-checker": [
    {
      label: "ChatGPT完全攻略ガイド",
      description: "プロンプトエンジニアリングの教科書。仕事に即活用。",
      url: "https://amzn.to/placeholder-prompt-book",
      badge: "aitechfi推奨",
    },
    {
      label: "Claude / Gemini 使い分けガイド",
      description: "AIツールを使い分けて生産性を最大化。",
      url: "https://example.com/placeholder-ai-guide",
    },
  ],
  mounting: [
    {
      label: "マウンティングしない技術",
      description: "心理学ベースの人間関係改善メソッド。",
      url: "https://amzn.to/placeholder-mounting-book",
    },
  ],
  "edo-period": [
    {
      label: "江戸時代の仕事図鑑",
      description: "イラスト満載。江戸の260種類の職業を徹底解説。",
      url: "https://amzn.to/placeholder-edo-book",
      badge: "面白い",
    },
  ],
  "mercari-listing": [
    {
      label: "メルカリを始めるなら",
      description: "招待コードで500ポイントもらえる。",
      url: "https://example.com/placeholder-mercari-invite",
      badge: "500pt",
    },
    {
      label: "フリマ売上UP完全マニュアル",
      description: "月10万稼ぐ出品テクニック集。",
      url: "https://amzn.to/placeholder-furima-book",
    },
  ],
  goshugi: [
    {
      label: "ご祝儀袋・香典袋セット",
      description: "急な冠婚葬祭にも対応。翌日届く。",
      url: "https://amzn.to/placeholder-goshugi-set",
      badge: "Amazon",
    },
    {
      label: "冠婚葬祭マナー大全",
      description: "一家に一冊。いざという時に困らない。",
      url: "https://amzn.to/placeholder-manner-book",
    },
  ],
};
