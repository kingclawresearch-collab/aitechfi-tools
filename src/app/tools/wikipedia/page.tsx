"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import AffiliateLinks from "@/components/AffiliateLinks";
import ShareButtons from "@/components/ShareButtons";

interface WikiResult {
  article: string;
  categories: string[];
  infobox: { label: string; value: string }[];
}

export default function WikipediaPage() {
  const [name, setName] = useState("");
  const [career, setCareer] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [highlights, setHighlights] = useState("");
  const [result, setResult] = useState<WikiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/tools/wikipedia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, career, hobbies, highlights }),
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
        <span className="text-5xl">📖</span>
        <h1 className="mt-4 text-3xl font-bold">AIが書く あなたのWikipedia</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          あなたの人生をWikipedia風の百科事典記事に変換します。
        </p>
      </div>

      <AdBanner slot="tool-top" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">名前（ニックネーム可） *</label>
          <input type="text" className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" placeholder="例: 田中太郎" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">経歴</label>
          <textarea className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" rows={3} placeholder="例: 東京出身、IT企業で10年勤務後フリーランス" value={career} onChange={(e) => setCareer(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">趣味・特技</label>
          <input type="text" className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" placeholder="例: 将棋、料理、マラソン" value={hobbies} onChange={(e) => setHobbies(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">人生のハイライト</label>
          <textarea className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" rows={3} placeholder="例: 25歳で起業、30歳で富士山登頂、猫を3匹飼っている" value={highlights} onChange={(e) => setHighlights(e.target.value)} />
        </div>
        <button onClick={generate} disabled={loading || !name.trim()} className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Wikipedia生成中..." : "Wikipedia記事を生成"}
        </button>
      </div>

      {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">{error}</div>}

      {result && (
        <div className="mt-8">
          <div className="rounded-2xl border border-gray-300 bg-white p-8 shadow-sm dark:border-gray-600 dark:bg-gray-50" style={{ fontFamily: "serif" }}>
            <div className="float-right ml-4 mb-4 w-64 rounded border border-gray-300 bg-gray-100 p-3 text-xs">
              <p className="text-center font-bold text-sm mb-2 text-gray-900">{name}</p>
              <table className="w-full">
                <tbody>
                  {result.infobox.map((item, i) => (
                    <tr key={i} className="border-t border-gray-200">
                      <td className="py-1 pr-2 font-bold text-gray-700">{item.label}</td>
                      <td className="py-1 text-gray-900">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="prose prose-sm max-w-none text-gray-900 whitespace-pre-wrap">{result.article}</div>
            <div className="clear-both mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
              {result.categories.map((cat, i) => (
                <span key={i} className="text-xs text-blue-700 hover:underline cursor-pointer">カテゴリ: {cat}</span>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <ShareButtons text={`📖 AIが書いた私のWikipedia記事ができました！`} />
          </div>
        </div>
      )}
      {result && <AdBanner slot="tool-result" />}
      <AffiliateLinks toolId="wikipedia" />
    </div>
  );
}
