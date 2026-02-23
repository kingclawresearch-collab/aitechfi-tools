import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/openai";
import { checkRateLimit } from "@/lib/rate-limit";

interface ToxicityResult {
  toxicity_score: number;
  overall_tone: string;
  aggressive_phrases: { phrase: string; reason: string; suggestion: string }[];
  improved_version: string;
  summary: string;
}

const SYSTEM_PROMPT = `あなたはビジネスメールの「毒性」を分析する専門家です。
ユーザーが入力したメール文面を分析し、以下のJSON形式で回答してください。

{
  "toxicity_score": 0-100の整数（0=完全に無害、100=極めて攻撃的）,
  "overall_tone": "このメール全体のトーンを一言で（例: 丁寧、事務的、威圧的、嫌味、攻撃的）",
  "aggressive_phrases": [
    {
      "phrase": "問題のある表現（原文から引用）",
      "reason": "なぜ問題か（1文で）",
      "suggestion": "こう書き換えるべき"
    }
  ],
  "improved_version": "メール全体の改善版（毒性を下げつつ意図は保つ）",
  "summary": "分析の要約（2-3文。ユーモアを交えて）"
}

評価基準:
- 命令口調、上から目線の表現 → 毒性高
- 嫌味、皮肉、受動的攻撃 → 毒性中〜高
- 曖昧な責任転嫁 → 毒性中
- 事務的すぎて冷たい → 毒性低〜中
- 丁寧で配慮がある → 毒性低

必ず有効なJSONのみを返してください。`;

export async function POST(req: NextRequest) {
  const limit = await checkRateLimit(req);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "本日の利用回数上限に達しました。明日またお試しください。" },
      { status: 429 }
    );
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "メール文面を入力してください。" },
        { status: 400 }
      );
    }

    if (text.length > 3000) {
      return NextResponse.json(
        { error: "3000文字以内で入力してください。" },
        { status: 400 }
      );
    }

    const result = await chatCompletion<ToxicityResult>(
      SYSTEM_PROMPT,
      text,
      { temperature: 0.5 }
    );

    return NextResponse.json({ result, remaining: limit.remaining });
  } catch (error) {
    console.error("Mail toxicity API error:", error);
    return NextResponse.json(
      { error: "分析中にエラーが発生しました。しばらくしてから再度お試しください。" },
      { status: 500 }
    );
  }
}
