import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約・免責事項",
};

export default function TermsPage() {
  return (
    <div className="prose prose-gray mx-auto max-w-3xl dark:prose-invert">
      <h1>利用規約・免責事項</h1>
      <p className="text-sm text-gray-500">最終更新日: 2026年2月23日</p>

      <h2>1. サービス概要</h2>
      <p>
        本サイト「AI Tools by aitechfi」（以下「本サービス」）は、
        AI（人工知能）を活用した各種ツールを無料で提供するWebサービスです。
      </p>

      <h2>2. 免責事項</h2>
      <ul>
        <li>
          本サービスで提供される結果はすべて<strong>AIによる推定・生成</strong>
          であり、その正確性・完全性・有用性を保証するものではありません。
        </li>
        <li>
          本サービスの利用により生じた損害について、運営者は一切の責任を負いません。
        </li>
        <li>
          ビジネス上の判断、金銭に関する決定等については、専門家にご相談ください。
        </li>
        <li>
          本サービスは予告なく変更・停止・終了する場合があります。
        </li>
      </ul>

      <h2>3. 利用制限</h2>
      <ul>
        <li>無料利用は<strong>1日3回まで</strong>（IPアドレス単位）です。</li>
        <li>
          自動化ツール、スクレイピング、API呼び出し等による大量アクセスは禁止です。
        </li>
        <li>
          不正利用が確認された場合、予告なくアクセスを制限する場合があります。
        </li>
      </ul>

      <h2>4. プライバシー</h2>
      <ul>
        <li>
          入力されたテキストはAI分析のみに使用され、
          <strong>サーバーに保存されません</strong>。
        </li>
        <li>
          アクセスログ（IPアドレス等）はレート制限とサービス改善の目的でのみ使用します。
        </li>
        <li>
          本サイトではGoogle AdSense等の第三者広告サービスを利用しており、
          Cookieが使用される場合があります。
        </li>
      </ul>

      <h2>5. 知的財産権</h2>
      <ul>
        <li>本サービスのデザイン・コード・コンテンツの著作権は運営者に帰属します。</li>
        <li>
          AIが生成した結果のテキストは、利用者が自由にご利用いただけます。
        </li>
      </ul>

      <h2>6. 禁止事項</h2>
      <ul>
        <li>本サービスを利用した違法行為</li>
        <li>他者を誹謗中傷する目的での利用</li>
        <li>サービスの運営を妨げる行為</li>
        <li>自動化ツールによる大量リクエスト</li>
      </ul>

      <h2>7. 変更</h2>
      <p>
        本規約は予告なく変更される場合があります。
        変更後も本サービスの利用を継続した場合、変更に同意したものとみなします。
      </p>

      <h2>8. お問い合わせ</h2>
      <p>
        本サービスに関するお問い合わせは、
        <a href="https://aitechfi.com" className="text-blue-600 hover:underline">
          aitechfi.com
        </a>
        よりご連絡ください。
      </p>
    </div>
  );
}
