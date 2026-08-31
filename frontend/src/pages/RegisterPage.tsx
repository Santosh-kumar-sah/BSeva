import React, { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Phone, Mail, Lock, AlertCircle, RefreshCw, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';

export default function RegisterPage() {
  const { sendRegistrationOtp, verifyOtpAndRegister, resendRegistrationOtp, language } = useAuth();
  const navigate = useNavigate();

  // Step state: 'DETAILS' -> 'OTP'
  const [step, setStep] = useState<'DETAILS' | 'OTP'>('DETAILS');

  // Form Fields
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>('');

  // Status & Feedback
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'OTP' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Step 1: Send OTP
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim()) {
      setError(language === 'hi' ? 'ओटीपी प्राप्त करने के लिए कृपया ईमेल दर्ज करें।' : 'Please enter a valid email to receive OTP.');
      return;
    }

    if (phone.length < 10) {
      setError(language === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);

    try {
      const res = await sendRegistrationOtp({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        password
      });

      if (res.success) {
        setStep('OTP');
        setResendTimer(60);
        setCanResend(false);
        setSuccessMessage(res.message || (language === 'hi' ? 'ओटीपी आपके ईमेल पर भेज दिया गया है।' : 'OTP sent to your email.'));
      }
    } catch (err: any) {
      setError(err.customMessage || (language === 'hi' ? 'ओटीपी भेजने में विफल। कृपया पुनः प्रयास करें।' : 'Failed to send OTP. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
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

  // Step 3: Verify OTP & Complete Registration
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (otp.length !== 6) {
      setError(language === 'hi' ? 'कृपया 6 अंकों का सही ओटीपी दर्ज करें।' : 'Please enter the complete 6-digit OTP.');
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
      setError(err.customMessage || (language === 'hi' ? 'ओटीपी सत्यापन विफल हुआ। कृपया पुनः जांचें।' : 'OTP verification failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-2xl shadow-md">
            ब
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {step === 'DETAILS'
              ? (language === 'hi' ? 'नागरिक पंजीकरण' : 'Citizen Registration')
              : (language === 'hi' ? 'ईमेल ओटीपी सत्यापन' : 'Email OTP Verification')}
          </h1>
          <p className="text-xs text-slate-500">
            {step === 'DETAILS'
              ? (language === 'hi' ? 'बिहार सहायक पर अपना निशुल्क नागरिक खाता बनाएं' : 'Create your free citizen account on BSeva')
              : (language === 'hi' ? `हमने ${email} पर 6-अंकों का सत्यापन कोड भेजा है` : `We sent a 6-digit verification code to ${email}`)}
          </p>
        </div>

        {/* Feedback Alerts */}
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

        {/* STEP 1: Registration Details */}
        {step === 'DETAILS' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={language === 'hi' ? 'उदा. राहुल कुमार' : 'e.g. Rahul Kumar'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'मोबाइल नंबर (10 अंक) *' : 'Mobile Number (10 digits) *'}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'ईमेल पता (ओटीपी हेतु) *' : 'Email Address (for OTP) *'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {language === 'hi' ? '📧 इस ईमेल पते पर 6 अंकों का सत्यापन कोड भेजा जाएगा।' : '📧 A 6-digit verification code will be sent to this email.'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'पासवर्ड (न्यूनतम 6 अक्षर) *' : 'Password (min 6 characters) *'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{language === 'hi' ? 'ओटीपी प्राप्त करें' : 'Get Verification OTP'}</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: OTP Verification Form */
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 px-1">
                <span>{email}</span>
                <button
                  type="button"
                  onClick={() => {
                    setStep('DETAILS');
                    setError('');
                    setSuccessMessage('');
                  }}
                  className="text-orange-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  {language === 'hi' ? 'ईमेल बदलें' : 'Change Email'}
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  {language === 'hi' ? '6-अंकों का ओटीपी दर्ज करें' : 'Enter 6-Digit OTP'}
                </label>
                <div className="relative max-w-xs mx-auto">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full py-3.5 px-4 text-center tracking-[0.5em] font-mono text-2xl font-black bg-white border-2 border-orange-500 rounded-xl text-slate-900 focus:ring-4 focus:ring-orange-500/20 focus:outline-none transition shadow-sm"
                  />
                  <KeyRound className="w-4 h-4 text-orange-500 absolute left-3 top-4.5 pointer-events-none" />
                </div>
              </div>

              {/* Resend OTP */}
              <div className="pt-2 text-xs">
                {canResend ? (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleResendOtp}
                    className="text-orange-600 font-bold hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    {language === 'hi' ? 'ओटीपी पुनः भेजें (Resend OTP)' : 'Resend OTP'}
                  </button>
                ) : (
                  <span className="text-slate-400 font-medium">
                    {language === 'hi' ? `ओटीपी पुनः भेजने के लिए प्रतीक्षा करें (${resendTimer}s)` : `Resend OTP in ${resendTimer}s`}
                  </span>
                )}
              </div>
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
        )}

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            {language === 'hi' ? 'पहले से खाता है?' : 'Already have an account?'}{' '}
            <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">
              {language === 'hi' ? 'लॉग इन करें' : 'Login here'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
