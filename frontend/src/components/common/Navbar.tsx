import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSavedSchemes } from '../../context/SavedSchemesContext';
import { 
  Search, 
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

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout, language, toggleLanguage } = useAuth();
  const { savedCount } = useSavedSchemes();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/schemes?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      {/* Top Govt Tricolor Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-emerald-700 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              ब
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                  {language === 'hi' ? 'बिहार सहायक' : 'Bihar Sahayak'}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-200">
                  BSeva
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none">
                {language === 'hi' ? 'योजना एवं करियर मार्गदर्शक' : 'GovTech Intelligence Layer'}
              </p>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative w-64 lg:w-72">
            <input
              type="text"
              placeholder={language === 'hi' ? 'योजना खोजें...' : 'Search schemes...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100/80 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          </form>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-700">
            <Link to="/schemes" className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-orange-600 transition flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>{language === 'hi' ? 'योजनाएं' : 'Schemes'}</span>
            </Link>
            <Link to="/eligibility" className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-emerald-600 transition flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4" />
              <span>{language === 'hi' ? 'पात्रता जांच' : 'Eligibility'}</span>
            </Link>
            <Link to="/documents" className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-amber-600 transition flex items-center gap-1.5">
              <FileCheck className="w-4 h-4" />
              <span>{language === 'hi' ? 'दस्तावेज' : 'Documents'}</span>
            </Link>
            <Link to="/careers" className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>{language === 'hi' ? 'करियर' : 'Careers'}</span>
            </Link>
            <Link to="/saved" className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-orange-600 transition flex items-center gap-1.5 relative">
              <Bookmark className="w-4 h-4 text-orange-500" />
              <span>{language === 'hi' ? 'ट्रैकर' : 'Saved'}</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-orange-600 text-white">
                  {savedCount}
                </span>
              )}
            </Link>
            {isAdmin && (
              <Link to="/admin" className="px-3 py-2 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'hi' ? 'एडमिन' : 'Admin'}</span>
              </Link>
            )}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
              title="Change Language"
            >
              <Languages className="w-3.5 h-3.5 text-orange-600" />
              {language === 'hi' ? 'English' : 'हिंदी'}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold bg-orange-50 text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-100 transition"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>{user?.fullName?.split(' ')[0] || 'Dashboard'}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg transition"
                >
                  {language === 'hi' ? 'लॉग इन' : 'Log In'}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-sm hover:from-orange-600 hover:to-orange-700 transition"
                >
                  {language === 'hi' ? 'रजिस्टर करें' : 'Register'}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="p-1.5 text-xs font-bold rounded border border-slate-200 bg-slate-50 text-slate-700"
            >
              {language === 'hi' ? 'EN' : 'हि'}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder={language === 'hi' ? 'योजना खोजें...' : 'Search schemes...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          <nav className="flex flex-col gap-1 text-sm font-semibold text-slate-800">
            <Link 
              to="/schemes" 
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-orange-600" />
              {language === 'hi' ? 'सभी योजनाएं (Schemes)' : 'All Schemes'}
            </Link>
            <Link 
              to="/eligibility" 
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2"
            >
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              {language === 'hi' ? 'पात्रता जांचें (Eligibility)' : 'Check Eligibility'}
            </Link>
            <Link 
              to="/documents" 
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4 text-amber-600" />
              {language === 'hi' ? 'दस्तावेज तैयारी जांच (Documents)' : 'Document Check'}
            </Link>
            <Link 
              to="/saved" 
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-orange-600" />
                <span>{language === 'hi' ? 'मेरी सुरक्षित योजनाएं (Saved)' : 'Saved Schemes'}</span>
              </div>
              {savedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-600 text-white">
                  {savedCount}
                </span>
              )}
            </Link>
            <Link 
              to="/careers" 
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              {language === 'hi' ? 'करियर मार्गदर्शन (Careers)' : 'Career Guidance'}
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg bg-purple-50 text-purple-700 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                {language === 'hi' ? 'एडमिन पैनल' : 'Admin Panel'}
              </Link>
            )}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2 text-sm font-bold bg-orange-50 text-orange-700 border border-orange-200 rounded-lg"
                >
                  {language === 'hi' ? 'मेरा डैशबोर्ड' : 'My Dashboard'}
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-full py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  {language === 'hi' ? 'लॉग आउट' : 'Log Out'}
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg"
                >
                  {language === 'hi' ? 'लॉग इन' : 'Log In'}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-2 text-sm font-bold bg-orange-600 text-white rounded-lg"
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
