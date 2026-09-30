import React from 'react';
import { X, Construction, CheckCircle2 } from 'lucide-react';
import ProjectStatus from './ProjectStatus';
import { useI18n } from '../i18nContext';

export default function ProjectStatusModal({
  isOpen = false,
  onClose,
  dark = false
}) {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[280] flex items-center justify-center p-2 sm:p-5 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        onClick={e => e.stopPropagation()}
        className={`w-full max-w-5xl max-h-[92vh] flex flex-col rounded-[2rem] border shadow-2xl overflow-hidden popup-in ${
          dark ? 'bg-zinc-900 border-zinc-700/80 text-white' : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Cabecera del Modal Estilo UI Moderna */}
        <div className={`px-5 py-4 border-b flex items-center justify-between flex-shrink-0 ${
          dark ? 'bg-zinc-950/90 border-zinc-800' : 'bg-zinc-50/90 border-zinc-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center flex-shrink-0">
              <Construction size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg tracking-tight leading-tight">
                  {t('projectStatus.modalTitle', 'Estado de Avance de Obra')}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t('projectStatus.officialEmb', '82.33% Oficial EMB')}
                </span>
              </div>
              <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {t('projectStatus.subtitle', 'Primera Línea del Metro de Bogotá · 23.9 km · 16 Estaciones')}
              </p>
            </div>
          </div>

          {/* Botón claro para cerrar */}
          <button 
            onClick={onClose}
            aria-label="Cerrar modal de estado de obra"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              dark 
                ? 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700' 
                : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'
            }`}
            title="Cerrar (X)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Contenedor desplazable con contenido oficial de Estado de Obra */}
        <div className="flex-1 overflow-y-auto no-scroll p-4 sm:p-6">
          <ProjectStatus dark={dark} />
        </div>
      </div>
    </div>
  );
}
