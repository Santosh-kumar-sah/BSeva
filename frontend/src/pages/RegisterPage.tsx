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
        // Navigate directly to dedicated OTP verification screen with email state
        navigate('/verify-otp', { state: { email: cleanEmail } });
      }
    } catch (err: any) {
      setError(err.customMessage || (language === 'hi' ? 'ओटीपी भेजने में विफल। कृपया पुनः प्रयास करें।' : 'Failed to send OTP. Please try again.'));
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
            {language === 'hi' ? 'नागरिक पंजीकरण' : 'Citizen Registration'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'hi' ? 'बिहार सहायक पर अपना निशुल्क नागरिक खाता बनाएं' : 'Create your free citizen account on BSeva'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

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
              {language === 'hi' ? '📧 इस ईमेल पर 6 अंकों का ओटीपी भेजा जाएगा।' : '📧 A 6-digit OTP will be sent to this email.'}
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

        <div className="text-center pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-500">
          <Link to="/login" className="font-bold text-orange-600 hover:underline">
            {language === 'hi' ? 'पहले से खाता है? लॉग इन' : 'Already have account? Login'}
          </Link>
          <Link to="/verify-otp" className="text-slate-500 hover:text-orange-600 hover:underline">
            {language === 'hi' ? 'सीधे ओटीपी दर्ज करें' : 'Enter OTP directly'} →
          </Link>
        </div>
      </div>
    </div>
  );
}
