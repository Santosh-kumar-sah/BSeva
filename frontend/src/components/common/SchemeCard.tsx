import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, FileText, CheckCircle, Building2, Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSavedSchemes } from '../../context/SavedSchemesContext';
import EligibilityBadge from './EligibilityBadge';
import { Scheme, SchemeEvaluationResult } from '../../types';

interface SchemeCardProps {
  scheme: Scheme;
  eligibilityResult?: SchemeEvaluationResult;
}

export default function SchemeCard({ scheme, eligibilityResult }: SchemeCardProps) {
  const { language } = useAuth();
  const { isSaved, saveScheme, removeScheme } = useSavedSchemes();

  const saved = isSaved(scheme.id);

  const title = language === 'hi' ? scheme.title_hi : scheme.title_en;
  const description = language === 'hi' ? scheme.description_hi : scheme.description_en;
  const benefits = language === 'hi' ? scheme.benefits_hi : scheme.benefits_en;

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      removeScheme(scheme.id);
    } else {
      saveScheme(scheme);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between group relative">
      <div>
        {/* Top Header Tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            {scheme.category?.name_hi && language === 'hi' ? scheme.category.name_hi : (scheme.category?.name_en || 'General')}
          </span>

          <div className="flex items-center gap-2">
            {eligibilityResult && (
              <EligibilityBadge 
                status={eligibilityResult.status} 
                score={eligibilityResult.matchScore} 
                language={language} 
              />
            )}

            {/* Bookmark button */}
            <button
              onClick={handleToggleSave}
              title={saved ? (language === 'hi' ? 'सुरक्षित सूची से हटाएं' : 'Remove from saved') : (language === 'hi' ? 'योजना सुरक्षित करें' : 'Save scheme')}
              className={`p-1.5 rounded-lg border transition ${
                saved 
                  ? 'bg-amber-50 border-amber-300 text-amber-600 hover:bg-amber-100' 
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Department Name */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">
            {scheme.department?.name_hi && language === 'hi' ? scheme.department.name_hi : (scheme.department?.name_en || 'Bihar Govt')}
          </span>
        </div>

        {/* Title */}
        <Link to={`/schemes/${scheme.slug}`}>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition line-clamp-2 mb-2 leading-snug">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {description}
        </p>

        {/* Benefits Highlight Box */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                {language === 'hi' ? 'मुख्य लाभ' : 'Key Benefit'}
              </p>
              <p className="text-xs text-slate-800 font-semibold line-clamp-2">
                {benefits}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>{scheme.required_documents?.length || 4} {language === 'hi' ? 'दस्तावेज़' : 'Docs'}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/schemes/${scheme.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 py-1 px-2.5 rounded-lg hover:bg-orange-50 transition"
          >
            <span>{language === 'hi' ? 'विवरण' : 'Details'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          
          <a
            href={scheme.official_portal_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            title={language === 'hi' ? 'आधिकारिक पोर्टल खोलें' : 'Open Official Portal'}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
