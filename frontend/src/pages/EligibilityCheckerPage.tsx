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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-wider">
          <CheckSquare className="w-4 h-4" strokeWidth={1.5} />
          <span>{language === 'hi' ? 'स्मार्ट पात्रता नियम इंजन' : 'Deterministic Eligibility Engine'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
          {language === 'hi' ? 'अपनी योग्यता और शिक्षा अनुसार सही योजनाएं खोजें' : 'Personalized Scheme Eligibility'}
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          {language === 'hi'
            ? 'अपनी बुनियादी जानकारी भरें। हमारा नियम इंजन तुरंत 25+ सत्यापित योजनाओं के साथ आपकी योग्यता का सटीक और श्रेणीबद्ध विश्लेषण करेगा।'
            : 'Enter your profile attributes. The rule engine evaluates official department criteria and shows your matched schemes.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5">
          <div className="bg-surface rounded-xl border border-border p-6 sm:p-8 shadow-card space-y-6 sticky top-24">
            <h2 className="text-base font-semibold text-text-primary border-b border-border pb-3">
              {language === 'hi' ? 'अपनी जानकारी दर्ज करें' : 'Enter Profile Details'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Bihar Resident Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                <div>
                  <label className="text-xs font-semibold text-text-primary">
                    {language === 'hi' ? 'क्या आप बिहार के निवासी हैं?' : 'Are you a Bihar resident?'}
                  </label>
                  <p className="text-[11px] text-text-secondary">{language === 'hi' ? 'राज्य स्तरीय योजनाओं के लिए अनिवार्य' : 'Required for state schemes'}</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isBiharResident}
                  onChange={(e) => setFormData({ ...formData, isBiharResident: e.target.checked })}
                  className="w-4 h-4 accent-brand rounded"
                />
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  {language === 'hi' ? 'जिला (District)' : 'District'}
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                >
                  {BIHAR_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    {language === 'hi' ? 'आयु (Age)' : 'Age (Years)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    {language === 'hi' ? 'लिंग (Gender)' : 'Gender'}
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
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
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    {language === 'hi' ? 'वर्ग (Category)' : 'Social Category'}
                  </label>
                  <select
                    value={formData.socialCategory}
                    onChange={(e) => setFormData({ ...formData, socialCategory: e.target.value as any })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
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
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    {language === 'hi' ? 'शिक्षा (Education)' : 'Education Level'}
                  </label>
                  <select
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
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
                <div className="flex items-center justify-between text-xs font-semibold text-text-primary mb-1">
                  <span>{language === 'hi' ? 'वार्षिक पारिवारिक आय' : 'Annual Family Income'}</span>
                  <span className="text-brand font-bold">₹{Number(formData.annualIncome).toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
                  className="w-full accent-brand"
                />
              </div>

              {/* Land Holding */}
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  {language === 'hi' ? 'खेती योग्य भूमि (एकड़ में)' : 'Agricultural Land (Acres)'}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.landHoldingAcres}
                  onChange={(e) => setFormData({ ...formData, landHoldingAcres: Number(e.target.value) })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
              </div>

              {/* Differently Abled Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="divyang"
                  checked={formData.isDifferentlyAbled}
                  onChange={(e) => setFormData({ ...formData, isDifferentlyAbled: e.target.checked })}
                  className="w-4 h-4 accent-brand rounded"
                />
                <label htmlFor="divyang" className="text-xs text-text-primary font-medium">
                  {language === 'hi' ? 'दिव्यांगजन (Differently Abled 40%+)' : 'Differently Abled (40%+)'}
                </label>
              </div>

              {/* ── Advanced Profile Factors ── */}
              <div className="pt-4 border-t border-border space-y-3">
                <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wide">
                  {language === 'hi' ? 'अतिरिक्त विवरण (सटीक मिलान हेतु)' : 'Additional Profile Attributes'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">
                      {language === 'hi' ? 'वैवाहिक स्थिति' : 'Marital Status'}
                    </label>
                    <select
                      value={formData.maritalStatus}
                      onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value as any })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    >
                      <option value="UNMARRIED">अविवाहित (Unmarried)</option>
                      <option value="MARRIED">विवाहित (Married)</option>
                      <option value="WIDOW">विधवा (Widow)</option>
                      <option value="DIVORCED">तलाकशुदा (Divorced)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">
                      {language === 'hi' ? 'रोजगार स्थिति' : 'Employment Status'}
                    </label>
                    <select
                      value={formData.employmentStatus}
                      onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value as any })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    >
                      <option value="STUDENT">छात्र (Student)</option>
                      <option value="UNEMPLOYED">बेरोजगार (Unemployed)</option>
                      <option value="SELF_EMPLOYED">स्वरोजगार (Self Employed)</option>
                      <option value="SALARIED_PRIVATE">निजी नौकरी (Private)</option>
                      <option value="GOVT_EMPLOYEE">सरकारी कर्मचारी (Govt)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">
                      {language === 'hi' ? 'राशन कार्ड' : 'Ration Card'}
                    </label>
                    <select
                      value={formData.rationCardType}
                      onChange={(e) => setFormData({ ...formData, rationCardType: e.target.value as any })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    >
                      <option value="NONE">कोई नहीं (None)</option>
                      <option value="BPL_AAY">BPL - अंत्योदय (AAY)</option>
                      <option value="BPL_PHH">BPL - प्राथमिकता (PHH)</option>
                      <option value="APL">APL (सामान्य)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">
                      {language === 'hi' ? 'निवास क्षेत्र' : 'Area Type'}
                    </label>
                    <select
                      value={formData.areaType}
                      onChange={(e) => setFormData({ ...formData, areaType: e.target.value as any })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    >
                      <option value="RURAL">ग्रामीण (Rural)</option>
                      <option value="URBAN">शहरी (Urban)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">
                      {language === 'hi' ? 'किसान प्रकार' : 'Farmer Type'}
                    </label>
                    <select
                      value={formData.farmerType}
                      onChange={(e) => setFormData({ ...formData, farmerType: e.target.value as any })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    >
                      <option value="NOT_FARMER">किसान नहीं (Not Farmer)</option>
                      <option value="LANDOWNER_RAIYAT">रैयत / भूस्वामी (Landowner)</option>
                      <option value="TENANT_SHARECROPPER">बटाईदार (Tenant)</option>
                      <option value="LANDLESS_LABORER">भूमिहीन मजदूर (Laborer)</option>
                    </select>
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-background border border-border cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isMinority}
                      onChange={(e) => setFormData({ ...formData, isMinority: e.target.checked })}
                      className="w-4 h-4 accent-brand rounded"
                    />
                    <span className="text-text-primary">{language === 'hi' ? 'अल्पसंख्यक समुदाय' : 'Minority'}</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-background border border-border cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasGovtEmployeeInFamily}
                      onChange={(e) => setFormData({ ...formData, hasGovtEmployeeInFamily: e.target.checked })}
                      className="w-4 h-4 accent-brand rounded"
                    />
                    <span className="text-text-primary">{language === 'hi' ? 'सरकारी कर्मचारी परिवार' : 'Govt Employee Family'}</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-background border border-border cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isIncomeTaxPayer}
                      onChange={(e) => setFormData({ ...formData, isIncomeTaxPayer: e.target.checked })}
                      className="w-4 h-4 accent-brand rounded"
                    />
                    <span className="text-text-primary">{language === 'hi' ? 'आयकर दाता' : 'Income Tax Payer'}</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-background border border-border cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAadhaarDbtLinked}
                      onChange={(e) => setFormData({ ...formData, isAadhaarDbtLinked: e.target.checked })}
                      className="w-4 h-4 accent-brand rounded"
                    />
                    <span className="text-text-primary">{language === 'hi' ? 'आधार DBT सीडिंग' : 'Aadhaar DBT Linked'}</span>
                  </label>
                </div>
              </div>

              {/* Primary Evaluate Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-brand hover:bg-brand-dark text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" strokeWidth={1.5} />
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
            <div className="bg-surface rounded-xl border border-border p-12 text-center space-y-4 shadow-card">
              <div className="w-12 h-12 rounded-lg bg-hero-bg text-brand flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-text-primary">
                {language === 'hi' ? 'पात्रता रिपोर्ट देखने के लिए विवरण भरें' : 'Fill Details to Calculate Eligibility'}
              </h3>
              <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
                {language === 'hi'
                  ? 'बाईं ओर अपना प्रोफ़ाइल विवरण चुनें और "पात्रता का विश्लेषण करें" पर क्लिक करें।'
                  : 'Select your demographic attributes on the left and click Evaluate Eligibility.'}
              </p>
            </div>
          )}

          {results && (
            <div className="space-y-6">
              
              {/* Summary Stats Strip */}
              <div className="bg-surface border border-border p-6 rounded-xl shadow-card grid grid-cols-3 gap-4 text-center divide-x divide-border">
                <div>
                  <div className="text-3xl font-bold text-success">
                    {results.summary.potentiallyEligibleCount}
                  </div>
                  <div className="text-xs font-semibold text-text-primary mt-1">
                    {language === 'hi' ? 'सीधे पात्र' : 'Qualified'}
                  </div>
                </div>

                <div>
                  <div className="text-3xl font-bold text-accent-gold">
                    {results.summary.needsVerificationCount}
                  </div>
                  <div className="text-xs font-semibold text-text-primary mt-1">
                    {language === 'hi' ? 'शर्त सत्यापन' : 'Verification'}
                  </div>
                </div>

                <div>
                  <div className="text-3xl font-bold text-text-secondary">
                    {results.summary.likelyNotEligibleCount}
                  </div>
                  <div className="text-xs font-semibold text-text-primary mt-1">
                    {language === 'hi' ? 'अपात्र' : 'Not Eligible'}
                  </div>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setActiveTab('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'ALL'
                      ? 'bg-brand text-white shadow-sm'
                      : 'bg-background hover:bg-border border border-border text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {language === 'hi' ? 'सभी योजनाएं' : 'All'} ({results.results.potentiallyEligible.length})
                </button>
                <button
                  onClick={() => setActiveTab('EDUCATION')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'EDUCATION'
                      ? 'bg-brand text-white shadow-sm'
                      : 'bg-background hover:bg-border border border-border text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>{language === 'hi' ? 'शिक्षा व छात्रवृत्ति' : 'Education'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('CAREER_STARTUP')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'CAREER_STARTUP'
                      ? 'bg-brand text-white shadow-sm'
                      : 'bg-background hover:bg-border border border-border text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>{language === 'hi' ? 'उद्यम व कौशल' : 'Skills & Enterprise'}</span>
                </button>
              </div>

              {/* Potentially Eligible Schemes Section */}
              <div className="space-y-4">
                <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" strokeWidth={1.5} />
                  <span>{language === 'hi' ? 'सीधे पात्र सरकारी योजनाएं' : 'Directly Qualified Schemes'}</span>
                </h2>

                <div className="space-y-4">
                  {filterSchemes(results.results.potentiallyEligible).map((item) => (
                    <div key={item.schemeId} className="bg-surface rounded-xl border border-border p-6 shadow-card space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-medium bg-success/10 text-success border border-success/30 mb-1.5">
                            100% Match (पात्र)
                          </span>
                          <Link to={`/schemes/${item.schemeSlug}`}>
                            <h3 className="text-base font-semibold text-text-primary hover:text-brand transition-colors">
                              {language === 'hi' ? item.title_hi : item.title_en}
                            </h3>
                          </Link>
                        </div>
                      </div>

                      {/* Benefits box */}
                      {(item.benefits_hi || item.benefits_en) && (
                        <div className="p-3 rounded-lg bg-background border border-border text-xs text-text-primary font-medium">
                          {language === 'hi' ? item.benefits_hi : item.benefits_en}
                        </div>
                      )}

                      {/* Passed rules breakdown */}
                      <div className="space-y-1.5 pt-2 border-t border-border">
                        <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wide">
                          {language === 'hi' ? 'संतुष्ट पात्रता शर्तें:' : 'Satisfied Criteria:'}
                        </p>
                        {item.passedRules.map((pr, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-text-secondary">
                            <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" strokeWidth={1.5} />
                            <span>{pr.message_hi}</span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-border flex items-center justify-between">
                        <Link
                          to={`/schemes/${item.schemeSlug}`}
                          className="px-3 py-1.5 border border-border hover:bg-background text-text-primary rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-text-secondary" strokeWidth={1.5} />
                          <span>{language === 'hi' ? 'दस्तावेज चेकलिस्ट' : 'View Documents'}</span>
                        </Link>

                        <a
                          href={item.officialPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-1.5 bg-brand hover:bg-brand-dark text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <span>{language === 'hi' ? 'आवेदन पोर्टल' : 'Official Portal'}</span>
                          <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Needs Verification Schemes Section */}
              {results.results.needsVerification && results.results.needsVerification.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-accent-gold" strokeWidth={1.5} />
                    <span>{language === 'hi' ? 'विशिष्ट प्रमाण/परीक्षा उत्तीर्ण होने पर पात्र' : 'Requires Specific Proof / Verification'}</span>
                  </h2>

                  <div className="space-y-4">
                    {results.results.needsVerification.map((item) => (
                      <div key={item.schemeId} className="bg-surface rounded-xl border border-border p-6 shadow-card space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-medium bg-accent-gold/10 text-accent-gold border border-accent-gold/30 mb-1.5">
                              सत्यापन आवश्यक (Verification Needed)
                            </span>
                            <Link to={`/schemes/${item.schemeSlug}`}>
                              <h3 className="text-base font-semibold text-text-primary hover:text-brand transition-colors">
                                {language === 'hi' ? item.title_hi : item.title_en}
                              </h3>
                            </Link>
                          </div>
                        </div>

                        {/* Missing required condition notice */}
                        <div className="p-3 rounded-lg bg-background border border-border text-xs text-text-secondary space-y-1">
                          <p className="font-semibold text-text-primary flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-accent-gold shrink-0" strokeWidth={1.5} />
                            <span>{language === 'hi' ? 'आवश्यक अतिरिक्त शर्त:' : 'Required Condition:'}</span>
                          </p>
                          {item.missingRules?.map((mr, mIdx) => (
                            <p key={mIdx} className="text-xs pl-4">• {mr.message_hi}</p>
                          ))}
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                          <Link to={`/schemes/${item.schemeSlug}`} className="text-xs font-medium text-brand hover:underline">
                            {language === 'hi' ? 'योजना के नियम एवं गाइडलाइन →' : 'Read Guidelines →'}
                          </Link>
                          <a href={item.officialPortalUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-text-secondary hover:text-text-primary flex items-center gap-1">
                            <span>Portal</span>
                            <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ineligible Section (Collapsible) */}
              {results.results.likelyNotEligible && results.results.likelyNotEligible.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <button
                    onClick={() => setShowIneligible(!showIneligible)}
                    className="w-full py-2.5 px-4 rounded-lg bg-background hover:bg-border/50 border border-border flex items-center justify-between text-xs font-semibold text-text-secondary transition-colors cursor-pointer"
                  >
                    <span>{language === 'hi' ? `अन्य योजनाएं जिनके आप पात्र नहीं हैं (${results.results.likelyNotEligible.length})` : `Ineligible Schemes (${results.results.likelyNotEligible.length})`}</span>
                    {showIneligible ? <ChevronUp className="w-4 h-4" strokeWidth={1.5} /> : <ChevronDown className="w-4 h-4" strokeWidth={1.5} />}
                  </button>

                  {showIneligible && (
                    <div className="space-y-3 pt-3">
                      {results.results.likelyNotEligible.map((item) => (
                        <div key={item.schemeId} className="bg-surface rounded-xl p-4 border border-border text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-text-primary">{language === 'hi' ? item.title_hi : item.title_en}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-lg bg-text-secondary/10 text-text-secondary font-medium border border-border">अपात्र</span>
                          </div>
                          {item.failedRules?.map((fr, fIdx) => (
                            <p key={fIdx} className="text-xs text-brand">
                              ✕ {fr.message_hi}
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
