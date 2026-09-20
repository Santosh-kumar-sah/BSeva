import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSavedSchemes } from '../../context/SavedSchemesContext';
import { 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  BookOpen, 
  Compass, 
  CheckSquare, 
  FileCheck,
  Bookmark,
  ShieldCheck
} from 'lucide-react';
import SearchAutocomplete from './SearchAutocomplete';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout, language, toggleLanguage } = useAuth();
  const { savedCount } = useSavedSchemes();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Title */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-lg bg-brand flex items-center justify-center text-white font-extrabold text-xl shadow-sm group-hover:bg-brand-dark transition-colors">
              ब
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-text-primary tracking-tight group-hover:text-brand transition-colors">
                  {language === 'hi' ? 'बिहार सहायक' : 'Bihar Sahayak'}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand/10 text-brand border border-brand/20">
                  BSeva
                </span>
              </div>
              <p className="text-[11px] text-text-secondary leading-none mt-0.5 font-medium">
                {language === 'hi' ? 'सरकारी योजना एवं करियर पोर्टल' : 'Govt Scheme & Career Portal'}
              </p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-xs lg:max-w-sm">
            <SearchAutocomplete variant="navbar" showButton={false} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <Link 
              to="/schemes" 
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/schemes')
                  ? 'bg-brand/10 text-brand font-bold border border-brand/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background'
              }`}
            >
              <BookOpen className="w-4 h-4" strokeWidth={1.75} />
              <span>{language === 'hi' ? 'योजनाएं' : 'Schemes'}</span>
            </Link>

            <Link 
              to="/eligibility" 
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/eligibility')
                  ? 'bg-brand/10 text-brand font-bold border border-brand/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background'
              }`}
            >
              <CheckSquare className="w-4 h-4" strokeWidth={1.75} />
              <span>{language === 'hi' ? 'पात्रता जांच' : 'Eligibility'}</span>
            </Link>

            <Link 
              to="/documents" 
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/documents')
                  ? 'bg-brand/10 text-brand font-bold border border-brand/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background'
              }`}
            >
              <FileCheck className="w-4 h-4" strokeWidth={1.75} />
              <span>{language === 'hi' ? 'दस्तावेज़' : 'Documents'}</span>
            </Link>

            <Link 
              to="/careers" 
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/careers')
                  ? 'bg-brand/10 text-brand font-bold border border-brand/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background'
              }`}
            >
              <Compass className="w-4 h-4" strokeWidth={1.75} />
              <span>{language === 'hi' ? 'कौशल एवं करियर' : 'Careers'}</span>
            </Link>

            <Link 
              to="/saved" 
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 relative ${
                isActive('/saved')
                  ? 'bg-brand/10 text-brand font-bold border border-brand/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background'
              }`}
            >
              <Bookmark className="w-4 h-4" strokeWidth={1.75} />
              <span>{language === 'hi' ? 'सुरक्षित' : 'Saved'}</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-brand text-white leading-none">
                  {savedCount}
                </span>
              )}
            </Link>

            {isAdmin && (
              <Link 
                to="/admin" 
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive('/admin')
                    ? 'bg-brand text-white font-bold'
                    : 'text-brand hover:bg-brand/10 font-semibold'
                }`}
              >
                <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
                <span>{language === 'hi' ? 'एडमिन' : 'Admin'}</span>
              </Link>
            )}
          </nav>

          {/* Language Toggle + Auth CTA */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={toggleLanguage}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-background hover:bg-hero-bg text-text-primary transition-colors cursor-pointer"
              title="Toggle Language / भाषा बदलें"
            >
              {language === 'hi' ? 'English' : 'हिंदी'}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-brand/30 rounded-lg bg-brand/5 text-brand hover:bg-brand/10 transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>{user?.fullName?.split(' ')[0] || 'Dashboard'}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 text-text-secondary hover:text-brand hover:bg-background rounded-lg transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-brand hover:text-brand-dark px-3 py-1.5 rounded-lg hover:bg-brand/5 transition-colors"
                >
                  {language === 'hi' ? 'लॉग इन' : 'Log In'}
                </Link>
                {/* Single Solid Primary CTA */}
                <Link
                  to="/register"
                  className="bg-brand hover:bg-brand-dark text-white font-semibold px-4 py-2 rounded-lg transition-colors inline-flex items-center justify-center text-xs shadow-sm"
                >
                  {language === 'hi' ? 'पंजीकरण करें' : 'Register'}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Language */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="text-xs font-semibold px-2 py-1 rounded border border-border bg-background text-text-primary"
            >
              {language === 'hi' ? 'EN' : 'हिं'}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-text-primary hover:bg-background"
              aria-label="Toggle Navigation Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" strokeWidth={1.75} /> : <Menu className="w-6 h-6" strokeWidth={1.75} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white px-4 py-4 space-y-3 shadow-lg">
          <SearchAutocomplete 
            variant="standard" 
            showButton={false} 
            onSelect={() => setMobileOpen(false)} 
          />

          <div className="grid grid-cols-1 gap-1 text-sm font-medium pt-2">
            <Link
              to="/schemes"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isActive('/schemes') ? 'bg-brand/10 text-brand font-bold' : 'text-text-secondary hover:bg-background'
              }`}
            >
              <BookOpen className="w-5 h-5" strokeWidth={1.75} />
              <span>{language === 'hi' ? 'योजनाएं' : 'Schemes'}</span>
            </Link>

            <Link
              to="/eligibility"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isActive('/eligibility') ? 'bg-brand/10 text-brand font-bold' : 'text-text-secondary hover:bg-background'
              }`}
            >
              <CheckSquare className="w-5 h-5" strokeWidth={1.75} />
              <span>{language === 'hi' ? 'पात्रता जांच' : 'Eligibility'}</span>
            </Link>

            <Link
              to="/documents"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isActive('/documents') ? 'bg-brand/10 text-brand font-bold' : 'text-text-secondary hover:bg-background'
              }`}
            >
              <FileCheck className="w-5 h-5" strokeWidth={1.75} />
              <span>{language === 'hi' ? 'दस्तावेज़' : 'Documents'}</span>
            </Link>

            <Link
              to="/careers"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isActive('/careers') ? 'bg-brand/10 text-brand font-bold' : 'text-text-secondary hover:bg-background'
              }`}
            >
              <Compass className="w-5 h-5" strokeWidth={1.75} />
              <span>{language === 'hi' ? 'कौशल एवं करियर' : 'Careers'}</span>
            </Link>

            <Link
              to="/saved"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${
                isActive('/saved') ? 'bg-brand/10 text-brand font-bold' : 'text-text-secondary hover:bg-background'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bookmark className="w-5 h-5" strokeWidth={1.75} />
                <span>{language === 'hi' ? 'सुरक्षित योजनाएं' : 'Saved Schemes'}</span>
              </div>
              {savedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brand text-white">
                  {savedCount}
                </span>
              )}
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                  isActive('/admin') ? 'bg-brand text-white font-bold' : 'text-brand hover:bg-brand/10 font-bold'
                }`}
              >
                <ShieldCheck className="w-5 h-5" strokeWidth={1.75} />
                <span>{language === 'hi' ? 'एडमिन पैनल' : 'Admin Panel'}</span>
              </Link>
            )}
          </div>

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand/5 border border-brand/30 text-brand font-semibold text-sm"
                >
                  <UserIcon className="w-4 h-4" strokeWidth={2} />
                  <span>{user?.fullName || 'Dashboard'}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 py-2 text-text-secondary hover:text-brand font-medium text-sm cursor-pointer"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.75} />
                  <span>{language === 'hi' ? 'लॉग आउट' : 'Log Out'}</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-center rounded-lg border-2 border-brand text-brand font-semibold text-sm hover:bg-brand/5 bg-white"
                >
                  {language === 'hi' ? 'लॉग इन' : 'Log In'}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-center rounded-lg bg-brand text-white font-semibold text-sm hover:bg-brand-dark shadow-sm"
                >
                  {language === 'hi' ? 'पंजीकरण करें' : 'Register'}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
