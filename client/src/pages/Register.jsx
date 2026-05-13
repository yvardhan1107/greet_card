import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, background: '#0b0f1a', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="fade-in" style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 40 }}>🎨</span>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginTop: 10, fontFamily: 'Outfit, sans-serif' }}>Create account</h1>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>Start making personalized greeting cards</p>
        </div>

        <div className="glass-modal" style={{ padding: 28 }}>
          <form onSubmit={handleSubmit}>
            {[
              { label: 'Full Name', key: 'name', type: 'text', ph: 'John Doe' },
              { label: 'Email', key: 'email', type: 'email', ph: 'you@example.com' },
              { label: 'Password', key: 'password', type: 'password', ph: 'Min. 6 characters' },
              { label: 'Confirm Password', key: 'confirm', type: 'password', ph: 'Repeat password' },
            ].map(({ label, key, type, ph }) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>{label}</label>
                <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={ph} className="input" required minLength={key === 'password' ? 6 : undefined} />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: 4 }}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#94a3b8', marginTop: 20 }}>
          Already have an account?{' '}
          <Link to="/login" className="gradient-text" style={{ fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
