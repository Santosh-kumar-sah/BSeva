import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  TrendingUp, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { careerService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CareerPath } from '../types';

export default function CareersPage() {
  const { language } = useAuth();
  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');

  useEffect(() => {
    const fetchCareers = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (selectedIndustry) params.industry = selectedIndustry;
        const res = await careerService.getCareers(params);
        if (res.success) setCareers(res.careers);
      } catch (e) {
        console.error('Error fetching careers:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, [selectedIndustry]);

  const industries = [
    'Information Technology',
    'Renewable Energy & Electrical',
    'Agriculture & Food Processing',
    'GovTech & Citizen Services',
    'Public Administration & Governance',
    'Healthcare & Hospitals',
    'Textiles, Khadi & Fashion'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <div className="flex items-center gap-1.5 text-xs font-bold text-brand uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" strokeWidth={2} />
          <span>{language === 'hi' ? 'करियर व कौशल विकास' : 'Career & Skill Pathways'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight">
          {language === 'hi' ? 'बिहार में करियर एवं रोजगार के अवसर' : 'Explore High-Growth Careers'}
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">
          {language === 'hi'
            ? 'उच्च मांग वाले करियर पाथवे, आवश्यक कौशल एवं BSDM सरकारी प्रशिक्षण कोर्स खोजें।'
            : 'Find high-demand careers, required skill competencies, and government-subsidized BSDM training paths.'}
        </p>
      </div>

      {/* Industry Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedIndustry('')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border cursor-pointer ${
            selectedIndustry === ''
              ? 'bg-brand text-white border-brand shadow-xs'
              : 'bg-white text-text-secondary border-border hover:border-brand/40'
          }`}
        >
          {language === 'hi' ? 'सभी उद्योग' : 'All Industries'}
        </button>
        {industries.map((ind) => (
          <button
            key={ind}
            onClick={() => setSelectedIndustry(ind)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border cursor-pointer ${
              selectedIndustry === ind
                ? 'bg-brand text-white border-brand shadow-xs'
                : 'bg-white text-text-secondary border-border hover:border-brand/40'
            }`}
          >
            {ind}
          </button>
        ))}
      </div>

      {/* Careers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-xl border border-border p-6 h-64 animate-pulse space-y-4 shadow-card">
              <div className="h-4 bg-background rounded w-1/3"></div>
              <div className="h-6 bg-background rounded w-3/4"></div>
              <div className="h-16 bg-background rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career) => {
            const title = language === 'hi' ? career.title_hi : career.title_en;
            const desc = language === 'hi' ? career.description_hi : career.description_en;

            return (
              <div key={career.id} className="bg-white rounded-xl border border-border shadow-card hover:shadow-cardHover hover:border-brand/40 transition-all p-5 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-accent-gold/15 text-[#855B17] border border-accent-gold/30 truncate">
                      {career.industry}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success bg-success/15 border border-success/30 px-2 py-0.5 rounded-full">
                      <TrendingUp className="w-3 h-3" strokeWidth={2} />
                      {career.growth_prospects}
                    </span>
                  </div>

                  <Link to={`/careers/${career.slug}`}>
                    <h3 className="text-base font-bold font-heading text-text-primary group-hover:text-brand transition-colors line-clamp-2 mb-2">
                      {title}
                    </h3>
                  </Link>

                  <p className="text-xs text-text-secondary line-clamp-3 mb-4 leading-relaxed">
                    {desc}
                  </p>

                  {/* Salary & Min Education */}
                  <div className="p-3 rounded-lg bg-hero-bg border border-border/80 mb-4 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-text-secondary font-semibold block">{language === 'hi' ? 'प्रारंभिक वेतन' : 'Avg Starting'}</span>
                      <span className="font-extrabold text-brand">
                        ₹{((career.avg_starting_salary_inr || 250000) / 100000).toFixed(1)}L / {language === 'hi' ? 'वर्ष' : 'yr'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-text-secondary font-semibold block">{language === 'hi' ? 'न्यूनतम शिक्षा' : 'Min Education'}</span>
                      <span className="font-bold text-text-primary">{career.min_education}</span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1.5">
                      {language === 'hi' ? 'आवश्यक कौशल' : 'Required Skills'}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(career.required_skills || []).slice(0, 4).map((skill, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded-md bg-background text-text-primary text-[11px] font-medium border border-border">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-text-secondary font-semibold flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-brand" strokeWidth={2} />
                    {career.bsdm_training_path?.length || 1} {language === 'hi' ? 'प्रशिक्षण कोर्स' : 'Courses'}
                  </span>
                  <Link
                    to={`/careers/${career.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand group-hover:text-brand-dark transition-colors"
                  >
                    <span>{language === 'hi' ? 'रोडमैप देखें' : 'View Path'}</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
