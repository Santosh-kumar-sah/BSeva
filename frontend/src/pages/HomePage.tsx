import React, { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
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
  FileCheck
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
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        
        {/* Subtle ambient glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-5 text-left">
            
            {/* Simple product badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Bihar Sahayak • बिहार सहायक</span>
            </div>

            <h1 className="text-3xl sm:text-[2.75rem] font-extrabold tracking-tight leading-[1.2]">
              {language === 'hi' ? (
                <>
                  बिहार की सरकारी योजनाएं,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                    एक ही जगह
                  </span>
                </>
              ) : (
                <>
                  Every Bihar Govt Scheme,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                    One Platform
                  </span>
                </>
              )}
            </h1>

            <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
              {language === 'hi'
                ? 'छात्रवृत्ति, कृषि अनुदान, रोजगार — अपनी पात्रता जांचें, ज़रूरी दस्तावेज़ देखें, और सीधे सरकारी पोर्टल पर आवेदन करें।'
                : 'Scholarships, farm subsidies, jobs — check your eligibility, see required documents, and apply on official portals.'}
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="relative flex items-center max-w-lg pt-1">
              <input
                type="text"
                placeholder={language === 'hi' ? 'योजना खोजें... जैसे Student Credit Card, कन्या उत्थान' : 'Search schemes... e.g. Student Credit Card, Kanya Utthan'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-24 py-3 rounded-xl bg-white/8 backdrop-blur border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:bg-white/12 transition"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg transition"
              >
                {language === 'hi' ? 'खोजें' : 'Search'}
              </button>
            </form>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/eligibility"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-900/30 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'hi' ? 'पात्रता जांचें' : 'Check Eligibility'}</span>
              </Link>

              <Link
                to="/documents"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/8 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 transition"
              >
                <FileCheck className="w-4 h-4 text-slate-400" />
                <span>{language === 'hi' ? 'दस्तावेज़ जांचें' : 'Document Checklist'}</span>
              </Link>

              <Link
                to="/careers"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/8 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 transition"
              >
                <Compass className="w-4 h-4 text-slate-400" />
                <span>{language === 'hi' ? 'करियर गाइड' : 'Career Guide'}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Heritage Images */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            
            {/* Image 1: Buddha Rajgir */}
            <div className="group relative rounded-2xl overflow-hidden shadow-2xl aspect-[3/4]">
              <img
                src="/images/bihar_rajgir_buddha.jpg"
                alt="Buddha statue, Rajgir"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-[11px] font-semibold text-white/90">Rajgir, Bihar</p>
              </div>
            </div>

            {/* Image 2: Nalanda Ruins */}
            <div className="group relative rounded-2xl overflow-hidden shadow-2xl aspect-[3/4] mt-6">
              <img
                src="/images/bihar_nalanda_vikramshila.jpg"
                alt="Nalanda Mahavihara ruins"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-[11px] font-semibold text-white/90">Nalanda, Bihar</p>
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

      {/* 3. Explore by Sector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {language === 'hi' ? 'क्षेत्र अनुसार योजनाएं देखें' : 'Explore by Sector'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {language === 'hi' ? 'शिक्षा, कृषि, कौशल या उद्यमिता — अपने क्षेत्र की योजनाएं खोजें' : 'Education, agriculture, skills, or enterprise — find schemes in your area'}
          </p>
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
              {language === 'hi' ? 'योजना खोजने से लेकर आवेदन तक — बस 4 आसान स्टेप' : 'From finding a scheme to applying — just 4 simple steps'}
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
                {language === 'hi' ? 'आपकी जानकारी के आधार पर तुरंत पता चलता है कि कौनसी योजना मिलेगी।' : 'We check official rules and show exactly which schemes match your profile.'}
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
