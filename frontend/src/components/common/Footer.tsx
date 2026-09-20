import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const { language } = useAuth();

  return (
    <footer className="bg-surface text-text-secondary text-sm border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Platform Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-sm">
                ब
              </div>
              <span className="font-bold text-base text-text-primary">
                {language === 'hi' ? 'बिहार सहायक (BSeva)' : 'Bihar Sahayak (BSeva)'}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-text-secondary">
              {language === 'hi'
                ? 'बिहार के नागरिकों, विद्यार्थियों, किसानों एवं युवाओं के लिए सरकारी योजनाओं एवं करियर अवसरों का डिजिटल खोज मंच।'
                : 'A civic intelligence platform for discovering Bihar government schemes, eligibility rules, and career opportunities.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-success bg-background border border-border px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
              <span>{language === 'hi' ? 'सत्यापित सरकारी पोर्टल' : 'Official Portal Directory'}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
              {language === 'hi' ? 'प्रमुख अनुभाग' : 'Quick Navigation'}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/schemes" className="hover:text-brand transition-colors">
                  {language === 'hi' ? 'योजना डायरेक्टरी' : 'All Schemes Directory'}
                </Link>
              </li>
              <li>
                <Link to="/eligibility" className="hover:text-brand transition-colors">
                  {language === 'hi' ? 'पात्रता जांच कैलकुलेटर' : 'Eligibility Checker'}
                </Link>
              </li>
              <li>
                <Link to="/documents" className="hover:text-brand transition-colors">
                  {language === 'hi' ? 'दस्तावेज़ चेकलिस्ट' : 'Document Readiness'}
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-brand transition-colors">
                  {language === 'hi' ? 'करियर और स्किल ट्रेनिंग' : 'Careers & Skills'}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand transition-colors">
                  {language === 'hi' ? 'नागरिक डैशबोर्ड' : 'Citizen Dashboard'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Govt Portals */}
          <div>
            <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
              {language === 'hi' ? 'आधिकारिक सरकारी पोर्टल' : 'Official Portals'}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://serviceonline.bihar.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors flex items-center gap-1">
                  <span>ServicePlus Bihar (RTPS)</span>
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
              </li>
              <li>
                <a href="https://dbtagriculture.bihar.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors flex items-center gap-1">
                  <span>DBT Agriculture Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
              </li>
              <li>
                <a href="http://medhasoft.bih.nic.in/" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors flex items-center gap-1">
                  <span>MedhaSoft Scholarship</span>
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
              </li>
              <li>
                <a href="https://skillmissionbihar.org/" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors flex items-center gap-1">
                  <span>Bihar Skill Development (BSDM)</span>
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Important Note */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
              {language === 'hi' ? 'महत्वपूर्ण सूचना' : 'Official Notice'}
            </h3>
            <p className="text-xs leading-relaxed text-text-secondary">
              {language === 'hi'
                ? 'बिहार सहायक एक स्वतंत्र नागरिक मार्गदर्शन सेवा है। योजना के अंतिम आवेदन एवं सत्यापन का कार्य केवल आधिकारिक विभागीय पोर्टल्स पर होता है।'
                : 'Bihar Sahayak is a civic information layer. Official applications and disbursements are handled exclusively by Government of Bihar departments.'}
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-text-secondary gap-4">
          <p>© {new Date().getFullYear()} Bihar Sahayak (BSeva). Open Civics Initiative.</p>
          <div className="flex items-center gap-6">
            <Link to="/schemes" className="hover:text-brand transition-colors">Directory</Link>
            <Link to="/eligibility" className="hover:text-brand transition-colors">Eligibility</Link>
            <Link to="/login" className="hover:text-brand transition-colors">Citizen Login</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
