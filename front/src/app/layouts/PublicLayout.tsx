import { Outlet } from "react-router-dom";

export const PublicLayout = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 shadow rounded">
                <Outlet />
            </div>
        </div>
    );
};