export type AuthUser = {
    id: string;
    name: string;
    email: string;
    roles: string[];
    settings?: Record<string, unknown> | null;
};

// TODO: OpenAPIで作れる気がする
export type LoginResult = {
    token?: string;
    token_type?: string;
    expires_in?: number;
};