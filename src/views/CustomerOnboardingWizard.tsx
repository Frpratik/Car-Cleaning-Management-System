import React, { useState } from 'react';
import { store } from '../services/store';
import { VehicleType } from '../types';
import { Button } from '../components/ui/Button';
import { 
  Car, 
  Sparkles, 
  Smartphone, 
  Building, 
  CheckCircle2
} from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: () => void;
  onCancel?: () => void;
}

export const CustomerOnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  // Step 1: Phone & Profile
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [fullName, setFullName] = useState('Arjun Nambiar');

  // Step 2: Society & Parking Slot
  const societies = store.getSocieties();
  const [selectedSocietyId, setSelectedSocietyId] = useState(societies[0]?.id || '');
  const towers = store.getTowers(selectedSocietyId);
  const [selectedTowerId, setSelectedTowerId] = useState(towers[0]?.id || '');
  const slots = store.getSlots(selectedTowerId || towers[0]?.id || '');
  const [selectedSlotId, setSelectedSlotId] = useState(slots[0]?.id || '');

  // Step 3: Vehicle Specification
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('Fortuner');
  const [color, setColor] = useState('Pearl White');
  const [regNo, setRegNo] = useState('KA 03 MX 4492');
  const [vehicleType, setVehicleType] = useState<VehicleType>('SUV_LUXURY');

  // Step 4: Plan & Schedule
  const plans = store.getServicePlans();
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id || '');
  const [preferredWindow, setPreferredWindow] = useState('06:00 - 08:00 AM');

  const selectedSociety = societies.find(s => s.id === selectedSocietyId) || societies[0];
  const selectedTower = towers.find(t => t.id === selectedTowerId) || towers[0];
  const selectedSlot = slots.find(s => s.id === selectedSlotId) || slots[0];
  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[0];
  const planPrice = selectedPlan.pricing[vehicleType] || selectedPlan.pricing.SEDAN;

  const handleFinishOnboarding = () => {
    // 1. Create or update user
    const user = store.getCurrentUser();
    user.fullName = fullName;
    user.phoneNumber = phone;
    store.setCurrentUser(user);

    // 2. Add vehicle
    const newVeh = store.addVehicle({
      customerId: user.id,
      make,
      model,
      color,
      registrationNo: regNo.toUpperCase(),
      type: vehicleType,
      societyId: selectedSociety.id,
      societyName: selectedSociety.name,
      slotId: selectedSlot?.id || 'slot_temp',
      slotName: `${selectedTower?.name || 'Tower 1'} • ${selectedSlot?.level || 'B2'} • #${selectedSlot?.slotNumber || 'B2-104'}`
    });

    // 3. Create active subscription
    store.createSubscription({
      customerId: user.id,
      vehicleId: newVeh.id,
      planId: selectedPlan.id,
      preferredWindow
    });

    onComplete();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-base)',
        color: 'var(--color-text-primary)',
        padding: '24px 16px 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{ width: '100%', maxWidth: '460px' }}>
        
        {/* Progress Bar & Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={14} color="#ffffff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>AuraCar Setup</span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
              Step {step} of {totalSteps}
            </span>
          </div>

          <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${(step / totalSteps) * 100}%`,
                height: '100%',
                backgroundColor: 'var(--color-brand-primary)',
                transition: 'width 250ms ease'
              }}
            />
          </div>
        </div>

        {/* STEP 1: Phone & Identity Verification */}
        {step === 1 && (
          <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Smartphone size={22} color="var(--color-brand-primary)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Account & Mobile OTP</h2>
            </div>
            <p style={{ fontSize: '0.8125rem', marginBottom: '20px' }}>
              Enter your mobile number to connect your society parking slot and receive morning service proof.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                FULL NAME
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Arjun Nambiar"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-default)',
                  color: 'var(--color-text-primary)',
                  fontWeight: 600
                }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                MOBILE NUMBER (+91)
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ padding: '12px', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="9876543210"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 700,
                    letterSpacing: '0.05em'
                  }}
                />
              </div>
            </div>

            {/* OTP Boxes */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                6-DIGIT VERIFICATION CODE (SANDBOX AUTO-FILLED)
              </label>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    style={{
                      width: '44px',
                      height: '48px',
                      textAlign: 'center',
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1.5px solid var(--color-brand-primary)',
                      color: '#ffffff'
                    }}
                  />
                ))}
              </div>
            </div>

            <Button fullWidth size="lg" onClick={() => setStep(2)}>
              Verify & Select Society →
            </Button>
          </div>
        )}

        {/* STEP 2: Society & Parking Slot Selection */}
        {step === 2 && (
          <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Building size={22} color="var(--color-brand-primary)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Society & Parking Slot</h2>
            </div>
            <p style={{ fontSize: '0.8125rem', marginBottom: '20px' }}>
              Select where your car is parked inside your gated residential community.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                RESIDENTIAL SOCIETY
              </label>
              <select
                value={selectedSocietyId}
                onChange={e => {
                  setSelectedSocietyId(e.target.value);
                  const newTowers = store.getTowers(e.target.value);
                  setSelectedTowerId(newTowers[0]?.id || '');
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-default)',
                  color: 'var(--color-text-primary)',
                  fontWeight: 600
                }}
              >
                {societies.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.locality}) — {s.activeCarsCount} Active Subscriptions
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  TOWER / BLOCK
                </label>
                <select
                  value={selectedTowerId}
                  onChange={e => {
                    setSelectedTowerId(e.target.value);
                    const newSlots = store.getSlots(e.target.value);
                    setSelectedSlotId(newSlots[0]?.id || '');
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    color: 'var(--color-text-primary)'
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
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 700
                  }}
                >
                  {slots.map(s => (
                    <option key={s.id} value={s.id}>{s.level} • {s.slotNumber}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-bg-elevated)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '0.75rem', color: 'var(--color-status-completed)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} />
              <span>Dedicated society cleaner available at this basement cluster.</span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button fullWidth size="lg" onClick={() => setStep(3)}>Next: Add Vehicle →</Button>
            </div>
          </div>
        )}

        {/* STEP 3: Vehicle Specification */}
        {step === 3 && (
          <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Car size={22} color="var(--color-brand-primary)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Vehicle Details</h2>
            </div>
            <p style={{ fontSize: '0.8125rem', marginBottom: '20px' }}>
              Tell our specialists about your car to prepare the right microfiber cloth and solution kit.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  MAKE
                </label>
                <input
                  type="text"
                  value={make}
                  onChange={e => setMake(e.target.value)}
                  placeholder="e.g. Toyota"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    color: 'var(--color-text-primary)'
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
                  placeholder="e.g. Fortuner"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    color: 'var(--color-text-primary)'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  COLOR
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  placeholder="e.g. Pearl White"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    color: 'var(--color-text-primary)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  NUMBER PLATE
                </label>
                <input
                  type="text"
                  value={regNo}
                  onChange={e => setRegNo(e.target.value)}
                  placeholder="e.g. KA 03 MX 4492"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    color: 'var(--color-text-primary)',
                    textTransform: 'uppercase',
                    fontWeight: 700
                  }}
                />
              </div>
            </div>

            {/* Body Type Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                VEHICLE BODY SEGMENT
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {(['HATCHBACK', 'SEDAN', 'COMPACT_SUV', 'SUV_LUXURY'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setVehicleType(type)}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: vehicleType === type ? 'var(--color-brand-subtle)' : 'var(--color-bg-elevated)',
                      border: `1.5px solid ${vehicleType === type ? 'var(--color-brand-primary)' : 'var(--color-border-default)'}`,
                      color: vehicleType === type ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    {type.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button fullWidth size="lg" onClick={() => setStep(4)}>Next: Choose Plan →</Button>
            </div>
          </div>
        )}

        {/* STEP 4: Choose Plan & Confirm */}
        {step === 4 && (
          <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Sparkles size={22} color="var(--color-brand-primary)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Choose Maintenance Plan</h2>
            </div>
            <p style={{ fontSize: '0.8125rem', marginBottom: '18px' }}>
              Automated exterior care completed before 8:00 AM every morning.
            </p>

            {/* Plans List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              {plans.map(plan => {
                const isSelected = plan.id === selectedPlanId;
                const price = plan.pricing[vehicleType] || plan.pricing.SEDAN;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--color-bg-elevated)' : 'var(--color-bg-base)',
                      border: `1.5px solid ${isSelected ? 'var(--color-brand-primary)' : 'var(--color-border-subtle)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)' }}>
                        {plan.name}
                      </span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                        ₹{price}<span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>/mo</span>
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                      {plan.description}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-status-completed)', fontWeight: 600 }}>
                      ✓ {plan.frequencyLabel}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Morning Window Selection */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                PREFERRED MORNING COMPLETION WINDOW
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {['06:00 - 08:00 AM', '07:00 - 08:30 AM'].map(win => (
                  <button
                    key={win}
                    type="button"
                    onClick={() => setPreferredWindow(win)}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: preferredWindow === win ? 'var(--color-brand-subtle)' : 'var(--color-bg-elevated)',
                      border: `1.5px solid ${preferredWindow === win ? 'var(--color-brand-primary)' : 'var(--color-border-default)'}`,
                      color: preferredWindow === win ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {win}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Box */}
            <div style={{ backgroundColor: 'var(--color-bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '22px', border: '1px solid var(--color-border-default)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>ORDER SUMMARY</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.875rem' }}>
                <span>{make} {model} ({color})</span>
                <span style={{ color: 'var(--color-brand-primary)' }}>₹{planPrice}/mo</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                📍 {selectedSociety.name} • {selectedSlot?.level} #{selectedSlot?.slotNumber}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              <Button fullWidth size="lg" onClick={handleFinishOnboarding}>
                Activate Subscription (₹{planPrice})
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
