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
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Copy, 
  Check, 
  Sparkles,
  Rocket
} from 'lucide-react';

interface SocietyOnboardingWizardProps {
  societyId: string;
  onComplete: () => void;
  onExit: () => void;
}

export const SocietyOnboardingWizard: React.FC<SocietyOnboardingWizardProps> = ({
  societyId,
  onComplete,
  onExit
}) => {
  const society = store.getSocieties().find(s => s.id === societyId) || store.getSocieties()[0];
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form States
  const [towerName, setTowerName] = useState('Tower 4 (Maple)');
  const [towerFloors, setTowerFloors] = useState(24);
  const [towersList, setTowersList] = useState(['Tower 1 (Oak)', 'Tower 2 (Pine)', 'Tower 3 (Cedar)']);

  const [slotLevel, setSlotLevel] = useState('Basement 2');
  const [slotNumber, setSlotNumber] = useState('B2-108');
  const [walkingSequence, setWalkingSequence] = useState(5);
  const [slotsList, setSlotsList] = useState([
    { level: 'Basement 2', number: 'B2-104', seq: 1 },
    { level: 'Basement 2', number: 'B2-105', seq: 2 },
    { level: 'Basement 2', number: 'B2-106', seq: 3 }
  ]);

  const [copiedLink, setCopiedLink] = useState(false);

  const inviteLink = `${window.location.origin}/join/${society?.code || 'PLH-BLR'}`;

  const handleAddTower = () => {
    if (towerName.trim()) {
      setTowersList([...towersList, towerName.trim()]);
      store.addTower(society.id, towerName.trim(), Number(towerFloors));
      setTowerName('');
    }
  };

  const handleAddSlot = () => {
    if (slotNumber.trim()) {
      setSlotsList([...slotsList, { level: slotLevel, number: slotNumber.trim(), seq: Number(walkingSequence) }]);
      setSlotNumber('');
      setWalkingSequence(walkingSequence + 1);
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const steps = [
    { num: 1, label: 'Society Profile', icon: Building2 },
    { num: 2, label: 'Building Towers', icon: Layers },
    { num: 3, label: 'Parking Levels', icon: MapPin },
    { num: 4, label: 'Slots & Routing', icon: MapPin },
    { num: 5, label: 'Service Plans', icon: Sparkles },
    { num: 6, label: 'Cleaners Roster', icon: Wrench },
    { num: 7, label: 'Resident Invites', icon: Users },
    { num: 8, label: 'Time Windows', icon: Clock },
    { num: 9, label: 'Launch Society', icon: Rocket }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090D14', color: '#F8FAFC', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-brand-primary)', letterSpacing: '0.05em' }}>
              RWA INITIAL SETUP WIZARD
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Welcome to {society.name}</h1>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>Complete the 9-step configuration checklist before opening resident subscriptions.</p>
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
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Step 1: Society Details & Water Policy</h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginBottom: '20px' }}>
                Verify your residential community's core details and water management regulations.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>SOCIETY NAME</label>
                  <input type="text" readOnly value={society.name} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>TENANT CODE</label>
                  <input type="text" readOnly value={society.code} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#60A5FA', fontWeight: 800 }} />
                </div>
              </div>

              <div style={{ backgroundColor: '#1B2232', padding: '16px', borderRadius: '8px', border: '1px solid #2A3C5D', marginBottom: '20px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#10B981', marginBottom: '4px' }}>
                  ✓ Waterless Exterior Cleaning Policy Mandated
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  In accordance with RWA by-laws and Municipal groundwater restrictions, traditional hose/bucket washing is prohibited. AuraCar certified technicians use polymer-lubricated waterless formulas exclusively.
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BUILDING TOWERS */}
          {currentStep === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-brand-primary)' }}>
                <Layers size={20} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Step 2: Add Building Towers & Wings</h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginBottom: '20px' }}>
                Configure the towers where residents live so their vehicles map to the nearest parking elevators.
              </p>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Tower Name (e.g. Tower 4 Maple)"
                  value={towerName}
                  onChange={e => setTowerName(e.target.value)}
                  style={{ flex: 2, padding: '10px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff' }}
                />
                <input
                  type="number"
                  placeholder="Floors"
                  value={towerFloors}
                  onChange={e => setTowerFloors(Number(e.target.value))}
                  style={{ width: '100px', padding: '10px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff' }}
                />
                <Button variant="primary" onClick={handleAddTower}>Add Tower</Button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {towersList.map((t, i) => (
                  <div key={i} style={{ backgroundColor: '#1B2232', padding: '8px 14px', borderRadius: '6px', border: '1px solid #2A3C5D', fontSize: '0.8125rem', fontWeight: 700 }}>
                    🏢 {t}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: PARKING LEVELS */}
          {currentStep === 3 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-brand-primary)' }}>
                <MapPin size={20} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Step 3: Parking Structures</h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginBottom: '20px' }}>
                Select the parking levels active in {society.name}:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {['Basement 1 (B1)', 'Basement 2 (B2)', 'Basement 3 (B3)', 'Podium Level', 'Open Surface Bay'].map((lvl, idx) => (
                  <div key={idx} style={{ padding: '14px', backgroundColor: '#1B2232', borderRadius: '8px', border: '1px solid #10B981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="#10B981" />
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{lvl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: SLOTS & WALKING ROUTE */}
          {currentStep === 4 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-brand-primary)' }}>
                <MapPin size={20} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Step 4: Parking Slots & Spatial Walking Sequence</h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginBottom: '20px' }}>
                Cleaners walk the basement in ascending sequence order (*1 $\rightarrow$ 2 $\rightarrow$ 3*), saving 25+ minutes of traversal every morning.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr auto', gap: '10px', marginBottom: '16px' }}>
                <select
                  value={slotLevel}
                  onChange={e => setSlotLevel(e.target.value)}
                  style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff' }}
                >
                  <option value="Basement 1">Basement 1</option>
                  <option value="Basement 2">Basement 2</option>
                  <option value="Podium">Podium</option>
                </select>

                <input
                  type="text"
                  placeholder="Slot # (e.g. B2-108)"
                  value={slotNumber}
                  onChange={e => setSlotNumber(e.target.value)}
                  style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff' }}
                />

                <input
                  type="number"
                  placeholder="Walking Seq #"
                  value={walkingSequence}
                  onChange={e => setWalkingSequence(Number(e.target.value))}
                  style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff' }}
                />

                <Button variant="primary" onClick={handleAddSlot}>Add Slot</Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                {slotsList.map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#1B2232', borderRadius: '4px', fontSize: '0.8125rem' }}>
                    <span><strong>Slot #{s.number}</strong> ({s.level})</span>
                    <span style={{ color: 'var(--color-brand-primary)', fontWeight: 700 }}>Walking Seq #{s.seq}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: SERVICE PLANS */}
          {currentStep === 5 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-brand-primary)' }}>
                <Sparkles size={20} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Step 5: Active Service Plans & Pricing</h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginBottom: '20px' }}>
                These subscription packages will be presented to residents during onboarding:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ backgroundColor: '#1B2232', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-brand-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                    <span>Daily Pure-Gloss Exterior</span>
                    <span style={{ color: 'var(--color-brand-primary)' }}>₹1,099/mo</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>Mon-Sat 6x weekly waterless clean + tyre sidewall gloss.</div>
                </div>

                <div style={{ backgroundColor: '#1B2232', padding: '16px', borderRadius: '8px', border: '1px solid #2A3C5D' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                    <span>Alternate Days Maintenance</span>
                    <span style={{ color: 'var(--color-brand-primary)' }}>₹799/mo</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>Mon-Wed-Fri 3x weekly exterior polish & glass wipe.</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: CLEANERS ROSTER */}
          {currentStep === 6 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-brand-primary)' }}>
                <Wrench size={20} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Step 6: Assigned Cleaner Professionals</h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginBottom: '20px' }}>
                Dedicated specialists assigned to {society.name} (Max capacity: 28 cars per pro for 5:30 AM – 8:00 AM window):
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ backgroundColor: '#1B2232', padding: '14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>Ramesh Kumar (Badge #AC-104)</div>
                    <div style={{ fontSize: '0.75rem', color: '#10B981' }}>✓ Aadhaar Verified • Police Clearance OK • Basement 2 Cluster</div>
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--color-brand-primary)' }}>⭐ 4.92 / 5.0</div>
                </div>

                <div style={{ backgroundColor: '#1B2232', padding: '14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>Suresh Gowda (Badge #AC-108)</div>
                    <div style={{ fontSize: '0.75rem', color: '#10B981' }}>✓ Aadhaar Verified • Police Clearance OK • Basement 1 Cluster</div>
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--color-brand-primary)' }}>⭐ 4.88 / 5.0</div>
                </div>
              </div>
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
                Share this secure onboarding link with your society's MyGate, NoBrokerHood, or WhatsApp group:
              </p>

              <div style={{ backgroundColor: '#1B2232', padding: '18px', borderRadius: '8px', border: '1.5px solid #3B82F6', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '6px' }}>RESIDENT JOIN LINK FOR {society.name.toUpperCase()}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <code style={{ fontSize: '0.9375rem', color: '#60A5FA', fontWeight: 700, wordBreak: 'break-all' }}>
                    {inviteLink}
                  </code>
                  <Button size="sm" variant="primary" leftIcon={copiedLink ? <Check size={14} /> : <Copy size={14} />} onClick={copyInviteLink}>
                    {copiedLink ? 'Copied ✓' : 'Copy Link'}
                  </Button>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                🔒 <strong>Controlled Access:</strong> Only residents using this link will be mapped to {society.name} towers and slots.
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

              <div style={{ backgroundColor: '#1B2232', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                  <span>Primary Morning Slot:</span>
                  <span style={{ color: '#10B981' }}>05:30 AM – 08:00 AM</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>All vehicles completed before residents start morning school/office commutes.</div>
              </div>
            </div>
          )}

          {/* STEP 9: LAUNCH SOCIETY */}
          {currentStep === 9 && (
            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Rocket size={36} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px' }}>Ready to Launch Operations!</h3>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', maxWidth: '500px', margin: '0 auto 24px' }}>
                Towers, slots, plans, and cleaner assignments are verified. Click below to activate {society.name} on the AuraCar platform.
              </p>

              <Button size="lg" variant="success" onClick={onComplete} style={{ minHeight: '52px', fontSize: '1.05rem', fontWeight: 800 }}>
                🚀 Launch Society Operations
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
