type ReportStatus = 'assigned' | 'in_progress' | 'completed' | 'rejected';

const statusLabels: Record<ReportStatus, string> = {
    assigned: '已派送',
    in_progress: '製作中',
    completed: '已完成',
    rejected: '被退回'
};

function getStatusLabel(status: ReportStatus): string {
    return statusLabels[status];
}

console.log(getStatusLabel('assigned'));