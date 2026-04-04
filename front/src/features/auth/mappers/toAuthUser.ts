import type { UserResponse } from '@/__generated__/model/userResponse';
import type { AuthUser } from '@/domain/auth/types';
import type { Mapper } from "@/shared/mapper";

export const toAuthUser: Mapper<UserResponse, AuthUser> = (u) => ({
    ...u,
});