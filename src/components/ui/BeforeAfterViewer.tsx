import React, { useState } from 'react';
import { ServiceProof } from '../../types';
import { ShieldCheck } from 'lucide-react';

interface BeforeAfterViewerProps {
  proof: ServiceProof;
  vehicleName: string;
  slotDetails: string;
}

export const BeforeAfterViewer: React.FC<BeforeAfterViewerProps> = ({
  proof,
  vehicleName,
  slotDetails
}) => {
  const [activeTab, setActiveTab] = useState<'AFTER' | 'BEFORE' | 'SPLIT'>('SPLIT');
  const [sliderPos, setSliderPos] = useState<number>(50);

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-subtle)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--color-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-bg-elevated)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="var(--color-status-completed)" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
              {vehicleName} Verified Proof
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              {slotDetails} • Duration: {proof.durationMinutes} mins
            </div>
          </div>
        </div>

        {/* View mode toggle */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--color-bg-base)',
            padding: '2px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border-subtle)'
          }}
        >
          {(['SPLIT', 'AFTER', 'BEFORE'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setActiveTab(mode)}
              style={{
                background: activeTab === mode ? 'var(--color-brand-primary)' : 'transparent',
                color: activeTab === mode ? '#ffffff' : 'var(--color-text-secondary)',
                border: 'none',
                padding: '4px 8px',
                fontSize: '0.6875rem',
                fontWeight: 700,
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Image Container */}
      <div
        style={{
          position: 'relative',
          height: '240px',
          backgroundColor: '#000000',
          overflow: 'hidden',
          userSelect: 'none'
        }}
      >
        {activeTab === 'SPLIT' && (
          <>
            {/* After (Background) */}
            <img
              src={proof.afterPhotoUrl}
              alt="After Service"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Before (Foreground clipped) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: `${sliderPos}%`,
                overflow: 'hidden',
                borderRight: '2px solid #ffffff'
              }}
            >
              <img
                src={proof.beforePhotoUrl}
                alt="Before Service"
                style={{ width: '100%', height: '240px', objectFit: 'cover', maxWidth: 'none' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(0,0,0,0.75)',
                  color: '#ffffff',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em'
                }}
              >
                BEFORE • {proof.beforeTakenAt}
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.9)',
                color: '#090D14',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '0.6875rem',
                fontWeight: 800,
                letterSpacing: '0.05em'
              }}
            >
              AFTER • {proof.afterTakenAt}
            </div>

            {/* Range Slider for Interaction */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={e => setSliderPos(Number(e.target.value))}
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10%',
                width: '80%',
                zIndex: 10,
                accentColor: 'var(--color-brand-primary)'
              }}
            />
          </>
        )}

        {activeTab === 'AFTER' && (
          <div style={{ position: 'relative', height: '100%' }}>
            <img
              src={proof.afterPhotoUrl}
              alt="After Service"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: '4px 10px',
                borderRadius: '4px',
                color: '#10B981',
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              CLEANED & INSPECTED • {proof.afterTakenAt}
            </div>
          </div>
        )}

        {activeTab === 'BEFORE' && (
          <div style={{ position: 'relative', height: '100%' }}>
            <img
              src={proof.beforePhotoUrl}
              alt="Before Service"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: '4px 10px',
                borderRadius: '4px',
                color: '#94A3B8',
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              INITIAL ARRIVAL • {proof.beforeTakenAt}
            </div>
          </div>
        )}
      </div>

      {/* Verification Footer with cryptographic stamp */}
      <div
        style={{
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.6875rem',
          color: 'var(--color-text-muted)',
          backgroundColor: 'var(--color-bg-surface)'
        }}
      >
        <span>{proof.watermarkHash}</span>
        <span style={{ color: 'var(--color-status-completed)', fontWeight: 600 }}>
          ✓ Verified Geofence Match
        </span>
      </div>
    </div>
  );
};
