/**
 * ログインページ
 * 認証フィーチャーの登録UI
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth';
import { useAuthStore } from '@/features/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // 既に認証済みの場合はリダイレクト
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* ログインカード */}
      <div className="w-full max-w-md relative z-10 bg-white rounded-lg shadow-lg p-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            勤怠管理システム
          </h1>
          <p className="text-gray-600">
            メールアドレスとパスワードでログイン
          </p>
        </div>

        {/* ログインフォーム */}
        <LoginForm />
      </div>
    </div>
  );
}
