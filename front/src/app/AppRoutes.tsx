import { Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "./layouts/ PublicLayout";
import { PrivateLayout } from "./layouts/PrivateLayout";
// import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { LoginPage } from "@/features/auth/LoginPage";
import { useAuth } from "@/features/auth/useAuth";

export const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={isAuthenticated ? <PrivateLayout /> : <Navigate to="/login" replace />}>
                <Route path="/" element={<DashboardPage />} />
            </Route>
        </Routes>
    );
};
