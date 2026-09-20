import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RefreshCw, BookOpen, Building2, X } from 'lucide-react';
import { schemeService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SchemeCard from '../components/common/SchemeCard';
import { Scheme, SchemeCategory, Department } from '../types';

export default function SchemesPage() {
  const { language } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [categories, setCategories] = useState<SchemeCategory[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [selectedDept, setSelectedDept] = useState<string>(searchParams.get('department') || '');

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, deptRes] = await Promise.all([
          schemeService.getCategories(),
          schemeService.getDepartments()
        ]);
        if (catRes.success) setCategories(catRes.categories);
        if (deptRes.success) setDepartments(deptRes.departments);
      } catch (e) {
        console.error('Error fetching scheme filters:', e);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory) params.category = selectedCategory;
        if (selectedDept) params.department = selectedDept;

        const res = await schemeService.getSchemes(params);
        if (res.success) {
          setSchemes(res.schemes);
        }
      } catch (e) {
        console.error('Error fetching schemes:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [searchTerm, selectedCategory, selectedDept]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDept('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-wider">
          <BookOpen className="w-4 h-4" strokeWidth={1.5} />
          <span>{language === 'hi' ? 'सत्यापित योजना डायरेक्टरी' : 'Verified Schemes Directory'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
          {language === 'hi' ? 'बिहार सरकार की सभी योजनाएं' : 'Explore Bihar Govt Schemes'}
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          {language === 'hi'
            ? 'शिक्षा, छात्रवृत्ति, कृषि, रोजगार, और महिला सशक्तिकरण की सत्यापित सरकारी योजनाएं।'
            : 'Explore verified official schemes across education, agriculture, employment, and social welfare.'}
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-surface p-6 rounded-xl border border-border shadow-card space-y-4">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder={language === 'hi' ? 'योजना का नाम, कीवर्ड या लाभ खोजें... जैसे Student Credit Card' : 'Search by scheme name, keyword, or benefit... e.g. Student Credit Card'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-surface transition-all"
          />
          <Search className="w-4 h-4 text-text-secondary absolute left-3.5 pointer-events-none" strokeWidth={1.5} />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 p-1 text-text-secondary hover:text-text-primary rounded-full cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === ''
                ? 'bg-brand text-white shadow-sm'
                : 'bg-background hover:bg-border text-text-secondary hover:text-text-primary border border-border'
            }`}
          >
            {language === 'hi' ? 'सभी श्रेणियां' : 'All Categories'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-background hover:bg-border text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              {language === 'hi' && cat.name_hi ? cat.name_hi : cat.name_en}
            </button>
          ))}
        </div>

        {/* Department Filter & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border text-xs">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            >
              <option value="">{language === 'hi' ? 'सभी विभाग (All Departments)' : 'All Departments'}</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.code}>
                  {language === 'hi' ? dept.name_hi : dept.name_en}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || selectedCategory || selectedDept) && (
            <button
              onClick={handleResetFilters}
              className="border border-brand text-brand hover:bg-brand/5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>{language === 'hi' ? 'फ़िल्टर हटाएं' : 'Reset Filters'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin text-brand" strokeWidth={1.5} />
          <p className="text-xs text-text-secondary font-medium">
            {language === 'hi' ? 'योजनाएं लोड हो रही हैं...' : 'Loading verified schemes...'}
          </p>
        </div>
      ) : schemes.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>
              {language === 'hi' ? `कुल ${schemes.length} योजनाएं उपलब्ध` : `Showing ${schemes.length} schemes`}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-surface p-12 rounded-xl border border-border text-center space-y-4">
          <div className="w-12 h-12 rounded-lg bg-hero-bg text-brand flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-semibold text-text-primary">
            {language === 'hi' ? 'कोई योजना नहीं मिली' : 'No Schemes Found'}
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            {language === 'hi'
              ? 'आपके खोजे गए फ़िल्टर के अनुसार कोई परिणाम नहीं मिला। कृपया अन्य शब्द या श्रेणी चुनें।'
              : 'No schemes match your selected search criteria. Try clearing some filters.'}
          </p>
          <button
            onClick={handleResetFilters}
            className="border border-brand text-brand hover:bg-brand/5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'सभी फ़िल्टर साफ़ करें' : 'Clear All Filters'}
          </button>
        </div>
      )}
    </div>
  );
}
