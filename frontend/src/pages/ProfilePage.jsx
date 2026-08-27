import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Save, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const BIHAR_DISTRICTS = [
  'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar',
  'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur',
  'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger',
  'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa',
  'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul',
  'Vaishali', 'West Champaran'
];

export default function ProfilePage() {
  const { user, profile, saveProfile, language } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    district: 'Patna',
    block: '',
    age: 20,
    gender: 'MALE',
    socialCategory: 'EBC',
    isBiharResident: true,
    education: '12TH_PASS',
    occupation: 'Student',
    annualIncome: 120000,
    landHoldingAcres: 0,
    isDifferentlyAbled: false,
    skills: 'Basic Computer, Hindi Typing',
    interests: 'Government Services, Higher Education'
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        district: profile.district || 'Patna',
        block: profile.block || '',
        age: profile.age || 20,
        gender: profile.gender || 'MALE',
        socialCategory: profile.socialCategory || 'EBC',
        isBiharResident: profile.isBiharResident !== undefined ? profile.isBiharResident : true,
        education: profile.education || '12TH_PASS',
        occupation: profile.occupation || 'Student',
        annualIncome: profile.annualIncome || 0,
        landHoldingAcres: profile.landHoldingAcres || 0,
        isDifferentlyAbled: profile.isDifferentlyAbled || false,
        skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
        interests: Array.isArray(profile.interests) ? profile.interests.join(', ') : ''
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
        annualIncome: Number(formData.annualIncome),
        landHoldingAcres: Number(formData.landHoldingAcres),
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean)
      };

      const res = await saveProfile(payload);
      if (res.success) {
        setMessage(language === 'hi' ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!' : 'Profile saved successfully in Supabase PostgreSQL!');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      setError(err.customMessage || 'Error saving profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          {language === 'hi' ? 'नागरिक प्रोफ़ाइल (Citizen Profile)' : 'Citizen Profile Settings'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {language === 'hi'
            ? 'अपनी प्रोफ़ाइल को अपडेट रखें ताकि सरकारी योजनाओं और छात्रवृत्तियों की सही पात्रता प्राप्त हो सके।'
            : 'Keep your demographic and educational information accurate for deterministic scheme matching.'}
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Basic user header */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-lg">
            {user?.fullName?.[0] || 'U'}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{user?.fullName}</h3>
            <p className="text-xs text-slate-500">{user?.phone} • {user?.email || 'No email'}</p>
          </div>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'जिला (District)' : 'District'}
            </label>
            <select
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500"
            >
              {BIHAR_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'प्रखंड (Block - Optional)' : 'Block (Optional)'}
            </label>
            <input
              type="text"
              placeholder={language === 'hi' ? 'उदा. दानापुर, फुलवारी शरीफ' : 'e.g. Danapur'}
              value={formData.block}
              onChange={(e) => setFormData({ ...formData, block: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'आयु (Age)' : 'Age'}
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'लिंग (Gender)' : 'Gender'}
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500"
            >
              <option value="MALE">Male (पुरुष)</option>
              <option value="FEMALE">Female (महिला)</option>
              <option value="OTHER">Other (अन्य)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'सामाजिक वर्ग (Category)' : 'Social Category'}
            </label>
            <select
              value={formData.socialCategory}
              onChange={(e) => setFormData({ ...formData, socialCategory: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500"
            >
              <option value="GENERAL">General</option>
              <option value="EBC">EBC (अत्यंत पिछड़ा वर्ग)</option>
              <option value="OBC">BC / OBC (पिछड़ा वर्ग)</option>
              <option value="SC">SC (अनुसूचित जाति)</option>
              <option value="ST">ST (अनुसूचित जनजाति)</option>
              <option value="EWS">EWS</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'शिक्षा स्तर (Education Level)' : 'Education Level'}
            </label>
            <select
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500"
            >
              <option value="BELOW_10TH">Below 10th</option>
              <option value="10TH_PASS">10th Pass (मैट्रिक)</option>
              <option value="12TH_PASS">12th Pass (इंटरमीडिएट)</option>
              <option value="DIPLOMA">Diploma / ITI</option>
              <option value="GRADUATE">Graduate (स्नातक)</option>
              <option value="POST_GRADUATE">Post Graduate</option>
              <option value="DOCTORATE">Doctorate / PhD</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'पारिवारिक वार्षिक आय (INR)' : 'Annual Income (INR)'}
            </label>
            <input
              type="number"
              min="0"
              value={formData.annualIncome}
              onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'व्यवसाय (Occupation)' : 'Occupation'}
            </label>
            <input
              type="text"
              placeholder={language === 'hi' ? 'उदा. छात्र, किसान, स्व-रोजगार' : 'e.g. Student, Farmer, Job Seeker'}
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500"
            />
          </div>

        </div>

        {/* Skills & Interests */}
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'कौशल (Skills - कॉमा से अलग करें)' : 'Skills (Comma separated)'}
            </label>
            <input
              type="text"
              placeholder="Basic Computer, Python, Typing, Electrical"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'रुचियां (Interests - कॉमा से अलग करें)' : 'Interests (Comma separated)'}
            </label>
            <input
              type="text"
              placeholder="Information Technology, Agriculture, Civil Services"
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500"
            />
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
              <Save className="w-4 h-4" />
              <span>{language === 'hi' ? 'प्रोफ़ाइल सहेजें' : 'Save Profile to Cloud'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
