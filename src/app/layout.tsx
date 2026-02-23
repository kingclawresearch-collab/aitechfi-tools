import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Tools | aitechfi",
    template: "%s | AI Tools - aitechfi",
  },
  description:
    "AIを使ったおもしろ便利ツール集。メール分析、戦闘力診断、プロンプト改善など。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {process.env.NEXT_PUBLIC_ADSENSE_ID && (
        <head>
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        </head>
      )}
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
            <Link href="/" className="text-lg font-bold tracking-tight">
              <span className="text-blue-600">AI</span> Tools
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/"
                className="text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                ツール一覧
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                利用規約
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>

        <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-500">
          <div className="mx-auto max-w-5xl px-4">
            <p>AI Tools by aitechfi — Powered by GPT-4o-mini</p>
            <p className="mt-1 text-xs">
              結果はAIによる推定です。参考情報としてご利用ください。
            </p>
            <p className="mt-2 text-xs">
              <Link href="/terms" className="hover:underline">
                利用規約・免責事項
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
