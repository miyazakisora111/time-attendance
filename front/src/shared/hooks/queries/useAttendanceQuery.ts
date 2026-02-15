/**
 * 出退勤関連のReact Queryカスタムフック
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS } from '../../api/client';
import type { AttendanceRecord, ApiResponse } from '../../types';

// キー定義
export const attendanceQueryKeys = {
  all: ['attendance'] as const,
  lists: () => [...attendanceQueryKeys.all, 'list'] as const,
  list: (userId: string) => [...attendanceQueryKeys.lists(), userId] as const,
  monthly: (userId: string, year: number, month: number) =>
    [...attendanceQueryKeys.all, 'monthly', userId, year, month] as const,
  detail: (id: string) => [...attendanceQueryKeys.all, 'detail', id] as const,
};

// 出勤記録を取得
export function useAttendanceRecordsQuery(userId: string, enabled = true) {
  return useQuery({
    queryKey: attendanceQueryKeys.list(userId),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<AttendanceRecord[]>>(
        API_ENDPOINTS.attendance.records(userId)
      );
      if (!response.success) {
        throw new Error(response.error || '出勤記録の取得に失敗しました');
      }
      return response.data || [];
    },
    enabled,
  });
}

// 月別の出退勤記録を取得
export function useMonthlyAttendanceQuery(
  userId: string,
  year: number,
  month: number,
  enabled = true
) {
  return useQuery({
    queryKey: attendanceQueryKeys.monthly(userId, year, month),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<AttendanceRecord[]>>(
        API_ENDPOINTS.attendance.monthly(year, month)
      );
      if (!response.success) {
        throw new Error(response.error || '月別出勤記録の取得に失敗しました');
      }
      return response.data || [];
    },
    enabled,
  });
}

// 出勤ミューテーション
export function useClockInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<ApiResponse<AttendanceRecord>>(
        API_ENDPOINTS.attendance.clockIn
      );
      if (!response.success) {
        throw new Error(response.error || '出勤記録に失敗しました');
      }
      return response.data;
    },
    onSuccess: () => {
      // 出退勤データを無効化して再取得
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.lists() });
    },
  });
}

// 退勤ミューテーション
export function useClockOutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<ApiResponse<AttendanceRecord>>(
        API_ENDPOINTS.attendance.clockOut
      );
      if (!response.success) {
        throw new Error(response.error || '退勤記録に失敗しました');
      }
      return response.data;
    },
    onSuccess: () => {
      // 出退勤データを無効化して再取得
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.lists() });
    },
  });
}
