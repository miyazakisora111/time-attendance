import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import { AppRoutePath } from '@/config/routes';
import { Card } from "@/shared/components";
import { Container } from "@/shared/components/Container";
import { Typography } from "@/shared/components/Typography";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitButton, Input, Form } from '@/shared/components';
import { useAuth } from '@/features/auth';
import { validationSchemas } from '@/__generated__/zod.validation';
import { toast as sonner } from 'sonner';

/** ログイン後リダイレクト元の location state。 */
type RedirectState = { from: Location };

const navigate = useNavigate();
const location = useLocation();
const { loginMutation } = useAuth();
type FormData = z.infer<typeof validationSchemas.LoginRequest>;

/**
 * 認証APIへログイン情報を送信する。
 */
const onSubmit = async (data: FormData) => {
  await loginMutation.mutateAsync(data);
  sonner.success("ログインしました。");
};

/**
 * ログイン済みユーザーをダッシュボードへリダイレクトする。
 */
const useRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(AppRoutePath.Dashboard, { replace: true });
    }
  }, [isAuthenticated, navigate]);
};

// ログイン後のリダイレクト
// TODO: Route Loader でリダイレクト（v6.4+）
useEffect(() => {
  if (loginMutation.isSuccess) {
    const from = (location.state as RedirectState | null)?.from?.pathname;
    navigate(from ?? AppRoutePath.Dashboard, { replace: true });
  }
}, [loginMutation.isSuccess, navigate, location]);

/**
 * ログイン画面。
 */
export function LoginPage() {
  useRedirect();

  return (
    <Container size="full" tone="blue">
      <Card padding="lg">
        <Typography variant="h1" className="mb-4">
          勤怠管理システム
        </Typography>
        <Form<FormData>
          formOptions={{ resolver: zodResolver(validationSchemas.LoginRequest) }}
          onSubmit={onSubmit}
          className="space-y-4 max-w-md mx-4"
        >
          <Input label="メールアドレス" name="email" placeholder="test@test.com" />
          <Input label="パスワード" name="password" type="password" placeholder="Password@1" />
          <SubmitButton className="w-full" variant="solid" intent="primary">ログイン</SubmitButton>
        </Form>
      </Card>
    </Container>
  );
}