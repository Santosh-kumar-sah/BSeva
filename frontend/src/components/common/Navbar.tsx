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
  ShieldCheck,
  Languages,
  FileCheck,
  Bookmark
} from 'lucide-react';
import SearchAutocomplete from './SearchAutocomplete';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout, language, toggleLanguage } = useAuth();
  const { savedCount } = useSavedSchemes();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Bihar GovTech Tricolor Accent Line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Identity */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-xl p-1 -ml-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
              ब
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-slate-900 tracking-tight font-sans">
                  {language === 'hi' ? 'बिहार सहायक' : 'Bihar Sahayak'}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200/60">
                  BSeva
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                {language === 'hi' ? 'योजना एवं करियर मार्गदर्शक' : 'GovTech Intelligence Portal'}
              </p>
            </div>
          </Link>

          {/* Integrated Search Bar */}
          <div className="hidden md:block flex-1 max-w-xs lg:max-w-sm">
            <SearchAutocomplete variant="navbar" showButton={false} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-700">
            <Link 
              to="/schemes" 
              className="px-3 py-2 rounded-xl text-slate-700 hover:text-orange-700 hover:bg-orange-50/70 transition-colors duration-150 flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-slate-500 group-hover:text-orange-600" />
              <span>{language === 'hi' ? 'योजनाएं' : 'Schemes'}</span>
            </Link>

            <Link 
              to="/eligibility" 
              className="px-3 py-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 transition-colors duration-150 flex items-center gap-1.5"
            >
              <CheckSquare className="w-4 h-4 text-slate-500" />
              <span>{language === 'hi' ? 'पात्रता जांच' : 'Eligibility'}</span>
            </Link>

            <Link 
              to="/documents" 
              className="px-3 py-2 rounded-xl text-slate-700 hover:text-amber-700 hover:bg-amber-50/70 transition-colors duration-150 flex items-center gap-1.5"
            >
              <FileCheck className="w-4 h-4 text-slate-500" />
              <span>{language === 'hi' ? 'दस्तावेज' : 'Documents'}</span>
            </Link>

            <Link 
              to="/careers" 
              className="px-3 py-2 rounded-xl text-slate-700 hover:text-blue-700 hover:bg-blue-50/70 transition-colors duration-150 flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-slate-500" />
              <span>{language === 'hi' ? 'करियर' : 'Careers'}</span>
            </Link>

            <Link 
              to="/saved" 
              className="px-3 py-2 rounded-xl text-slate-700 hover:text-orange-700 hover:bg-orange-50/70 transition-colors duration-150 flex items-center gap-1.5 relative"
            >
              <Bookmark className="w-4 h-4 text-orange-500" />
              <span>{language === 'hi' ? 'ट्रैकर' : 'Saved'}</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-600 text-white leading-none">
                  {savedCount}
                </span>
              )}
            </Link>

            {isAdmin && (
              <Link 
                to="/admin" 
                className="px-3 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors duration-150 flex items-center gap-1.5 font-bold"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>{language === 'hi' ? 'एडमिन' : 'Admin'}</span>
              </Link>
            )}
          </nav>

          {/* Action Buttons & Language Switcher */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {/* Bilingual Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700 transition-all duration-150 shadow-2xs"
              title="Toggle Language / भाषा बदलें"
            >
              <Languages className="w-3.5 h-3.5 text-orange-600" />
              <span>{language === 'hi' ? 'English' : 'हिंदी'}</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-orange-50 text-orange-800 border border-orange-200/80 rounded-xl hover:bg-orange-100 transition-colors duration-150"
                >
                  <UserIcon className="w-3.5 h-3.5 text-orange-600" />
                  <span>{user?.fullName?.split(' ')[0] || 'Dashboard'}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors duration-150"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors duration-150"
                >
                  {language === 'hi' ? 'लॉग इन' : 'Log In'}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl shadow-xs hover:from-orange-700 hover:to-amber-700 transition-all duration-150 shadow-orange-900/10"
                >
                  {language === 'hi' ? 'पंजीकरण करें' : 'Register'}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions: Language + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
            >
              {language === 'hi' ? 'EN' : 'हि'}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Toggle Navigation Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="pt-1 pb-2">
            <SearchAutocomplete 
              variant="standard" 
              showButton={false} 
              onSelect={() => setMobileOpen(false)} 
            />
          </div>

          <div className="grid grid-cols-1 gap-1 text-sm font-semibold text-slate-700">
            <Link
              to="/schemes"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-orange-50 hover:text-orange-700 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-orange-600" />
              <span>{language === 'hi' ? 'योजनाएं (Schemes)' : 'Schemes'}</span>
            </Link>

            <Link
              to="/eligibility"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>{language === 'hi' ? 'पात्रता जांच (Eligibility)' : 'Eligibility Checker'}</span>
            </Link>

            <Link
              to="/documents"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-amber-50 hover:text-amber-700 transition-colors"
            >
              <FileCheck className="w-4 h-4 text-amber-600" />
              <span>{language === 'hi' ? 'दस्तावेज (Documents)' : 'Documents'}</span>
            </Link>

            <Link
              to="/careers"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>{language === 'hi' ? 'करियर (Careers)' : 'Careers'}</span>
            </Link>

            <Link
              to="/saved"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-orange-50 hover:text-orange-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bookmark className="w-4 h-4 text-orange-500" />
                <span>{language === 'hi' ? 'ट्रैकर (Saved Schemes)' : 'Saved Schemes'}</span>
              </div>
              {savedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-600 text-white">
                  {savedCount}
                </span>
              )}
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-purple-50 text-purple-700 font-bold"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>{language === 'hi' ? 'एडमिन पैनल' : 'Admin Panel'}</span>
              </Link>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-50 text-orange-800 font-bold text-xs border border-orange-200"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>{user?.fullName || 'Dashboard'}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{language === 'hi' ? 'लॉग आउट' : 'Log Out'}</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-center rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  {language === 'hi' ? 'लॉग इन' : 'Log In'}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-orange-600 text-white font-bold text-xs shadow-xs hover:bg-orange-700"
                >
                  {language === 'hi' ? 'रजिस्टर करें' : 'Register'}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
