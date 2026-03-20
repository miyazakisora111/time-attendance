import type { TeamMembersResponse } from '@/__generated__/model';
import type { TeamMember, MemberStatus } from '@/domain/team/types';
import type { Mapper } from "@/shared/mapper/types";

export const toTeamMembers: Mapper<
  TeamMembersResponse,
  TeamMember[]
> = (response) =>
    response.members.map((member) => ({
      ...member,
      status: member.status as MemberStatus,
      clockInTime: member.clockInTime ?? null,
    }));


