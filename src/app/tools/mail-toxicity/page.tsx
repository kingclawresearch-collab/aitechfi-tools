"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import AffiliateLinks from "@/components/AffiliateLinks";
import ScoreGauge from "@/components/ScoreGauge";
import ShareButtons from "@/components/ShareButtons";
import { apiHeaders } from "@/lib/api-key";

interface AggressivePhrase {
  phrase: string;
  reason: string;
  suggestion: string;
}

interface ToxicityResult {
  toxicity_score: number;
  overall_tone: string;
  aggressive_phrases: AggressivePhrase[];
  improved_version: string;
  summary: string;
}

const EXAMPLE_EMAIL = `先日お送りした資料について、まだご確認いただけていないようですが、
期限は既に過ぎております。
早急にご対応いただけないと、プロジェクト全体に影響が出ますので、
本日中にご回答をお願いいたします。
なお、今後このようなことが続くようでしたら、上長にもご相談させていただきます。`;

export default function MailToxicityPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ToxicityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/tools/mail-toxicity", {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "エラーが発生しました");
        return;
      }

      setResult(data.result);
    } catch {
      setError("通信エラーが発生しました。再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <span className="text-5xl">☠️</span>
        <h1 className="mt-4 text-3xl font-bold">メール毒性チェッカー</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          送信前にメールの「攻撃性」をAIがチェック。知らずに相手を怒らせてないか確認しよう。
        </p>
      </div>

      <AdBanner slot="tool-top" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <label
          htmlFor="email-text"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          メール文面を貼り付け
        </label>
        <textarea
          id="email-text"
          className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 p-4 text-sm leading-relaxed focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-blue-800"
          rows={8}
          placeholder="チェックしたいメールの文面をここに貼り付けてください..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={3000}
        />
        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setText(EXAMPLE_EMAIL)}
            className="text-xs text-blue-600 hover:underline dark:text-blue-400"
          >
            サンプルを試す
          </button>
          <span className="text-xs text-gray-400">
            {text.length}/3000
          </span>
        </div>

        <button
          onClick={analyze}
          disabled={loading || !text.trim()}
          className="mt-4 w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "分析中..." : "毒性をチェック"}
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <ScoreGauge score={result.toxicity_score} label="毒性スコア" />
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              トーン: <span className="font-semibold">{result.overall_tone}</span>
            </p>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {result.summary}
            </p>
            <ShareButtons
              text={`📧 メール毒性チェッカー結果: ${result.toxicity_score}/100（${result.overall_tone}）`}
            />
          </div>

          {result.aggressive_phrases.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h2 className="text-lg font-bold">問題のある表現</h2>
              <div className="mt-4 space-y-4">
                {result.aggressive_phrases.map((p, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950"
                  >
                    <p className="font-mono text-sm font-semibold text-orange-800 dark:text-orange-300">
                      &ldquo;{p.phrase}&rdquo;
                    </p>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {p.reason}
                    </p>
                    <p className="mt-2 text-sm">
                      <span className="font-medium text-green-700 dark:text-green-400">
                        改善案:
                      </span>{" "}
                      {p.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-lg font-bold">改善版メール</h2>
            <div className="mt-4 whitespace-pre-wrap rounded-xl bg-green-50 p-4 text-sm leading-relaxed text-gray-800 dark:bg-green-950 dark:text-gray-200">
              {result.improved_version}
            </div>
            <button
              onClick={() =>
                navigator.clipboard.writeText(result.improved_version)
              }
              className="mt-3 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              改善版をコピー
            </button>
          </div>
        </div>
      )}
      {result && <AdBanner slot="tool-result" />}
      <AffiliateLinks toolId="mail-toxicity" />
    </div>
  );
}
