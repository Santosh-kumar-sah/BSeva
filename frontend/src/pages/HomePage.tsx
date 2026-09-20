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
  FileCheck
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
      case 'education': return <GraduationCap className="w-6 h-6 text-brand" strokeWidth={1.75} />;
      case 'agriculture': return <Tractor className="w-6 h-6 text-brand" strokeWidth={1.75} />;
      case 'employment-skills': return <Briefcase className="w-6 h-6 text-brand" strokeWidth={1.75} />;
      case 'women-empowerment': return <Heart className="w-6 h-6 text-brand" strokeWidth={1.75} />;
      case 'social-welfare': return <ShieldCheck className="w-6 h-6 text-brand" strokeWidth={1.75} />;
      default: return <Building2 className="w-6 h-6 text-brand" strokeWidth={1.75} />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Section (Warm Portal Banner with High-Contrast Typography & CTAs) */}
      <section className="bg-hero-bg text-text-primary pt-10 sm:pt-14 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Eyebrow, Headline, Subtext, Search, 3 Solid Action Buttons */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Soft Tinted Eyebrow Badge (5-10% Brand Opacity) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand/10 border border-brand/25 text-xs font-semibold text-brand shadow-xs">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
              <span>{language === 'hi' ? 'बिहार सरकार की आधिकारिक योजना सेवा' : 'Official Bihar Govt Schemes & Skill Portal'}</span>
            </div>

            {/* Headline with Strong Contrast & Maroon Accent */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary leading-[1.18]">
              {language === 'hi' ? (
                <>
                  बिहार की सरकारी योजनाएं,{' '}
                  <span className="text-brand underline decoration-brand/30 decoration-wavy decoration-2">एक ही मंच पर</span>
                </>
              ) : (
                <>
                  Every Bihar Govt Scheme,{' '}
                  <span className="text-brand underline decoration-brand/30 decoration-wavy decoration-2">One Unified Portal</span>
                </>
              )}
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl font-normal">
              {language === 'hi'
                ? 'छात्रवृत्ति, कृषि अनुदान, कौशल प्रशिक्षण व स्वरोजगार — 14-कारकों के आधार पर तुरंत अपनी पात्रता जांचें और सीधे आधिकारिक सरकारी पोर्टल पर आवेदन करें।'
                : 'Scholarships, farm subsidies, enterprise loans & BSDM skills — check your eligibility across 14 precise factors and connect directly to official government portals.'}
            </p>

            {/* Search Box */}
            <div className="max-w-xl">
              <SearchAutocomplete variant="hero" />
            </div>

            {/* 3 Call to Action Buttons (1 Filled Solid Maroon, 2 Colored Outline) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Primary CTA (Solid Filled Maroon #7A2A2A with White Text) */}
              <Link
                to="/eligibility"
                className="bg-brand hover:bg-brand-dark text-white font-bold px-6 py-3 rounded-lg transition-all inline-flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg active:scale-98"
              >
                <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2} />
                <span>{language === 'hi' ? 'पात्रता जांचें' : 'Check Eligibility'}</span>
              </Link>

              {/* Secondary CTA 1 (Outlined in Brand Color) */}
              <Link
                to="/documents"
                className="border-2 border-brand text-brand hover:bg-brand/10 font-bold px-5 py-2.5 rounded-lg transition-colors inline-flex items-center justify-center gap-2 text-sm bg-white shadow-xs"
              >
                <FileCheck className="w-4 h-4 text-brand" strokeWidth={2} />
                <span>{language === 'hi' ? 'दस्तावेज़ चेकलिस्ट' : 'Document Checklist'}</span>
              </Link>

              {/* Secondary CTA 2 (Outlined in Brand Color) */}
              <Link
                to="/careers"
                className="border-2 border-brand text-brand hover:bg-brand/10 font-bold px-5 py-2.5 rounded-lg transition-colors inline-flex items-center justify-center gap-2 text-sm bg-white shadow-xs"
              >
                <Compass className="w-4 h-4 text-brand" strokeWidth={2} />
                <span>{language === 'hi' ? 'कौशल एवं करियर' : 'Career Guide'}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Heritage Image Pair with clean border */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            
            {/* Image 1: Rajgir */}
            <div className="rounded-xl overflow-hidden shadow-card border border-border bg-white aspect-[3/4] relative">
              <img
                src="/images/bihar_rajgir_buddha.jpg"
                alt="Shanti Stupa, Rajgir"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-text-primary/85 via-text-primary/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white text-brand inline-block mb-1 border border-brand/20 shadow-xs">
                  Rajgir
                </span>
                <p className="text-xs font-bold text-white">विश्व शांति स्तूप व धरोहर</p>
              </div>
            </div>

            {/* Image 2: Nalanda */}
            <div className="rounded-xl overflow-hidden shadow-card border border-border bg-white aspect-[3/4] mt-6 relative">
              <img
                src="/images/bihar_nalanda_vikramshila.jpg"
                alt="Nalanda Mahavihara ruins"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-text-primary/85 via-text-primary/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white text-brand inline-block mb-1 border border-brand/20 shadow-xs">
                  Nalanda
                </span>
                <p className="text-xs font-bold text-white">नालंदा महाविहार ज्ञानपीठ</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. Stats Bar (Elevated White Card with Bold Maroon Numbers) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-xl border border-border shadow-card p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-border">
          
          <div className="pt-2 sm:pt-0 space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-brand tracking-tight">
              25+
            </div>
            <div className="text-sm font-bold text-text-primary">
              {language === 'hi' ? 'सत्यापित सरकारी योजनाएं' : 'Verified Schemes'}
            </div>
            <p className="text-xs text-text-secondary">
              {language === 'hi' ? 'शिक्षा, कृषि, पेंशन व स्वरोजगार' : 'Education, Agriculture & DBT'}
            </p>
          </div>

          <div className="pt-4 sm:pt-0 space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-brand tracking-tight">
              5
            </div>
            <div className="text-sm font-bold text-text-primary">
              {language === 'hi' ? 'प्रमुख सरकारी विभाग' : 'Key Departments'}
            </div>
            <p className="text-xs text-text-secondary">
              {language === 'hi' ? 'शिक्षा, कृषि, समाज कल्याण, श्रम' : 'Education, Agriculture, Social'}
            </p>
          </div>

          <div className="pt-4 sm:pt-0 space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-brand tracking-tight">
              8+
            </div>
            <div className="text-sm font-bold text-text-primary">
              {language === 'hi' ? 'करियर व कौशल पाथवे' : 'Career Pathways'}
            </div>
            <p className="text-xs text-text-secondary">
              {language === 'hi' ? 'BSDM कुशल युवा व तकनीकी मार्ग' : 'BSDM Certified Youth Courses'}
            </p>
          </div>

          <div className="pt-4 sm:pt-0 space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-success tracking-tight">
              100%
            </div>
            <div className="text-sm font-bold text-text-primary">
              {language === 'hi' ? 'सटीक आधिकारिक स्रोत' : 'Verified Portals'}
            </div>
            <p className="text-xs text-text-secondary">
              {language === 'hi' ? 'ServicePlus, DBT, MedhaSoft' : 'Direct Govt Application Portals'}
            </p>
          </div>

        </div>
      </section>

      {/* 3. Explore by Sector (Cards with depth, icons, and clear CTAs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold font-heading text-text-primary tracking-tight">
              {language === 'hi' ? 'क्षेत्र अनुसार योजनाएं देखें' : 'Explore by Sector'}
            </h2>
            <p className="text-sm text-text-secondary mt-0.5">
              {language === 'hi' ? 'शिक्षा, कृषि, कौशल या महिला सशक्तिकरण — अपने क्षेत्र की योजनाएं खोजें' : 'Education, agriculture, skills, or enterprise — explore targeted Bihar schemes'}
            </p>
          </div>
          <Link to="/schemes" className="text-sm font-bold text-brand hover:text-brand-dark flex items-center gap-1 shrink-0">
            <span>{language === 'hi' ? 'सभी योजनाएं देखें' : 'View All Schemes'}</span>
            <ChevronRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Education */}
          <Link
            to="/schemes?category=education"
            className="group rounded-xl shadow-card hover:shadow-cardHover transition-all border border-border bg-white flex flex-col justify-between p-6 space-y-4 hover:border-brand/40"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
                <GraduationCap className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h3 className="text-base font-bold text-text-primary group-hover:text-brand transition-colors">
                {language === 'hi' ? 'उच्च शिक्षा एवं छात्रवृत्ति' : 'Higher Education & Loans'}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {language === 'hi'
                  ? 'स्टूडेंट क्रेडिट कार्ड (₹4 लाख), पोस्ट-मैट्रिक छात्रवृत्ति और कन्या उत्थान योजना।'
                  : 'Student Credit Card (₹4 Lakhs), PMS scholarships, and higher learning support.'}
              </p>
            </div>
            <div className="text-xs font-bold text-brand flex items-center gap-1 pt-2 border-t border-border">
              <span>{language === 'hi' ? 'योजनाएं देखें' : 'Explore Schemes'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
            </div>
          </Link>

          {/* Card 2: Agriculture */}
          <Link
            to="/schemes?category=agriculture"
            className="group rounded-xl shadow-card hover:shadow-cardHover transition-all border border-border bg-white flex flex-col justify-between p-6 space-y-4 hover:border-brand/40"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
                <Tractor className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h3 className="text-base font-bold text-text-primary group-hover:text-brand transition-colors">
                {language === 'hi' ? 'कृषि एवं किसान कल्याण' : 'Agriculture & Farming'}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {language === 'hi'
                  ? 'कृषि यंत्रीकरण अनुदान (80%), फसल सहायता, डीजल अनुदान व PM-किसान।'
                  : '80% Farm machinery subsidies, crop insurance, and DBT support for farmers.'}
              </p>
            </div>
            <div className="text-xs font-bold text-brand flex items-center gap-1 pt-2 border-t border-border">
              <span>{language === 'hi' ? 'कृषि योजनाएं देखें' : 'Explore Agriculture'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
            </div>
          </Link>

          {/* Card 3: Skills & Careers */}
          <Link
            to="/careers"
            className="group rounded-xl shadow-card hover:shadow-cardHover transition-all border border-border bg-white flex flex-col justify-between p-6 space-y-4 hover:border-brand/40"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
                <Briefcase className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h3 className="text-base font-bold text-text-primary group-hover:text-brand transition-colors">
                {language === 'hi' ? 'युवा कौशल एवं IT' : 'Youth Skills & IT Careers'}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {language === 'hi'
                  ? 'कुशल युवा कार्यक्रम (KYP), सोलर PV तकनीशियन और निःशुल्क कौशल प्रशिक्षण।'
                  : 'Certified skill courses, solar energy tech, and free vocational training.'}
              </p>
            </div>
            <div className="text-xs font-bold text-brand flex items-center gap-1 pt-2 border-t border-border">
              <span>{language === 'hi' ? 'करियर गाइडेंस देखें' : 'Explore Careers'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
            </div>
          </Link>

          {/* Card 4: Women Empowerment */}
          <Link
            to="/schemes?category=women-empowerment"
            className="group rounded-xl shadow-card hover:shadow-cardHover transition-all border border-border bg-white flex flex-col justify-between p-6 space-y-4 hover:border-brand/40"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
                <Heart className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h3 className="text-base font-bold text-text-primary group-hover:text-brand transition-colors">
                {language === 'hi' ? 'महिला उद्यमिता व स्वावलंबन' : 'Women Entrepreneurship'}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {language === 'hi'
                  ? 'मुख्यमंत्री महिला उद्यमी योजना में ₹10 लाख (₹5 लाख अनुदान + ₹5 लाख ब्याज-मुक्त ऋण)।'
                  : 'Enterprise loans, self-help groups, and women startup subsidies.'}
              </p>
            </div>
            <div className="text-xs font-bold text-brand flex items-center gap-1 pt-2 border-t border-border">
              <span>{language === 'hi' ? 'महिला योजनाएं देखें' : 'Explore Schemes'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
            </div>
          </Link>

        </div>
      </section>

      {/* 4. Category Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold font-heading text-text-primary tracking-tight">
              {language === 'hi' ? 'श्रेणी अनुसार योजनाएं' : 'Browse by Category'}
            </h2>
            <p className="text-sm text-text-secondary mt-0.5">
              {language === 'hi' ? 'अपनी आवश्यकता के अनुसार संबंधित श्रेणी चुनें' : 'Explore schemes categorized for students, farmers, and entrepreneurs'}
            </p>
          </div>
          <Link to="/schemes" className="text-sm font-bold text-brand hover:text-brand-dark flex items-center gap-1">
            <span>{language === 'hi' ? 'सभी देखें' : 'View All'}</span>
            <ChevronRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/schemes?category=${cat.slug}`}
              className="bg-white p-5 rounded-xl border border-border shadow-card hover:shadow-cardHover hover:border-brand/40 transition-all group flex items-start gap-4"
            >
              <div className="p-3 rounded-lg bg-brand/10 border border-brand/20 group-hover:bg-brand group-hover:text-white transition-colors shrink-0">
                {getCategoryIcon(cat.slug)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-text-primary group-hover:text-brand transition-colors">
                  {language === 'hi' && cat.name_hi ? cat.name_hi : cat.name_en}
                </h3>
                <p className="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. How It Works (4 Steps) */}
      <section className="bg-hero-bg border-y border-border py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight">
              {language === 'hi' ? 'बिहार सहायक कैसे काम करता है?' : 'How Bihar Sahayak Works'}
            </h2>
            <p className="text-sm text-text-secondary mt-1.5 font-medium">
              {language === 'hi' ? 'योजना खोजने से लेकर आवेदन तक — बस 4 आसान स्टेप' : 'From discovering a scheme to applying — 4 simple steps'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-border shadow-card space-y-3">
              <div className="w-9 h-9 rounded-lg bg-brand text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                1
              </div>
              <h3 className="text-base font-bold text-text-primary">
                {language === 'hi' ? 'प्रोफ़ाइल दर्ज करें' : 'Enter Profile'}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {language === 'hi' ? 'अपनी आयु, जिला, शिक्षा एवं आय की सामान्य जानकारी भरें।' : 'Fill basic details like age, district, income, and education.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border shadow-card space-y-3">
              <div className="w-9 h-9 rounded-lg bg-brand text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                2
              </div>
              <h3 className="text-base font-bold text-text-primary">
                {language === 'hi' ? 'पात्रता विश्लेषण' : 'Eligibility Check'}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {language === 'hi' ? '14-कारकों के आधार पर तुरंत पता चलता है कि कौनसी योजना मिलेगी।' : 'Our engine computes exact scheme eligibility based on official rules.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border shadow-card space-y-3">
              <div className="w-9 h-9 rounded-lg bg-brand text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                3
              </div>
              <h3 className="text-base font-bold text-text-primary">
                {language === 'hi' ? 'दस्तावेज़ चेकलिस्ट' : 'Document Checklist'}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {language === 'hi' ? 'आवेदन से पूर्व आवश्यक प्रमाण पत्रों और कागजातों की सूची देखें।' : 'Get an exact checklist of required certificates before applying.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border shadow-card space-y-3">
              <div className="w-9 h-9 rounded-lg bg-brand text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                4
              </div>
              <h3 className="text-base font-bold text-text-primary">
                {language === 'hi' ? 'सरकारी पोर्टल पर जाएं' : 'Official Portal'}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {language === 'hi' ? 'सीधे आधिकारिक पोर्टल (ServicePlus, DBT) पर सुरक्षित रूप से जाएं।' : 'Direct safe redirection to official Bihar Government portals.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Featured Schemes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold font-heading text-text-primary tracking-tight">
              {language === 'hi' ? 'प्रमुख लोकप्रिय योजनाएं' : 'Popular Bihar Schemes'}
            </h2>
            <p className="text-sm text-text-secondary mt-0.5">
              {language === 'hi' ? 'सर्वाधिक खोजी जाने वाली सरकारी योजनाएं' : 'Most frequently accessed schemes by students, youth, and farmers'}
            </p>
          </div>
          <Link to="/schemes" className="text-sm font-bold text-brand hover:text-brand-dark flex items-center gap-1">
            <span>{language === 'hi' ? 'सभी 25 योजनाएं देखें' : 'View All Schemes'}</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      </section>

      {/* 7. Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-hero-bg rounded-xl border border-border p-8 sm:p-12 text-text-primary shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">
              {language === 'hi'
                ? 'जानना चाहते हैं कि आप किस योजना के पात्र हैं?'
                : 'Want to discover which schemes you qualify for?'}
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed font-medium">
              {language === 'hi'
                ? 'केवल 1 मिनट में अपनी बुनियादी जानकारी दर्ज करें और तुरंत अपनी व्यक्तिगत योजना रिपोर्ट देखें।'
                : 'Enter your basic profile in 1 minute to receive an instant personalized eligibility match.'}
            </p>
          </div>

          <Link
            to="/eligibility"
            className="bg-brand hover:bg-brand-dark text-white font-bold px-7 py-3.5 rounded-lg transition-all inline-flex items-center justify-center text-sm shadow-md hover:shadow-lg shrink-0 cursor-pointer active:scale-98"
          >
            {language === 'hi' ? 'तुरंत पात्रता जांचें' : 'Check Eligibility Now'}
          </Link>
        </div>
      </section>

    </div>
  );
}
