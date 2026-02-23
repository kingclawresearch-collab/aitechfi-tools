export interface AffiliateLink {
  label: string;
  description: string;
  url: string;
  badge?: string;
}

export const affiliatesByTool: Record<string, AffiliateLink[]> = {
  "mail-toxicity": [
    {
      label: "史上最強のビジネスメール表現事典",
      description: "プロが使うメール表現を網羅。送信前に迷わない。",
      url: "https://www.amazon.co.jp/dp/4816342621",
      badge: "Amazon",
    },
    {
      label: "相手に伝わるビジネスメール「正しい」表現辞典",
      description: "正しい敬語・言い回しの辞典。デスクに一冊。",
      url: "https://www.amazon.co.jp/dp/4816356096",
    },
  ],
  "mail-true-meaning": [
    {
      label: "話せる、伝わる、結果が出る！コミュトレ",
      description: "ビジネスコミュニケーションの本質を学ぶ一冊。",
      url: "https://www.amazon.co.jp/dp/4478119147",
      badge: "Amazon",
    },
  ],
  "power-level": [
    {
      label: "doda — 転職ならdoda",
      description: "戦闘力が高いあなたにふさわしい求人が見つかる。",
      url: "https://doda.jp/",
      badge: "転職",
    },
    {
      label: "リクナビNEXT",
      description: "日本最大級の転職サイト。スカウト機能あり。",
      url: "https://next.rikunabi.com/",
    },
  ],
  wikipedia: [
    {
      label: "自分史年表+エンディングノート 令和版",
      description: "人生を振り返り、記録に残す実用書。",
      url: "https://www.amazon.co.jp/dp/4902800314",
      badge: "Amazon",
    },
  ],
  "prompt-checker": [
    {
      label: "ChatGPTを使い尽くす！深津式プロンプト読本",
      description: "プロンプトエンジニアリングの実践ガイド。",
      url: "https://www.amazon.co.jp/dp/B0DB8GM941",
      badge: "Kindle",
    },
    {
      label: "かんたんプロンプト",
      description: "初心者でもすぐ使える ChatGPT プロンプト集。",
      url: "https://www.amazon.co.jp/dp/B0FLP5YC39",
    },
  ],
  mounting: [
    {
      label: "対人コミュニケーションの心理学（改訂版）",
      description: "心理学ベースで人間関係のメカニズムを理解する。",
      url: "https://www.amazon.co.jp/dp/4779307201",
      badge: "Amazon",
    },
  ],
  "edo-period": [
    {
      label: "江戸の色町 遊女と吉原の歴史",
      description: "江戸時代の社会と職業を深く知る一冊。",
      url: "https://www.amazon.co.jp/dp/4862553516",
      badge: "Amazon",
    },
  ],
  "mercari-listing": [
    {
      label: "メルカリ出品の成功法則",
      description: "売れない商品を売れる商品に変えるテクニック集。",
      url: "https://www.amazon.co.jp/dp/B0DPQG7PVT",
      badge: "Kindle",
    },
    {
      label: "メルカリ公式サイト",
      description: "まだ始めてない人はここから。",
      url: "https://jp.mercari.com/",
    },
  ],
  goshugi: [
    {
      label: "日々ごゆだんなきよう 幸せを呼ぶ礼法入門",
      description: "冠婚葬祭のマナーを網羅。いざという時に困らない。",
      url: "https://www.amazon.co.jp/dp/404100022X",
      badge: "Amazon",
    },
  ],
};
