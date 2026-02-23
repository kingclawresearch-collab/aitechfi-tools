"use client";

import { affiliatesByTool, type AffiliateLink } from "@/lib/affiliates";

interface AffiliateLinksProps {
  toolId: string;
}

function AffiliateLinkCard({ link }: { link: AffiliateLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="block rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-600"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {link.label}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {link.description}
          </p>
        </div>
        {link.badge && (
          <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {link.badge}
          </span>
        )}
      </div>
    </a>
  );
}

export default function AffiliateLinks({ toolId }: AffiliateLinksProps) {
  const links = affiliatesByTool[toolId];
  if (!links || links.length === 0) return null;

  return (
    <div className="mt-8">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
        関連おすすめ
      </p>
      <div className="space-y-3">
        {links.map((link, i) => (
          <AffiliateLinkCard key={i} link={link} />
        ))}
      </div>
    </div>
  );
}
