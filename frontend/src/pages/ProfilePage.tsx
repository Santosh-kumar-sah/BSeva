import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Save, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { CitizenProfile, GenderType, SocialCategory, EducationLevel } from '../types';

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
    gender: 'MALE' as GenderType,
    socialCategory: 'EBC' as SocialCategory,
    isBiharResident: true,
    education: '12TH_PASS' as EducationLevel,
    occupation: 'Student',
    annualIncome: 120000,
    landHoldingAcres: 0,
    isDifferentlyAbled: false,
    maritalStatus: 'UNMARRIED',
    employmentStatus: 'STUDENT',
    rationCardType: 'NONE',
    areaType: 'RURAL',
    farmerType: 'NOT_FARMER',
    isMinority: false,
    hasGovtEmployeeInFamily: false,
    isIncomeTaxPayer: false,
    isAadhaarDbtLinked: false,
    hasClearedPrelims: false,
    hasFisheryPond: false,
    isMigrantWorker: false,
    hasElectricityConnection: false,
    isSportsMedalist: false,
    skills: 'Basic Computer, Hindi Typing',
    interests: 'Government Services, Higher Education'
  });

  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        district: profile.district || 'Patna',
        block: profile.block || '',
        age: profile.age || 20,
        gender: (profile.gender as GenderType) || 'MALE',
        socialCategory: (profile.socialCategory as SocialCategory) || 'EBC',
        isBiharResident: profile.isBiharResident !== undefined ? profile.isBiharResident : true,
        education: (profile.education as EducationLevel) || '12TH_PASS',
        occupation: profile.occupation || 'Student',
        annualIncome: profile.annualIncome || 0,
        landHoldingAcres: profile.landHoldingAcres || 0,
        isDifferentlyAbled: profile.isDifferentlyAbled || false,
        maritalStatus: profile.maritalStatus || 'UNMARRIED',
        employmentStatus: profile.employmentStatus || 'STUDENT',
        rationCardType: profile.rationCardType || 'NONE',
        areaType: profile.areaType || 'RURAL',
        farmerType: profile.farmerType || 'NOT_FARMER',
        isMinority: profile.isMinority || false,
        hasGovtEmployeeInFamily: profile.hasGovtEmployeeInFamily || false,
        isIncomeTaxPayer: profile.isIncomeTaxPayer || false,
        isAadhaarDbtLinked: profile.isAadhaarDbtLinked || false,
        hasClearedPrelims: profile.hasClearedPrelims || false,
        hasFisheryPond: profile.hasFisheryPond || false,
        isMigrantWorker: profile.isMigrantWorker || false,
        hasElectricityConnection: profile.hasElectricityConnection || false,
        isSportsMedalist: profile.isSportsMedalist || false,
        skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
        interests: Array.isArray(profile.interests) ? profile.interests.join(', ') : ''
      });
    }
  }, [profile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const payload: Partial<CitizenProfile> = {
        district: formData.district,
        block: formData.block,
        gender: formData.gender,
        socialCategory: formData.socialCategory,
        isBiharResident: formData.isBiharResident,
        education: formData.education,
        occupation: formData.occupation,
        age: Number(formData.age),
        annualIncome: Number(formData.annualIncome),
        landHoldingAcres: Number(formData.landHoldingAcres),
        isDifferentlyAbled: formData.isDifferentlyAbled,
        maritalStatus: formData.maritalStatus as any,
        employmentStatus: formData.employmentStatus as any,
        rationCardType: formData.rationCardType as any,
        areaType: formData.areaType as any,
        farmerType: formData.farmerType as any,
        isMinority: formData.isMinority,
        hasGovtEmployeeInFamily: formData.hasGovtEmployeeInFamily,
        isIncomeTaxPayer: formData.isIncomeTaxPayer,
        isAadhaarDbtLinked: formData.isAadhaarDbtLinked,
        hasClearedPrelims: formData.hasClearedPrelims,
        hasFisheryPond: formData.hasFisheryPond,
        isMigrantWorker: formData.isMigrantWorker,
        hasElectricityConnection: formData.hasElectricityConnection,
        isSportsMedalist: formData.isSportsMedalist,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean)
      };

      const res = await saveProfile(payload);
      if (res.success) {
        setMessage(language === 'hi' ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!' : 'Profile saved successfully in Supabase PostgreSQL!');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err: any) {
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
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'hi' ? 'लिंग (Gender)' : 'Gender'}
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as GenderType })}
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
              onChange={(e) => setFormData({ ...formData, socialCategory: e.target.value as SocialCategory })}
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
              onChange={(e) => setFormData({ ...formData, education: e.target.value as EducationLevel })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500"
            >
              <option value="BELOW_10TH">Below 10th</option>
              <option value="10TH_PASS">10th Pass (मैट्रिक)</option>
              <option value="12TH_PASS">12th Pass (इंटरमीडिएट)</option>
              <option value="DIPLOMA">Diploma / ITI</option>
              <option value="GRADUATE">Graduate (स्नातक)</option>
              <option value="POST_GRADUATE">Post Graduate</option>
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
              onChange={(e) => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
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

        {/* ── Advanced Profile Factors (for better matching) ── */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span>🎯</span>
            <span>{language === 'hi' ? 'अतिरिक्त विवरण (Additional Details)' : 'Additional Details'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Marital Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'वैवाहिक स्थिति (Marital Status)' : 'Marital Status'}
              </label>
              <select
                value={formData.maritalStatus}
                onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500"
              >
                <option value="UNMARRIED">अविवाहित (Unmarried)</option>
                <option value="MARRIED">विवाहित (Married)</option>
                <option value="WIDOW">विधवा (Widow)</option>
                <option value="DIVORCED">तलाकशुदा (Divorced)</option>
              </select>
            </div>

            {/* Employment Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'रोजगार स्थिति (Employment Status)' : 'Employment Status'}
              </label>
              <select
                value={formData.employmentStatus}
                onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500"
              >
                <option value="STUDENT">छात्र (Student)</option>
                <option value="UNEMPLOYED">बेरोजगार (Unemployed)</option>
                <option value="SELF_EMPLOYED">स्वरोजगार (Self Employed)</option>
                <option value="SALARIED_PRIVATE">निजी नौकरी (Private Salaried)</option>
                <option value="GOVT_EMPLOYEE">सरकारी कर्मचारी (Govt Employee)</option>
              </select>
            </div>

            {/* Ration Card Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'राशन कार्ड (Ration Card Type)' : 'Ration Card Type'}
              </label>
              <select
                value={formData.rationCardType}
                onChange={(e) => setFormData({ ...formData, rationCardType: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500"
              >
                <option value="NONE">कोई नहीं / पता नहीं</option>
                <option value="BPL_AAY">BPL - अंत्योदय (AAY)</option>
                <option value="BPL_PHH">BPL - प्राथमिकता (PHH)</option>
                <option value="APL">APL (सामान्य)</option>
              </select>
            </div>

            {/* Area Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'निवास क्षेत्र (Area Type)' : 'Area Type'}
              </label>
              <select
                value={formData.areaType}
                onChange={(e) => setFormData({ ...formData, areaType: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500"
              >
                <option value="RURAL">ग्रामीण (Rural / Panchayat)</option>
                <option value="URBAN">शहरी (Urban / Nagar Nigam)</option>
              </select>
            </div>

            {/* Farmer Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'किसान प्रकार (Farmer Type)' : 'Farmer Classification'}
              </label>
              <select
                value={formData.farmerType}
                onChange={(e) => setFormData({ ...formData, farmerType: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500"
              >
                <option value="NOT_FARMER">किसान नहीं (Not a Farmer)</option>
                <option value="LANDOWNER_RAIYAT">रैयत / भूस्वामी (Landowner)</option>
                <option value="TENANT_SHARECROPPER">बटाईदार / गैर-रैयत (Tenant/Sharecropper)</option>
                <option value="LANDLESS_LABORER">भूमिहीन मजदूर (Landless Laborer)</option>
              </select>
            </div>
          </div>

          {/* Toggle Switches Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Minority */}
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
              <input
                type="checkbox"
                checked={formData.isMinority}
                onChange={(e) => setFormData({ ...formData, isMinority: e.target.checked })}
                className="w-4 h-4 accent-orange-600 rounded"
              />
              <span className="text-xs font-medium text-slate-700">
                {language === 'hi' ? 'अल्पसंख्यक समुदाय (Minority Community)' : 'Minority Community'}
              </span>
            </label>

            {/* Govt Employee in Family */}
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
              <input
                type="checkbox"
                checked={formData.hasGovtEmployeeInFamily}
                onChange={(e) => setFormData({ ...formData, hasGovtEmployeeInFamily: e.target.checked })}
                className="w-4 h-4 accent-orange-600 rounded"
              />
              <span className="text-xs font-medium text-slate-700">
                {language === 'hi' ? 'परिवार में सरकारी कर्मचारी / पेंशनभोगी' : 'Govt employee / pensioner in family'}
              </span>
            </label>

            {/* Income Tax Payer */}
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
              <input
                type="checkbox"
                checked={formData.isIncomeTaxPayer}
                onChange={(e) => setFormData({ ...formData, isIncomeTaxPayer: e.target.checked })}
                className="w-4 h-4 accent-orange-600 rounded"
              />
              <span className="text-xs font-medium text-slate-700">
                {language === 'hi' ? 'आयकर दाता (Income Tax Payer)' : 'Income Tax Payer'}
              </span>
            </label>

            {/* Aadhaar DBT Linked */}
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
              <input
                type="checkbox"
                checked={formData.isAadhaarDbtLinked}
                onChange={(e) => setFormData({ ...formData, isAadhaarDbtLinked: e.target.checked })}
                className="w-4 h-4 accent-orange-600 rounded"
              />
              <span className="text-xs font-medium text-slate-700">
                {language === 'hi' ? 'आधार से बैंक खाता लिंक (DBT सीडिंग)' : 'Aadhaar-linked Bank Account (DBT)'}
              </span>
            </label>
          </div>

          {/* Specialty Flags - Collapsible */}
          <details className="pt-2">
            <summary className="text-xs font-bold text-slate-600 cursor-pointer hover:text-orange-600">
              {language === 'hi' ? '▸ विशेष श्रेणी (UPSC, मत्स्य, प्रवासी, खेल, सोलर)' : '▸ Specialty Categories (UPSC, Fishery, Migrant, Sports, Solar)'}
            </summary>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                <input type="checkbox" checked={formData.hasClearedPrelims} onChange={(e) => setFormData({ ...formData, hasClearedPrelims: e.target.checked })} className="w-4 h-4 accent-orange-600 rounded" />
                <span className="text-xs font-medium text-slate-700">{language === 'hi' ? 'UPSC / BPSC प्रारंभिक परीक्षा उत्तीर्ण' : 'Cleared UPSC/BPSC Prelims'}</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                <input type="checkbox" checked={formData.hasFisheryPond} onChange={(e) => setFormData({ ...formData, hasFisheryPond: e.target.checked })} className="w-4 h-4 accent-orange-600 rounded" />
                <span className="text-xs font-medium text-slate-700">{language === 'hi' ? 'मत्स्य पालन तालाब है' : 'Own a fishery pond'}</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                <input type="checkbox" checked={formData.isMigrantWorker} onChange={(e) => setFormData({ ...formData, isMigrantWorker: e.target.checked })} className="w-4 h-4 accent-orange-600 rounded" />
                <span className="text-xs font-medium text-slate-700">{language === 'hi' ? 'प्रवासी मजदूर (Migrant Worker)' : 'Migrant Worker'}</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                <input type="checkbox" checked={formData.isSportsMedalist} onChange={(e) => setFormData({ ...formData, isSportsMedalist: e.target.checked })} className="w-4 h-4 accent-orange-600 rounded" />
                <span className="text-xs font-medium text-slate-700">{language === 'hi' ? 'राज्य / राष्ट्रीय स्तर पदक विजेता (Sports Medalist)' : 'State/National Sports Medalist'}</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                <input type="checkbox" checked={formData.hasElectricityConnection} onChange={(e) => setFormData({ ...formData, hasElectricityConnection: e.target.checked })} className="w-4 h-4 accent-orange-600 rounded" />
                <span className="text-xs font-medium text-slate-700">{language === 'hi' ? 'विद्युत कनेक्शन है (Electricity Connection)' : 'Has Electricity Connection'}</span>
              </label>
            </div>
          </details>
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
