import React, { useState } from 'react';
import { UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { 
  Sparkles, 
  Shield, 
  Building2, 
  Car, 
  Wrench, 
  ArrowLeft, 
  ArrowRight,
  Lock,
  Phone
} from 'lucide-react';

interface LoginViewProps {
  onLogin: (role: UserRole | 'SUPER_ADMIN') => void;
  onBackToLanding: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onBackToLanding }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | 'SUPER_ADMIN' | null>(null);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const portals = [
    {
      id: 'CUSTOMER' as const,
      title: 'Resident Car Care Hub',
      desc: 'Car owners & apartment residents subscribing to morning maintenance.',
      icon: Car,
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.3)',
      defaultPhone: '9845012345'
    },
    {
      id: 'ADMIN' as const,
      title: 'Society Admin (RWA Portal)',
      desc: 'Facility managers, RWAs & estate directors managing slots and dispatches.',
      icon: Building2,
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.3)',
      defaultPhone: 'admin@society.com'
    },
    {
      id: 'PROVIDER' as const,
      title: 'Cleaner Pro Field App',
      desc: 'On-ground cleaning specialists executing basement walking routes & photo proofs.',
      icon: Wrench,
      color: '#A855F7',
      bg: 'rgba(168, 85, 247, 0.1)',
      border: 'rgba(168, 85, 247, 0.3)',
      defaultPhone: 'cleaner@auracar.com'
    },
    {
      id: 'SUPER_ADMIN' as const,
      title: 'Company Super Admin',
      desc: 'Global SaaS platform control, inbound B2B society leads & tenant provisioning.',
      icon: Shield,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.3)',
      defaultPhone: 'superadmin@auracar.com'
    }
  ];

  const handlePortalSelect = (role: UserRole | 'SUPER_ADMIN') => {
    setSelectedRole(role);
    const portal = portals.find(p => p.id === role);
    if (portal) {
      setPhoneOrEmail(portal.defaultPhone);
      setPassword('••••••••••••');
    }
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(selectedRole || 'CUSTOMER');
    }, 400);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090D14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
      <div style={{ maxWidth: '620px', width: '100%', backgroundColor: '#121824', borderRadius: '18px', border: '1.5px solid #2A3C5D', padding: '36px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <button
            onClick={onBackToLanding}
            style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '0.8125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            <ArrowLeft size={15} /> Back to Public Website
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={14} color="#ffffff" />
            </div>
            <span style={{ fontWeight: 900, fontSize: '0.9375rem', color: '#ffffff' }}>AuraCar OS</span>
          </div>
        </div>

        {!selectedRole ? (
          /* 1. SELECT YOUR PORTAL */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff' }}>Choose Your Portal</h2>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginTop: '6px' }}>
                Select your role to access your dedicated workspace
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {portals.map(p => {
                const IconComponent = p.icon;
                return (
                  <div
                    key={p.id}
                    onClick={() => handlePortalSelect(p.id)}
                    style={{
                      padding: '16px 20px',
                      backgroundColor: '#161F30',
                      borderRadius: '12px',
                      border: '1.5px solid #2A3C5D',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = p.color;
                      e.currentTarget.style.backgroundColor = '#1B263B';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#2A3C5D';
                      e.currentTarget.style.backgroundColor = '#161F30';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: p.bg, border: `1px solid ${p.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.color }}>
                        <IconComponent size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#F8FAFC' }}>{p.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px', maxWidth: '380px' }}>{p.desc}</div>
                      </div>
                    </div>
                    <ArrowRight size={18} color="#94A3B8" />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* 2. AUTHENTICATE INTO SELECTED PORTAL */
          <div>
            <button
              onClick={() => setSelectedRole(null)}
              style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: '0.8125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginBottom: '20px' }}
            >
              ← Choose a different portal
            </button>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff' }}>
                Sign In to {portals.find(p => p.id === selectedRole)?.title}
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginTop: '4px' }}>
                Enter your verified credentials to enter your dashboard
              </p>
            </div>

            <form onSubmit={handleAuthenticate}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                    <Phone size={13} /> PHONE NUMBER OR EMAIL
                  </label>
                  <input
                    type="text"
                    required
                    value={phoneOrEmail}
                    onChange={e => setPhoneOrEmail(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1' }}>
                      <Lock size={13} /> PASSWORD
                    </label>
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Temporary OTP sent to your registered number.'); }} style={{ fontSize: '0.75rem', color: '#3B82F6', textDecoration: 'none' }}>Forgot?</a>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <Button fullWidth size="lg" variant="primary" type="submit" isLoading={isLoading}>
                Sign In & Open Dashboard →
              </Button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
