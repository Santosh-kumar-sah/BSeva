import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, ArrowRight, BookOpen, X } from 'lucide-react';
import { schemeService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Scheme } from '../../types';

interface SearchAutocompleteProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  showButton?: boolean;
  onSelect?: () => void;
  variant?: 'hero' | 'navbar' | 'standard';
}

export default function SearchAutocomplete({
  placeholder,
  className = '',
  inputClassName = '',
  buttonClassName = '',
  showButton = true,
  onSelect,
  variant = 'hero'
}: SearchAutocompleteProps) {
  const { language } = useAuth();
  const navigate = useNavigate();
  
  const [query, setQuery] = useState<string>('');
  const [allSchemes, setAllSchemes] = useState<Scheme[]>([]);
  const [suggestions, setSuggestions] = useState<Scheme[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Popular quick tags
  const popularKeywords = language === 'hi' 
    ? ['स्टूडेंट क्रेडिट कार्ड', 'कन्या उत्थान', 'कृषि यंत्रीकरण', 'कुशल युवा कार्यक्रम (KYP)', 'पोस्ट मैट्रिक छात्रवृत्ति']
    : ['Student Credit Card', 'Kanya Utthan', 'Krishi Yantra Subsidy', 'Kushal Yuva (KYP)', 'Post Matric Scholarship'];

  useEffect(() => {
    // Load all active schemes for instant zero-latency client search
    const loadSchemes = async () => {
      try {
        const res = await schemeService.getSchemes({ limit: 100 });
        if (res.success && res.schemes) {
          setAllSchemes(res.schemes);
        }
      } catch (err) {
        console.error('Failed to load schemes for search autocomplete', err);
      }
    };
    loadSchemes();
  }, []);

  // Filter suggestions on query change
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }

    const matches = allSchemes.filter((s) => {
      const titleEn = s.title_en.toLowerCase();
      const titleHi = (s.title_hi || '').toLowerCase();
      const descEn = s.description_en.toLowerCase();
      const descHi = (s.description_hi || '').toLowerCase();
      const dept = (s.department?.name_en || '').toLowerCase();
      const cat = (s.category?.name_en || '').toLowerCase();

      return (
        titleEn.includes(trimmed) ||
        titleHi.includes(trimmed) ||
        descEn.includes(trimmed) ||
        descHi.includes(trimmed) ||
        dept.includes(trimmed) ||
        cat.includes(trimmed)
      );
    });

    setSuggestions(matches.slice(0, 5));
    setSelectedIndex(-1);
  }, [query, allSchemes]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectScheme = (slug: string) => {
    navigate(`/schemes/${slug}`);
    setIsOpen(false);
    setQuery('');
    if (onSelect) onSelect();
  };

  const handleSelectKeyword = (keyword: string) => {
    setQuery(keyword);
    navigate(`/schemes?search=${encodeURIComponent(keyword)}`);
    setIsOpen(false);
    if (onSelect) onSelect();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelectScheme(suggestions[selectedIndex].slug);
    } else if (query.trim()) {
      navigate(`/schemes?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      if (onSelect) onSelect();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const defaultPlaceholder = language === 'hi' 
    ? 'योजना खोजें... जैसे Student Credit Card, कन्या उत्थान, कृषि यंत्र' 
    : 'Search schemes... e.g. Student Credit Card, Kanya Utthan, Krishi';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || defaultPlaceholder}
          autoComplete="off"
          spellCheck={false}
          className={`w-full text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none transition ${
            variant === 'hero'
              ? 'pl-12 pr-28 py-3.5 rounded-2xl shadow-xl border border-slate-200 text-sm sm:text-base font-semibold focus:ring-2 focus:ring-orange-500'
              : variant === 'navbar'
              ? 'pl-9 pr-8 py-2 rounded-full border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-orange-500 shadow-sm'
              : 'pl-11 pr-24 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-orange-500 shadow-sm'
          } ${inputClassName}`}
        />

        {/* Left Search Icon */}
        <Search
          className={`text-slate-400 absolute pointer-events-none ${
            variant === 'hero' ? 'w-5 h-5 left-4' : variant === 'navbar' ? 'w-4 h-4 left-3' : 'w-4.5 h-4.5 left-3.5'
          }`}
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className={`text-slate-400 hover:text-slate-600 p-1 rounded-full absolute ${
              showButton ? 'right-24' : 'right-3'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Submit Button */}
        {showButton && (
          <button
            type="submit"
            className={`absolute right-2 px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-xs rounded-xl shadow-md transition ${buttonClassName}`}
          >
            {language === 'hi' ? 'खोजें' : 'Search'}
          </button>
        )}
      </form>

      {/* Suggestions & Popular Searches Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-in fade-in-50 duration-150 text-left">
          
          {/* Matched Suggestions */}
          {suggestions.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-1.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-orange-500" />
                <span>{language === 'hi' ? 'सुझाई गई योजनाएं' : 'Matched Schemes'}</span>
              </div>

              {suggestions.map((scheme, idx) => (
                <button
                  key={scheme.id}
                  type="button"
                  onClick={() => handleSelectScheme(scheme.slug)}
                  className={`w-full px-4 py-2.5 text-left flex items-center justify-between gap-3 hover:bg-orange-50/80 transition group ${
                    selectedIndex === idx ? 'bg-orange-50/90' : ''
                  }`}
                >
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-orange-600 transition truncate">
                        {language === 'hi' && scheme.title_hi ? scheme.title_hi : scheme.title_en}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="truncate">
                        {scheme.department?.name_hi && language === 'hi' ? scheme.department.name_hi : scheme.department?.name_en}
                      </span>
                      <span>•</span>
                      <span className="text-orange-600 font-semibold">
                        {scheme.category?.name_hi && language === 'hi' ? scheme.category.name_hi : scheme.category?.name_en}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-orange-600 group-hover:translate-x-0.5 transition shrink-0" />
                </button>
              ))}

              <div className="pt-2 px-4 pb-2 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {language === 'hi' ? `सभी परिणामों के लिए Enter दबाएं` : `Press Enter to view all results`}
                </span>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <span>{language === 'hi' ? 'सभी खोजें' : 'View all'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : query.trim() ? (
            <div className="p-4 text-center space-y-2">
              <p className="text-xs text-slate-600">
                {language === 'hi' ? `"${query}" के लिए कोई त्वरित सुझाव नहीं मिला।` : `No direct title matches for "${query}".`}
              </p>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-1.5 bg-orange-600 text-white rounded-xl text-xs font-bold shadow hover:bg-orange-700 transition"
              >
                {language === 'hi' ? 'पूर्ण डायरेक्टरी में खोजें →' : 'Search Entire Catalog →'}
              </button>
            </div>
          ) : (
            /* Popular Searches when query is empty */
            <div className="p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>{language === 'hi' ? 'सर्वाधिक खोजी जाने वाली योजनाएं' : 'Popular Searches in Bihar'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularKeywords.map((kw, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectKeyword(kw)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-slate-200/80 text-xs font-semibold text-slate-700 transition flex items-center gap-1.5"
                  >
                    <Search className="w-3 h-3 text-slate-400" />
                    <span>{kw}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
