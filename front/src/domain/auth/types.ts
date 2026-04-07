export type AuthUser = {
    id: string;
    name: string;
    email: string;
    roles: string[];
    settings?: Record<string, unknown> | null;
};