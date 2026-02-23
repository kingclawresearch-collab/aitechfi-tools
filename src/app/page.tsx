import ToolCard from "@/components/ToolCard";
import { tools } from "@/lib/tools";

export default function Home() {
  return (
    <div>
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="text-blue-600">AI</span> おもしろツール集
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          AIを使った便利でちょっと変わったツールたち。1日3回まで無料。
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
