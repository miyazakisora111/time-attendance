import { Outlet } from "react-router-dom";
import Sidebar from "@/shared/components/sidebar/Sidebar";
import { type SidebarMenuItem } from "@/shared/components/sidebar/types";
import { Home, Clock, Calendar, FileText, Users, Settings } from "lucide-react";

// 仮のログイン情報
const user = {
    name: "TODO",
    email: "taro@example.com",
    avatar: undefined,
};

const defaultMenuItems: SidebarMenuItem[] = [
    { icon: Home, label: "ダッシュボード", href: "/dashboard" },
    { icon: Clock, label: "打刻", href: "/clock" },
    { icon: Calendar, label: "勤怠カレンダー", href: "/calendar" },
    { icon: FileText, label: "申請・承認", href: "/requests" },
    { icon: Users, label: "チーム管理", href: "/team" },
    { icon: Settings, label: "設定", href: "/settings" },
];

export const PrivateLayout = () => {
    const handleLogout = () => {
        console.log("ログアウト処理");
    };

    const handleProfileClick = () => {
        console.log("プロフィール編集");
    };

    return (
        <div className="min-h-screen">
            <Sidebar
                user={user}
                menuItems={defaultMenuItems}
                onLogout={handleLogout}
                onProfileClick={handleProfileClick}
            />
            <main>
                <Outlet />
            </main>
        </div>
    );
};
