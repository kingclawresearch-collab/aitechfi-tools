"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import AffiliateLinks from "@/components/AffiliateLinks";
import ShareButtons from "@/components/ShareButtons";

interface Translation {
  original: string;
  true_meaning: string;
  politeness_level: string;
}

interface TranslationResult {
  translations: Translation[];
  overall_assessment: string;
  sender_type: string;
}

const EXAMPLE = `お忙しいところ恐れ入りますが、先日ご依頼した件について、
その後の進捗はいかがでしょうか。
こちらとしましても、関係各所への報告期限が迫っておりまして、
ご状況をお聞かせいただけると大変助かります。
ご検討のほど、何卒よろしくお願い申し上げます。`;

export default function MailTrueMeaningPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/tools/mail-true-meaning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        <span className="text-5xl">🎭</span>
        <h1 className="mt-4 text-3xl font-bold">メールの真意翻訳</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          「ご検討いただければ幸いです」の本当の意味、知ってますか？
        </p>
      </div>

      <AdBanner slot="tool-top" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <textarea
          className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 text-sm leading-relaxed focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          rows={8}
          placeholder="ビジネスメールを貼り付けてください..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={3000}
        />
        <div className="mt-2 flex justify-between">
          <button type="button" onClick={() => setText(EXAMPLE)} className="text-xs text-blue-600 hover:underline dark:text-blue-400">
            サンプルを試す
          </button>
          <span className="text-xs text-gray-400">{text.length}/3000</span>
        </div>
        <button
          onClick={analyze}
          disabled={loading || !text.trim()}
          className="mt-4 w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "翻訳中..." : "本音を翻訳"}
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">{error}</div>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">送信者タイプ</p>
            <p className="mt-1 text-xl font-bold">{result.sender_type}</p>
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{result.overall_assessment}</p>
            <ShareButtons text={`🎭 メールの真意翻訳: 送信者タイプ「${result.sender_type}」`} />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-lg font-bold mb-4">翻訳結果</h2>
            <div className="space-y-4">
              {result.translations.map((t, i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">建前 {t.politeness_level}</p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{t.original}</p>
                  <p className="mt-2 text-sm font-bold text-blue-700 dark:text-blue-400">→ {t.true_meaning}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {result && <AdBanner slot="tool-result" />}
      <AffiliateLinks toolId="mail-true-meaning" />
    </div>
  );
}
