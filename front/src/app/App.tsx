import { AttendanceSidebar } from "../features/dashboard/components/AttendanceSidebar";
import { ClockInOutCard } from "../features/dashboard/components/ClockInOutCard";
import { MonthlyStatsCard } from "../features/dashboard/components/MonthlyStatsCard";
import { RecentRecordsCard } from "../features/dashboard/components/RecentRecordsCard";
import { QuickActionsCard } from "../features/dashboard/components/QuickActionsCard";
import { MiniCalendar } from "../features/dashboard/components/MiniCalendar";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <AttendanceSidebar />
      
      <div className="ml-64 transition-all duration-300 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">ダッシュボード</h1>
          <p className="text-gray-600">本日も1日頑張りましょう！</p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Stats Row */}
          <MonthlyStatsCard />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Clock In/Out */}
            <div className="lg:col-span-1">
              <ClockInOutCard />
            </div>

            {/* Right Column - Calendar and Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MiniCalendar />
                <QuickActionsCard />
              </div>
              <RecentRecordsCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
