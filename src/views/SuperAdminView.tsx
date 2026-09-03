import React, { useState } from 'react';
import { ApiClient } from '../services/apiClient';
import { store } from '../services/store';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  Building2, 
  Plus, 
  Car, 
  Copy, 
  Check, 
  Inbox, 
  ShieldCheck, 
  DollarSign,
  TrendingUp,
  FileText
} from 'lucide-react';

export const SuperAdminView: React.FC = () => {
  const societies = store.getSocieties();
  const leads = store.getEnquiries();
  const [activeTab, setActiveTab] = useState<'LEADS' | 'CREATE_SOCIETY' | 'SOCIETIES' | 'AUDIT'>('LEADS');

  // Create Society Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [addressLine, setAddressLine] = useState('');
  const [pincode, setPincode] = useState('560066');
  const [maxUnits, setMaxUnits] = useState(500);
  const [adminFullName, setAdminFullName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');

  const [isProvisioning, setIsProvisioning] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{
    adminEmail: string;
    adminPhone: string;
    tempPassword: string;
    loginUrl: string;
    societyName: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const handleCreateSociety = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProvisioning(true);

    const res = await ApiClient.createSociety({
      name,
      code,
      locality,
      city,
      addressLine,
      pincode,
      maxUnits: Number(maxUnits),
      adminFullName,
      adminEmail,
      adminPhone
    });

    setIsProvisioning(false);
    if (res.success && res.onboardingCredentials) {
      // Add to reactive store
      const newSoc = store.addSociety({
        name,
        code,
        addressLine: addressLine || 'Main Avenue',
        locality: locality || 'City Center',
        city: city || 'Bengaluru',
        pincode: pincode || '560001',
        waterPolicy: 'WATERLESS_ONLY',
        totalApartments: Number(maxUnits) || 500
      });

      // Add default tower & slots
      const tow = store.addTower(newSoc.id, 'Tower 1 (Oak)', 20);
      store.addSlot(tow.id, 'Basement 1', 'B1-101', 1);
      store.addSlot(tow.id, 'Basement 1', 'B1-102', 2);
      store.addSlot(tow.id, 'Basement 2', 'B2-201', 3);

      setCreatedCredentials({
        ...res.onboardingCredentials,
        societyName: name
      });
      // Reset form
      setName('');
      setCode('');
      setLocality('');
      setAdminFullName('');
      setAdminEmail('');
      setAdminPhone('');
    }
  };

  const copyToClipboard = () => {
    if (createdCredentials) {
      const text = `🎉 AuraCar OS — Society Onboarding Package
Society: ${createdCredentials.societyName}
Login Portal: ${createdCredentials.loginUrl}
Admin Email: ${createdCredentials.adminEmail}
Admin Phone: ${createdCredentials.adminPhone}
Temporary Password: ${createdCredentials.tempPassword}

*Note: Please set a new secure password during your first login.*`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: string) => {
    store.updateEnquiryStatus(leadId, newStatus as any);
  };

  return (
    <div className="container-admin" style={{ padding: '24px 32px 80px' }}>
      
      {/* 1. Super Admin Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B', display: 'inline-block' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F59E0B', letterSpacing: '0.05em' }}>
              GLOBAL PLATFORM OWNER CONSOLE (COMPANY SUPER ADMIN)
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Super Admin Command</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Enterprise B2B pipeline, society tenant provisioning, macro fleet health, and immutable audit logs.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--color-bg-surface)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
          <button
            onClick={() => setActiveTab('LEADS')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              backgroundColor: activeTab === 'LEADS' ? '#3B82F6' : 'transparent',
              color: activeTab === 'LEADS' ? '#ffffff' : 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Inbox size={14} />
            B2B Leads ({leads.length})
          </button>

          <button
            onClick={() => setActiveTab('CREATE_SOCIETY')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              backgroundColor: activeTab === 'CREATE_SOCIETY' ? '#10B981' : 'transparent',
              color: activeTab === 'CREATE_SOCIETY' ? '#090D14' : 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={14} />
            Provision Society
          </button>

          <button
            onClick={() => setActiveTab('SOCIETIES')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              backgroundColor: activeTab === 'SOCIETIES' ? '#A855F7' : 'transparent',
              color: activeTab === 'SOCIETIES' ? '#ffffff' : 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Building2 size={14} />
            Active Tenants ({societies.length})
          </button>

          <button
            onClick={() => setActiveTab('AUDIT')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              backgroundColor: activeTab === 'AUDIT' ? '#F59E0B' : 'transparent',
              color: activeTab === 'AUDIT' ? '#090D14' : 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileText size={14} />
            Audit Logs
          </button>
        </div>
      </div>

      {/* 2. Global Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', marginBottom: '4px' }}>
            <span>Active Societies</span>
            <Building2 size={16} color="#3B82F6" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{societies.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px' }}>100% Operational Status</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', marginBottom: '4px' }}>
            <span>Subscribed Fleet</span>
            <Car size={16} color="#10B981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>272 <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Cars</span></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Across Bengaluru Hub</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', marginBottom: '4px' }}>
            <span>Global Monthly GMV</span>
            <DollarSign size={16} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F59E0B' }}>₹2,98,928</div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px' }}>Platform Margin: ₹1,26,745 (42.4%)</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', marginBottom: '4px' }}>
            <span>Inbound Pipeline</span>
            <TrendingUp size={16} color="#A855F7" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{leads.length} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Societies</span></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Est. +1,850 Units</div>
        </div>
      </div>

      {/* 3. TAB: B2B LEADS / ENQUIRIES */}
      {activeTab === 'LEADS' && (
        <div style={{ backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Inbound Society Purchase Enquiries</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>RWAs and facility directors who submitted the "Bring Car Care to Your Society" form.</p>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border-subtle)', fontSize: '0.6875rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Society / Location</th>
                <th style={{ padding: '10px 14px' }}>Contact Person</th>
                <th style={{ padding: '10px 14px' }}>Est. Units</th>
                <th style={{ padding: '10px 14px' }}>Received</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
                <th style={{ padding: '10px 14px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '32px 14px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                      No Inbound Leads Yet
                    </div>
                    <div style={{ fontSize: '0.75rem' }}>
                      Submit the "Bring Car Care to Your Society" form on the public landing page to see leads appear here instantly.
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map(lead => (
                <tr key={lead.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.9375rem' }}>{lead.societyName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>📍 {lead.city}</div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 700 }}>{lead.contactPerson}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>📞 {lead.phoneNumber} • {lead.email}</div>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 700, color: 'var(--color-brand-primary)' }}>
                    ~{lead.estimatedUnits} flats
                  </td>
                  <td style={{ padding: '14px', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                    {lead.createdAt}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <select
                      value={lead.status}
                      onChange={e => handleUpdateLeadStatus(lead.id, e.target.value)}
                      style={{
                        backgroundColor: 'var(--color-bg-elevated)',
                        border: '1px solid var(--color-border-default)',
                        color: lead.status === 'NEW' ? '#60A5FA' : '#10B981',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}
                    >
                      <option value="NEW">New Lead</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="DEMO_SCHEDULED">Demo Scheduled</option>
                      <option value="PROPOSAL_SENT">Proposal Sent</option>
                      <option value="CONVERTED">Converted</option>
                    </select>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setName(lead.societyName);
                        setCode(lead.societyName.split(' ').map(w => w[0]).join('').toUpperCase() + '-BLR');
                        setAdminFullName(lead.contactPerson.split('(')[0].trim());
                        setAdminEmail(lead.email);
                        setAdminPhone(lead.phoneNumber);
                        setMaxUnits(lead.estimatedUnits || 500);
                        setActiveTab('CREATE_SOCIETY');
                      }}
                    >
                      Provision Tenant
                    </Button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. TAB: PROVISION NEW SOCIETY */}
      {activeTab === 'CREATE_SOCIETY' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
          
          <div style={{ backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>Provision New Society Tenant</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
              Creates an isolated database tenant, seeds standard commission tier, and generates onboarding credentials for the RWA Society Admin.
            </p>

            <form onSubmit={handleCreateSociety}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>SOCIETY NAME *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Godrej Woodsman Estate"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)', color: '#ffffff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>TENANT CODE *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GWE-BLR"
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)', color: '#ffffff' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>LOCALITY / AREA *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hebbal"
                      value={locality}
                      onChange={e => setLocality(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)', color: '#ffffff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>CITY *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)', color: '#ffffff' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>ADDRESS LINE *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SH 35, Varthur Main Road"
                      value={addressLine}
                      onChange={e => setAddressLine(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)', color: '#ffffff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>PINCODE *</label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={e => setPincode(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)', color: '#ffffff' }}
                    />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '14px', marginTop: '4px' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBottom: '10px' }}>
                    SOCIETY ADMIN (RWA / FACILITY MANAGER)
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>FULL NAME *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vivek Sharma"
                        value={adminFullName}
                        onChange={e => setAdminFullName(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)', color: '#ffffff' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>EMAIL *</label>
                        <input
                          type="email"
                          required
                          placeholder="admin@society.com"
                          value={adminEmail}
                          onChange={e => setAdminEmail(e.target.value)}
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)', color: '#ffffff' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>PHONE NUMBER *</label>
                        <input
                          type="tel"
                          required
                          placeholder="9845012345"
                          value={adminPhone}
                          onChange={e => setAdminPhone(e.target.value)}
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)', color: '#ffffff' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button fullWidth size="lg" variant="success" type="submit" isLoading={isProvisioning}>
                ✓ Provision Society & Generate Credentials
              </Button>
            </form>
          </div>

          {/* Credentials Display Card */}
          {createdCredentials ? (
            <div style={{ backgroundColor: '#121824', borderRadius: 'var(--radius-lg)', border: '2px solid #10B981', padding: '24px', boxShadow: '0 8px 30px rgba(16, 185, 129, 0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 800, fontSize: '0.875rem', marginBottom: '8px' }}>
                <ShieldCheck size={18} />
                <span>TENANT PROVISIONED SUCCESSFULLY</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '16px' }}>{createdCredentials.societyName}</h3>

              <div style={{ backgroundColor: 'var(--color-bg-elevated)', padding: '16px', borderRadius: '8px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
                <div><strong>Login Portal:</strong> <span style={{ color: '#3B82F6' }}>{createdCredentials.loginUrl}</span></div>
                <div><strong>Admin Email:</strong> {createdCredentials.adminEmail}</div>
                <div><strong>Admin Phone:</strong> {createdCredentials.adminPhone}</div>
                <div><strong>Temporary Password:</strong> <code style={{ backgroundColor: '#000000', padding: '2px 8px', borderRadius: '4px', color: '#F59E0B', fontFamily: 'monospace' }}>{createdCredentials.tempPassword}</code></div>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '18px' }}>
                🔒 The Society Admin will be required to set a permanent password upon first login.
              </p>

              <Button
                fullWidth
                variant="primary"
                leftIcon={copied ? <Check size={16} /> : <Copy size={16} />}
                onClick={copyToClipboard}
              >
                {copied ? 'Onboarding Package Copied ✓' : 'Copy Onboarding Package'}
              </Button>
            </div>
          ) : (
            <div style={{ padding: '40px 20px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border-subtle)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              Fill the form on the left to provision a new society. Onboarding credentials and login setup link will be displayed here.
            </div>
          )}

        </div>
      )}

      {/* 5. TAB: ACTIVE TENANTS */}
      {activeTab === 'SOCIETIES' && (
        <div style={{ backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Active Residential Society Tenants</h3>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border-subtle)', fontSize: '0.6875rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Code</th>
                <th style={{ padding: '10px 14px' }}>Society Name</th>
                <th style={{ padding: '10px 14px' }}>Location</th>
                <th style={{ padding: '10px 14px' }}>Subscribed Cars</th>
                <th style={{ padding: '10px 14px' }}>Cleaners</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {societies.map(soc => (
                <tr key={soc.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-brand-primary)' }}>{soc.code}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 800 }}>{soc.name}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--color-text-secondary)' }}>{soc.locality}, {soc.city}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: '#10B981' }}>{soc.activeCarsCount}</td>
                  <td style={{ padding: '12px 14px' }}>3 Dedicated Pros</td>
                  <td style={{ padding: '12px 14px' }}><StatusBadge status="ACTIVE" size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 6. TAB: AUDIT LOGS */}
      {activeTab === 'AUDIT' && (
        <div style={{ backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '18px' }}>Immutable Platform Audit Log</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: '1', actor: 'Super Admin (usr_admin_01)', action: 'PROVISION_SOCIETY', target: 'Prestige Lakeside Habitat (soc_plh_01)', time: '2026-09-03 09:00:00' },
              { id: '2', actor: 'RWA Admin (usr_soc_01)', action: 'REASSIGN_CLEANER', target: 'Job #job_01 -> Ramesh Kumar', time: '2026-09-03 06:15:22' },
              { id: '3', actor: 'Resident (usr_cust_01)', action: 'VACATION_PAUSE_APPLIED', target: '5 Days Pause (+5 days billing shift)', time: '2026-09-03 07:10:05' }
            ].map(log => (
              <div key={log.id} style={{ padding: '12px 16px', backgroundColor: 'var(--color-bg-elevated)', borderRadius: '6px', border: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <div>
                  <span style={{ fontWeight: 800, color: '#3B82F6' }}>{log.action}</span> • <span style={{ color: '#F8FAFC' }}>{log.target}</span>
                  <div style={{ color: 'var(--color-text-muted)', marginTop: '2px' }}>By: {log.actor}</div>
                </div>
                <div style={{ color: 'var(--color-text-muted)' }}>{log.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
