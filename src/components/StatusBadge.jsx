import React from 'react';
import { Clock, Loader, CheckCircle2 } from 'lucide-react';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    icon: Clock,
    className: 'badge-pending'
  },
  IN_PROGRESS: {
    label: 'In Progress',
    icon: Loader,
    className: 'badge-in-progress'
  },
  COMPLETED: {
    label: 'Completed',
    icon: CheckCircle2,
    className: 'badge-completed'
  }
};

export default function StatusBadge({ status, showIcon = true, size = 'md' }) {
  const normalized = (status || 'PENDING').toUpperCase();
  const config = STATUS_CONFIG[normalized] || STATUS_CONFIG.PENDING;
  const Icon = config.icon;

  const sizeClass = size === 'sm' ? 'badge-sm' : size === 'lg' ? 'badge-lg' : 'badge-md';

  return (
    <span className={`status-badge ${config.className} ${sizeClass}`}>
      {showIcon && <Icon className="badge-icon" size={size === 'sm' ? 12 : 14} />}
      <span>{config.label}</span>
    </span>
  );
}

