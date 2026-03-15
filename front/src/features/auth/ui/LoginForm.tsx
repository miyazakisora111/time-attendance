import { useEffect } from 'react';
import { useNavigate, useLocation, type Location } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitButton, Input, Form } from '@/shared/components';
import { useAuth, loginSchema as schema } from '@/features/auth';
import { AppRoutePath } from '@/config/routes';
import { toast as sonner } from 'sonner';

/** ログイン後リダイレクト元の location state。 */
type RedirectState = { from: Location };

/**
 * ログインフォーム。
 */
export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginMutation } = useAuth();
  type FormData = z.infer<typeof schema>;

  // ログイン後のリダイレクト
  useEffect(() => {
    if (loginMutation.isSuccess) {
      const from = (location.state as RedirectState | null)?.from?.pathname;
      navigate(from ?? AppRoutePath.Dashboard, { replace: true });
    }
  }, [loginMutation.isSuccess, navigate, location]);

  /**
   * 認証APIへログイン情報を送信する。
   */
  const onSubmit = async (data: FormData) => {
    try {
      await loginMutation.mutateAsync(data);
      sonner.success("ログインしました。");
    } catch {
      // 失敗時は Axios レスポンスインターセプターで共通処理
    }
  };

  return (
    <Form<FormData>
      formOptions={{ resolver: zodResolver(schema) }}
      onSubmit={onSubmit}
      className="space-y-4 max-w-md mx-4"
    >
      <Input label="メールアドレス" name="email" placeholder="test@test.com" />
      <Input label="パスワード" name="password" type="password" placeholder="Password@1" />
      <SubmitButton className="w-full" variant="solid" intent="primary">ログイン</SubmitButton>
    </Form>
  );
}
