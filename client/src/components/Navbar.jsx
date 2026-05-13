import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiSearch, HiLogout, HiUser } from 'react-icons/hi';

export default function Navbar({ onSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleSearch = (val) => {
    setQuery(val);
    if (onSearch) onSearch(val);
  };

  return (
    <nav className="glass-navbar" style={{ position: 'sticky', top: 0, zIndex: 40 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', height: 64, gap: 16 }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 20 }}>
          <span style={{ fontSize: 24 }}>🎨</span>
          <span className="gradient-text">GreetCraft</span>
        </Link>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 420, margin: '0 auto', position: 'relative' }}>
          <HiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 16 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search templates..."
            className="input"
            style={{ paddingLeft: 38, height: 40, fontSize: 13, borderRadius: 100 }}
          />
        </div>

        {/* Right side */}
        {user ? (
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(148, 163, 184, 0.12)',
                padding: '5px 12px 5px 5px', borderRadius: 100,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.12)'}
            >
              {user.profileImage ? (
                <img src={user.profileImage} alt="" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 13, fontWeight: 600,
                }}>
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <span style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>{user.name}</span>
            </button>

            {menuOpen && (
              <div className="fade-in glass-modal" style={{
                position: 'absolute', right: 0, top: '100%', marginTop: 8,
                width: 220, padding: '6px 0', zIndex: 50,
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{user.name}</p>
                  <p style={{ fontSize: 12, color: '#64748b' }}>{user.email}</p>
                </div>
                <Link to="/profile" onClick={() => setMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', fontSize: 14, color: '#cbd5e1', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(124, 58, 237, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <HiUser /> Profile
                </Link>
                <button onClick={() => { logout(); navigate('/login'); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
                    fontSize: 14, color: '#f87171', width: '100%', background: 'none',
                    border: 'none', textAlign: 'left', transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(248, 113, 113, 0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <HiLogout /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/login" className="btn btn-outline" style={{ padding: '8px 18px', fontSize: 13, borderRadius: 100 }}>Log in</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 13, borderRadius: 100 }}>Sign up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
