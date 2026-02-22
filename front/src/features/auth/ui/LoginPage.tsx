import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components';
import { useAuthStore } from '@/features/auth'; // 認証状態管理（Zustandなど）

export default function LoginPage() {
  const navigate = useNavigate(); // ページ遷移関数
  const { isAuthenticated } = useAuthStore(); // 認証状態を取得

  // ===============================
  // 認証済みなら自動リダイレクト
  // ===============================
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true }); // 履歴を置き換えて戻れないように
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      {/* ===============================
          背景の装飾円（ボケ感） 
          pointer-events-none = 背景に触れてもクリックされない
      =============================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* ===============================
          ログインカード
          - max幅で中央に固定
          - z-10で背景より前面に表示
          - 白背景 + 角丸 + 影
      =============================== */}
      <div className="w-full max-w-md relative z-10 bg-white rounded-lg shadow-lg p-8">

        {/* ===============================
            ヘッダー
            - タイトルと説明文
        =============================== */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            勤怠管理システム
          </h1>
          <p className="text-gray-600">
            メールアドレスとパスワードでログイン
          </p>
        </div>

        {/* ===============================
            ログインフォーム本体
            - features/auth の LoginForm を使用
            - バリデーションやサブミット処理は LoginForm 内で完結
        =============================== */}
        <LoginForm />
      </div>
    </div>
  );
}
