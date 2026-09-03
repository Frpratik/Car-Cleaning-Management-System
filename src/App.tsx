import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { store } from './services/store';
import { TopBar } from './components/navigation/TopBar';
import { CustomerView } from './views/CustomerView';
import { ProviderView } from './views/ProviderView';
import { AdminView } from './views/AdminView';
import { AnalyticsView } from './views/AnalyticsView';

export const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [tab, setTab] = useState<'MAIN' | 'ANALYTICS'>('MAIN');
  const [, setTick] = useState(0);

  // Subscribe to reactive store changes
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    store.switchRole(newRole);
    setRole(newRole);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Universal Top Navigation & Sandbox Role/Analytics Switcher */}
      <TopBar 
        currentRole={role} 
        currentTab={tab}
        onRoleChange={handleRoleChange} 
        onTabChange={setTab}
      />

      {/* Surface Switching by Role & Tab */}
      <main style={{ flex: 1 }}>
        {tab === 'ANALYTICS' ? (
          <AnalyticsView />
        ) : (
          <>
            {role === 'CUSTOMER' && <CustomerView />}
            {role === 'PROVIDER' && <ProviderView />}
            {role === 'ADMIN' && <AdminView />}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
