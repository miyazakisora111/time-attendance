/**
 * ログアウトボタンコンポーネント
 */

import { useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks';

export function LogoutButton() {
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
    >
      {logoutMutation.isPending ? 'ログアウト中...' : 'ログアウト'}
    </button>
  );
}
