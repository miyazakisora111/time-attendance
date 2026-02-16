/**
 * ダッシュボードページ
 */

import { useAuthStore, LogoutButton } from '@/features/auth';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
            <p className="text-gray-600 mt-1">
              ようこそ、{user?.name || 'ユーザー'}さん
            </p>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ウェルカムカード */}
        <div className="bg-linear-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">本日のダッシュボード</h2>
          <p className="text-blue-100">
            {new Date().toLocaleDateString('ja-JP', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* グリッドレイアウト */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* カード1 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">本日の状態</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">ステータス</p>
                <p className="text-2xl font-bold text-blue-600">出勤中</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
            </div>
          </div>

          {/* カード2 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">今月の勤務時間</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">合計時間</p>
                <p className="text-2xl font-bold text-green-600">156.5時間</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">⏱</span>
              </div>
            </div>
          </div>

          {/* カード3 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">部門</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">所属</p>
                <p className="text-2xl font-bold text-purple-600">
                  {user?.department_id || '未設定'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🏢</span>
              </div>
            </div>
          </div>
        </div>

        {/* インフォメーション */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-900 text-sm">
            <strong>💡 ヒント:</strong> このダッシュボードはプロダクション対応のアーキテクチャで実装されています。
            TanStack Query で Server State、Zustand で UI State を管理しています。
          </p>
        </div>
      </main>
    </div>
  );
}
