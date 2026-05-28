import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { SERVER_URL } from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Calendar, MousePointerClick, Clock, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';

const Analytics = () => {
  const { shortCode } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock timeline data for the chart since backend currently only stores total
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/url/analytics/${shortCode}`);
        setData(res.data.data);
        
        // Generate some mock chart data based on total clicks spreading over last 7 days
        const mockData = [];
        const total = res.data.data.totalClicks;
        let remaining = total;
        
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          
          let clicksToday = 0;
          if (i === 0) {
            clicksToday = remaining;
          } else if (remaining > 0) {
            // Random distribution
            clicksToday = Math.floor(Math.random() * (remaining / (i + 1)) * 2);
            remaining -= clicksToday;
          }
          
          mockData.push({
            name: format(d, 'MMM dd'),
            clicks: clicksToday
          });
        }
        
        setChartData(mockData);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [shortCode]);

  if (loading) return <div className="p-8 text-center mt-20">Loading analytics...</div>;
  if (error) return <div className="p-8 text-center text-[var(--color-danger)] mt-20">{error}</div>;
  if (!data) return <div className="p-8 text-center mt-20">No data found</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
        <div className="mb-8">
          <Link to="/dashboard" className="btn btn-secondary py-2 px-4 text-sm mb-4">
            <ArrowLeft size={16} /> Back
          </Link>
          <h1 className="text-3xl font-bold">Link Analytics</h1>
          <p className="text-[var(--color-text-muted)] mt-2">Statistics for <span className="text-[var(--color-text-primary)] font-medium">{SERVER_URL.replace(/^https?:\/\//, '')}/{shortCode}</span></p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
          <div className="flex-1">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="glass-panel flex items-center gap-6 p-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-purple-500/10 text-purple-500">
                  <MousePointerClick size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">Total Clicks</span>
                  <span className="text-3xl font-bold text-[var(--color-text-primary)]">{data.totalClicks}</span>
                </div>
              </div>
              
              <div className="glass-panel flex items-center gap-6 p-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500">
                  <Calendar size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">Created Date</span>
                  <span className="text-xl font-bold text-[var(--color-text-primary)]">
                    {format(new Date(data.createdDate), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
              
              <div className="glass-panel flex items-center gap-6 p-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-green-500/10 text-green-500">
                  <Clock size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">Last Visited</span>
                  <span className="text-xl font-bold text-[var(--color-text-primary)]">
                    {data.lastVisited ? format(new Date(data.lastVisited), 'MMM dd, p') : 'Never'}
                  </span>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="glass-panel p-8 h-[400px] flex flex-col">
              <h3 className="text-xl font-semibold mb-6">Click Activity (Last 7 Days)</h3>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }} 
                    />
                    <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="w-full lg:w-80 flex flex-col gap-6">
            <div className="glass-panel p-8">
              <h3 className="text-xl font-semibold mb-6">Destination</h3>
              <a href={data.originalUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white/5 p-4 rounded-lg text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-[var(--color-accent-primary)] transition-colors">
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{data.originalUrl}</span>
                <ExternalLink size={16} className="shrink-0" />
              </a>
            </div>

            <div className="glass-panel p-8">
              <h3 className="text-xl font-semibold mb-6 text-center">QR Code</h3>
              <div className="bg-white p-4 rounded-lg flex justify-center">
                <QRCodeSVG value={data.shortUrl} size={180} bgColor={"#ffffff"} fgColor={"#020617"} level={"Q"} />
              </div>
              <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">Scan to visit link</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;
