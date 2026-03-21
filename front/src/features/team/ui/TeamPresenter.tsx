import React from 'react';
import { motion } from 'framer-motion';
import {
  Users, UserPlus, Search, MoreVertical, Mail,
  Building2, CheckCircle2, Clock, Coffee, XCircle,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, Button, Typography, Badge } from '@/shared/components';
import { inputVariants } from '@/shared/design-system/variants/input';
import { stack } from '@/shared/design-system/layout';
import type { TeamMember } from '@/domain/team/types';
import { getTeamMemberStatusView } from '@/shared/presentation/team';

interface TeamPresenterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterDept: string;
  setFilterDept: (dept: string) => void;
  filteredMembers: TeamMember[];
  stats: {
    total: number;
    working: number;
    break: number;
    leave: number;
  };
  departments: string[];
}

const teamMemberStatusIconMap = {
  working: CheckCircle2,
  break: Coffee,
  leave: Clock,
  off: XCircle,
} as const;

export const TeamPresenter: React.FC<TeamPresenterProps> = ({
  searchQuery,
  setSearchQuery,
  filterDept,
  setFilterDept,
  filteredMembers,
  stats,
  departments,
}) => {
  return (
    <div className={stack.xl}>
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '全メンバー', value: stats.total, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
          { label: '勤務中', value: stats.working, icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50' },
          { label: '休憩中', value: stats.break, icon: Coffee, color: 'text-amber-600', bgColor: 'bg-amber-50' },
          { label: '休暇・欠勤', value: stats.leave, icon: XCircle, color: 'text-gray-400', bgColor: 'bg-gray-50' },
        ].map((stat, i) => (
          <Card key={i} variant="elevated" padding="lg" unstableClassName="border-none group">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" intent="muted" unstableClassName="mb-1">{stat.label}</Typography>
                <Typography variant="h2" unstableClassName="text-3xl font-black text-gray-900">{stat.value}</Typography>
              </div>
              <div className={`p-3 rounded-2xl ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <Card unstableClassName="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
        <div className="p-8 border-b border-gray-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Typography variant="h2" unstableClassName="text-2xl font-bold text-gray-900">メンバーリスト</Typography>
              <div className="flex gap-1">
                {departments.map((dept) => (
                  <Button
                    key={dept}
                    variant={filterDept === dept ? "solid" : "ghost"}
                    intent={filterDept === dept ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setFilterDept(dept)}
                    unstableClassName="px-4 py-1.5 rounded-full shadow-lg shadow-blue-100/20"
                  >
                    <Typography variant="label" intent={filterDept === dept ? 'white' : 'muted'}>
                      {dept}
                    </Typography>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="名前や部署で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${inputVariants({ variant: 'filled' })} pl-10 w-full md:w-64`}
                />
              </div>
              <Button variant="solid" intent="primary" unstableClassName="rounded-xl gap-2 px-6">
                <UserPlus size={18} />
                <Typography variant="label">招待</Typography>
              </Button>
            </div>
          </div>
        </div>

        <CardContent unstableClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4"><Typography variant="caption">メンバー</Typography></th>
                  <th className="px-6 py-4"><Typography variant="caption">部署 / 役職</Typography></th>
                  <th className="px-6 py-4"><Typography variant="caption">ステータス</Typography></th>
                  <th className="px-6 py-4"><Typography variant="caption">本日の出勤</Typography></th>
                  <th className="px-8 py-4 text-right"><Typography variant="caption">アクション</Typography></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredMembers.map((member, index) => {
                  const status = getTeamMemberStatusView(member.status);
                  const StatusIcon = teamMemberStatusIconMap[member.status];
                  return (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      key={member.id}
                      className="group hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-bold overflow-hidden">
                            <span>{member.name.charAt(0)}</span>
                          </div>
                          <div>
                            <Typography variant="label" unstableClassName="text-gray-900 group-hover:text-blue-600 transition-colors">{member.name}</Typography>
                            <Typography variant="small" intent="muted">{member.email}</Typography>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <Typography variant="label" unstableClassName="inline-flex items-center gap-1.5 text-gray-700">
                            <Building2 size={14} className="text-gray-300" />
                            {member.department}
                          </Typography>
                          <Typography variant="small" unstableClassName="text-gray-400 mt-0.5">{member.role}</Typography>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge intent={status.intent} unstableClassName="flex items-center gap-1.5">
                          <StatusIcon size={14} />
                          {status.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        {member.clockInTime ? (
                          <div className="flex flex-col">
                            <Typography variant="label" unstableClassName="text-sm text-gray-900 tracking-tight tabular-nums">{member.clockInTime}</Typography>
                            <Typography variant="small" unstableClassName="text-green-500 font-bold uppercase tracking-widest text-[10px]">On Time</Typography>
                          </div>
                        ) : (
                          <Typography variant="small" unstableClassName="text-gray-300 italic">-</Typography>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" unstableClassName="h-9 w-9 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-100">
                            <Mail size={18} />
                          </Button>
                          <Button variant="ghost" size="icon" unstableClassName="h-9 w-9 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100">
                            <MoreVertical size={18} />
                          </Button>
                          <Button variant="ghost" size="icon" unstableClassName="h-9 w-9 rounded-xl text-blue-500 hover:bg-blue-100">
                            <ChevronRight size={18} />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
