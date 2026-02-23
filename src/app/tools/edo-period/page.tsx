"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import AffiliateLinks from "@/components/AffiliateLinks";
import ShareButtons from "@/components/ShareButtons";

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

export default function EdoPeriodPage() {
  const [job, setJob] = useState("");
  const [skills, setSkills] = useState("");
  const [personality, setPersonality] = useState("");
  const [result, setResult] = useState<EdoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const simulate = async () => {
    if (!job.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/tools/edo-period", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job, skills, personality }),
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
        <span className="text-5xl">🏯</span>
        <h1 className="mt-4 text-3xl font-bold">江戸時代に生まれてたら</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          あなたの現代スキルは、江戸時代でどんな職業になる？
        </p>
      </div>

      <AdBanner slot="tool-top" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">現在の職業 *</label>
          <input type="text" className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" placeholder="例: Webデザイナー" value={job} onChange={(e) => setJob(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">スキル・特技</label>
          <input type="text" className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" placeholder="例: デザイン、コミュニケーション、英語" value={skills} onChange={(e) => setSkills(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">性格</label>
          <input type="text" className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" placeholder="例: 好奇心旺盛、慎重" value={personality} onChange={(e) => setPersonality(e.target.value)} />
        </div>
        <button onClick={simulate} disabled={loading || !job.trim()} className="w-full rounded-xl bg-amber-700 py-3 font-bold text-white transition hover:bg-amber-800 disabled:opacity-50">
          {loading ? "時代考証中..." : "江戸時代の自分を見る"}
        </button>
      </div>

      {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">{error}</div>}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-8 text-center dark:border-amber-700 dark:bg-amber-950">
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">あなたの江戸時代</p>
            <p className="mt-2 text-3xl font-black text-amber-900 dark:text-amber-100">{result.edo_job}</p>
            <p className="mt-1 text-lg text-amber-700 dark:text-amber-300">身分: {result.social_class}</p>
            <div className="mt-4 flex justify-center gap-6">
              <div>
                <p className="text-xs text-amber-600 dark:text-amber-400">年収</p>
                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{result.annual_income_ryo}両</p>
              </div>
              <div>
                <p className="text-xs text-amber-600 dark:text-amber-400">現代換算</p>
                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">約{(result.modern_equivalent_yen / 10000).toFixed(0)}万円</p>
              </div>
            </div>
            <ShareButtons text={`🏯 江戸時代に生まれてたら「${result.edo_job}」（${result.social_class}）年収${result.annual_income_ryo}両！`} />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-lg font-bold mb-2">あなたの一日</h2>
            <div className="space-y-2">
              {result.daily_schedule.map((item, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="shrink-0 w-36 font-mono text-amber-700 dark:text-amber-400">{item.time}</span>
                  <span className="text-gray-700 dark:text-gray-300">{item.activity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-lg font-bold mb-2">人生ストーリー</h2>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{result.life_story}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm"><span className="font-bold">スキル変換:</span> {result.skill_translation}</p>
            <p className="mt-2 text-sm"><span className="font-bold">豆知識:</span> {result.fun_fact}</p>
          </div>
        </div>
      )}
      {result && <AdBanner slot="tool-result" />}
      <AffiliateLinks toolId="edo-period" />
    </div>
  );
}
