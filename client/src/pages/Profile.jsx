import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiCamera, HiPencil, HiCheck } from 'react-icons/hi';
import Navbar from '../components/Navbar';
import PremiumModal from '../components/PremiumModal';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const fileRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [uploading, setUploading] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('profileImage', file);
      const { data } = await api.post('/users/upload-photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser({ profileImage: data.profileImage });
      toast.success('Photo updated!');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleNameSave = async () => {
    try {
      const { data } = await api.put('/users/profile', { name });
      updateUser({ name: data.name });
      setEditing(false);
      toast.success('Name updated!');
    } catch { toast.error('Update failed'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f1a', position: 'relative', overflow: 'hidden' }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <Navbar />
      <main style={{ maxWidth: 480, margin: '0 auto', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
        <div className="fade-in glass-modal" style={{ padding: 32, textAlign: 'center' }}>

          {/* Avatar */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              padding: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {user?.profileImage ? (
                <img src={user.profileImage} alt="" style={{ width: 94, height: 94, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: 94, height: 94, borderRadius: '50%', background: '#1e293b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#a78bfa', fontSize: 36, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
                }}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              style={{
                position: 'absolute', bottom: 2, right: 2, width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: 'white',
                border: '2px solid #0b0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
              <HiCamera size={14} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
          </div>

          {/* Name */}
          {editing ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input" style={{ maxWidth: 200, textAlign: 'center' }} autoFocus />
              <button onClick={handleNameSave} style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: 'white',
                border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
                <HiCheck />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Outfit, sans-serif' }}>{user?.name}</h2>
              <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <HiPencil size={16} />
              </button>
            </div>
          )}

          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20 }}>{user?.email}</p>

          {/* Subscription */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)', borderRadius: 14, padding: 14,
            display: 'inline-flex', alignItems: 'center', gap: 10,
            border: '1px solid rgba(148, 163, 184, 0.1)',
          }}>
            <span style={{ fontSize: 22 }}>{user?.subscriptionStatus === 'premium' ? '⭐' : '📦'}</span>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', textTransform: 'capitalize' }}>{user?.subscriptionStatus} Plan</p>
              <p style={{ fontSize: 12, color: '#64748b' }}>
                {user?.subscriptionStatus === 'premium' ? 'All templates unlocked' : 'Upgrade for premium templates'}
              </p>
            </div>
            {user?.subscriptionStatus !== 'premium' && (
              <button onClick={() => setPremiumOpen(true)} className="btn btn-primary" style={{ fontSize: 12, padding: '6px 14px', marginLeft: 8 }}>Upgrade</button>
            )}
          </div>
        </div>
      </main>
      <PremiumModal isOpen={premiumOpen} onClose={() => setPremiumOpen(false)} />
    </div>
  );
}
