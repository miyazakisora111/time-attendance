import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createQueryClient, isDevelopment } from '@/lib';

interface Props {
    children: React.ReactNode;
}

export function AppProviders({ children }: Props) {
    const queryClient = createQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}

            {/* 開発環境: React Query DevTools */}
            {isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}
