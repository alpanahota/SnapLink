import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <div className="animate-fade-in py-24">
          <h1 className="text-[6rem] font-extrabold text-[var(--color-accent-primary)] leading-none mb-4">404</h1>
          <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
          <p className="text-[var(--color-text-secondary)] mb-10 max-w-md mx-auto text-lg">
            Oops! The page or link you're looking for doesn't exist, has been removed, or has expired.
          </p>
          <Link to="/" className="btn btn-primary px-8 py-4">
            Go Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
