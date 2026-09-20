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
    <div className="bg-surface rounded-xl border border-border shadow-card hover:shadow-cardHover transition-all duration-200 p-6 flex flex-col justify-between group relative">
      <div>
        {/* Top Header: Category Tag & Status Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-hero-bg text-text-secondary border border-border">
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
                  ? 'bg-brand/10 border-brand/30 text-brand' 
                  : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-background'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-brand text-brand' : ''}`} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Title & Department */}
        <div className="space-y-1 mb-3">
          <h3 className="text-base font-semibold text-text-primary group-hover:text-brand transition-colors line-clamp-1">
            <Link to={`/schemes/${scheme.slug}`}>
              {title}
            </Link>
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Building2 className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
            <span className="truncate">
              {scheme.department?.name_hi && language === 'hi' ? scheme.department.name_hi : scheme.department?.name_en}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-4">
          {description}
        </p>

        {/* Highlighted Benefits */}
        {benefits && (
          <div className="bg-background rounded-lg border border-border p-3 mb-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-brand shrink-0 mt-0.5" strokeWidth={1.5} />
              <p className="text-xs text-text-primary line-clamp-2 font-medium">
                {benefits}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-border flex items-center justify-between text-xs mt-2">
        <div className="flex items-center gap-1 text-text-secondary">
          <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>{scheme.required_documents?.length || 4} {language === 'hi' ? 'दस्तावेज' : 'Documents'}</span>
        </div>

        <Link
          to={`/schemes/${scheme.slug}`}
          className="text-brand hover:text-brand-dark font-semibold text-xs flex items-center gap-1 transition-colors"
        >
          <span>{language === 'hi' ? 'विवरण देखें' : 'View Details'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}
