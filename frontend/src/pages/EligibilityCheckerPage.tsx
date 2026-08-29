import React, { useState, FormEvent, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Tractor,
  Heart,
  Building2,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { eligibilityService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { EligibilityCheckResponse, CitizenProfile, SchemeEvaluationResult } from '../types';

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
    education: profile?.education || 'GRADUATE',
    annualIncome: profile?.annualIncome || 120000,
    landHoldingAcres: profile?.landHoldingAcres || 0,
    isDifferentlyAbled: profile?.isDifferentlyAbled || false,
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
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<EligibilityCheckResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'EDUCATION' | 'CAREER_STARTUP' | 'WELFARE'>('ALL');
  const [showIneligible, setShowIneligible] = useState<boolean>(false);

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

  // Group schemes by sector
  const categorizedEligible = useMemo(() => {
    if (!results?.results?.potentiallyEligible) return { education: [], careerStartup: [], welfare: [] };

    const education = [];
    const careerStartup = [];
    const welfare = [];

    for (const item of results.results.potentiallyEligible) {
      const slug = item.schemeSlug;
      if (slug.includes('credit') || slug.includes('scholarship') || slug.includes('post-matric') || slug.includes('balak') || slug.includes('kanya-utthan')) {
        education.push(item);
      } else if (slug.includes('udyami') || slug.includes('startup') || slug.includes('kyp') || slug.includes('civil-seva')) {
        careerStartup.push(item);
      } else {
        welfare.push(item);
      }
    }

    return { education, careerStartup, welfare };
  }, [results]);

  const filterSchemes = (list: SchemeEvaluationResult[]) => {
    if (activeTab === 'ALL') return list;
    if (activeTab === 'EDUCATION') {
      return list.filter(s => s.schemeSlug.includes('credit') || s.schemeSlug.includes('scholarship') || s.schemeSlug.includes('post-matric') || s.schemeSlug.includes('balak') || s.schemeSlug.includes('kanya'));
    }
    if (activeTab === 'CAREER_STARTUP') {
      return list.filter(s => s.schemeSlug.includes('udyami') || s.schemeSlug.includes('startup') || s.schemeSlug.includes('kyp') || s.schemeSlug.includes('civil-seva'));
    }
    return list.filter(s => !s.schemeSlug.includes('credit') && !s.schemeSlug.includes('scholarship') && !s.schemeSlug.includes('udyami') && !s.schemeSlug.includes('startup') && !s.schemeSlug.includes('kyp'));
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
          {language === 'hi' ? 'अपनी योग्यता और शिक्षा अनुसार सही योजनाएं खोजें' : 'Personalized Eligibility Evaluation'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          {language === 'hi'
            ? 'अपनी बुनियादी जानकारी भरें। हमारा नियम इंजन तुरंत 25+ सत्यापित योजनाओं के साथ आपकी योग्यता का सटीक और श्रेणीबद्ध विश्लेषण करेगा।'
            : 'Enter your demographic credentials. The rule engine evaluates exact departmental criteria and provides an organized breakdown.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Form */}
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

              {/* ── Advanced Profile Factors (for better matching) ── */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span>🎯</span>
                  <span>{language === 'hi' ? 'बेहतर मिलान हेतु अतिरिक्त विवरण' : 'Additional Details for Better Matching'}</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  {language === 'hi' ? 'ये वैकल्पिक फ़ील्ड भरने से अधिक सटीक योजना सुझाव मिलेंगे।' : 'Fill these optional fields to get more accurate scheme recommendations.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Marital Status */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'hi' ? 'वैवाहिक स्थिति (Marital Status)' : 'Marital Status'}
                    </label>
                    <select
                      value={formData.maritalStatus}
                      onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white"
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white"
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white"
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white"
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white"
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

        {/* Right Column: Results Display */}
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
              
              {/* Summary Stats Cards */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-emerald-900/40 border border-emerald-700/50 rounded-2xl">
                  <div className="text-2xl font-black text-emerald-400">
                    {results.summary.potentiallyEligibleCount}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-200 mt-1">
                    {language === 'hi' ? 'सीधे पात्र' : 'Directly Qualified'}
                  </div>
                </div>

                <div className="p-3 bg-amber-900/40 border border-amber-700/50 rounded-2xl">
                  <div className="text-2xl font-black text-amber-400">
                    {results.summary.needsVerificationCount}
                  </div>
                  <div className="text-[11px] font-semibold text-amber-200 mt-1">
                    {language === 'hi' ? 'शर्त/प्रमाण सत्यापन' : 'Verification'}
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

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setActiveTab('ALL')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeTab === 'ALL'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {language === 'hi' ? 'सभी योजनाएं' : 'All Eligible'} ({results.results.potentiallyEligible.length})
                </button>
                <button
                  onClick={() => setActiveTab('EDUCATION')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'EDUCATION'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'शिक्षा व छात्रवृत्ति' : 'Education & Scholarships'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('CAREER_STARTUP')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'CAREER_STARTUP'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'उद्यम व रोजगार' : 'Startups & Skills'}</span>
                </button>
              </div>

              {/* Potentially Eligible Schemes Section */}
              <div className="space-y-4">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{language === 'hi' ? 'आपके लिए सीधे पात्र सरकारी योजनाएं' : 'Directly Qualified Schemes'}</span>
                </h2>

                <div className="space-y-4">
                  {filterSchemes(results.results.potentiallyEligible).map((item) => (
                    <div key={item.schemeId} className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-sm space-y-4 hover:shadow-md transition">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 mb-1.5">
                            100% Match (पात्र)
                          </span>
                          <Link to={`/schemes/${item.schemeSlug}`}>
                            <h3 className="text-base font-extrabold text-slate-900 hover:text-emerald-700 transition">
                              {language === 'hi' ? item.title_hi : item.title_en}
                            </h3>
                          </Link>
                        </div>
                      </div>

                      {/* Benefits box */}
                      {(item.benefits_hi || item.benefits_en) && (
                        <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 text-xs text-emerald-950 font-semibold">
                          💰 {language === 'hi' ? item.benefits_hi : item.benefits_en}
                        </div>
                      )}

                      {/* Passed rules breakdown */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                          {language === 'hi' ? 'संतुष्ट पात्रता शर्तें (Passed Rules):' : 'Satisfied Eligibility Criteria:'}
                        </p>
                        {item.passedRules.map((pr, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{pr.message_hi}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          to={`/schemes/${item.schemeSlug}`}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>{language === 'hi' ? 'दस्तावेज चेकलिस्ट' : 'View Documents'}</span>
                        </Link>

                        <a
                          href={item.officialPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm"
                        >
                          <span>{language === 'hi' ? 'आवेदन पोर्टल' : 'Official Portal'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Needs Verification Schemes Section */}
              {results.results.needsVerification && results.results.needsVerification.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    <span>{language === 'hi' ? 'विशिष्ट प्रमाण/परीक्षा उत्तीर्ण होने पर पात्र' : 'Requires Specific Proof / Exam Qualification'}</span>
                  </h2>

                  <div className="space-y-4">
                    {results.results.needsVerification.map((item) => (
                      <div key={item.schemeId} className="bg-white rounded-3xl border border-amber-200 p-6 shadow-sm space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 mb-1.5">
                              सत्यापन आवश्यक (Verification Needed)
                            </span>
                            <Link to={`/schemes/${item.schemeSlug}`}>
                              <h3 className="text-base font-extrabold text-slate-900 hover:text-amber-700 transition">
                                {language === 'hi' ? item.title_hi : item.title_en}
                              </h3>
                            </Link>
                          </div>
                        </div>

                        {/* Missing required condition notice */}
                        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                          <p className="font-bold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{language === 'hi' ? 'आवश्यक अतिरिक्त शर्त:' : 'Required Additional Condition:'}</span>
                          </p>
                          {item.missingRules?.map((mr, mIdx) => (
                            <p key={mIdx} className="text-[11px] pl-4">• {mr.message_hi}</p>
                          ))}
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                          <Link to={`/schemes/${item.schemeSlug}`} className="text-xs font-bold text-amber-700 hover:underline">
                            {language === 'hi' ? 'योजना के नियम एवं गाइडलाइन →' : 'Read Guidelines →'}
                          </Link>
                          <a href={item.officialPortalUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
                            <span>Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ineligible Section (Collapsible) */}
              {results.results.likelyNotEligible && results.results.likelyNotEligible.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setShowIneligible(!showIneligible)}
                    className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-between text-xs font-bold text-slate-700 transition"
                  >
                    <span>{language === 'hi' ? `अन्य योजनाएं जिनके आप पात्र नहीं हैं (${results.results.likelyNotEligible.length})` : `Ineligible Schemes (${results.results.likelyNotEligible.length})`}</span>
                    {showIneligible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showIneligible && (
                    <div className="space-y-3 pt-3">
                      {results.results.likelyNotEligible.map((item) => (
                        <div key={item.schemeId} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs opacity-75">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{language === 'hi' ? item.title_hi : item.title_en}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">अपात्र</span>
                          </div>
                          {item.failedRules?.map((fr, fIdx) => (
                            <p key={fIdx} className="text-[11px] text-rose-600 mt-1">
                              ✕ {fr.message_hi} (आपका मान: {JSON.stringify(fr.actual)})
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
