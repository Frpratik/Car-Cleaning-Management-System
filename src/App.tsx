import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { store } from './services/store';
import { TopBar } from './components/navigation/TopBar';
import { PublicLandingPage } from './views/PublicLandingPage';
import { LoginView } from './views/LoginView';
import { SuperAdminView } from './views/SuperAdminView';
import { AdminView } from './views/AdminView';
import { CustomerView } from './views/CustomerView';
import { ProviderView } from './views/ProviderView';

export const App: React.FC = () => {
  // Session State: null = Public Website, 'LOGIN' = Sign In Modal, or UserRole
  const [activeSessionRole, setActiveSessionRole] = useState<UserRole | 'SUPER_ADMIN' | 'LOGIN' | null>(null);
  const [, setTick] = useState(0);

  // Subscribe to reactive store changes
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  const handleLogin = (role: UserRole | 'SUPER_ADMIN') => {
    if (role !== 'SUPER_ADMIN') {
      store.switchRole(role);
    }
    setActiveSessionRole(role);
  };

  const handleSignOut = () => {
    setActiveSessionRole(null);
  };

  const handleOpenLogin = () => {
    setActiveSessionRole('LOGIN');
  };

  // 1. PUBLIC COMMERCIAL LANDING PAGE
  if (activeSessionRole === null) {
    return <PublicLandingPage onOpenLogin={handleOpenLogin} />;
  }

  // 2. AUTHENTICATION & PORTAL SELECTOR
  if (activeSessionRole === 'LOGIN') {
    return (
      <LoginView
        onLogin={handleLogin}
        onBackToLanding={handleSignOut}
      />
    );
  }

  // 3. AUTHENTICATED DEDICATED PORTAL WITH ROLE-ISOLATED TOPBAR
  const societies = store.getSocieties();
  const currentSocietyName = societies[0]?.name;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#090D14' }}>
      {/* Universal Production SaaS Top Bar */}
      <TopBar 
        currentRole={activeSessionRole}
        societyName={currentSocietyName}
        onSignOut={handleSignOut}
        onSwitchPortal={() => setActiveSessionRole('LOGIN')}
      />

      {/* Strict Role-Isolated Workspaces */}
      <main style={{ flex: 1 }}>
        {activeSessionRole === 'SUPER_ADMIN' && <SuperAdminView />}
        {(activeSessionRole === 'ADMIN' || activeSessionRole === 'SOCIETY_MANAGER') && <AdminView />}
        {activeSessionRole === 'CUSTOMER' && <CustomerView />}
        {activeSessionRole === 'PROVIDER' && <ProviderView />}
      </main>
    </div>
  );
};

export default App;
