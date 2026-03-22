import { Routes, Route, Navigate } from "react-router-dom";
import { PrivateLayout, PublicLayout } from "@/shared/components";
import { LoginPage } from "@/features/auth/ui/LoginPage";
import { useAuth } from "@/features/auth";
import { DashBoardPage } from "@/features/dashboard";
import { AttendancePage } from "@/features/attendance/ui/AttendancePage";
import TeamPage from "@/features/team";
import SettingsPage from "@/features/settings";
import SchedulePage from "@/features/schedule";
import ApprovalPage from "@/features/approval";
import { AppRoutePath } from "@/config/routes";

/**
 * ルーティングコンポーネント。
 */
export const AppRoutes = () => {
    // TODO:後で戻す
    const { isAuthenticated } = useAuth();
    // const isAuthenticated = true;

    return (
        <Routes>
            {/* デフォルトルート */}
            <Route
                path={AppRoutePath.Root}
                element={<Navigate to={isAuthenticated ? AppRoutePath.Dashboard : AppRoutePath.Login} replace />}
            />

            {/* 公開ページ */}
            <Route element={<PublicLayout />}>
                <Route path={AppRoutePath.Login} element={<LoginPage />} />
            </Route>

            {/* 認証必須ページ */}
            <Route element={isAuthenticated ? <PrivateLayout /> : <Navigate to={AppRoutePath.Login} replace />}>
                <Route path={AppRoutePath.Dashboard} element={<DashBoardPage />} />
                <Route path={AppRoutePath.Attendance} element={<AttendancePage />} />
                <Route path={AppRoutePath.Team} element={<TeamPage />} />
                <Route path={AppRoutePath.Settings} element={<SettingsPage />} />
                <Route path={AppRoutePath.Schedule} element={<SchedulePage />} />
                <Route path={AppRoutePath.Approval} element={<ApprovalPage />} />
            </Route>

            {/* ワイルドカード 404 */}
            <Route path={AppRoutePath.Wildcard} element={<Navigate to={isAuthenticated ? AppRoutePath.Dashboard : AppRoutePath.Login} replace />} />
        </Routes>
    );
};
