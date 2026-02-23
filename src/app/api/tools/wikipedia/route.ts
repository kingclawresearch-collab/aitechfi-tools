import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/openai";
import { checkRateLimit } from "@/lib/rate-limit";

interface WikiResult {
  article: string;
  categories: string[];
  infobox: { label: string; value: string }[];
}

const SYSTEM_PROMPT = `あなたはWikipediaの編集者です。ユーザーの情報からWikipedia風の人物記事を作成してください。

以下のJSON形式で回答:
{
  "article": "Wikipedia形式の記事本文（マークダウン形式。== セクション見出し == を使い、概要、経歴、人物、エピソード、脚注の構成で。真面目なWikipediaのトーンを保ちつつ、ユーモラスな記述を散りばめる。800-1200文字程度。脚注は [1][2] 等の架空の出典をつける）",
  "categories": ["カテゴリ1", "カテゴリ2", "カテゴリ3"],
  "infobox": [
    {"label": "生誕", "value": "（ユーザー情報から推定）"},
    {"label": "職業", "value": ""},
    {"label": "活動期間", "value": ""},
    {"label": "称号", "value": "（面白い称号をつける）"}
  ]
}

ポイント:
- 完全にWikipediaのフォーマットを模倣すること
- 「出典が必要」「独自研究？」等のWikipediaっぽいツッコミをところどころ入れる
- あくまで本人が楽しめる内容にする（悪意のある記述は避ける）

必ず有効なJSONのみを返してください。`;

export async function POST(req: NextRequest) {
  const limit = await checkRateLimit(req);
  if (!limit.allowed) {
    return NextResponse.json({ error: "本日の利用回数上限に達しました。" }, { status: 429 });
  }

  try {
    const { name, career, hobbies, highlights } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "名前を入力してください。" }, { status: 400 });
    }

    const userMessage = `名前: ${name}\n経歴: ${career || "不明"}\n趣味・特技: ${hobbies || "不明"}\n人生のハイライト: ${highlights || "不明"}`;

    const result = await chatCompletion<WikiResult>(SYSTEM_PROMPT, userMessage, { temperature: 0.8, maxTokens: 2048 });
    return NextResponse.json({ result, remaining: limit.remaining });
  } catch (error) {
    console.error("Wikipedia API error:", error);
    return NextResponse.json({ error: "記事生成中にエラーが発生しました。" }, { status: 500 });
  }
}
