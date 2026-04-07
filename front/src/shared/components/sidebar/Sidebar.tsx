
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils/style";
import { Button } from "@/shared/components";
import SidebarUser from "@/shared/components/sidebar/SidebarUser";
import type { SidebarMenuItem, UserInfo } from "@/shared/components/sidebar/types";

export interface SidebarProps {
    menuItems: SidebarMenuItem[];
    user: UserInfo;
    isCollapsed?: boolean;
    onToggle?: (collapsed: boolean) => void;
    onLogout?: () => void;
    onProfileClick?: () => void;
}

function SidebarItem({
    item,
    isActive,
    collapsed,
}: {
    item: SidebarMenuItem;
    isActive: boolean;
    collapsed: boolean;
}) {
    const Icon = item.icon;
    return (
        <li>
            <Link
                to={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
                    isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
            >
                <Icon size={20} />
                {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
            </Link>
        </li>
    );
}

export default function Sidebar({
    menuItems,
    user,
    isCollapsed = false,
    onToggle,
    onLogout,
    onProfileClick,
}: SidebarProps) {
    const collapsed = isCollapsed;
    const location = useLocation();

    const handleToggle = () => {
        onToggle?.(!collapsed);
    };

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 z-40",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Header */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-gray-800">
                {!collapsed && <span className="text-xl font-bold bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">勤怠管理</span>}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggle}
                    unstableClassName="text-gray-500 hover:text-white hover:bg-gray-800 ml-auto rounded-xl"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </Button>
            </div>

            {/* Menu */}
            <nav className="flex-1 py-8 px-4 overflow-y-auto">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.label}
                            item={item}
                            collapsed={collapsed}
                            isActive={location.pathname === item.href}
                        />
                    ))}
                </ul>
            </nav>

            {/* User info */}
            <SidebarUser collapsed={collapsed} user={user} onLogout={onLogout} onProfileClick={onProfileClick} />
        </aside>
    );
}
