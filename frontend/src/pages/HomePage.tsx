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
  Compass
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
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-orange-500/20 via-emerald-500/10 to-transparent blur-3xl -z-10"></div>

        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-orange-300 backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>{language === 'hi' ? 'बिहार सरकार की सभी योजनाएं एक ही मंच पर' : 'One Platform for All Bihar Government Schemes'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            {language === 'hi' ? (
              <>
                अपने लिए सही <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-300 to-amber-300">सरकारी योजना</span> और <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">करियर अवसर</span> खोजिए
              </>
            ) : (
              <>
                Discover the Right <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Govt Schemes</span> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Career Paths</span> in Bihar
              </>
            )}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            {language === 'hi'
              ? 'बिना किसी परेशानी के अपनी पात्रता जांचें, आवश्यक दस्तावेजों की सूची पाएं और सीधे आधिकारिक सरकारी पोर्टल पर आवेदन करें।'
              : 'Evaluate your eligibility with deterministic rules, get complete document checklists, and connect directly to official department portals.'}
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative flex items-center pt-4">
            <input
              type="text"
              placeholder={language === 'hi' ? 'उदा. कन्या उत्थान, स्टूडेंट क्रेडिट कार्ड, कृषि यंत्र, पोस्ट मैट्रिक...' : 'e.g. Kanya Utthan, Student Credit Card, Krishi Yantra, KYP...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white/20 transition shadow-xl"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4" />
            <button
              type="submit"
              className="absolute right-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              {language === 'hi' ? 'खोजें' : 'Search'}
            </button>
          </form>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/eligibility"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition hover:scale-105"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'hi' ? 'मेरी पात्रता जांचें' : 'Check My Eligibility'}</span>
            </Link>

            <Link
              to="/careers"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur transition"
            >
              <Compass className="w-4 h-4 text-orange-400" />
              <span>{language === 'hi' ? 'करियर और स्किल ट्रेनिंग' : 'Explore Careers'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
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

      {/* 3. Category Matrix */}
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

      {/* 4. How It Works */}
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

      {/* 5. Featured Verified Schemes */}
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

      {/* 6. CTA Banner */}
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
