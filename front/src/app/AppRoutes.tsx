import { Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { PrivateLayout } from "@/layouts/PrivateLayout";
import LoginPage from "@/features/auth/ui/LoginPage";
import { useAuth } from "@/features/auth/model/useAuth";

export const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* デフォルトルート */}
            {/* <Route
                path="/"
                element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
            /> */}

            {/* 公開ページ */}
            <Route element={<PublicLayout />}>
                <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* 認証必須ページ */}
            <Route
                element={
                    isAuthenticated ? <PrivateLayout /> : <Navigate to="/login" replace />
                }
            >
            </Route>


            {/* ワイルドカード 404 */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
    );
};
