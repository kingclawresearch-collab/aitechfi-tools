import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/openai";
import { checkRateLimit } from "@/lib/rate-limit";

interface TranslationResult {
  translations: { original: string; true_meaning: string; politeness_level: string }[];
  overall_assessment: string;
  sender_type: string;
}

const SYSTEM_PROMPT = `あなたはビジネスメールの「本音」を翻訳する専門家です。
日本のビジネスメールに含まれる婉曲表現・建前・受動的攻撃を検出し、本当の意味を翻訳してください。

ユーザーが入力したメール文面を文ごとに分析し、以下のJSON形式で回答してください。

{
  "translations": [
    {
      "original": "原文の一文",
      "true_meaning": "その文の本当の意味（皮肉・ユーモアを交えて率直に）",
      "politeness_level": "建前度を5段階で（★1=ほぼ本音〜★5=完全に建前）"
    }
  ],
  "overall_assessment": "このメール全体の本音を1-2文で要約（辛辣かつユーモラスに）",
  "sender_type": "送信者のタイプ（例: 怒りを押し殺す中間管理職、本音を絶対言わない営業マン、etc）"
}

翻訳例:
- 「ご検討いただければ幸いです」→「やれ」
- 「お忙しいところ恐れ入りますが」→「早く返事しろ」
- 「今後ともよろしくお願いいたします」→「特に言うことはないが礼儀として書いた」
- 「認識に齟齬があるようです」→「お前が間違ってる」

必ず有効なJSONのみを返してください。`;

export async function POST(req: NextRequest) {
  const limit = await checkRateLimit(req);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "本日の利用回数上限に達しました。" },
      { status: 429 }
    );
  }

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "メール文面を入力してください。" }, { status: 400 });
    }
    if (text.length > 3000) {
      return NextResponse.json({ error: "3000文字以内で入力してください。" }, { status: 400 });
    }

    const result = await chatCompletion<TranslationResult>(SYSTEM_PROMPT, text, { temperature: 0.8 });
    return NextResponse.json({ result, remaining: limit.remaining });
  } catch (error) {
    console.error("Mail true meaning API error:", error);
    return NextResponse.json({ error: "分析中にエラーが発生しました。" }, { status: 500 });
  }
}
