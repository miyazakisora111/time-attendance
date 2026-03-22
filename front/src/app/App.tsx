import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { AppProviders } from "@/app/AppProviders";
import { AppRoutes } from "@/app/AppRoutes";

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold text-red-600">予期しないエラーが発生しました</h1>
      <p className="text-gray-600">{error.message}</p>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        再読み込み
      </button>
    </div>
  );
}

// アプリのルートコンポーネント
export const App = () => (
  <BrowserRouter>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </ErrorBoundary>
  </BrowserRouter>
);