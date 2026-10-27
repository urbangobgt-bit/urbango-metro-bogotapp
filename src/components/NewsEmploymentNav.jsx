import React from 'react';
import { Newspaper, Briefcase } from 'lucide-react';
import { useI18n } from '../i18nContext';

/**
 * Barra superior de navegación dual para Noticias e Hitos vs Empleo y Convocatorias.
 * Estilo oficial UrbanGo: Rojo Oscuro (#800020) y Crema (#FFF8E7).
 */
export const NewsEmploymentNav = ({
  activeTab = 'noticias',
  onTabChange,
  dark = false
}) => {
  const { t } = useI18n();

  return (
    <div className="w-full mb-6">
      <div
        className={`w-full p-1.5 sm:p-2 rounded-2xl border shadow-sm backdrop-blur-md flex items-center justify-between gap-2 sm:gap-4 transition-colors ${
          dark
            ? 'bg-zinc-900/90 border-zinc-800 text-zinc-100'
            : 'bg-[#FFFDF9]/95 border-[#800020]/20 text-[#800020] shadow-[#800020]/5'
        }`}
      >
        {/* Selector de pestañas dual */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 flex-1 max-w-2xl">
          {/* Pestaña: Noticias e Hitos */}
          <button
            type="button"
            onClick={() => onTabChange && onTabChange('noticias')}
            className={`flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 active:scale-[0.98] ${
              activeTab === 'noticias'
                ? 'bg-[#800020] text-[#FFF8E7] shadow-md shadow-red-950/25 border border-[#800020]'
                : dark
                  ? 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent'
                  : 'bg-[#FFF8E7]/70 text-[#800020] hover:bg-[#800020]/10 border border-[#800020]/15'
            }`}
          >
            <Newspaper size={17} className={activeTab === 'noticias' ? 'text-[#FFF8E7]' : dark ? 'text-zinc-400' : 'text-[#800020]'} />
            <span className="truncate">📰 {t('newsNav.newsTab', 'Noticias e Hitos')}</span>
          </button>

          {/* Pestaña: Empleo y Convocatorias */}
          <button
            type="button"
            onClick={() => onTabChange && onTabChange('empleo')}
            className={`flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 active:scale-[0.98] ${
              activeTab === 'empleo'
                ? 'bg-[#800020] text-[#FFF8E7] shadow-md shadow-red-950/25 border border-[#800020]'
                : dark
                  ? 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent'
                  : 'bg-[#FFF8E7]/70 text-[#800020] hover:bg-[#800020]/10 border border-[#800020]/15'
            }`}
          >
            <Briefcase size={17} className={activeTab === 'empleo' ? 'text-[#FFF8E7]' : dark ? 'text-zinc-400' : 'text-[#800020]'} />
            <span className="truncate">💼 {t('newsNav.jobsTab', 'Empleo y Convocatorias')}</span>
          </button>
        </div>

        {/* Indicador institucional secundario */}
        <div className="hidden lg:flex items-center gap-2 pr-3 text-right">
          <div className="flex flex-col items-end">
            <span className="text-[9.5px] font-black uppercase tracking-widest text-[#800020] dark:text-red-400">
              {t('newsNav.line1Title', 'Línea 1 Metro Bogotá')}
            </span>
            <span className={`text-[10px] font-semibold ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {t('newsNav.embChannel', 'Canal Oficial EMB')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsEmploymentNav;
