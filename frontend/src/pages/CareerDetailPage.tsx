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
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-4">
        <div className="h-4 bg-white border border-border rounded w-1/4"></div>
        <div className="h-8 bg-white border border-border rounded w-3/4"></div>
        <div className="h-40 bg-white border border-border rounded-xl"></div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-lg font-bold font-heading text-text-primary">
          {language === 'hi' ? 'करियर पाथवे नहीं मिला' : 'Career Pathway Not Found'}
        </h2>
        <Link to="/careers" className="inline-block px-4 py-2 bg-brand text-white rounded-lg text-xs font-bold hover:bg-brand-dark transition-colors shadow-sm">
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Button */}
      <Link
        to="/careers"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-dark transition-colors"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        <span>{language === 'hi' ? 'सभी करियर पाथवे पर वापस' : 'Back to all careers'}</span>
      </Link>

      {/* Main Header */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-card space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-gold/15 text-[#855B17] border border-accent-gold/30">
            {career.industry}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-success/15 text-success border border-success/30 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
            {career.growth_prospects}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight">
          {title}
        </h1>

        <div className="p-4 rounded-lg bg-hero-bg border border-border/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-text-secondary font-bold uppercase block">{language === 'hi' ? 'प्रारंभिक वेतन' : 'Avg Starting'}</span>
            <span className="font-extrabold text-base text-brand">
              ₹{((career.avg_starting_salary_inr || 250000) / 100000).toFixed(1)}L / {language === 'hi' ? 'वर्ष' : 'yr'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-text-secondary font-bold uppercase block">{language === 'hi' ? 'न्यूनतम शिक्षा' : 'Min Education'}</span>
            <span className="font-bold text-base text-text-primary">{career.min_education}</span>
          </div>
          <div>
            <span className="text-[10px] text-text-secondary font-bold uppercase block">{language === 'hi' ? 'आवश्यक कौशल' : 'Total Skills'}</span>
            <span className="font-bold text-base text-text-primary">{requiredSkills.length} Required</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Description & BSDM Training Roadmaps */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-border p-6 shadow-card space-y-3">
            <h2 className="text-base font-bold font-heading text-text-primary">
              {language === 'hi' ? 'करियर का विवरण' : 'Career Overview'}
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {desc}
            </p>
          </div>

          {/* BSDM Training Programs */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-brand" strokeWidth={2} />
              <h2 className="text-base font-bold font-heading text-text-primary">
                {language === 'hi' ? 'बिहार सरकार के प्रशिक्षण कार्यक्रम (BSDM)' : 'Govt Subsidized Training (BSDM)'}
              </h2>
            </div>
            <p className="text-xs text-text-secondary">
              {language === 'hi'
                ? 'इन सरकारी योजनाओं एवं केंद्रों के माध्यम से निःशुल्क अथवा न्यूनतम शुल्क में आवश्यक कौशल प्राप्त करें:'
                : 'Free or subsidized certification programs offered under Bihar Skill Development Mission:'}
            </p>

            <div className="space-y-2.5 pt-1">
              {trainingPaths.map((tp, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-hero-bg border border-border/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-brand text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary">{tp}</h4>
                    <span className="text-[11px] text-brand font-semibold">
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
          <div className="bg-white rounded-xl border border-border p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-heading text-text-primary">
                {language === 'hi' ? 'स्किल तत्परता' : 'Skill Readiness'}
              </h3>
              <span className="text-xs font-bold text-brand bg-brand/10 border border-brand/20 px-2.5 py-0.5 rounded-full">
                {skillReadinessPercent}% Ready
              </span>
            </div>

            <p className="text-xs text-text-secondary">
              {language === 'hi'
                ? 'जो स्किल्स आपके पास हैं, उन्हें चुनें:'
                : 'Check off the skills you already possess:'}
            </p>

            {/* Progress bar */}
            <div className="w-full bg-background border border-border rounded-full h-2.5 overflow-hidden p-0.5">
              <div 
                className="bg-brand h-full rounded-full transition-all duration-300"
                style={{ width: `${skillReadinessPercent}%` }}
              />
            </div>

            <div className="space-y-2 pt-1">
              {requiredSkills.map((skill, idx) => {
                const hasSkill = !!userSkills[skill];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                      hasSkill 
                        ? 'bg-brand/10 border-brand text-brand font-bold'
                        : 'bg-background border-border text-text-secondary hover:text-text-primary hover:border-brand/40'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      hasSkill ? 'bg-brand border-brand text-white' : 'border-border bg-white'
                    }`}>
                      {hasSkill && <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />}
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
