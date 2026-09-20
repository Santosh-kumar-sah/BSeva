import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
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
  Sparkles,
  Users
} from 'lucide-react';
import { schemeService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SchemeCard from '../components/common/SchemeCard';
import { Scheme, SchemeCategory } from '../types';
import SearchAutocomplete from '../components/common/SearchAutocomplete';

export default function HomePage() {
  const { language } = useAuth();
  const [featuredSchemes, setFeaturedSchemes] = useState<Scheme[]>([]);
  const [categories, setCategories] = useState<SchemeCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'education': return <GraduationCap className="w-5 h-5 text-blue-600" />;
      case 'agriculture': return <Tractor className="w-5 h-5 text-emerald-600" />;
      case 'employment-skills': return <Briefcase className="w-5 h-5 text-orange-600" />;
      case 'women-empowerment': return <Heart className="w-5 h-5 text-rose-600" />;
      case 'social-welfare': return <ShieldCheck className="w-5 h-5 text-purple-600" />;
      default: return <Building2 className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      
      {/* 1. Hero Section (Unified Bihar GovTech Identity) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-12 sm:pt-16 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        
        {/* Subtle Ambient Madhubani Warm Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            
            {/* Government Platform Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/8 border border-white/12 text-xs font-semibold text-orange-200/90 shadow-2xs backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{language === 'hi' ? 'बिहार सरकार की कल्याणकारी योजनाएं' : 'Bihar GovTech Scheme & Skill Intelligence'}</span>
            </div>

            {/* Headline Scale */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white font-sans">
              {language === 'hi' ? (
                <>
                  बिहार की सरकारी योजनाएं,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-amber-200">
                    एक ही मंच पर
                  </span>
                </>
              ) : (
                <>
                  Every Bihar Govt Scheme,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-amber-200">
                    One Unified Platform
                  </span>
                </>
              )}
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              {language === 'hi'
                ? 'छात्रवृत्ति, कृषि अनुदान, कौशल प्रशिक्षण व स्वरोजगार — 14-कारकों के आधार पर अपनी पात्रता जांचें, आवश्यक दस्तावेज देखें और सीधे आधिकारिक सरकारी पोर्टल पर आवेदन करें।'
                : 'Scholarships, farm subsidies, BSDM skills & enterprise loans — evaluate your eligibility across 14 precise factors and connect directly to official government portals.'}
            </p>

            {/* Search Box with Autocomplete */}
            <div className="max-w-xl pt-1">
              <SearchAutocomplete variant="hero" />
            </div>

            {/* 3 Call to Action Buttons (Clear Visual Hierarchy) */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Primary Action */}
              <Link
                to="/eligibility"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-950/40 transition-all duration-150 hover:scale-[1.02] cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>{language === 'hi' ? 'पात्रता जांचें' : 'Check Eligibility'}</span>
              </Link>

              {/* Secondary Action */}
              <Link
                to="/documents"
                className="inline-flex items-center gap-2 px-4.5 py-3 rounded-xl bg-white/10 hover:bg-white/18 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all duration-150 backdrop-blur-xs cursor-pointer"
              >
                <FileCheck className="w-4 h-4 text-amber-300" />
                <span>{language === 'hi' ? 'दस्तावेज़ चेकलिस्ट' : 'Document Checklist'}</span>
              </Link>

              {/* Tertiary Action */}
              <Link
                to="/careers"
                className="inline-flex items-center gap-2 px-4.5 py-3 rounded-xl bg-white/10 hover:bg-white/18 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all duration-150 backdrop-blur-xs cursor-pointer"
              >
                <Compass className="w-4 h-4 text-blue-300" />
                <span>{language === 'hi' ? 'करियर गाइडेंस' : 'Career Guide'}</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Column: Bihar Heritage Showcase */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5 sm:gap-4">
            
            {/* Image 1: Rajgir Buddha */}
            <div className="group relative rounded-2xl overflow-hidden shadow-xl aspect-[3/4] border border-white/10 bg-slate-900">
              <img
                src="/images/bihar_rajgir_buddha.jpg"
                alt="Shanti Stupa and Buddha heritage, Rajgir"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3.5">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-orange-600/90 text-white inline-block mb-1">
                  Rajgir
                </span>
                <p className="text-xs font-bold text-white leading-tight">विश्व शांति स्तूप व धरोहर</p>
              </div>
            </div>

            {/* Image 2: Nalanda Mahavihara */}
            <div className="group relative rounded-2xl overflow-hidden shadow-xl aspect-[3/4] mt-5 sm:mt-6 border border-white/10 bg-slate-900">
              <img
                src="/images/bihar_nalanda_vikramshila.jpg"
                alt="Nalanda Mahavihara ruins and ancient learning center"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3.5">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-600/90 text-white inline-block mb-1">
                  Nalanda
                </span>
                <p className="text-xs font-bold text-white leading-tight">नालंदा महाविहार ज्ञानपीठ</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. Key Metrics Strip (Stats Bar) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-20">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-6 sm:p-7 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          
          {/* Metric 1 */}
          <div className="pt-2 sm:pt-0 space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans">
              25+
            </div>
            <div className="text-xs font-bold text-slate-500">
              {language === 'hi' ? 'सत्यापित सरकारी योजनाएं' : 'Verified Schemes'}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              {language === 'hi' ? 'शिक्षा, कृषि, पेंशन व स्वरोजगार' : 'Education, Agriculture & DBT'}
            </p>
          </div>

          {/* Metric 2 */}
          <div className="pt-4 sm:pt-0 space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-orange-600 tracking-tight font-sans">
              5
            </div>
            <div className="text-xs font-bold text-slate-500">
              {language === 'hi' ? 'प्रमुख सरकारी विभाग' : 'Key Departments'}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              {language === 'hi' ? 'शिक्षा, कृषि, समाज कल्याण, श्रम' : 'Education, Agriculture, Social'}
            </p>
          </div>

          {/* Metric 3 */}
          <div className="pt-4 sm:pt-0 space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight font-sans">
              8+
            </div>
            <div className="text-xs font-bold text-slate-500">
              {language === 'hi' ? 'करियर व कौशल पाथवे' : 'Career Pathways'}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              {language === 'hi' ? 'BSDM कुशल युवा व तकनीकी मार्ग' : 'BSDM Certified Youth Courses'}
            </p>
          </div>

          {/* Metric 4 */}
          <div className="pt-4 sm:pt-0 space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight font-sans">
              100%
            </div>
            <div className="text-xs font-bold text-slate-500">
              {language === 'hi' ? 'सटीक आधिकारिक स्रोत' : 'Verified Official Links'}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              {language === 'hi' ? 'ServicePlus, DBT, MedhaSoft' : 'Direct Govt Application Portals'}
            </p>
          </div>

        </div>
      </section>

      {/* 3. Explore by Sector (Heritage Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {language === 'hi' ? 'क्षेत्र अनुसार योजनाएं देखें' : 'Explore by Sector'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {language === 'hi' ? 'शिक्षा, कृषि, कौशल या महिला सशक्तिकरण — अपने क्षेत्र की योजनाएं खोजें' : 'Education, agriculture, skills, or enterprise — explore targeted Bihar schemes'}
            </p>
          </div>
          <Link to="/schemes" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 shrink-0">
            <span>{language === 'hi' ? 'सभी योजनाएं देखें' : 'View All Schemes'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          
          {/* Card 1: Education */}
          <Link
            to="/schemes?category=education"
            className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col justify-end min-h-[290px]"
          >
            <img
              src="/images/bihar_education_nalanda.jpg"
              alt="Bihar Higher Education & Nalanda Heritage"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
            <div className="relative p-5 space-y-1.5 text-white">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/90 backdrop-blur-xs">
                {language === 'hi' ? 'उच्च शिक्षा एवं छात्रवृत्ति' : 'Higher Education & Loans'}
              </span>
              <h3 className="text-base font-bold group-hover:text-blue-200 transition-colors">
                {language === 'hi' ? 'नालंदा से नए बिहार तक ज्ञान' : 'Nalanda Legacy to Modern Tech'}
              </h3>
              <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                {language === 'hi'
                  ? 'स्टूडेंट क्रेडिट कार्ड (₹4 लाख), पोस्ट-मैट्रिक छात्रवृत्ति और कन्या उत्थान योजना।'
                  : 'Student Credit Card (₹4 Lakhs), PMS scholarships, and higher learning.'}
              </p>
              <div className="pt-1.5 text-[11px] font-bold text-blue-300 flex items-center gap-1">
                <span>{language === 'hi' ? 'योजनाएं देखें →' : 'Explore Schemes →'}</span>
              </div>
            </div>
          </Link>

          {/* Card 2: Agriculture */}
          <Link
            to="/schemes?category=agriculture"
            className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col justify-end min-h-[290px]"
          >
            <img
              src="/images/bihar_makhana_agriculture.jpg"
              alt="Bihar Agriculture and Makhana Farming"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
            <div className="relative p-5 space-y-1.5 text-white">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/90 backdrop-blur-xs">
                {language === 'hi' ? 'कृषि एवं किसान कल्याण' : 'Agriculture & Farming'}
              </span>
              <h3 className="text-base font-bold group-hover:text-emerald-200 transition-colors">
                {language === 'hi' ? 'मखाना व समृद्ध हरित बिहार' : 'Makhana & Gangetic Farmlands'}
              </h3>
              <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                {language === 'hi'
                  ? 'कृषि यंत्रीकरण अनुदान (80%), फसल सहायता, डीजल अनुदान व PM-किसान।'
                  : '80% Farm machinery subsidies, crop insurance, and DBT support.'}
              </p>
              <div className="pt-1.5 text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                <span>{language === 'hi' ? 'कृषि योजनाएं देखें →' : 'Explore Agriculture →'}</span>
              </div>
            </div>
          </Link>

          {/* Card 3: Skills & Careers */}
          <Link
            to="/careers"
            className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col justify-end min-h-[290px]"
          >
            <img
              src="/images/bihar_bsdm_tech_youth.jpg"
              alt="BSDM Youth and Tech Skill Training"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
            <div className="relative p-5 space-y-1.5 text-white">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/90 backdrop-blur-xs">
                {language === 'hi' ? 'युवा कौशल एवं IT' : 'Youth Skills & IT Careers'}
              </span>
              <h3 className="text-base font-bold group-hover:text-orange-200 transition-colors">
                {language === 'hi' ? 'कुशल युवा कार्यक्रम (KYP)' : 'BSDM Certified Tech Pathways'}
              </h3>
              <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                {language === 'hi'
                  ? 'सॉफ्टवेयर डेवलपमेंट, सोलर PV तकनीशियन और 240 घंटे का निःशुल्क कौशल प्रशिक्षण।'
                  : 'Software engineering, solar energy tech, and free certified skill courses.'}
              </p>
              <div className="pt-1.5 text-[11px] font-bold text-orange-300 flex items-center gap-1">
                <span>{language === 'hi' ? 'करियर गाइडेंस देखें →' : 'Explore Careers →'}</span>
              </div>
            </div>
          </Link>

          {/* Card 4: Women Empowerment */}
          <Link
            to="/schemes?category=women-empowerment"
            className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col justify-end min-h-[290px]"
          >
            <img
              src="/images/bihar_women_entrepreneur.jpg"
              alt="Bihar Women Entrepreneurs and Handloom"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
            <div className="relative p-5 space-y-1.5 text-white">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/90 backdrop-blur-xs">
                {language === 'hi' ? 'महिला उद्यमिता व स्वावलंबन' : 'Women Entrepreneurship'}
              </span>
              <h3 className="text-base font-bold group-hover:text-rose-200 transition-colors">
                {language === 'hi' ? 'महिला उद्यमी व मधुबनी कला' : 'Mahila Udyami & Mithila Art'}
              </h3>
              <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                {language === 'hi'
                  ? 'मुख्यमंत्री महिला उद्यमी योजना में ₹10 लाख (₹5 लाख अनुदान + ₹5 लाख ब्याज-मुक्त ऋण)।'
                  : '₹10 Lakhs enterprise support (₹5L subsidy + ₹5L interest-free loan).'}
              </p>
              <div className="pt-1.5 text-[11px] font-bold text-rose-300 flex items-center gap-1">
                <span>{language === 'hi' ? 'महिला योजनाएं देखें →' : 'Explore Schemes →'}</span>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* 4. Category Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/schemes?category=${cat.slug}`}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-orange-300 transition-all duration-150 group flex items-start gap-3.5"
            >
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-orange-50 group-hover:scale-105 transition-all">
                {getCategoryIcon(cat.slug)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-700 transition-colors">
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

      {/* 5. How It Works (4 Clear Steps) */}
      <section className="bg-slate-100/60 border-y border-slate-200 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {language === 'hi' ? 'बिहार सहायक कैसे काम करता है?' : 'How Bihar Sahayak Works'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
              {language === 'hi' ? 'योजना खोजने से लेकर आवेदन तक — बस 4 आसान स्टेप' : 'From discovering a scheme to applying — 4 simple steps'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 font-extrabold flex items-center justify-center text-sm mb-3.5">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {language === 'hi' ? 'प्रोफ़ाइल दर्ज करें' : 'Enter Profile'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi' ? 'अपनी आयु, जिला, शिक्षा एवं आय की सामान्य जानकारी भरें।' : 'Fill minimal basic details like age, district, income, and education.'}
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-sm mb-3.5">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {language === 'hi' ? 'पात्रता विश्लेषण' : 'Eligibility Check'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi' ? '14-कारकों के आधार पर तुरंत पता चलता है कि कौनसी योजना मिलेगी।' : 'Our engine computes exact scheme eligibility based on official rules.'}
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-sm mb-3.5">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {language === 'hi' ? 'दस्तावेज़ चेकलिस्ट' : 'Document Checklist'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi' ? 'आवेदन से पूर्व आवश्यक प्रमाण पत्रों और कागजातों की सूची देखें।' : 'Get an exact checklist of required certificates before applying.'}
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-sm mb-3.5">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {language === 'hi' ? 'सरकारी पोर्टल पर जाएं' : 'Official Portal'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi' ? 'सीधे आधिकारिक पोर्टल (ServicePlus, DBT) पर सुरक्षित रूप से जाएं।' : 'Direct safe redirection to official Bihar Government portals.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Featured Verified Schemes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {language === 'hi' ? 'प्रमुख लोकप्रिय योजनाएं' : 'Popular Bihar Schemes'}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      </section>

      {/* 7. CTA Banner (Warm Terracotta Accent) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 rounded-2xl p-7 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h2 className="text-xl sm:text-2xl font-black leading-tight">
              {language === 'hi'
                ? 'जानना चाहते हैं कि आप किस योजना के पात्र हैं?'
                : 'Want to discover which schemes you qualify for?'}
            </h2>
            <p className="text-xs sm:text-sm text-orange-100/90 leading-relaxed">
              {language === 'hi'
                ? 'केवल 1 मिनट में अपनी बुनियादी जानकारी दर्ज करें और तुरंत अपनी व्यक्तिगत योजना रिपोर्ट देखें।'
                : 'Enter your basic profile in 1 minute to receive an instant personalized eligibility match.'}
            </p>
          </div>

          <Link
            to="/eligibility"
            className="px-6 py-3 bg-white text-orange-800 hover:bg-orange-50 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-transform hover:scale-105 shrink-0 cursor-pointer"
          >
            {language === 'hi' ? 'तुरंत पात्रता जांचें' : 'Check Eligibility Now'}
          </Link>
        </div>
      </section>

    </div>
  );
}
