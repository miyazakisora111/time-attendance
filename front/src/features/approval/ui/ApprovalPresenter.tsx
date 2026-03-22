import React from 'react';
import {
    Card, CardHeader, CardTitle, CardContent,
    Button, Badge, Typography, Input,
} from '@/shared/components';
import { Plane, Clock, Plus, Check, X, RotateCcw, Ban, ClipboardList } from 'lucide-react';
import type {
    PaidLeaveRequestItem,
    OvertimeRequestItem,
    PaidLeaveSummary,
    ApprovalTab,
} from '@/domain/approval/types';
import type { CreatePaidLeaveRequest, CreateOvertimeRequest } from '@/__generated__/model';

type Props = {
    readonly activeTab: ApprovalTab;
    readonly setActiveTab: (tab: ApprovalTab) => void;
    readonly paidLeaveRequests: readonly PaidLeaveRequestItem[];
    readonly overtimeRequests: readonly OvertimeRequestItem[];
    readonly pendingPaidLeaveRequests: readonly PaidLeaveRequestItem[];
    readonly pendingOvertimeRequests: readonly OvertimeRequestItem[];
    readonly isApprover: boolean;
    readonly paidLeaveSummary: PaidLeaveSummary;
    readonly showPaidLeaveForm: boolean;
    readonly setShowPaidLeaveForm: (v: boolean) => void;
    readonly showOvertimeForm: boolean;
    readonly setShowOvertimeForm: (v: boolean) => void;
    readonly isMutating: boolean;
    readonly onCreatePaidLeave: (p: CreatePaidLeaveRequest) => void;
    readonly onApprovePaidLeave: (id: string) => void;
    readonly onRejectPaidLeave: (id: string) => void;
    readonly onCancelPaidLeave: (id: string) => void;
    readonly onCreateOvertime: (p: CreateOvertimeRequest) => void;
    readonly onApproveOvertime: (id: string) => void;
    readonly onReturnOvertime: (id: string) => void;
    readonly onCancelOvertime: (id: string) => void;
};

const STATUS_LABELS: Record<string, string> = {
    pending: '申請中',
    approved: '承認済',
    rejected: '却下',
    returned: '差戻し',
    canceled: 'キャンセル',
};

const STATUS_VARIANT: Record<string, 'default' | 'info' | 'success' | 'warning' | 'danger'> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    returned: 'info',
    canceled: 'default',
};

const TAB_ITEMS: { key: ApprovalTab; label: string; approverOnly?: boolean }[] = [
    { key: 'paid_leave', label: '有給休暇' },
    { key: 'overtime', label: '残業申請' },
    { key: 'pending', label: '承認待ち', approverOnly: true },
];

const PaidLeaveSummaryCard: React.FC<{ summary: PaidLeaveSummary }> = ({ summary }) => (
    <Card>
        <CardContent>
            <div className="grid grid-cols-3 gap-4 py-2">
                <div className="text-center">
                    <Typography variant="caption" color="muted">付与日数</Typography>
                    <Typography variant="h3">{summary.totalDays}</Typography>
                </div>
                <div className="text-center">
                    <Typography variant="caption" color="muted">使用済み</Typography>
                    <Typography variant="h3">{summary.usedDays}</Typography>
                </div>
                <div className="text-center">
                    <Typography variant="caption" color="muted">残日数</Typography>
                    <Typography variant="h3" color="primary">{summary.remainingDays}</Typography>
                </div>
            </div>
        </CardContent>
    </Card>
);

