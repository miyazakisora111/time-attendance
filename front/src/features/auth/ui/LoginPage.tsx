import { useEffect } from 'react';
import { useNavigate, useLocation, type Location } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast as sonner } from 'sonner';

import { validationSchemas } from '@/__generated__/zod.validation';
import { Card, Container, Typography, SubmitButton, Input, Form } from '@/shared/components';
import { authStore } from '@/shared/stores/authStore';
import { AppRoutePath } from '@/config/routes';
import { scaleIn } from '@/shared/animations/presets';
import { transitionSlow } from '@/shared/animations/transitions';

import { useAuth } from '@/features/auth/hooks/useAuth';

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

  /**
   * 認証APIへログイン情報を送信する。
   */
  const onSubmit = async (data: LoginFormData) => {
    loginMutation.mutateAsync(data);
    sonner.success('ログインしました。');
  };

  return (
    <Container size="full" tone="blue" center>
      <motion.div
        variants={scaleIn}
        initial="initial"
        animate="animate"
        transition={transitionSlow}
      >
        <Card padding="lg">
          <Typography variant="h3" unstableClassName="mb-4">
            勤怠管理システム
          </Typography>
          <Form<LoginFormData>
            formOptions={{ resolver: zodResolver(validationSchemas.LoginRequest) }}
            onSubmit={onSubmit}
            unstableClassName="space-y-4 max-w-md mx-4"
          >
            <Input label="メールアドレス test@test.com" name="email" placeholder="test@test.com" />
            <Input label="パスワード Password@1" name="password" type="password" placeholder="Password@1" />
            <SubmitButton unstableClassName="w-full" variant="solid" intent="primary">
              ログイン
            </SubmitButton>
          </Form>
        </Card>
      </motion.div>
    </Container>
  );
}