import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileText,
  Calendar,
  MoreVertical,
  ChevronRight,
  User,
  MessageSquare
} from "lucide-react";
import { Card, CardContent } from "../../shared/components/ui/card";
import { Button } from "../../shared/components/ui/button";
import { toast } from "sonner";

type RequestStatus = "pending" | "approved" | "rejected";
type RequestType = "leave" | "overtime" | "correction" | "business-trip";

interface AttendanceRequest {
  id: string;
  type: RequestType;
  title: string;
  applicant: string;
  date: string;
  status: RequestStatus;
  comment?: string;
}

const MOCK_MY_REQUESTS: AttendanceRequest[] = [
  { id: "1", type: "leave", title: "有給休暇申請", applicant: "田中 太郎", date: "2026/02/20", status: "pending", comment: "私用のため" },
  { id: "2", type: "overtime", title: "残業申請", applicant: "田中 太郎", date: "2026/02/15", status: "approved", comment: "プロジェクト資料作成のため2時間延長" },
  { id: "3", type: "correction", title: "打刻修正申請", applicant: "田中 太郎", date: "2026/02/10", status: "rejected", comment: "09:00に出勤したが打刻忘れ" },
];

const MOCK_TEAM_REQUESTS: AttendanceRequest[] = [
  { id: "101", type: "leave", title: "有給休暇申請", applicant: "佐藤 花子", date: "2026/02/25", status: "pending", comment: "家族の行事のため" },
  { id: "102", type: "overtime", title: "残業申請", applicant: "鈴木 一郎", date: "2026/02/17", status: "pending", comment: "クライアント対応の遅延" },
  { id: "103", type: "business-trip", title: "出張申請", applicant: "伊藤 結衣", date: "2026/03/01", status: "pending", comment: "大阪支社への定期訪問" },
];

export function AttendanceRequests() {
  const [activeTab, setActiveTab] = useState<"my" | "team">("my");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusInfo = (status: RequestStatus) => {
    switch (status) {
      case "approved":
        return { label: "承認済み", color: "text-green-600", bgColor: "bg-green-50", icon: CheckCircle2 };
      case "rejected":
        return { label: "却下", color: "text-red-600", bgColor: "bg-red-50", icon: XCircle };
      default:
        return { label: "承認待ち", color: "text-amber-600", bgColor: "bg-amber-50", icon: Clock };
    }
  };

  const getTypeIcon = (type: RequestType) => {
    switch (type) {
      case "leave": return <Calendar className="text-blue-500" size={18} />;
      case "overtime": return <Clock className="text-orange-500" size={18} />;
      case "correction": return <AlertCircle className="text-red-500" size={18} />;
      default: return <FileText className="text-gray-500" size={18} />;
    }
  };

  const handleApprove = (id: string) => {
    toast.success("申請を承認しました");
  };

  const handleReject = (id: string) => {
    toast.error("申請を却下しました");
  };

  const requests = activeTab === "my" ? MOCK_MY_REQUESTS : MOCK_TEAM_REQUESTS;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("my")}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "my" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            自分の申請
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "team" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            承認待ち
            {MOCK_TEAM_REQUESTS.filter(r => r.status === "pending").length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
                {MOCK_TEAM_REQUESTS.filter(r => r.status === "pending").length}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="検索..." 
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full md:w-64"
            />
          </div>
          <Button variant="outline" className="rounded-xl gap-2 border-gray-200">
            <Filter size={16} />
            フィルタ
          </Button>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100"
          >
            <Plus size={16} />
            新規申請
          </Button>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {requests.map((request, index) => {
          const status = getStatusInfo(request.status);
          const StatusIcon = status.icon;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={request.id}
            >
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 p-5">
                    {/* Icon & Title */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {getTypeIcon(request.type)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-0.5">{request.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {request.applicant}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {request.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Comment */}
                    <div className="hidden lg:flex items-start gap-2 max-w-xs flex-1">
                      <MessageSquare size={14} className="text-gray-300 mt-0.5" />
                      <p className="text-xs text-gray-500 line-clamp-2 italic">
                        {request.comment || "コメントなし"}
                      </p>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                      <div className={`px-3 py-1.5 rounded-full ${status.bgColor} ${status.color} flex items-center gap-1.5 text-xs font-bold`}>
                        <StatusIcon size={14} />
                        {status.label}
                      </div>

                      <div className="flex items-center gap-2">
                        {activeTab === "team" && request.status === "pending" ? (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleApprove(request.id)}
                              className="h-9 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs"
                            >
                              承認
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleReject(request.id)}
                              className="h-9 px-4 border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs"
                            >
                              却下
                            </Button>
                          </>
                        ) : (
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 rounded-lg">
                            <MoreVertical size={18} />
                          </Button>
                        )}
                        <ChevronRight className="text-gray-300 hidden md:block" size={18} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Stats Cards (Bottom) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
        {[
          { label: "今月の有給取得", value: "2.0", unit: "日", color: "blue" },
          { label: "有給残日数", value: "12.5", unit: "日", color: "indigo" },
          { label: "残業申請合計", value: "14", unit: "時間", color: "orange" },
          { label: "未承認の申請", value: "3", unit: "件", color: "red" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm p-5 bg-white">
            <p className="text-xs text-gray-500 font-medium mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-black text-${stat.color}-600`}>{stat.value}</span>
              <span className="text-xs text-gray-400">{stat.unit}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Simple Modal Placeholder */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">新規申請を作成</h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                    <XCircle size={24} className="text-gray-400" />
                  </Button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">申請種別</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["有給休暇", "残業申請", "打刻修正", "振替休日"].map((type) => (
                        <button key={type} className="p-4 border-2 border-gray-100 rounded-2xl text-sm font-medium hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">対象日</label>
                    <input type="date" className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">理由・コメント</label>
                    <textarea 
                      rows={3}
                      placeholder="申請の理由を入力してください"
                      className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-10">
                  <Button variant="outline" className="flex-1 h-12 rounded-xl border-gray-200" onClick={() => setIsModalOpen(false)}>
                    キャンセル
                  </Button>
                  <Button className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100" onClick={() => {
                    toast.success("申請を送信しました");
                    setIsModalOpen(false);
                  }}>
                    申請する
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
