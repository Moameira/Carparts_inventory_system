import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Settings() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchWorkers = async () => {
    const res = await api.get('/users');
    setWorkers(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchWorkers(); }, []);

  const handleCreate = async () => {
    setError('');
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required.');
      return;
    }
    try {
      await api.post('/users', form);
      setSuccess('Worker account created!');
      setShowModal(false);
      setForm({ name: '', email: '', password: '' });
      fetchWorkers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete worker account for ${name}?`)) return;
    await api.delete(`/users/${id}`);
    fetchWorkers();
  };

  const inputStyle = { width: '100%', border: '1px solid #E5E7EB', borderRadius: 8, padding: '9px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#F9FAFB', color: '#111827' };
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Settings</h1>
        <p style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>Manage worker accounts and access</p>
      </div>

      {success && (
        <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', borderRadius: 10, padding: '10px 16px', fontSize: 13, marginBottom: 16 }}>
          ✅ {success}
        </div>
      )}

      {/* Worker accounts section */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 600, color: '#111827', fontSize: 15 }}>Warehouse Workers</div>
            <div style={{ color: '#9CA3AF', fontSize: 13 }}>{workers.length} active worker {workers.length === 1 ? 'account' : 'accounts'}</div>
          </div>
          <button onClick={() => { setShowModal(true); setError(''); }} style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            + Add Worker
          </button>
        </div>

        {loading ? (
          <div style={{ color: '#9CA3AF', fontSize: 14, padding: '20px 0' }}>Loading...</div>
        ) : workers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>👷</div>
            <div style={{ fontSize: 14 }}>No worker accounts yet.</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Add your first warehouse worker above.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {workers.map(worker => (
              <div key={worker.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 15, fontWeight: 700 }}>
                    {worker.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#111827', fontSize: 14 }}>{worker.name}</div>
                    <div style={{ color: '#9CA3AF', fontSize: 12 }}>{worker.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                    👷 Worker
                  </span>
                  <button onClick={() => handleDelete(worker.id, worker.name)} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #FEE2E2', background: '#FEF2F2', color: '#EF4444', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info box */}
      <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12, padding: '16px 20px' }}>
        <div style={{ fontWeight: 600, color: '#1D4ED8', fontSize: 14, marginBottom: 8 }}>ℹ️ Worker Permissions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            '✅ View all parts and stock levels',
            '✅ Update stock quantities (IN/OUT)',
            '✅ See low-stock alerts',
            '❌ Cannot see prices or inventory value',
            '❌ Cannot add, edit, or delete parts',
            '❌ Cannot access Settings',
          ].map(item => (
            <div key={item} style={{ fontSize: 13, color: '#1E40AF' }}>{item}</div>
          ))}
        </div>
      </div>

      {/* Add Worker Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(2px)' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Add Worker Account</h2>
            <p style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 20 }}>Create a new warehouse worker account</p>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>{error}</div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Klaus Müller" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="e.g. worker@company.de" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min. 8 characters" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={handleCreate} style={{ flex: 1, background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Create Account
              </button>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, background: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}