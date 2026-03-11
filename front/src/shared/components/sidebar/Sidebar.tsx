import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils/style";
import { Button } from "@/shared/components";
import SidebarUser from "@/shared/components/sidebar/SidebarUser";
import type { SidebarMenuItem, UserInfo } from "@/shared/components/sidebar/types";

type SidebarProps = {
    menuItems: SidebarMenuItem[];
    user: UserInfo;
    defaultCollapsed?: boolean;
    onLogout?: () => void;
    onProfileClick?: () => void;
};

function SidebarItem({
    item,
    isActive,
    collapsed,
    onClick,
}: {
    item: SidebarMenuItem;
    isActive: boolean;
    collapsed: boolean;
    onClick: () => void;
}) {
    const Icon = item.icon;
    return (
        <li>
            <a
                href={item.href}
                onClick={onClick}
                title={collapsed ? item.label : undefined}
                className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
                    isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
            >
                <Icon size={20} />
                {!collapsed && <span>{item.label}</span>}
            </a>
        </li>
    );
}

export default function Sidebar({
    menuItems,
    user,
    defaultCollapsed = false,
    onLogout,
    onProfileClick,
}: SidebarProps) {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);
    const [activeItem, setActiveItem] = useState(menuItems[0]?.label || "");

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 z-40",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
                {!collapsed && <span className="text-xl font-bold">勤怠管理</span>}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-gray-400 hover:text-white hover:bg-gray-800 ml-auto"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </Button>
            </div>

            {/* Menu */}
            <nav className="flex-1 py-6 px-2 overflow-y-auto">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.label}
                            item={item}
                            collapsed={collapsed}
                            isActive={activeItem === item.label}
                            onClick={() => setActiveItem(item.label)}
                        />
                    ))}
                </ul>
            </nav>

            {/* User info */}
            <SidebarUser collapsed={collapsed} user={user} onLogout={onLogout} onProfileClick={onProfileClick} />
        </aside>
    );
}
