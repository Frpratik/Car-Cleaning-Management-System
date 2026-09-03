import React, { useState } from 'react';
import { UserRole } from '../../types';
import { notificationService } from '../../services/notificationEngine';
import { NotificationDrawer } from '../modals/NotificationDrawer';
import { 
  Sparkles, 
  Bell, 
  LogOut, 
  Shield, 
  Building2, 
  Car, 
  Wrench,
  User
} from 'lucide-react';

interface TopBarProps {
  currentRole: UserRole | 'SUPER_ADMIN';
  userName?: string;
  societyName?: string;
  onSignOut: () => void;
  onSwitchPortal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRole,
  userName,
  societyName,
  onSignOut,
  onSwitchPortal
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const roleForNotifs = currentRole === 'SUPER_ADMIN' || currentRole === 'SOCIETY_MANAGER' ? 'ADMIN' : currentRole;
  const unreadCount = notificationService.getUnreadCount(roleForNotifs as any);

  const getRoleConfig = (r: UserRole | 'SUPER_ADMIN') => {
    switch (r) {
      case 'SUPER_ADMIN':
        return { label: 'Platform Super Admin', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', icon: Shield };
      case 'ADMIN':
      case 'SOCIETY_MANAGER':
        return { label: 'Society Admin (RWA)', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)', icon: Building2 };
      case 'PROVIDER':
        return { label: 'Cleaning Specialist', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.12)', icon: Wrench };
      case 'CUSTOMER':
      default:
        return { label: 'Resident Car Owner', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', icon: Car };
    }
  };

  const roleConfig = getRoleConfig(currentRole);
  const RoleIcon = roleConfig.icon;

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: '#0E1420',
          borderBottom: '1px solid #1E2B43',
          padding: '12px 24px'
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          {/* Brand & Portal Context */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 14px rgba(59, 130, 246, 0.4)'
                }}
              >
                <Sparkles size={18} color="#ffffff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 900, fontSize: '1.15rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
                    AuraCar
                  </span>
                  <span
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      backgroundColor: '#1E2B43',
                      color: 'var(--color-brand-primary)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      border: '1px solid #2A3C5D'
                    }}
                  >
                    OS
                  </span>
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>
                  {societyName ? `📍 ${societyName}` : 'Enterprise Multi-Tenant SaaS'}
                </div>
              </div>
            </div>

            {/* Portal Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: roleConfig.bg,
                border: `1px solid ${roleConfig.color}40`,
                color: roleConfig.color,
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              <RoleIcon size={14} />
              <span>{roleConfig.label}</span>
            </div>
          </div>

          {/* Right Controls: Switch Portal, Notifications, User Profile & Sign Out */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            
            {/* Switch Portal Button */}
            <button
              onClick={onSwitchPortal}
              style={{
                backgroundColor: '#161F30',
                border: '1px solid #2A3C5D',
                color: '#CBD5E1',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Switch Portal
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(true)}
              style={{
                position: 'relative',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#161F30',
                border: '1px solid #2A3C5D',
                color: '#CBD5E1',
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
                    border: '2px solid #0E1420'
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px', borderLeft: '1px solid #1E2B43' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#1E2B43',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94A3B8'
                }}
              >
                <User size={16} />
              </div>
              <div style={{ display: 'none', md: 'block' } as any}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#F8FAFC' }}>
                  {userName || (currentRole === 'SUPER_ADMIN' ? 'Platform Director' : currentRole === 'ADMIN' ? 'RWA President' : currentRole === 'PROVIDER' ? 'Ramesh Kumar' : 'Vikram Malhotra')}
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={onSignOut}
              title="Sign Out to Public Site"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <LogOut size={13} />
              Sign Out
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
