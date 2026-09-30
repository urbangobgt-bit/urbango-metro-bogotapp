import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Globe, Check } from 'lucide-react';
import { useI18n } from '../i18nContext';

export const LANGUAGES = [
  { code: 'ES', flag: '🇪🇸', label: 'ES', full: 'Español', native: 'Español' },
  { code: 'EN', flag: '🇺🇸', label: 'EN', full: 'English', native: 'English' },
  { code: 'PT', flag: '🇧🇷', label: 'PT', full: 'Português', native: 'Português' },
  { code: 'ZH', flag: '🇨🇳', label: 'ZH', full: '中文', native: '中文 (简体)' },
  { code: 'JA', flag: '🇯🇵', label: 'JA', full: '日本語', native: '日本語' }
];

/**
 * LanguageSelector Component
 * Manages active language through local state synchronized with the internationalization context.
 * Uses elevated z-index and anti-clipping positioning to guarantee proper display in tight or overflow-restricted headers.
 */
export default function LanguageSelector({ 
  variant = 'capsule', // 'capsule' | 'header' | 'sidebar' | 'auth' | 'default'
  direction = 'down',  // 'down' | 'up'
  isMobile = false,
  dark = false
}) {
  const { lang, setLang } = useI18n();

  // Local state to manage language selection and UI responsiveness
  const [selectedLang, setSelectedLang] = useState(() => {
    const initial = (lang || localStorage.getItem('user_language') || 'ES').toUpperCase();
    return LANGUAGES.some(l => l.code === initial) ? initial : 'ES';
  });

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync local state when external i18n context or localStorage changes
  useEffect(() => {
    if (lang) {
      const normalized = lang.toUpperCase();
      if (LANGUAGES.some(l => l.code === normalized) && normalized !== selectedLang) {
        setSelectedLang(normalized);
      }
    }
  }, [lang]);

  // Click outside and Escape key listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectLanguage = (code) => {
    setSelectedLang(code);
    if (typeof setLang === 'function') {
      setLang(code.toLowerCase());
    }
    setIsOpen(false);
  };

  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];

  // Button styling based on variant
  let buttonClasses = '';
  let dropdownClasses = '';

  if (variant === 'capsule' || variant === 'header') {
    buttonClasses = dark 
      ? 'bg-zinc-800/90 hover:bg-zinc-700/90 border-zinc-700 text-zinc-100 hover:text-white' 
      : 'bg-zinc-100 hover:bg-zinc-200/90 border-zinc-200 text-zinc-800 hover:text-zinc-900';
    buttonClasses += ' border rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs font-black shadow-sm transition-all active:scale-95';
    dropdownClasses = dark
      ? 'bg-zinc-900/98 border-zinc-700/80 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
      : 'bg-white/98 border-zinc-200 text-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)]';
    dropdownClasses += ' w-44 rounded-2xl p-1.5 border backdrop-blur-2xl';
  } else if (variant === 'sidebar') {
    buttonClasses = dark
      ? 'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all text-zinc-300 hover:text-white hover:bg-zinc-800'
      : 'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100';
    dropdownClasses = dark
      ? 'w-full bg-zinc-900 border-zinc-700 text-white shadow-2xl'
      : 'w-full bg-white border-zinc-200 text-zinc-900 shadow-2xl';
    dropdownClasses += ' rounded-2xl p-1.5 border backdrop-blur-2xl';
  } else if (variant === 'auth') {
    buttonClasses = 'bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm text-white rounded-xl px-3.5 py-2 flex items-center gap-2 transition-all shadow-lg backdrop-blur-md font-bold';
    dropdownClasses = 'w-48 bg-zinc-900/95 backdrop-blur-2xl border border-zinc-700/80 rounded-2xl p-1.5 shadow-2xl text-white';
  } else {
    buttonClasses = dark
      ? 'flex items-center gap-2 backdrop-blur-md bg-zinc-900/90 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white shadow-lg hover:bg-zinc-800 transition-all font-bold'
      : 'flex items-center gap-2 backdrop-blur-md bg-white/90 border border-zinc-200 rounded-xl px-3 py-1.5 text-xs text-zinc-800 shadow-md hover:bg-zinc-50 transition-all font-bold';
    dropdownClasses = dark
      ? 'min-w-[170px] bg-zinc-900/98 backdrop-blur-2xl border border-zinc-700 rounded-2xl p-1.5 shadow-2xl text-white'
      : 'min-w-[170px] bg-white/98 backdrop-blur-2xl border border-zinc-200 rounded-2xl p-1.5 shadow-2xl text-zinc-900';
  }

  const dropdownPosition = direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2';
  const ChevronIcon = isOpen 
    ? (direction === 'up' ? ChevronDown : ChevronUp) 
    : (direction === 'up' ? ChevronUp : ChevronDown);

  return (
    <div 
      className={`relative z-[150] ${isMobile ? 'flex justify-center my-3' : ''} ${variant === 'sidebar' ? 'w-full' : 'inline-block'}`} 
      ref={dropdownRef}
    >
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)} 
        className={buttonClasses}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title="Seleccionar idioma / Select language"
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          {variant === 'sidebar' && <Globe size={16} className={dark ? 'text-zinc-400' : 'text-zinc-500'} />}
          <span className="text-sm leading-none">{currentLang.flag}</span>
          <span className="tracking-wider uppercase font-black text-[11px] sm:text-xs">
            {variant === 'sidebar' ? currentLang.full : currentLang.label}
          </span>
        </div>
        <ChevronIcon size={13} className="opacity-70 shrink-0 ml-0.5" />
      </button>

      {isOpen && (
        <div 
          role="listbox"
          className={`absolute ${dropdownPosition} ${variant === 'sidebar' ? 'left-0 right-0' : 'right-0'} ${dropdownClasses} z-[9999] animate-in fade-in zoom-in-95 duration-200 flex flex-col`}
          style={{ transformOrigin: direction === 'up' ? 'bottom right' : 'top right' }}
        >
          <div className="px-2.5 py-1 mb-1 border-b border-zinc-200/40 dark:border-zinc-800/80 flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
              Idioma / Language
            </span>
            <Globe size={12} className="text-zinc-400" />
          </div>

          <div className="space-y-0.5">
            {LANGUAGES.map((l) => {
              const isSelected = selectedLang === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectLanguage(l.code)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all w-full text-left active:scale-98 ${
                    isSelected
                      ? 'bg-[#B30000]/10 text-[#B30000] dark:bg-[#B30000]/20 dark:text-red-400 font-black'
                      : dark
                        ? 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                        : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base leading-none shrink-0">{l.flag}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="truncate leading-tight">{l.full}</span>
                      <span className="text-[9px] font-normal text-zinc-400 leading-tight">{l.native}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <Check size={14} className="text-[#B30000] dark:text-red-400 shrink-0 ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
