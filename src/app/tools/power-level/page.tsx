"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import AffiliateLinks from "@/components/AffiliateLinks";
import ShareButtons from "@/components/ShareButtons";

interface Stats {
  intelligence: number;
  strength: number;
  charisma: number;
  luck: number;
  stamina: number;
  special: number;
}

interface PowerLevelResult {
  power_level: number;
  comparison: string;
  stats: Stats;
  title: string;
  commentary: string;
  weakness: string;
  growth_tip: string;
}

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
      <div className="flex-1 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${value}%` }} />
      </div>
      <span className="w-8 text-xs font-bold text-right">{value}</span>
    </div>
  );
}

export default function PowerLevelPage() {
  const [job, setJob] = useState("");
  const [skills, setSkills] = useState("");
  const [income, setIncome] = useState("");
  const [fitness, setFitness] = useState("3");
  const [result, setResult] = useState<PowerLevelResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const measure = async () => {
    if (!job.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/tools/power-level", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job, skills, income, fitness }),
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
        <span className="text-5xl">⚡</span>
        <h1 className="mt-4 text-3xl font-bold">AI 戦闘力スコア</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          あなたの社会的戦闘力をスカウターで計測。DBキャラと比較。
        </p>
      </div>

      <AdBanner slot="tool-top" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">職業 *</label>
          <input type="text" className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" placeholder="例: ソフトウェアエンジニア" value={job} onChange={(e) => setJob(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">得意スキル</label>
          <input type="text" className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" placeholder="例: Python, 交渉術, 料理" value={skills} onChange={(e) => setSkills(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">年収帯</label>
          <select className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" value={income} onChange={(e) => setIncome(e.target.value)}>
            <option value="">回答しない</option>
            <option value="〜300万">〜300万</option>
            <option value="300〜500万">300〜500万</option>
            <option value="500〜800万">500〜800万</option>
            <option value="800〜1200万">800〜1200万</option>
            <option value="1200万〜">1200万〜</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">体力 (1-5)</label>
          <input type="range" min="1" max="5" className="mt-1 w-full" value={fitness} onChange={(e) => setFitness(e.target.value)} />
          <div className="flex justify-between text-xs text-gray-400"><span>虚弱</span><span>普通</span><span>超人</span></div>
        </div>
        <button onClick={measure} disabled={loading || !job.trim()} className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50">
          {loading ? "スカウター計測中..." : "戦闘力を測定"}
        </button>
      </div>

      {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">{error}</div>}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 p-8 text-center shadow-lg dark:from-yellow-950 dark:to-orange-950">
            <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">{result.title}</p>
            <p className="mt-2 text-6xl font-black text-orange-600">{result.power_level.toLocaleString()}</p>
            <p className="mt-2 text-lg font-bold text-gray-700 dark:text-gray-300">{result.comparison} 級</p>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{result.commentary}</p>
            <ShareButtons text={`⚡ 戦闘力: ${result.power_level.toLocaleString()}（${result.comparison}級）「${result.title}」`} />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-lg font-bold mb-4">ステータス</h2>
            <div className="space-y-3">
              <StatBar label="知力" value={result.stats.intelligence} />
              <StatBar label="腕力" value={result.stats.strength} />
              <StatBar label="魅力" value={result.stats.charisma} />
              <StatBar label="運" value={result.stats.luck} />
              <StatBar label="体力" value={result.stats.stamina} />
              <StatBar label="必殺技" value={result.stats.special} />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm"><span className="font-bold text-red-600">弱点:</span> {result.weakness}</p>
            <p className="mt-2 text-sm"><span className="font-bold text-green-600">修行のヒント:</span> {result.growth_tip}</p>
          </div>
        </div>
      )}
      {result && <AdBanner slot="tool-result" />}
      <AffiliateLinks toolId="power-level" />
    </div>
  );
}
