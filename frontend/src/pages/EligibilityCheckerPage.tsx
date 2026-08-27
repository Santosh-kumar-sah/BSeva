import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import { eligibilityService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { EligibilityCheckResponse, CitizenProfile } from '../types';

const BIHAR_DISTRICTS = [
  'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar',
  'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur',
  'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger',
  'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa',
  'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul',
  'Vaishali', 'West Champaran'
];

export default function EligibilityCheckerPage() {
  const { profile, language } = useAuth();

  const [formData, setFormData] = useState<Partial<CitizenProfile>>({
    district: profile?.district || 'Patna',
    age: profile?.age || 20,
    gender: (profile?.gender as any) || 'MALE',
    socialCategory: (profile?.socialCategory as any) || 'EBC',
    isBiharResident: profile?.isBiharResident !== undefined ? profile.isBiharResident : true,
    education: profile?.education || '12TH_PASS',
    annualIncome: profile?.annualIncome || 120000,
    landHoldingAcres: profile?.landHoldingAcres || 0,
    isDifferentlyAbled: profile?.isDifferentlyAbled || false
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<EligibilityCheckResponse | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await eligibilityService.checkEligibility(formData);
      if (res.success) {
        setResults(res);
      }
    } catch (err) {
      console.error('Error checking eligibility:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
          <CheckSquare className="w-4 h-4" />
          <span>{language === 'hi' ? 'स्मार्ट पात्रता नियम इंजन' : 'Deterministic Eligibility Engine'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          {language === 'hi' ? 'सरकारी योजनाओं के लिए अपनी पात्रता जांचें' : 'Check Your Eligibility for Schemes'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          {language === 'hi'
            ? 'अपनी बुनियादी जानकारी भरें। हमारा नियम इंजन तुरंत 25+ सत्यापित योजनाओं के साथ आपकी योग्यता का विश्लेषण करेगा।'
            : 'Fill in your demographic details. The engine will evaluate against exact criteria and give an explainable breakdown.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Input Form */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              {language === 'hi' ? 'अपनी जानकारी दर्ज करें' : 'Enter Your Profile Details'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Bihar Resident Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <label className="text-xs font-bold text-slate-800">
                    {language === 'hi' ? 'क्या आप बिहार के निवासी हैं?' : 'Are you a Bihar resident?'}
                  </label>
                  <p className="text-[11px] text-slate-500">{language === 'hi' ? 'राज्य स्तरीय योजनाओं के लिए अनिवार्य' : 'Required for state schemes'}</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isBiharResident}
                  onChange={(e) => setFormData({ ...formData, isBiharResident: e.target.checked })}
                  className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                />
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'जिला (District)' : 'District'}
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white"
                >
                  {BIHAR_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'आयु (Age)' : 'Age (Years)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'लिंग (Gender)' : 'Gender'}
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  >
                    <option value="MALE">{language === 'hi' ? 'पुरुष (Male)' : 'Male'}</option>
                    <option value="FEMALE">{language === 'hi' ? 'महिला (Female)' : 'Female'}</option>
                    <option value="OTHER">{language === 'hi' ? 'अन्य (Other)' : 'Other'}</option>
                  </select>
                </div>
              </div>

              {/* Social Category & Education */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'वर्ग (Category)' : 'Social Category'}
                  </label>
                  <select
                    value={formData.socialCategory}
                    onChange={(e) => setFormData({ ...formData, socialCategory: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  >
                    <option value="GENERAL">General</option>
                    <option value="EBC">EBC (अत्यंत पिछड़ा)</option>
                    <option value="OBC">BC / OBC (पिछड़ा वर्ग)</option>
                    <option value="SC">SC (अनुसूचित जाति)</option>
                    <option value="ST">ST (अनुसूचित जनजाति)</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'शिक्षा (Education)' : 'Education Level'}
                  </label>
                  <select
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  >
                    <option value="BELOW_10TH">Below 10th</option>
                    <option value="10TH_PASS">10th Pass (मैट्रिक)</option>
                    <option value="12TH_PASS">12th Pass (इंटरमीडिएट)</option>
                    <option value="DIPLOMA">Diploma / ITI</option>
                    <option value="GRADUATE">Graduate (स्नातक)</option>
                    <option value="POST_GRADUATE">Post Graduate</option>
                  </select>
                </div>
              </div>

              {/* Annual Income */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>{language === 'hi' ? 'वार्षिक पारिवारिक आय' : 'Annual Family Income'}</span>
                  <span className="text-orange-600 font-extrabold">₹{Number(formData.annualIncome).toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
                  className="w-full accent-orange-600"
                />
              </div>

              {/* Land Holding */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'खेती योग्य भूमि (एकड़ में)' : 'Agricultural Land (Acres)'}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.landHoldingAcres}
                  onChange={(e) => setFormData({ ...formData, landHoldingAcres: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white"
                />
              </div>

              {/* Differently Abled Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="divyang"
                  checked={formData.isDifferentlyAbled}
                  onChange={(e) => setFormData({ ...formData, isDifferentlyAbled: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <label htmlFor="divyang" className="text-xs text-slate-700 font-medium">
                  {language === 'hi' ? 'दिव्यांगजन (Differently Abled 40%+)' : 'Differently Abled (40%+)'}
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>{language === 'hi' ? 'पात्रता का विश्लेषण करें' : 'Evaluate Eligibility'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Results Display */}
        <div className="lg:col-span-7 space-y-6">
          {!results && !loading && (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <Sparkles className="w-12 h-12 text-orange-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">
                {language === 'hi' ? 'पात्रता रिपोर्ट देखने के लिए विवरण भरें' : 'Fill details to calculate eligibility'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {language === 'hi'
                  ? 'बाईं ओर अपना प्रोफ़ाइल विवरण चुनें और "पात्रता का विश्लेषण करें" पर क्लिक करें।'
                  : 'Select your demographic attributes on the left and click Evaluate Eligibility.'}
              </p>
            </div>
          )}

          {results && (
            <div className="space-y-6">
              {/* Summary Stats Card */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-emerald-900/40 border border-emerald-700/50 rounded-2xl">
                  <div className="text-2xl font-black text-emerald-400">
                    {results.summary.potentiallyEligibleCount}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-200 mt-1">
                    {language === 'hi' ? 'संभावित पात्र' : 'Eligible'}
                  </div>
                </div>

                <div className="p-3 bg-amber-900/40 border border-amber-700/50 rounded-2xl">
                  <div className="text-2xl font-black text-amber-400">
                    {results.summary.needsVerificationCount}
                  </div>
                  <div className="text-[11px] font-semibold text-amber-200 mt-1">
                    {language === 'hi' ? 'सत्यापन आवश्यक' : 'Verification'}
                  </div>
                </div>

                <div className="p-3 bg-rose-900/40 border border-rose-700/50 rounded-2xl">
                  <div className="text-2xl font-black text-rose-400">
                    {results.summary.likelyNotEligibleCount}
                  </div>
                  <div className="text-[11px] font-semibold text-rose-200 mt-1">
                    {language === 'hi' ? 'अपात्र' : 'Not Eligible'}
                  </div>
                </div>
              </div>

              {/* Potentially Eligible Schemes */}
              <div className="space-y-4">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{language === 'hi' ? 'आप इन योजनाओं के संभावित पात्र हैं' : 'Potentially Eligible Schemes'}</span>
                </h2>

                <div className="space-y-4">
                  {results.results.potentiallyEligible.map((item) => (
                    <div key={item.schemeId} className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-sm space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {language === 'hi' ? item.title_hi : item.title_en}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 shrink-0">
                          100% Match
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <p className="text-[11px] font-bold text-slate-500 uppercase">
                          {language === 'hi' ? 'संतुष्ट शर्तें (Passed Criteria):' : 'Satisfied Criteria:'}
                        </p>
                        {item.passedRules.map((pr, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{pr.message_hi}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <a
                          href={item.officialPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                        >
                          {language === 'hi' ? 'आधिकारिक पोर्टल लिंक →' : 'Official Portal →'}
                        </a>
                        <Link
                          to={`/schemes/${item.schemeSlug}`}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition"
                        >
                          {language === 'hi' ? 'दस्तावेज़ चेकलिस्ट' : 'View Documents'}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
