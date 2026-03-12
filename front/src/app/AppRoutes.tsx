import { Routes, Route, Navigate } from "react-router-dom";
import { PrivateLayout, PublicLayout } from "@/shared/components";
import { useAuth } from "@/features/auth";
import LoginPage from "@/features/auth/ui/LoginPage";
import { DashBoardPage } from "@/features/dashboard";

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
            </Route>

            {/* ワイルドカード 404 */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
    );
};
