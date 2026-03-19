import React from 'react';
import { SearchX } from 'lucide-react';
import { Typography } from '@/shared/components';

export const TeamEmptyState = React.memo(function TeamEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
        <SearchX size={24} />
      </div>
      <div className="space-y-1">
        <Typography variant="label">該当するメンバーが見つかりません。</Typography>
        <Typography variant="small" intent="muted">
          検索条件または部署フィルタを見直してください。
        </Typography>
      </div>
    </div>
  );
});
