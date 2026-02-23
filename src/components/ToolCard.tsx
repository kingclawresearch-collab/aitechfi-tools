import Link from "next/link";
import type { ToolMeta } from "@/lib/tools";

export default function ToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <Link
      href={tool.href}
      className="group block rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-600"
    >
      <div className="text-3xl mb-3">{tool.emoji}</div>
      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
        {tool.name}
      </h3>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed dark:text-gray-400">
        {tool.description}
      </p>
      <div className="mt-4">
        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          {tool.category === "business"
            ? "ビジネス"
            : tool.category === "entertainment"
              ? "エンタメ"
              : "実用"}
        </span>
      </div>
    </Link>
  );
}
