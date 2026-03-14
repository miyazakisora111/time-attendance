import { Outlet } from "react-router-dom";

export const PublicLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <main className="flex flex-1 items-center justify-center p-8">
                <Outlet />
            </main>
        </div>
    );
};