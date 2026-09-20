import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Phone, Mail, Lock, AlertCircle, RefreshCw } from 'lucide-react';

export default function RegisterPage() {
  const { sendRegistrationOtp, language } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError(language === 'hi' ? 'कृपया ओटीपी प्राप्त करने हेतु ईमेल दर्ज करें।' : 'Please enter an email to receive OTP.');
      return;
    }

    if (phone.trim().length < 10) {
      setError(language === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await sendRegistrationOtp({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: cleanEmail,
        password
      });

      if (res.success) {
        navigate('/verify-otp', { state: { email: cleanEmail } });
      }
    } catch (err: any) {
      setError(err.customMessage || (language === 'hi' ? 'ओटीपी भेजने में विफल। कृपया पुनः प्रयास करें।' : 'Failed to send OTP. Please try again.'));
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
            {language === 'hi' ? 'नागरिक पंजीकरण' : 'Citizen Registration'}
          </h1>
          <p className="text-xs text-text-secondary font-medium">
            {language === 'hi' ? 'बिहार सहायक पर अपना निःशुल्क नागरिक खाता बनाएं' : 'Create your citizen account on Bihar Sahayak'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-brand/10 border border-brand/25 text-brand text-xs font-bold flex items-center gap-2 shadow-xs">
            <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={2} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">
              {language === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder={language === 'hi' ? 'उदा. राहुल कुमार' : 'e.g. Rahul Kumar'}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-lg text-xs font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand focus:bg-white transition-colors"
              />
              <User className="w-4 h-4 text-brand absolute left-3 top-3" strokeWidth={2} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">
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
                className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-lg text-xs font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand focus:bg-white transition-colors"
              />
              <Phone className="w-4 h-4 text-brand absolute left-3 top-3" strokeWidth={2} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">
              {language === 'hi' ? 'ईमेल पता (ओटीपी हेतु) *' : 'Email Address (for OTP) *'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-lg text-xs font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand focus:bg-white transition-colors"
              />
              <Mail className="w-4 h-4 text-brand absolute left-3 top-3" strokeWidth={2} />
            </div>
            <span className="text-[11px] text-text-secondary font-medium mt-1 block">
              {language === 'hi' ? '📧 इस ईमेल पर 6 अंकों का सत्यापन ओटीपी भेजा जाएगा।' : '📧 A 6-digit verification OTP will be sent to this email.'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">
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
                className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-lg text-xs font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand focus:bg-white transition-colors"
              />
              <Lock className="w-4 h-4 text-brand absolute left-3 top-3" strokeWidth={2} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand hover:bg-brand-dark text-white rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer active:scale-98"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" strokeWidth={2} />
                <span>{language === 'hi' ? 'सत्यापन ओटीपी प्राप्त करें' : 'Get Verification OTP'}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-3 border-t border-border flex justify-between text-xs text-text-secondary font-medium">
          <Link to="/login" className="font-bold text-brand hover:underline">
            {language === 'hi' ? 'पहले से खाता है? लॉग इन' : 'Already have account? Login'}
          </Link>
          <Link to="/verify-otp" className="text-text-secondary hover:text-brand hover:underline font-semibold">
            {language === 'hi' ? 'सीधे ओटीपी दर्ज करें' : 'Enter OTP directly'} →
          </Link>
        </div>
      </div>
    </div>
  );
}
