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
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-white rounded-xl border border-border p-6 sm:p-8 shadow-card space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand rounded-xl mx-auto flex items-center justify-center text-white font-extrabold text-2xl shadow-sm">
            ब
          </div>
          <h1 className="text-2xl font-extrabold font-heading text-text-primary">
            {language === 'hi' ? 'ओटीपी सत्यापन' : 'Verify Registration OTP'}
          </h1>
          <p className="text-xs text-text-secondary font-medium">
            {language === 'hi' ? 'अपने ईमेल पर प्राप्त 6-अंकों का कोड दर्ज करें' : 'Enter the 6-digit verification code sent to your email'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-brand/10 border border-brand/25 text-brand text-xs font-bold flex items-center gap-2 shadow-xs">
            <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={2} />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-lg bg-success/15 border border-success/30 text-success text-xs font-bold flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" strokeWidth={2} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">
              {language === 'hi' ? 'पंजीकृत ईमेल' : 'Registered Email'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-lg text-xs font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand focus:bg-white"
              />
              <Mail className="w-4 h-4 text-brand absolute left-3 top-3" strokeWidth={2} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">
              {language === 'hi' ? '6-अंकों का ओटीपी' : '6-Digit OTP'}
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
                className="w-full py-3 px-4 text-center tracking-[0.5em] font-mono text-2xl font-black bg-background border-2 border-brand rounded-lg text-text-primary focus:ring-2 focus:ring-brand/30 focus:border-brand focus:bg-white focus:outline-none"
              />
              <KeyRound className="w-4 h-4 text-brand absolute left-3.5 top-3.5 pointer-events-none" strokeWidth={2} />
            </div>
          </div>

          <div className="text-center text-xs">
            {canResend ? (
              <button
                type="button"
                disabled={loading}
                onClick={handleResend}
                className="text-brand font-bold hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} strokeWidth={2} />
                <span>{language === 'hi' ? 'ओटीपी पुनः भेजें' : 'Resend OTP'}</span>
              </button>
            ) : (
              <span className="text-text-secondary font-medium">
                {language === 'hi' ? `ओटीपी पुनः भेजने हेतु प्रतीक्षा करें (${resendTimer}s)` : `Resend OTP in ${resendTimer}s`}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-3 bg-brand hover:bg-brand-dark text-white rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer active:scale-98"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                <span>{language === 'hi' ? 'सत्यापित करें और खाता बनाएं' : 'Verify OTP & Complete'}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-3 border-t border-border flex justify-between text-xs text-text-secondary font-medium">
          <Link to="/register" className="text-brand hover:underline font-bold">
            ← {language === 'hi' ? 'पंजीकरण फॉर्म' : 'Back to Register'}
          </Link>
          <Link to="/login" className="text-brand hover:underline font-bold">
            {language === 'hi' ? 'लॉग इन' : 'Login'} →
          </Link>
        </div>
      </div>
    </div>
  );
}
