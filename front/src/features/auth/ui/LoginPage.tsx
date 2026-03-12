import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth/ui/LoginForm';
import { useAuthStore } from '@/features/auth';
import { Card } from "@/shared/components/Card";
import { Container } from "@/shared/components/Container";
import { Typography } from "@/shared/components/Typography";

// 既にログイン時にリダイレクト
const useRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);
};

export default function LoginPage() {
  useRedirect();

  return (
    <Container size="full" tone="blue">
      <Card size="lg">
        <Typography variant="h1" className="mb-4">
          勤怠管理システム
        </Typography>
        <LoginForm />
      </Card>
    </Container>
  );
}