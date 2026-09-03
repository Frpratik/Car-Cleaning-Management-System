import React from 'react';
import { notificationService, AppNotification } from '../../services/notificationEngine';
import { UserRole } from '../../types';
import { Bell, CheckCheck, X, MessageSquare, Smartphone, Zap } from 'lucide-react';

interface NotificationDrawerProps {
  currentRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  currentRole,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const roleKey = currentRole === 'SOCIETY_MANAGER' ? 'ADMIN' : currentRole;
  const notifs = notificationService.getNotificationsForRole(roleKey);

  const getChannelIcon = (ch: AppNotification['channel']) => {
    switch (ch) {
      case 'WHATSAPP':
        return <MessageSquare size={13} color="#25D366" />;
      case 'SMS':
        return <Smartphone size={13} color="#38BDF8" />;
      case 'PUSH':
        return <Zap size={13} color="#F59E0B" />;
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          width: '100%',
          maxWidth: '380px',
          height: '100%',
          borderLeft: '1px solid var(--color-border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-bg-elevated)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color="var(--color-brand-primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Notification Stream</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => notificationService.markAllAsRead(roleKey)}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <CheckCheck size={14} /> Mark all read
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {notifs.map(n => (
            <div
              key={n.id}
              style={{
                backgroundColor: n.isRead ? 'var(--color-bg-base)' : 'var(--color-bg-elevated)',
                border: `1px solid ${n.isRead ? 'var(--color-border-subtle)' : 'var(--color-border-default)'}`,
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--color-text-primary)' }}>{n.title}</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{n.timestamp}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>{n.message}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                {getChannelIcon(n.channel)}
                <span style={{ textTransform: 'uppercase', fontWeight: 700 }}>{n.channel} Alert</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
