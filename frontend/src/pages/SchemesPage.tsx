import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  BookOpen, 
  RefreshCw,
  X,
  SlidersHorizontal,
  ChevronDown,
  Building2
} from 'lucide-react';
import { schemeService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SchemeCard from '../components/common/SchemeCard';
import { Scheme, SchemeCategory, Department } from '../types';

export default function SchemesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useAuth();

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [categories, setCategories] = useState<SchemeCategory[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [selectedDepartment, setSelectedDepartment] = useState<string>(searchParams.get('department') || '');

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, deptRes] = await Promise.all([
          schemeService.getCategories(),
          schemeService.getDepartments()
        ]);
        if (catRes.success) setCategories(catRes.categories);
        if (deptRes.success) setDepartments(deptRes.departments);
      } catch (err) {
        console.error('Error fetching scheme metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (searchQuery) params.q = searchQuery;
        if (selectedCategory) params.category = selectedCategory;
        if (selectedDepartment) params.department = selectedDepartment;

        const res = await schemeService.getSchemes(params);
        if (res.success) {
          setSchemes(res.schemes);
        }
      } catch (err) {
        console.error('Error loading schemes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [searchQuery, selectedCategory, selectedDepartment]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedDepartment('');
    setSearchParams({});
  };

  const hasActiveFilters = !!(searchQuery || selectedCategory || selectedDepartment);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" strokeWidth={2} />
            <span>{language === 'hi' ? 'बिहार सरकारी योजना निर्देशिका' : 'Bihar Govt Scheme Directory'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight">
            {language === 'hi' ? 'सभी सरकारी कल्याणकारी योजनाएं' : 'Explore All Government Schemes'}
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {language === 'hi'
              ? 'प्रत्येक योजना की पात्रता, वित्तीय लाभ, आवेदन प्रक्रिया एवं आवश्यक दस्तावेजों की आधिकारिक जानकारी।'
              : 'Browse verified schemes across Bihar departments with official rules, benefits, and direct portal links.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3.5 py-2 bg-white hover:bg-background border border-border text-text-primary rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand" strokeWidth={2} />
            <span>{language === 'hi' ? 'फ़िल्टर' : 'Filter Schemes'}</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-brand"></span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-border shadow-card p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Keyword Search Input */}
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              placeholder={language === 'hi' ? 'योजना का नाम या कीवर्ड खोजें...' : 'Search by scheme name, keywords...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-background border border-border rounded-lg text-xs sm:text-sm font-medium text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
            />
            <Search className="w-4 h-4 text-brand absolute left-3 top-3" strokeWidth={2} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-3 text-text-secondary hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Department Select */}
          <div className="sm:col-span-3">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full py-2.5 px-3 bg-background border border-border rounded-lg text-xs font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand cursor-pointer"
            >
              <option value="">{language === 'hi' ? 'सभी विभाग' : 'All Departments'}</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.code}>
                  {language === 'hi' ? dept.name_hi : dept.name_en}
                </option>
              ))}
            </select>
          </div>

          {/* Category Select */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-3 bg-background border border-border rounded-lg text-xs font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand cursor-pointer"
            >
              <option value="">{language === 'hi' ? 'सभी श्रेणियां' : 'All Categories'}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {language === 'hi' && cat.name_hi ? cat.name_hi : cat.name_en}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-border/70">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors border cursor-pointer ${
              selectedCategory === ''
                ? 'bg-brand text-white border-brand shadow-xs'
                : 'bg-background text-text-secondary border-border hover:border-brand/40'
            }`}
          >
            {language === 'hi' ? 'सभी' : 'All'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors border cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-brand text-white border-brand shadow-xs'
                  : 'bg-background text-text-secondary border-border hover:border-brand/40'
              }`}
            >
              {language === 'hi' && cat.name_hi ? cat.name_hi : cat.name_en}
            </button>
          ))}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-brand hover:underline ml-auto pl-3 whitespace-nowrap"
            >
              {language === 'hi' ? 'फ़िल्टर हटाएं ✕' : 'Clear All ✕'}
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-text-secondary font-semibold">
        <span>
          {language === 'hi' ? `कुल ${schemes.length} योजनाएं उपलब्ध` : `Showing ${schemes.length} schemes`}
        </span>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-xl border border-border p-6 h-64 animate-pulse space-y-4 shadow-card">
              <div className="h-4 bg-background rounded w-1/3"></div>
              <div className="h-6 bg-background rounded w-3/4"></div>
              <div className="h-16 bg-background rounded"></div>
            </div>
          ))}
        </div>
      ) : schemes.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center max-w-md mx-auto space-y-3 shadow-card">
          <div className="w-12 h-12 rounded-lg bg-hero-bg text-brand flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <h3 className="text-base font-bold text-text-primary">
            {language === 'hi' ? 'कोई योजना नहीं मिली' : 'No Schemes Found'}
          </h3>
          <p className="text-xs text-text-secondary">
            {language === 'hi' ? 'कृपया अन्य कीवर्ड या फ़िल्टर का चयन करें।' : 'Try adjusting your search criteria or clear active filters.'}
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-brand text-white rounded-lg text-xs font-bold shadow-sm"
          >
            {language === 'hi' ? 'फ़िल्टर हटाएं' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}

    </div>
  );
}
