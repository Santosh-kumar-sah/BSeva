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
      case 'education': return <GraduationCap className="w-6 h-6 text-brand" strokeWidth={1.5} />;
      case 'agriculture': return <Tractor className="w-6 h-6 text-brand" strokeWidth={1.5} />;
      case 'employment-skills': return <Briefcase className="w-6 h-6 text-brand" strokeWidth={1.5} />;
      case 'women-empowerment': return <Heart className="w-6 h-6 text-brand" strokeWidth={1.5} />;
      case 'social-welfare': return <ShieldCheck className="w-6 h-6 text-brand" strokeWidth={1.5} />;
      default: return <Building2 className="w-6 h-6 text-brand" strokeWidth={1.5} />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Section (Light Warm Sand / Hero-BG Theme) */}
      <section className="bg-hero-bg text-text-primary pt-12 sm:pt-16 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Subtext, Search, 3 Buttons */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Government Service Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-surface border border-border text-xs font-semibold text-text-secondary shadow-card">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              <span>{language === 'hi' ? 'बिहार सरकार की कल्याणकारी योजनाएं' : 'Bihar Government Schemes & Career Intelligence'}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-[1.2]">
              {language === 'hi' ? (
                <>
                  बिहार की सरकारी योजनाएं,{' '}
                  <span className="text-brand">एक ही मंच पर</span>
                </>
              ) : (
                <>
                  Every Bihar Govt Scheme,{' '}
                  <span className="text-brand">One Unified Portal</span>
                </>
              )}
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl">
              {language === 'hi'
                ? 'छात्रवृत्ति, कृषि अनुदान, कौशल प्रशिक्षण व स्वरोजगार — 14-कारकों के आधार पर अपनी पात्रता जांचें, आवश्यक दस्तावेज देखें और सीधे आधिकारिक सरकारी पोर्टल पर आवेदन करें।'
                : 'Scholarships, farm subsidies, BSDM skills & enterprise loans — check your eligibility across 14 precise factors and connect directly to official government portals.'}
            </p>

            {/* Search Box */}
            <div className="max-w-xl">
              <SearchAutocomplete variant="hero" />
            </div>

            {/* 3 Call to Action Buttons (1 Primary, 2 Secondary) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Primary CTA */}
              <Link
                to="/eligibility"
                className="bg-brand hover:bg-brand-dark text-white font-medium px-5 py-2.5 rounded-lg transition-colors inline-flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={1.5} />
                <span>{language === 'hi' ? 'पात्रता जांचें' : 'Check Eligibility'}</span>
              </Link>

              {/* Secondary CTA 1 */}
              <Link
                to="/documents"
                className="border border-brand text-brand hover:bg-brand/5 font-medium px-5 py-2.5 rounded-lg transition-colors inline-flex items-center justify-center gap-2 text-sm bg-surface"
              >
                <FileCheck className="w-5 h-5 text-brand" strokeWidth={1.5} />
                <span>{language === 'hi' ? 'दस्तावेज़ चेकलिस्ट' : 'Document Checklist'}</span>
              </Link>

              {/* Secondary CTA 2 */}
              <Link
                to="/careers"
                className="border border-brand text-brand hover:bg-brand/5 font-medium px-5 py-2.5 rounded-lg transition-colors inline-flex items-center justify-center gap-2 text-sm bg-surface"
              >
                <Compass className="w-5 h-5 text-brand" strokeWidth={1.5} />
                <span>{language === 'hi' ? 'कौशल एवं करियर' : 'Career Guide'}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Heritage Image Pair */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            
            {/* Image 1: Rajgir */}
            <div className="rounded-xl overflow-hidden shadow-card border border-border bg-surface aspect-[3/4] relative">
              <img
                src="/images/bihar_rajgir_buddha.jpg"
                alt="Shanti Stupa, Rajgir"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-text-primary/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-surface/90 text-text-primary inline-block mb-1 border border-border">
                  Rajgir
                </span>
                <p className="text-xs font-semibold text-white">विश्व शांति स्तूप व धरोहर</p>
              </div>
            </div>

            {/* Image 2: Nalanda */}
            <div className="rounded-xl overflow-hidden shadow-card border border-border bg-surface aspect-[3/4] mt-6 relative">
              <img
                src="/images/bihar_nalanda_vikramshila.jpg"
                alt="Nalanda Mahavihara ruins"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-text-primary/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-surface/90 text-text-primary inline-block mb-1 border border-border">
                  Nalanda
                </span>
                <p className="text-xs font-semibold text-white">नालंदा महाविहार ज्ञानपीठ</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. Stats Bar (White Card Row Overlapping Hero Bottom) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-surface rounded-xl border border-border shadow-card p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-border">
          
          <div className="pt-2 sm:pt-0 space-y-1">
            <div className="text-3xl sm:text-4xl font-bold text-brand tracking-tight">
              25+
            </div>
            <div className="text-sm font-semibold text-text-primary">
              {language === 'hi' ? 'सत्यापित सरकारी योजनाएं' : 'Verified Schemes'}
            </div>
            <p className="text-xs text-text-secondary">
              {language === 'hi' ? 'शिक्षा, कृषि, पेंशन व स्वरोजगार' : 'Education, Agriculture & DBT'}
            </p>
          </div>

          <div className="pt-4 sm:pt-0 space-y-1">
            <div className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
              5
            </div>
            <div className="text-sm font-semibold text-text-primary">
              {language === 'hi' ? 'प्रमुख सरकारी विभाग' : 'Key Departments'}
            </div>
            <p className="text-xs text-text-secondary">
              {language === 'hi' ? 'शिक्षा, कृषि, समाज कल्याण, श्रम' : 'Education, Agriculture, Social'}
            </p>
          </div>

          <div className="pt-4 sm:pt-0 space-y-1">
            <div className="text-3xl sm:text-4xl font-bold text-brand tracking-tight">
              8+
            </div>
            <div className="text-sm font-semibold text-text-primary">
              {language === 'hi' ? 'करियर व कौशल पाथवे' : 'Career Pathways'}
            </div>
            <p className="text-xs text-text-secondary">
              {language === 'hi' ? 'BSDM कुशल युवा व तकनीकी मार्ग' : 'BSDM Certified Youth Courses'}
            </p>
          </div>

          <div className="pt-4 sm:pt-0 space-y-1">
            <div className="text-3xl sm:text-4xl font-bold text-success tracking-tight">
              100%
            </div>
            <div className="text-sm font-semibold text-text-primary">
              {language === 'hi' ? 'सटीक आधिकारिक स्रोत' : 'Verified Portals'}
            </div>
            <p className="text-xs text-text-secondary">
              {language === 'hi' ? 'ServicePlus, DBT, MedhaSoft' : 'Direct Govt Application Portals'}
            </p>
          </div>

        </div>
      </section>

      {/* 3. Explore by Sector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">
              {language === 'hi' ? 'क्षेत्र अनुसार योजनाएं देखें' : 'Explore by Sector'}
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              {language === 'hi' ? 'शिक्षा, कृषि, कौशल या महिला सशक्तिकरण — अपने क्षेत्र की योजनाएं खोजें' : 'Education, agriculture, skills, or enterprise — explore targeted Bihar schemes'}
            </p>
          </div>
          <Link to="/schemes" className="text-sm font-semibold text-brand hover:text-brand-dark flex items-center gap-1 shrink-0">
            <span>{language === 'hi' ? 'सभी योजनाएं देखें' : 'View All Schemes'}</span>
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Education */}
          <Link
            to="/schemes?category=education"
            className="group rounded-xl overflow-hidden shadow-card hover:shadow-cardHover transition-all border border-border bg-surface flex flex-col justify-between p-6 space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-hero-bg flex items-center justify-center text-brand">
                <GraduationCap className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-text-primary group-hover:text-brand transition-colors">
                {language === 'hi' ? 'उच्च शिक्षा एवं छात्रवृत्ति' : 'Higher Education & Loans'}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {language === 'hi'
                  ? 'स्टूडेंट क्रेडिट कार्ड (₹4 लाख), पोस्ट-मैट्रिक छात्रवृत्ति और कन्या उत्थान योजना।'
                  : 'Student Credit Card (₹4 Lakhs), PMS scholarships, and higher learning support.'}
              </p>
            </div>
            <div className="text-xs font-semibold text-brand flex items-center gap-1 pt-2 border-t border-border">
              <span>{language === 'hi' ? 'योजनाएं देखें' : 'Explore Schemes'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
            </div>
          </Link>

          {/* Card 2: Agriculture */}
          <Link
            to="/schemes?category=agriculture"
            className="group rounded-xl overflow-hidden shadow-card hover:shadow-cardHover transition-all border border-border bg-surface flex flex-col justify-between p-6 space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-hero-bg flex items-center justify-center text-brand">
                <Tractor className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-text-primary group-hover:text-brand transition-colors">
                {language === 'hi' ? 'कृषि एवं किसान कल्याण' : 'Agriculture & Farming'}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {language === 'hi'
                  ? 'कृषि यंत्रीकरण अनुदान (80%), फसल सहायता, डीजल अनुदान व PM-किसान।'
                  : '80% Farm machinery subsidies, crop insurance, and DBT support for farmers.'}
              </p>
            </div>
            <div className="text-xs font-semibold text-brand flex items-center gap-1 pt-2 border-t border-border">
              <span>{language === 'hi' ? 'कृषि योजनाएं देखें' : 'Explore Agriculture'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
            </div>
          </Link>

          {/* Card 3: Skills & Careers */}
          <Link
            to="/careers"
            className="group rounded-xl overflow-hidden shadow-card hover:shadow-cardHover transition-all border border-border bg-surface flex flex-col justify-between p-6 space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-hero-bg flex items-center justify-center text-brand">
                <Briefcase className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-text-primary group-hover:text-brand transition-colors">
                {language === 'hi' ? 'युवा कौशल एवं IT' : 'Youth Skills & IT Careers'}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {language === 'hi'
                  ? 'कुशल युवा कार्यक्रम (KYP), सोलर PV तकनीशियन और निःशुल्क कौशल प्रशिक्षण।'
                  : 'Certified skill courses, solar energy tech, and free vocational training.'}
              </p>
            </div>
            <div className="text-xs font-semibold text-brand flex items-center gap-1 pt-2 border-t border-border">
              <span>{language === 'hi' ? 'करियर गाइडेंस देखें' : 'Explore Careers'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
            </div>
          </Link>

          {/* Card 4: Women Empowerment */}
          <Link
            to="/schemes?category=women-empowerment"
            className="group rounded-xl overflow-hidden shadow-card hover:shadow-cardHover transition-all border border-border bg-surface flex flex-col justify-between p-6 space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-hero-bg flex items-center justify-center text-brand">
                <Heart className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-text-primary group-hover:text-brand transition-colors">
                {language === 'hi' ? 'महिला उद्यमिता व स्वावलंबन' : 'Women Entrepreneurship'}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {language === 'hi'
                  ? 'मुख्यमंत्री महिला उद्यमी योजना में ₹10 लाख (₹5 लाख अनुदान + ₹5 लाख ब्याज-मुक्त ऋण)।'
                  : 'Enterprise loans, self-help groups, and women startup subsidies.'}
              </p>
            </div>
            <div className="text-xs font-semibold text-brand flex items-center gap-1 pt-2 border-t border-border">
              <span>{language === 'hi' ? 'महिला योजनाएं देखें' : 'Explore Schemes'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
            </div>
          </Link>

        </div>
      </section>

      {/* 4. Category Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">
              {language === 'hi' ? 'श्रेणी अनुसार योजनाएं' : 'Browse by Category'}
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              {language === 'hi' ? 'अपनी आवश्यकता के अनुसार संबंधित श्रेणी चुनें' : 'Explore schemes categorized for students, farmers, and entrepreneurs'}
            </p>
          </div>
          <Link to="/schemes" className="text-sm font-semibold text-brand hover:text-brand-dark flex items-center gap-1">
            <span>{language === 'hi' ? 'सभी देखें' : 'View All'}</span>
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/schemes?category=${cat.slug}`}
              className="bg-surface p-6 rounded-xl border border-border shadow-card hover:shadow-cardHover transition-all group flex items-start gap-4"
            >
              <div className="p-2.5 rounded-lg bg-hero-bg border border-border group-hover:bg-border/60 transition-colors shrink-0">
                {getCategoryIcon(cat.slug)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-text-primary group-hover:text-brand transition-colors">
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
      <section className="bg-hero-bg border-y border-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              {language === 'hi' ? 'बिहार सहायक कैसे काम करता है?' : 'How Bihar Sahayak Works'}
            </h2>
            <p className="text-sm text-text-secondary mt-2">
              {language === 'hi' ? 'योजना खोजने से लेकर आवेदन तक — बस 4 आसान स्टेप' : 'From discovering a scheme to applying — 4 simple steps'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface p-6 rounded-xl border border-border shadow-card space-y-3">
              <div className="w-8 h-8 rounded-lg bg-brand text-white font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="text-base font-semibold text-text-primary">
                {language === 'hi' ? 'प्रोफ़ाइल दर्ज करें' : 'Enter Profile'}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {language === 'hi' ? 'अपनी आयु, जिला, शिक्षा एवं आय की सामान्य जानकारी भरें।' : 'Fill basic details like age, district, income, and education.'}
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-border shadow-card space-y-3">
              <div className="w-8 h-8 rounded-lg bg-brand text-white font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="text-base font-semibold text-text-primary">
                {language === 'hi' ? 'पात्रता विश्लेषण' : 'Eligibility Check'}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {language === 'hi' ? '14-कारकों के आधार पर तुरंत पता चलता है कि कौनसी योजना मिलेगी।' : 'Our engine computes exact scheme eligibility based on official rules.'}
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-border shadow-card space-y-3">
              <div className="w-8 h-8 rounded-lg bg-brand text-white font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="text-base font-semibold text-text-primary">
                {language === 'hi' ? 'दस्तावेज़ चेकलिस्ट' : 'Document Checklist'}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {language === 'hi' ? 'आवेदन से पूर्व आवश्यक प्रमाण पत्रों और कागजातों की सूची देखें।' : 'Get an exact checklist of required certificates before applying.'}
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-border shadow-card space-y-3">
              <div className="w-8 h-8 rounded-lg bg-brand text-white font-bold flex items-center justify-center text-sm">
                4
              </div>
              <h3 className="text-base font-semibold text-text-primary">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">
              {language === 'hi' ? 'प्रमुख लोकप्रिय योजनाएं' : 'Popular Bihar Schemes'}
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              {language === 'hi' ? 'सर्वाधिक खोजी जाने वाली सरकारी योजनाएं' : 'Most frequently accessed schemes by students, youth, and farmers'}
            </p>
          </div>
          <Link to="/schemes" className="text-sm font-semibold text-brand hover:text-brand-dark flex items-center gap-1">
            <span>{language === 'hi' ? 'सभी 25 योजनाएं देखें' : 'View All Schemes'}</span>
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
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
            <h2 className="text-xl sm:text-2xl font-bold leading-tight">
              {language === 'hi'
                ? 'जानना चाहते हैं कि आप किस योजना के पात्र हैं?'
                : 'Want to discover which schemes you qualify for?'}
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {language === 'hi'
                ? 'केवल 1 मिनट में अपनी बुनियादी जानकारी दर्ज करें और तुरंत अपनी व्यक्तिगत योजना रिपोर्ट देखें।'
                : 'Enter your basic profile in 1 minute to receive an instant personalized eligibility match.'}
            </p>
          </div>

          <Link
            to="/eligibility"
            className="bg-brand hover:bg-brand-dark text-white font-medium px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center text-sm shadow-sm shrink-0 cursor-pointer"
          >
            {language === 'hi' ? 'तुरंत पात्रता जांचें' : 'Check Eligibility Now'}
          </Link>
        </div>
      </section>

    </div>
  );
}
