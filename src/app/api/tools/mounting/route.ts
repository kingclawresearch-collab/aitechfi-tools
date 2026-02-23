import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/openai";
import { checkRateLimit } from "@/lib/rate-limit";

interface MountingResult {
  mount_score: number;
  detections: {
    phrase: string;
    true_meaning: string;
    mount_type: string;
    severity: string;
  }[];
  sender_profile: string;
  defense_suggestion: string;
  summary: string;
}

const SYSTEM_PROMPT = `あなたは「隠れマウンティング」を検出する専門家です。
日常会話やSNS投稿に潜むマウンティング（自慢、優位性の誇示、見下し）を検出・翻訳してください。

以下のJSON形式で回答:
{
  "mount_score": 0-100のマウント度（0=マウントなし、100=全力マウント）,
  "detections": [
    {
      "phrase": "マウンティングが含まれる表現（原文引用）",
      "true_meaning": "この発言の本当の意図（辛辣かつユーモラスに翻訳）",
      "mount_type": "マウントの種類（年収マウント/学歴マウント/経験マウント/忙しいアピール/交友関係マウント/育児マウント/旅行マウント/グルメマウント/意識高い系/その他）",
      "severity": "😤/😡/🤬 の3段階"
    }
  ],
  "sender_profile": "この人のマウンティングスタイルを一言で（例: さりげない年収マウントが得意な元商社マン型）",
  "defense_suggestion": "このマウントへの最適な返し方（ユーモラスに。1-2文）",
  "summary": "分析の要約（ユーモラスに2-3文）"
}

マウントの検出例:
- 「忙しくて〜」→ 忙しいアピール
- 「前の会社では〜」→ 経験マウント
- 「うちの子が〜」→ 育児マウント
- 「こないだハワイで〜」→ 旅行マウント

マウントが全くない場合はmount_scoreを0-10にして、detectionsを空配列に。

必ず有効なJSONのみを返してください。`;

export async function POST(req: NextRequest) {
  const limit = await checkRateLimit(req);
  if (!limit.allowed) {
    return NextResponse.json({ error: "本日の利用回数上限に達しました。" }, { status: 429 });
  }

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "会話テキストを入力してください。" }, { status: 400 });
    }
    if (text.length > 3000) {
      return NextResponse.json({ error: "3000文字以内で入力してください。" }, { status: 400 });
    }

    const result = await chatCompletion<MountingResult>(SYSTEM_PROMPT, text, { temperature: 0.8 });
    return NextResponse.json({ result, remaining: limit.remaining });
  } catch (error) {
    console.error("Mounting API error:", error);
    return NextResponse.json({ error: "分析中にエラーが発生しました。" }, { status: 500 });
  }
}
