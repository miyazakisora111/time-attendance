import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, UserPlus, Search, MoreVertical, Mail, 
  Building2, CheckCircle2, Clock, Coffee, XCircle, 
  ChevronRight 
} from 'lucide-react';
import { Card, CardContent, Button, Typography, Badge } from '@/shared/components';
import type { TeamMember, MemberStatus } from '@/domain/enums/team';

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

const getStatusBadge = (status: MemberStatus) => {
  switch (status) {
    case 'working':
      return { label: '勤務中', intent: 'success' as const, icon: CheckCircle2 };
    case 'break':
      return { label: '休憩中', intent: 'warning' as const, icon: Coffee };
    case 'leave':
      return { label: '休暇', intent: 'primary' as const, icon: Clock };
    default:
      return { label: '未出勤', intent: 'default' as const, icon: XCircle };
  }
};

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
    <div className="space-y-8">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '全メンバー', value: stats.total, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
          { label: '勤務中', value: stats.working, icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50' },
          { label: '休憩中', value: stats.break, icon: Coffee, color: 'text-amber-600', bgColor: 'bg-amber-50' },
          { label: '休暇・欠勤', value: stats.leave, icon: XCircle, color: 'text-gray-400', bgColor: 'bg-gray-50' },
        ].map((stat, i) => (
          <Card key={i} variant="elevated" padding="lg" className="border-none group">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="small" intent="muted" className="mb-1">{stat.label}</Typography>
                <Typography variant="h2" className="text-3xl font-black text-gray-900">{stat.value}</Typography>
              </div>
              <div className={`p-3 rounded-2xl ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
        <div className="p-8 border-b border-gray-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Typography variant="h2" className="text-2xl font-bold text-gray-900">メンバーリスト</Typography>
              <div className="flex gap-1">
                {departments.map((dept) => (
                  <Button
                    key={dept}
                    variant={filterDept === dept ? "solid" : "ghost"}
                    intent={filterDept === dept ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setFilterDept(dept)}
                    className="px-4 py-1.5 rounded-full shadow-lg shadow-blue-100/20"
                  >
                    <Typography variant="label" className={filterDept === dept ? "text-white" : "text-gray-500"}>
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
                  className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                />
              </div>
              <Button variant="solid" intent="primary" className="rounded-xl gap-2 px-6">
                <UserPlus size={18} />
                <Typography variant="label">招待</Typography>
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4"><Typography variant="label" className="text-xs text-gray-400 uppercase tracking-wider">メンバー</Typography></th>
                  <th className="px-6 py-4"><Typography variant="label" className="text-xs text-gray-400 uppercase tracking-wider">部署 / 役職</Typography></th>
                  <th className="px-6 py-4"><Typography variant="label" className="text-xs text-gray-400 uppercase tracking-wider">ステータス</Typography></th>
                  <th className="px-6 py-4"><Typography variant="label" className="text-xs text-gray-400 uppercase tracking-wider">本日の出勤</Typography></th>
                  <th className="px-8 py-4 text-right"><Typography variant="label" className="text-xs text-gray-400 uppercase tracking-wider">アクション</Typography></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredMembers.map((member, index) => {
                  const status = getStatusBadge(member.status);
                  const StatusIcon = status.icon;
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
                            <Typography variant="label" className="text-gray-900 group-hover:text-blue-600 transition-colors">{member.name}</Typography>
                            <Typography variant="small" intent="muted">{member.email}</Typography>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <Typography variant="label" className="inline-flex items-center gap-1.5 text-gray-700">
                            <Building2 size={14} className="text-gray-300" />
                            {member.department}
                          </Typography>
                          <Typography variant="small" className="text-gray-400 mt-0.5">{member.role}</Typography>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge intent={status.intent} className="flex items-center gap-1.5">
                          <StatusIcon size={14} />
                          {status.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        {member.clockInTime ? (
                          <div className="flex flex-col">
                            <Typography variant="label" className="text-sm text-gray-900 tracking-tight tabular-nums">{member.clockInTime}</Typography>
                            <Typography variant="small" className="text-green-500 font-bold uppercase tracking-widest text-[10px]">On Time</Typography>
                          </div>
                        ) : (
                          <Typography variant="small" className="text-gray-300 italic">-</Typography>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-100">
                            <Mail size={18} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100">
                            <MoreVertical size={18} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-blue-500 hover:bg-blue-100">
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
