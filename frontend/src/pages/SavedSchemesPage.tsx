import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSavedSchemes, ApplicationStatus } from '../context/SavedSchemesContext';
import { useAuth } from '../context/AuthContext';
import { 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  FileText, 
  Printer, 
  Trash2, 
  Search, 
  ArrowRight,
  Edit2,
  Check,
  ShieldCheck
} from 'lucide-react';

export default function SavedSchemesPage() {
  const { language } = useAuth();
  const { savedItems, removeScheme, updateStatus, updateNotes } = useSavedSchemes();
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempRefNum, setTempRefNum] = useState<string>('');
  const [tempNotes, setTempNotes] = useState<string>('');

  const statusConfigs: Record<ApplicationStatus, { label_hi: string; label_en: string; color: string; icon: any }> = {
    BOOKMARKED: {
      label_hi: 'सेव किया',
      label_en: 'Shortlisted',
      color: 'bg-background text-text-secondary border-border',
      icon: Bookmark
    },
    PREPARING_DOCS: {
      label_hi: 'दस्तावेज तैयारी',
      label_en: 'Preparing Docs',
      color: 'bg-accent-gold/20 text-[#855B17] border-accent-gold/40',
      icon: Clock
    },
    APPLIED: {
      label_hi: 'आवेदन किया',
      label_en: 'Applied',
      color: 'bg-brand/10 text-brand border-brand/30',
      icon: CheckCircle2
    },
    APPROVED: {
      label_hi: 'स्वीकृत / लाभ प्राप्त',
      label_en: 'Approved',
      color: 'bg-success/15 text-success border-success/30',
      icon: ShieldCheck
    }
  };

  const filteredItems = savedItems.filter((item) => {
    if (activeTab === 'ALL') return true;
    return item.status === activeTab;
  });

  const handleStartEdit = (schemeId: string, currentRef: string = '', currentNotes: string = '') => {
    setEditingId(schemeId);
    setTempRefNum(currentRef);
    setTempNotes(currentNotes);
  };

  const handleSaveEdit = (schemeId: string) => {
    updateNotes(schemeId, tempNotes, tempRefNum);
    setEditingId(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand/10 border border-brand/20 text-xs font-bold text-brand">
            <Bookmark className="w-3.5 h-3.5" strokeWidth={2} />
            <span>{language === 'hi' ? 'आवेदन व योजना ट्रैकर' : 'Application & Scheme Tracker'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight">
            {language === 'hi' ? 'मेरी सुरक्षित सरकारी योजनाएं' : 'My Saved Schemes & Applications'}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-2xl font-medium">
            {language === 'hi'
              ? 'अपनी पसंदीदा योजनाओं को ट्रैक करें, आधिकारिक आवेदन संदर्भ संख्या दर्ज करें, और स्थिति मॉनिटर करें।'
              : 'Track your shortlisted schemes, store official application reference numbers, and monitor progress.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {savedItems.length > 0 && (
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white hover:bg-background text-text-primary rounded-lg text-xs font-semibold border border-border transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-brand" strokeWidth={2} />
              <span>{language === 'hi' ? 'प्रिंट सारांश' : 'Print Summary'}</span>
            </button>
          )}
          <Link
            to="/schemes"
            className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Search className="w-4 h-4" strokeWidth={2} />
            <span>{language === 'hi' ? 'और योजनाएं खोजें' : 'Browse Schemes'}</span>
          </Link>
        </div>
      </div>

      {/* Tabs & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-2 border cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-brand text-white border-brand shadow-xs'
                : 'bg-white text-text-secondary hover:bg-background hover:text-text-primary border-border'
            }`}
          >
            <span>{language === 'hi' ? 'सभी' : 'All'}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'ALL' ? 'bg-white/20 text-white' : 'bg-background text-text-secondary'}`}>
              {savedItems.length}
            </span>
          </button>

          {(Object.keys(statusConfigs) as ApplicationStatus[]).map((status) => {
            const config = statusConfigs[status];
            const count = savedItems.filter((i) => i.status === status).length;
            const Icon = config.icon;
            return (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-2 border cursor-pointer ${
                  activeTab === status
                    ? 'bg-brand text-white border-brand shadow-xs'
                    : 'bg-white text-text-secondary hover:bg-background hover:text-text-primary border-border'
                }`}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                <span>{language === 'hi' ? config.label_hi : config.label_en}</span>
                {count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeTab === status ? 'bg-white/20 text-white' : 'bg-background text-text-secondary'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-text-secondary font-semibold">
          {language === 'hi' ? `कुल ${filteredItems.length} योजनाएं प्रदर्शित` : `Showing ${filteredItems.length} schemes`}
        </div>
      </div>

      {/* Schemes List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center max-w-xl mx-auto space-y-4 shadow-card">
          <div className="w-12 h-12 rounded-full bg-hero-bg text-brand flex items-center justify-center mx-auto border border-brand/20">
            <Bookmark className="w-6 h-6" strokeWidth={2} />
          </div>
          <h3 className="text-base font-bold font-heading text-text-primary">
            {language === 'hi' ? 'कोई योजना सुरक्षित नहीं है' : 'No Saved Schemes in this View'}
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            {language === 'hi'
              ? 'योजना सूची या पात्रता जांच में जाकर किसी भी योजना पर बुकमार्क आइकन दबाकर यहां सुरक्षित करें।'
              : 'Explore the schemes catalog or run an eligibility check and click the bookmark icon to start tracking.'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              to="/eligibility"
              className="px-4 py-2 border-2 border-brand text-brand hover:bg-brand/10 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 bg-white shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
              <span>{language === 'hi' ? 'पात्रता जांचें' : 'Check Eligibility'}</span>
            </Link>
            <Link
              to="/schemes"
              className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
            >
              <span>{language === 'hi' ? 'योजनाएं देखें' : 'Explore Catalog'}</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const { scheme, status, applicationRefNumber, notes } = item;
            const config = statusConfigs[status];
            const isEditing = editingId === scheme.id;

            return (
              <div
                key={scheme.id}
                className="bg-white rounded-xl border border-border p-5 shadow-card hover:shadow-cardHover hover:border-brand/40 transition-all space-y-4"
              >
                {/* Top Row: Title, Badges, Delete */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-background text-text-secondary border border-border">
                        {scheme.department?.name_hi || scheme.department?.name_en || 'बिहार सरकार'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-gold/15 text-[#855B17] border border-accent-gold/30">
                        {scheme.category?.name_hi || scheme.category?.name_en || 'सामान्य'}
                      </span>
                    </div>

                    <Link
                      to={`/schemes/${scheme.slug}`}
                      className="text-base sm:text-lg font-bold font-heading text-text-primary hover:text-brand transition-colors block"
                    >
                      {language === 'hi' && scheme.title_hi ? scheme.title_hi : scheme.title_en}
                    </Link>

                    <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                      {language === 'hi' && scheme.description_hi ? scheme.description_hi : scheme.description_en}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    {/* Status Dropdown */}
                    <select
                      value={status}
                      onChange={(e) => updateStatus(scheme.id, e.target.value as ApplicationStatus)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand transition-colors ${config.color}`}
                    >
                      <option value="BOOKMARKED">
                        {language === 'hi' ? '📌 सेव किया' : '📌 Shortlisted'}
                      </option>
                      <option value="PREPARING_DOCS">
                        {language === 'hi' ? '📄 दस्तावेज तैयारी' : '📄 Preparing Docs'}
                      </option>
                      <option value="APPLIED">
                        {language === 'hi' ? '🚀 आवेदन किया' : '🚀 Applied'}
                      </option>
                      <option value="APPROVED">
                        {language === 'hi' ? '✅ स्वीकृत / लाभ प्राप्त' : '✅ Approved'}
                      </option>
                    </select>

                    <button
                      onClick={() => removeScheme(scheme.id)}
                      title={language === 'hi' ? 'हटाएं' : 'Remove'}
                      className="p-1.5 text-text-secondary hover:text-brand hover:bg-background rounded-lg border border-transparent hover:border-border transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>

                {/* Application Reference & Notes Section */}
                <div className="bg-hero-bg/70 rounded-lg p-3.5 border border-border space-y-3">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-text-primary mb-1">
                            {language === 'hi' ? 'आवेदन संदर्भ संख्या' : 'Application Reference No.'}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. RTPS/2026/102934"
                            value={tempRefNum}
                            onChange={(e) => setTempRefNum(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-border text-xs text-text-primary focus:ring-1 focus:ring-brand focus:outline-none font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-text-primary mb-1">
                            {language === 'hi' ? 'निजी टिप्पणी' : 'Private Notes'}
                          </label>
                          <input
                            type="text"
                            placeholder={language === 'hi' ? 'उदा. वसुधा केंद्र पर फॉर्म जमा किया' : 'e.g. Submitted at block office'}
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-border text-xs text-text-primary focus:ring-1 focus:ring-brand focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-white hover:bg-background text-text-secondary border border-border rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                        </button>
                        <button
                          onClick={() => handleSaveEdit(scheme.id)}
                          className="px-3.5 py-1 bg-brand hover:bg-brand-dark text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" strokeWidth={2} />
                          <span>{language === 'hi' ? 'सहेजें' : 'Save'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-4">
                        <div>
                          <span className="text-text-secondary font-medium">
                            {language === 'hi' ? 'आवेदन संदर्भ: ' : 'Ref No: '}
                          </span>
                          <span className="font-extrabold text-brand">
                            {applicationRefNumber || (
                              <span className="text-text-secondary/70 italic font-normal">
                                {language === 'hi' ? 'दर्ज नहीं है' : 'Not added'}
                              </span>
                            )}
                          </span>
                        </div>
                        {notes && (
                          <div>
                            <span className="text-text-secondary font-medium">
                              {language === 'hi' ? 'टिप्पणी: ' : 'Note: '}
                            </span>
                            <span className="text-text-primary font-semibold">{notes}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleStartEdit(scheme.id, applicationRefNumber, notes)}
                        className="text-xs font-bold text-brand hover:text-brand-dark flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" strokeWidth={2} />
                        <span>{language === 'hi' ? 'संपादित करें' : 'Edit Details'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Bottom Action Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-3">
                    <Link
                      to="/documents"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-brand transition-colors"
                    >
                      <FileText className="w-4 h-4 text-brand" strokeWidth={1.75} />
                      <span>{language === 'hi' ? 'आवश्यक दस्तावेज' : 'Required Documents'}</span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/schemes/${scheme.slug}`}
                      className="px-3.5 py-1.5 bg-white hover:bg-background text-text-primary border border-border rounded-lg text-xs font-bold transition-colors shadow-xs"
                    >
                      {language === 'hi' ? 'पूर्ण विवरण' : 'Details'}
                    </Link>

                    <a
                      href={scheme.official_portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-brand hover:bg-brand-dark text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>{language === 'hi' ? 'सरकारी पोर्टल' : 'Official Portal'}</span>
                      <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
