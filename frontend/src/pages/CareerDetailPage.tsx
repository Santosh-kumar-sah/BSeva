import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  CheckCircle2, 
  Award
} from 'lucide-react';
import { careerService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CareerPath } from '../types';

export default function CareerDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useAuth();
  
  const [career, setCareer] = useState<CareerPath | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userSkills, setUserSkills] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchCareer = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await careerService.getCareerBySlug(slug);
        if (res.success) setCareer(res.career);
      } catch (e) {
        console.error('Error fetching career detail:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCareer();
  }, [slug]);

  const toggleSkill = (skill: string) => {
    setUserSkills(prev => ({
      ...prev,
      [skill]: !prev[skill]
    }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 bg-slate-200 rounded w-1/4"></div>
        <div className="h-10 bg-slate-200 rounded w-3/4"></div>
        <div className="h-48 bg-slate-100 rounded-3xl"></div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">
          {language === 'hi' ? 'करियर पाथवे नहीं मिला' : 'Career Pathway Not Found'}
        </h2>
        <Link to="/careers" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
          {language === 'hi' ? 'करियर डायरेक्टरी पर लौटें' : 'Back to Careers'}
        </Link>
      </div>
    );
  }

  const title = language === 'hi' ? career.title_hi : career.title_en;
  const desc = language === 'hi' ? career.description_hi : career.description_en;
  const requiredSkills = career.required_skills || [];
  const trainingPaths = career.bsdm_training_path || [];

  const completedSkillsCount = Object.values(userSkills).filter(Boolean).length;
  const skillReadinessPercent = requiredSkills.length > 0 
    ? Math.round((completedSkillsCount / requiredSkills.length) * 100) 
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <Link
        to="/careers"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{language === 'hi' ? 'सभी करियर पाथवे पर वापस' : 'Back to all careers'}</span>
      </Link>

      {/* Main Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            {career.industry}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            {career.growth_prospects} Growth Prospects
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
          {title}
        </h1>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{language === 'hi' ? 'प्रारंभिक वेतन' : 'Avg Starting'}</span>
            <span className="font-extrabold text-base text-slate-900">
              ₹{((career.avg_starting_salary_inr || 250000) / 100000).toFixed(1)}L / {language === 'hi' ? 'वर्ष' : 'yr'}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{language === 'hi' ? 'न्यूनतम शिक्षा' : 'Min Education'}</span>
            <span className="font-bold text-base text-slate-900">{career.min_education}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{language === 'hi' ? 'स्किल्स की संख्या' : 'Total Skills'}</span>
            <span className="font-bold text-base text-slate-900">{requiredSkills.length} Required</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Description & BSDM Training Roadmaps */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900">
              {language === 'hi' ? 'करियर का विवरण' : 'Career Overview'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {desc}
            </p>
          </div>

          {/* BSDM Training Programs */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-extrabold text-slate-900">
                {language === 'hi' ? 'बिहार सरकार के ट्रेनिंग प्रोग्राम (BSDM)' : 'Govt Subsidized Training (BSDM)'}
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'इन सरकारी योजनाओं एवं केंद्रों के माध्यम से निःशुल्क अथवा न्यूनतम शुल्क में आवश्यक कौशल प्राप्त करें:'
                : 'Free or subsidized certification programs offered under Bihar Skill Development Mission:'}
            </p>

            <div className="space-y-3 pt-2">
              {trainingPaths.map((tp, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{tp}</h4>
                    <span className="text-[11px] text-orange-700 font-semibold">
                      {language === 'hi' ? 'बिहार कौशल विकास मिशन (BSDM)' : 'Under Bihar Skill Mission'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Skill Gap Tool */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">
                {language === 'hi' ? 'स्किल गैप कैलकुलेटर' : 'Skill Readiness'}
              </h3>
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {skillReadinessPercent}% Ready
              </span>
            </div>

            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'जो स्किल्स आपके पास हैं, उन पर टिक करें:'
                : 'Check off the skills you already know:'}
            </p>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${skillReadinessPercent}%` }}
              ></div>
            </div>

            <div className="space-y-2 pt-2">
              {requiredSkills.map((skill, idx) => {
                const hasSkill = !!userSkills[skill];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`w-full text-left p-3 rounded-xl border text-xs flex items-center gap-3 transition ${
                      hasSkill 
                        ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      hasSkill ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {hasSkill && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
