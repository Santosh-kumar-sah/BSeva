import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSavedSchemes } from '../context/SavedSchemesContext';
import { 
  CheckSquare, 
  Compass, 
  Sparkles, 
  ArrowRight,
  Edit3,
  Bookmark,
  Building2,
  FileCheck
} from 'lucide-react';
import { eligibilityService, careerService } from '../services/api';
import { EligibilityCheckResponse, CareerPath } from '../types';
import SchemeCard from '../components/common/SchemeCard';

export default function DashboardPage() {
  const { user, profile, language } = useAuth();
  const { savedCount, savedItems } = useSavedSchemes();
  
  const [eligibilityResults, setEligibilityResults] = useState<EligibilityCheckResponse | null>(null);
  const [careerRecommendations, setCareerRecommendations] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        if (profile) {
          const [elRes, carRes] = await Promise.all([
            eligibilityService.checkEligibility(profile),
            careerService.recommendCareers(profile)
          ]);
          if (elRes.success) setEligibilityResults(elRes);
          if (carRes.success) setCareerRecommendations(carRes.recommendations || []);
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [profile]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white text-2xl font-black shadow-md">
            {user?.fullName?.[0] || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">
                {language === 'hi' ? `नमस्ते, ${user?.fullName?.split(' ')[0]}` : `Welcome, ${user?.fullName?.split(' ')[0]}`}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {profile?.district ? `${profile.district}, Bihar` : 'Bihar, India'} • {profile?.education || 'Citizen'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/saved"
            className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-xl text-xs font-bold border border-orange-400/30 backdrop-blur transition flex items-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? `ट्रैकर (${savedCount})` : `Tracker (${savedCount})`}</span>
          </Link>
          <Link
            to="/profile"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 backdrop-blur transition flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'प्रोफ़ाइल बदलें' : 'Edit Profile'}</span>
          </Link>
          <Link
            to="/eligibility"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'पुनः जांचें' : 'Recalculate'}</span>
          </Link>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl border border-emerald-200 p-5 sm:p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl">
            {eligibilityResults?.summary.potentiallyEligibleCount ?? '-'}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              {language === 'hi' ? 'पात्र योजनाएं' : 'Eligible Schemes'}
            </h4>
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
              {language === 'hi' ? 'आवेदन योग्य' : 'Directly Qualified'}
            </p>
          </div>
        </div>

        <Link
          to="/saved"
          className="bg-white rounded-2xl border border-amber-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xl group-hover:scale-110 transition">
            {savedCount}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              {language === 'hi' ? 'ट्रैक की जा रही योजनाएं' : 'Tracked Schemes'}
            </h4>
            <p className="text-xs sm:text-sm font-extrabold text-amber-700 mt-0.5 flex items-center gap-1">
              <span>{language === 'hi' ? 'ट्रैकर देखें' : 'View Tracker'}</span>
              <ArrowRight className="w-3 h-3" />
            </p>
          </div>
        </Link>

        <div className="bg-white rounded-2xl border border-blue-200 p-5 sm:p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xl">
            {careerRecommendations.length}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              {language === 'hi' ? 'करियर पाथवे' : 'Career Pathways'}
            </h4>
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
              {language === 'hi' ? 'BSDM स्किल फिट' : 'Skill-fit opportunities'}
            </p>
          </div>
        </div>

        <Link
          to="/documents"
          className="bg-white rounded-2xl border border-purple-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xl group-hover:scale-110 transition">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              {language === 'hi' ? 'दस्तावेज ऑडिटर' : 'Doc Auditor'}
            </h4>
            <p className="text-xs sm:text-sm font-extrabold text-purple-700 mt-0.5 flex items-center gap-1">
              <span>{language === 'hi' ? 'RTPS चेकलिस्ट' : 'RTPS Ready'}</span>
              <ArrowRight className="w-3 h-3" />
            </p>
          </div>
        </Link>
      </div>

      {/* Matched Schemes Section */}
      {eligibilityResults && eligibilityResults.results.potentiallyEligible.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>{language === 'hi' ? 'आपके लिए अनुशंसित सरकारी योजनाएं' : 'Matched Schemes for Your Profile'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'hi' ? 'आपकी प्रोफ़ाइल के अनुसार 100% सटीक पात्रता विश्लेषण' : 'Schemes matching your district, age, income, and educational profile'}
              </p>
            </div>
            <Link to="/eligibility" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
              <span>{language === 'hi' ? 'सभी देखें' : 'View All'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligibilityResults.results.potentiallyEligible.slice(0, 6).map((res) => (
              <div key={res.schemeId} className="bg-white rounded-2xl border border-emerald-200/80 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {res.matchScore}% Match
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {language === 'hi' ? 'पात्र' : 'Eligible'}
                    </span>
                  </div>

                  <Link to={`/schemes/${res.schemeSlug}`}>
                    <h3 className="text-base font-bold text-slate-900 hover:text-emerald-700 transition line-clamp-2">
                      {language === 'hi' && res.title_hi ? res.title_hi : res.title_en}
                    </h3>
                  </Link>

                  {(res.benefits_hi || res.benefits_en) && (
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {language === 'hi' && res.benefits_hi ? res.benefits_hi : res.benefits_en}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/schemes/${res.schemeSlug}`}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <span>{language === 'hi' ? 'विवरण' : 'Details'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href={res.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    {language === 'hi' ? 'पोर्टल →' : 'Portal →'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Career Recommendations Section */}
      {careerRecommendations.length > 0 && (
        <div className="space-y-6 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-600" />
                <span>{language === 'hi' ? 'सुझाए गए करियर और कौशल पाथवे' : 'Recommended Career & Skill Pathways'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'hi' ? 'आपकी शिक्षा और रुचि के आधार पर बिहार कौशल विकास मिशन (BSDM) सर्टिफाइड कोर्स' : 'Personalized training paths mapped with Bihar Skill Development Mission'}
              </p>
            </div>
            <Link to="/careers" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <span>{language === 'hi' ? 'सभी करियर देखें' : 'Explore All'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careerRecommendations.slice(0, 4).map((career) => (
              <div
                key={career.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {career.industry}
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-2">
                      {language === 'hi' && career.title_hi ? career.title_hi : career.title_en}
                    </h3>
                  </div>
                  {career.avg_starting_salary_inr && (
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        {language === 'hi' ? 'औसत वेतन' : 'Avg Salary'}
                      </span>
                      <span className="text-sm font-black text-emerald-600">
                        ₹{(career.avg_starting_salary_inr / 100000).toFixed(1)}L / वर्ष
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {language === 'hi' && career.description_hi ? career.description_hi : career.description_en}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {career.bsdm_training_path?.length || 3} {language === 'hi' ? 'प्रशिक्षण चरण' : 'Training Steps'}
                  </span>
                  <Link
                    to={`/careers/${career.slug}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>{language === 'hi' ? 'रोडमैप देखें' : 'View Roadmap'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
