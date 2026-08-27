import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ExternalLink, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const { language } = useAuth();

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Platform Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-base">
                ब
              </div>
              <span className="font-bold text-base text-white">
                {language === 'hi' ? 'बिहार सहायक (BSeva)' : 'Bihar Sahayak (BSeva)'}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              {language === 'hi'
                ? 'बिहार के नागरिकों, विद्यार्थियों, किसानों एवं युवाओं के लिए सरकारी योजनाओं एवं करियर अवसरों का डिजिटल खोज मंच।'
                : 'An AI-powered discovery and intelligence platform for Bihar government schemes and career opportunities.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'hi' ? '100% सत्यापित सरकारी स्रोत' : '100% Verified Govt Sources'}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {language === 'hi' ? 'प्रमुख अनुभाग' : 'Quick Navigation'}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/schemes" className="hover:text-white transition">
                  {language === 'hi' ? 'योजना डायरेक्टरी' : 'All Schemes Directory'}
                </Link>
              </li>
              <li>
                <Link to="/eligibility" className="hover:text-white transition">
                  {language === 'hi' ? 'पात्रता जांच कैलकुलेटर' : 'Eligibility Checker'}
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition">
                  {language === 'hi' ? 'करियर और स्किल ट्रेनिंग' : 'Careers & Skills'}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">
                  {language === 'hi' ? 'नागरिक डैशबोर्ड' : 'Citizen Dashboard'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Govt Portals */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {language === 'hi' ? 'आधिकारिक सरकारी पोर्टल' : 'Official Portals'}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://state.bihar.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
                  Bihar State Portal <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://serviceonline.bihar.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
                  ServicePlus / RTPS Bihar <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://dbtagriculture.bihar.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
                  DBT Agriculture Bihar <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://skillmissionbihar.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
                  Bihar Skill Mission (BSDM) <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://medhasoft.bih.nic.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
                  MedhaSoft Education Portal <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Mandatory Disclaimer */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 text-xs">
            <h4 className="text-amber-400 font-bold mb-1.5 flex items-center gap-1">
              ⚠️ {language === 'hi' ? 'महत्वपूर्ण अस्वीकरण' : 'Official Disclaimer'}
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-400">
              {language === 'hi'
                ? 'बिहार सहायक एक स्वतंत्र सूचना एवं खोज मंच है। यह किसी भी सरकारी विभाग का प्रतिस्थापन नहीं है। अंतिम पात्रता एवं योजना अनुमोदन संबंधित सरकारी विभाग का क्षेत्राधिकार है।'
                : 'Bihar Sahayak is an independent discovery and intelligence layer. It is not an official government authority. Final approvals and benefits remain under official Bihar Government departments.'}
            </p>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Bihar Sahayak (BSeva). Built for the citizens of Bihar.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Bihar 🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
