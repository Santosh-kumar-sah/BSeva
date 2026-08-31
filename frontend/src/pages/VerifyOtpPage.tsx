import React, { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Mail, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function VerifyOtpPage() {
  const { verifyOtpAndRegister, resendRegistrationOtp, language } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState<string>(location.state?.email || '');
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim()) {
      setError(language === 'hi' ? 'कृपया अपना पंजीकृत ईमेल दर्ज करें।' : 'Please enter your registered email.');
      return;
    }

    if (otp.trim().length !== 6) {
      setError(language === 'hi' ? 'कृपया 6 अंकों का ओटीपी दर्ज करें।' : 'Please enter the complete 6-digit OTP.');
      return;
    }

    setLoading(true);

    try {
      const res = await verifyOtpAndRegister({
        email: email.trim().toLowerCase(),
        otp: otp.trim()
      });

      if (res.success) {
        navigate('/profile');
      }
    } catch (err: any) {
      setError(err.customMessage || (language === 'hi' ? 'ओटीपी सत्यापन विफल हुआ। कृपया पुनः जांचें।' : 'OTP verification failed.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !email.trim()) return;
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await resendRegistrationOtp(email.trim().toLowerCase());
      if (res.success) {
        setResendTimer(60);
        setCanResend(false);
        setSuccessMessage(language === 'hi' ? 'नया ओटीपी आपके ईमेल पर भेज दिया गया है।' : 'A new OTP has been sent to your email.');
      }
    } catch (err: any) {
      setError(err.customMessage || (language === 'hi' ? 'ओटीपी पुनः भेजने में विफल।' : 'Failed to resend OTP.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-2xl shadow-md">
            ब
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {language === 'hi' ? 'ओटीपी सत्यापन' : 'Verify Registration OTP'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'hi' ? 'अपने ईमेल पर प्राप्त 6-अंकों का कोड दर्ज करें' : 'Enter the 6-digit verification code sent to your email'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'पंजीकृत ईमेल' : 'Registered Email'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-orange-500 focus:bg-white"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? '6-अंकों का ओटीपी (OTP)' : '6-Digit OTP'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                maxLength={6}
                autoFocus
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full py-3.5 px-4 text-center tracking-[0.5em] font-mono text-2xl font-black bg-white border-2 border-orange-500 rounded-xl text-slate-900 focus:ring-4 focus:ring-orange-500/20 focus:outline-none"
              />
              <KeyRound className="w-4 h-4 text-orange-500 absolute left-3.5 top-4 pointer-events-none" />
            </div>
          </div>

          <div className="text-center text-xs">
            {canResend ? (
              <button
                type="button"
                disabled={loading}
                onClick={handleResend}
                className="text-orange-600 font-bold hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                {language === 'hi' ? 'ओटीपी पुनः भेजें (Resend OTP)' : 'Resend OTP'}
              </button>
            ) : (
              <span className="text-slate-400 font-medium">
                {language === 'hi' ? `ओटीपी पुनः भेजने हेतु प्रतीक्षा करें (${resendTimer}s)` : `Resend OTP in ${resendTimer}s`}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'hi' ? 'सत्यापित करें और खाता बनाएं' : 'Verify OTP & Complete Registration'}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-500">
          <Link to="/register" className="text-orange-600 hover:underline">
            ← {language === 'hi' ? 'पंजीकरण फॉर्म' : 'Back to Register'}
          </Link>
          <Link to="/login" className="text-orange-600 hover:underline">
            {language === 'hi' ? 'लॉग इन' : 'Login'} →
          </Link>
        </div>
      </div>
    </div>
  );
}
