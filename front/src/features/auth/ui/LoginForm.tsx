import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, loginFormSchema } from '@/features/auth';
import { getCsrfTokenApi } from '@/features/auth/api/api';
import type { LoginFormData } from '../model/schema';
import type { Location } from 'react-router-dom';

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
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          メールアドレス
        </label>
        <input
          id="email"
          type="email"
          placeholder="your@example.com"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          {...register('email')}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          パスワード
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          {...register('password')}
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || loginMutation.isPending}
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting || loginMutation.isPending ? 'ログイン中...' : 'ログイン'}
      </button>

      {loginMutation.error && !Object.keys(errors).length && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {loginMutation.error.message}
        </div>
      )}
    </form>
  );
}
