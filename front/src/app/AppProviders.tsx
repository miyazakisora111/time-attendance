import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { isDevelopment } from '@/env';
import { createQueryClient } from '@/lib/query/query-client';
import { Toaster } from 'sonner';
import { ErrorModal } from '@/shared/components/errors/ErrorModal';

interface Props {
    children: React.ReactNode;
}

/**
 * アプリ全体に提供するグローバル Provider をまとめたコンポーネント
 */
export function AppProviders({ children }: Props) {
    const [queryClient] = React.useState(() => createQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {/* 子孫コンポーネント */}
            {children}

            {/* エラーモーダル（Zustand store で状態管理。Provider 不要） */}
            <ErrorModal />

            {/* トースト通知 */}
            <Toaster position="top-right" richColors closeButton />

            {/* 開発環境のみ React Query Devtools を有効化 */}
            {isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}