import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/openai";
import { checkRateLimit } from "@/lib/rate-limit";

interface GoshugiResult {
  amount: number;
  amount_range: { min: number; max: number };
  reasoning: string;
  manner_tips: string[];
  envelope_type: string;
  writing_guide: string;
  regional_note: string;
  ng_amounts: string;
}

const SYSTEM_PROMPT = `あなたは日本の冠婚葬祭マナーに精通した専門家です。
ユーザーの状況に応じて、ご祝儀・香典・お祝い金の適切な金額を判定してください。

以下のJSON形式で回答:
{
  "amount": 推奨金額（整数。円単位）,
  "amount_range": {"min": 最低ライン, "max": 多めに包む場合},
  "reasoning": "この金額の根拠（2-3文。関係性・年齢・地域性を考慮した説明）",
  "manner_tips": [
    "マナーの注意点1",
    "マナーの注意点2",
    "マナーの注意点3"
  ],
  "envelope_type": "使うべき封筒・のし袋の種類（例: 結び切りの祝儀袋）",
  "writing_guide": "表書きの書き方（例: 御祝儀、御霊前、etc）",
  "regional_note": "地域による違いがあれば（なければ「特になし」）",
  "ng_amounts": "避けるべき金額とその理由（例: 4万円は「死」を連想させるため避ける）"
}

金額の一般的な相場:
- 結婚式（友人）: 30,000円
- 結婚式（同僚）: 30,000円
- 結婚式（親族）: 50,000-100,000円
- 葬儀（友人）: 5,000-10,000円
- 葬儀（親族）: 10,000-50,000円
- 出産祝い: 5,000-10,000円
- 入学祝い: 5,000-30,000円

ユーザーの年齢が高いほど相場は上がる傾向。

必ず有効なJSONのみを返してください。`;

export async function POST(req: NextRequest) {
  const limit = await checkRateLimit(req);
  if (!limit.allowed) {
    return NextResponse.json({ error: "本日の利用回数上限に達しました。" }, { status: 429 });
  }

  try {
    const { event, relationship, age, region } = await req.json();
    if (!event) {
      return NextResponse.json({ error: "イベントの種類を選択してください。" }, { status: 400 });
    }

    const userMessage = `イベント: ${event}\n相手との関係: ${relationship || "未記入"}\nあなたの年代: ${age || "未記入"}\n地域: ${region || "未記入"}`;

    const result = await chatCompletion<GoshugiResult>(SYSTEM_PROMPT, userMessage, { temperature: 0.3 });
    return NextResponse.json({ result, remaining: limit.remaining });
  } catch (error) {
    console.error("Goshugi API error:", error);
    return NextResponse.json({ error: "判定中にエラーが発生しました。" }, { status: 500 });
  }
}
