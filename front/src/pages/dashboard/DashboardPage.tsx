/**
 * ダッシュボードページ コンテナコンポーネント
 */

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NavItem } from '../../shared/types';
import { Card, Text, Badge, Button } from '../../shared/components/atoms';
import { Alert } from '../../shared/components/molecules';
import { MainLayout } from '../../shared/components/organisms';
import { useClockInMutation, useClockOutMutation } from '../../shared/hooks/queries';
import { useAuthStore } from '../../shared/store';
import { formatDate } from '../../shared/utils';

/**
 * DashboardPage コンポーネント
 * メインダッシュボード表示
 */
export function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const clockInMutation = useClockInMutation();
  const clockOutMutation = useClockOutMutation();

  // ナビゲーションアイテム定義
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'ダッシュボード',
      icon: '📊',
      href: '/dashboard',
      active: true,
    },
    {
      id: 'attendance',
      label: '出退勤管理',
      icon: '⏰',
      href: '/attendance',
    },
    {
      id: 'records',
      label: '出退勤記録',
      icon: '📋',
      href: '/records',
    },
    {
      id: 'reports',
      label: 'レポート',
      icon: '📈',
      href: '/reports',
      badge: 'New',
    },
    {
      id: 'settings',
      label: '設定',
      icon: '⚙️',
      href: '/settings',
      children: [
        {
          id: 'profile',
          label: 'プロフィール',
          icon: '👤',
          href: '/settings/profile',
        },
        {
          id: 'security',
          label: 'セキュリティ',
          icon: '🔒',
          href: '/settings/security',
        },
      ],
    },
  ];

  // 今日の出退勤情報を取得（デモ用）
  const todayAttendance = React.useMemo(() => {
    const now = new Date();
    return {
      date: formatDate(now),
      clockInTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 15),
      clockOutTime: null,
      status: 'present',
    };
  }, []);

  // 統計情報（デモ用）
  const stats = [
    { label: '今月の勤務日', value: '18', color: 'primary' as const },
    { label: '今月の休日', value: '8', color: 'secondary' as const },
    { label: '今月の超過勤務', value: '5.5H', color: 'warning' as const },
  ];

  // ログアウトハンドラ
  const handleLogout = useCallback(() => {
    logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  // ナビゲーションクリックハンドラ
  const handleNavItemClick = useCallback((item: NavItem) => {
    if (item.href) {
      navigate(item.href);
    }
  }, [navigate]);

  return (
    <MainLayout
      navItems={navItems}
      headerTitle="ダッシュボード"
      headerSubtitle="本日も1日頑張りましょう！"
      userName={user?.name}
      userAvatar={user?.avatar}
      onLogout={handleLogout}
      onNavItemClick={handleNavItemClick}
    >
      <div className="space-y-6">
        {/* ウェルカムメッセージ */}
        <div className="flex items-center justify-between">
          <div>
            <Text variant="h2" weight="bold" className="mb-1">
              ダッシュボード
            </Text>
            <Text variant="body" color="secondary">
              本日の勤務状況を確認してください
            </Text>
          </div>
          <Badge variant="success" size="lg">
            出勤中
          </Badge>
        </div>

        {/* 情報通知 */}
        <Alert
          type="info"
          title="お知らせ"
          description="今月のレポートが生成されました。詳細はレポート画面からご確認ください。"
          closable
        />

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} variant="default" padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <Text variant="caption" color="secondary" className="mb-1">
                    {stat.label}
                  </Text>
                  <Text variant="h3" weight="bold">
                    {stat.value}
                  </Text>
                </div>
                <Badge variant={stat.color as any} filled>
                  →
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* メイングリッド */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左カラム - 出退勤操作 */}
          <div className="lg:col-span-1">
            <Card variant="elevated" padding="lg">
              <Text variant="h4" weight="bold" className="mb-4">
                出退勤
              </Text>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <Text variant="caption" color="secondary" className="text-blue-600 mb-2">
                    出勤時刻
                  </Text>
                  <Text variant="h3" weight="bold" className="text-blue-900">
                    {formatDate(todayAttendance.clockInTime, 'HH:mm')}
                  </Text>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <Text variant="caption" color="secondary" className="mb-2">
                    退勤時刻
                  </Text>
                  <Text variant="body" className="text-gray-600">
                    未設定
                  </Text>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => clockInMutation.mutate()}
                    loading={clockInMutation.isPending}
                    disabled={clockInMutation.isPending}
                    className="flex-1"
                  >
                    出勤
                  </Button>
                  <Button
                    onClick={() => clockOutMutation.mutate()}
                    loading={clockOutMutation.isPending}
                    disabled={clockOutMutation.isPending}
                    variant="secondary"
                    className="flex-1"
                  >
                    退勤
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* 右カラム - その他情報 */}
          <div className="lg:col-span-2 space-y-6">
            {/* カレンダー */}
            <Card variant="default" padding="lg">
              <Text variant="h4" weight="bold" className="mb-4">
                カレンダー
              </Text>

              <div className="grid grid-cols-7 gap-2">
                {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
                  <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }).map((_, i) => {
                  const day = i + 1;
                  const isToday = day === new Date().getDate();
                  return (
                    <button
                      key={i}
                      className={`p-2 rounded text-sm font-medium transition-colors ${
                        isToday
                          ? 'bg-blue-600 text-white'
                          : day % 2 === 0
                            ? 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {day <= 31 ? day : ''}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* 最近の記録 */}
            <Card variant="default" padding="lg">
              <Text variant="h4" weight="bold" className="mb-4">
                最近の出退勤記録
              </Text>

              <div className="space-y-3">
                {[
                  { date: '2026-02-15 (日)', inTime: '09:15', outTime: '18:30' },
                  { date: '2026-02-14 (土)', inTime: '09:00', outTime: '17:45' },
                  { date: '2026-02-13 (金)', inTime: '09:30', outTime: '19:00' },
                ].map((record) => (
                  <div key={record.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Text variant="sm" weight="medium" className="text-gray-900">
                        {record.date}
                      </Text>
                      <Text variant="caption" color="secondary">
                        {record.inTime} ~ {record.outTime}
                      </Text>
                    </div>
                    <Badge variant="success" size="sm">
                      完了
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
