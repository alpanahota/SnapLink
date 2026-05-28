const Footer = () => {
  return (
    <footer className="mt-auto bg-[var(--color-bg-glass)] backdrop-blur-md border-t border-[var(--color-border-glass)]">
      <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--color-text-muted)]">
        <p>&copy; {new Date().getFullYear()} SnapLink. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
