import React, { useState } from 'react';
import { store } from '../services/store';
import { Button } from '../components/ui/Button';
import { 
  Building2, 
  Layers, 
  MapPin, 
  Wrench, 
  Users, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  Copy, 
  Check, 
  Sparkles,
  Rocket,
  Plus,
  Trash2
} from 'lucide-react';

interface SocietyOnboardingWizardProps {
  societyId?: string;
  onComplete: () => void;
  onExit: () => void;
}

export const SocietyOnboardingWizard: React.FC<SocietyOnboardingWizardProps> = ({
  societyId,
  onComplete,
  onExit
}) => {
  const allSocieties = store.getSocieties();
  const society = allSocieties.find(s => s.id === societyId) || allSocieties[0] || {
    id: `soc_${Date.now()}`,
    name: 'New Society',
    code: 'SOC-BLR',
    addressLine: '',
    locality: '',
    city: 'Bengaluru',
    pincode: '',
    waterPolicy: 'WATERLESS_ONLY',
    totalApartments: 500,
    activeCarsCount: 0
  };

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Society Info State
  const [societyName, setSocietyName] = useState(society.name || '');
  const [societyCode, setSocietyCode] = useState(society.code || '');
  const [waterPolicy, setWaterPolicy] = useState('WATERLESS_ONLY');

  // Step 2: Towers State (Starts 100% EMPTY)
  const [towerName, setTowerName] = useState('');
  const [towerFloors, setTowerFloors] = useState<number | ''>('');
  const [towersList, setTowersList] = useState<{ id: string; name: string; floors: number }[]>([]);

  // Step 3: Parking Structures State (Starts with selectable options, all unselected or user created)
  const [selectedStructures, setSelectedStructures] = useState<string[]>([]);
  const [customStructure, setCustomStructure] = useState('');

  // Step 4: Slots State (Starts 100% EMPTY)
  const [slotLevel, setSlotLevel] = useState('');
  const [slotNumber, setSlotNumber] = useState('');
  const [walkingSequence, setWalkingSequence] = useState<number | ''>(1);
  const [slotsList, setSlotsList] = useState<{ level: string; number: string; seq: number }[]>([]);

  // Step 5: Service Plans Pricing (Customizable by user)
  const [dailyPrice, setDailyPrice] = useState(1099);
  const [altPrice, setAltPrice] = useState(799);
  const [weeklyPrice, setWeeklyPrice] = useState(499);

  // Step 6: Cleaners Roster (Starts 100% EMPTY)
  const [cleanerName, setCleanerName] = useState('');
  const [cleanerPhone, setCleanerPhone] = useState('');
  const [cleanerBadge, setCleanerBadge] = useState('');
  const [cleanersList, setCleanersList] = useState<{ name: string; phone: string; badge: string }[]>([]);

  // Step 7: Resident Link
  const [copiedLink, setCopiedLink] = useState(false);
  const inviteLink = `${window.location.origin}/join/${societyCode || society.code || 'SOC-BLR'}`;

  // Step 8: Time Windows
  const [startTime, setStartTime] = useState('05:30 AM');
  const [endTime, setEndTime] = useState('08:00 AM');

  // Handlers
  const handleAddTower = () => {
    if (towerName.trim()) {
      const newTower = {
        id: `tow_${Date.now()}`,
        name: towerName.trim(),
        floors: Number(towerFloors) || 20
      };
      setTowersList([...towersList, newTower]);
      store.addTower(society.id, newTower.name, newTower.floors);
      setTowerName('');
      setTowerFloors('');
    }
  };

  const handleRemoveTower = (index: number) => {
    setTowersList(towersList.filter((_, i) => i !== index));
  };

  const toggleStructure = (struct: string) => {
    if (selectedStructures.includes(struct)) {
      setSelectedStructures(selectedStructures.filter(s => s !== struct));
    } else {
      setSelectedStructures([...selectedStructures, struct]);
      if (!slotLevel) setSlotLevel(struct);
    }
  };

  const handleAddCustomStructure = () => {
    if (customStructure.trim() && !selectedStructures.includes(customStructure.trim())) {
      setSelectedStructures([...selectedStructures, customStructure.trim()]);
      if (!slotLevel) setSlotLevel(customStructure.trim());
      setCustomStructure('');
    }
  };

  const handleAddSlot = () => {
    if (slotNumber.trim()) {
      const level = slotLevel || selectedStructures[0] || 'Basement 1';
      const seq = Number(walkingSequence) || slotsList.length + 1;
      const newSlot = {
        level,
        number: slotNumber.trim(),
        seq
      };
      setSlotsList([...slotsList, newSlot]);
      const activeTower = towersList[0];
      if (activeTower) {
        store.addSlot(activeTower.id, level, newSlot.number, newSlot.seq);
      }
      setSlotNumber('');
      setWalkingSequence(seq + 1);
    }
  };

  const handleRemoveSlot = (index: number) => {
    setSlotsList(slotsList.filter((_, i) => i !== index));
  };

  const handleAddCleaner = () => {
    if (cleanerName.trim()) {
      const newCleaner = {
        name: cleanerName.trim(),
        phone: cleanerPhone.trim() || '9845000000',
        badge: cleanerBadge.trim() || `AC-${Math.floor(100 + Math.random() * 900)}`
      };
      setCleanersList([...cleanersList, newCleaner]);
      store.addProvider({
        userId: `usr_${Date.now()}`,
        fullName: newCleaner.name,
        phoneNumber: newCleaner.phone,
        badgeNumber: newCleaner.badge,
        assignedSocietyId: society.id,
        assignedSocietyName: societyName || society.name,
        ratingAverage: 5.0,
        totalJobsDone: 0,
        isOnline: true,
        checkInTime: '05:30 AM'
      });
      setCleanerName('');
      setCleanerPhone('');
      setCleanerBadge('');
    }
  };

  const handleRemoveCleaner = (index: number) => {
    setCleanersList(cleanersList.filter((_, i) => i !== index));
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleFinishLaunch = () => {
    if (!allSocieties.some(s => s.id === society.id)) {
      store.addSociety({
        name: societyName || 'Residential Complex',
        code: societyCode || 'SOC-BLR',
        addressLine: '',
        locality: '',
        city: 'Bengaluru',
        pincode: '',
        waterPolicy: waterPolicy as any,
        totalApartments: 500
      });
    }
    onComplete();
  };

  const steps = [
    { num: 1, label: 'Profile', icon: Building2 },
    { num: 2, label: 'Towers', icon: Layers },
    { num: 3, label: 'Levels', icon: MapPin },
    { num: 4, label: 'Slots', icon: MapPin },
    { num: 5, label: 'Plans', icon: Sparkles },
    { num: 6, label: 'Cleaners', icon: Wrench },
    { num: 7, label: 'Invites', icon: Users },
    { num: 8, label: 'Windows', icon: Clock },
    { num: 9, label: 'Launch', icon: Rocket }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090D14', color: '#F8FAFC', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-brand-primary)', letterSpacing: '0.05em' }}>
              RWA INITIAL SETUP WIZARD (STEP-BY-STEP CONFIGURATION)
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Society Onboarding: {societyName || society.name}</h1>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>Set up your residential complex from scratch before opening resident registrations.</p>
          </div>
          <button
            onClick={onExit}
            style={{ backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#94A3B8', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Exit Setup
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div style={{ backgroundColor: '#121824', borderRadius: '12px', border: '1px solid #1E2B43', padding: '14px 18px', marginBottom: '28px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', minWidth: '600px', gap: '8px' }}>
            {steps.map(s => {
              const isCompleted = s.num < currentStep;
              const isCurrent = s.num === currentStep;
              return (
                <div
                  key={s.num}
                  onClick={() => setCurrentStep(s.num)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    opacity: isCurrent || isCompleted ? 1 : 0.4
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? '#10B981' : isCurrent ? 'var(--color-brand-primary)' : '#1B2232',
                      color: isCompleted ? '#090D14' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      border: `1.5px solid ${isCurrent ? '#60A5FA' : 'transparent'}`
                    }}
                  >
                    {isCompleted ? <Check size={16} /> : s.num}
                  </div>
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, color: isCurrent ? '#60A5FA' : '#94A3B8', textAlign: 'center' }}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Step Content Box */}
        <div style={{ backgroundColor: '#121824', borderRadius: '14px', border: '1.5px solid #2A3C5D', padding: '28px', marginBottom: '24px' }}>
          
          {/* STEP 1: SOCIETY PROFILE */}
          {currentStep === 1 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-brand-primary)' }}>
                <Building2 size={20} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Step 1: Enter Society Profile & Water Policy</h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginBottom: '20px' }}>
                Define your residential complex identification and water management rule.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>SOCIETY NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prestige Sunrise Park"
                    value={societyName}
                    onChange={e => setSocietyName(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>TENANT CODE *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PSP-BLR"
                    value={societyCode}
                    onChange={e => setSocietyCode(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#60A5FA', fontWeight: 800 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>WATER MANAGEMENT POLICY</label>
                <select
                  value={waterPolicy}
                  onChange={e => setWaterPolicy(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff' }}
                >
                  <option value="WATERLESS_ONLY">100% Waterless Eco-Formula Mandate (Zero Groundwater Drain)</option>
                  <option value="LOW_WATER">Low-Water Microfiber Washing</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: BUILDING TOWERS (100% USER-ADDED) */}
          {currentStep === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-brand-primary)' }}>
                <Layers size={20} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Step 2: Add Building Towers & Wings</h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginBottom: '20px' }}>
                Enter each residential tower in your complex. Residents will select their tower when registering their vehicle.
              </p>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Enter Tower Name (e.g. Tower 1 Oak, Wing A)"
                  value={towerName}
                  onChange={e => setTowerName(e.target.value)}
                  style={{ flex: 2, padding: '10px 14px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff' }}
                />
                <input
                  type="number"
                  placeholder="Floors (e.g. 24)"
                  value={towerFloors}
                  onChange={e => setTowerFloors(e.target.value ? Number(e.target.value) : '')}
                  style={{ width: '120px', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff' }}
                />
                <Button variant="primary" leftIcon={<Plus size={16} />} onClick={handleAddTower}>
                  Add Tower
                </Button>
              </div>

              {towersList.length === 0 ? (
                <div style={{ padding: '24px', backgroundColor: '#161F30', borderRadius: '8px', border: '1px dashed #2A3C5D', textAlign: 'center', color: '#94A3B8', fontSize: '0.8125rem' }}>
                  No towers added yet. Use the inputs above to add your society towers.
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {towersList.map((t, i) => (
                    <div key={i} style={{ backgroundColor: '#1B2232', padding: '10px 14px', borderRadius: '8px', border: '1px solid #2A3C5D', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>🏢 {t.name} ({t.floors} Floors)</span>
                      <button onClick={() => handleRemoveTower(i)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: PARKING STRUCTURES (USER SELECTS / ADDS) */}
          {currentStep === 3 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-brand-primary)' }}>
                <MapPin size={20} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Step 3: Configure Parking Levels</h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginBottom: '20px' }}>
                Select or add the parking levels active in {societyName || society.name}:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {['Basement 1', 'Basement 2', 'Basement 3', 'Podium Level', 'Surface Bay'].map((lvl, idx) => {
                  const isChecked = selectedStructures.includes(lvl);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStructure(lvl)}
                      style={{
                        padding: '14px',
                        backgroundColor: isChecked ? 'rgba(16, 185, 129, 0.15)' : '#1B2232',
                        borderRadius: '8px',
                        border: `1.5px solid ${isChecked ? '#10B981' : '#2A3C5D'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      <input type="checkbox" checked={isChecked} onChange={() => {}} />
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: isChecked ? '#6EE7B7' : '#CBD5E1' }}>{lvl}</span>
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Level */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Or enter a custom level (e.g. Multi-level MLCP 2)"
                  value={customStructure}
                  onChange={e => setCustomStructure(e.target.value)}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff' }}
                />
                <Button variant="outline" leftIcon={<Plus size={16} />} onClick={handleAddCustomStructure}>
                  Add Custom Level
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: SLOTS & ROUTING (100% USER-ADDED) */}
          {currentStep === 4 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-brand-primary)' }}>
                <MapPin size={20} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Step 4: Add Parking Slots & Walking Order</h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginBottom: '20px' }}>
                Add parking slots with their sequential walking order (*Seq 1 $\rightarrow$ Seq 2*) so cleaners follow an optimized path.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr auto', gap: '10px', marginBottom: '16px' }}>
                <select
                  value={slotLevel}
                  onChange={e => setSlotLevel(e.target.value)}
                  style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff' }}
                >
                  {(selectedStructures.length > 0 ? selectedStructures : ['Basement 1', 'Basement 2', 'Podium Level']).map((s, i) => (
                    <option key={i} value={s}>{s}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Slot # (e.g. B1-101)"
                  value={slotNumber}
                  onChange={e => setSlotNumber(e.target.value)}
                  style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff' }}
                />

                <input
                  type="number"
                  placeholder="Walking Seq #"
                  value={walkingSequence}
                  onChange={e => setWalkingSequence(e.target.value ? Number(e.target.value) : '')}
                  style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff' }}
                />

                <Button variant="primary" leftIcon={<Plus size={16} />} onClick={handleAddSlot}>
                  Add Slot
                </Button>
              </div>

              {slotsList.length === 0 ? (
                <div style={{ padding: '24px', backgroundColor: '#161F30', borderRadius: '8px', border: '1px dashed #2A3C5D', textAlign: 'center', color: '#94A3B8', fontSize: '0.8125rem' }}>
                  No parking slots added yet. Use the inputs above to add slots.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                  {slotsList.map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#1B2232', borderRadius: '6px', fontSize: '0.8125rem' }}>
                      <span><strong>Slot #{s.number}</strong> ({s.level})</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ color: 'var(--color-brand-primary)', fontWeight: 700 }}>Walking Seq #{s.seq}</span>
                        <button onClick={() => handleRemoveSlot(idx)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 5: SERVICE PLANS PRICING (USER CAN CUSTOMIZE) */}
          {currentStep === 5 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-brand-primary)' }}>
                <Sparkles size={20} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Step 5: Set Service Subscription Pricing</h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginBottom: '20px' }}>
                Set monthly subscription pricing offered to residents of {societyName || society.name}:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div style={{ backgroundColor: '#1B2232', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-brand-primary)' }}>
                  <div style={{ fontWeight: 800, marginBottom: '6px', fontSize: '0.875rem' }}>Daily Pure-Gloss Exterior</div>
                  <div style={{ fontSize: '0.6875rem', color: '#94A3B8', marginBottom: '12px' }}>6x weekly clean + tyre gloss.</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 700, color: '#CBD5E1' }}>₹</span>
                    <input
                      type="number"
                      value={dailyPrice}
                      onChange={e => setDailyPrice(Number(e.target.value))}
                      style={{ width: '90px', padding: '6px', borderRadius: '6px', backgroundColor: '#121824', border: '1px solid #2A3C5D', color: '#ffffff', fontWeight: 800, fontSize: '0.8125rem' }}
                    />
                    <span style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>/ mo</span>
                  </div>
                </div>

                <div style={{ backgroundColor: '#1B2232', padding: '16px', borderRadius: '8px', border: '1px solid #2A3C5D' }}>
                  <div style={{ fontWeight: 800, marginBottom: '6px', fontSize: '0.875rem' }}>Alternate Days Care</div>
                  <div style={{ fontSize: '0.6875rem', color: '#94A3B8', marginBottom: '12px' }}>3x weekly exterior wipe.</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 700, color: '#CBD5E1' }}>₹</span>
                    <input
                      type="number"
                      value={altPrice}
                      onChange={e => setAltPrice(Number(e.target.value))}
                      style={{ width: '90px', padding: '6px', borderRadius: '6px', backgroundColor: '#121824', border: '1px solid #2A3C5D', color: '#ffffff', fontWeight: 800, fontSize: '0.8125rem' }}
                    />
                    <span style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>/ mo</span>
                  </div>
                </div>

                <div style={{ backgroundColor: '#1B2232', padding: '16px', borderRadius: '8px', border: '1px solid #2A3C5D' }}>
                  <div style={{ fontWeight: 800, marginBottom: '6px', fontSize: '0.875rem' }}>Weekly Deep Clean</div>
                  <div style={{ fontSize: '0.6875rem', color: '#94A3B8', marginBottom: '12px' }}>4x deep maintenance.</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 700, color: '#CBD5E1' }}>₹</span>
                    <input
                      type="number"
                      value={weeklyPrice}
                      onChange={e => setWeeklyPrice(Number(e.target.value))}
                      style={{ width: '90px', padding: '6px', borderRadius: '6px', backgroundColor: '#121824', border: '1px solid #2A3C5D', color: '#ffffff', fontWeight: 800, fontSize: '0.8125rem' }}
                    />
                    <span style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>/ mo</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: CLEANERS ROSTER (100% USER-ADDED) */}
          {currentStep === 6 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-brand-primary)' }}>
                <Wrench size={20} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Step 6: Assign Cleaning Specialists</h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginBottom: '20px' }}>
                Add dedicated cleaning specialists who will service vehicles in {societyName || society.name}:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr auto', gap: '10px', marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="Cleaner Full Name (e.g. Ramesh Kumar)"
                  value={cleanerName}
                  onChange={e => setCleanerName(e.target.value)}
                  style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff' }}
                />
                <input
                  type="text"
                  placeholder="Phone (e.g. 9845012345)"
                  value={cleanerPhone}
                  onChange={e => setCleanerPhone(e.target.value)}
                  style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff' }}
                />
                <input
                  type="text"
                  placeholder="Badge # (e.g. AC-104)"
                  value={cleanerBadge}
                  onChange={e => setCleanerBadge(e.target.value)}
                  style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff' }}
                />
                <Button variant="primary" leftIcon={<Plus size={16} />} onClick={handleAddCleaner}>
                  Add Cleaner
                </Button>
              </div>

              {cleanersList.length === 0 ? (
                <div style={{ padding: '24px', backgroundColor: '#161F30', borderRadius: '8px', border: '1px dashed #2A3C5D', textAlign: 'center', color: '#94A3B8', fontSize: '0.8125rem' }}>
                  No cleaners assigned yet. Use the inputs above to assign cleaning professionals.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {cleanersList.map((c, idx) => (
                    <div key={idx} style={{ backgroundColor: '#1B2232', padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>{c.name} (Badge #{c.badge})</div>
                        <div style={{ fontSize: '0.75rem', color: '#10B981' }}>📞 {c.phone} • Assigned to {societyName || society.name}</div>
                      </div>
                      <button onClick={() => handleRemoveCleaner(idx)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 7: RESIDENT INVITES */}
          {currentStep === 7 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-brand-primary)' }}>
                <Users size={20} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Step 7: Controlled Resident Onboarding Link</h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginBottom: '20px' }}>
                Share this secure onboarding link with residents in your society's MyGate, NoBrokerHood, or WhatsApp group:
              </p>

              <div style={{ backgroundColor: '#1B2232', padding: '18px', borderRadius: '8px', border: '1.5px solid #3B82F6', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '6px' }}>RESIDENT JOIN LINK FOR {(societyName || society.name).toUpperCase()}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <code style={{ fontSize: '0.9375rem', color: '#60A5FA', fontWeight: 700, wordBreak: 'break-all' }}>
                    {inviteLink}
                  </code>
                  <Button size="sm" variant="primary" leftIcon={copiedLink ? <Check size={14} /> : <Copy size={14} />} onClick={copyInviteLink}>
                    {copiedLink ? 'Copied ✓' : 'Copy Link'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: OPERATIONAL TIME WINDOWS */}
          {currentStep === 8 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-brand-primary)' }}>
                <Clock size={20} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Step 8: Morning Execution Windows</h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginBottom: '20px' }}>
                Set standard operating windows for cleanings in the basement:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>SERVICE START TIME</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>SERVICE END TIME (BEFORE COMMUTES)</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: LAUNCH SOCIETY */}
          {currentStep === 9 && (
            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Rocket size={36} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px' }}>Launch Society Operations!</h3>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', maxWidth: '500px', margin: '0 auto 24px' }}>
                Your custom configured towers, parking levels, slots, pricing plans, and assigned cleaners are ready. Click below to activate {societyName || society.name}.
              </p>

              <Button size="lg" variant="success" onClick={handleFinishLaunch} style={{ minHeight: '52px', fontSize: '1.05rem', fontWeight: 800 }}>
                🚀 Complete Setup & Launch Operations
              </Button>
            </div>
          )}

        </div>

        {/* Wizard Bottom Navigation Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {currentStep > 1 ? (
            <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => setCurrentStep(currentStep - 1)}>
              Previous Step
            </Button>
          ) : <div />}

          {currentStep < 9 && (
            <Button variant="primary" rightIcon={<ArrowRight size={16} />} onClick={() => setCurrentStep(currentStep + 1)}>
              Save & Next Step
            </Button>
          )}
        </div>

      </div>
    </div>
  );
};
