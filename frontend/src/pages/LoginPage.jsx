import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Phone, Lock, AlertCircle, RefreshCw } from 'lucide-react';

export default function LoginPage() {
  const { login, language } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(identifier, password);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.customMessage || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-2xl shadow-md">
            ब
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {language === 'hi' ? 'नागरिक लॉगिन' : 'Citizen Login'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'hi' ? 'अपने मोबाइल नंबर या ईमेल से लॉगिन करें' : 'Login with your registered mobile or email'}
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
              {language === 'hi' ? 'मोबाइल नंबर या ईमेल' : 'Mobile Number or Email'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder={language === 'hi' ? 'उदा. 9876543210' : 'e.g. 9876543210'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'पासवर्ड' : 'Password'}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{language === 'hi' ? 'लॉग इन करें' : 'Log In'}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>{language === 'hi' ? 'खाता नहीं है?' : "Don't have an account?"} </span>
          <Link to="/register" className="font-bold text-orange-600 hover:text-orange-700">
            {language === 'hi' ? 'नया खाता बनाएं' : 'Register here'}
          </Link>
        </div>
      </div>
    </div>
  );
}
