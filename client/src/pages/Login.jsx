import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, googleLogin, guestLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin({ name: 'Demo User', email: 'demo@google.com', profileImage: '' });
      toast.success('Logged in with Google!');
      navigate('/');
    } catch { toast.error('Google login failed'); }
  };

  const handleGuest = async () => {
    try {
      await guestLogin();
      toast.success('Browsing as guest');
      navigate('/');
    } catch { toast.error('Guest login failed'); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, background: '#0b0f1a', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="fade-in" style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 40 }}>🎨</span>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginTop: 10, fontFamily: 'Outfit, sans-serif' }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>Sign in to your GreetCraft account</p>
        </div>

        {/* Form */}
        <div className="glass-modal" style={{ padding: 28 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com" className="input" required />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" className="input" required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(148, 163, 184, 0.12)' }} />
            <span style={{ fontSize: 12, color: '#64748b' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(148, 163, 184, 0.12)' }} />
          </div>

          {/* Social buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleGoogle} className="btn btn-outline" style={{ flex: 1 }}>
              <FcGoogle style={{ fontSize: 18 }} /> Google
            </button>
            <button onClick={handleGuest} className="btn btn-outline" style={{ flex: 1 }}>
              👤 Guest
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#94a3b8', marginTop: 20 }}>
          Don't have an account?{' '}
          <Link to="/register" className="gradient-text" style={{ fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
