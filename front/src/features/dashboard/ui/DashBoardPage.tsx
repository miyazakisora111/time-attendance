
import { Container } from '@/shared/components/Container';
import { Typography } from '@/shared/components/Typography';
import { MonthlyStatsCard } from './components/MonthlyStatsCard';
import { ClockInOutCard } from './components/ClockInOutCard';
import { MiniCalendar } from './components/MiniCalendar';
import { QuickActionsCard } from './components/QuickActionsCard';
import { RecentRecordsCard } from './components/RecentRecordsCard';
import { ErrorBoundary } from 'react-error-boundary';

export default function DashBoardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Container className="py-8 transition-all duration-300">
        {/* Header */}
        <div className="mb-8">
          <Typography asChild variant="h1" className="mb-2 text-gray-900 tracking-tight">
            <h1>ダッシュボード</h1>
          </Typography>
          <Typography variant="body" className="text-gray-600">
            本日も1日頑張りましょう！
          </Typography>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <ErrorBoundary fallback={<div className="p-4 bg-red-50 text-red-600 rounded">エラーが発生しました</div>}>
             {/* Stats Row */}
             <MonthlyStatsCard />
          </ErrorBoundary>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Clock In/Out */}
            <div className="lg:col-span-1">
              <ErrorBoundary fallback={<div className="p-4 bg-red-50 text-red-600 rounded">エラーが発生しました</div>}>
                <ClockInOutCard />
              </ErrorBoundary>
            </div>

            {/* Right Column - Calendar and Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ErrorBoundary fallback={<div className="p-4 bg-red-50 text-red-600 rounded">エラーが発生しました</div>}>
                  <MiniCalendar />
                </ErrorBoundary>
                <ErrorBoundary fallback={<div className="p-4 bg-red-50 text-red-600 rounded">エラーが発生しました</div>}>
                  <QuickActionsCard />
                </ErrorBoundary>
              </div>
              <ErrorBoundary fallback={<div className="p-4 bg-red-50 text-red-600 rounded">エラーが発生しました</div>}>
                <RecentRecordsCard />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
