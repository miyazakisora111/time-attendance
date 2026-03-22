import { useEffect } from 'react';
import { useNavigate, useLocation, type Location } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast as sonner } from 'sonner';
import { AppRoutePath } from '@/config/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAuthStore } from '@/features/auth/state/useAuthStore';
import { validationSchemas } from '@/__generated__/zod.validation';
import { Card, Container, Typography, SubmitButton, Input, Form } from '@/shared/components';

/** ログイン後リダイレクト元の location state。 */
type RedirectState = { from?: Location };

type LoginFormData = z.infer<typeof validationSchemas.LoginRequest>;

/**
 * ログイン画面。
 */
export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginMutation } = useAuth();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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

  /**
   * 認証APIへログイン情報を送信する。
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      sonner.success('ログインしました。');
    } catch {
      sonner.error('メールアドレスまたはパスワードが正しくありません。');
    }
  };

  return (
    <Container size="full" tone="blue" center>
      <Card padding="lg">
        <Typography variant="h3" unstableClassName="mb-4">
          勤怠管理システム
        </Typography>
        <Form<LoginFormData>
          formOptions={{ resolver: zodResolver(validationSchemas.LoginRequest) }}
          onSubmit={onSubmit}
          unstableClassName="space-y-4 max-w-md mx-4"
        >
          <Input label="メールアドレス" name="email" placeholder="test@test.com" />
          <Input label="パスワード" name="password" type="password" placeholder="Password@1" />
          <SubmitButton unstableClassName="w-full" variant="solid" intent="primary">
            ログイン
          </SubmitButton>
        </Form>
      </Card>
    </Container>
  );
}