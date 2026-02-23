import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, type Location } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth, loginFormSchema } from '@/features/auth';
import { getCsrfTokenApi } from '@/features/auth/api/api';
import type { LoginFormData } from '@/features/auth';
import { Button } from '@/shared/ui';

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useAuth().login;

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } =
    useForm<LoginFormData>({ resolver: zodResolver(loginFormSchema) });

  // ログイン後のリダイレクト
  useEffect(() => {
    if (loginMutation.isSuccess) {
      const from = (location.state as { from: Location })?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [loginMutation.isSuccess, navigate, location]);

  const onSubmit = async (data: LoginFormData) => {
    // CSRF トークン取得
    await getCsrfTokenApi();

    // ログイン
    await loginMutation.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* email */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          メールアドレス
        </label>
        <input
          type="email"
          {...register("email")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          パスワード
        </label>
        <input
          type="password"
          {...register("password")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button>デフォルト（primary）</Button>
      <Button variant="secondary">キャンセル</Button>
      <Button variant="danger">削除</Button>
      <Button variant="outline">下書き保存</Button>
      <Button variant="ghost">閉じる</Button>
      <Button variant="link">詳細を見る</Button>

      <Button size="sm">小さい</Button>
      <Button size="lg">大きい</Button>
    </form>

  );
}
