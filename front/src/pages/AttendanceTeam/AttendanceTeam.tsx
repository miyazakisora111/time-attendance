import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Mail, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Coffee, 
  XCircle,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Card, CardContent } from "../../shared/components/ui/card";
import { Button } from "../../shared/components/ui/button";
import { ImageWithFallback } from "../../shared/components/figma/ImageWithFallback";

type MemberStatus = "working" | "break" | "off" | "leave";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: MemberStatus;
  clockInTime?: string;
  email: string;
  avatar?: string;
}

const MOCK_TEAM: TeamMember[] = [
  { id: "1", name: "佐藤 花子", role: "マネージャー", department: "営業部", status: "working", clockInTime: "08:52", email: "h.sato@example.com" },
  { id: "2", name: "鈴木 一郎", role: "リーダー", department: "営業部", status: "working", clockInTime: "09:05", email: "i.suzuki@example.com" },
  { id: "3", name: "伊藤 結衣", role: "正社員", department: "開発部", status: "break", clockInTime: "09:30", email: "y.ito@example.com" },
  { id: "4", name: "高橋 健太", role: "正社員", department: "開発部", status: "working", clockInTime: "08:45", email: "k.takahashi@example.com" },
  { id: "5", name: "渡辺 亮", role: "契約社員", department: "営業部", status: "off", email: "r.watanabe@example.com" },
  { id: "6", name: "小林 美咲", role: "正社員", department: "人事部", status: "leave", email: "m.kobayashi@example.com" },
  { id: "7", name: "中村 翼", role: "正社員", department: "開発部", status: "working", clockInTime: "10:15", email: "t.nakamura@example.com" },
  { id: "8", name: "加藤 純一", role: "インターン", department: "開発部", status: "working", clockInTime: "09:00", email: "j.kato@example.com" },
];

export function AttendanceTeam() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("すべて");

  const getStatusBadge = (status: MemberStatus) => {
    switch (status) {
      case "working":
        return { label: "勤務中", color: "text-green-600", bgColor: "bg-green-50", icon: CheckCircle2 };
      case "break":
        return { label: "休憩中", color: "text-amber-600", bgColor: "bg-amber-50", icon: Coffee };
      case "leave":
        return { label: "休暇", color: "text-blue-600", bgColor: "bg-blue-50", icon: Clock };
      default:
        return { label: "未出勤", color: "text-gray-400", bgColor: "bg-gray-50", icon: XCircle };
    }
  };

  const filteredMembers = MOCK_TEAM.filter(member => {
    const matchesSearch = member.name.includes(searchQuery) || member.department.includes(searchQuery);
    const matchesDept = filterDept === "すべて" || member.department === filterDept;
    return matchesSearch && matchesDept;
  });

  const stats = {
    total: MOCK_TEAM.length,
    working: MOCK_TEAM.filter(m => m.status === "working").length,
    break: MOCK_TEAM.filter(m => m.status === "break").length,
    leave: MOCK_TEAM.filter(m => m.status === "leave").length,
  };

  const departments = ["すべて", ...Array.from(new Set(MOCK_TEAM.map(m => m.department)))];

  return (
    <div className="space-y-8">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "全メンバー", value: stats.total, icon: Users, color: "blue" },
          { label: "勤務中", value: stats.working, icon: CheckCircle2, color: "green" },
          { label: "休憩中", value: stats.break, icon: Coffee, color: "amber" },
          { label: "休暇・欠勤", value: stats.leave, icon: XCircle, color: "gray" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
        <div className="p-8 border-b border-gray-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">メンバーリスト</h2>
              <div className="flex gap-1">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setFilterDept(dept)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      filterDept === dept 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {dept}
                  </button>
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
              <Button className="rounded-xl gap-2 bg-gray-900 hover:bg-black text-white px-6">
                <UserPlus size={18} />
                招待
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">メンバー</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">部署 / 役職</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ステータス</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">本日の出勤</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">アクション</th>
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
                            {member.avatar ? (
                              <ImageWithFallback src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <span>{member.name.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{member.name}</p>
                            <p className="text-xs text-gray-400">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700">
                            <Building2 size={14} className="text-gray-300" />
                            {member.department}
                          </span>
                          <span className="text-xs text-gray-400 mt-0.5">{member.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.bgColor} ${status.color}`}>
                          <StatusIcon size={14} />
                          {status.label}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {member.clockInTime ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-gray-900 tracking-tight">{member.clockInTime}</span>
                            <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">On Time</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-300 italic">-</span>
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
          {filteredMembers.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <Users size={40} />
              </div>
              <p className="text-gray-500 font-medium">該当するメンバーが見つかりませんでした</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm p-8 bg-gradient-to-br from-indigo-900 to-blue-900 text-white rounded-[2.5rem]">
          <h4 className="text-xl font-bold mb-2">チームの稼働状況レポート</h4>
          <p className="text-blue-200 text-sm mb-6 leading-relaxed">
            今週のチーム全体の出勤率は98.5%で、先週に比べて1.2%向上しています。開発部で残業時間が増加傾向にあります。
          </p>
          <Button className="bg-white/10 hover:bg-white/20 text-white border-none rounded-xl gap-2 backdrop-blur-md">
            詳細レポートを見る
            <ExternalLink size={16} />
          </Button>
        </Card>

        <Card className="border-none shadow-sm p-8 bg-blue-50 rounded-[2.5rem]">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">近日公開の機能</h4>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                メンバーごとの詳細な勤務パターン分析と、AIによるリソース最適化アドバイス機能がまもなく利用可能になります。
              </p>
              <div className="flex -space-x-3 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200" />
                ))}
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white">
                  +12
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-600">
              <Users size={32} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
