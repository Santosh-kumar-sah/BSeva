import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ExternalLink, 
  PhoneCall, 
  FileCheck, 
  Compass, 
  HelpCircle,
  Sparkles,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const { language } = useAuth();

  return (
    <footer className="bg-white text-text-secondary text-sm border-t-4 border-brand shadow-card mt-20">
      
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        
        {/* Top Grid: 4 Balanced Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Col 1: Platform Identity & Mandate (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Logo & Brand Name */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-white font-extrabold text-base shadow-sm shrink-0">
                ब
              </div>
              <div>
                <span className="font-extrabold text-base text-text-primary block leading-tight font-heading">
                  {language === 'hi' ? 'बिहार सहायक (BSeva)' : 'Bihar Sahayak (BSeva)'}
                </span>
                <span className="text-[11px] font-semibold text-brand tracking-wide">
                  {language === 'hi' ? 'बिहार सरकार योजना एवं करियर पोर्टल' : 'Bihar Govt Scheme & Career Portal'}
                </span>
              </div>
            </div>

            {/* Platform Description */}
            <p className="text-xs leading-relaxed text-text-secondary">
              {language === 'hi'
                ? 'बिहार के नागरिकों, विद्यार्थियों, किसानों एवं युवाओं के लिए सरकारी योजनाओं, पात्रता सत्यापन एवं कौशल प्रशिक्षण अवसरों का एकीकृत डिजिटल मंच।'
                : 'An integrated civic intelligence platform for discovering Bihar government schemes, evaluating eligibility criteria, and exploring career pathways.'}
            </p>

            {/* Verified Badge */}
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand bg-brand/10 border border-brand/20 px-3 py-1.5 rounded-full shadow-xs">
              <ShieldCheck className="w-4 h-4 text-brand" strokeWidth={2} />
              <span>{language === 'hi' ? 'सत्यापित सरकारी स्रोत एवं नियम' : '100% Verified Govt Sources'}</span>
            </div>

            {/* Helpline Info Box */}
            <div className="p-3 bg-background rounded-lg border border-border space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-text-primary">
                <PhoneCall className="w-3.5 h-3.5 text-brand" />
                <span>{language === 'hi' ? 'नागरिक सहायता हेल्पलाइन' : 'Citizen Helpline'}</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-snug">
                {language === 'hi' ? 'RTPS बिहार टोल-फ्री:' : 'RTPS Bihar Toll-Free:'}{' '}
                <span className="font-bold text-text-primary">1800-3456-268</span>
              </p>
            </div>

          </div>

          {/* Col 2: Citizen Services / Navigation (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="border-b border-border pb-2">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand" strokeWidth={2} />
                <span>{language === 'hi' ? 'नागरिक सेवाएं' : 'Citizen Services'}</span>
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/schemes" className="hover:text-brand hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5">
                  <span className="text-brand">›</span>
                  <span>{language === 'hi' ? 'सभी सरकारी योजनाएं' : 'All Govt Schemes'}</span>
                </Link>
              </li>
              <li>
                <Link to="/eligibility" className="hover:text-brand hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5">
                  <span className="text-brand">›</span>
                  <span>{language === 'hi' ? '14-कारक पात्रता जांच' : '14-Factor Eligibility Check'}</span>
                </Link>
              </li>
              <li>
                <Link to="/documents" className="hover:text-brand hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5">
                  <span className="text-brand">›</span>
                  <span>{language === 'hi' ? 'आवश्यक दस्तावेज़ चेकलिस्ट' : 'Document Checklist'}</span>
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-brand hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5">
                  <span className="text-brand">›</span>
                  <span>{language === 'hi' ? 'कौशल एवं करियर मार्गदर्शन' : 'BSDM Skills & Career Guide'}</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5">
                  <span className="text-brand">›</span>
                  <span>{language === 'hi' ? 'नागरिक प्रोफ़ाइल डैशबोर्ड' : 'Citizen Profile Dashboard'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Govt Portals (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="border-b border-border pb-2">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-brand" strokeWidth={2} />
                <span>{language === 'hi' ? 'आधिकारिक सरकारी पोर्टल' : 'Official State Portals'}</span>
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a
                  href="https://serviceonline.bihar.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand hover:translate-x-0.5 transition-all inline-flex items-center justify-between w-full group"
                >
                  <span>ServicePlus Bihar (RTPS)</span>
                  <ExternalLink className="w-3 h-3 text-text-secondary group-hover:text-brand transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="https://dbtagriculture.bihar.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand hover:translate-x-0.5 transition-all inline-flex items-center justify-between w-full group"
                >
                  <span>DBT Agriculture Portal</span>
                  <ExternalLink className="w-3 h-3 text-text-secondary group-hover:text-brand transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="http://medhasoft.bih.nic.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand hover:translate-x-0.5 transition-all inline-flex items-center justify-between w-full group"
                >
                  <span>MedhaSoft Scholarship</span>
                  <ExternalLink className="w-3 h-3 text-text-secondary group-hover:text-brand transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="https://skillmissionbihar.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand hover:translate-x-0.5 transition-all inline-flex items-center justify-between w-full group"
                >
                  <span>Bihar Skill Mission (BSDM)</span>
                  <ExternalLink className="w-3 h-3 text-text-secondary group-hover:text-brand transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="https://myscheme.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand hover:translate-x-0.5 transition-all inline-flex items-center justify-between w-full group"
                >
                  <span>myScheme Central Portal</span>
                  <ExternalLink className="w-3 h-3 text-text-secondary group-hover:text-brand transition-colors" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Notice & Trust (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="border-b border-border pb-2">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-brand" strokeWidth={2} />
                <span>{language === 'hi' ? 'महत्वपूर्ण सूचना' : 'Disclaimer'}</span>
              </h3>
            </div>
            <div className="p-3 bg-background rounded-lg border border-border space-y-2">
              <p className="text-[11px] leading-relaxed text-text-secondary">
                {language === 'hi'
                  ? 'बिहार सहायक एक स्वतंत्र नागरिक मार्गदर्शन मंच है। अंतिम आवेदन एवं सत्यापन कार्य आधिकारिक विभागीय पोर्टल्स पर ही होता है।'
                  : 'Bihar Sahayak is a civic discovery layer. Scheme verification & disbursement occur exclusively on official Bihar Government portals.'}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Secondary Links */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-text-secondary gap-4">
          <p className="font-medium text-center sm:text-left">
            © {new Date().getFullYear()} <span className="font-bold text-text-primary">बिहार सहायक (BSeva)</span> • Open Civics Initiative
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 font-semibold text-text-secondary">
            <Link to="/schemes" className="hover:text-brand transition-colors">
              {language === 'hi' ? 'योजनाएं' : 'Schemes'}
            </Link>
            <Link to="/eligibility" className="hover:text-brand transition-colors">
              {language === 'hi' ? 'पात्रता' : 'Eligibility'}
            </Link>
            <Link to="/documents" className="hover:text-brand transition-colors">
              {language === 'hi' ? 'दस्तावेज़' : 'Documents'}
            </Link>
            <Link to="/login" className="text-brand hover:underline font-bold">
              {language === 'hi' ? 'नागरिक लॉगिन' : 'Citizen Login'}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
