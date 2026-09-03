import React, { useState } from 'react';
import { UserRole } from '../../types';
import { store } from '../../services/store';
import { notificationService } from '../../services/notificationEngine';
import { NotificationDrawer } from '../modals/NotificationDrawer';
import { 
  Car, 
  Wrench, 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  Bell, 
  Shield, 
  Globe 
} from 'lucide-react';

interface TopBarProps {
  currentRole: UserRole | 'SUPER_ADMIN';
  currentTab: 'MAIN' | 'ANALYTICS';
  onRoleChange: (role: UserRole | 'SUPER_ADMIN') => void;
  onTabChange: (tab: 'MAIN' | 'ANALYTICS') => void;
  onGoToPublic: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRole,
  currentTab,
  onRoleChange,
  onTabChange,
  onGoToPublic
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const roleForNotifs = currentRole === 'SUPER_ADMIN' || currentRole === 'SOCIETY_MANAGER' ? 'ADMIN' : currentRole;
  const unreadCount = notificationService.getUnreadCount(roleForNotifs as any);

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
          {/* Brand Logo & Public Link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                  Multi-Tenant Residential SaaS
                </div>
              </div>
            </div>

            <button
              onClick={onGoToPublic}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 8px',
                fontSize: '0.6875rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Globe size={12} /> Public Site
            </button>
          </div>

          {/* Role & Module Switcher */}
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
              onClick={() => { onTabChange('MAIN'); onRoleChange('SUPER_ADMIN'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentTab === 'MAIN' && currentRole === 'SUPER_ADMIN' ? '#F59E0B' : 'transparent',
                color: currentTab === 'MAIN' && currentRole === 'SUPER_ADMIN' ? '#090D14' : 'var(--color-text-secondary)'
              }}
            >
              <Shield size={13} />
              Super Admin
            </button>

            <button
              onClick={() => { onTabChange('MAIN'); onRoleChange('ADMIN'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentTab === 'MAIN' && currentRole === 'ADMIN' ? '#3B82F6' : 'transparent',
                color: currentTab === 'MAIN' && currentRole === 'ADMIN' ? '#ffffff' : 'var(--color-text-secondary)'
              }}
            >
              <ShieldAlert size={13} />
              Society Admin
            </button>

            <button
              onClick={() => { onTabChange('MAIN'); onRoleChange('CUSTOMER'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentTab === 'MAIN' && currentRole === 'CUSTOMER' ? '#10B981' : 'transparent',
                color: currentTab === 'MAIN' && currentRole === 'CUSTOMER' ? '#090D14' : 'var(--color-text-secondary)'
              }}
            >
              <Car size={13} />
              Resident
            </button>

            <button
              onClick={() => { onTabChange('MAIN'); onRoleChange('PROVIDER'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentTab === 'MAIN' && currentRole === 'PROVIDER' ? '#A855F7' : 'transparent',
                color: currentTab === 'MAIN' && currentRole === 'PROVIDER' ? '#ffffff' : 'var(--color-text-secondary)'
              }}
            >
              <Wrench size={13} />
              Cleaner Pro
            </button>

            <button
              onClick={() => onTabChange('ANALYTICS')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentTab === 'ANALYTICS' ? '#6366F1' : 'transparent',
                color: currentTab === 'ANALYTICS' ? '#ffffff' : 'var(--color-text-secondary)'
              }}
            >
              <TrendingUp size={13} />
              Density Engine
            </button>
          </div>

          {/* Right Action: Clean Slate & Notification Bell */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => {
                if (window.confirm('Wipe all data and reset to a clean production state for end-to-end testing?')) {
                  store.resetToCleanSlate();
                }
              }}
              title="Reset to Clean Slate (0 mock data)"
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                fontSize: '0.6875rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🧹 Reset to Clean Slate
            </button>

            <button
              onClick={() => {
                store.seedRealisticDemo();
              }}
              title="Load Sample Demo Data"
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-secondary)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🔄 Sample Data
            </button>

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
        currentRole={roleForNotifs as any}
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};
