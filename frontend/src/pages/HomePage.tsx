import React, { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap, 
  Tractor, 
  Briefcase, 
  Heart, 
  ShieldCheck, 
  Building2, 
  ArrowRight,
  ChevronRight,
  Compass,
  FileCheck,
  Landmark
} from 'lucide-react';
import { schemeService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SchemeCard from '../components/common/SchemeCard';
import { Scheme, SchemeCategory } from '../types';

export default function HomePage() {
  const { language } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [featuredSchemes, setFeaturedSchemes] = useState<Scheme[]>([]);
  const [categories, setCategories] = useState<SchemeCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schemesRes, catRes] = await Promise.all([
          schemeService.getSchemes({ limit: 6 }),
          schemeService.getCategories()
        ]);
        if (schemesRes.success) setFeaturedSchemes(schemesRes.schemes);
        if (catRes.success) setCategories(catRes.categories);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/schemes?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'education': return <GraduationCap className="w-6 h-6 text-blue-600" />;
      case 'agriculture': return <Tractor className="w-6 h-6 text-emerald-600" />;
      case 'employment-skills': return <Briefcase className="w-6 h-6 text-orange-600" />;
      case 'women-empowerment': return <Heart className="w-6 h-6 text-rose-600" />;
      case 'social-welfare': return <ShieldCheck className="w-6 h-6 text-purple-600" />;
      default: return <Building2 className="w-6 h-6 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Proud Hero Section with Bihar Heritage Showcase */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        
        {/* Glow ambient backgrounds */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/15 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-emerald-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headline, Search & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Proud State Emblem / Heritage Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-emerald-500/20 border border-orange-400/30 text-xs font-bold text-orange-300 backdrop-blur shadow-sm">
              <Landmark className="w-4 h-4 text-orange-400" />
              <span>
                {language === 'hi' ? 'ज्ञान, शांति और प्रगति की पावन भूमि • बिहार' : 'Land of Wisdom, Peace & Progress • Bihar'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15]">
              {language === 'hi' ? (
                <>
                  नालंदा की विरासत से प्रेरित, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-300">
                    डिजिटल बिहार
                  </span>{' '}
                  का अपना सेवा मंच
                </>
              ) : (
                <>
                  Rooted in Heritage, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-300">
                    Empowering Modern Bihar
                  </span>{' '}
                  with Direct GovTech Access
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              {language === 'hi'
                ? 'बिहार सरकार के सभी 5 विभागों की 25+ छात्रवृत्ति, कृषि अनुदान, महिला स्वावलंबन एवं रोजगार योजनाओं की पात्रता तुरंत जांचें।'
                : 'Instant eligibility matching, document verification checklists, and direct official portal links across 25+ verified Bihar Govt schemes.'}
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="relative flex items-center max-w-xl pt-2">
              <input
                type="text"
                placeholder={language === 'hi' ? 'उदा. कन्या उत्थान, स्टूडेंट क्रेडिट कार्ड, कृषि यंत्र, पोस्ट मैट्रिक...' : 'e.g. Kanya Utthan, Student Credit Card, Krishi Yantra, KYP...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white/20 transition shadow-xl"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4" />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-xs rounded-xl shadow-md transition"
              >
                {language === 'hi' ? 'खोजें' : 'Search'}
              </button>
            </form>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/eligibility"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/40 transition hover:scale-105"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'hi' ? 'पात्रता जांचें' : 'Check Eligibility'}</span>
              </Link>

              <Link
                to="/documents"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-xs shadow-lg shadow-amber-950/40 transition hover:scale-105"
              >
                <FileCheck className="w-4 h-4" />
                <span>{language === 'hi' ? 'दस्तावेज चेकलिस्ट' : 'Document Auditor'}</span>
              </Link>

              <Link
                to="/careers"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 backdrop-blur transition"
              >
                <Compass className="w-4 h-4 text-orange-400" />
                <span>{language === 'hi' ? 'करियर' : 'Careers'}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Dual Cinematic Heritage Showcase */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Heritage Card 1: Rajgir Buddha */}
            <div className="group relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl bg-slate-900/60 aspect-[4/5] flex flex-col justify-end">
              <img
                src="/images/bihar_rajgir_buddha.jpg"
                alt="Ghora Katora Buddha Statue Rajgir Bihar"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              
              <div className="relative p-4 space-y-1 text-white">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/80 text-white backdrop-blur border border-amber-400/40">
                  {language === 'hi' ? 'राजगीर • शांति व विरासत' : 'Rajgir • Peace & Heritage'}
                </span>
                <h3 className="text-sm font-black tracking-tight leading-snug">
                  {language === 'hi' ? 'घोड़ा कटोरा बुद्ध प्रतिमा' : 'Ghora Katora Buddha'}
                </h3>
                <p className="text-[10px] text-slate-300 line-clamp-2">
                  {language === 'hi' ? 'पंचपहाड़ियों के बीच शांति का वैश्विक प्रतीक।' : 'Serene symbol of peace amidst the five hills of Rajgir.'}
                </p>
              </div>
            </div>

            {/* Heritage Card 2: Vikramshila / Nalanda Mahavihara */}
            <div className="group relative rounded-3xl overflow-hidden border border-orange-500/30 shadow-2xl bg-slate-900/60 aspect-[4/5] flex flex-col justify-end">
              <img
                src="/images/bihar_nalanda_vikramshila.jpg"
                alt="Ancient Vikramshila and Nalanda Mahavihara Bihar"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              
              <div className="relative p-4 space-y-1 text-white">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-orange-500/80 text-white backdrop-blur border border-orange-400/40">
                  {language === 'hi' ? 'नालंदा • विश्व ज्ञानस्थली' : 'Nalanda • Global Seat of Wisdom'}
                </span>
                <h3 className="text-sm font-black tracking-tight leading-snug">
                  {language === 'hi' ? 'प्राचीन महाविहार धरोहर' : 'Ancient Mahavihara Heritage'}
                </h3>
                <p className="text-[10px] text-slate-300 line-clamp-2">
                  {language === 'hi' ? 'विश्व का प्रथम आवासीय विश्वविद्यालय।' : "World's ancient beacon of universal higher education."}
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. Key Metrics Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="pt-3 sm:pt-0">
            <div className="text-3xl font-extrabold text-slate-900">25+</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              {language === 'hi' ? 'सत्यापित सरकारी योजनाएं' : 'Verified Schemes'}
            </div>
          </div>
          <div className="pt-3 sm:pt-0">
            <div className="text-3xl font-extrabold text-orange-600">5</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              {language === 'hi' ? 'प्रमुख सरकारी विभाग' : 'Key Departments'}
            </div>
          </div>
          <div className="pt-3 sm:pt-0">
            <div className="text-3xl font-extrabold text-emerald-600">8+</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              {language === 'hi' ? 'करियर व स्किल पाथवे' : 'Career Pathways'}
            </div>
          </div>
          <div className="pt-3 sm:pt-0">
            <div className="text-3xl font-extrabold text-blue-600">100%</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              {language === 'hi' ? 'सटीक एवं आधिकारिक स्रोत' : 'Verified Official Sources'}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bihar Development Pillars Visual Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-orange-600 uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" />
              <span>{language === 'hi' ? 'बिहार सरकार की विकास दृष्टि' : 'Development Pillars of Bihar'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {language === 'hi' ? 'शिक्षा, कृषि, युवा और महिला सशक्तिकरण' : 'Education, Agriculture, Youth & Enterprise'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Visual Card 1: Education */}
          <Link
            to="/schemes?category=education"
            className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200 flex flex-col justify-end min-h-[290px]"
          >
            <img
              src="/images/bihar_education_nalanda.jpg"
              alt="Bihar Higher Education & Nalanda Heritage"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
            <div className="relative p-5 space-y-1.5 text-white">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/80 backdrop-blur">
                {language === 'hi' ? 'उच्च शिक्षा एवं छात्रवृत्ति' : 'Higher Education & Loans'}
              </span>
              <h3 className="text-base font-extrabold group-hover:text-blue-300 transition">
                {language === 'hi' ? 'नालंदा से नए बिहार तक ज्ञान' : 'Nalanda Legacy to Modern Tech'}
              </h3>
              <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                {language === 'hi'
                  ? 'स्टूडेंट क्रेडिट कार्ड (₹4 लाख), पोस्ट-मैट्रिक छात्रवृत्ति और कन्या उत्थान योजना।'
                  : 'Student Credit Card (₹4 Lakhs), PMS scholarships, and higher learning.'}
              </p>
              <div className="pt-2 text-[11px] font-bold text-blue-300 flex items-center gap-1">
                <span>{language === 'hi' ? 'योजनाएं देखें →' : 'Explore Schemes →'}</span>
              </div>
            </div>
          </Link>

          {/* Visual Card 2: Agriculture (Makhana) */}
          <Link
            to="/schemes?category=agriculture"
            className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200 flex flex-col justify-end min-h-[290px]"
          >
            <img
              src="/images/bihar_makhana_agriculture.jpg"
              alt="Bihar Agriculture and Makhana Farming"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
            <div className="relative p-5 space-y-1.5 text-white">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/80 backdrop-blur">
                {language === 'hi' ? 'कृषि एवं किसान कल्याण' : 'Agriculture & Farming'}
              </span>
              <h3 className="text-base font-extrabold group-hover:text-emerald-300 transition">
                {language === 'hi' ? 'मखाना व समृद्ध हरित बिहार' : 'Makhana & Gangetic Farmlands'}
              </h3>
              <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                {language === 'hi'
                  ? 'कृषि यंत्रीकरण अनुदान (80%), फसल सहायता, डीजल अनुदान व PM-किसान।'
                  : '80% Farm machinery subsidies, crop insurance, and DBT support.'}
              </p>
              <div className="pt-2 text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                <span>{language === 'hi' ? 'कृषि योजनाएं देखें →' : 'Explore Agriculture →'}</span>
              </div>
            </div>
          </Link>

          {/* Visual Card 3: BSDM Tech Youth */}
          <Link
            to="/careers"
            className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200 flex flex-col justify-end min-h-[290px]"
          >
            <img
              src="/images/bihar_bsdm_tech_youth.jpg"
              alt="BSDM Youth and Tech Skill Training"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
            <div className="relative p-5 space-y-1.5 text-white">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/80 backdrop-blur">
                {language === 'hi' ? 'युवा कौशल एवं IT' : 'Youth Skills & IT Careers'}
              </span>
              <h3 className="text-base font-extrabold group-hover:text-orange-300 transition">
                {language === 'hi' ? 'कुशल युवा कार्यक्रम (KYP)' : 'BSDM Certified Tech Pathways'}
              </h3>
              <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                {language === 'hi'
                  ? 'सॉफ्टवेयर डेवलपमेंट, सोलर PV तकनीशियन और 240 घंटे का निःशुल्क कौशल प्रशिक्षण।'
                  : 'Software engineering, solar energy tech, and free certified skill courses.'}
              </p>
              <div className="pt-2 text-[11px] font-bold text-orange-300 flex items-center gap-1">
                <span>{language === 'hi' ? 'करियर गाइडेंस देखें →' : 'Explore Careers →'}</span>
              </div>
            </div>
          </Link>

          {/* Visual Card 4: Women Entrepreneurship */}
          <Link
            to="/schemes?category=women-empowerment"
            className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200 flex flex-col justify-end min-h-[290px]"
          >
            <img
              src="/images/bihar_women_entrepreneur.jpg"
              alt="Bihar Women Entrepreneurs and Handloom"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
            <div className="relative p-5 space-y-1.5 text-white">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/80 backdrop-blur">
                {language === 'hi' ? 'महिला उद्यमिता व स्वावलंबन' : 'Women Entrepreneurship'}
              </span>
              <h3 className="text-base font-extrabold group-hover:text-rose-300 transition">
                {language === 'hi' ? 'महिला उद्यमी व मधुबनी कला' : 'Mahila Udyami & Mithila Art'}
              </h3>
              <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                {language === 'hi'
                  ? 'मुख्यमंत्री महिला उद्यमी योजना में ₹10 लाख (₹5 लाख अनुदान + ₹5 लाख ब्याज-मुक्त ऋण)।'
                  : '₹10 Lakhs enterprise support (₹5L subsidy + ₹5L interest-free loan).'}
              </p>
              <div className="pt-2 text-[11px] font-bold text-rose-300 flex items-center gap-1">
                <span>{language === 'hi' ? 'महिला योजनाएं देखें →' : 'Explore Schemes →'}</span>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* 4. Category Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {language === 'hi' ? 'श्रेणी अनुसार योजनाएं' : 'Browse by Category'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'hi' ? 'अपनी आवश्यकता के अनुसार संबंधित श्रेणी चुनें' : 'Explore schemes categorized for students, farmers, and entrepreneurs'}
            </p>
          </div>
          <Link to="/schemes" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
            <span>{language === 'hi' ? 'सभी देखें' : 'View All'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/schemes?category=${cat.slug}`}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-200 group flex items-start gap-4"
            >
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                {getCategoryIcon(cat.slug)}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition">
                  {language === 'hi' && cat.name_hi ? cat.name_hi : cat.name_en}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {language === 'hi' ? 'बिहार सहायक कैसे काम करता है?' : 'How Bihar Sahayak Works'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              {language === 'hi' ? 'केवल 4 सरल चरणों में अपनी योजना खोजें और आवेदन करें' : 'A 4-step streamlined journey from discovery to application'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 font-extrabold flex items-center justify-center text-base mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {language === 'hi' ? 'प्रोफ़ाइल दर्ज करें' : 'Enter Profile'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi' ? 'अपनी आयु, जिला, शिक्षा एवं आय की सामान्य जानकारी भरें।' : 'Fill minimal basic details like age, district, income, and education.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-base mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {language === 'hi' ? 'पात्रता विश्लेषण' : 'Eligibility Check'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi' ? 'नियम इंजन तुरंत बताता है कि आप किस योजना के पात्र हैं और क्यों।' : 'Deterministic engine evaluates exact criteria and explains why you qualify.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-base mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {language === 'hi' ? 'दस्तावेज़ चेकलिस्ट' : 'Document Checklist'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi' ? 'आवश्यक सभी प्रमाण पत्रों और कागजातों की स्पष्ट सूची देखें।' : 'Get an exact checklist of required certificates before applying.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-base mb-4">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {language === 'hi' ? 'सरकारी पोर्टल पर जाएं' : 'Official Portal'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi' ? 'सीधे आधिकारिक पोर्टल (ServicePlus, DBT) पर सुरक्षित रूप से जाएं।' : 'Direct 1-click safe redirection to official Bihar Govt portals.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Featured Verified Schemes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {language === 'hi' ? 'प्रमुख लोकप्रिय योजनाएं' : 'Popular Schemes in Bihar'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'hi' ? 'सर्वाधिक खोजी जाने वाली सरकारी योजनाएं' : 'Most frequently accessed schemes by students, youth, and farmers'}
            </p>
          </div>
          <Link to="/schemes" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
            <span>{language === 'hi' ? 'सभी 25 योजनाएं देखें' : 'View All 25 Schemes'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      </section>

      {/* 7. CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              {language === 'hi'
                ? 'जानना चाहते हैं कि आप किस योजना के पात्र हैं?'
                : 'Want to know which schemes you qualify for?'}
            </h2>
            <p className="text-xs sm:text-sm text-orange-100 leading-relaxed">
              {language === 'hi'
                ? 'केवल 1 मिनट में अपनी बुनियादी जानकारी दर्ज करें और तुरंत अपनी व्यक्तिगत योजना रिपोर्ट देखें।'
                : 'Enter your basic profile in 1 minute to receive an instant personalized eligibility match.'}
            </p>
          </div>

          <Link
            to="/eligibility"
            className="px-8 py-4 bg-white text-orange-700 hover:bg-orange-50 font-extrabold text-sm rounded-2xl shadow-lg transition hover:scale-105 shrink-0"
          >
            {language === 'hi' ? 'तुरंत पात्रता जांचें' : 'Check Eligibility Now'}
          </Link>
        </div>
      </section>

    </div>
  );
}
