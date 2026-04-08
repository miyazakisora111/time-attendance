import { Container, Typography } from '@/shared/components';

export function SettingsPage() {
    return (
        <Container size="lg" unstableClassName="py-8">
            <Typography asChild variant="h1">
                <h1>設定</h1>
            </Typography>
            <Typography variant="body" intent="muted">
                準備中です。
            </Typography>
        </Container>
    );
}
