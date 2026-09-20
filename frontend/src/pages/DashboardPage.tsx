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
  FileCheck
} from 'lucide-react';
import { eligibilityService, careerService } from '../services/api';
import { EligibilityCheckResponse, CareerPath } from '../types';

export default function DashboardPage() {
  const { user, profile, language } = useAuth();
  const { savedCount } = useSavedSchemes();
  
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Header */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand text-white flex items-center justify-center font-extrabold text-xl shadow-sm">
            {user?.fullName?.[0] || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-text-primary">
                {language === 'hi' ? `नमस्ते, ${user?.fullName?.split(' ')[0]}` : `Welcome, ${user?.fullName?.split(' ')[0]}`}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand/10 text-brand border border-brand/20">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5 font-medium">
              {profile?.district ? `${profile.district}, Bihar` : 'Bihar, India'} • {profile?.education || 'Citizen'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/saved"
            className="px-3.5 py-2 bg-white hover:bg-background text-text-primary rounded-lg text-xs font-bold border border-border transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Bookmark className="w-4 h-4 text-brand" strokeWidth={2} />
            <span>{language === 'hi' ? `ट्रैकर (${savedCount})` : `Tracker (${savedCount})`}</span>
          </Link>
          <Link
            to="/profile"
            className="px-3.5 py-2 bg-white hover:bg-background text-text-primary rounded-lg text-xs font-bold border border-border transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Edit3 className="w-4 h-4 text-brand" strokeWidth={2} />
            <span>{language === 'hi' ? 'प्रोफ़ाइल बदलें' : 'Edit Profile'}</span>
          </Link>
          <Link
            to="/eligibility"
            className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
          >
            <CheckSquare className="w-4 h-4" strokeWidth={2} />
            <span>{language === 'hi' ? 'पुनः जांचें' : 'Recalculate'}</span>
          </Link>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-border p-5 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-success/15 text-success border border-success/30 flex items-center justify-center font-extrabold text-xl shadow-xs">
            {eligibilityResults?.summary.potentiallyEligibleCount ?? '-'}
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
              {language === 'hi' ? 'पात्र योजनाएं' : 'Eligible Schemes'}
            </h4>
            <p className="text-xs sm:text-sm font-bold text-text-primary mt-0.5">
              {language === 'hi' ? 'आवेदन योग्य' : 'Directly Qualified'}
            </p>
          </div>
        </div>

        <Link
          to="/saved"
          className="bg-white rounded-xl border border-border p-5 shadow-card hover:shadow-cardHover hover:border-brand/40 transition-all flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand border border-brand/25 flex items-center justify-center font-extrabold text-xl shadow-xs">
            {savedCount}
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
              {language === 'hi' ? 'ट्रैक की जा रही योजनाएं' : 'Tracked Schemes'}
            </h4>
            <p className="text-xs sm:text-sm font-bold text-brand mt-0.5 flex items-center gap-1">
              <span>{language === 'hi' ? 'ट्रैकर देखें' : 'View Tracker'}</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </p>
          </div>
        </Link>

        <div className="bg-white rounded-xl border border-border p-5 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand border border-brand/25 flex items-center justify-center font-extrabold text-xl shadow-xs">
            {careerRecommendations.length}
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
              {language === 'hi' ? 'करियर पाथवे' : 'Career Pathways'}
            </h4>
            <p className="text-xs sm:text-sm font-bold text-text-primary mt-0.5">
              {language === 'hi' ? 'BSDM कोर्स' : 'Skill Pathways'}
            </p>
          </div>
        </div>

        <Link
          to="/documents"
          className="bg-white rounded-xl border border-border p-5 shadow-card hover:shadow-cardHover hover:border-brand/40 transition-all flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-hero-bg text-brand border border-border flex items-center justify-center font-extrabold text-xl shadow-xs">
            <FileCheck className="w-6 h-6" strokeWidth={2} />
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
              {language === 'hi' ? 'दस्तावेज ऑडिटर' : 'Doc Auditor'}
            </h4>
            <p className="text-xs sm:text-sm font-bold text-brand mt-0.5 flex items-center gap-1">
              <span>{language === 'hi' ? 'RTPS चेकलिस्ट' : 'RTPS Ready'}</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </p>
          </div>
        </Link>
      </div>

      {/* Matched Schemes Section */}
      {eligibilityResults && eligibilityResults.results.potentiallyEligible.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div>
              <h2 className="text-lg font-bold font-heading text-text-primary flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand" strokeWidth={2} />
                <span>{language === 'hi' ? 'आपके लिए अनुशंसित सरकारी योजनाएं' : 'Matched Schemes for Your Profile'}</span>
              </h2>
              <p className="text-xs text-text-secondary mt-0.5 font-medium">
                {language === 'hi' ? 'आपकी प्रोफ़ाइल के अनुसार सटीक पात्रता विश्लेषण' : 'Schemes matching your district, age, income, and educational profile'}
              </p>
            </div>
            <Link to="/eligibility" className="text-xs font-bold text-brand hover:text-brand-dark flex items-center gap-1">
              <span>{language === 'hi' ? 'सभी देखें' : 'View All'}</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligibilityResults.results.potentiallyEligible.slice(0, 6).map((res) => (
              <div key={res.schemeId} className="bg-white rounded-xl border border-border p-5 shadow-card hover:shadow-cardHover hover:border-brand/40 transition-all flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-success/15 text-success border border-success/30">
                      {res.matchScore}% Match
                    </span>
                    <span className="text-xs font-semibold text-text-secondary">
                      {language === 'hi' ? 'पात्र' : 'Eligible'}
                    </span>
                  </div>

                  <Link to={`/schemes/${res.schemeSlug}`}>
                    <h3 className="text-base font-bold font-heading text-text-primary hover:text-brand transition-colors line-clamp-2">
                      {language === 'hi' && res.title_hi ? res.title_hi : res.title_en}
                    </h3>
                  </Link>

                  {(res.benefits_hi || res.benefits_en) && (
                    <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                      {language === 'hi' && res.benefits_hi ? res.benefits_hi : res.benefits_en}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <Link
                    to={`/schemes/${res.schemeSlug}`}
                    className="text-xs font-bold text-brand hover:text-brand-dark flex items-center gap-1"
                  >
                    <span>{language === 'hi' ? 'विवरण' : 'Details'}</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                  </Link>
                  <a
                    href={res.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-text-secondary hover:text-brand"
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
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div>
              <h2 className="text-lg font-bold font-heading text-text-primary flex items-center gap-2">
                <Compass className="w-5 h-5 text-brand" strokeWidth={2} />
                <span>{language === 'hi' ? 'सुझाए गए करियर और कौशल पाथवे' : 'Recommended Career & Skill Pathways'}</span>
              </h2>
              <p className="text-xs text-text-secondary mt-0.5 font-medium">
                {language === 'hi' ? 'बिहार कौशल विकास मिशन (BSDM) सर्टिफाइड कोर्स' : 'Personalized training paths mapped with Bihar Skill Development Mission'}
              </p>
            </div>
            <Link to="/careers" className="text-xs font-bold text-brand hover:text-brand-dark flex items-center gap-1">
              <span>{language === 'hi' ? 'सभी करियर देखें' : 'Explore All'}</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careerRecommendations.slice(0, 4).map((career) => (
              <div
                key={career.id}
                className="bg-white rounded-xl border border-border p-5 shadow-card hover:shadow-cardHover hover:border-brand/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-gold/15 text-[#855B17] border border-accent-gold/30">
                      {career.industry}
                    </span>
                    <h3 className="text-base font-bold font-heading text-text-primary mt-2">
                      {language === 'hi' && career.title_hi ? career.title_hi : career.title_en}
                    </h3>
                  </div>
                  {career.avg_starting_salary_inr && (
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-text-secondary font-semibold block uppercase">
                        {language === 'hi' ? 'वेतन' : 'Avg Salary'}
                      </span>
                      <span className="text-sm font-extrabold text-brand">
                        ₹{(career.avg_starting_salary_inr / 100000).toFixed(1)}L / वर्ष
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                  {language === 'hi' && career.description_hi ? career.description_hi : career.description_en}
                </p>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-text-secondary font-medium">
                    {career.bsdm_training_path?.length || 3} {language === 'hi' ? 'प्रशिक्षण चरण' : 'Training Steps'}
                  </span>
                  <Link
                    to={`/careers/${career.slug}`}
                    className="text-xs font-bold text-brand hover:text-brand-dark flex items-center gap-1"
                  >
                    <span>{language === 'hi' ? 'रोडमैप देखें' : 'View Roadmap'}</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
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
