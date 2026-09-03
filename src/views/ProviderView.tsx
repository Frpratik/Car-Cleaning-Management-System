import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import { offlineSync } from '../services/offlineQueue';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  Camera, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  Navigation,
  X
} from 'lucide-react';

export const ProviderView: React.FC = () => {
  const jobs = store.getProviderJobs('prov_ramesh_01');
  const [activeJobId, setActiveJobId] = useState<string | null>(
    jobs.find(j => j.status === 'IN_PROGRESS' || j.status === 'SCHEDULED')?.id || jobs[0]?.id || null
  );

  // Sync state
  const [isOffline, setIsOffline] = useState(!offlineSync.isNetworkConnected());
  const [pendingQueueCount, setPendingQueueCount] = useState(offlineSync.getPendingCount());

  // Camera capture modal state
  const [cameraMode, setCameraMode] = useState<'BEFORE' | 'AFTER' | null>(null);
  const [capturedBefore, setCapturedBefore] = useState<string | null>(null);
  const [capturedAfter, setCapturedAfter] = useState<string | null>(null);

  // Exception modal state
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [exceptionReason, setExceptionReason] = useState('VEHICLE_NOT_IN_SLOT');

  useEffect(() => {
    const unsub = offlineSync.subscribe(() => {
      setPendingQueueCount(offlineSync.getPendingCount());
      setIsOffline(!offlineSync.isNetworkConnected());
    });
    return unsub;
  }, []);

  const activeJob = jobs.find(j => j.id === activeJobId) || jobs[0];
  const completedJobsCount = jobs.filter(j => j.status === 'COMPLETED').length;
  const totalJobs = jobs.length;
  const earningsToday = completedJobsCount * 22; // ₹22/car payout
  const nextJobInSequence = jobs.find(j => j.walkingSequence === (activeJob?.walkingSequence || 1) + 1);

  const toggleNetwork = () => {
    const newOnline = isOffline; // if currently offline, set online
    offlineSync.setNetworkStatus(newOnline);
  };

  const handleStartJob = (jobId: string) => {
    store.startServiceJob(jobId);
    setActiveJobId(jobId);
  };

  const handleCapturePhoto = (type: 'BEFORE' | 'AFTER') => {
    const samplePhotos = {
      BEFORE: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      AFTER: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
    };

    const capturedUrl = samplePhotos[type];
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    offlineSync.enqueuePhoto({
      jobId: activeJob.id,
      slotNumber: activeJob.slotDetails,
      type,
      photoDataUrl: capturedUrl,
      capturedAt: timestamp
    });

    if (type === 'BEFORE') {
      setCapturedBefore(capturedUrl);
    } else {
      setCapturedAfter(capturedUrl);
    }

    setCameraMode(null);
  };

  const handleCompleteJob = (jobId: string) => {
    const beforeUrl = capturedBefore || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
    const afterUrl = capturedAfter || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';

    store.completeServiceJob(jobId, {
      beforeUrl,
      afterUrl
    });

    // Reset local capture state
    setCapturedBefore(null);
    setCapturedAfter(null);

    // Auto-advance to the next scheduled job in sequence
    const remainingJobs = jobs.filter(j => j.id !== jobId && j.status === 'SCHEDULED');
    if (remainingJobs.length > 0) {
      setActiveJobId(remainingJobs[0].id);
    }
  };

  const handleMarkException = () => {
    if (activeJob) {
      store.markJobUnableToService(activeJob.id, exceptionReason);
      setShowExceptionModal(false);
      const remainingJobs = jobs.filter(j => j.id !== activeJob.id && j.status === 'SCHEDULED');
      if (remainingJobs.length > 0) {
        setActiveJobId(remainingJobs[0].id);
      }
    }
  };

  return (
    <div className="container-mobile" style={{ padding: '16px 16px 80px', backgroundColor: '#090D14' }}>
      
      {/* 1. High-Contrast Field Header */}
      <div
        style={{
          backgroundColor: '#121824',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          marginBottom: '16px',
          border: '1.5px solid #2A3C5D'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#10B981', letterSpacing: '0.05em' }}>
              ON DUTY • CHECKED IN 05:42 AM
            </div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
              Ramesh Kumar <span style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>(#AC-104)</span>
            </h1>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              Prestige Lakeside Habitat (Basement 2 Cluster)
            </div>
          </div>

          <button
            onClick={toggleNetwork}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: isOffline ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.15)',
              color: isOffline ? '#EF4444' : '#10B981',
              border: `1px solid ${isOffline ? '#EF4444' : '#10B981'}`,
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.6875rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {isOffline ? <WifiOff size={12} /> : <Wifi size={12} />}
            {isOffline ? 'Basement Offline' : 'Online Sync'}
          </button>
        </div>

        {/* Offline Queue Indicator banner if photos pending */}
        {pendingQueueCount > 0 && (
          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid #F59E0B', padding: '8px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#F59E0B' }}>
            <span>📦 {pendingQueueCount} photos saved locally in memory.</span>
            <button
              onClick={() => offlineSync.flushQueue()}
              style={{ background: 'none', border: 'none', color: '#F59E0B', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RefreshCw size={12} /> Sync Now
            </button>
          </div>
        )}

        {/* Real-Time Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
            <span style={{ color: '#F8FAFC' }}>Route Manifest: {completedJobsCount}/{totalJobs} Completed</span>
            <span style={{ color: '#10B981' }}>₹{earningsToday} Earned</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: '#1E2B43', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${totalJobs > 0 ? (completedJobsCount / totalJobs) * 100 : 0}%`,
                height: '100%',
                backgroundColor: '#10B981',
                transition: 'width 300ms ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Active Target Card (Spatial Navigation & Zero-Typing Workflow) */}
      {activeJob && (
        <div
          style={{
            backgroundColor: '#1B2232',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid #3B82F6',
            padding: '18px',
            marginBottom: '20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
          }}
        >
          {/* Top Pill with Sequence & Walking Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ backgroundColor: '#3B82F6', color: '#ffffff', fontSize: '0.6875rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                TARGET #{activeJob.walkingSequence}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Navigation size={12} color="#3B82F6" />
                {activeJob.slotDetails.split('•')[0] || 'Tower 1'}
              </span>
            </div>
            <StatusBadge status={activeJob.status} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              {activeJob.slotDetails}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#93C5FD', marginTop: '2px' }}>
              {activeJob.vehicle.color} {activeJob.vehicle.make} {activeJob.vehicle.model}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#F8FAFC', fontWeight: 800, letterSpacing: '0.05em', marginTop: '2px' }}>
              PLATE: {activeJob.vehicle.registrationNo}
            </div>
          </div>

          {/* Action State Trigger Buttons */}
          {activeJob.status === 'SCHEDULED' && (
            <Button
              fullWidth
              size="lg"
              variant="primary"
              style={{ minHeight: '56px', fontSize: '1.05rem', fontWeight: 800 }}
              onClick={() => handleStartJob(activeJob.id)}
            >
              Start Service at Slot
            </Button>
          )}

          {activeJob.status === 'IN_PROGRESS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Photo Verification Triggers */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={() => setCameraMode('BEFORE')}
                  style={{
                    backgroundColor: capturedBefore ? 'rgba(16, 185, 129, 0.15)' : '#121824',
                    border: `1.5px dashed ${capturedBefore ? '#10B981' : '#3B82F6'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 10px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Camera size={22} color={capturedBefore ? '#10B981' : '#3B82F6'} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    {capturedBefore ? 'Before Photo ✓' : 'Snap Before Photo'}
                  </span>
                </button>

                <button
                  onClick={() => setCameraMode('AFTER')}
                  style={{
                    backgroundColor: capturedAfter ? 'rgba(16, 185, 129, 0.15)' : '#121824',
                    border: `1.5px dashed ${capturedAfter ? '#10B981' : '#3B82F6'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 10px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Camera size={22} color={capturedAfter ? '#10B981' : '#10B981'} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    {capturedAfter ? 'After Photo ✓' : 'Snap After Photo'}
                  </span>
                </button>
              </div>

              {/* Quality Checklist */}
              <div style={{ backgroundColor: '#121824', padding: '10px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: '#94A3B8' }}>
                <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>Standard 3-Step Protocol:</div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: '#10B981' }}>✓ 1. Green Cloth (Body)</span>
                  <span style={{ color: '#10B981' }}>✓ 2. Glass Wipe</span>
                  <span style={{ color: '#10B981' }}>✓ 3. Tyre Gloss</span>
                </div>
              </div>

              {/* Complete Job Button */}
              <Button
                fullWidth
                size="lg"
                variant="success"
                style={{ minHeight: '56px', fontSize: '1.05rem', fontWeight: 800 }}
                onClick={() => handleCompleteJob(activeJob.id)}
              >
                ✓ Mark Complete & Next Slot
              </Button>

              {/* Exception link */}
              <button
                onClick={() => setShowExceptionModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#EF4444',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center',
                  padding: '6px'
                }}
              >
                ⚠️ Report Issue (Car Absent / Locked Bay)
              </button>
            </div>
          )}

          {activeJob.status === 'COMPLETED' && (
            <div style={{ backgroundColor: '#121824', padding: '14px', borderRadius: 'var(--radius-md)', textAlign: 'center', color: '#10B981', fontWeight: 700 }}>
              ✓ Service Completed & Verified at {activeJob.completedAt}
            </div>
          )}

          {/* Up Next Preview */}
          {nextJobInSequence && (
            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #2A3C5D', fontSize: '0.75rem', color: '#94A3B8', display: 'flex', justifyContent: 'space-between' }}>
              <span>Up Next in Walking Route:</span>
              <strong style={{ color: '#ffffff' }}>#{nextJobInSequence.walkingSequence} • {nextJobInSequence.slotDetails.split('•')[2] || nextJobInSequence.slotDetails}</strong>
            </div>
          )}
        </div>
      )}

      {/* 3. Sequential Route Manifest (Walking Order) */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#94A3B8', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Basement Route Sequence ({jobs.length} Cars)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {jobs.map(job => {
            const isActive = job.id === activeJobId;
            return (
              <div
                key={job.id}
                onClick={() => setActiveJobId(job.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? '#1B2232' : '#121824',
                  border: `1.5px solid ${isActive ? '#3B82F6' : '#1E2B43'}`,
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: job.status === 'COMPLETED' ? '#10B981' : '#1E2B43',
                      color: job.status === 'COMPLETED' ? '#090D14' : '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800
                    }}
                  >
                    {job.status === 'COMPLETED' ? '✓' : job.walkingSequence}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#ffffff' }}>
                      {job.slotDetails}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                      {job.vehicle.color} {job.vehicle.make} {job.vehicle.model} • {job.vehicle.registrationNo}
                    </div>
                  </div>
                </div>

                <StatusBadge status={job.status} size="sm" />
              </div>
            );
          })}
        </div>
      </div>

      {/* ==========================================
          MODAL: CAMERA VIEWFINDER (Simulated)
         ========================================== */}
      {cameraMode && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000000',
            zIndex: 150,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '20px 16px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 800 }}>
                {cameraMode === 'BEFORE' ? 'STEP 1: SNAP BEFORE PHOTO' : 'STEP 2: SNAP AFTER PHOTO'}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>
                {activeJob.slotDetails}
              </div>
            </div>
            <button
              onClick={() => setCameraMode(null)}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Viewfinder simulation */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '320px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '2px solid rgba(255,255,255,0.3)',
              backgroundColor: '#111827'
            }}
          >
            <img
              src={cameraMode === 'BEFORE' 
                ? 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
                : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
              }
              alt="Camera preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Cryptographic Timestamp Overlay Watermark */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                backgroundColor: 'rgba(0,0,0,0.75)',
                padding: '8px 12px',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '0.6875rem'
              }}
            >
              <div><strong>📍 {activeJob.slotDetails}</strong></div>
              <div>🕒 {new Date().toLocaleTimeString()} • Verified Geofence</div>
            </div>
          </div>

          {/* Shutter Button */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '20px' }}>
            <button
              onClick={() => handleCapturePhoto(cameraMode)}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '6px solid #3B82F6',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)',
                cursor: 'pointer'
              }}
            />
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: REPORT ISSUE
         ========================================== */}
      {showExceptionModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 100
          }}
        >
          <div
            style={{
              backgroundColor: '#121824',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #33415A',
              padding: '20px',
              maxWidth: '400px',
              width: '100%'
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px', color: '#ffffff' }}>
              Report Service Exception
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginBottom: '16px' }}>
              Select why {activeJob.slotDetails} cannot be serviced today:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
              {[
                { id: 'VEHICLE_NOT_IN_SLOT', label: 'Car Not In Slot / Empty Bay' },
                { id: 'WRONG_CAR_PARKED', label: 'Different Car Parked Here' },
                { id: 'SLOT_LOCKED_ACCESSIBLE', label: 'Basement Gate / Barrier Locked' },
                { id: 'EXTREME_DAMAGE_PREEXISTING', label: 'Heavy Pre-existing Scratch/Dent' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setExceptionReason(opt.id)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: exceptionReason === opt.id ? 'rgba(239, 68, 68, 0.15)' : '#1B2232',
                    border: `1px solid ${exceptionReason === opt.id ? '#EF4444' : '#2A3C5D'}`,
                    color: '#ffffff',
                    fontSize: '0.8125rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="outline" fullWidth onClick={() => setShowExceptionModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" fullWidth onClick={handleMarkException}>
                Submit Exception
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
