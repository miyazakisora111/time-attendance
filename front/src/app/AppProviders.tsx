import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { isDevelopment } from '@/env';
import { createQueryClient } from '@/lib/query-client';
import { Toaster } from 'sonner';
import { ErrorProvider } from '@/shared/contexts/ErrorContext';
import { ErrorModal } from '@/shared/components/errors/ErrorModal';

interface Props {
    children: React.ReactNode;
}

export function AppProviders({ children }: Props) {
    const queryClient = createQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ErrorProvider>
                {children}
                <ErrorModal />
                {isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
                <Toaster position="top-right" richColors closeButton />
            </ErrorProvider>
        </QueryClientProvider>
    );
}
