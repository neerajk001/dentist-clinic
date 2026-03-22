import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    scheduled: {
      label: 'Scheduled',
      className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    confirmed: {
      label: 'Confirmed',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    waiting: {
      label: 'Waiting',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    in_treatment: {
      label: 'In Treatment',
      className: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    completed: {
      label: 'Completed',
      className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    no_show: {
      label: 'No Show',
      className: 'bg-orange-100 text-orange-800 border-orange-200',
    },
    cancelled: {
      label: 'Cancelled',
      className: 'bg-red-100 text-red-800 border-red-200',
    },
  };

  const config = statusConfig[status] || statusConfig.scheduled;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
