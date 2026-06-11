import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-lg font-semibold text-gray-800">🔧 CarParts Inventory</span>
          <div className="flex gap-4">
            <Link
              to="/"
              className={`text-sm font-medium ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Dashboard
            </Link>
            <Link
              to="/parts"
              className={`text-sm font-medium ${location.pathname === '/parts' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Parts
            </Link>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-red-600 font-medium"
        >
          Logout
        </button>
      </nav>

      {/* Page content */}
      <main className="p-6 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}