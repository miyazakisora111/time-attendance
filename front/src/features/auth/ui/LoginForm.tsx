import { useEffect } from 'react';
import { useNavigate, useLocation, type Location } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from '@/shared/components/forms/FormProvider';
import { useAuth } from '@/features/auth';
import { getCsrfToken } from '@/api/client';
import type { LoginFormData } from '@/features/auth';
import { SubmitButton, Input, RadioGroup, Select, Switch } from '@/shared/components';

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useAuth().login;

  // ログイン後のリダイレクト
  useEffect(() => {
    if (loginMutation.isSuccess) {
      const from = (location.state as { from: Location })?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [loginMutation.isSuccess, navigate, location]);

  const onSubmit = async (data: LoginFormData) => {
    // CSRF トークン取得
    await getCsrfToken();

    // ログイン実行
    await loginMutation.mutateAsync(data);
  };

  return (
    <FormProvider<LoginFormData>
      formOptions={{
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
          email: 'test@test.com',
          password: 'Password@1',
        },
      }}
      onSubmit={onSubmit}
      className="space-y-4 max-w-md mx-auto"
    >
      <Input label="メールアドレス" name="email" type="email" placeholder="test@test.com" />
      <Input label="パスワード" name="password" type="password" placeholder="Password@1" />
      <SubmitButton className="w-full">ログイン</SubmitButton>
      <RadioGroup
        name="test"
        label="RadioGroup"
        options={[
          { label: "選択1", value: "value1" },
          { label: "選択2", value: "value2" },
          { label: "選択3", value: "value3" },
        ]}
        className="flex-row"
      >
      </RadioGroup>
      <Select label="Select" name="email" options={[
        { label: "選択1", value: "value1" },
        { label: "選択2", value: "value2" },
        { label: "選択3", value: "value3" },
      ]}>
      </Select>
      <Switch label="Select" name="email">
      </Switch>
    </FormProvider>
  );
}
