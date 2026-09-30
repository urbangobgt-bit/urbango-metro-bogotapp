import { useState, useRef, useEffect } from 'react';
import { Eye, Check, RefreshCw, X, SlidersHorizontal, Type, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AccessibilityMenu({
  isLargeText,
  setIsLargeText,
  isHighContrast,
  setIsHighContrast,
  dark,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { updateConfiguracion } = useAuth();

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  const toggleLargeText = () => {
    const nextVal = !isLargeText;
    setIsLargeText(nextVal);
    localStorage.setItem('urbango_large_text', String(nextVal));
    updateConfiguracion?.({ large_text: nextVal });
  };

  const toggleHighContrast = () => {
    const nextVal = !isHighContrast;
    setIsHighContrast(nextVal);
    localStorage.setItem('urbango_high_contrast', String(nextVal));
    updateConfiguracion?.({ high_contrast: nextVal });
  };

  const resetAll = () => {
    setIsLargeText(false);
    setIsHighContrast(false);
    localStorage.setItem('urbango_large_text', 'false');
    localStorage.setItem('urbango_high_contrast', 'false');
    updateConfiguracion?.({ large_text: false, high_contrast: false });
  };

  const activeCount = (isLargeText ? 1 : 0) + (isHighContrast ? 1 : 0);

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Trigger Button in Top Bar */}
      <button
        id="accessibility-menu-btn"
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Opciones de accesibilidad"
        aria-expanded={isOpen}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border transition-all duration-200 active:scale-95 font-bold text-xs shadow-xs ${
          isHighContrast
            ? 'bg-black text-[#FFD600] border-[#FFD600] ring-2 ring-[#FFD600]'
            : activeCount > 0
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-400/60 ring-1 ring-amber-400/30'
            : dark
            ? 'bg-zinc-800/80 text-zinc-300 border-zinc-700/80 hover:bg-zinc-700 hover:text-white'
            : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900'
        }`}
      >
        <Eye size={16} className={isHighContrast ? 'text-[#FFD600]' : activeCount > 0 ? 'text-amber-500' : 'text-zinc-500 dark:text-zinc-400'} />
        <span className="hidden sm:inline font-black text-[11px] tracking-tight">Accesibilidad</span>
        {activeCount > 0 && (
          <span
            id="accessibility-badge"
            className="w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-black flex items-center justify-center -mr-0.5 shadow-xs"
          >
            {activeCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div
          id="accessibility-popover"
          className={`absolute right-0 mt-2 w-80 sm:w-88 rounded-[1.5rem] p-4 shadow-2xl border z-[400] transition-all animate-in fade-in zoom-in-95 duration-150 ${
            isHighContrast
              ? 'bg-black border-2 border-[#FFD600] text-white'
              : dark
              ? 'bg-zinc-900 border-zinc-700 text-white'
              : 'bg-white border-zinc-200 text-zinc-900'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${isHighContrast ? 'bg-[#FFD600] text-black' : 'bg-[#B30000] text-white'}`}>
                <Eye size={16} />
              </div>
              <div>
                <h4 className="font-black text-sm tracking-tight">Accesibilidad Visual</h4>
                <p className={`text-[10px] ${isHighContrast ? 'text-[#FFD600]' : dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Ajustes para mejorar tu experiencia
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors"
              aria-label="Cerrar menú de accesibilidad"
            >
              <X size={16} />
            </button>
          </div>

          {/* Controls List */}
          <div className="space-y-3">
            {/* 1. Texto Grande (+15%) */}
            <div
              className={`p-3 rounded-2xl border transition-all ${
                isLargeText
                  ? isHighContrast
                    ? 'bg-zinc-950 border-[#FFD600]'
                    : 'bg-red-50/60 dark:bg-red-950/20 border-red-300 dark:border-red-900/50'
                  : dark
                  ? 'bg-zinc-800/60 border-zinc-700/60'
                  : 'bg-zinc-50 border-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-xl mt-0.5 ${isLargeText ? 'bg-[#B30000] text-white' : dark ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-200 text-zinc-700'}`}>
                    <Type size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs">Texto Grande</span>
                      {isLargeText && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-[#B30000] text-white">
                          +15%
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] leading-snug mt-0.5 ${isHighContrast ? 'text-zinc-300' : dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Incrementa el tamaño de la fuente global en un 15% para facilitar la lectura.
                    </p>
                  </div>
                </div>

                {/* Switch Toggle */}
                <button
                  type="button"
                  id="toggle-large-text-switch"
                  role="switch"
                  aria-checked={isLargeText}
                  onClick={toggleLargeText}
                  className={`w-12 h-6.5 rounded-full relative transition-all shadow-inner border flex-shrink-0 cursor-pointer ${
                    isLargeText
                      ? isHighContrast ? 'bg-[#FFD600] border-[#FFD600]' : 'bg-[#B30000] border-[#B30000]'
                      : dark ? 'bg-zinc-700 border-zinc-600' : 'bg-zinc-300 border-zinc-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all ${
                      isLargeText
                        ? isHighContrast ? 'left-6 bg-black' : 'left-6 bg-white'
                        : 'left-0.5 bg-white'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 2. Alto Contraste (Fondo negro puro con textos amarillos/blancos) */}
            <div
              className={`p-3 rounded-2xl border transition-all ${
                isHighContrast
                  ? 'bg-zinc-950 border-2 border-[#FFD600]'
                  : dark
                  ? 'bg-zinc-800/60 border-zinc-700/60'
                  : 'bg-zinc-50 border-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-xl mt-0.5 ${isHighContrast ? 'bg-[#FFD600] text-black font-black' : dark ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-200 text-zinc-700'}`}>
                    <SlidersHorizontal size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-black text-xs ${isHighContrast ? 'text-[#FFD600]' : ''}`}>
                        Alto Contraste
                      </span>
                      {isHighContrast && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-[#FFD600] text-black">
                          Activo
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] leading-snug mt-0.5 ${isHighContrast ? 'text-white' : dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Fondo negro puro con textos amarillos y blancos de alta visibilidad.
                    </p>
                  </div>
                </div>

                {/* Switch Toggle */}
                <button
                  type="button"
                  id="toggle-high-contrast-switch"
                  role="switch"
                  aria-checked={isHighContrast}
                  onClick={toggleHighContrast}
                  className={`w-12 h-6.5 rounded-full relative transition-all shadow-inner border flex-shrink-0 cursor-pointer ${
                    isHighContrast
                      ? 'bg-[#FFD600] border-[#FFD600]'
                      : dark ? 'bg-zinc-700 border-zinc-600' : 'bg-zinc-300 border-zinc-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all ${
                      isHighContrast ? 'left-6 bg-black' : 'left-0.5 bg-white'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <button
              id="reset-accessibility-btn"
              onClick={resetAll}
              disabled={!isLargeText && !isHighContrast}
              className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-opacity ${
                isLargeText || isHighContrast
                  ? isHighContrast ? 'text-[#FFD600] hover:underline' : 'text-red-500 hover:underline'
                  : 'text-zinc-400 opacity-40 cursor-not-allowed'
              }`}
            >
              <RefreshCw size={11} />
              <span>Restablecer</span>
            </button>
            <span className={`text-[9px] font-bold ${isHighContrast ? 'text-zinc-400' : 'text-zinc-400'}`}>
              WCAG 2.1 AAA
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
