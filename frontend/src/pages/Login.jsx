import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F1623', display: 'flex', fontFamily: "'Inter', sans-serif" }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', background: 'linear-gradient(135deg, #0F1623 0%, #1a2535 100%)' }}>
        <div style={{ maxWidth: 420 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#111827', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#10B981', fontWeight: 700, fontSize: 15, letterSpacing: '-0.5px' }}>CP</span>
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Car<span style={{ color: '#10B981' }}>Parts</span></div>
              <div style={{ color: '#6B7280', fontSize: 12 }}>Inventory System</div>
            </div>
          </div>
          <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 700, margin: '0 0 12px', lineHeight: 1.2 }}>
            Manage your<br /><span style={{ color: '#10B981' }}>inventory</span> with ease
          </h1>
          <p style={{ color: '#6B7280', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            Track stock levels, manage car parts, and get alerts before you run out.
          </p>
          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '📦', text: 'Real-time stock tracking' },
              { icon: '⚠️', text: 'Automatic low-stock alerts' },
              { icon: '👷', text: 'Role-based access for workers' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{item.icon}</div>
                <span style={{ color: '#9CA3AF', fontSize: 14 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: 460, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F2F5', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>Welcome back</h2>
          <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 28 }}>Sign in to your account</p>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>{error}</div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@demo.com" required
                style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 10, padding: '11px 14px', fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#fff', color: '#111827' }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 10, padding: '11px 14px', fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#fff', color: '#111827' }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div style={{ marginTop: 16, padding: '12px 14px', background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 12, color: '#9CA3AF' }}>
            <div style={{ marginBottom: 4 }}>👑 <strong style={{ color: '#374151' }}>Admin:</strong> admin@demo.com / password123</div>
            <div>👷 <strong style={{ color: '#374151' }}>Worker:</strong> worker@demo.com / worker123</div>
          </div>
        </div>
      </div>
    </div>
  );
}