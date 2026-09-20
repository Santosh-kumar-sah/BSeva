import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  CheckCircle, 
  ExternalLink, 
  FileText, 
  ArrowLeft, 
  ShieldCheck, 
  Calendar, 
  Printer, 
  AlertTriangle,
  Bookmark,
  Clock
} from 'lucide-react';
import { schemeService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSavedSchemes, ApplicationStatus } from '../context/SavedSchemesContext';
import { Scheme } from '../types';

export default function SchemeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useAuth();
  const { isSaved, getSavedItem, saveScheme, removeScheme, updateStatus } = useSavedSchemes();

  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchScheme = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await schemeService.getSchemeBySlug(slug);
        if (res.success) {
          setScheme(res.scheme);
        } else {
          setError('Scheme not found');
        }
      } catch (err: any) {
        setError(err.customMessage || 'Failed to load scheme details');
      } finally {
        setLoading(false);
      }
    };

    fetchScheme();
  }, [slug]);

  const toggleDoc = (docName: string) => {
    setCheckedDocs(prev => ({ ...prev, [docName]: !prev[docName] }));
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-surface text-brand rounded-lg border border-border flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-bold text-text-primary">
          {language === 'hi' ? 'योजना नहीं मिली' : 'Scheme Not Found'}
        </h2>
        <p className="text-sm text-text-secondary">{error || 'The requested scheme could not be found.'}</p>
        <Link
          to="/schemes"
          className="border border-brand text-brand hover:bg-brand/5 px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          <span>{language === 'hi' ? 'सभी योजनाओं की सूची देखें' : 'Back to Scheme List'}</span>
        </Link>
      </div>
    );
  }

  const saved = isSaved(scheme.id);
  const savedItem = getSavedItem(scheme.id);

  const title = language === 'hi' ? scheme.title_hi : scheme.title_en;
  const description = language === 'hi' ? scheme.description_hi : scheme.description_en;
  const benefits = language === 'hi' ? scheme.benefits_hi : scheme.benefits_en;
  const docs = scheme.required_documents || [];
  const rules = scheme.rules || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button & Action Toolbar */}
      <div className="flex items-center justify-between">
        <Link
          to="/schemes"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-brand transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          <span>{language === 'hi' ? 'सभी योजनाओं पर वापस' : 'Back to all schemes'}</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Bookmark Button */}
          <button
            onClick={() => saved ? removeScheme(scheme.id) : saveScheme(scheme)}
            className={`px-3 py-1.5 rounded-lg transition-colors text-xs font-medium flex items-center gap-1.5 border cursor-pointer ${
              saved
                ? 'bg-brand/10 border-brand/30 text-brand'
                : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-background'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-brand text-brand' : ''}`} strokeWidth={1.5} />
            <span>{saved ? (language === 'hi' ? 'सुरक्षित है' : 'Saved') : (language === 'hi' ? 'सुरक्षित करें' : 'Save Scheme')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 text-text-secondary hover:text-text-primary border border-border hover:bg-background rounded-lg transition-colors text-xs font-medium flex items-center gap-1 cursor-pointer"
            title="Print or Save PDF"
          >
            <Printer className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">{language === 'hi' ? 'प्रिंट' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-surface rounded-xl border border-border p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-hero-bg text-text-secondary border border-border">
            {scheme.category?.name_hi && language === 'hi' ? scheme.category.name_hi : (scheme.category?.name_en || 'General')}
          </span>
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-background text-text-secondary border border-border">
            {scheme.application_mode}
          </span>
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-success/10 text-success border border-success/30 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-success" strokeWidth={1.5} />
            {language === 'hi' ? 'सत्यापित योजना' : 'Verified'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight">
          {title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary pt-4 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
            <span className="font-medium text-text-primary">
              {scheme.department?.name_hi && language === 'hi' ? scheme.department.name_hi : scheme.department?.name_en}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
            <span>{language === 'hi' ? 'सत्यापन तिथि:' : 'Verified:'} {scheme.last_verified_date}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Description Card */}
          <div className="bg-surface rounded-xl border border-border p-6 sm:p-8 shadow-card space-y-3">
            <h2 className="text-base font-semibold text-text-primary">
              {language === 'hi' ? 'योजना का विवरण' : 'About the Scheme'}
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* Benefits Card */}
          <div className="bg-surface rounded-xl border border-border p-6 sm:p-8 shadow-card space-y-4">
            <div className="flex items-center gap-2 text-text-primary">
              <CheckCircle className="w-5 h-5 text-brand" strokeWidth={1.5} />
              <h2 className="text-base font-semibold text-text-primary">
                {language === 'hi' ? 'मुख्य लाभ एवं अनुदान' : 'Key Benefits & Subsidies'}
              </h2>
            </div>
            <div className="p-4 rounded-lg bg-background border border-border text-sm text-text-primary font-medium leading-relaxed">
              {benefits}
            </div>
          </div>

          {/* Eligibility Criteria Matrix */}
          <div className="bg-surface rounded-xl border border-border p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="text-base font-semibold text-text-primary">
              {language === 'hi' ? 'पात्रता मानदंड (Eligibility Rules)' : 'Eligibility Criteria'}
            </h2>

            {rules.length > 0 ? (
              <div className="space-y-3">
                {rules.map((rule, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-background border border-border flex items-start gap-3">
                    <div className="w-5 h-5 rounded-lg bg-hero-bg text-brand font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-border">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wide">
                        {rule.field.replace('_', ' ')}
                      </h4>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {language === 'hi' && rule.message_hi ? rule.message_hi : rule.message_en || `Must satisfy ${rule.field} condition`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-secondary italic">
                {language === 'hi' ? 'सामान्य शर्तें लागू हैं।' : 'Standard government eligibility conditions apply.'}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Tracker & Apply Card */}
        <div className="space-y-6">
          
          {/* Tracker Status Widget (If Saved) */}
          {saved && (
            <div className="bg-surface rounded-xl border border-border p-6 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                  <Clock className="w-4 h-4 text-brand" strokeWidth={1.5} />
                  <span>{language === 'hi' ? 'आवेदन स्थिति (Tracking)' : 'Application Status'}</span>
                </div>
                <Link to="/saved" className="text-xs font-semibold text-brand hover:underline">
                  {language === 'hi' ? 'ट्रैकर देखें →' : 'View Tracker →'}
                </Link>
              </div>

              <select
                value={savedItem?.status || 'BOOKMARKED'}
                onChange={(e) => updateStatus(scheme.id, e.target.value as ApplicationStatus)}
                className="w-full px-3 py-2 rounded-lg text-xs font-medium border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                <option value="BOOKMARKED">{language === 'hi' ? '📌 सेव किया (Shortlisted)' : '📌 Shortlisted'}</option>
                <option value="PREPARING_DOCS">{language === 'hi' ? '📄 दस्तावेज तैयारी (Preparing Docs)' : '📄 Preparing Docs'}</option>
                <option value="APPLIED">{language === 'hi' ? '🚀 आवेदन कर दिया (Applied)' : '🚀 Applied on Portal'}</option>
                <option value="APPROVED">{language === 'hi' ? '✅ स्वीकृत (Approved / Sanctioned)' : '✅ Approved / Sanctioned'}</option>
              </select>
            </div>
          )}

          {/* Official Apply Action Card */}
          <div className="bg-hero-bg rounded-xl border border-border p-6 shadow-card space-y-4">
            <h3 className="text-base font-semibold text-text-primary">
              {language === 'hi' ? 'ऑनलाइन आवेदन' : 'Apply Online'}
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              {language === 'hi'
                ? 'यह लिंक आपको संबंधित विभाग के आधिकारिक पोर्टल पर सुरक्षित ले जाएगा।'
                : 'This link will navigate you safely to the verified official government portal.'}
            </p>

            <a
              href={scheme.official_portal_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-sm text-center flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>{language === 'hi' ? 'आधिकारिक पोर्टल पर जाएं' : 'Go to Official Portal'}</span>
              <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
            </a>

            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-accent-gold" strokeWidth={1.5} />
              <span>{language === 'hi' ? 'आवेदन से पहले सभी दस्तावेज तैयार रखें।' : 'Keep all required documents ready.'}</span>
            </div>
          </div>

          {/* Interactive Document Checklist */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand" strokeWidth={1.5} />
                <h3 className="text-base font-semibold text-text-primary">
                  {language === 'hi' ? 'आवश्यक दस्तावेज़' : 'Required Documents'}
                </h3>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 rounded-lg bg-background text-text-secondary border border-border">
                {docs.length}
              </span>
            </div>

            <p className="text-xs text-text-secondary">
              {language === 'hi'
                ? 'दस्तावेज तैयार होने पर टिक करें:'
                : 'Check the boxes as you prepare each document:'}
            </p>

            <div className="space-y-2">
              {docs.map((doc, idx) => {
                const isChecked = !!checkedDocs[doc];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleDoc(doc)}
                    className={`w-full text-left p-3 rounded-lg border text-xs flex items-center gap-3 transition-colors cursor-pointer ${
                      isChecked
                        ? 'bg-success/10 border-success/30 text-success font-medium'
                        : 'bg-background border border-border text-text-primary hover:bg-border/30'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      isChecked ? 'bg-success border-success text-white' : 'border-border bg-surface'
                    }`}>
                      {isChecked && <CheckCircle className="w-3 h-3 text-white" strokeWidth={1.5} />}
                    </div>
                    <span className={isChecked ? 'line-through opacity-80' : ''}>{doc}</span>
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
