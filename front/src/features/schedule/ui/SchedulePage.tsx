import { Container, Typography } from '@/shared/components';

export function SchedulePage() {
    return (
        <Container size="lg" unstableClassName="py-8">
            <Typography asChild variant="h1">
                <h1>スケジュール</h1>
            </Typography>
            <Typography variant="body" intent="muted">
                準備中です。
            </Typography>
        </Container>
    );
}
