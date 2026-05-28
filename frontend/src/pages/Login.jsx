import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="glass-panel w-full max-w-md p-10 flex flex-col animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
          <p className="text-[var(--color-text-secondary)] text-center mb-10">Sign in to manage your links</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">Email</label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">Password</label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && <div className="text-[var(--color-danger)] text-sm">{error}</div>}
            
            <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
            <p>Don't have an account? <Link to="/register" className="font-semibold text-[var(--color-accent-primary)] hover:text-[var(--color-accent-secondary)] transition-colors ml-1">Sign up</Link></p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
