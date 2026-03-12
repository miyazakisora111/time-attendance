import { useState } from 'react';
import { toast } from 'sonner';
import type { AttendanceRequest } from '@/domain/enums/approval';

const MOCK_MY_REQUESTS: AttendanceRequest[] = [
  { id: '1', type: 'leave', title: '有給休暇申請', applicant: '田中 太郎', date: '2026/02/20', status: 'pending', comment: '私用のため' },
  { id: '2', type: 'overtime', title: '残業申請', applicant: '田中 太郎', date: '2026/02/15', status: 'approved', comment: 'プロジェクト資料作成のため2時間延長' },
  { id: '3', type: 'correction', title: '打刻修正申請', applicant: '田中 太郎', date: '2026/02/10', status: 'rejected', comment: '09:00に出勤したが打刻忘れ' },
];

const MOCK_TEAM_REQUESTS: AttendanceRequest[] = [
  { id: '101', type: 'leave', title: '有給休暇申請', applicant: '佐藤 花子', date: '2026/02/25', status: 'pending', comment: '家族の行事のため' },
  { id: '102', type: 'overtime', title: '残業申請', applicant: '鈴木 一郎', date: '2026/02/17', status: 'pending', comment: 'クライアント対応の遅延' },
  { id: '103', type: 'business-trip', title: '出張申請', applicant: '伊藤 結衣', date: '2026/03/01', status: 'pending', comment: '大阪支社への定期訪問' },
];

export const useApproval = () => {
  const [activeTab, setActiveTab] = useState<'my' | 'team'>('my');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const requests = activeTab === 'my' ? MOCK_MY_REQUESTS : MOCK_TEAM_REQUESTS;
  
  const filteredRequests = requests.filter(request => 
    request.title.includes(searchQuery) || 
    request.applicant.includes(searchQuery)
  );

  const handleApprove = (_id: string) => {
    toast.success('申請を承認しました');
  };

  const handleReject = (_id: string) => {
    toast.error('申請を却下しました');
  };

  return {
    activeTab,
    setActiveTab,
    isModalOpen,
    setIsModalOpen,
    searchQuery,
    setSearchQuery,
    filteredRequests,
    handleApprove,
    handleReject,
    teamPendingCount: MOCK_TEAM_REQUESTS.filter(r => r.status === 'pending').length,
  };
};
