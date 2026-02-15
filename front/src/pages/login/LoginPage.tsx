/**
 * ログインページ コンテナコンポーネント
 */

import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField, Alert } from '../../shared/components/molecules';
import { Button, Card } from '../../shared/components/atoms';
import { Text } from '../../shared/components/atoms/Text';
import { useForm } from '../../shared/hooks';
import { useLoginMutation } from '../../shared/hooks/queries';
import { useAuthStore } from '../../shared/store';
import { isValidEmail } from '../../shared/utils';

/**
 * LoginPage コンポーネント
 * ログイン画面
 */
export function LoginPage() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const loginMutation = useLoginMutation();

  // 認証済みの場合はダッシュボードへ
  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [token, navigate]);

  const validate = useCallback(
    (values: any) => {
      const errors: any = {};

      if (!values.email) {
        errors.email = 'メールアドレスを入力してください';
      } else if (!isValidEmail(values.email)) {
        errors.email = '正しいメールアドレスを入力してください';
      }

      if (!values.password) {
        errors.password = 'パスワードを入力してください';
      } else if (values.password.length < 6) {
        errors.password = 'パスワードは6文字以上です';
      }

      return errors;
    },
    []
  );

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    { email: '', password: '' },
    async (values) => {
      loginMutation.mutate(values, {
        onSuccess: () => {
          navigate('/dashboard', { replace: true });
        },
      });
    },
    validate
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* ログインフォーム */}
      <Card
        variant="elevated"
        padding="lg"
        className="w-full max-w-md relative z-10"
      >
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <Text variant="h2" weight="bold" className="mb-2">
            時間管理システム
          </Text>
          <Text variant="body" color="secondary">
            ログインしてください
          </Text>
        </div>

        {/* エラー表示 */}
        {loginMutation.error && (
          <Alert
            type="error"
            title="ログインエラー"
            description={
              loginMutation.error instanceof Error
                ? loginMutation.error.message
                : 'ログインに失敗しました'
            }
            closable
            onDismiss={() => loginMutation.reset()}
            className="mb-4"
          />
        )}

        {/* ログインフォーム */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* メールアドレス入力 */}
          <FormField
            label="メールアドレス"
            required
            error={touched.email ? !!errors.email : false}
            errorMessage={errors.email}
            htmlFor="email"
            type="email"
            placeholder="example@example.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loginMutation.isPending}
          />

          {/* パスワード入力 */}
          <FormField
            label="パスワード"
            required
            error={touched.password ? !!errors.password : false}
            errorMessage={errors.password}
            htmlFor="password"
            type="password"
            placeholder="パスワードを入力"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loginMutation.isPending}
          />

          {/* ログインボタン */}
          <Button
            type="submit"
            fullWidth
            loading={loginMutation.isPending}
            disabled={loginMutation.isPending}
            size="lg"
          >
            ログイン
          </Button>

          {/* フッターリンク */}
          <div className="text-center text-sm text-gray-600">
            パスワードをお忘れですか？{' '}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              リセット
            </a>
          </div>
        </form>

        {/* デモ用注記 */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Text variant="caption" color="inherit" className="text-yellow-800">
            デモモード: 任意のメールアドレスとパスワードでログイン可能です
          </Text>
        </div>
      </Card>
    </div>
  );
}
