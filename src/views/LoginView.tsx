import React, { useState } from 'react';
import { UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { Sparkles, Shield, Building2, Car, Wrench, ArrowLeft } from 'lucide-react';

interface LoginViewProps {
  onLogin: (role: UserRole) => void;
  onBackToLanding: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onBackToLanding }) => {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Identify role based on phone/email or fallback to customer
    setTimeout(() => {
      setIsLoading(false);
      if (phoneOrEmail.includes('superadmin') || phoneOrEmail === '9900000000') {
        onLogin('SUPER_ADMIN' as any);
      } else if (phoneOrEmail.includes('admin') || phoneOrEmail === '9900011223') {
        onLogin('ADMIN');
      } else if (phoneOrEmail.includes('prov') || phoneOrEmail === '9845012345') {
        onLogin('PROVIDER');
      } else {
        onLogin('CUSTOMER');
      }
    }, 600);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090D14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#121824', borderRadius: '16px', border: '1.5px solid #2A3C5D', padding: '32px', boxShadow: '0 12px 40px rgba(0,0,0,0.8)' }}>
        
        {/* Back Link */}
        <button
          onClick={onBackToLanding}
          style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '20px' }}
        >
          <ArrowLeft size={14} /> Back to Public Website
        </button>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}>
            <Sparkles size={26} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>AuraCar Portal</h2>
          <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginTop: '4px' }}>Sign in with your verified credentials</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>PHONE OR EMAIL</label>
              <input
                type="text"
                required
                placeholder="e.g. 9845012345 or admin@society.com"
                value={phoneOrEmail}
                onChange={e => setPhoneOrEmail(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1' }}>PASSWORD</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered mobile/email.'); }} style={{ fontSize: '0.75rem', color: '#3B82F6', textDecoration: 'none' }}>Forgot?</a>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <Button fullWidth size="lg" variant="primary" type="submit" isLoading={isLoading}>
            Sign In to Portal
          </Button>
        </form>

        {/* Quick Sandbox Access for Testing */}
        <div style={{ borderTop: '1px solid #1E2B43', paddingTop: '18px' }}>
          <div style={{ fontSize: '0.6875rem', color: '#94A3B8', textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Demo Persona Access
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              onClick={() => onLogin('SUPER_ADMIN' as any)}
              style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #F59E0B', color: '#F59E0B', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Shield size={12} /> Super Admin
            </button>

            <button
              onClick={() => onLogin('ADMIN')}
              style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #3B82F6', color: '#93C5FD', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Building2 size={12} /> Society Admin
            </button>

            <button
              onClick={() => onLogin('CUSTOMER')}
              style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #10B981', color: '#6EE7B7', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Car size={12} /> Resident
            </button>

            <button
              onClick={() => onLogin('PROVIDER')}
              style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #A855F7', color: '#D8B4FE', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Wrench size={12} /> Cleaner Pro
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
