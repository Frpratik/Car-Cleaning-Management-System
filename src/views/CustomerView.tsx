import React, { useState } from 'react';
import { Vehicle } from '../types';
import { store } from '../services/store';
import { SubscriptionEngine } from '../services/subscriptionEngine';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { BeforeAfterViewer } from '../components/ui/BeforeAfterViewer';
import { CustomerOnboardingWizard } from './CustomerOnboardingWizard';
import { 
  Car, 
  Clock, 
  Shield, 
  Plus, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  UserCheck, 
  Compass, 
  Calendar as CalendarIcon,
  Settings
} from 'lucide-react';

export const CustomerView: React.FC = () => {
  const user = store.getCurrentUser();
  const vehicles = store.getCustomerVehicles(user.id);
  const subscriptions = store.getCustomerSubscriptions(user.id);
  const allJobs = store.getAllJobs();
  const societies = store.getSocieties();
  const plans = store.getServicePlans();

  const [isOnboarding, setIsOnboarding] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showPauseVacationModal, setShowPauseVacationModal] = useState(false);
  const [showPlanManagerModal, setShowPlanManagerModal] = useState(false);
  const [showCalendarDetails, setShowCalendarDetails] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showInvoicesModal, setShowInvoicesModal] = useState(false);

  // Rating State
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState('Excellent work on the tyres and windshield!');

  // Complaint State
  const [complaintCategory, setComplaintCategory] = useState<'MISSED_SPOTS' | 'SCRATCH_CLAIM' | 'LATE_SERVICE'>('MISSED_SPOTS');
  const [complaintDesc, setComplaintDesc] = useState('');

  // Form states for Add Vehicle
  const [selectedSocietyId, setSelectedSocietyId] = useState<string>(societies[0]?.id || '');
  const [selectedTowerId, setSelectedTowerId] = useState<string>('');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [make, setMake] = useState('Hyundai');
  const [model, setModel] = useState('Creta');
  const [color, setColor] = useState('Titan Grey');
  const [regNo, setRegNo] = useState('KA 05 MN 3829');
  const [vehicleType, setVehicleType] = useState<Vehicle['type']>('COMPACT_SUV');

  // Form state for Subscribe
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || '');

  // Vacation Pause form
  const [vacationDays, setVacationDays] = useState<number>(5);

  const activeVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
  const activeSub = subscriptions.find(s => s.vehicleId === activeVehicle?.id);
  const vehicleJobs = allJobs.filter(j => j.vehicleId === activeVehicle?.id);
  const todayJob = vehicleJobs.find(j => j.serviceDate === '2026-09-03') || vehicleJobs[0];

  const towers = store.getTowers(selectedSocietyId);
  const slots = store.getSlots(selectedTowerId || towers[0]?.id || '');

  // Compute 14-day upcoming schedule
  const scheduleDates = activeSub 
    ? SubscriptionEngine.generate30DaySchedule(activeSub, activeSub.status === 'PAUSED' ? [{ startDate: '2026-09-03', endDate: '2026-09-10' }] : []).slice(0, 14)
    : [];

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const soc = societies.find(s => s.id === selectedSocietyId);
    const tower = towers.find(t => t.id === (selectedTowerId || towers[0]?.id));
    const slot = slots.find(s => s.id === (selectedSlotId || slots[0]?.id)) || slots[0];

    const newVeh = store.addVehicle({
      customerId: user.id,
      make,
      model,
      color,
      registrationNo: regNo.toUpperCase(),
      type: vehicleType,
      societyId: soc?.id || societies[0].id,
      societyName: soc?.name || societies[0].name,
      slotId: slot?.id || 'slot_temp',
      slotName: `${tower?.name || 'Tower 1'} • ${slot?.level || 'B2'} • #${slot?.slotNumber || 'B2-99'}`
    });

    setSelectedVehicleId(newVeh.id);
    setShowAddVehicleModal(false);
    setShowSubscribeModal(true);
  };

  const handleCreateSubscription = () => {
    if (!activeVehicle) return;
    store.createSubscription({
      customerId: user.id,
      vehicleId: activeVehicle.id,
      planId: selectedPlanId
    });
    setShowSubscribeModal(false);
  };

  const handleTogglePause = () => {
    if (activeSub) {
      store.togglePauseSubscription(activeSub.id);
    }
  };

  const handleApplyVacationPause = () => {
    if (activeSub) {
      store.togglePauseSubscription(activeSub.id);
      setShowPauseVacationModal(false);
    }
  };

  const handleSubmitRating = () => {
    if (todayJob) {
      store.submitRating(todayJob.id, ratingScore, ratingFeedback);
      setShowRatingModal(false);
    }
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (todayJob) {
      store.fileComplaint({
        jobId: todayJob.id,
        category: complaintCategory,
        description: complaintDesc || 'Customer reported cleaning quality issue.'
      });
      setShowComplaintModal(false);
      setComplaintDesc('');
    }
  };

  if (isOnboarding) {
    return <CustomerOnboardingWizard onComplete={() => setIsOnboarding(false)} onCancel={() => setIsOnboarding(false)} />;
  }

  return (
    <div className="container-mobile" style={{ padding: '16px 16px 80px' }}>
      
      {/* 1. Header & Active Vehicle Selector */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              WELCOME BACK
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              {user.fullName}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Compass size={14} color="var(--color-brand-primary)" />}
              onClick={() => setIsOnboarding(true)}
            >
              Onboarding
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowInvoicesModal(true)}
            >
              Invoices
            </Button>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Plus size={14} />}
              onClick={() => setShowAddVehicleModal(true)}
            >
              Add Car
            </Button>
          </div>
        </div>

        {/* Vehicle Carousel Pills */}
        {vehicles.length > 0 ? (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {vehicles.map(veh => {
              const isSelected = veh.id === activeVehicle?.id;
              return (
                <button
                  key={veh.id}
                  onClick={() => setSelectedVehicleId(veh.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'var(--color-bg-elevated)' : 'var(--color-bg-surface)',
                    border: `1px solid ${isSelected ? 'var(--color-brand-primary)' : 'var(--color-border-subtle)'}`,
                    color: isSelected ? '#ffffff' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <Car size={16} color={isSelected ? 'var(--color-brand-primary)' : 'var(--color-text-muted)'} />
                  <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                    {veh.make} {veh.model}
                  </span>
                  <span style={{ fontSize: '0.6875rem', opacity: 0.7 }}>
                    {veh.registrationNo}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* 2. Main Service Card or Empty State */}
      {vehicles.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)',
            padding: '40px 24px',
            textAlign: 'center',
            marginBottom: '20px'
          }}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Car size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>No Vehicles Registered Yet</h3>
          <p style={{ fontSize: '0.8125rem', color: '#94A3B8', maxWidth: '380px', margin: '0 auto 20px' }}>
            Add your vehicle and parking slot details to schedule waterless morning maintenance.
          </p>
          <Button size="md" variant="primary" leftIcon={<Plus size={16} />} onClick={() => setShowAddVehicleModal(true)}>
            + Register Your Vehicle
          </Button>
        </div>
      ) : activeVehicle ? (
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)',
            padding: '18px',
            marginBottom: '20px',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <MapPin size={13} color="var(--color-text-muted)" />
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                  {activeVehicle.slotName}
                </span>
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                {activeVehicle.color} {activeVehicle.make} {activeVehicle.model}
              </h2>
            </div>
            {todayJob ? (
              <StatusBadge status={todayJob.status} />
            ) : activeSub ? (
              <StatusBadge status={activeSub.status} />
            ) : (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>No Active Plan</span>
            )}
          </div>

          {/* Today's Service Snapshot */}
          {todayJob && (
            <div
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                marginBottom: '16px',
                border: '1px solid var(--color-border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                  <Clock size={14} color="var(--color-brand-primary)" />
                  <span>Window: <strong>{todayJob.timeWindow}</strong></span>
                </div>
                {todayJob.completedAt && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-status-completed)', fontWeight: 600 }}>
                    Done at {todayJob.completedAt}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem' }}>
                <UserCheck size={15} color="var(--color-status-completed)" />
                <span>Dedicated Pro: <strong>{todayJob.providerName || 'Assigned Society Specialist'}</strong></span>
              </div>
            </div>
          )}

          {/* Subscription Status & Actions */}
          {activeSub ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--color-border-subtle)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Active Plan • {activeSub.plan.frequencyLabel}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {activeSub.plan.name} • ₹{activeSub.monthlyAmount}/mo
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowPauseVacationModal(true)}
                  >
                    {activeSub.status === 'PAUSED' ? 'Resume' : 'Vacation Pause'}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowPlanManagerModal(true)}
                  >
                    <Settings size={14} />
                  </Button>
                </div>
              </div>

              {activeSub.status === 'PAUSED' && (
                <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: 'var(--color-status-paused-bg)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--color-status-paused)' }}>
                  ⏸️ <strong>Subscription Paused:</strong> Services paused until {activeSub.pausedUntil || 'next week'}. Billing cycle automatically extended.
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <p style={{ fontSize: '0.8125rem', marginBottom: '10px' }}>
                No active recurring maintenance plan on this vehicle.
              </p>
              <Button fullWidth onClick={() => setShowSubscribeModal(true)}>
                Activate Daily Care Plan
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
          <Car size={36} color="var(--color-brand-primary)" style={{ marginBottom: '12px' }} />
          <h3>Your fleet is waiting</h3>
          <p style={{ marginTop: '6px', marginBottom: '16px' }}>Add your car to schedule hassle-free morning exterior cleaning.</p>
          <Button onClick={() => setShowAddVehicleModal(true)}>Add Your First Car</Button>
        </div>
      )}

      {/* 3. 14-Day Service Calendar Matrix (New Feature) */}
      {activeSub && scheduleDates.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)',
            padding: '16px',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarIcon size={16} color="var(--color-brand-primary)" />
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Next 14 Days Schedule</h3>
            </div>
            <button
              onClick={() => setShowCalendarDetails(!showCalendarDetails)}
              style={{ background: 'none', border: 'none', color: 'var(--color-brand-primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              {showCalendarDetails ? 'Compact View' : 'View Full Details'}
            </button>
          </div>

          {/* Mini Calendar Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
            {scheduleDates.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '8px 4px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: item.isPaused 
                    ? 'var(--color-status-paused-bg)' 
                    : item.isScheduled 
                      ? 'rgba(16, 185, 129, 0.12)' 
                      : 'var(--color-bg-elevated)',
                  border: `1px solid ${
                    item.isPaused 
                      ? 'rgba(168, 85, 247, 0.4)' 
                      : item.isScheduled 
                        ? 'rgba(16, 185, 129, 0.4)' 
                        : 'var(--color-border-subtle)'
                  }`
                }}
              >
                <div style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  {item.dayName}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: item.isScheduled ? '#10B981' : item.isPaused ? '#A855F7' : 'var(--color-text-secondary)', margin: '2px 0' }}>
                  {item.dayNumber}
                </div>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: item.isScheduled ? '#10B981' : item.isPaused ? '#A855F7' : 'transparent', margin: '0 auto' }} />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '14px', marginTop: '12px', fontSize: '0.6875rem', color: 'var(--color-text-muted)', justifyContent: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} /> Scheduled (Mon-Sat)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#64748B' }} /> Cleaner Rest
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#A855F7' }} /> Vacation Paused
            </span>
          </div>
        </div>
      )}

      {/* 4. Proof of Service Feed */}
      {todayJob?.proof ? (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Today's Inspection & Proof</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {todayJob.proof.beforeTakenAt} – {todayJob.proof.afterTakenAt}
            </span>
          </div>
          <BeforeAfterViewer
            proof={todayJob.proof}
            vehicleName={`${activeVehicle.make} ${activeVehicle.model}`}
            slotDetails={todayJob.slotDetails}
          />

          {/* Rating and Dispute Action Bar */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={() => setShowRatingModal(true)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-primary)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              ⭐ {todayJob.ratingScore ? `Rated ${todayJob.ratingScore}/5` : 'Rate Service (1-5★)'}
            </button>

            <button
              onClick={() => setShowComplaintModal(true)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-subtle)',
                color: '#EF4444',
                fontWeight: 700,
                fontSize: '0.8125rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              ⚠️ Report Issue / Dispute
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: '16px',
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--color-border-default)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Sparkles size={20} color="var(--color-brand-primary)" />
          <div style={{ fontSize: '0.8125rem' }}>
            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Morning Cleaning Scheduled</div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
              High-resolution before & after photos will appear here upon completion.
            </div>
          </div>
        </div>
      )}

      {/* 5. Plan Inclusions & Quality Guarantee */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)',
          padding: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Shield size={16} color="var(--color-brand-primary)" />
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700 }}>
            The AuraCar Quality Standard
          </h4>
        </div>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8125rem' }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)' }}>
            <CheckCircle2 size={14} color="var(--color-status-completed)" />
            3-Tier Color-coded Microfiber (Zero paint micro-swirls)
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)' }}>
            <CheckCircle2 size={14} color="var(--color-status-completed)" />
            Eco-mist Lubricated Waterless Formula (Safe for society basements)
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)' }}>
            <CheckCircle2 size={14} color="var(--color-status-completed)" />
            Cryptographic Slot & Time Verification on every service
          </li>
        </ul>
      </div>

      {/* ==========================================
          MODAL: VACATION / PAUSE MANAGER
         ========================================== */}
      {showPauseVacationModal && activeSub && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--color-bg-overlay)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 100
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              width: '100%',
              maxWidth: '480px',
              borderTopLeftRadius: 'var(--radius-lg)',
              borderTopRightRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-strong)',
              padding: '24px 20px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  {activeSub.status === 'PAUSED' ? 'Resume Subscription' : 'Vacation Pause Planner'}
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  {activeVehicle.make} {activeVehicle.model} ({activeVehicle.registrationNo})
                </div>
              </div>
              <button
                onClick={() => setShowPauseVacationModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {activeSub.status === 'ACTIVE' ? (
              <div>
                <p style={{ fontSize: '0.8125rem', marginBottom: '16px' }}>
                  Going out of town? Pause your subscription so your cleaner isn't dispatched and your billing cycle is automatically extended.
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                    PAUSE DURATION (DAYS)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {[3, 5, 7, 14].map(days => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setVacationDays(days)}
                        style={{
                          padding: '10px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: vacationDays === days ? 'var(--color-brand-subtle)' : 'var(--color-bg-elevated)',
                          border: `1.5px solid ${vacationDays === days ? 'var(--color-brand-primary)' : 'var(--color-border-default)'}`,
                          color: vacationDays === days ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                          fontWeight: 700,
                          fontSize: '0.8125rem',
                          cursor: 'pointer'
                        }}
                      >
                        {days} Days
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--color-bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1px solid var(--color-border-subtle)', fontSize: '0.8125rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-status-completed)', marginBottom: '4px' }}>
                    ✓ Pro-rated Protection Active:
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)' }}>
                    Your next renewal date ({activeSub.nextBillingDate}) will be shifted by <strong>+{vacationDays} days</strong> automatically.
                  </div>
                </div>

                <Button fullWidth size="lg" variant="primary" onClick={handleApplyVacationPause}>
                  Confirm Pause ({vacationDays} Days)
                </Button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '0.8125rem', marginBottom: '16px' }}>
                  Your subscription is currently paused. Resume now to schedule tomorrow morning's service.
                </p>
                <Button fullWidth size="lg" variant="success" onClick={handleTogglePause}>
                  Resume Morning Cleaning Now
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: PLAN & SUBSCRIPTION SETTINGS
         ========================================== */}
      {showPlanManagerModal && activeSub && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--color-bg-overlay)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 100
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              width: '100%',
              maxWidth: '480px',
              borderTopLeftRadius: 'var(--radius-lg)',
              borderTopRightRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-strong)',
              padding: '24px 20px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Manage Subscription</h3>
              <button
                onClick={() => setShowPlanManagerModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ backgroundColor: 'var(--color-bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>CURRENT PLAN</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{activeSub.plan.name}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-brand-primary)', fontWeight: 700 }}>₹{activeSub.monthlyAmount}/mo • Billed Monthly</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Next Billing: {activeSub.nextBillingDate}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <Button variant="outline" fullWidth onClick={() => { setShowPlanManagerModal(false); setShowSubscribeModal(true); }}>
                Switch to Different Frequency / Plan
              </Button>
              <Button variant="danger" fullWidth onClick={() => { store.togglePauseSubscription(activeSub.id); setShowPlanManagerModal(false); }}>
                Cancel Subscription
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: ADD VEHICLE
         ========================================== */}
      {showAddVehicleModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--color-bg-overlay)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 100
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              width: '100%',
              maxWidth: '480px',
              borderTopLeftRadius: 'var(--radius-lg)',
              borderTopRightRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-strong)',
              padding: '24px 20px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Add Vehicle & Slot</h3>
              <button
                onClick={() => setShowAddVehicleModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddVehicle}>
              {/* Society Selector */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  RESIDENTIAL SOCIETY
                </label>
                <select
                  value={selectedSocietyId}
                  onChange={e => setSelectedSocietyId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  {societies.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.locality})</option>
                  ))}
                </select>
              </div>

              {/* Tower & Slot */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                    TOWER / WING
                  </label>
                  <select
                    value={selectedTowerId}
                    onChange={e => setSelectedTowerId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)'
                    }}
                  >
                    {towers.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                    PARKING SLOT
                  </label>
                  <select
                    value={selectedSlotId}
                    onChange={e => setSelectedSlotId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)'
                    }}
                  >
                    {slots.map(s => (
                      <option key={s.id} value={s.id}>{s.level} • {s.slotNumber}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Vehicle Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                    MAKE
                  </label>
                  <input
                    type="text"
                    value={make}
                    onChange={e => setMake(e.target.value)}
                    placeholder="e.g. Hyundai / Honda"
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                    MODEL
                  </label>
                  <input
                    type="text"
                    value={model}
                    onChange={e => setModel(e.target.value)}
                    placeholder="e.g. Creta / City"
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)'
                    }}
                  />
                </div>
              </div>

              {/* Color & Plate */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                    COLOR
                  </label>
                  <input
                    type="text"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    placeholder="e.g. Pearl White"
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                    PLATE NUMBER
                  </label>
                  <input
                    type="text"
                    value={regNo}
                    onChange={e => setRegNo(e.target.value)}
                    placeholder="e.g. KA 03 MX 4492"
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      textTransform: 'uppercase',
                      fontWeight: 700
                    }}
                  />
                </div>
              </div>

              {/* Vehicle Type */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  VEHICLE BODY TYPE
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {(['HATCHBACK', 'SEDAN', 'COMPACT_SUV', 'SUV_LUXURY'] as const).map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setVehicleType(type)}
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: vehicleType === type ? 'var(--color-brand-subtle)' : 'var(--color-bg-elevated)',
                        border: `1px solid ${vehicleType === type ? 'var(--color-brand-primary)' : 'var(--color-border-default)'}`,
                        color: vehicleType === type ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <Button fullWidth size="lg" type="submit">
                Save & Proceed to Subscription
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: SUBSCRIBE TO PLAN
         ========================================== */}
      {showSubscribeModal && activeVehicle && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--color-bg-overlay)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 100
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              width: '100%',
              maxWidth: '480px',
              borderTopLeftRadius: 'var(--radius-lg)',
              borderTopRightRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-strong)',
              padding: '24px 20px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Select Care Plan</h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  For {activeVehicle.make} {activeVehicle.model} ({activeVehicle.type})
                </div>
              </div>
              <button
                onClick={() => setShowSubscribeModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {plans.map(plan => {
                const isSelected = plan.id === selectedPlanId;
                const price = plan.pricing[activeVehicle.type] || plan.pricing.SEDAN;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--color-bg-elevated)' : 'var(--color-bg-base)',
                      border: `1.5px solid ${isSelected ? 'var(--color-brand-primary)' : 'var(--color-border-subtle)'}`,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)' }}>
                          {plan.name}
                        </span>
                        {plan.recommended && (
                          <span style={{ marginLeft: '8px', fontSize: '0.625rem', backgroundColor: 'var(--color-brand-primary)', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                            POPULAR
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                        ₹{price}<span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>/mo</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                      {plan.description}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-status-completed)', fontWeight: 600 }}>
                      ✓ {plan.frequencyLabel}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ backgroundColor: 'var(--color-bg-elevated)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '18px', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              🔒 <strong>UPI Autopay / Card:</strong> Billed monthly. Pause or cancel anytime before your next billing cycle.
            </div>

            <Button fullWidth size="lg" onClick={handleCreateSubscription}>
              Activate Subscription & Pay
            </Button>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: RATE SERVICE (1-5 STARS)
         ========================================== */}
      {showRatingModal && todayJob && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120 }}>
          <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', maxWidth: '400px', width: '100%', border: '1px solid var(--color-border-strong)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Rate Today's Service</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
              How was the cleaning quality for {activeVehicle?.make} {activeVehicle?.model}?
            </p>

            {/* Stars */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRatingScore(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    color: star <= ratingScore ? '#F59E0B' : '#4B5563'
                  }}
                >
                  ★
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                FEEDBACK / COMMENTS
              </label>
              <textarea
                rows={3}
                value={ratingFeedback}
                onChange={e => setRatingFeedback(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)', color: 'var(--color-text-primary)', fontSize: '0.8125rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="outline" fullWidth onClick={() => setShowRatingModal(false)}>Cancel</Button>
              <Button variant="primary" fullWidth onClick={handleSubmitRating}>Submit Rating</Button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: REPORT ISSUE / COMPLAINT
         ========================================== */}
      {showComplaintModal && todayJob && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120 }}>
          <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', maxWidth: '420px', width: '100%', border: '1px solid #EF4444' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px', color: '#EF4444' }}>Report Service Issue</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
              Our operations team inspects every report against morning photo logs within 15 minutes.
            </p>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                ISSUE CATEGORY
              </label>
              <select
                value={complaintCategory}
                onChange={e => setComplaintCategory(e.target.value as any)}
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)', color: 'var(--color-text-primary)' }}
              >
                <option value="MISSED_SPOTS">Missed Spots / Streaks on Paint or Glass</option>
                <option value="SCRATCH_CLAIM">Pre-existing Damage or Scratch Concern</option>
                <option value="LATE_SERVICE">Service Delayed Past 8:00 AM Window</option>
              </select>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                DESCRIPTION
              </label>
              <textarea
                rows={3}
                value={complaintDesc}
                onChange={e => setComplaintDesc(e.target.value)}
                placeholder="Describe which area requires attention..."
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)', color: 'var(--color-text-primary)', fontSize: '0.8125rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="outline" fullWidth onClick={() => setShowComplaintModal(false)}>Cancel</Button>
              <Button variant="danger" fullWidth onClick={handleSubmitComplaint}>Submit Report</Button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: INVOICES & PAYMENTS
         ========================================== */}
      {showInvoicesModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120 }}>
          <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', maxWidth: '440px', width: '100%', border: '1px solid var(--color-border-strong)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Billing & Receipts</h3>
              <button onClick={() => setShowInvoicesModal(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            {store.getPayments(user.id).map(p => (
              <div key={p.id} style={{ backgroundColor: 'var(--color-bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '10px', border: '1px solid var(--color-border-default)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{p.invoiceNumber}</span>
                  <span style={{ fontWeight: 800, color: 'var(--color-brand-primary)' }}>₹{p.amount}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{p.paymentMethod} • {p.createdAt}</span>
                  <span style={{ color: 'var(--color-status-completed)', fontWeight: 700 }}>✓ PAID</span>
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Razorpay ID: {p.razorpayPaymentId}
                </div>
              </div>
            ))}

            <Button fullWidth variant="outline" onClick={() => setShowInvoicesModal(false)}>Close</Button>
          </div>
        </div>
      )}

    </div>
  );
};

