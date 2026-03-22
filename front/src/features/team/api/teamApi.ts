import { getTeam } from '@/__generated__/team/team';
import type { TeamMembersResponse } from '@/__generated__/model';
import { call } from '@/lib/http/result';

const client = getTeam();

/** チームメンバー一覧を取得 */
export const fetchTeamMembers = () =>
  call<TeamMembersResponse>(() => client.getTeamMembersApi());
