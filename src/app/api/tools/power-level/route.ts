import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/openai";
import { checkRateLimit } from "@/lib/rate-limit";

interface PowerLevelResult {
  power_level: number;
  comparison: string;
  stats: {
    intelligence: number;
    strength: number;
    charisma: number;
    luck: number;
    stamina: number;
    special: number;
  };
  title: string;
  commentary: string;
  weakness: string;
  growth_tip: string;
}

const SYSTEM_PROMPT = `あなたはドラゴンボールの世界観でユーザーの「社会的戦闘力」を測定するスカウターです。

ユーザーの情報（職業、スキル、年収帯、体力）から戦闘力を算出してください。
戦闘力は 1〜100,000 のスケール（一般人:5、ヤムチャ:1,480、クリリン:75,000、悟空:戦闘力が計測不能）

以下のJSON形式で回答:
{
  "power_level": 戦闘力の数値（整数）,
  "comparison": "最も近いDBキャラ（例: ヤムチャ、天津飯、クリリン、ベジータ等）",
  "stats": {
    "intelligence": 1-100,
    "strength": 1-100,
    "charisma": 1-100,
    "luck": 1-100,
    "stamina": 1-100,
    "special": 1-100
  },
  "title": "二つ名（例: 覚醒せし中間管理職、伝説のフリーランサー）",
  "commentary": "戦闘力の解説（DBの世界観に寄せたユーモラスな文章。3-4文）",
  "weakness": "弱点（1文。面白おかしく）",
  "growth_tip": "戦闘力を上げるためのアドバイス（1-2文。現実的だけどDB風に）"
}

必ず有効なJSONのみを返してください。`;

export async function POST(req: NextRequest) {
  const limit = await checkRateLimit(req);
  if (!limit.allowed) {
    return NextResponse.json({ error: "本日の利用回数上限に達しました。" }, { status: 429 });
  }

  try {
    const { job, skills, income, fitness } = await req.json();
    if (!job) {
      return NextResponse.json({ error: "職業を入力してください。" }, { status: 400 });
    }

    const userMessage = `職業: ${job}\nスキル: ${skills || "特になし"}\n年収帯: ${income || "回答なし"}\n体力自己評価: ${fitness || "普通"}/5`;

    const result = await chatCompletion<PowerLevelResult>(SYSTEM_PROMPT, userMessage, { temperature: 0.8 });
    return NextResponse.json({ result, remaining: limit.remaining });
  } catch (error) {
    console.error("Power level API error:", error);
    return NextResponse.json({ error: "測定中にエラーが発生しました。" }, { status: 500 });
  }
}
