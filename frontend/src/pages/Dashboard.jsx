import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { SERVER_URL } from '../api';
import URLForm from '../components/URLForm';
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  Settings, 
  LogOut,
  MousePointerClick,
  Activity,
  Trash2,
  Copy,
  BarChart2,
  QrCode
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [urls, setUrls] = useState([]);
  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0 });
  const [loading, setLoading] = useState(true);
  const [qrModal, setQrModal] = useState({ isOpen: false, url: '' });

  const fetchUrls = async () => {
    try {
      const res = await api.get('/url/all');
      const userUrls = res.data.data.filter(u => u.user === user._id || u.user === user.id || !u.user);
      
      setUrls(userUrls);
      
      const totalClicks = userUrls.reduce((acc, curr) => acc + curr.clicks, 0);
      setStats({
        totalLinks: userUrls.length,
        totalClicks
      });
    } catch (err) {
      console.error('Failed to fetch URLs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchUrls();
    }
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        await api.delete(`/url/${id}`);
        fetchUrls();
      } catch (err) {
        alert('Failed to delete URL');
      }
    }
  };

  const handleCopy = (shortCode) => {
    const url = `${SERVER_URL}/${shortCode}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-primary)]">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col fixed h-screen z-40 bg-[var(--color-bg-glass)] backdrop-blur-md border-r border-[var(--color-border-glass)]">
        <div className="p-8 flex items-center gap-3 text-2xl font-bold border-b border-[var(--color-border-glass)]">
          <LinkIcon className="text-[var(--color-accent-primary)]" size={24} />
          <span className="gradient-text">SnapLink</span>
        </div>
        
        <nav className="p-8 flex flex-col gap-2 flex-1">
          <Link to="/dashboard" className="flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all duration-150 bg-blue-500/10 text-[var(--color-accent-primary)]">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/dashboard" className="flex items-center gap-4 px-4 py-3 rounded-lg font-medium text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)] transition-all duration-150">
            <LinkIcon size={20} />
            <span>My Links</span>
          </Link>
          <Link to="/dashboard" className="flex items-center gap-4 px-4 py-3 rounded-lg font-medium text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)] transition-all duration-150">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>
        
        <div className="p-6 border-t border-[var(--color-border-glass)]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] flex items-center justify-center font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <span className="font-semibold text-[var(--color-text-primary)]">{user?.name}</span>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center justify-center gap-4 px-4 py-3 rounded-lg font-medium transition-all duration-150 text-[var(--color-danger)] hover:bg-red-500/10 w-full mt-4">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 md:p-12 max-w-[calc(100vw-256px)]">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link to="/" className="btn btn-secondary">Go to Home</Link>
        </header>

        {/* Stats Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="glass-panel flex items-center gap-6 p-6">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500">
              <LinkIcon size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">Total Links</span>
              <span className="text-3xl font-bold text-[var(--color-text-primary)]">{stats.totalLinks}</span>
            </div>
          </div>
          
          <div className="glass-panel flex items-center gap-6 p-6">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-purple-500/10 text-purple-500">
              <MousePointerClick size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">Total Clicks</span>
              <span className="text-3xl font-bold text-[var(--color-text-primary)]">{stats.totalClicks}</span>
            </div>
          </div>
          
          <div className="glass-panel flex items-center gap-6 p-6">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-green-500/10 text-green-500">
              <Activity size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">Avg. Clicks/Link</span>
              <span className="text-3xl font-bold text-[var(--color-text-primary)]">
                {stats.totalLinks > 0 ? (stats.totalClicks / stats.totalLinks).toFixed(1) : 0}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 animate-fade-in delay-100">
          <h2 className="text-2xl font-bold mb-6">Create New Link</h2>
          <URLForm onShortened={fetchUrls} />
        </div>

        <div className="mt-12 animate-fade-in delay-200">
          <h2 className="text-2xl font-bold mb-6">Your Links</h2>
          
          <div className="glass-panel overflow-x-auto">
            {loading ? (
              <div className="text-center p-8">Loading links...</div>
            ) : urls.length === 0 ? (
              <div className="text-center p-8 text-[var(--color-text-muted)]">No links found. Create one above!</div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 md:p-6 text-sm font-semibold text-[var(--color-text-secondary)] border-b border-[var(--color-border-glass)]">Short Link</th>
                    <th className="text-left p-4 md:p-6 text-sm font-semibold text-[var(--color-text-secondary)] border-b border-[var(--color-border-glass)]">Original URL</th>
                    <th className="text-left p-4 md:p-6 text-sm font-semibold text-[var(--color-text-secondary)] border-b border-[var(--color-border-glass)]">Clicks</th>
                    <th className="text-left p-4 md:p-6 text-sm font-semibold text-[var(--color-text-secondary)] border-b border-[var(--color-border-glass)]">Created</th>
                    <th className="text-left p-4 md:p-6 text-sm font-semibold text-[var(--color-text-secondary)] border-b border-[var(--color-border-glass)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {urls.map(url => (
                    <tr key={url._id}>
                      <td className="p-4 md:p-6 border-b border-white/5 align-middle">
                        <a href={`${SERVER_URL}/${url.shortCode}`} target="_blank" rel="noreferrer" className="font-medium text-[var(--color-accent-primary)] hover:text-[var(--color-accent-secondary)] transition-colors">
                          {SERVER_URL.replace(/^https?:\/\//, '')}/{url.shortCode}
                        </a>
                      </td>
                      <td className="p-4 md:p-6 border-b border-white/5 align-middle">
                        <div className="max-w-[250px] whitespace-nowrap overflow-hidden text-ellipsis text-[var(--color-text-secondary)]" title={url.originalUrl}>
                          {url.originalUrl}
                        </div>
                      </td>
                      <td className="p-4 md:p-6 border-b border-white/5 align-middle">
                        <div className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-sm font-semibold">
                          <MousePointerClick size={14} />
                          {url.clicks}
                        </div>
                      </td>
                      <td className="p-4 md:p-6 border-b border-white/5 align-middle text-[var(--color-text-secondary)]">
                        {formatDistanceToNow(new Date(url.createdAt), { addSuffix: true })}
                      </td>
                      <td className="p-4 md:p-6 border-b border-white/5 align-middle">
                        <div className="flex gap-2">
                          <button onClick={() => handleCopy(url.shortCode)} className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 border border-[var(--color-border-glass)] text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-[var(--color-text-primary)] transition-colors" title="Copy">
                            <Copy size={16} />
                          </button>
                          <button 
                            onClick={() => setQrModal({ isOpen: true, url: `${SERVER_URL}/${url.shortCode}` })} 
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 border border-[var(--color-border-glass)] text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-[var(--color-text-primary)] transition-colors" 
                            title="QR Code"
                          >
                            <QrCode size={16} />
                          </button>
                          <Link to={`/analytics/${url.shortCode}`} className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 border border-[var(--color-border-glass)] text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-[var(--color-text-primary)] transition-colors" title="Analytics">
                            <BarChart2 size={16} />
                          </Link>
                          <button onClick={() => handleDelete(url._id)} className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 border border-[var(--color-border-glass)] text-[var(--color-text-secondary)] hover:bg-red-500/10 hover:text-[var(--color-danger)] hover:border-red-500/20 transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* QR Modal */}
      {qrModal.isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]" onClick={() => setQrModal({ isOpen: false, url: '' })}>
          <div className="glass-panel p-8 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-center text-xl font-bold mb-6">QR Code</h3>
            <div className="bg-white p-4 rounded-lg flex justify-center">
              <QRCodeSVG value={qrModal.url} size={200} bgColor={"#ffffff"} fgColor={"#020617"} level={"Q"} />
            </div>
            <p className="text-center mt-6 text-sm text-[var(--color-text-muted)] break-all">{qrModal.url}</p>
            <button className="btn btn-secondary w-full mt-6" onClick={() => setQrModal({ isOpen: false, url: '' })}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