const PaidLeaveFormCard: React.FC<{
    isMutating: boolean;
    onSubmit: (p: CreatePaidLeaveRequest) => void;
    onCancel: () => void;
}> = ({ isMutating, onSubmit, onCancel }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSubmit({
            leave_date: fd.get('leave_date') as string,
            days: Number(fd.get('days')),
            reason: (fd.get('reason') as string) || undefined,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>有給休暇申請</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">取得日</label>
                        <Input type="date" name="leave_date" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">日数</label>
                        <select name="days" className="w-full border rounded-md p-2" defaultValue="1">
                            <option value="1">1日</option>
                            <option value="0.5">半日</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">理由</label>
                        <Input type="text" name="reason" placeholder="任意" />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" type="button" onClick={onCancel}>キャンセル</Button>
                        <Button variant="solid" type="submit" disabled={isMutating}>申請</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

const OvertimeFormCard: React.FC<{
    isMutating: boolean;
    onSubmit: (p: CreateOvertimeRequest) => void;
    onCancel: () => void;
}> = ({ isMutating, onSubmit, onCancel }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSubmit({
            work_date: fd.get('work_date') as string,
            start_time: fd.get('start_time') as string,
            end_time: fd.get('end_time') as string,
            reason: (fd.get('reason') as string) || undefined,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>残業申請</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">勤務日</label>
                        <Input type="date" name="work_date" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">開始時刻</label>
                            <Input type="datetime-local" name="start_time" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">終了時刻</label>
                            <Input type="datetime-local" name="end_time" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">理由</label>
                        <Input type="text" name="reason" placeholder="任意" />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" type="button" onClick={onCancel}>キャンセル</Button>
                        <Button variant="solid" type="submit" disabled={isMutating}>申請</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export const ApprovalPresenter = React.memo<Props>(function ApprovalPresenter(props) {
    const {
        activeTab, setActiveTab,
        paidLeaveRequests, overtimeRequests, paidLeaveSummary,
        pendingPaidLeaveRequests, pendingOvertimeRequests, isApprover,
        showPaidLeaveForm, setShowPaidLeaveForm,
        showOvertimeForm, setShowOvertimeForm,
        isMutating,
        onCreatePaidLeave, onApprovePaidLeave, onRejectPaidLeave, onCancelPaidLeave,
        onCreateOvertime, onApproveOvertime, onReturnOvertime, onCancelOvertime,
    } = props;

    const visibleTabs = TAB_ITEMS.filter((t) => !t.approverOnly || isApprover);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Typography variant="h2">申請・承認</Typography>
                {activeTab === 'paid_leave' && (
                    <Button variant="solid" size="sm" onClick={() => setShowPaidLeaveForm(true)}>
                        <Plus className="w-4 h-4 mr-1" />有給申請
                    </Button>
                )}
                {activeTab === 'overtime' && (
                    <Button variant="solid" size="sm" onClick={() => setShowOvertimeForm(true)}>
                        <Plus className="w-4 h-4 mr-1" />残業申請
                    </Button>
                )}
            </div>

            {/* タブ */}
            <div className="flex gap-2 border-b">
                {visibleTabs.map((tab) => (
                    <button
                        key={tab.key}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 有給タブ */}
            {activeTab === 'paid_leave' && (
                <div className="space-y-4">
                    <PaidLeaveSummaryCard summary={paidLeaveSummary} />

                    {showPaidLeaveForm && (
                        <PaidLeaveFormCard
                            isMutating={isMutating}
                            onSubmit={onCreatePaidLeave}
                            onCancel={() => setShowPaidLeaveForm(false)}
                        />
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle unstableClassName="flex items-center gap-2">
                                <Plane className="w-5 h-5 text-blue-600" />申請一覧
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {paidLeaveRequests.length === 0 ? (
                                <Typography color="muted">申請はありません</Typography>
                            ) : (
                                <div className="divide-y">
                                    {paidLeaveRequests.map((r) => (
                                        <div key={r.id} className="py-3 flex items-center justify-between">
                                            <div>
                                                <Typography variant="body">
                                                    {r.leaveDate} ({r.days === 1 ? '1日' : '半日'})
                                                </Typography>
                                                {r.reason && (
                                                    <Typography variant="caption" color="muted">{r.reason}</Typography>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={STATUS_VARIANT[r.status] ?? 'default'}>
                                                    {STATUS_LABELS[r.status] ?? r.status}
                                                </Badge>
                                                {r.status === 'pending' && (
                                                    <Button size="sm" variant="outline" onClick={() => onCancelPaidLeave(r.id)}>
                                                        <Ban className="w-3 h-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* 残業タブ */}
            {activeTab === 'overtime' && (
                <div className="space-y-4">
                    {showOvertimeForm && (
                        <OvertimeFormCard
                            isMutating={isMutating}
                            onSubmit={onCreateOvertime}
                            onCancel={() => setShowOvertimeForm(false)}
                        />
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle unstableClassName="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-amber-600" />残業申請一覧
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {overtimeRequests.length === 0 ? (
                                <Typography color="muted">申請はありません</Typography>
                            ) : (
                                <div className="divide-y">
                                    {overtimeRequests.map((r) => (
                                        <div key={r.id} className="py-3 flex items-center justify-between">
                                            <div>
                                                <Typography variant="body">
                                                    {r.workDate} ({r.durationHours}h)
                                                </Typography>
                                                {r.reason && (
                                                    <Typography variant="caption" color="muted">{r.reason}</Typography>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={STATUS_VARIANT[r.status] ?? 'default'}>
                                                    {STATUS_LABELS[r.status] ?? r.status}
                                                </Badge>
                                                {r.status === 'pending' && (
                                                    <Button size="sm" variant="outline" onClick={() => onCancelOvertime(r.id)}>
                                                        <Ban className="w-3 h-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* 承認待ちタブ（承認者のみ） */}
            {activeTab === 'pending' && isApprover && (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle unstableClassName="flex items-center gap-2">
                                <ClipboardList className="w-5 h-5 text-green-600" />承認待ち有給休暇
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pendingPaidLeaveRequests.length === 0 ? (
                                <Typography color="muted">承認待ちの申請はありません</Typography>
                            ) : (
                                <div className="divide-y">
                                    {pendingPaidLeaveRequests.map((r) => (
                                        <div key={r.id} className="py-3 flex items-center justify-between">
                                            <div>
                                                <Typography variant="body">
                                                    {r.leaveDate} ({r.days === 1 ? '1日' : '半日'})
                                                </Typography>
                                                {r.reason && (
                                                    <Typography variant="caption" color="muted">{r.reason}</Typography>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" variant="outline" onClick={() => onApprovePaidLeave(r.id)}>
                                                    <Check className="w-3 h-3" />
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => onRejectPaidLeave(r.id)}>
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle unstableClassName="flex items-center gap-2">
                                <ClipboardList className="w-5 h-5 text-amber-600" />承認待ち残業申請
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pendingOvertimeRequests.length === 0 ? (
                                <Typography color="muted">承認待ちの申請はありません</Typography>
                            ) : (
                                <div className="divide-y">
                                    {pendingOvertimeRequests.map((r) => (
                                        <div key={r.id} className="py-3 flex items-center justify-between">
                                            <div>
                                                <Typography variant="body">
                                                    {r.workDate} ({r.durationHours}h)
                                                </Typography>
                                                {r.reason && (
                                                    <Typography variant="caption" color="muted">{r.reason}</Typography>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" variant="outline" onClick={() => onApproveOvertime(r.id)}>
                                                    <Check className="w-3 h-3" />
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => onReturnOvertime(r.id)}>
                                                    <RotateCcw className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
});
