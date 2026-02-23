"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import AffiliateLinks from "@/components/AffiliateLinks";
import ShareButtons from "@/components/ShareButtons";

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

export default function GoshugiPage() {
  const [event, setEvent] = useState("");
  const [relationship, setRelationship] = useState("");
  const [age, setAge] = useState("");
  const [region, setRegion] = useState("");
  const [result, setResult] = useState<GoshugiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const judge = async () => {
    if (!event) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/tools/goshugi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, relationship, age, region }),
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
        <span className="text-5xl">💰</span>
        <h1 className="mt-4 text-3xl font-bold">ご祝儀・香典 相場判定</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          いくら包めばいい？AIが関係性・年齢・地域から相場を判定します。
        </p>
      </div>

      <AdBanner slot="tool-top" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">イベント *</label>
          <select className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" value={event} onChange={(e) => setEvent(e.target.value)}>
            <option value="">選択してください</option>
            <optgroup label="お祝い">
              <option value="結婚式">結婚式</option>
              <option value="結婚祝い（式に出席しない）">結婚祝い（式に出席しない）</option>
              <option value="出産祝い">出産祝い</option>
              <option value="入学祝い">入学祝い</option>
              <option value="卒業祝い">卒業祝い</option>
              <option value="就職祝い">就職祝い</option>
              <option value="昇進祝い">昇進祝い</option>
              <option value="新築祝い">新築祝い</option>
              <option value="開業祝い">開業祝い</option>
              <option value="還暦祝い">還暦祝い</option>
            </optgroup>
            <optgroup label="弔事">
              <option value="通夜・葬儀（香典）">通夜・葬儀（香典）</option>
              <option value="法事（三回忌等）">法事（三回忌等）</option>
            </optgroup>
            <optgroup label="その他">
              <option value="お見舞い">お見舞い</option>
              <option value="お中元">お中元</option>
              <option value="お歳暮">お歳暮</option>
              <option value="餞別">餞別</option>
            </optgroup>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">相手との関係</label>
          <select className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" value={relationship} onChange={(e) => setRelationship(e.target.value)}>
            <option value="">選択してください</option>
            <option value="親友・幼なじみ">親友・幼なじみ</option>
            <option value="友人">友人</option>
            <option value="会社の同僚">会社の同僚</option>
            <option value="会社の上司">会社の上司</option>
            <option value="会社の部下">会社の部下</option>
            <option value="取引先">取引先</option>
            <option value="兄弟姉妹">兄弟姉妹</option>
            <option value="いとこ">いとこ</option>
            <option value="おじ・おば">おじ・おば</option>
            <option value="甥・姪">甥・姪</option>
            <option value="配偶者の親族">配偶者の親族</option>
            <option value="近所の人">近所の人</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">あなたの年代</label>
          <select className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" value={age} onChange={(e) => setAge(e.target.value)}>
            <option value="">選択してください</option>
            <option value="20代">20代</option>
            <option value="30代">30代</option>
            <option value="40代">40代</option>
            <option value="50代以上">50代以上</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">地域</label>
          <select className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">選択してください</option>
            <option value="北海道">北海道</option>
            <option value="東北">東北</option>
            <option value="関東">関東</option>
            <option value="中部">中部</option>
            <option value="関西">関西</option>
            <option value="中国・四国">中国・四国</option>
            <option value="九州・沖縄">九州・沖縄</option>
          </select>
        </div>
        <button onClick={judge} disabled={loading || !event} className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50">
          {loading ? "判定中..." : "相場を判定"}
        </button>
      </div>

      {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border-2 border-blue-300 bg-blue-50 p-8 text-center dark:border-blue-700 dark:bg-blue-950">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">推奨金額</p>
            <p className="mt-2 text-5xl font-black text-blue-800 dark:text-blue-200">
              {result.amount.toLocaleString()}<span className="text-2xl">円</span>
            </p>
            <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
              目安: {result.amount_range.min.toLocaleString()}円 〜 {result.amount_range.max.toLocaleString()}円
            </p>
            <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">{result.reasoning}</p>
            <ShareButtons text={`💰 ${event}の相場: ${result.amount.toLocaleString()}円`} />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-lg font-bold mb-3">マナー・注意点</h2>
            <ul className="space-y-2">
              {result.manner_tips.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400">封筒・のし袋</h3>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{result.envelope_type}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400">表書き</h3>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{result.writing_guide}</p>
            </div>
          </div>

          {result.ng_amounts && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
              <span className="font-bold">NG金額:</span> {result.ng_amounts}
            </div>
          )}

          {result.regional_note && result.regional_note !== "特になし" && (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
              <span className="font-bold">地域性:</span> {result.regional_note}
            </div>
          )}
        </div>
      )}
      {result && <AdBanner slot="tool-result" />}
      <AffiliateLinks toolId="goshugi" />
    </div>
  );
}
