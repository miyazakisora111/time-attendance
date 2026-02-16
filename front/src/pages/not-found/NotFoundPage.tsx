/**
 * 404 Not Found ページ
 */

import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-xl text-gray-600">ページが見つかりません</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-8 px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
        >
          ダッシュボードに戻る
        </button>
      </div>
    </div>
  );
}
