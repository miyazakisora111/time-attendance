import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { isDevelopment } from '@/env';
import { createQueryClient } from '@/lib/query/query-client';
import { Toaster } from 'sonner';
import { ErrorModal } from '@/shared/components/errors/ErrorModal';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/shared/components/errors/ErrorFallback';
import { normalizeError } from '@/shared/utils/error';

interface Props {
    children: React.ReactNode;
}

export function AppProviders({ children }: Props) {
    const [queryClient] = React.useState(() => createQueryClient());

    return (
        <ErrorBoundary
            FallbackComponent={({ error, resetErrorBoundary }) => (
                <ErrorFallback error={normalizeError(error)} onRetry={resetErrorBoundary} />
            )}
            onError={(error) => {
                if (!isDevelopment) {
                    console.error(normalizeError(error));
                }
            }}
        >
            <QueryClientProvider client={queryClient}>
                {children}

                {/* 非同期エラー */}
                <ErrorModal />

                {/* 通知 */}
                <Toaster position="top-right" richColors closeButton />

                {/* Devtools */}
                {isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
            </QueryClientProvider>
        </ErrorBoundary>
    );
}
