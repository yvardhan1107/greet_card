import { useState } from 'react';
import { HiX, HiCheck } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const plans = [
  { id: 'monthly', label: 'Monthly', price: '₹99', period: '/mo' },
  { id: 'yearly', label: 'Yearly', price: '₹799', period: '/yr', tag: 'Best value' },
  { id: 'lifetime', label: 'Lifetime', price: '₹1,499', period: 'once' },
];

const perks = ['All premium templates', 'HD downloads', 'No watermarks', 'New templates first', 'Ad-free experience'];

export default function PremiumModal({ isOpen, onClose }) {
  const { updateUser } = useAuth();
  const [selected, setSelected] = useState('yearly');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      await api.post('/subscription/upgrade', { plan: selected });
      updateUser({ subscriptionStatus: 'premium' });
      toast.success('Welcome to Premium! 🎉');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upgrade failed');
    } finally { setLoading(false); }
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
      <div onClick={(e) => e.stopPropagation()} className="fade-in glass-modal"
        style={{ position: 'relative', width: '100%', maxWidth: 420, padding: 28 }}>

        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#64748b' }}>
          <HiX size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: 36 }}>⭐</span>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginTop: 8, fontFamily: 'Outfit, sans-serif' }}>Unlock Premium</h2>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Access all templates and features</p>
        </div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
          {plans.map((p) => (
            <button key={p.id} onClick={() => setSelected(p.id)}
              style={{
                padding: 12, borderRadius: 14, textAlign: 'center', cursor: 'pointer',
                position: 'relative', transition: 'all 0.2s',
                border: '1px solid',
                borderColor: selected === p.id ? '#7c3aed' : 'rgba(148, 163, 184, 0.12)',
                background: selected === p.id ? 'rgba(124, 58, 237, 0.15)' : 'rgba(30, 41, 59, 0.4)',
              }}>
              {p.tag && <span style={{
                position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: 'white',
                fontSize: 9, fontWeight: 700, padding: '2px 10px', borderRadius: 100,
              }}>{p.tag}</span>}
              <p style={{ fontSize: 12, color: '#94a3b8' }}>{p.label}</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: '4px 0 2px' }}>{p.price}</p>
              <p style={{ fontSize: 11, color: '#64748b' }}>{p.period}</p>
            </button>
          ))}
        </div>

        {/* Perks */}
        <div style={{ marginBottom: 20 }}>
          {perks.map((p) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0' }}>
              <HiCheck style={{ color: '#34d399', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#cbd5e1' }}>{p}</span>
            </div>
          ))}
        </div>

        <button onClick={handleUpgrade} disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
          {loading ? 'Processing...' : 'Upgrade now'}
        </button>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#64748b', marginTop: 10 }}>Simulated payment · Cancel anytime</p>
      </div>
    </div>
  );
}
