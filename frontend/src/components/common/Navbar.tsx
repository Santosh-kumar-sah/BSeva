import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          
          {/* Logo & Platform Title */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-lg shadow-sm">
              ब
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-text-primary tracking-tight">
                  {language === 'hi' ? 'बिहार सहायक' : 'Bihar Sahayak'}
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-hero-bg text-text-secondary border border-border">
                  BSeva
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-none mt-0.5">
                {language === 'hi' ? 'सरकारी योजना एवं करियर पोर्टल' : 'Govt Scheme & Career Portal'}
              </p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-xs lg:max-w-sm">
            <SearchAutocomplete variant="navbar" showButton={false} />
          </div>

          {/* Desktop Navigation Links (Max 4-5 items) */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-text-secondary">
            <Link 
              to="/schemes" 
              className="px-3 py-2 rounded-lg hover:text-text-primary hover:bg-background transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" strokeWidth={1.5} />
              <span>{language === 'hi' ? 'योजनाएं' : 'Schemes'}</span>
            </Link>

            <Link 
              to="/eligibility" 
              className="px-3 py-2 rounded-lg hover:text-text-primary hover:bg-background transition-colors flex items-center gap-2"
            >
              <CheckSquare className="w-5 h-5" strokeWidth={1.5} />
              <span>{language === 'hi' ? 'पात्रता जांच' : 'Eligibility'}</span>
            </Link>

            <Link 
              to="/documents" 
              className="px-3 py-2 rounded-lg hover:text-text-primary hover:bg-background transition-colors flex items-center gap-2"
            >
              <FileCheck className="w-5 h-5" strokeWidth={1.5} />
              <span>{language === 'hi' ? 'दस्तावेज़' : 'Documents'}</span>
            </Link>

            <Link 
              to="/careers" 
              className="px-3 py-2 rounded-lg hover:text-text-primary hover:bg-background transition-colors flex items-center gap-2"
            >
              <Compass className="w-5 h-5" strokeWidth={1.5} />
              <span>{language === 'hi' ? 'कौशल एवं करियर' : 'Careers'}</span>
            </Link>

            <Link 
              to="/saved" 
              className="px-3 py-2 rounded-lg hover:text-text-primary hover:bg-background transition-colors flex items-center gap-2 relative"
            >
              <Bookmark className="w-5 h-5" strokeWidth={1.5} />
              <span>{language === 'hi' ? 'सुरक्षित' : 'Saved'}</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-brand text-white leading-none">
                  {savedCount}
                </span>
              )}
            </Link>

            {isAdmin && (
              <Link 
                to="/admin" 
                className="px-3 py-2 rounded-lg text-brand hover:bg-background transition-colors flex items-center gap-2 font-semibold"
              >
                <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
                <span>{language === 'hi' ? 'एडमिन' : 'Admin'}</span>
              </Link>
            )}
          </nav>

          {/* Language Plain Text Link + Auth CTA */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            {/* Plain text language toggle */}
            <button
              onClick={toggleLanguage}
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              title="Toggle Language / भाषा बदलें"
            >
              {language === 'hi' ? 'English' : 'हिंदी'}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-border rounded-lg bg-surface text-text-primary hover:bg-background transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
                  <span>{user?.fullName?.split(' ')[0] || 'Dashboard'}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-text-secondary hover:text-brand rounded-lg transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-text-primary hover:text-brand transition-colors"
                >
                  {language === 'hi' ? 'लॉग इन' : 'Log In'}
                </Link>
                {/* Single primary CTA */}
                <Link
                  to="/register"
                  className="bg-brand hover:bg-brand-dark text-white font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center justify-center text-sm shadow-sm"
                >
                  {language === 'hi' ? 'पंजीकरण करें' : 'Register'}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Language */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              {language === 'hi' ? 'English' : 'हिंदी'}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-text-primary hover:bg-background"
              aria-label="Toggle Navigation Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-surface px-4 py-4 space-y-3">
          <SearchAutocomplete 
            variant="standard" 
            showButton={false} 
            onSelect={() => setMobileOpen(false)} 
          />

          <div className="grid grid-cols-1 gap-1 text-sm font-medium text-text-secondary pt-2">
            <Link
              to="/schemes"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-background hover:text-text-primary"
            >
              <BookOpen className="w-5 h-5" strokeWidth={1.5} />
              <span>{language === 'hi' ? 'योजनाएं' : 'Schemes'}</span>
            </Link>

            <Link
              to="/eligibility"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-background hover:text-text-primary"
            >
              <CheckSquare className="w-5 h-5" strokeWidth={1.5} />
              <span>{language === 'hi' ? 'पात्रता जांच' : 'Eligibility'}</span>
            </Link>

            <Link
              to="/documents"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-background hover:text-text-primary"
            >
              <FileCheck className="w-5 h-5" strokeWidth={1.5} />
              <span>{language === 'hi' ? 'दस्तावेज़' : 'Documents'}</span>
            </Link>

            <Link
              to="/careers"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-background hover:text-text-primary"
            >
              <Compass className="w-5 h-5" strokeWidth={1.5} />
              <span>{language === 'hi' ? 'कौशल एवं करियर' : 'Careers'}</span>
            </Link>

            <Link
              to="/saved"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-background hover:text-text-primary"
            >
              <div className="flex items-center gap-3">
                <Bookmark className="w-5 h-5" strokeWidth={1.5} />
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
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-brand font-semibold hover:bg-background"
              >
                <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
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
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-text-primary font-medium text-sm"
                >
                  <UserIcon className="w-4 h-4" strokeWidth={1.5} />
                  <span>{user?.fullName || 'Dashboard'}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 py-2 text-text-secondary hover:text-brand font-medium text-sm cursor-pointer"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.5} />
                  <span>{language === 'hi' ? 'लॉग आउट' : 'Log Out'}</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-center rounded-lg border border-brand text-brand font-medium text-sm hover:bg-brand/5"
                >
                  {language === 'hi' ? 'लॉग इन' : 'Log In'}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-center rounded-lg bg-brand text-white font-medium text-sm hover:bg-brand-dark"
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
