import type { UserResponse } from '@/__generated__/model/userResponse';
import type { AuthUser } from '@/domain/auth/types';

export const toAuthUser = (u: UserResponse): AuthUser => ({
    id: u.user.id,
    name: u.user.name,
    email: u.user.email,
    roles: u.user.roles,
    settings: u.user.settings,
});