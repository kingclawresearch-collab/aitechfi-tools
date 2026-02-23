import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/openai";
import { checkRateLimit } from "@/lib/rate-limit";

interface PromptResult {
  quality_score: number;
  grade: string;
  issues: { category: string; description: string; severity: string }[];
  improved_prompt: string;
  explanation: string;
  scores: {
    specificity: number;
    context: number;
    constraints: number;
    output_format: number;
    creativity: number;
  };
}

const SYSTEM_PROMPT = `あなたはAIプロンプトエンジニアリングの専門家です。
ユーザーが入力したプロンプト（ChatGPT等へのプロンプト）の品質を評価し、改善案を提示してください。

以下のJSON形式で回答:
{
  "quality_score": 0-100の総合スコア,
  "grade": "S/A/B/C/D のランク",
  "issues": [
    {
      "category": "問題のカテゴリ（具体性不足/コンテキスト不足/制約条件なし/出力形式未指定/役割設定なし）",
      "description": "具体的な問題点（1-2文）",
      "severity": "高/中/低"
    }
  ],
  "improved_prompt": "改善されたプロンプト全文",
  "explanation": "何をどう改善したか（3-4文。プロンプトエンジニアリングのTipsとして）",
  "scores": {
    "specificity": 0-100（具体性）,
    "context": 0-100（コンテキスト提供）,
    "constraints": 0-100（制約条件）,
    "output_format": 0-100（出力形式指定）,
    "creativity": 0-100（創造性・独自性）
  }
}

評価基準:
- 具体性: 「いい感じに」ではなく「500文字以内で」等の具体的な指示があるか
- コンテキスト: 背景情報、対象読者、用途の説明があるか
- 制約条件: やってほしくないこと、範囲の限定があるか
- 出力形式: JSON、箇条書き、表等の形式指定があるか
- 創造性: テンプレ的ではなく工夫があるか

必ず有効なJSONのみを返してください。`;

export async function POST(req: NextRequest) {
  const limit = await checkRateLimit(req);
  if (!limit.allowed) {
    return NextResponse.json({ error: "本日の利用回数上限に達しました。" }, { status: 429 });
  }

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "プロンプトを入力してください。" }, { status: 400 });
    }
    if (text.length > 5000) {
      return NextResponse.json({ error: "5000文字以内で入力してください。" }, { status: 400 });
    }

    const result = await chatCompletion<PromptResult>(SYSTEM_PROMPT, text, { temperature: 0.5 });
    return NextResponse.json({ result, remaining: limit.remaining });
  } catch (error) {
    console.error("Prompt checker API error:", error);
    return NextResponse.json({ error: "分析中にエラーが発生しました。" }, { status: 500 });
  }
}
