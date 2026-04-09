import { useEffect } from 'react';
import { useNavigate, useLocation, type Location } from 'react-router-dom';
import { toast as sonner } from 'sonner';
import type { z } from 'zod';

import type { validationSchemas } from '@/__generated__/zod.validation';
import { authStore } from '@/shared/stores/authStore';
import { AppRoutePath } from '@/config/routes';

import { useAuth } from '@/features/auth/hooks/useAuth';

type RedirectState = { from?: Location };

export type LoginFormData = z.infer<typeof validationSchemas.LoginRequest>;

export interface LoginPageView {
    isSubmitting: boolean;
}

type LoginPageViewModel = LoginPageView & {
    onSubmit: (data: LoginFormData) => void;
};

/**
 * ログイン画面専用の ViewModel。
 *
 * 認証状態の監視・リダイレクト・フォーム送信を責務として持つ。
 * LoginPage（View）はこの ViewModel の戻り値のみを使い、ロジックを持たない。
 */
export const useLoginPageViewModel = (): LoginPageViewModel => {
    const navigate = useNavigate();
    const location = useLocation();
    const { loginMutation } = useAuth();
    const isAuthenticated = authStore((state) => state.isAuthenticated);

    // 認証済みならダッシュボードへリダイレクト
    useEffect(() => {
        if (isAuthenticated) {
            navigate(AppRoutePath.Dashboard, { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // ログイン成功後のリダイレクト
    useEffect(() => {
        if (loginMutation.isSuccess) {
            const from = (location.state as RedirectState | null)?.from?.pathname;
            navigate(from ?? AppRoutePath.Dashboard, { replace: true });
        }
    }, [location.state, loginMutation.isSuccess, navigate]);

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutateAsync(data);
        sonner.success('ログインしました。');
    };

    return {
        isSubmitting: loginMutation.isPending,
        onSubmit,
    };
};
