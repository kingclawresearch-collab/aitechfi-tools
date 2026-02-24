"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import AffiliateLinks from "@/components/AffiliateLinks";
import { apiHeaders } from "@/lib/api-key";

interface MercariResult {
  title: string;
  description: string;
  hashtags: string[];
  price_suggestion: { min: number; max: number; recommended: number };
  tips: string;
}

function CopyBlock({ label, content }: { label: string; content: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{label}</span>
        <button
          onClick={() => navigator.clipboard.writeText(content)}
          className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          コピー
        </button>
      </div>
      <p className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200">{content}</p>
    </div>
  );
}

export default function MercariListingPage() {
  const [product, setProduct] = useState("");
  const [condition, setCondition] = useState("目立った傷や汚れなし");
  const [details, setDetails] = useState("");
  const [result, setResult] = useState<MercariResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!product.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/tools/mercari-listing", {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ product, condition, details }),
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
        <span className="text-5xl">🛒</span>
        <h1 className="mt-4 text-3xl font-bold">メルカリ出品文生成</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          売れる商品説明文をAIが即座に生成。コピペでそのまま使えます。
        </p>
      </div>

      <AdBanner slot="tool-top" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">商品名 *</label>
          <input type="text" className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" placeholder="例: Nike Air Max 90 黒 27cm" value={product} onChange={(e) => setProduct(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">状態</label>
          <select className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option>新品、未使用</option>
            <option>未使用に近い</option>
            <option>目立った傷や汚れなし</option>
            <option>やや傷や汚れあり</option>
            <option>傷や汚れあり</option>
            <option>全体的に状態が悪い</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">補足情報</label>
          <textarea className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" rows={3} placeholder="例: 2024年購入、3回着用、箱あり、右足つま先に小さな擦り傷" value={details} onChange={(e) => setDetails(e.target.value)} />
        </div>
        <button onClick={generate} disabled={loading || !product.trim()} className="w-full rounded-xl bg-red-500 py-3 font-bold text-white transition hover:bg-red-600 disabled:opacity-50">
          {loading ? "生成中..." : "出品文を生成"}
        </button>
      </div>

      {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {result && (
        <div className="mt-8 space-y-4">
          <CopyBlock label="タイトル" content={result.title} />
          <CopyBlock label="商品説明" content={result.description} />
          <CopyBlock label="ハッシュタグ" content={result.hashtags.join(" ")} />

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-lg font-bold mb-3">価格の目安</h2>
            <div className="flex gap-4 text-center">
              <div className="flex-1 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                <p className="text-xs text-gray-500">最安</p>
                <p className="text-xl font-bold">{result.price_suggestion.min.toLocaleString()}円</p>
              </div>
              <div className="flex-1 rounded-xl bg-blue-50 p-3 border-2 border-blue-300 dark:bg-blue-950 dark:border-blue-700">
                <p className="text-xs text-blue-600 dark:text-blue-400">おすすめ</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{result.price_suggestion.recommended.toLocaleString()}円</p>
              </div>
              <div className="flex-1 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                <p className="text-xs text-gray-500">強気</p>
                <p className="text-xl font-bold">{result.price_suggestion.max.toLocaleString()}円</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">※ AIによる概算です。実際の相場はメルカリでご確認ください。</p>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{result.tips}</p>
          </div>
        </div>
      )}
      {result && <AdBanner slot="tool-result" />}
      <AffiliateLinks toolId="mercari-listing" />
    </div>
  );
}
