"use client";

interface ShareButtonsProps {
  text: string;
  url?: string;
}

export default function ShareButtons({ text, url }: ShareButtonsProps) {
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");

  const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
    alert("コピーしました！");
  };

  return (
    <div className="flex gap-3 mt-4">
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        𝕏 シェア
      </a>
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-full bg-[#06C755] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#05b04c]"
      >
        LINE
      </a>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        コピー
      </button>
    </div>
  );
}
