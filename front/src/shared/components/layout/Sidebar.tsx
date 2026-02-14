import { Home, Layers, BarChart, Users, Settings, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

const menuItems = [
  { icon: Home, label: "ホーム", href: "#home" },
  { icon: Layers, label: "プロジェクト", href: "#projects" },
  { icon: BarChart, label: "分析", href: "#analytics" },
  { icon: Users, label: "チーム", href: "#team" },
  { icon: Settings, label: "設定", href: "#settings" },
  { icon: HelpCircle, label: "ヘルプ", href: "#help" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("ホーム");

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 z-40 flex flex-col ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        {!collapsed && <span className="text-xl">AppName</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white hover:bg-gray-800 ml-auto"
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
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
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
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span>U</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">ユーザー名</p>
              <p className="text-xs text-gray-400 truncate">user@example.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
