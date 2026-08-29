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
  Sparkles,
  Edit2,
  Check,
  Building2,
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
      color: 'bg-slate-100 text-slate-700 border-slate-300',
      icon: Bookmark
    },
    PREPARING_DOCS: {
      label_hi: 'दस्तावेज तैयारी',
      label_en: 'Preparing Docs',
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: Clock
    },
    APPLIED: {
      label_hi: 'आवेदन किया',
      label_en: 'Applied on Portal',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: CheckCircle2
    },
    APPROVED: {
      label_hi: 'स्वीकृत / लाभ प्राप्त',
      label_en: 'Approved / Sanctioned',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-xs font-bold text-orange-300">
            <Bookmark className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'आवेदन व योजना ट्रैकर' : 'Application & Scheme Tracker'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {language === 'hi' ? 'मेरी सुरक्षित सरकारी योजनाएं' : 'My Saved Schemes & Applications'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            {language === 'hi'
              ? 'अपनी पसंदीदा योजनाओं को ट्रैक करें, आवेदन संख्या (Application Ref No.) दर्ज करें, और दस्तावेज तैयार रखें।'
              : 'Track your shortlisted schemes, store official application reference numbers, and monitor progress.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedItems.length > 0 && (
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 backdrop-blur transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'hi' ? 'प्रिंट सारांश' : 'Print Summary'}</span>
            </button>
          )}
          <Link
            to="/schemes"
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>{language === 'hi' ? 'और योजनाएं खोजें' : 'Browse More'}</span>
          </Link>
        </div>
      </div>

      {/* Tabs & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'ALL'
                ? 'bg-slate-900 text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{language === 'hi' ? 'सभी' : 'All'}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-700 text-white">
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === status
                    ? 'bg-orange-600 text-white shadow'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? config.label_hi : config.label_en}</span>
                {count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    activeTab === status ? 'bg-orange-800 text-white' : 'bg-slate-200 text-slate-800'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          {language === 'hi' ? `कुल ${filteredItems.length} योजनाएं प्रदर्शित` : `Showing ${filteredItems.length} schemes`}
        </div>
      </div>

      {/* Schemes List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            {language === 'hi' ? 'कोई योजना सुरक्षित नहीं है' : 'No Saved Schemes in this View'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {language === 'hi'
              ? 'योजना सूची या पात्रता जांच में जाकर किसी भी योजना पर बुकमार्क आइकन दबाकर यहां सुरक्षित करें।'
              : 'Explore the schemes catalog or run an eligibility check and click the bookmark icon to start tracking.'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              to="/eligibility"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'hi' ? 'पात्रता जांचें' : 'Check Eligibility'}</span>
            </Link>
            <Link
              to="/schemes"
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-extrabold shadow transition flex items-center gap-1.5"
            >
              <span>{language === 'hi' ? 'योजनाएं देखें' : 'Explore Catalog'}</span>
              <ArrowRight className="w-4 h-4" />
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
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition space-y-4"
              >
                {/* Top Row: Title, Badges, Delete */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {scheme.department?.name_hi || scheme.department?.name_en || 'बिहार सरकार'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                        {scheme.category?.name_hi || scheme.category?.name_en || 'सामान्य'}
                      </span>
                    </div>

                    <Link
                      to={`/schemes/${scheme.slug}`}
                      className="text-base sm:text-lg font-black text-slate-900 hover:text-orange-600 transition block"
                    >
                      {language === 'hi' && scheme.title_hi ? scheme.title_hi : scheme.title_en}
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {language === 'hi' && scheme.description_hi ? scheme.description_hi : scheme.description_en}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    {/* Status Dropdown */}
                    <select
                      value={status}
                      onChange={(e) => updateStatus(scheme.id, e.target.value as ApplicationStatus)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${config.color}`}
                    >
                      <option value="BOOKMARKED">
                        {language === 'hi' ? '📌 सेव किया' : '📌 Shortlisted'}
                      </option>
                      <option value="PREPARING_DOCS">
                        {language === 'hi' ? '📄 दस्तावेज तैयारी' : '📄 Preparing Docs'}
                      </option>
                      <option value="APPLIED">
                        {language === 'hi' ? '🚀 आवेदन कर दिया' : '🚀 Applied'}
                      </option>
                      <option value="APPROVED">
                        {language === 'hi' ? '✅ स्वीकृत / लाभ प्राप्त' : '✅ Approved'}
                      </option>
                    </select>

                    <button
                      onClick={() => removeScheme(scheme.id)}
                      title={language === 'hi' ? 'हटाएं' : 'Remove'}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Application Reference & Notes Section */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70 space-y-3">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {language === 'hi' ? 'आवेदन संख्या / Reference No.' : 'Application Reference No.'}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. RTPS/2026/102934"
                            value={tempRefNum}
                            onChange={(e) => setTempRefNum(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {language === 'hi' ? 'निजी टिप्पणी / Notes' : 'Private Notes'}
                          </label>
                          <input
                            type="text"
                            placeholder={language === 'hi' ? 'उदा. वसुधा केंद्र पर फॉर्म जमा किया' : 'e.g. Submitted at block office on 28th'}
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
                        >
                          {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                        </button>
                        <button
                          onClick={() => handleSaveEdit(scheme.id)}
                          className="px-4 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{language === 'hi' ? 'सुरक्षित करें' : 'Save'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-4">
                        <div>
                          <span className="text-slate-500 font-medium">
                            {language === 'hi' ? 'आवेदन संदर्भ: ' : 'Ref No: '}
                          </span>
                          <span className="font-bold text-slate-800">
                            {applicationRefNumber || (
                              <span className="text-slate-400 italic">
                                {language === 'hi' ? 'दर्ज नहीं है' : 'Not added'}
                              </span>
                            )}
                          </span>
                        </div>
                        {notes && (
                          <div>
                            <span className="text-slate-500 font-medium">
                              {language === 'hi' ? 'टिप्पणी: ' : 'Note: '}
                            </span>
                            <span className="text-slate-700 font-medium">{notes}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleStartEdit(scheme.id, applicationRefNumber, notes)}
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 self-start sm:self-auto"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
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
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-orange-600 transition"
                    >
                      <FileText className="w-4 h-4 text-orange-500" />
                      <span>{language === 'hi' ? 'दस्तावेज चेकलिस्ट देखें' : 'Required Documents'}</span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/schemes/${scheme.slug}`}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
                    >
                      {language === 'hi' ? 'पूर्ण विवरण' : 'Details'}
                    </Link>

                    <a
                      href={scheme.official_portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                    >
                      <span>{language === 'hi' ? 'सरकारी पोर्टल पर जाएं' : 'Official Portal'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
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
