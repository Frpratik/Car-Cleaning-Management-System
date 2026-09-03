import React, { useState } from 'react';
import { store } from '../services/store';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SocietyOnboardingWizard } from './SocietyOnboardingWizard';
import { 
  Building2, 
  Car, 
  CheckCircle2, 
  Clock, 
  Users, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Receipt, 
  UserPlus, 
  Layers, 
  Copy, 
  Check 
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const metrics = store.getMetricsSummary();
  const societies = store.getSocieties();
  const allJobs = store.getAllJobs();
  const providers = store.getProviders();
  const complaints = store.getComplaints();
  const payments = store.getPayments();

  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [activeTab, setActiveTab] = useState<'MANIFEST' | 'COMPLAINTS' | 'FINANCE'>('MANIFEST');
  const [selectedSocietyFilter, setSelectedSocietyFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Reassign Cleaner Modal
  const [reassignJobId, setReassignJobId] = useState<string | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string>(providers[0]?.id || '');

  // Resolve Complaint Modal
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState<string>('Specialist instructed to perform complimentary buffing.');

  const filteredJobs = allJobs.filter(job => {
    if (selectedSocietyFilter !== 'ALL' && job.societyId !== selectedSocietyFilter) return false;
    if (selectedStatusFilter !== 'ALL' && job.status !== selectedStatusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        job.slotDetails.toLowerCase().includes(q) ||
        job.vehicle.registrationNo.toLowerCase().includes(q) ||
        job.vehicle.model.toLowerCase().includes(q) ||
        (job.providerName && job.providerName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const activeInspectedJob = allJobs.find(j => j.id === selectedJobId) || filteredJobs[0];
  const activeComplaint = complaints.find(c => c.id === selectedComplaintId);

  const handleExecuteReassignment = () => {
    if (reassignJobId && selectedProviderId) {
      store.reassignJob(reassignJobId, selectedProviderId);
      setReassignJobId(null);
    }
  };

  const handleResolveComplaint = (status: 'RESOLVED' | 'REFUNDED' | 'REJECTED') => {
    if (selectedComplaintId) {
      store.resolveComplaint(selectedComplaintId, resolutionNote, status);
      setSelectedComplaintId(null);
    }
  };

  const copyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/join/PLH-BLR`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  if (showSetupWizard) {
    return (
      <SocietyOnboardingWizard
        societyId={societies[0]?.id || 'soc_plh_01'}
        onComplete={() => setShowSetupWizard(false)}
        onExit={() => setShowSetupWizard(false)}
      />
    );
  }

  return (
    <div className="container-admin" style={{ padding: '24px 32px 80px' }}>
      
      {/* RWA Onboarding & Resident Access Quick Banner */}
      <div style={{ backgroundColor: '#161F30', border: '1.5px solid #2A3C5D', borderRadius: 'var(--radius-md)', padding: '12px 18px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layers size={18} color="#60A5FA" />
          <span style={{ fontSize: '0.8125rem', color: '#F8FAFC' }}>
            <strong>RWA Portal:</strong> Manage Towers, Parking Slots, Cleaner Rosters, and Resident Access.
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            size="sm"
            variant="outline"
            leftIcon={copiedLink ? <Check size={14} /> : <Copy size={14} />}
            onClick={copyInviteLink}
          >
            {copiedLink ? 'Resident Link Copied ✓' : 'Copy Resident Join Link'}
          </Button>

          <Button
            size="sm"
            variant="primary"
            leftIcon={<Layers size={14} />}
            onClick={() => setShowSetupWizard(true)}
          >
            Launch Setup Checklist (9 Steps)
          </Button>
        </div>
      </div>

      {/* 1. Header & Section Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-status-completed)', letterSpacing: '0.05em' }}>
              OPERATIONS & DISPATCH SUITE ACTIVE
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Society Admin Operations</h1>
          <p style={{ fontSize: '0.875rem' }}>Real-time society density monitoring, cleaner dispatch, complaints audit, and finance reconciliation.</p>
        </div>

        {/* View Switcher Pills */}
        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--color-bg-surface)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
          <button
            onClick={() => setActiveTab('MANIFEST')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              backgroundColor: activeTab === 'MANIFEST' ? 'var(--color-brand-primary)' : 'transparent',
              color: activeTab === 'MANIFEST' ? '#ffffff' : 'var(--color-text-secondary)'
            }}
          >
            Live Manifest ({filteredJobs.length})
          </button>

          <button
            onClick={() => setActiveTab('COMPLAINTS')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              backgroundColor: activeTab === 'COMPLAINTS' ? '#EF4444' : 'transparent',
              color: activeTab === 'COMPLAINTS' ? '#ffffff' : 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <AlertTriangle size={14} />
            Disputes & Complaints ({complaints.length})
          </button>

          <button
            onClick={() => setActiveTab('FINANCE')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              backgroundColor: activeTab === 'FINANCE' ? '#10B981' : 'transparent',
              color: activeTab === 'FINANCE' ? '#090D14' : 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Receipt size={14} />
            Finance & Billing
          </button>
        </div>
      </div>

      {/* 2. Operational KPIs Metric Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginBottom: '28px'
        }}
      >
        <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', marginBottom: '6px' }}>
            <span>Active Subscriptions</span>
            <Car size={16} color="var(--color-brand-primary)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{metrics.totalActiveSubscriptions}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-status-completed)', marginTop: '4px' }}>₹{metrics.totalMonthlyRevenue.toLocaleString()} MRR</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', marginBottom: '6px' }}>
            <span>Today's Manifest</span>
            <Clock size={16} color="var(--color-status-scheduled)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{metrics.todayScheduledJobs} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Cars</span></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{metrics.todayCompletedJobs} Verified Done</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', marginBottom: '6px' }}>
            <span>Completion Rate</span>
            <CheckCircle2 size={16} color="var(--color-status-completed)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-status-completed)' }}>{metrics.completionRate}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Target: &gt;98.5% by 8:00 AM</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', marginBottom: '6px' }}>
            <span>Cleaners on Duty</span>
            <Users size={16} color="#A855F7" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{metrics.activeProvidersOnDuty} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Pros</span></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>100% On-time Check-in</div>
        </div>
      </div>

      {/* 3. SECTION 1: LIVE MANIFEST & INSPECTOR */}
      {activeTab === 'MANIFEST' && (
        <>
          {/* Society Density Fleet Monitor */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              padding: '16px 20px',
              marginBottom: '28px'
            }}
          >
            <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={16} color="var(--color-brand-primary)" />
              <span>Active Society Clusters & Fleet Density</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {societies.map(soc => (
                <div
                  key={soc.id}
                  style={{
                    backgroundColor: 'var(--color-bg-elevated)',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-default)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{soc.name}</span>
                    <span style={{ fontSize: '0.6875rem', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--color-brand-primary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      {soc.code}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{soc.locality}, {soc.city}</span>
                    <span><strong>{soc.activeCarsCount}</strong> cars subscribed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table & Inspector Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', alignItems: 'start' }}>
            
            {/* Left: Job Table */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border-subtle)',
                overflow: 'hidden'
              }}
            >
              {/* Filter Bar */}
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <select
                    value={selectedSocietyFilter}
                    onChange={e => setSelectedSocietyFilter(e.target.value)}
                    style={{
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      color: 'var(--color-text-primary)',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    <option value="ALL">All Societies</option>
                    {societies.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>

                  <select
                    value={selectedStatusFilter}
                    onChange={e => setSelectedStatusFilter(e.target.value)}
                    style={{
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      color: 'var(--color-text-primary)',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="UNABLE_TO_SERVICE">Exceptions</option>
                  </select>
                </div>

                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '8px', top: '8px', color: 'var(--color-text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search slot, plate, pro..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      color: 'var(--color-text-primary)',
                      padding: '6px 10px 6px 28px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      width: '180px'
                    }}
                  />
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border-subtle)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '10px 14px' }}>Seq / Slot</th>
                      <th style={{ padding: '10px 14px' }}>Vehicle & Plate</th>
                      <th style={{ padding: '10px 14px' }}>Assigned Pro</th>
                      <th style={{ padding: '10px 14px' }}>Status</th>
                      <th style={{ padding: '10px 14px' }}>Timing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map(job => {
                      const isSelected = job.id === activeInspectedJob?.id;
                      return (
                        <tr
                          key={job.id}
                          onClick={() => setSelectedJobId(job.id)}
                          style={{
                            borderBottom: '1px solid var(--color-border-subtle)',
                            backgroundColor: isSelected ? 'var(--color-bg-subtle)' : 'transparent',
                            cursor: 'pointer',
                            transition: 'background-color var(--transition-fast)'
                          }}
                        >
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                              #{job.walkingSequence} • {job.slotDetails.split('•')[2] || job.slotDetails}
                            </div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                              {job.societyName}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                              {job.vehicle.color} {job.vehicle.model}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                              {job.vehicle.registrationNo}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ color: 'var(--color-text-primary)' }}>
                              {job.providerName || 'Unassigned'}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <StatusBadge status={job.status} size="sm" />
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                            {job.completedAt ? `Done ${job.completedAt}` : job.timeWindow}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Job Inspector & Verification Auditor */}
            {activeInspectedJob ? (
              <div
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border-subtle)',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Job Details & Proof Audit</h3>
                  <StatusBadge status={activeInspectedJob.status} />
                </div>

                <div style={{ backgroundColor: 'var(--color-bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>VEHICLE SPECIFICATION</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                    {activeInspectedJob.vehicle.color} {activeInspectedJob.vehicle.make} {activeInspectedJob.vehicle.model}
                  </div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-brand-primary)', marginTop: '2px' }}>
                    PLATE: {activeInspectedJob.vehicle.registrationNo} ({activeInspectedJob.vehicle.type})
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
                    📍 {activeInspectedJob.societyName} • {activeInspectedJob.slotDetails}
                  </div>
                </div>

                {/* Proof Snapshot if available */}
                {activeInspectedJob.proof ? (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-status-completed)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={14} />
                      <span>VERIFIED PHOTO PROOF (DURATION: {activeInspectedJob.proof.durationMinutes} MINS)</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>BEFORE ({activeInspectedJob.proof.beforeTakenAt})</div>
                        <img
                          src={activeInspectedJob.proof.beforePhotoUrl}
                          alt="Before"
                          style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>AFTER ({activeInspectedJob.proof.afterTakenAt})</div>
                        <img
                          src={activeInspectedJob.proof.afterPhotoUrl}
                          alt="After"
                          style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                        />
                      </div>
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                      Hash: {activeInspectedJob.proof.watermarkHash}
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.75rem', marginBottom: '16px' }}>
                    No completed service proof uploaded yet for today.
                  </div>
                )}

                {/* Rating / Customer Feedback */}
                {activeInspectedJob.ratingScore && (
                  <div style={{ backgroundColor: 'var(--color-bg-elevated)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-status-completed)' }}>
                      CUSTOMER RATING: {'⭐'.repeat(activeInspectedJob.ratingScore)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
                      "{activeInspectedJob.ratingFeedback}"
                    </div>
                  </div>
                )}

                {/* Operations Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<UserPlus size={14} />}
                    fullWidth
                    onClick={() => setReassignJobId(activeInspectedJob.id)}
                  >
                    Re-assign Cleaner
                  </Button>
                </div>
              </div>
            ) : null}

          </div>
        </>
      )}

      {/* 4. SECTION 2: DISPUTES & COMPLAINT RESOLUTION */}
      {activeTab === 'COMPLAINTS' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'start' }}>
          
          {/* Complaints Table */}
          <div style={{ backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border-subtle)', fontWeight: 700, fontSize: '0.9375rem' }}>
              Customer Complaints & Damage Claims Queue ({complaints.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {complaints.map(comp => (
                <div
                  key={comp.id}
                  onClick={() => setSelectedComplaintId(comp.id)}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--color-border-subtle)',
                    cursor: 'pointer',
                    backgroundColor: comp.id === selectedComplaintId ? 'var(--color-bg-subtle)' : 'transparent',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 800, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', padding: '2px 8px', borderRadius: '4px' }}>
                        {comp.category.replace('_', ' ')}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{comp.createdAt}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)' }}>
                      {comp.vehicleName} ({comp.vehiclePlate}) • {comp.jobSlot}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                      "{comp.description}"
                    </div>
                  </div>
                  <StatusBadge status={comp.status} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Complaint Resolution Inspector */}
          {activeComplaint ? (
            <div style={{ backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Dispute Investigation</h3>
                <StatusBadge status={activeComplaint.status} />
              </div>

              <div style={{ backgroundColor: 'var(--color-bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>RESIDENT DETAILS</div>
                <div style={{ fontWeight: 700 }}>{activeComplaint.customerName}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-brand-primary)' }}>{activeComplaint.vehicleName} ({activeComplaint.vehiclePlate})</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Slot: {activeComplaint.jobSlot}</div>
              </div>

              {/* Photo Evidence */}
              {activeComplaint.proof && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>SERVICE PHOTO AUDIT TRAIL:</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <img src={activeComplaint.proof.beforePhotoUrl} alt="Before" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <img src={activeComplaint.proof.afterPhotoUrl} alt="After" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  </div>
                </div>
              )}

              {/* Resolution Form */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  RESOLUTION ACTIONS & NOTES
                </label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={e => setResolutionNote(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)', color: 'var(--color-text-primary)', fontSize: '0.8125rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <Button variant="success" onClick={() => handleResolveComplaint('RESOLVED')}>
                  ✓ Mark Resolved
                </Button>
                <Button variant="danger" onClick={() => handleResolveComplaint('REFUNDED')}>
                  Issue ₹200 Refund
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '30px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              Select a dispute from the list to audit photos and issue resolution.
            </div>
          )}

        </div>
      )}

      {/* 5. SECTION 3: FINANCE & INVOICING */}
      {activeTab === 'FINANCE' && (
        <div style={{ backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Subscription Billing & Razorpay Ledger</h3>
              <p style={{ fontSize: '0.8125rem' }}>Automatic recurring UPI Autopay / Card transactions and platform margin.</p>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-status-completed)' }}>
              Platform Gross Margin: 42.4%
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border-subtle)', fontSize: '0.6875rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Invoice #</th>
                <th style={{ padding: '10px 14px' }}>Customer</th>
                <th style={{ padding: '10px 14px' }}>Amount</th>
                <th style={{ padding: '10px 14px' }}>Method</th>
                <th style={{ padding: '10px 14px' }}>Razorpay ID</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(pay => (
                <tr key={pay.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700 }}>{pay.invoiceNumber}</td>
                  <td style={{ padding: '12px 14px' }}>Arjun Nambiar</td>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--color-brand-primary)' }}>₹{pay.amount}</td>
                  <td style={{ padding: '12px 14px' }}>{pay.paymentMethod}</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{pay.razorpayPaymentId}</td>
                  <td style={{ padding: '12px 14px' }}><StatusBadge status={pay.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ==========================================
          MODAL: REASSIGN CLEANER
         ========================================== */}
      {reassignJobId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150 }}>
          <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', maxWidth: '420px', width: '100%', border: '1px solid var(--color-border-strong)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '12px' }}>Re-assign Morning Slot</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
              Select a verified cleaner from the roster to take over this vehicle:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {providers.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProviderId(p.id)}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: selectedProviderId === p.id ? 'var(--color-brand-subtle)' : 'var(--color-bg-elevated)',
                    border: `1.5px solid ${selectedProviderId === p.id ? 'var(--color-brand-primary)' : 'var(--color-border-default)'}`,
                    color: '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{p.fullName} ({p.badgeNumber})</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{p.assignedSocietyName}</div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>⭐ {p.ratingAverage}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="outline" fullWidth onClick={() => setReassignJobId(null)}>Cancel</Button>
              <Button variant="primary" fullWidth onClick={handleExecuteReassignment}>Confirm Reassignment</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
