import React, { useState } from 'react';
import { UserRole } from '../../types';
import { notificationService } from '../../services/notificationEngine';
import { NotificationDrawer } from '../modals/NotificationDrawer';
import { Car, Wrench, ShieldAlert, Sparkles, TrendingUp, Bell } from 'lucide-react';

interface TopBarProps {
  currentRole: UserRole;
  currentTab: 'MAIN' | 'ANALYTICS';
  onRoleChange: (role: UserRole) => void;
  onTabChange: (tab: 'MAIN' | 'ANALYTICS') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRole,
  currentTab,
  onRoleChange,
  onTabChange
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notificationService.getUnreadCount(currentRole === 'SOCIETY_MANAGER' ? 'ADMIN' : currentRole);

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(9, 13, 20, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--color-border-subtle)',
          padding: '10px 16px'
        }}
      >
        <div
          style={{
            maxWidth: '1380px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(59, 130, 246, 0.5)'
              }}
            >
              <Sparkles size={18} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
                  AuraCar
                </span>
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    backgroundColor: 'var(--color-bg-elevated)',
                    color: 'var(--color-brand-primary)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-brand-border)'
                  }}
                >
                  OS
                </span>
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                Residential Society Fleet
              </div>
            </div>
          </div>

          {/* Role & Analytics Switcher */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--color-bg-surface)',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-default)',
              gap: '2px'
            }}
          >
            <button
              onClick={() => { onTabChange('MAIN'); onRoleChange('CUSTOMER'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentTab === 'MAIN' && currentRole === 'CUSTOMER' ? 'var(--color-brand-primary)' : 'transparent',
                color: currentTab === 'MAIN' && currentRole === 'CUSTOMER' ? '#ffffff' : 'var(--color-text-secondary)'
              }}
            >
              <Car size={14} />
              Customer
            </button>

            <button
              onClick={() => { onTabChange('MAIN'); onRoleChange('PROVIDER'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentTab === 'MAIN' && currentRole === 'PROVIDER' ? '#10B981' : 'transparent',
                color: currentTab === 'MAIN' && currentRole === 'PROVIDER' ? '#090D14' : 'var(--color-text-secondary)'
              }}
            >
              <Wrench size={14} />
              Provider
            </button>

            <button
              onClick={() => { onTabChange('MAIN'); onRoleChange('ADMIN'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentTab === 'MAIN' && currentRole === 'ADMIN' ? '#F59E0B' : 'transparent',
                color: currentTab === 'MAIN' && currentRole === 'ADMIN' ? '#090D14' : 'var(--color-text-secondary)'
              }}
            >
              <ShieldAlert size={14} />
              Operations
            </button>

            <button
              onClick={() => onTabChange('ANALYTICS')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentTab === 'ANALYTICS' ? '#8B5CF6' : 'transparent',
                color: currentTab === 'ANALYTICS' ? '#ffffff' : 'var(--color-text-secondary)'
              }}
            >
              <TrendingUp size={14} />
              Growth & Density
            </button>
          </div>

          {/* Right Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setShowNotifications(true)}
              style={{
                position: 'relative',
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#EF4444',
                    color: '#ffffff',
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--color-bg-base)'
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <NotificationDrawer
        currentRole={currentRole}
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};
