import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Phone, Mail, Lock, AlertCircle, RefreshCw } from 'lucide-react';

export default function RegisterPage() {
  const { register, language } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await register(fullName, phone, password, email);
      if (res.success) {
        navigate('/profile');
      }
    } catch (err: any) {
      setError(err.customMessage || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-2xl shadow-md">
            ब
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {language === 'hi' ? 'नागरिक पंजीकरण' : 'Citizen Registration'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'hi' ? 'बिहार सहायक पर अपना निशुल्क खाता बनाएं' : 'Create your free citizen account on BSeva'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'पूरा नाम' : 'Full Name'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder={language === 'hi' ? 'उदा. राहुल कुमार' : 'e.g. Rahul Kumar'}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'मोबाइल नंबर (10 अंक)' : 'Mobile Number (10 digits)'}
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'ईमेल (वैकल्पिक)' : 'Email (Optional)'}
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'पासवर्ड' : 'Password (min 6 characters)'}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{language === 'hi' ? 'खाता बनाएं' : 'Create Account'}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>{language === 'hi' ? 'पहले से खाता है?' : 'Already have an account?'} </span>
          <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
            {language === 'hi' ? 'लॉग इन करें' : 'Login here'}
          </Link>
        </div>
      </div>
    </div>
  );
}
