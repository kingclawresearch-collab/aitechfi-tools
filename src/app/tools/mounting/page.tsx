"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import AffiliateLinks from "@/components/AffiliateLinks";
import ScoreGauge from "@/components/ScoreGauge";
import ShareButtons from "@/components/ShareButtons";
import { apiHeaders } from "@/lib/api-key";

interface Detection {
  phrase: string;
  true_meaning: string;
  mount_type: string;
  severity: string;
}

interface MountingResult {
  mount_score: number;
  detections: Detection[];
  sender_profile: string;
  defense_suggestion: string;
  summary: string;
}

const EXAMPLE = `いやー最近忙しくてさ、先週も出張3回で。
こないだバリ行ったんだけど、やっぱりビジネスクラスだと疲れ方が全然違うんだよね。
あ、そういえば君のとこの子、もう幼稚園？うちは来月からインターなんだけど、
入試が大変でさー。まあ、でも子供の将来のためだからね。`;

export default function MountingPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<MountingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/tools/mounting", {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setResult(data.result);
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <span className="text-5xl">🦚</span>
        <h1 className="mt-4 text-3xl font-bold">マウンティング翻訳機</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          会話に潜む「隠れマウント」をAIが検出。本当に言いたいことを暴きます。
        </p>
      </div>

      <AdBanner slot="tool-top" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <textarea
          className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 text-sm leading-relaxed focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          rows={6}
          placeholder="マウントっぽい会話やSNS投稿を貼り付けてください..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={3000}
        />
        <div className="mt-2 flex justify-between">
          <button type="button" onClick={() => setText(EXAMPLE)} className="text-xs text-blue-600 hover:underline dark:text-blue-400">
            典型的マウントで試す
          </button>
          <span className="text-xs text-gray-400">{text.length}/3000</span>
        </div>
        <button onClick={analyze} disabled={loading || !text.trim()} className="mt-4 w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50">
          {loading ? "検出中..." : "マウントを検出"}
        </button>
      </div>

      {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">{error}</div>}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <ScoreGauge score={result.mount_score} label="マウント度" />
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              タイプ: <span className="font-semibold">{result.sender_profile}</span>
            </p>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{result.summary}</p>
            <ShareButtons text={`🦚 マウント検出: ${result.mount_score}/100「${result.sender_profile}」`} />
          </div>

          {result.detections.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h2 className="text-lg font-bold mb-4">検出されたマウント</h2>
              <div className="space-y-4">
                {result.detections.map((d, i) => (
                  <div key={i} className="rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{d.severity}</span>
                      <span className="rounded-full bg-purple-200 px-2 py-0.5 text-xs font-bold text-purple-800 dark:bg-purple-800 dark:text-purple-200">{d.mount_type}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">&ldquo;{d.phrase}&rdquo;</p>
                    <p className="mt-2 text-sm font-bold text-purple-700 dark:text-purple-400">→ {d.true_meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-lg font-bold">推奨リアクション</h2>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{result.defense_suggestion}</p>
          </div>
        </div>
      )}
      {result && <AdBanner slot="tool-result" />}
      <AffiliateLinks toolId="mounting" />
    </div>
  );
}
