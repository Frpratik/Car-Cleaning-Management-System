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
import { AnalyticsView } from './views/AnalyticsView';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LANDING' | 'LOGIN' | 'APP'>('APP');
  const [role, setRole] = useState<UserRole | 'SUPER_ADMIN'>('SUPER_ADMIN');
  const [tab, setTab] = useState<'MAIN' | 'ANALYTICS'>('MAIN');
  const [, setTick] = useState(0);

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  const handleRoleChange = (newRole: UserRole | 'SUPER_ADMIN') => {
    if (newRole !== 'SUPER_ADMIN') {
      store.switchRole(newRole);
    }
    setRole(newRole);
  };

  const handleLoginSuccess = (userRole: UserRole | 'SUPER_ADMIN') => {
    handleRoleChange(userRole);
    setViewMode('APP');
  };

  if (viewMode === 'LANDING') {
    return <PublicLandingPage onOpenLogin={() => setViewMode('APP')} />;
  }

  if (viewMode === 'LOGIN') {
    return (
      <LoginView 
        onLogin={handleLoginSuccess} 
        onBackToLanding={() => setViewMode('APP')} 
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Universal Top Navigation */}
      <TopBar 
        currentRole={role} 
        currentTab={tab}
        onRoleChange={handleRoleChange} 
        onTabChange={setTab}
        onGoToPublic={() => setViewMode('LANDING')}
      />

      {/* Surface Switching by Role & Tab */}
      <main style={{ flex: 1 }}>
        {tab === 'ANALYTICS' ? (
          <AnalyticsView />
        ) : (
          <>
            {role === 'SUPER_ADMIN' && <SuperAdminView />}
            {role === 'ADMIN' && <AdminView />}
            {role === 'CUSTOMER' && <CustomerView />}
            {role === 'PROVIDER' && <ProviderView />}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
