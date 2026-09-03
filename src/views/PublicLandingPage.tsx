import React, { useState } from 'react';
import { ApiClient } from '../services/apiClient';
import { Button } from '../components/ui/Button';
import { 
  Sparkles, 
  Building2, 
  Car, 
  Wrench, 
  Droplets, 
  Clock, 
  Camera, 
  CheckCircle2, 
  ArrowRight,
  X,
  Send
} from 'lucide-react';

interface PublicLandingPageProps {
  onOpenLogin: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({ onOpenLogin }) => {
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form State
  const [societyName, setSocietyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [estimatedUnits, setEstimatedUnits] = useState(400);
  const [message, setMessage] = useState('');

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await ApiClient.submitEnquiry({
      societyName,
      contactPerson,
      email,
      phoneNumber,
      city,
      estimatedUnits: Number(estimatedUnits),
      message
    });

    setIsSubmitting(false);
    setSubmittedSuccess(true);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090D14', color: '#F8FAFC' }}>
      
      {/* 1. Public Top Navigation */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: 'rgba(9, 13, 20, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #1E2B43',
          padding: '16px 24px'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(59, 130, 246, 0.5)'
              }}
            >
              <Sparkles size={20} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                AuraCar <span style={{ fontSize: '0.75rem', backgroundColor: '#1E2B43', color: '#3B82F6', padding: '2px 6px', borderRadius: '4px', border: '1px solid #2A3C5D' }}>OS</span>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setShowEnquiryModal(true)}
              style={{
                backgroundColor: 'transparent',
                color: '#93C5FD',
                border: '1px solid #2A3C5D',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Bring to Your Society
            </button>

            <Button
              variant="primary"
              size="md"
              onClick={onOpenLogin}
              style={{ fontWeight: 800 }}
            >
              Sign In to Portal
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid #2563EB',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.8125rem',
            color: '#60A5FA',
            fontWeight: 700,
            marginBottom: '24px'
          }}
        >
          <Building2 size={14} />
          <span>The Operating System for Residential Society Car Maintenance</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '20px',
            color: '#ffffff'
          }}
        >
          Turn Morning Car Cleaning Into an <span style={{ color: '#3B82F6' }}>Invisible Utility</span> For Your Society.
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#94A3B8',
            lineHeight: 1.6,
            maxWidth: '780px',
            margin: '0 auto 36px'
          }}
        >
          Eliminate daily friction with unorganized local cleaners. AuraCar provides background-verified specialists, 100% waterless eco-formulas, basement walking-sequence routes, and cryptographic photo proof before 8:00 AM.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowEnquiryModal(true)}
            style={{
              backgroundColor: '#3B82F6',
              color: '#ffffff',
              border: 'none',
              padding: '16px 28px',
              borderRadius: '8px',
              fontSize: '1.05rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)'
            }}
          >
            Bring Car Care to Your Society <ArrowRight size={18} />
          </button>

          <button
            onClick={onOpenLogin}
            style={{
              backgroundColor: '#161F30',
              color: '#F8FAFC',
              border: '1.5px solid #2A3C5D',
              padding: '16px 24px',
              borderRadius: '8px',
              fontSize: '1.05rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Access Society Portal
          </button>
        </div>

        {/* Badges / Metrics bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '60px', textAlign: 'left' }}>
          <div style={{ backgroundColor: '#121824', padding: '20px', borderRadius: '12px', border: '1px solid #1E2B43' }}>
            <Droplets size={24} color="#3B82F6" style={{ marginBottom: '10px' }} />
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>100% Waterless</div>
            <div style={{ fontSize: '0.8125rem', color: '#94A3B8', marginTop: '4px' }}>Saves 120L per car per wash. Zero basement slurry or water puddles.</div>
          </div>

          <div style={{ backgroundColor: '#121824', padding: '20px', borderRadius: '12px', border: '1px solid #1E2B43' }}>
            <Clock size={24} color="#10B981" style={{ marginBottom: '10px' }} />
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>5:30 AM – 8:00 AM</div>
            <div style={{ fontSize: '0.8125rem', color: '#94A3B8', marginTop: '4px' }}>Completed before morning office departure. Never miss a commute.</div>
          </div>

          <div style={{ backgroundColor: '#121824', padding: '20px', borderRadius: '12px', border: '1px solid #1E2B43' }}>
            <Camera size={24} color="#A855F7" style={{ marginBottom: '10px' }} />
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>Verified Photo Proof</div>
            <div style={{ fontSize: '0.8125rem', color: '#94A3B8', marginTop: '4px' }}>High-resolution Before & After photos timestamped to your designated parking slot.</div>
          </div>
        </div>
      </section>

      {/* 3. Three Pillars (Society, Resident, Cleaner) */}
      <section style={{ backgroundColor: '#0D131F', padding: '80px 24px', borderTop: '1px solid #1E2B43', borderBottom: '1px solid #1E2B43' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>Engineered for Every Stakeholder</h2>
            <p style={{ color: '#94A3B8', fontSize: '1rem', marginTop: '8px' }}>A complete platform aligning RWA management, vehicle owners, and cleaning professionals.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* For Societies & RWAs */}
            <div style={{ backgroundColor: '#121824', padding: '30px', borderRadius: '14px', border: '1.5px solid #2A3C5D' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', padding: '10px', borderRadius: '8px' }}>
                  <Building2 size={24} color="#3B82F6" />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>For Societies & RWAs</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: '#CBD5E1' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Zero Water Waste:</strong> Complies with Karnataka & Municipal groundwater restrictions.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Basement Cleanliness:</strong> No dirty bucket runoff or tyre marks on epoxy flooring.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Security Vetting:</strong> Cleaners are police-verified, uniformed, and tagged to slots.</span>
                </li>
              </ul>
            </div>

            {/* For Residents */}
            <div style={{ backgroundColor: '#121824', padding: '30px', borderRadius: '14px', border: '1.5px solid #2A3C5D' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: '8px' }}>
                  <Car size={24} color="#10B981" />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>For Car Owners</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: '#CBD5E1' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Spotless Morning Commute:</strong> Vehicle clean every day by 8:00 AM sharp.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Vacation Pause:</strong> Pauses shift your billing renewal automatically (+5 days free).</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Scratch Protection:</strong> Soft lubricated formula prevents swirl marks.</span>
                </li>
              </ul>
            </div>

            {/* For Service Providers */}
            <div style={{ backgroundColor: '#121824', padding: '30px', borderRadius: '14px', border: '1.5px solid #2A3C5D' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', padding: '10px', borderRadius: '8px' }}>
                  <Wrench size={24} color="#A855F7" />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>For Service Providers</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: '#CBD5E1' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>High Hourly Earnings:</strong> Earn ₹18,000–₹24,000 for just 2.5 hours of morning work.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Optimized Walking Routes:</strong> Clean 28 cars sequentially without wasting transit time.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Dignity of Labor:</strong> Branded uniforms, microfibers, and automated UPI payouts.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CTA Banner */}
      <section style={{ padding: '80px 24px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', marginBottom: '16px' }}>
          Ready to Upgrade Your Society's Vehicle Care?
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '1.1rem', marginBottom: '32px' }}>
          Schedule a live demonstration or request an RWA onboarding pilot for your residential community today.
        </p>
        <button
          onClick={() => setShowEnquiryModal(true)}
          style={{
            backgroundColor: '#3B82F6',
            color: '#ffffff',
            border: 'none',
            padding: '16px 36px',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(59, 130, 246, 0.5)'
          }}
        >
          Request Society Pilot
        </button>
      </section>

      {/* 5. Footer */}
      <footer style={{ borderTop: '1px solid #1E2B43', padding: '30px 24px', textAlign: 'center', fontSize: '0.8125rem', color: '#64748B' }}>
        <div>© 2026 AuraCar Precision Car Care OS. Built for gated residential communities.</div>
      </footer>

      {/* ==========================================
          MODAL: INBOUND SOCIETY LEAD CAPTURE
         ========================================== */}
      {showEnquiryModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ backgroundColor: '#121824', borderRadius: '16px', border: '1.5px solid #2A3C5D', maxWidth: '520px', width: '100%', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={20} color="#3B82F6" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>Bring AuraCar to Your Society</h3>
              </div>
              <button onClick={() => setShowEnquiryModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {submittedSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>Enquiry Received!</h4>
                <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginBottom: '24px' }}>
                  Our enterprise team will reach out to <strong>{contactPerson}</strong> at <strong>{phoneNumber}</strong> within 24 hours to schedule an RWA demonstration for <strong>{societyName}</strong>.
                </p>
                <Button fullWidth onClick={() => { setShowEnquiryModal(false); setSubmittedSuccess(false); }}>Close</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmitEnquiry}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>SOCIETY / APARTMENT NAME *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Prestige Lakeside Habitat"
                      value={societyName}
                      onChange={e => setSocietyName(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff', fontSize: '0.875rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>CONTACT PERSON *</label>
                      <input
                        type="text"
                        required
                        placeholder="Your Name / RWA Role"
                        value={contactPerson}
                        onChange={e => setContactPerson(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>CITY *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bengaluru"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff', fontSize: '0.875rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>PHONE NUMBER *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>EMAIL ADDRESS *</label>
                      <input
                        type="email"
                        required
                        placeholder="rwa@society.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff', fontSize: '0.875rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>APPROX. NUMBER OF FLATS / CARS</label>
                    <input
                      type="number"
                      placeholder="e.g. 450"
                      value={estimatedUnits}
                      onChange={e => setEstimatedUnits(Number(e.target.value))}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff', fontSize: '0.875rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>ADDITIONAL NOTES (OPTIONAL)</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. We have 3 basement levels and 600 cars..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', backgroundColor: '#1B2232', border: '1px solid #2A3C5D', color: '#ffffff', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button variant="outline" fullWidth onClick={() => setShowEnquiryModal(false)} type="button">Cancel</Button>
                  <Button variant="primary" fullWidth type="submit" isLoading={isSubmitting} leftIcon={<Send size={16} />}>
                    Submit Enquiry
                  </Button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
