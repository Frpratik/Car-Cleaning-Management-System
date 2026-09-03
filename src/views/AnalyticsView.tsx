import React from 'react';
import { 
  TrendingUp, 
  Building2, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="container-admin" style={{ padding: '24px 32px 80px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <TrendingUp size={16} color="var(--color-brand-primary)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-brand-primary)', letterSpacing: '0.05em' }}>
            UNIT ECONOMICS & DENSITY ENGINE
          </span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Growth & Operational Analytics</h1>
        <p style={{ fontSize: '0.875rem' }}>Society penetration, cleaner route efficiency, cohort retention, and margin analysis.</p>
      </div>

      {/* Top 4 Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>MONTH-2 RETENTION</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>88.4%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Industry Benchmark: 62%</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>BLENDED CAC vs LTV</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginTop: '4px' }}>43.3x</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>CAC: ₹180 • 12M LTV: ₹7,800</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
            <span>CLEANER EFFICIENCY</span>
            <Clock size={14} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F59E0B', marginTop: '4px' }}>4.2 <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Cars/Hr</span></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Slot Transit: &lt;45s walking</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>PLATFORM NET CONTRIBUTION</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>42.4%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>After cleaner payouts & consumables</div>
        </div>
      </div>

      {/* Society Density Penetration Table */}
      <div style={{ backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', padding: '20px', marginBottom: '28px' }}>
        <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 size={18} color="var(--color-brand-primary)" />
          <span>Society Density & Penetration Index</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border-subtle)', fontSize: '0.6875rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Society Name</th>
                <th style={{ padding: '10px 14px' }}>Locality</th>
                <th style={{ padding: '10px 14px' }}>Total Flats</th>
                <th style={{ padding: '10px 14px' }}>Estimated Cars</th>
                <th style={{ padding: '10px 14px' }}>Subscribed Cars</th>
                <th style={{ padding: '10px 14px' }}>Penetration Rate</th>
                <th style={{ padding: '10px 14px' }}>Cleaners Assigned</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Prestige Lakeside Habitat', loc: 'Whitefield', flats: 3400, est: 2200, active: 84, rate: '14.0%', cleaners: '3 Pros' },
                { name: 'Sobha Dream Acres', loc: 'Panathur', flats: 6500, est: 3800, active: 142, rate: '11.8%', cleaners: '5 Pros' },
                { name: 'Godrej Eternity', loc: 'Kanakapura Rd', flats: 800, est: 550, active: 46, rate: '23.0%', cleaners: '2 Pros' }
              ].map((s, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700 }}>{s.name}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--color-text-secondary)' }}>{s.loc}</td>
                  <td style={{ padding: '12px 14px' }}>{s.flats.toLocaleString()}</td>
                  <td style={{ padding: '12px 14px' }}>{s.est.toLocaleString()}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--color-brand-primary)' }}>{s.active}</td>
                  <td style={{ padding: '12px 14px', color: '#10B981', fontWeight: 800 }}>{s.rate}</td>
                  <td style={{ padding: '12px 14px' }}>{s.cleaners}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cohort Retention Table */}
      <div style={{ backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', padding: '20px' }}>
        <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="#10B981" />
          <span>Monthly Subscription Retention Cohorts (B2C Recurring)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
          <div style={{ backgroundColor: 'var(--color-bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>MONTH 1 (ACTIVATION)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>100%</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}>272 Initial Signups</div>
          </div>
          <div style={{ backgroundColor: 'var(--color-bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>MONTH 2 (RENEWAL)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>88.4%</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}>240 Retained</div>
          </div>
          <div style={{ backgroundColor: 'var(--color-bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>MONTH 3 (MATURE)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>84.2%</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}>229 Retained</div>
          </div>
          <div style={{ backgroundColor: 'var(--color-bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>ANNUAL CHURN</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#94A3B8', marginTop: '4px' }}>15.8%</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}>Mainly Resident Move-outs</div>
          </div>
        </div>
      </div>

    </div>
  );
};
