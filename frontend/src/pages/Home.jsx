import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import URLForm from '../components/URLForm';
import { Zap, Shield, BarChart3 } from 'lucide-react';

const Home = () => {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 min-h-[calc(100vh-80px)] flex flex-col gap-24">
        <section className="text-center pt-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
            Shorten. Share. <span className="gradient-text">Track.</span>
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-12 leading-relaxed">
            The premium URL shortener for modern teams. Create custom links, generate QR codes, and track advanced analytics all in one beautiful dashboard.
          </p>
          
          <div className="mt-8">
            <URLForm />
          </div>
        </section>

        <section className="animate-fade-in delay-200 pb-16">
          <h2 className="text-4xl font-bold text-center mb-12">Why choose SnapLink?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 text-left transition-transform duration-300 hover:-translate-y-1">
              <div className="inline-flex p-4 rounded-xl bg-blue-500/10 mb-6">
                <Zap className="text-[var(--color-accent-primary)]" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">Generate short links instantly. Our global edge network ensures your redirects happen in milliseconds.</p>
            </div>
            
            <div className="glass-panel p-8 text-left transition-transform duration-300 hover:-translate-y-1">
              <div className="inline-flex p-4 rounded-xl bg-blue-500/10 mb-6">
                <Shield className="text-[var(--color-accent-primary)]" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Custom Aliases</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">Ditch the random strings. Create memorable, branded links that your audience trusts and clicks on.</p>
            </div>
            
            <div className="glass-panel p-8 text-left transition-transform duration-300 hover:-translate-y-1">
              <div className="inline-flex p-4 rounded-xl bg-blue-500/10 mb-6">
                <BarChart3 className="text-[var(--color-accent-primary)]" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Advanced Analytics</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">Track clicks, geographic locations, and referral sources in real-time with our intuitive dashboard.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
