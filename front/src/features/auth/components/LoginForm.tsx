/**
 * ログインフォームコンポーネント
 * React Hook Form + Zod 統合
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogin, loginFormSchema } from '../index';
import { ApiError } from '@/lib';
import type { LoginFormData } from '../schema';
import type { Location } from 'react-router-dom';

/**
 * ログインフォーム
 * 
 * 使用例:
 * ```tsx
 * <LoginForm />
 * ```
 */
export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  // ログイン後のリダイレクト
  useEffect(() => {
    if (loginMutation.isSuccess) {
      const from = (location.state as { from: Location })?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [loginMutation.isSuccess, navigate, location]);

  // API エラーをフォームに統合
  useEffect(() => {
    if (loginMutation.isError) {
      const error = loginMutation.error as ApiError;
      // バリデーションエラーの場合
      if (error.validationErrors) {
        Object.entries(error.validationErrors).forEach(([field, messages]) => {
          setError(field as keyof LoginFormData, {
            type: 'server',
            message: Array.isArray(messages) ? messages[0] : messages,
          });
        });
      } else {
        // 一般的なエラー
        setError('email', {
          type: 'server',
          message: error.message || 'ログインに失敗しました',
        });
      }
    }
  }, [loginMutation.isError, loginMutation.error, setError]);

  const onSubmit = async (data: LoginFormData) => {
    await loginMutation.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* メールアドレス */}
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
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* パスワード */}
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
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={isSubmitting || loginMutation.isPending}
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting || loginMutation.isPending ? 'ログイン中...' : 'ログイン'}
      </button>

      {/* 全般エラー */}
      {loginMutation.error && !Object.keys(errors).length && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {(loginMutation.error as ApiError).message}
        </div>
      )}
    </form>
  );
}
