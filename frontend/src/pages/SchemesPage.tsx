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
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">
          <BookOpen className="w-4 h-4" />
          <span>{language === 'hi' ? 'सत्यापित योजना डायरेक्टरी' : 'Verified Schemes Directory'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          {language === 'hi' ? 'बिहार सरकार की सभी योजनाएं' : 'Explore Bihar Govt Schemes'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {language === 'hi'
            ? 'शिक्षा, छात्रवृत्ति, कृषि, रोजगार, और महिला सशक्तिकरण की सत्यापित सरकारी योजनाएं।'
            : 'Explore verified official schemes across education, agriculture, employment, and social welfare.'}
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder={language === 'hi' ? 'योजना का नाम, कीवर्ड या लाभ खोजें... जैसे Student Credit Card' : 'Search by scheme name, keyword, or benefit... e.g. Student Credit Card'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-full"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === ''
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {language === 'hi' ? 'सभी श्रेणियां' : 'All Categories'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat.slug
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'hi' && cat.name_hi ? cat.name_hi : cat.name_en}
            </button>
          ))}
        </div>

        {/* Department Filter & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="inline-flex items-center gap-1 text-slate-500 hover:text-orange-600 font-semibold"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{language === 'hi' ? 'फ़िल्टर हटाएं' : 'Reset Filters'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-bold text-slate-700">
          {language === 'hi' ? `कुल ${schemes.length} योजनाएं उपलब्ध` : `Showing ${schemes.length} verified schemes`}
        </span>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200 p-6 h-64 animate-pulse space-y-4">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-6 bg-slate-200 rounded w-3/4"></div>
              <div className="h-16 bg-slate-100 rounded"></div>
            </div>
          ))}
        </div>
      ) : schemes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {language === 'hi' ? 'कोई योजना नहीं मिली' : 'No schemes match your criteria'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'hi'
              ? 'कृपया अपने खोज शब्दों या फ़िल्टर को बदलकर पुनः प्रयास करें।'
              : 'Try clearing your search terms or selecting a different category.'}
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl"
          >
            {language === 'hi' ? 'सभी योजनाएं देखें' : 'View All Schemes'}
          </button>
        </div>
      )}
    </div>
  );
}
