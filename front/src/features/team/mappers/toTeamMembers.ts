import type { TeamMembersResponse } from '@/__generated__/model';
import type { TeamMember } from '@/domain/team/types';
import type { TeamMemberStatus } from '@/__generated__/enums';
import type { Mapper } from "@/shared/mapper/types";

export const toTeamMembers: Mapper<
  TeamMembersResponse,
  TeamMember[]
> = (response) =>
    response.members.map((member) => ({
      ...member,
      status: member.status as TeamMemberStatus,
      clockInTime: member.clockInTime ?? null,
    }));


