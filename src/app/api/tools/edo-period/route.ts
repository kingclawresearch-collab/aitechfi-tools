import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/openai";
import { checkRateLimit } from "@/lib/rate-limit";

interface EdoResult {
  edo_job: string;
  social_class: string;
  annual_income_ryo: number;
  modern_equivalent_yen: number;
  daily_schedule: { time: string; activity: string }[];
  life_story: string;
  skill_translation: string;
  fun_fact: string;
}

const SYSTEM_PROMPT = `あなたは江戸時代の歴史に精通した時代考証家です。
ユーザーの現代の職業・スキル・性格から、江戸時代に生まれていたらどんな人生を送るかをシミュレーションしてください。

以下のJSON形式で回答:
{
  "edo_job": "江戸時代での職業名（例: 蘭学者、大工棟梁、呉服屋番頭、薬種問屋）",
  "social_class": "身分（武士/町人/農民/僧侶/浪人/その他）",
  "annual_income_ryo": 年収（両）の整数,
  "modern_equivalent_yen": 現代の円換算（概算。1両≒13万円で計算）,
  "daily_schedule": [
    {"time": "明六つ（午前6時頃）", "activity": "起床。井戸で顔を洗う"},
    {"time": "...", "activity": "..."}
  ],
  "life_story": "この人の江戸時代での人生ストーリー（200-300文字。ドラマチックに。具体的な地名や時代背景を含める）",
  "skill_translation": "現代スキルがどう活きるか（例: Excelスキル → そろばん名人として重宝される。2-3文）",
  "fun_fact": "その職業にまつわる面白い豆知識（1-2文）"
}

ポイント:
- 史実に基づいた職業・身分制度を反映する
- 現代のスキルを江戸時代の文脈に面白く翻訳する
- 日課は6-8項目で具体的に
- 1両≒現代の13万円で換算

必ず有効なJSONのみを返してください。`;

export async function POST(req: NextRequest) {
  const limit = await checkRateLimit(req);
  if (!limit.allowed) {
    return NextResponse.json({ error: "本日の利用回数上限に達しました。" }, { status: 429 });
  }

  try {
    const { job, skills, personality } = await req.json();
    if (!job) {
      return NextResponse.json({ error: "現在の職業を入力してください。" }, { status: 400 });
    }

    const userMessage = `現在の職業: ${job}\nスキル: ${skills || "特になし"}\n性格: ${personality || "普通"}`;

    const result = await chatCompletion<EdoResult>(SYSTEM_PROMPT, userMessage, { temperature: 0.8, maxTokens: 1500 });
    return NextResponse.json({ result, remaining: limit.remaining });
  } catch (error) {
    console.error("Edo period API error:", error);
    return NextResponse.json({ error: "時代考証中にエラーが発生しました。" }, { status: 500 });
  }
}
