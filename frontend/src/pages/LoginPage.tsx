import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Phone, Lock, AlertCircle, RefreshCw } from 'lucide-react';

export default function LoginPage() {
  const { login, language } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(identifier, password);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.customMessage || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-surface rounded-xl border border-border p-6 sm:p-8 shadow-card space-y-6">
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 bg-brand rounded-lg mx-auto flex items-center justify-center text-white font-bold text-lg shadow-sm">
            ब
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
            {language === 'hi' ? 'नागरिक लॉगिन' : 'Citizen Login'}
          </h1>
          <p className="text-xs text-text-secondary">
            {language === 'hi' ? 'अपने पंजीकृत मोबाइल नंबर या ईमेल से लॉगिन करें' : 'Login with your registered mobile or email'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-brand/10 border border-brand/20 text-brand text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1">
              {language === 'hi' ? 'मोबाइल नंबर या ईमेल' : 'Mobile Number or Email'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder={language === 'hi' ? 'उदा. 9876543210' : 'e.g. 9876543210'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-xs font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand focus:bg-surface transition-colors"
              />
              <Phone className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" strokeWidth={1.5} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-primary mb-1">
              {language === 'hi' ? 'पासवर्ड' : 'Password'}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-xs font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand focus:bg-surface transition-colors"
              />
              <Lock className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" strokeWidth={1.5} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-brand hover:bg-brand-dark text-white font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" strokeWidth={1.5} />
                <span>{language === 'hi' ? 'लॉग इन करें' : 'Log In'}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-text-secondary pt-3 border-t border-border">
          <span>{language === 'hi' ? 'खाता नहीं है?' : "Don't have an account?"} </span>
          <Link to="/register" className="font-semibold text-brand hover:underline">
            {language === 'hi' ? 'नया खाता बनाएं' : 'Register here'}
          </Link>
        </div>
      </div>
    </div>
  );
}
