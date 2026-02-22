// src/features/auth/ui/ProtectedRoute.tsx
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../model/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing, setIsInitializing } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (isInitializing) {
      setIsInitializing(false);
    }
  }, [isInitializing, setIsInitializing]);

  if (isInitializing) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

  return <>{children}</>;
}
