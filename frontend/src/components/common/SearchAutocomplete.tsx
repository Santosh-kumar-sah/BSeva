import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, BookOpen, Compass, X } from 'lucide-react';
import { schemeService } from '../../services/api';
import { Scheme, SchemeCategory } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface SearchAutocompleteProps {
  onSelect?: (scheme: Scheme) => void;
  placeholder?: string;
  variant?: 'hero' | 'navbar' | 'standard';
  showButton?: boolean;
}

export default function SearchAutocomplete({
  onSelect,
  placeholder,
  variant = 'standard',
  showButton = true
}: SearchAutocompleteProps) {
  const { language } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Scheme[]>([]);
  const [categories, setCategories] = useState<SchemeCategory[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await schemeService.getCategories();
        if (res.success) setCategories(res.categories);
      } catch (e) {
        console.error('Error fetching categories:', e);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setLoading(true);
        try {
          const res = await schemeService.getSchemes({
            q: query,
            category: selectedCategory || undefined,
            limit: 5
          });
          if (res.success) {
            setSuggestions(res.schemes);
            setIsOpen(true);
          }
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [query, selectedCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    navigate(`/schemes?q=${encodeURIComponent(query.trim())}${selectedCategory ? `&category=${selectedCategory}` : ''}`);
  };

  const handleSelectScheme = (scheme: Scheme) => {
    setIsOpen(false);
    setQuery('');
    if (onSelect) {
      onSelect(scheme);
    } else {
      navigate(`/schemes/${scheme.slug}`);
    }
  };

  const defaultPlaceholder = language === 'hi' 
    ? 'योजना का नाम, छात्रवृत्ति, या कीवर्ड खोजें...' 
    : 'Search scheme, scholarship, agriculture loan...';

  const isHero = variant === 'hero';

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
            placeholder={placeholder || defaultPlaceholder}
            className={`w-full bg-white border border-border text-text-primary placeholder:text-text-secondary/70 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand shadow-card ${
              isHero 
                ? 'py-3.5 pl-11 pr-10 text-sm sm:text-base font-medium' 
                : 'py-2 pl-9 pr-8 text-xs sm:text-sm font-medium'
            }`}
          />
          <Search 
            className={`text-brand absolute left-3.5 pointer-events-none ${isHero ? 'w-5 h-5' : 'w-4 h-4'}`} 
            strokeWidth={2} 
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 p-1 rounded-full text-text-secondary hover:text-text-primary hover:bg-background"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          )}
        </div>

        {showButton && (
          <button
            type="submit"
            className={`ml-2 bg-brand hover:bg-brand-dark text-white font-semibold rounded-lg transition-colors flex items-center justify-center shrink-0 shadow-sm cursor-pointer ${
              isHero ? 'px-6 py-3.5 text-sm sm:text-base' : 'px-4 py-2 text-xs sm:text-sm'
            }`}
          >
            <span>{language === 'hi' ? 'खोजें' : 'Search'}</span>
          </button>
        )}
      </form>

      {/* Suggestion Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl border border-border shadow-cardHover overflow-hidden z-40 text-left animate-in fade-in-50 duration-150">
          <div className="p-2 border-b border-border bg-hero-bg/50 flex items-center justify-between text-xs font-semibold text-text-secondary">
            <span>{language === 'hi' ? 'सुझाव' : 'Suggested Schemes'}</span>
            <span>{suggestions.length} {language === 'hi' ? 'परिणाम' : 'results'}</span>
          </div>

          <div className="divide-y divide-border/60 max-h-80 overflow-y-auto">
            {suggestions.map((scheme) => (
              <button
                key={scheme.id}
                type="button"
                onClick={() => handleSelectScheme(scheme)}
                className="w-full text-left p-3 hover:bg-hero-bg/40 transition-colors flex items-start gap-3 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-text-primary group-hover:text-brand transition-colors truncate">
                      {language === 'hi' && scheme.title_hi ? scheme.title_hi : scheme.title_en}
                    </h4>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-accent-gold/15 text-[#855B17] shrink-0 border border-accent-gold/30">
                      {scheme.category?.name_hi || scheme.category?.name_en || 'General'}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary truncate mt-0.5">
                    {scheme.department?.name_hi || scheme.department?.name_en}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-brand group-hover:translate-x-0.5 transition-all shrink-0 mt-2" strokeWidth={2} />
              </button>
            ))}
          </div>

          <div className="p-2.5 bg-background border-t border-border text-center">
            <button
              type="button"
              onClick={handleSubmit}
              className="text-xs font-bold text-brand hover:text-brand-dark transition-colors inline-flex items-center gap-1"
            >
              <span>{language === 'hi' ? `"${query}" के सभी परिणाम देखें` : `View all results for "${query}"`}</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
