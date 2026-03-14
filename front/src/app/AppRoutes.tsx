import { Routes, Route, Navigate } from "react-router-dom";
import { PrivateLayout, PublicLayout } from "@/shared/components";
import { useAuth } from "@/features/auth";
import { LoginPage } from "@/features/auth/ui/LoginPage";
import { DashBoardPage } from "@/features/dashboard";
import AttendancePage from "@/features/attendance";
//import {ApprovalPage} from "@/features/approval";
import TeamPage from "@/features/team";
import SettingsPage from "@/features/settings";
import SchedulePage from "@/features/schedule";

export const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* デフォルトルート */}
            <Route
                path="/"
                element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
            />

            {/* 公開ページ */}
            <Route element={<PublicLayout />}>
                <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* 認証必須ページ */}
            <Route element={isAuthenticated ? <PrivateLayout /> : <Navigate to="/login" replace />}>
                <Route path="/dashboard" element={<DashBoardPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                {/* <Route path="/approval" element={<ApprovalPage />} /> */}
                <Route path="/team" element={<TeamPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
            </Route>

            {/* ワイルドカード 404 */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
    );
};
