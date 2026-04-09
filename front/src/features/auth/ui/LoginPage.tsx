import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';

import { validationSchemas } from '@/__generated__/zod.validation';
import { Card, Container, Typography, SubmitButton, Input, Form } from '@/shared/components';
import { scaleIn } from '@/shared/animations/presets';
import { transitionSlow } from '@/shared/animations/transitions';

import { useLoginPageViewModel, type LoginFormData } from '@/features/auth/viewModels/LoginPageViewModel';

/**
 * ログイン画面。
 *
 * ViewModel から受け取った値のみを使い、ロジックを持たない View 層。
 */
export function LoginPage() {
  const { onSubmit } = useLoginPageViewModel();

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