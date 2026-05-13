import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiLockClosed } from 'react-icons/hi';
import PreviewCanvas from '../components/PreviewCanvas';
import ShareButtons from '../components/ShareButtons';
import PremiumModal from '../components/PremiumModal';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function TemplatePreview() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [premiumOpen, setPremiumOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/templates/${id}`);
        if (data.isPremium && user?.subscriptionStatus !== 'premium') setPremiumOpen(true);
        setTemplate(data);
      } catch { toast.error('Template not found'); navigate('/'); }
      finally { setLoading(false); }
    };
    load();
  }, [id, navigate, user]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0f1a' }}>
      <div className="spinner" />
    </div>
  );

  if (!template) return null;
  const locked = template.isPremium && user?.subscriptionStatus !== 'premium';

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f1a', position: 'relative', overflow: 'hidden' }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Header */}
      <header className="glass-navbar" style={{ position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 14, transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#e2e8f0'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
            <HiArrowLeft /> Back
          </Link>
          <h1 style={{
            fontSize: 15, fontWeight: 600, color: '#f1f5f9', flex: 1,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            fontFamily: 'Outfit, sans-serif',
          }}>{template.title}</h1>
          {template.isPremium
            ? <span className="badge-premium">★ Pro</span>
            : <span className="badge-free">Free</span>
          }
        </div>
      </header>

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 20px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>

            {/* Canvas */}
            <div className="fade-in" style={{ position: 'relative' }}>
              <PreviewCanvas ref={canvasRef} template={template} user={user} />
              {locked && (
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(11, 15, 26, 0.8)',
                  backdropFilter: 'blur(4px)', borderRadius: 14,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
                }}>
                  <HiLockClosed className="pulse-glow" style={{ fontSize: 44, color: '#fbbf24' }} />
                  <p style={{ fontWeight: 600, color: '#f1f5f9', fontFamily: 'Outfit, sans-serif' }}>Premium Template</p>
                  <button onClick={() => setPremiumOpen(true)} className="btn btn-primary">Unlock</button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="glass-modal" style={{ padding: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 4, fontFamily: 'Outfit, sans-serif' }}>{template.title}</h2>
                <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Category: {template.category}</p>

                {user && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: 12,
                    background: 'rgba(30, 41, 59, 0.5)', borderRadius: 12, marginBottom: 16,
                    border: '1px solid rgba(148, 163, 184, 0.08)',
                  }}>
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 600, fontSize: 14,
                      }}>
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{user.name}</p>
                      <p style={{ fontSize: 12, color: '#64748b' }}>Personalized for you</p>
                    </div>
                  </div>
                )}

                {!locked && <ShareButtons canvasRef={canvasRef} templateTitle={template.title} />}
              </div>

              {!user && (
                <div className="glass-modal" style={{ padding: 20, textAlign: 'center', marginTop: 16 }}>
                  <p style={{ fontSize: 14, color: '#cbd5e1', marginBottom: 12 }}>Sign in to personalize with your photo</p>
                  <Link to="/login" className="btn btn-primary">Sign in</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <PremiumModal isOpen={premiumOpen} onClose={() => setPremiumOpen(false)} />
    </div>
  );
}
