import { useEffect } from 'react';
import { useNavigate, useLocation, type Location } from 'react-router-dom';
import { toast as sonner } from 'sonner';

import { authStore } from '@/shared/stores/authStore';
import { AppRoutePath } from '@/config/routes';

import { useAuth } from '@/features/auth/hooks/useAuth';
import type { LoginPageProps, LoginFormData } from '@/features/auth/ui/page/LoginPage.types';

type RedirectState = { from?: Location };

/**
 * ログイン画面のFacade Hook。
 */
export const useLoginPage = (): LoginPageProps => {
    const navigate = useNavigate();
    const location = useLocation();
    const { loginMutation } = useAuth();
    const isAuthenticated = authStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            navigate(AppRoutePath.Dashboard, { replace: true });
        }
    }, [isAuthenticated, navigate]);

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
