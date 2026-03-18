import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { isDevelopment } from '@/env';
import { createQueryClient } from '@/shared/react-query/query-client';
import { Toaster } from 'sonner';
import { ErrorProvider } from '@/shared/contexts/ErrorContext';
import { ErrorModal } from '@/shared/components/errors/ErrorModal';

interface Props {
    children: React.ReactNode;
}

/**
 * アプリ全体に提供するグローバル Provider をまとめたコンポーネント
 */
export function AppProviders({ children }: Props) {
    // NOTE:再レンダーでも同一インスタンスを保持する。
    const [queryClient] = React.useState(() => createQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {/* アプリのエラーステート */}
            <ErrorProvider>
                {/* 子孫コンポーネント */}
                {children}

                {/* エラーモーダル */}
                <ErrorModal />

                {/* トースト通知 */}
                <Toaster position="top-right" richColors closeButton />

                {/* 開発環境のみ React Query Devtools を有効化 */}
                {isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
            </ErrorProvider>
        </QueryClientProvider>
    );
}