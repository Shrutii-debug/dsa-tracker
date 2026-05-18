import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/patterns', label: 'Patterns' },
  { path: '/review', label: 'Review Queue' },
]

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="border-b border-gray-800 bg-gray-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/" className="font-bold text-lg text-sky-400 tracking-tight">
          DSA Tracker
        </Link>

        {/* Nav links */}
        {user && (
          <div className="flex items-center gap-1">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  location.pathname === path
                    ? 'bg-gray-800 text-sky-400'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* User info */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-400">
              <span className="text-yellow-400">🔥 {user.streak}</span>
              <span className="ml-2 text-gray-500">|</span>
              <span className="ml-2">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar