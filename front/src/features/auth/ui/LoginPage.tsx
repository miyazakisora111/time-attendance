import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth/ui/LoginForm';
import { useAuthStore } from '@/features/auth';

// 既ににログイン時にリダイレクトします。
const useRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);
};

export default function LoginPage() {
  useRedirect();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-md relative z-10 bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            勤怠管理システム
          </h1>
          <p className="text-gray-600">
            メールアドレスとパスワードでログイン
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
