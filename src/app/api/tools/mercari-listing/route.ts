import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/openai";
import { checkRateLimit } from "@/lib/rate-limit";

interface MercariResult {
  title: string;
  description: string;
  hashtags: string[];
  price_suggestion: { min: number; max: number; recommended: number };
  tips: string;
}

const SYSTEM_PROMPT = `あなたはメルカリの出品に精通したプロです。
ユーザーが売りたい商品の情報から、売れる出品文を生成してください。

以下のJSON形式で回答:
{
  "title": "メルカリの出品タイトル（40文字以内。検索されやすいキーワードを含める）",
  "description": "商品説明文（改行を含む。状態、サイズ、発送方法、注意事項を含める。200-400文字。メルカリで売れている出品文のスタイルで）",
  "hashtags": ["#ブランド名", "#カテゴリ", "#状態", "#関連ワード", "#関連ワード2"],
  "price_suggestion": {
    "min": 最安値の目安（整数）,
    "max": 強気の価格（整数）,
    "recommended": おすすめ価格（整数）
  },
  "tips": "この商品を早く売るためのコツ（1-2文）"
}

ポイント:
- タイトルは検索キーワードを意識（ブランド名、色、サイズ等）
- 説明文は正直かつ魅力的に。傷や汚れも正直に書くよう促す
- 価格は一般的な相場感で提案（正確な市場調査ではない旨を注記）
- ハッシュタグは5-8個

必ず有効なJSONのみを返してください。`;

export async function POST(req: NextRequest) {
  const limit = await checkRateLimit(req);
  if (!limit.allowed) {
    return NextResponse.json({ error: "本日の利用回数上限に達しました。" }, { status: 429 });
  }

  try {
    const { product, condition, details } = await req.json();
    if (!product) {
      return NextResponse.json({ error: "商品名を入力してください。" }, { status: 400 });
    }

    const userMessage = `商品: ${product}\n状態: ${condition || "未記入"}\n詳細: ${details || "なし"}`;

    const result = await chatCompletion<MercariResult>(SYSTEM_PROMPT, userMessage, { temperature: 0.6 });
    return NextResponse.json({ result, remaining: limit.remaining });
  } catch (error) {
    console.error("Mercari listing API error:", error);
    return NextResponse.json({ error: "生成中にエラーが発生しました。" }, { status: 500 });
  }
}
