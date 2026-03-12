import { useEffect } from 'react';
import { useNavigate, useLocation, type Location } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitButton, Input, Form } from '@/shared/components';
import { useAuth, loginSchema as schema } from '@/features/auth';
import { getCsrfTokenApi } from '@/api/client';
import { toast } from "sonner"

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginMutation } = useAuth();
  type formData = z.infer<typeof schema>;

  // ログイン後のリダイレクト
  useEffect(() => {
    if (loginMutation.isSuccess) {
      const from = (location.state as { from: Location })?.from?.pathname;
      navigate(from, { replace: true });
    }
  }, [loginMutation.isSuccess, navigate, location]);

  const onSubmit = async (data: formData) => {

    toast.error("API実装するまで待ってね。");

    // CSRFトークン取得
    await getCsrfTokenApi();

    // ログイン実行
    await loginMutation.mutateAsync(data);
  };

  return (
    <Form<formData>
      formOptions={{ resolver: zodResolver(schema) }}
      onSubmit={onSubmit}
      className="space-y-4 max-w-md mx-4"
    >
      <Input label="メールアドレス" name="email" placeholder="test@test.com" />
      <Input label="パスワード" name="password" placeholder="Password@1" />
      <SubmitButton className="w-full" variant="primary">ログイン</SubmitButton>
    </Form>
  );
}
