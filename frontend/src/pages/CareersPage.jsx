import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Briefcase, 
  TrendingUp, 
  BookOpen, 
  Award, 
  ArrowRight,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { careerService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CareersPage() {
  const { language } = useAuth();
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState('');

  useEffect(() => {
    const fetchCareers = async () => {
      setLoading(true);
      try {
        const params = {};
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
          <Compass className="w-4 h-4" />
          <span>{language === 'hi' ? 'करियर व कौशल विकास केंद्र' : 'Career & Skill Intelligence'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          {language === 'hi' ? 'बिहार में करियर एवं रोजगार के अवसर' : 'Explore High-Growth Careers'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {language === 'hi'
            ? 'अपनी शिक्षा एवं रुचि के अनुसार उच्च मांग वाले करियर पाथवे, आवश्यक स्किल्स एवं BSDM सरकारी ट्रेनिंग कोर्स खोजें।'
            : 'Find high-demand careers, required skill competencies, and government-subsidized BSDM training paths.'}
        </p>
      </div>

      {/* Industry Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedIndustry('')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            selectedIndustry === ''
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {language === 'hi' ? 'सभी उद्योग' : 'All Industries'}
        </button>
        {industries.map((ind) => (
          <button
            key={ind}
            onClick={() => setSelectedIndustry(ind)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedIndustry === ind
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
            <div key={n} className="bg-white rounded-2xl border border-slate-200 p-6 h-64 animate-pulse space-y-4">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-6 bg-slate-200 rounded w-3/4"></div>
              <div className="h-16 bg-slate-100 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career) => {
            const title = language === 'hi' ? career.title_hi : career.title_en;
            const desc = language === 'hi' ? career.description_hi : career.description_en;

            return (
              <div key={career.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 truncate">
                      {career.industry}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <TrendingUp className="w-3 h-3" />
                      {career.growth_prospects} Growth
                    </span>
                  </div>

                  <Link to={`/careers/${career.slug}`}>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 mb-2 leading-snug">
                      {title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {desc}
                  </p>

                  {/* Salary & Min Education */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-4 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block">{language === 'hi' ? 'प्रारंभिक वेतन' : 'Avg Starting'}</span>
                      <span className="font-extrabold text-slate-800">
                        ₹{(career.avg_starting_salary_inr / 100000).toFixed(1)}L / {language === 'hi' ? 'वर्ष' : 'yr'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block">{language === 'hi' ? 'न्यूनतम शिक्षा' : 'Min Education'}</span>
                      <span className="font-bold text-slate-800">{career.min_education}</span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">
                      {language === 'hi' ? 'आवश्यक कौशल' : 'Required Skills'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(career.required_skills || []).slice(0, 4).map((skill, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-600">
                    {career.bsdm_training_path?.length || 1} {language === 'hi' ? 'सरकारी कोर्स' : 'Courses'}
                  </span>
                  <Link
                    to={`/careers/${career.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-blue-600 transition"
                  >
                    <span>{language === 'hi' ? 'रोडमैप देखें' : 'View Path'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
