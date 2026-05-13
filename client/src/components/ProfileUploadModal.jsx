import { useState, useRef } from 'react';
import { HiCamera, HiX } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ProfileUploadModal({ isOpen, onClose }) {
  const { user, updateUser } = useAuth();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  if (!isOpen) return null;

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setPreview({ file, url: URL.createObjectURL(file) });
  };

  const handleUpload = async () => {
    if (!preview?.file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('profileImage', preview.file);
      const { data } = await api.post('/users/upload-photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser({ profileImage: data.profileImage });
      toast.success('Photo uploaded!');
      onClose();
    } catch { toast.error('Upload failed'); }
    finally { setLoading(false); }
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
      <div onClick={(e) => e.stopPropagation()} className="fade-in glass-modal"
        style={{ position: 'relative', width: '100%', maxWidth: 340, padding: 28, textAlign: 'center' }}>

        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#64748b' }}>
          <HiX size={18} />
        </button>

        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 4, fontFamily: 'Outfit, sans-serif' }}>Add your photo</h3>
        <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>It'll appear on your greeting cards</p>

        <div onClick={() => fileRef.current?.click()}
          style={{
            width: 100, height: 100, borderRadius: '50%',
            border: '2px dashed rgba(148, 163, 184, 0.25)',
            margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', overflow: 'hidden',
            background: 'rgba(30, 41, 59, 0.5)',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#7c3aed'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.25)'}>
          {preview?.url
            ? <img src={preview.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <HiCamera style={{ fontSize: 28, color: '#64748b' }} />
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Skip</button>
          <button onClick={handleUpload} disabled={!preview || loading} className="btn btn-primary" style={{ flex: 1 }}>
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}
