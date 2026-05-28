import { useState } from 'react';
import api, { SERVER_URL } from '../api';
import { Copy, Check, ArrowRight } from 'lucide-react';

const URLForm = ({ onShortened }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.post('/url/shorten', {
        originalUrl,
        customAlias: customAlias || undefined
      });
      
      const shortUrl = `${SERVER_URL}/${res.data.data.shortCode}`;
      setResult({ ...res.data.data, shortUrl });
      if (onShortened) onShortened(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto glass-panel animate-fade-in w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <input
            type="url"
            required
            className="input-field py-4 px-6 text-lg rounded-xl"
            placeholder="Paste your long link here..."
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-row items-center bg-slate-900/80 border border-[var(--color-border-glass)] rounded-lg px-4">
            <span className="text-[var(--color-text-muted)] select-none">snap.link/</span>
            <input
              type="text"
              className="flex-1 bg-transparent border-none py-3 px-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-0"
              placeholder="custom-alias (optional)"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary py-3 px-8 text-lg" disabled={loading}>
            {loading ? 'Shortening...' : 'Shorten'}
            <ArrowRight size={18} />
          </button>
        </div>
        
        {error && <div className="text-[var(--color-danger)] text-sm text-center mt-2">{error}</div>}
      </form>

      {result && (
        <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in delay-100">
          <div className="text-xl font-semibold break-all text-[var(--color-accent-primary)]">
            <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">
              {result.shortUrl}
            </a>
          </div>
          <button onClick={handleCopy} className="btn btn-secondary w-full md:w-auto">
            {copied ? <Check size={18} color="var(--color-success)" /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
};

export default URLForm;
