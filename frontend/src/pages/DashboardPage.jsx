import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  CheckSquare, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  BookOpen, 
  ArrowRight,
  RefreshCw,
  Edit3
} from 'lucide-react';
import { eligibilityService, careerService } from '../services/api';
import SchemeCard from '../components/common/SchemeCard';

export default function DashboardPage() {
  const { user, profile, language } = useAuth();
  
  const [eligibilityResults, setEligibilityResults] = useState(null);
  const [careerRecommendations, setCareerRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

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
              {profile?.district ? `${profile.district}, Bihar` : 'Bihar, India'} • {profile?.education || 'Student'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
      {eligibilityResults && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl">
              {eligibilityResults.summary.potentiallyEligibleCount}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                {language === 'hi' ? 'पात्र योजनाएं' : 'Eligible Schemes'}
              </h4>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                {language === 'hi' ? 'तत्काल आवेदन योग्य' : 'Directly Qualified'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xl">
              {careerRecommendations.length}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                {language === 'hi' ? 'अनुकूल करियर पाथवे' : 'Matched Careers'}
              </h4>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                {language === 'hi' ? 'स्किल आधारित अवसर' : 'Skill-fit opportunities'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xl">
              {eligibilityResults.summary.needsVerificationCount}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                {language === 'hi' ? 'सत्यापन आवश्यक' : 'Needs Verification'}
              </h4>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                {language === 'hi' ? 'अतिरिक्त कागजात चाहिए' : 'Missing some attributes'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Matched Schemes Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>{language === 'hi' ? 'आपके लिए अनुशंसित सरकारी योजनाएं' : 'Matched Schemes for Your Profile'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'hi' ? 'आपके आयु, जिले एवं शैक्षणिक योग्यता के आधार पर' : 'Based on your age, district, and educational background'}
            </p>
          </div>
          <Link to="/schemes" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
            <span>{language === 'hi' ? 'सभी देखें' : 'View All'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 p-6 h-60 animate-pulse"></div>
            ))}
          </div>
        ) : eligibilityResults?.results?.potentiallyEligible?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligibilityResults.results.potentiallyEligible.slice(0, 6).map((item) => (
              <div key={item.schemeId} className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {language === 'hi' ? '100% पात्र' : '100% Eligible'}
                    </span>
                  </div>

                  <Link to={`/schemes/${item.schemeSlug}`}>
                    <h3 className="text-base font-bold text-slate-900 hover:text-emerald-700 transition line-clamp-2">
                      {language === 'hi' ? item.title_hi : item.title_en}
                    </h3>
                  </Link>

                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 text-xs font-semibold text-emerald-900">
                    {language === 'hi' ? item.benefits_hi : item.benefits_en}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/schemes/${item.schemeSlug}`}
                    className="text-xs font-bold text-slate-700 hover:text-emerald-700"
                  >
                    {language === 'hi' ? 'दस्तावेज देखें →' : 'View Docs →'}
                  </Link>
                  <a
                    href={item.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-extrabold text-orange-600 hover:text-orange-700"
                  >
                    {language === 'hi' ? 'आवेदन लिंक ↗' : 'Apply Portal ↗'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
            <p className="text-xs text-slate-600">
              {language === 'hi'
                ? 'अपनी प्रोफ़ाइल पूरी करें ताकि सही योजनाओं की सूची दिख सके।'
                : 'Complete your profile to see personalized scheme recommendations.'}
            </p>
            <Link to="/profile" className="inline-block px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold">
              {language === 'hi' ? 'प्रोफ़ाइल भरें' : 'Complete Profile'}
            </Link>
          </div>
        )}
      </div>

      {/* Recommended Career Pathways */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" />
              <span>{language === 'hi' ? 'स्किल आधारित करियर मार्गदर्शन' : 'Career Opportunities Based on Your Skills'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'hi' ? 'आपके कौशलों और रुचियों से मेल खाते करियर विकल्प' : 'Careers that match your current skillset and interests'}
            </p>
          </div>
          <Link to="/careers" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <span>{language === 'hi' ? 'सभी करियर देखें' : 'View All'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careerRecommendations.slice(0, 3).map((career) => (
            <div key={career.careerId} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {career.industry}
                  </span>
                  <span className="text-xs font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    {career.matchScore}% Match
                  </span>
                </div>

                <Link to={`/careers/${career.slug}`}>
                  <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition line-clamp-2">
                    {language === 'hi' ? career.title_hi : career.title_en}
                  </h3>
                </Link>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                  {language === 'hi' ? career.description_hi : career.description_en}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800">
                  ₹{(career.avg_starting_salary_inr / 100000).toFixed(1)}L/yr
                </span>
                <Link
                  to={`/careers/${career.slug}`}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  {language === 'hi' ? 'स्किल रोडमैप देखें →' : 'View Skill Path →'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
