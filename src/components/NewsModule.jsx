import React from 'react';
import { 
  Building2, 
  Layers, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle2, 
  Train, 
  Calendar,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useI18n } from '../i18nContext';
import NewsEmploymentNav from './NewsEmploymentNav';
import NewsFeed from './NewsFeed';

/**
 * Módulo Independiente: "Noticias e Hitos"
 * Muestra exclusivamente noticias oficiales, avances del viaducto (82,33%),
 * boletines institucionales y comunicados de avance de obra.
 */
export const NewsModule = ({
  dark = false,
  onNavigate,
  onShowDetail,
  saved = [],
  onSave,
  onShare
}) => {
  const { t } = useI18n();

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── BARRA DE PESTAÑAS DUAL EN LA CABECERA (Top Sub-Nav Bar) ── */}
      <NewsEmploymentNav 
        activeTab="noticias" 
        onTabChange={(tab) => {
          if (onNavigate) onNavigate(tab);
        }} 
        dark={dark} 
      />

      {/* ── BANNER DESTACADO: AVANCE DEL VIADUCTO (82,33%) & HITOS OFICIALES ── */}
      <div 
        className={`w-full p-5 sm:p-6 rounded-[2rem] border relative overflow-hidden transition-all shadow-sm ${
          dark 
            ? 'bg-gradient-to-br from-red-950/40 via-zinc-900 to-zinc-950 border-red-900/40 text-white' 
            : 'bg-gradient-to-br from-[#FFFDF9] via-[#FFF5E6] to-[#FEE2E2] border-[#800020]/25 text-zinc-900'
        }`}
      >
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020] text-[#FFF8E7] text-[10px] font-black uppercase tracking-wider shadow-sm">
              <Sparkles size={12} />
              <span>{t('newsBanner.officialProgressBadge', 'AVANCE FÍSICO OFICIAL EMB')}</span>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {t('newsBanner.consolidatedCutOff', 'CORTE CONSOLIDADO 2026')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <h1 className={`text-2xl sm:text-3xl font-black italic tracking-tight leading-tight ${dark ? 'text-white' : 'text-[#800020]'}`}>
                {t('newsBanner.title', 'Avance General del Viaducto alcanza el 82,33%')}
              </h1>
              <p className={`text-xs sm:text-sm font-medium leading-relaxed ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                {t('newsBanner.desc', 'Con 6 vigas lanzadoras activas en los frentes de Bosa, Primero de Mayo y la Avenida Caracas, la instalación de dovelas prefabricadas avanza en tiempo récord. En el Patio Taller de Bosa, los trenes automáticos 1 y 2 continúan sus pruebas técnicas de rodaje sobre vía.')}
              </p>

              {/* Indicadores rápidos de hitos */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                <div className={`p-2.5 rounded-xl border ${dark ? 'bg-zinc-800/80 border-zinc-700/60' : 'bg-white/80 border-[#800020]/15'}`}>
                  <span className={`text-[8.5px] font-black uppercase block ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {t('newsBanner.gantriesLabel', 'VIGAS LANZADORAS')}
                  </span>
                  <span className="text-sm font-black text-[#800020] dark:text-red-400">
                    {t('newsBanner.gantriesValue', '6 Activas')}
                  </span>
                </div>
                <div className={`p-2.5 rounded-xl border ${dark ? 'bg-zinc-800/80 border-zinc-700/60' : 'bg-white/80 border-[#800020]/15'}`}>
                  <span className={`text-[8.5px] font-black uppercase block ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {t('newsBanner.yardLabel', 'PATIO TALLER BOSA')}
                  </span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {t('newsBanner.yardValue', '91% Ejecutado')}
                  </span>
                </div>
                <div className={`p-2.5 rounded-xl border col-span-2 sm:col-span-1 ${dark ? 'bg-zinc-800/80 border-zinc-700/60' : 'bg-white/80 border-[#800020]/15'}`}>
                  <span className={`text-[8.5px] font-black uppercase block ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {t('newsBanner.interchangeLabel', 'INTERCAMBIADOR CLL 72')}
                  </span>
                  <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                    {t('newsBanner.interchangeValue', '93% Culminado')}
                  </span>
                </div>
              </div>
            </div>

            {/* Barra de progreso visual circular / radial */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke={dark ? '#3f3f46' : '#e4e4e7'} strokeWidth="10" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="42" 
                    fill="none" 
                    stroke="#B30000" 
                    strokeWidth="10" 
                    strokeDasharray="264" 
                    strokeDashoffset={264 - (264 * 82.33) / 100} 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black tracking-tight text-[#800020] dark:text-white">82,33%</span>
                  <span className={`text-[7.5px] font-black uppercase tracking-widest ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{t('newsBanner.viaductL1', 'VIADUCTO L1')}</span>
                </div>
              </div>
              <p className={`text-[9px] font-bold text-center mt-2 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {t('newsBanner.stationsFootnote', '16 Estaciones · 23.9 km Viaducto')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── FEED OFICIAL DE NOTICIAS, FILTROS Y BÚSQUEDA ── */}
      <div className="w-full">
        <NewsFeed 
          dark={dark} 
          onShowDetail={onShowDetail} 
          saved={saved} 
          onSave={onSave} 
          onShare={onShare} 
        />
      </div>

      {/* ── BOLETINES OFICIALES Y COMUNICADOS INSTITUCIONALES ── */}
      <div 
        className={`w-full p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          dark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-[#FFFDF9] border-[#800020]/20 text-zinc-700'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#800020]/10 text-[#800020] dark:text-red-400 flex items-center justify-center shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-[#800020] dark:text-white">
              Boletines de Prensa y Comunicados Oficiales EMB
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Información periódica auditada por la interventoría y la banca multilateral (BID, CAF, Banco Mundial).
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            type="button"
            onClick={() => onNavigate && onNavigate('transparencia')}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-black transition-all ${
              dark 
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700' 
                : 'bg-white hover:bg-amber-50 text-[#800020] border border-[#800020]/30 shadow-xs'
            }`}
          >
            Módulo de Transparencia ➔
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsModule;
