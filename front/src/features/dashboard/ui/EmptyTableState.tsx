import React from 'react';
import { SearchX } from 'lucide-react';
import { Typography } from '@/shared/components';

interface EmptyTableStateProps {
  title: string;
  description: string;
}

export const EmptyTableState = React.memo(function EmptyTableState({
  title,
  description,
}: EmptyTableStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
        <SearchX size={24} />
      </div>
      <div className="space-y-1">
        <Typography variant="label">{title}</Typography>
        <Typography variant="small" intent="muted">
          {description}
        </Typography>
      </div>
    </div>
  );
});
