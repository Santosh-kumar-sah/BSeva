import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Printer, 
  ShieldCheck, 
  Building2, 
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DocumentItem {
  id: string;
  name_hi: string;
  name_en: string;
  category: 'IDENTITY' | 'INCOME_CASTE' | 'ACADEMIC' | 'BANKING';
  importance: 'MANDATORY' | 'CONDITIONAL';
  validityNotice_hi: string;
  validityNotice_en: string;
  howToGet_hi: string;
  howToGet_en: string;
  rtpsServiceUrl?: string;
}

const REQUIRED_DOCUMENTS: DocumentItem[] = [
  {
    id: 'residence_cert',
    name_hi: 'बिहार निवास / अधिवास प्रमाण पत्र (Residential Certificate)',
    name_en: 'Bihar Residence / Domicile Certificate',
    category: 'IDENTITY',
    importance: 'MANDATORY',
    validityNotice_hi: 'जीवनभर मान्य (यदि पता न बदला हो)। CO / Revenue Officer या SDO स्तर से निर्गत।',
    validityNotice_en: 'Valid lifetime unless address changed. Issued by RO/CO/SDO.',
    howToGet_hi: 'ServicePlus (RTPS Bihar) पोर्टल पर ऑनलाइन आवेदन करें। 10 से 14 कार्य दिवस में तैयार होता है।',
    howToGet_en: 'Apply online on RTPS Bihar (ServicePlus). Ready in 10-14 days.',
    rtpsServiceUrl: 'https://serviceonline.bihar.gov.in'
  },
  {
    id: 'income_cert',
    name_hi: 'आय प्रमाण पत्र (Income Certificate)',
    name_en: 'Family Income Certificate',
    category: 'INCOME_CASTE',
    importance: 'MANDATORY',
    validityNotice_hi: 'केवल 1 वर्ष के लिए वैध। स्कॉलरशिप व ईबीसी/ओबीसी लाभ हेतु आवश्यक।',
    validityNotice_en: 'Valid for 1 year from date of issue.',
    howToGet_hi: 'RTPS पोर्टल पर नया आय प्रमाण पत्र बनाएं। स्व-घोषित आय विवरण दर्ज करें।',
    howToGet_en: 'Apply on RTPS Bihar with self-declaration of family income.',
    rtpsServiceUrl: 'https://serviceonline.bihar.gov.in'
  },
  {
    id: 'caste_ncl_cert',
    name_hi: 'जाति / क्रीमीलेयर रहित प्रमाण पत्र (Caste / NCL Certificate)',
    name_en: 'Caste / Non-Creamy Layer (NCL) Certificate',
    category: 'INCOME_CASTE',
    importance: 'CONDITIONAL',
    validityNotice_hi: 'SC/ST हेतु स्थायी। OBC/EBC हेतु वित्तीय वर्ष का NCL प्रमाण पत्र मान्य।',
    validityNotice_en: 'Permanent for SC/ST. NCL certificate valid for financial year.',
    howToGet_hi: 'अंचल अधिकारी (CO) / राजस्व अधिकारी स्तर से RTPS पर ऑनलाइन बनवाएं।',
    howToGet_en: 'Apply online on ServicePlus under Revenue Officer / SDO level.',
    rtpsServiceUrl: 'https://serviceonline.bihar.gov.in'
  },
  {
    id: 'npci_bank_seeding',
    name_hi: 'आधार सीडेड बैंक खाता (Aadhaar Linked NPCI/DBT Bank Account)',
    name_en: 'Aadhaar-Seeded Active Bank Account (NPCI / DBT)',
    category: 'BANKING',
    importance: 'MANDATORY',
    validityNotice_hi: 'सरकारी अनुदान/छात्रवृत्ति केवल आधार-सीडेड बैंक खाते (DBT) में ही जमा होती है।',
    validityNotice_en: 'Mandatory for all direct benefit transfers (DBT).',
    howToGet_hi: 'अपनी बैंक शाखा में जाकर आधार लिंकिंग और NPCI मैपिंग फॉर्म जमा करें।',
    howToGet_en: 'Visit your bank branch and submit the NPCI DBT mandate form.',
    rtpsServiceUrl: 'https://myaadhaar.uidai.gov.in'
  },
  {
    id: 'academic_marksheets',
    name_hi: '10वीं / 12वीं / स्नातक अंकपत्र (Academic Marksheets)',
    name_en: '10th / 12th / Degree Marksheets & Passing Certificates',
    category: 'ACADEMIC',
    importance: 'MANDATORY',
    validityNotice_hi: 'मूल अंकपत्र या डिजीलॉकर (DigiLocker) सत्यापित प्रति मान्य।',
    validityNotice_en: 'Original marksheets or DigiLocker certified copies.',
    howToGet_hi: 'संबंधित बोर्ड (BSEB/CBSE) या कॉलेज अथवा DigiLocker से डाउनलोड करें।',
    howToGet_en: 'Obtain from your educational institution or DigiLocker.'
  },
  {
    id: 'college_bonafide',
    name_hi: 'कॉलेज बोनाफाइड व शुल्क रसीद (Bonafide Certificate & Fee Receipt)',
    name_en: 'College Bonafide Certificate & Current Fee Structure',
    category: 'ACADEMIC',
    importance: 'CONDITIONAL',
    validityNotice_hi: 'वर्तमान शैक्षणिक सत्र (Current Academic Year) के लिए वैध।',
    validityNotice_en: 'Valid for current academic session.',
    howToGet_hi: 'वर्तमान अध्ययनरत कॉलेज/विश्वविद्यालय के प्राचार्य/रजिस्ट्रार से प्राप्त करें।',
    howToGet_en: 'Get signed bonafide form from your college registrar/principal.'
  },
  {
    id: 'photo_signature',
    name_hi: 'पासपोर्ट साइज फोटो एवं हस्ताक्षर (Passport Photo & Signature)',
    name_en: 'Recent Passport Photo & Digital Signature',
    category: 'IDENTITY',
    importance: 'MANDATORY',
    validityNotice_hi: '3 महीने से कम पुराना फोटो (सफेद या हल्का बैकग्राउंड, 50KB से कम)।',
    validityNotice_en: 'Recent photo within 3 months, under 50KB.',
    howToGet_hi: 'स्पष्ट स्कैन कॉपी या मोबाइल से खींचकर कंप्रेस करें।',
    howToGet_en: 'Keep scanned digital copy ready.'
  }
];

