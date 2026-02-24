"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import AffiliateLinks from "@/components/AffiliateLinks";
import ScoreGauge from "@/components/ScoreGauge";
import ShareButtons from "@/components/ShareButtons";
import { apiHeaders } from "@/lib/api-key";

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

const EXAMPLE = "ブログ記事を書いて";

const SCORE_LABELS: Record<string, string> = {
  specificity: "具体性",
  context: "コンテキスト",
  constraints: "制約条件",
  output_format: "出力形式",
  creativity: "創造性",
};

export default function PromptCheckerPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<PromptResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/tools/prompt-checker", {
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
        <span className="text-5xl">🔍</span>
        <h1 className="mt-4 text-3xl font-bold">プロンプト品質チェッカー</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          ChatGPTへのプロンプトをAIが採点。もっといい聞き方を教えます。
        </p>
      </div>

      <AdBanner slot="tool-top" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <textarea
          className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 text-sm leading-relaxed font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          rows={6}
          placeholder="ChatGPT等に送るプロンプトを貼り付けてください..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={5000}
        />
        <div className="mt-2 flex justify-between">
          <button type="button" onClick={() => setText(EXAMPLE)} className="text-xs text-blue-600 hover:underline dark:text-blue-400">
            ダメなプロンプトで試す
          </button>
          <span className="text-xs text-gray-400">{text.length}/5000</span>
        </div>
        <button onClick={analyze} disabled={loading || !text.trim()} className="mt-4 w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50">
          {loading ? "採点中..." : "プロンプトを採点"}
        </button>
      </div>

      {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">{error}</div>}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <ScoreGauge score={result.quality_score} label="総合スコア" />
              </div>
              <div className="text-5xl font-black text-blue-600">{result.grade}</div>
            </div>
            <ShareButtons text={`🔍 プロンプト品質: ${result.quality_score}/100（${result.grade}ランク）`} />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-lg font-bold mb-4">項目別スコア</h2>
            <div className="space-y-3">
              {Object.entries(result.scores).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-24 text-xs font-medium text-gray-600 dark:text-gray-400">{SCORE_LABELS[key] || key}</span>
                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${value}%` }} />
                  </div>
                  <span className="w-8 text-xs font-bold text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {result.issues.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h2 className="text-lg font-bold mb-4">改善ポイント</h2>
              <div className="space-y-3">
                {result.issues.map((issue, i) => (
                  <div key={i} className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                      issue.severity === "高" ? "bg-red-100 text-red-700" :
                      issue.severity === "中" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>{issue.severity}</span>
                    <div>
                      <p className="text-xs font-bold text-gray-500">{issue.category}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{issue.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-lg font-bold">改善版プロンプト</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{result.explanation}</p>
            <div className="mt-4 whitespace-pre-wrap rounded-xl bg-green-50 p-4 text-sm leading-relaxed font-mono text-gray-800 dark:bg-green-950 dark:text-gray-200">
              {result.improved_prompt}
            </div>
            <button onClick={() => navigator.clipboard.writeText(result.improved_prompt)} className="mt-3 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
              改善版をコピー
            </button>
          </div>
        </div>
      )}
      {result && <AdBanner slot="tool-result" />}
      <AffiliateLinks toolId="prompt-checker" />
    </div>
  );
}
