export type SidebarMenuItem = {
    label: string;
    href: string;
    icon: React.FC<{ size?: number }>;
};

export type UserInfo = {
    name: string;
    email: string;
    avatar?: string;
};
