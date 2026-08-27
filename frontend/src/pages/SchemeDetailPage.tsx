import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle, 
  Building2, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  Printer, 
  CheckSquare,
  AlertTriangle
} from 'lucide-react';
import { schemeService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Scheme } from '../types';

export default function SchemeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useAuth();
  
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchScheme = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await schemeService.getSchemeBySlug(slug);
        if (res.success) {
          setScheme(res.scheme);
        }
      } catch (e) {
        console.error('Error loading scheme details:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchScheme();
  }, [slug]);

  const toggleDoc = (docName: string) => {
    setCheckedDocs(prev => ({
      ...prev,
      [docName]: !prev[docName]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 bg-slate-200 rounded w-1/4"></div>
        <div className="h-10 bg-slate-200 rounded w-3/4"></div>
        <div className="h-32 bg-slate-100 rounded-2xl"></div>
        <div className="h-48 bg-slate-100 rounded-2xl"></div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">
          {language === 'hi' ? 'योजना नहीं मिली' : 'Scheme Not Found'}
        </h2>
        <Link to="/schemes" className="inline-block px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold">
          {language === 'hi' ? 'योजना डायरेक्टरी पर लौटें' : 'Back to Schemes'}
        </Link>
      </div>
    );
  }

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
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-orange-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'सभी योजनाओं पर वापस' : 'Back to all schemes'}</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition text-xs font-semibold flex items-center gap-1"
            title="Print or Save PDF"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'hi' ? 'प्रिंट' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
            {scheme.category?.name_hi && language === 'hi' ? scheme.category.name_hi : (scheme.category?.name_en || 'General')}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            {scheme.application_mode}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {language === 'hi' ? 'सत्यापित योजना' : 'Verified'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
          {title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">
              {scheme.department?.name_hi && language === 'hi' ? scheme.department.name_hi : scheme.department?.name_en}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{language === 'hi' ? 'सत्यापन तिथि:' : 'Verified Date:'} {scheme.last_verified_date}</span>
          </div>
        </div>
      </div>

      {/* Grid Layout: Main Details + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Benefits, Description, Rules */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Benefits Card */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-3xl border border-emerald-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-emerald-600 text-white">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">
                {language === 'hi' ? 'योजना के मुख्य लाभ एवं अनुदान' : 'Key Scheme Benefits'}
              </h2>
            </div>
            <p className="text-sm sm:text-base font-bold text-emerald-950 leading-relaxed">
              {benefits}
            </p>
          </div>

          {/* Detailed Description */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900">
              {language === 'hi' ? 'योजना का विवरण एवं उद्देश्य' : 'About the Scheme'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* Eligibility Criteria */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900">
                {language === 'hi' ? 'पात्रता मानदंड (Eligibility Rules)' : 'Eligibility Criteria'}
              </h2>
              <Link
                to="/eligibility"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                {language === 'hi' ? 'अपनी पात्रता जांचें →' : 'Check Your Eligibility →'}
              </Link>
            </div>

            {rules.length > 0 ? (
              <div className="space-y-3">
                {rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-800 font-medium">
                    <CheckSquare className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">
                        {rule.message_hi && language === 'hi' ? rule.message_hi : `${rule.field}: ${JSON.stringify(rule.value)}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                {language === 'hi' ? 'सामान्य शर्तें लागू हैं।' : 'Standard government eligibility conditions apply.'}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Document Checklist & Application Link */}
        <div className="space-y-6">
          
          {/* Official Apply Action Card */}
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-lg space-y-4">
            <h3 className="text-lg font-black">
              {language === 'hi' ? 'ऑनलाइन आवेदन' : 'Apply Online'}
            </h3>
            <p className="text-xs text-orange-100 leading-relaxed">
              {language === 'hi'
                ? 'यह लिंक आपको संबंधित विभाग के आधिकारिक पोर्टल पर ले जाएगा।'
                : 'This link will safely navigate you to the verified official government portal.'}
            </p>

            <a
              href={scheme.official_portal_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-white text-orange-700 hover:bg-orange-50 rounded-2xl font-black text-sm text-center flex items-center justify-center gap-2 shadow-md transition hover:scale-102"
            >
              <span>{language === 'hi' ? 'आधिकारिक पोर्टल पर जाएं' : 'Go to Official Portal'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="flex items-center gap-2 text-[11px] text-orange-200">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{language === 'hi' ? 'आवेदन से पहले सभी दस्तावेज तैयार रखें।' : 'Keep all required documents ready.'}</span>
            </div>
          </div>

          {/* Interactive Document Checklist */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'hi' ? 'आवश्यक दस्तावेज़' : 'Required Documents'}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {docs.length}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'दस्तावेज तैयार होने पर टिक करें:'
                : 'Check the boxes as you prepare each document:'}
            </p>

            <div className="space-y-2.5">
              {docs.map((doc, idx) => {
                const isChecked = !!checkedDocs[doc];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleDoc(doc)}
                    className={`w-full text-left p-3 rounded-xl border text-xs flex items-center gap-3 transition ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isChecked && <CheckCircle className="w-3 h-3" />}
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
