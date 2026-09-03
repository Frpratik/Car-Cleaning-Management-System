import React from 'react';
import { JobStatus, SubscriptionStatus } from '../../types';

interface BadgeProps {
  status: JobStatus | SubscriptionStatus | string;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, label, size = 'md' }) => {
  const getStyle = (st: string) => {
    switch (st) {
      case 'COMPLETED':
      case 'ACTIVE':
        return {
          bg: 'var(--color-status-completed-bg)',
          color: 'var(--color-status-completed)',
          border: 'rgba(16, 185, 129, 0.3)'
        };
      case 'IN_PROGRESS':
        return {
          bg: 'var(--color-status-in-progress-bg)',
          color: 'var(--color-status-in-progress)',
          border: 'rgba(245, 158, 11, 0.3)'
        };
      case 'SCHEDULED':
      case 'ASSIGNED':
        return {
          bg: 'var(--color-status-scheduled-bg)',
          color: 'var(--color-status-scheduled)',
          border: 'rgba(56, 189, 248, 0.3)'
        };
      case 'PAUSED':
        return {
          bg: 'var(--color-status-paused-bg)',
          color: 'var(--color-status-paused)',
          border: 'rgba(168, 85, 247, 0.3)'
        };
      case 'MISSED':
      case 'UNABLE_TO_SERVICE':
      case 'CANCELLED':
        return {
          bg: 'var(--color-status-missed-bg)',
          color: 'var(--color-status-missed)',
          border: 'rgba(239, 68, 68, 0.3)'
        };
      default:
        return {
          bg: 'var(--color-bg-subtle)',
          color: 'var(--color-text-secondary)',
          border: 'var(--color-border-subtle)'
        };
    }
  };

  const currentStyle = getStyle(status);
  const displayLabel = label || status.replace(/_/g, ' ');

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: size === 'sm' ? '2px 8px' : '4px 10px',
        fontSize: size === 'sm' ? '0.75rem' : '0.8125rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        borderRadius: 'var(--radius-full)',
        backgroundColor: currentStyle.bg,
        color: currentStyle.color,
        border: `1px solid ${currentStyle.border}`,
        textTransform: 'uppercase'
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: currentStyle.color
        }}
      />
      {displayLabel}
    </span>
  );
};
