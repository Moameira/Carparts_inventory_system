import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/parts', label: 'Parts', icon: '🔩' },
    ...(role === 'admin' ? [{ path: '/settings', label: 'Settings', icon: '⚙️' }] : []),
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0F2F5', fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: '#0F1623', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#111827', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#10B981', fontWeight: 700, fontSize: 14, letterSpacing: '-0.5px' }}>CP</span>
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '-0.3px' }}>Car<span style={{ color: '#10B981' }}>Parts</span></div>
              <div style={{ color: '#6B7280', fontSize: 11 }}>Inventory System</div>
            </div>
          </div>
        </div>

        {/* Role badge */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{
            padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: role === 'admin' ? 'rgba(99,102,241,0.15)' : 'rgba(16,185,129,0.15)',
            color: role === 'admin' ? '#818CF8' : '#10B981',
          }}>
            {role === 'admin' ? '👑 Owner' : '👷 Worker'}
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          <div style={{ color: '#4B5563', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', padding: '8px 12px', textTransform: 'uppercase' }}>Menu</div>
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  borderRadius: 8, marginBottom: 2, cursor: 'pointer',
                  background: active ? 'rgba(16,185,129,0.12)' : 'transparent',
                  color: active ? '#10B981' : '#9CA3AF',
                  fontWeight: active ? 600 : 400, fontSize: 14,
                  borderLeft: active ? '2px solid #10B981' : '2px solid transparent',
                }}>
                  {item.icon} {item.label}
                </div>
              </Link>
            );
          })}

          <div style={{ color: '#4B5563', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', padding: '16px 12px 8px', textTransform: 'uppercase' }}>General</div>
          <div onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', color: '#9CA3AF', fontSize: 14, borderLeft: '2px solid transparent' }}>
            🚪 Logout
          </div>
        </nav>

        {/* User info */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: role === 'admin' ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>
              {name ? name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ color: '#E5E7EB', fontSize: 13, fontWeight: 500 }}>{name || 'User'}</div>
              <div style={{ color: '#6B7280', fontSize: 11 }}>{role === 'admin' ? 'Administrator' : 'Warehouse Staff'}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 240, flex: 1, padding: '32px 32px', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}