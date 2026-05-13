import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import CategoryChips from '../components/CategoryChips';
import TemplateCard from '../components/TemplateCard';
import SkeletonCard from '../components/SkeletonCard';
import PremiumModal from '../components/PremiumModal';
import ProfileUploadModal from '../components/ProfileUploadModal';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Home() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    if (user && !user.profileImage && user.authProvider !== 'guest') {
      const shown = sessionStorage.getItem('uploadShown');
      if (!shown) { setShowUpload(true); sessionStorage.setItem('uploadShown', '1'); }
    }
  }, [user]);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;
      const { data } = await api.get('/templates', { params });
      setTemplates(data);
    } catch { toast.error('Failed to load templates'); }
    finally { setLoading(false); }
  }, [category, search]);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f1a', position: 'relative', overflow: 'hidden' }}>
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <Navbar onSearch={setSearch} />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '48px 0 8px' }}>
          <h1 style={{
            fontSize: 36, fontWeight: 800, fontFamily: 'Outfit, sans-serif',
            lineHeight: 1.2, marginBottom: 12,
          }}>
            <span className="gradient-text">Create Stunning</span>
            <br />
            <span style={{ color: '#f1f5f9' }}>Greeting Cards</span>
          </h1>
          <p style={{
            fontSize: 15, color: '#94a3b8', maxWidth: 480, margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Pick a template, see your photo and name appear instantly,
            then download or share with anyone.
          </p>
        </div>

        {/* Categories */}
        <CategoryChips active={category} onChange={setCategory} />

        {/* Count */}
        {!loading && (
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
            {templates.length} template{templates.length !== 1 ? 's' : ''}
            {category ? ` in ${category}` : ''}
            {search ? ` matching "${search}"` : ''}
          </p>
        )}

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: 18,
          paddingBottom: 48,
        }}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : templates.map((t, i) => (
                <div key={t._id} className="slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <TemplateCard template={t} onPremiumClick={() => setPremiumOpen(true)} />
                </div>
              ))
          }
        </div>

        {/* Empty state */}
        {!loading && templates.length === 0 && (
          <div className="fade-in" style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>🎨</p>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', fontFamily: 'Outfit, sans-serif' }}>No templates found</h3>
            <p style={{ fontSize: 14, color: '#64748b', marginTop: 6 }}>Try a different category or search term</p>
          </div>
        )}
      </main>

      <PremiumModal isOpen={premiumOpen} onClose={() => setPremiumOpen(false)} />
      <ProfileUploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} />
    </div>
  );
}
