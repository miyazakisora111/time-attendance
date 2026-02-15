import { Home, Clock, Calendar, FileText, Users, Settings, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../shared/components/atoms/Button";

const menuItems = [
  { icon: Home, label: "ダッシュボード", href: "#dashboard" },
  { icon: Clock, label: "打刻", href: "#clock" },
  { icon: Calendar, label: "勤怠カレンダー", href: "#calendar" },
  { icon: FileText, label: "申請・承認", href: "#requests" },
  { icon: Users, label: "チーム管理", href: "#team" },
  { icon: Settings, label: "設定", href: "#settings" },
];

export function AttendanceSidebar({ onLogout }: { onLogout?: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("ダッシュボード");

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 z-40 flex flex-col ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-blue-700">
        {!collapsed && (
          <div>
            <span className="text-xl">勤怠管理</span>
            <p className="text-xs text-blue-200">Attendance System</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-blue-200 hover:text-white hover:bg-blue-700 ml-auto"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-6 px-2 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;
            return (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setActiveItem(item.label)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-white text-blue-900"
                      : "text-blue-100 hover:bg-blue-700 hover:text-white"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-blue-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span>田</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">煮干 太郎</p>
              <p className="text-xs text-blue-200 truncate">営業部</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 border-blue-600 text-blue-100 hover:bg-blue-700 hover:text-white"
            onClick={() => onLogout?.()}
          >
            <LogOut size={16} />
            ログアウト
          </Button>
        )}
      </div>
    </aside>
  );
}
