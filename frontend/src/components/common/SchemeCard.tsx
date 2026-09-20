import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle, Building2, Bookmark } from 'lucide-react';
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
    <div className="bg-white rounded-xl border border-border shadow-card hover:shadow-cardHover transition-all duration-200 p-5 flex flex-col justify-between group relative">
      <div>
        {/* Top Header: Category Tag (Filled Gold Pill) & Status Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-gold/15 text-[#855B17] border border-accent-gold/30">
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
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                saved 
                  ? 'bg-brand/10 border-brand/40 text-brand' 
                  : 'bg-white border-border text-text-secondary hover:text-brand hover:bg-background'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-brand text-brand' : ''}`} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Title & Department */}
        <div className="space-y-1 mb-2.5">
          <h3 className="text-base font-bold text-text-primary group-hover:text-brand transition-colors line-clamp-2 leading-snug">
            <Link to={`/schemes/${scheme.slug}`}>
              {title}
            </Link>
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-text-secondary font-medium">
            <Building2 className="w-3.5 h-3.5 shrink-0 text-brand" strokeWidth={1.75} />
            <span className="truncate">
              {scheme.department?.name_hi && language === 'hi' ? scheme.department.name_hi : scheme.department?.name_en}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-3">
          {description}
        </p>

        {/* Highlighted Benefits */}
        {benefits && (
          <div className="bg-hero-bg rounded-lg border border-border/80 p-3 mb-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-brand shrink-0 mt-0.5" strokeWidth={2} />
              <p className="text-xs text-text-primary line-clamp-2 font-medium">
                {benefits}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-border flex items-center justify-between text-xs mt-1">
        <div className="flex items-center gap-1 text-text-secondary font-medium">
          <FileText className="w-3.5 h-3.5 text-brand" strokeWidth={1.75} />
          <span>{scheme.required_documents?.length || 4} {language === 'hi' ? 'दस्तावेज' : 'Documents'}</span>
        </div>

        <Link
          to={`/schemes/${scheme.slug}`}
          className="text-brand hover:text-brand-dark font-bold text-xs flex items-center gap-1 transition-colors"
        >
          <span>{language === 'hi' ? 'विवरण देखें' : 'View Details'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}
