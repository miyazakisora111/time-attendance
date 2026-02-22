import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/model/useAuth';

export function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout.mutateAsync();
    navigate('/login', { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={logout.isPending}
      aria-busy={logout.isPending}
      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {logout.isPending ? 'ログアウト中...' : 'ログアウト'}
    </button>
  );
}
