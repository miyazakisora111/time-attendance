import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/shared/components/sidebar/Sidebar";
import { type SidebarMenuItem } from "@/shared/components/sidebar/types";
import { Home, Clock, Calendar, FileText, Users, Settings } from "lucide-react";
import { cn } from "@/shared/utils/style";
import { AppRoutePath } from "@/config/routes";

// 仮のログイン情報
const user = {
    name: "TODO",
    email: "taro@example.com",
    avatar: undefined,
};

const defaultMenuItems: SidebarMenuItem[] = [
    { icon: Home, label: "ダッシュボード", href: AppRoutePath.Dashboard },
    { icon: Clock, label: "打刻", href: AppRoutePath.Attendance },
    { icon: Calendar, label: "スケジュール", href: AppRoutePath.Schedule },
    { icon: FileText, label: "申請・承認", href: AppRoutePath.Approval },
    { icon: Users, label: "チーム管理", href: AppRoutePath.Team },
    { icon: Settings, label: "設定", href: AppRoutePath.Settings },
];

/**
 * 認証後画面の共通レイアウト。
 */
export const PrivateLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    /**
     * ログアウトイベントを受け取る。
     */
    const handleLogout = () => {
        console.log("ログアウト処理");
    };

    /**
     * プロフィール編集イベントを受け取る。
     */
    const handleProfileClick = () => {
        console.log("プロフィール編集");
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className={cn(
                "transition-all duration-300",
                sidebarCollapsed ? "w-20" : "w-64"
            )}>
                <Sidebar
                    user={user}
                    menuItems={defaultMenuItems}
                    isCollapsed={sidebarCollapsed}
                    onToggle={setSidebarCollapsed}
                    onLogout={handleLogout}
                    onProfileClick={handleProfileClick}
                />
            </div>
            
            <main className="flex-1 overflow-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};