export default function DocumentReadinessPage() {
  const { language } = useAuth();
  
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({
    residence_cert: true,
    academic_marksheets: true,
    photo_signature: true
  });

  const toggleDoc = (id: string) => {
    setCheckedDocs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalMandatory = REQUIRED_DOCUMENTS.length;
  const readyCount = Object.values(checkedDocs).filter(Boolean).length;
  const readinessPercent = Math.round((readyCount / totalMandatory) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand uppercase tracking-wider mb-1">
            <FileCheck className="w-4 h-4" strokeWidth={1.5} />
            <span>{language === 'hi' ? 'दस्तावेज सत्यापन तैयारी' : 'Document Readiness Audit'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text-primary tracking-tight">
            {language === 'hi' ? 'आवेदन पूर्व दस्तावेज चेकलिस्ट' : 'Pre-Application Document Auditor'}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {language === 'hi'
              ? 'सरकारी पोर्टल (ServicePlus, PMS, DBT) पर आवेदन से पूर्व सभी प्रमाण पत्रों की स्थिति जांचें।'
              : 'Audit certificate validity and bank DBT mapping to prevent application rejections.'}
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-3 py-1.5 bg-surface hover:bg-background text-text-primary border border-border rounded-lg text-xs font-medium flex items-center gap-1.5 self-start sm:self-center transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
          <span>{language === 'hi' ? 'प्रिंट / PDF' : 'Print / Save PDF'}</span>
        </button>
      </div>

      {/* Readiness Score Card */}
      <div className="bg-surface rounded-xl p-6 border border-border shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-success/10 text-success border border-success/20">
            <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>{readinessPercent >= 80 ? (language === 'hi' ? 'आवेदन हेतु तैयार' : 'Application Ready') : (language === 'hi' ? 'कुछ दस्तावेज शेष' : 'Action Required')}</span>
          </div>
          <h2 className="text-xl font-bold font-heading text-text-primary">
            {language === 'hi' ? `आपकी दस्तावेज तैयारी: ${readinessPercent}%` : `Your Document Readiness: ${readinessPercent}%`}
          </h2>
          <p className="text-xs text-text-secondary">
            {language === 'hi'
              ? `आपने ${totalMandatory} में से ${readyCount} आवश्यक दस्तावेज सत्यापित कर लिए हैं।`
              : `You have prepared ${readyCount} of ${totalMandatory} required certificates.`}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full md:w-64 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
            <span className="text-success">{readyCount} Ready</span>
            <span className="text-brand">{totalMandatory - readyCount} Pending</span>
          </div>
          <div className="w-full bg-background rounded-full h-2.5 overflow-hidden border border-border">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                readinessPercent >= 80 ? 'bg-success' : 'bg-brand'
              }`}
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Official RTPS Notice Banner */}
      <div className="bg-hero-bg border border-border rounded-xl p-4 flex items-start gap-3 text-xs text-text-primary">
        <Building2 className="w-4 h-4 text-brand shrink-0 mt-0.5" strokeWidth={1.5} />
        <div className="space-y-0.5 leading-relaxed">
          <span className="font-semibold block text-text-primary">
            {language === 'hi' ? 'बिहार लोक सेवाओं का अधिकार (RTPS Bihar):' : 'Bihar Right to Public Services (RTPS):'}
          </span>
          <p className="text-text-secondary">
            {language === 'hi'
              ? 'आय, जाति, और निवास प्रमाण पत्र सीधे बिहार सरकार के आधिकारिक पोर्टल '
              : 'Income, Caste, and Domicile certificates are issued digitally on '}
            <a href="https://serviceonline.bihar.gov.in" target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline inline-flex items-center gap-0.5">
              ServicePlus Bihar <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
            </a>
            {language === 'hi' ? ' पर निःशुल्क ऑनलाइन बनाए जाते हैं।' : ' free of charge with QR verification.'}
          </p>
        </div>
      </div>

      {/* Interactive Document Checklist */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold font-heading text-text-primary">
          {language === 'hi' ? 'दस्तावेजों की विस्तृत सूची' : 'Document Audit Checklist'}
        </h2>

        <div className="space-y-2.5">
          {REQUIRED_DOCUMENTS.map((doc) => {
            const isChecked = !!checkedDocs[doc.id];
            return (
              <div
                key={doc.id}
                className={`p-4 rounded-xl border transition-colors shadow-card ${
                  isChecked
                    ? 'bg-surface border-success/30'
                    : 'bg-surface border-border hover:border-brand/40'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => toggleDoc(doc.id)}
                    className="flex items-start gap-3 text-left flex-1 cursor-pointer"
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isChecked
                        ? 'bg-success border-success text-white'
                        : 'border-border bg-background hover:border-brand'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`text-sm font-semibold ${isChecked ? 'text-text-primary line-through opacity-75' : 'text-text-primary'}`}>
                          {language === 'hi' ? doc.name_hi : doc.name_en}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                          doc.importance === 'MANDATORY' 
                            ? 'bg-brand/10 text-brand border border-brand/20' 
                            : 'bg-background text-text-secondary border border-border'
                        }`}>
                          {doc.importance}
                        </span>
                      </div>

                      <p className="text-xs text-text-secondary mt-1">
                        <span className="font-medium">{language === 'hi' ? doc.validityNotice_hi : doc.validityNotice_en}</span>
                      </p>

                      <p className="text-xs text-text-secondary/80 mt-0.5">
                        <span className="italic">{language === 'hi' ? doc.howToGet_hi : doc.howToGet_en}</span>
                      </p>
                    </div>
                  </button>

                  {doc.rtpsServiceUrl && (
                    <a
                      href={doc.rtpsServiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-background hover:bg-hero-bg text-brand rounded-lg text-xs font-medium shrink-0 flex items-center gap-1 border border-border transition-colors"
                    >
                      <span>{language === 'hi' ? 'आवेदन करें' : 'Apply'}</span>
                      <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Step Action Card */}
      <div className="bg-surface rounded-xl p-6 border border-border shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold font-heading text-text-primary">
            {language === 'hi' ? 'दस्तावेज तैयार हैं? अपनी पात्रता जांचें' : 'All Documents Ready?'}
          </h3>
          <p className="text-xs text-text-secondary">
            {language === 'hi'
              ? 'अब अपनी योग्यता अनुसार उपयुक्त योजनाओं का चयन करें और सीधे आधिकारिक पोर्टल पर आवेदन करें।'
              : 'Proceed to find matched schemes and complete your online application.'}
          </p>
        </div>

        <Link
          to="/eligibility"
          className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium text-xs shadow-sm transition-colors shrink-0 flex items-center gap-1.5"
        >
          <span>{language === 'hi' ? 'पात्रता जांचें' : 'Check Eligibility'}</span>
          <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
        </Link>
      </div>

    </div>
  );
}
