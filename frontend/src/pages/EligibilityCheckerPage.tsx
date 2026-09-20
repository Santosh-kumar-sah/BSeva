import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  FileCheck, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { eligibilityService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  CitizenProfile, 
  EligibilityCheckResponse, 
  SchemeEvaluationResult, 
  GenderType, 
  SocialCategory, 
  EducationLevel 
} from '../types';
import SchemeCard from '../components/common/SchemeCard';

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
    isSportsMedalist: false
  });

  const [results, setResults] = useState<EligibilityCheckResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'POTENTIALLY_ELIGIBLE' | 'NEEDS_VERIFICATION' | 'LIKELY_NOT_ELIGIBLE'>('POTENTIALLY_ELIGIBLE');

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
        isSportsMedalist: profile.isSportsMedalist || false
      });
    }
  }, [profile]);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
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
        isSportsMedalist: formData.isSportsMedalist
      };

      const res = await eligibilityService.checkEligibility(payload);
      if (res.success) {
        setResults(res);
      }
    } catch (err) {
      console.error('Error running eligibility evaluation:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="pb-4 border-b border-border">
        <div className="flex items-center gap-1.5 text-xs font-bold text-brand uppercase tracking-wider mb-1">
          <CheckSquare className="w-4 h-4" strokeWidth={2} />
          <span>{language === 'hi' ? '14-कारकीय नियम इंजन' : 'Deterministic 14-Factor Rule Engine'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight">
          {language === 'hi' ? 'सरकारी योजना पात्रता जांच' : 'Scheme Eligibility Assessment'}
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">
          {language === 'hi'
            ? 'अपनी आयु, जिला, शिक्षा एवं आय दर्ज करें। हमारा इंजन सरकारी नियमों के आधार पर आपके योग्य योजनाओं की गणना करता है।'
            : 'Enter your demographic and educational profile. Our engine evaluates rules across all 25+ Bihar schemes.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: 14-Factor Form */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-border p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand" strokeWidth={2} />
              <span>{language === 'hi' ? 'नागरिक प्रोफाइल विवरण' : 'Citizen Criteria Form'}</span>
            </h2>
            <span className="text-[11px] font-bold text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded-full">
              14 Factors
            </span>
          </div>

          <form onSubmit={handleEvaluate} className="space-y-4">
            
            {/* District */}
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                {language === 'hi' ? 'जिला (District)' : 'District'}
              </label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand cursor-pointer"
              >
                {BIHAR_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  {language === 'hi' ? 'आयु (Age)' : 'Age (Years)'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  {language === 'hi' ? 'लिंग (Gender)' : 'Gender'}
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as GenderType })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand cursor-pointer"
                >
                  <option value="MALE">Male (पुरुष)</option>
                  <option value="FEMALE">Female (महिला)</option>
                  <option value="OTHER">Other (अन्य)</option>
                </select>
              </div>
            </div>

            {/* Category & Education */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  {language === 'hi' ? 'सामाजिक वर्ग' : 'Category'}
                </label>
                <select
                  value={formData.socialCategory}
                  onChange={(e) => setFormData({ ...formData, socialCategory: e.target.value as SocialCategory })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand cursor-pointer"
                >
                  <option value="GENERAL">General</option>
                  <option value="EBC">EBC (अत्यंत पिछड़ा)</option>
                  <option value="OBC">BC / OBC (पिछड़ा)</option>
                  <option value="SC">SC (अनुसूचित जाति)</option>
                  <option value="ST">ST (अनुसूचित जनजाति)</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  {language === 'hi' ? 'शिक्षा स्तर' : 'Education'}
                </label>
                <select
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value as EducationLevel })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand cursor-pointer"
                >
                  <option value="BELOW_10TH">Below 10th</option>
                  <option value="10TH_PASS">10th Pass (मैट्रिक)</option>
                  <option value="12TH_PASS">12th Pass (इंटर)</option>
                  <option value="DIPLOMA">Diploma / ITI</option>
                  <option value="GRADUATE">Graduate (स्नातक)</option>
                  <option value="POST_GRADUATE">Post Graduate</option>
                </select>
              </div>
            </div>

            {/* Income */}
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                {language === 'hi' ? 'वार्षिक पारिवारिक आय (INR)' : 'Annual Family Income (INR)'}
              </label>
              <input
                type="number"
                min="0"
                step="10000"
                value={formData.annualIncome}
                onChange={(e) => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
              />
            </div>

            {/* Marital & Employment Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  {language === 'hi' ? 'वैवाहिक स्थिति' : 'Marital Status'}
                </label>
                <select
                  value={formData.maritalStatus}
                  onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand cursor-pointer"
                >
                  <option value="UNMARRIED">अविवाहित (Unmarried)</option>
                  <option value="MARRIED">विवाहित (Married)</option>
                  <option value="WIDOW">विधवा (Widow)</option>
                  <option value="DIVORCED">तलाकशुदा (Divorced)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  {language === 'hi' ? 'रोजगार स्थिति' : 'Employment'}
                </label>
                <select
                  value={formData.employmentStatus}
                  onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand cursor-pointer"
                >
                  <option value="STUDENT">छात्र (Student)</option>
                  <option value="UNEMPLOYED">बेरोजगार (Unemployed)</option>
                  <option value="SELF_EMPLOYED">स्वरोजगार (Self)</option>
                  <option value="SALARIED_PRIVATE">निजी नौकरी (Private)</option>
                  <option value="GOVT_EMPLOYEE">सरकारी (Govt)</option>
                </select>
              </div>
            </div>

            {/* Checkboxes Row */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border cursor-pointer hover:border-brand/40">
                <input
                  type="checkbox"
                  checked={formData.isMinority}
                  onChange={(e) => setFormData({ ...formData, isMinority: e.target.checked })}
                  className="w-4 h-4 accent-brand rounded"
                />
                <span className="text-[11px] font-semibold text-text-primary">
                  {language === 'hi' ? 'अल्पसंख्यक (Minority)' : 'Minority'}
                </span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border cursor-pointer hover:border-brand/40">
                <input
                  type="checkbox"
                  checked={formData.isDifferentlyAbled}
                  onChange={(e) => setFormData({ ...formData, isDifferentlyAbled: e.target.checked })}
                  className="w-4 h-4 accent-brand rounded"
                />
                <span className="text-[11px] font-semibold text-text-primary">
                  {language === 'hi' ? 'दिव्यांग (PH)' : 'Differently Abled'}
                </span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border cursor-pointer hover:border-brand/40">
                <input
                  type="checkbox"
                  checked={formData.isIncomeTaxPayer}
                  onChange={(e) => setFormData({ ...formData, isIncomeTaxPayer: e.target.checked })}
                  className="w-4 h-4 accent-brand rounded"
                />
                <span className="text-[11px] font-semibold text-text-primary">
                  {language === 'hi' ? 'आयकर दाता (Tax Payer)' : 'Income Tax Payer'}
                </span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border cursor-pointer hover:border-brand/40">
                <input
                  type="checkbox"
                  checked={formData.isAadhaarDbtLinked}
                  onChange={(e) => setFormData({ ...formData, isAadhaarDbtLinked: e.target.checked })}
                  className="w-4 h-4 accent-brand rounded"
                />
                <span className="text-[11px] font-semibold text-text-primary">
                  {language === 'hi' ? 'आधार DBT सीडेड' : 'Aadhaar DBT Linked'}
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand hover:bg-brand-dark text-white font-bold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 active:scale-98"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckSquare className="w-4 h-4" strokeWidth={2} />
                  <span>{language === 'hi' ? 'पात्रता की गणना करें' : 'Evaluate Eligibility Now'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Col: Assessment Results */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Summary Metric Cards */}
          {results ? (
            <div className="space-y-6">
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('POTENTIALLY_ELIGIBLE')}
                  className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                    activeTab === 'POTENTIALLY_ELIGIBLE'
                      ? 'bg-success/15 border-success text-success shadow-sm ring-2 ring-success/30'
                      : 'bg-white border-border text-text-secondary hover:bg-background'
                  }`}
                >
                  <div className="text-2xl sm:text-3xl font-extrabold text-success">
                    {results.summary.potentiallyEligibleCount}
                  </div>
                  <div className="text-xs font-bold text-text-primary mt-1">
                    {language === 'hi' ? 'योग्य' : 'Eligible'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('NEEDS_VERIFICATION')}
                  className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                    activeTab === 'NEEDS_VERIFICATION'
                      ? 'bg-accent-gold/20 border-accent-gold text-accent-gold-dark shadow-sm ring-2 ring-accent-gold/30'
                      : 'bg-white border-border text-text-secondary hover:bg-background'
                  }`}
                >
                  <div className="text-2xl sm:text-3xl font-extrabold text-accent-gold">
                    {results.summary.needsVerificationCount}
                  </div>
                  <div className="text-xs font-bold text-text-primary mt-1">
                    {language === 'hi' ? 'समीक्षाधीन' : 'Verify'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('LIKELY_NOT_ELIGIBLE')}
                  className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                    activeTab === 'LIKELY_NOT_ELIGIBLE'
                      ? 'bg-gray-100 border-gray-400 text-gray-800 shadow-sm ring-2 ring-gray-300'
                      : 'bg-white border-border text-text-secondary hover:bg-background'
                  }`}
                >
                  <div className="text-2xl sm:text-3xl font-extrabold text-text-secondary">
                    {results.summary.likelyNotEligibleCount}
                  </div>
                  <div className="text-xs font-bold text-text-primary mt-1">
                    {language === 'hi' ? 'अपात्र' : 'Ineligible'}
                  </div>
                </button>
              </div>

              {/* Matched Scheme Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h3 className="text-base font-bold text-text-primary">
                    {activeTab === 'POTENTIALLY_ELIGIBLE' && (language === 'hi' ? 'योग्य योजनाएं (100% सटीक मिलान)' : 'Directly Qualified Schemes')}
                    {activeTab === 'NEEDS_VERIFICATION' && (language === 'hi' ? 'सत्यापन आवश्यक योजनाएं' : 'Conditional Schemes')}
                    {activeTab === 'LIKELY_NOT_ELIGIBLE' && (language === 'hi' ? 'अपात्र योजनाएं' : 'Ineligible Schemes')}
                  </h3>
                  <span className="text-xs font-bold text-text-secondary">
                    {results.results[activeTab === 'POTENTIALLY_ELIGIBLE' ? 'potentiallyEligible' : activeTab === 'NEEDS_VERIFICATION' ? 'needsVerification' : 'likelyNotEligible'].length} {language === 'hi' ? 'योजनाएं' : 'Schemes'}
                  </span>
                </div>

                <div className="space-y-4">
                  {results.results[activeTab === 'POTENTIALLY_ELIGIBLE' ? 'potentiallyEligible' : activeTab === 'NEEDS_VERIFICATION' ? 'needsVerification' : 'likelyNotEligible'].map((schemeRes) => (
                    <div
                      key={schemeRes.schemeId}
                      className="bg-white rounded-xl border border-border shadow-card p-5 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              activeTab === 'POTENTIALLY_ELIGIBLE' 
                                ? 'bg-success/15 text-success border border-success/30' 
                                : activeTab === 'NEEDS_VERIFICATION' 
                                  ? 'bg-accent-gold/20 text-[#855B17] border border-accent-gold/40' 
                                  : 'bg-gray-100 text-gray-700 border border-gray-300'
                            }`}>
                              {schemeRes.matchScore}% {language === 'hi' ? 'मैच' : 'Match'}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-text-primary hover:text-brand transition-colors">
                            {language === 'hi' && schemeRes.title_hi ? schemeRes.title_hi : schemeRes.title_en}
                          </h4>
                        </div>

                        <a
                          href={schemeRes.officialPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-brand hover:bg-brand-dark text-white rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 shadow-sm transition-colors"
                        >
                          <span>{language === 'hi' ? 'आवेदन पोर्टल' : 'Apply'}</span>
                          <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
                        </a>
                      </div>

                      {/* Benefits */}
                      {(schemeRes.benefits_hi || schemeRes.benefits_en) && (
                        <div className="bg-hero-bg rounded-lg p-2.5 text-xs text-text-primary border border-border/80">
                          <span className="font-bold text-brand block mb-0.5">{language === 'hi' ? 'वित्तीय लाभ:' : 'Benefits:'}</span>
                          {language === 'hi' && schemeRes.benefits_hi ? schemeRes.benefits_hi : schemeRes.benefits_en}
                        </div>
                      )}

                      {/* Rule breakdown chips */}
                      {schemeRes.passedRules && schemeRes.passedRules.length > 0 && (
                        <div className="pt-2 border-t border-border flex flex-wrap gap-1.5">
                          {schemeRes.passedRules.map((rule, rIdx) => (
                            <span key={rIdx} className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success/10 border border-success/25 px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
                              {rule.message_hi || rule.field}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-xl border border-border p-12 text-center space-y-4 shadow-card">
              <div className="w-14 h-14 rounded-full bg-hero-bg text-brand flex items-center justify-center mx-auto border border-brand/20">
                <CheckSquare className="w-7 h-7" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-bold text-text-primary">
                {language === 'hi' ? 'अपनी पात्रता जांचने के लिए फॉर्म भरें' : 'Ready for Eligibility Assessment'}
              </h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
                {language === 'hi'
                  ? 'बाएं फॉर्म में अपनी जानकारी भरें और "पात्रता की गणना करें" बटन दबाएं। तुरंत सभी 25+ योजनाओं में आपकी योग्यता दिखेगी।'
                  : 'Fill in your details in the left form and click Evaluate to see exact qualification results.'}
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
