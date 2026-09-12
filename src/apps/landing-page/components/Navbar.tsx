import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import { logo } from '../../../assets/brand';

/**
 * The bar sits transparent over the dark hero and turns into a solid white
 * surface once you scroll past it, so the wordmark has to swap between its
 * light and dark cuts rather than being tinted with CSS.
 */
export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  // Lock the page behind the mobile sheet
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  const onDark = !isScrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-xl border-b border-dark-100 shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Wordmark */}
          <Link to="/" className="flex items-center shrink-0" aria-label="rlayAi home">
            <img
              src={onDark ? logo.fullOnDark : logo.full}
              alt="rlayAi"
              className="h-10 sm:h-11 w-auto"
              width={1200}
              height={360}
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  onDark
                    ? 'text-white/75 hover:text-white hover:bg-white/10'
                    : 'text-dark-400 hover:text-dark-500 hover:bg-primary-50'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Account actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    onDark
                      ? 'text-white hover:bg-white/10'
                      : 'text-dark-500 hover:bg-primary-50'
                  }`}
                >
                  <span className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
                    {(user.first_name?.[0] ?? user.email[0]).toUpperCase()}
                  </span>
                  <span className="max-w-[10rem] truncate">{user.first_name || user.email}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lift border border-dark-100 overflow-hidden">
                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-dark-500 hover:bg-primary-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-dark-400 hover:text-dark-500 hover:bg-primary-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    onDark
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-dark-400 hover:text-dark-500 hover:bg-primary-50'
                  }`}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className={`group inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    onDark
                      ? 'bg-white text-dark-500 hover:bg-secondary-100'
                      : 'bg-primary-500 text-white hover:bg-primary-600'
                  }`}
                >
                  Start free
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              onDark ? 'text-white hover:bg-white/10' : 'text-dark-500 hover:bg-primary-50'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-dark-100 shadow-lift">
          <div className="px-6 py-5 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-3 text-dark-500 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}

            <div className="pt-4 mt-2 border-t border-dark-100 space-y-3">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-3 bg-primary-50 rounded-xl">
                    <span className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
                      {(user.first_name?.[0] ?? user.email[0]).toUpperCase()}
                    </span>
                    <span className="font-medium text-dark-500 truncate">
                      {user.first_name || user.email}
                    </span>
                  </div>
                  <Link
                    to="/dashboard"
                    className="block py-2 text-dark-400 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full text-left py-2 text-dark-400 font-medium"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-2 text-dark-400 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-primary-500 text-white font-semibold"
                  >
                    Start free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
