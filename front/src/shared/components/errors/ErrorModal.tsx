import { useCallback, useEffect, useRef } from 'react';
import { TriangleAlert, X } from 'lucide-react';
import { Button, Typography } from '@/shared/components';
import { useErrorModal } from '@/shared/hooks/useErrorModal';
import { stack } from '@/shared/design-system/layout';

export function ErrorModal() {
	const { isOpen, title, messages, closeError } = useErrorModal();
	const dialogRef = useRef<HTMLDivElement>(null);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				closeError();
			}
		},
		[closeError],
	);

	useEffect(() => {
		if (!isOpen) return;
		document.addEventListener('keydown', handleKeyDown);
		dialogRef.current?.focus();
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, handleKeyDown]);

	if (!isOpen) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-70 flex items-center justify-center bg-black/40 p-4"
			onClick={closeError}
			role="presentation"
		>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="error-modal-title"
				tabIndex={-1}
				className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
					<div className="flex items-start gap-3">
						<div className="mt-0.5 rounded-full bg-red-50 p-2 text-red-600">
							<TriangleAlert size={18} />
						</div>
						<div>
							<Typography variant="h3" unstableClassName="text-lg" id="error-modal-title">
								{title}
							</Typography>
							<Typography variant="small" intent="muted" unstableClassName="mt-1 text-sm">
								以下の内容を確認してください
							</Typography>
						</div>
					</div>
					<button
						type="button"
						onClick={closeError}
						aria-label="エラーモーダルを閉じる"
						className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
					>
						<X size={18} />
					</button>
				</div>

				<div className="max-h-72 overflow-y-auto px-6 py-4">
					<ul className={stack.sm}>
						{messages.map((message, index) => (
							<li
								key={`${message}-${index}`}
								className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700"
							>
								{message}
							</li>
						))}
					</ul>
				</div>

				<div className="flex justify-end border-t border-gray-100 px-6 py-4">
					<Button type="button" onClick={closeError} variant="solid" intent="danger">
						閉じる
					</Button>
				</div>
			</div>
		</div>
	);
}
