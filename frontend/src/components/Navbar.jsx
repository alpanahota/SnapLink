import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link as LinkIcon, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-bg-glass)] backdrop-blur-md border-b border-[var(--color-border-glass)]">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <LinkIcon className="text-[var(--color-accent-primary)]" />
          <span className="gradient-text">SnapLink</span>
        </Link>
        
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] transition-colors duration-150">Dashboard</Link>
              <div className="flex items-center gap-2 font-medium text-[var(--color-text-secondary)] pl-4 border-l border-[var(--color-border-glass)]">
                <User size={18} />
                <span>{user.name}</span>
                <button onClick={handleLogout} className="bg-transparent border-none cursor-pointer flex items-center p-1 ml-2 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] transition-colors duration-150" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] transition-colors duration-150">Login</Link>
              <Link to="/register" className="btn btn-primary px-4 py-2 text-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
