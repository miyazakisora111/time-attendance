import { type UserInfo } from "@/shared/components/sidebar/types";
import { Button } from "@/shared/components";

export default function SidebarUser({
    collapsed,
    user,
    onLogout,
    onProfileClick,
}: {
    collapsed: boolean;
    user: UserInfo;
    onLogout?: () => void;
    onProfileClick?: () => void;
}) {
    return (
        <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                    ) : (
                        <span>{user.name[0]}</span>
                    )}
                </div>
                {!collapsed && (
                    <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        <div className="mt-2 flex gap-2">
                            {onProfileClick && (
                                <Button variant="outline" size="sm" onClick={onProfileClick}>
                                    プロフィール
                                </Button>
                            )}
                            {onLogout && (
                                <Button variant="outline" size="sm" onClick={onLogout}>
                                    ログアウト
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
