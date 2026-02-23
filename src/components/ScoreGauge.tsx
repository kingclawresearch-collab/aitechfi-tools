"use client";

interface ScoreGaugeProps {
  score: number;
  label: string;
  maxScore?: number;
}

function getColor(score: number, max: number): string {
  const ratio = score / max;
  if (ratio <= 0.33) return "text-green-500";
  if (ratio <= 0.66) return "text-yellow-500";
  return "text-red-500";
}

function getBgColor(score: number, max: number): string {
  const ratio = score / max;
  if (ratio <= 0.33) return "bg-green-500";
  if (ratio <= 0.66) return "bg-yellow-500";
  return "bg-red-500";
}

export default function ScoreGauge({
  score,
  label,
  maxScore = 100,
}: ScoreGaugeProps) {
  const percentage = Math.min((score / maxScore) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex items-end justify-between mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </span>
        <span className={`text-4xl font-bold ${getColor(score, maxScore)}`}>
          {score}
          <span className="text-lg text-gray-400">/{maxScore}</span>
        </span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getBgColor(score, maxScore)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
