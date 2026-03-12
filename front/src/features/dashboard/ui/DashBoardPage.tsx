
import { Container } from '@/shared/components/Container';
import { Typography } from '@/shared/components/Typography';
import { MonthlyStatsCard } from './components/MonthlyStatsCard';
import { ClockInOutCard } from './components/ClockInOutCard';
import { MiniCalendar } from './components/MiniCalendar';
import { QuickActionsCard } from './components/QuickActionsCard';
import { RecentRecordsCard } from './components/RecentRecordsCard';

export default function DashBoardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Container className="py-8 transition-all duration-300">
        <div className="mb-8">
          <Typography asChild variant="h1" className="mb-2">ダッシュボード</Typography>
          <Typography variant="body">本日も1日頑張りましょう！</Typography>
        </div>
        <div className="space-y-6">
          <MonthlyStatsCard />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ClockInOutCard />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MiniCalendar />
                <QuickActionsCard />
              </div>
              <RecentRecordsCard />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
