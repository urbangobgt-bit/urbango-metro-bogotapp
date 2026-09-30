import { useState } from 'react';
import { X, ShieldCheck, Bell, BellOff, Globe, Eye, Type, SlidersHorizontal } from 'lucide-react';
import { useI18n } from '../i18nContext';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '../context/AuthContext';
import { RenderUserAvatar } from './ProfileAvatarSelector';

export default function SettingsModal({
  isOpen,
  onClose,
  dark,
  user,
  onNavigate,
  onReportIncident,
  onGoLanding,
  isLargeText,
  setIsLargeText,
  isHighContrast,
  setIsHighContrast,
}) {
  const { t } = useI18n();
  const { updateConfiguracion } = useAuth();
  const [trafficNotifs, setTrafficNotifs] = useState(true);

  if (!isOpen) return null;

  const localidad = user?.localidad || '—';
  const transporte = user?.transporte || '—';

  const toggleLargeText = () => {
    const nextVal = !isLargeText;
    setIsLargeText?.(nextVal);
    localStorage.setItem('urbango_large_text', String(nextVal));
    updateConfiguracion?.({ large_text: nextVal });
  };

  const toggleHighContrast = () => {
    const nextVal = !isHighContrast;
    setIsHighContrast?.(nextVal);
    localStorage.setItem('urbango_high_contrast', String(nextVal));
    updateConfiguracion?.({ high_contrast: nextVal });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[300] bg-zinc-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className={`fixed top-0 right-0 bottom-0 z-[310] w-full sm:w-84 max-w-[92vw] sm:max-w-sm shadow-2xl flex flex-col animate-in slide-in-from-right-8 duration-300 transition-colors overflow-x-hidden pb-24 md:pb-4 ${
        isHighContrast
          ? 'bg-black text-white border-l-2 border-[#FFD600]'
          : dark
          ? 'bg-zinc-900 border-l border-zinc-800'
          : 'bg-white border-l border-zinc-200'
      }`}>

        {/* Header */}
        <div className={`flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b flex-shrink-0 ${
          isHighContrast ? 'border-[#FFD600]' : dark ? 'border-zinc-800' : 'border-zinc-100'
        }`}>
          <h2 className={`font-black text-lg sm:text-xl italic tracking-tight truncate ${
            isHighContrast ? 'text-[#FFD600]' : dark ? 'text-white' : 'text-zinc-900'
          }`}>
            ⚙️ {t('settings_title')}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar ajustes"
            className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 transition-all ${
              isHighContrast
                ? 'text-[#FFD600] hover:bg-[#FFD600]/20'
                : dark
                ? 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scroll px-4 sm:px-5 py-4 space-y-4 sm:space-y-5">

          {/* Perfil del usuario */}
          <section className="w-full">
            <p className={`text-[9px] font-black uppercase tracking-widest mb-2.5 ${
              isHighContrast ? 'text-[#FFD600]' : dark ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              {t('settings_profile')}
            </p>
            <div className={`rounded-2xl p-3.5 sm:p-4 border ${
              isHighContrast
                ? 'bg-zinc-950 border-[#FFD600]'
                : dark
                ? 'bg-zinc-800 border-zinc-700'
                : 'bg-zinc-50 border-zinc-200'
            }`}>
              <div className="flex items-center gap-3 mb-3 min-w-0">
                <div className={`w-10 h-10 rounded-full border-2 border-[#B30000] flex items-center justify-center flex-shrink-0 overflow-hidden ${dark ? 'bg-zinc-700' : 'bg-zinc-100'}`}>
                  <RenderUserAvatar avatar={user?.avatar_url || user?.avatar} size={36} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`font-black text-sm truncate ${isHighContrast ? 'text-[#FFD600]' : dark ? 'text-white' : 'text-zinc-900'}`}>{user?.full_name || user?.name || 'Ciudadano'}</p>
                  <p className={`text-[9px] font-bold uppercase tracking-widest truncate ${isHighContrast ? 'text-white' : dark ? 'text-zinc-500' : 'text-zinc-400'}`}>Metro de Bogotá · L1</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className={`p-2.5 sm:p-3 rounded-xl min-w-0 ${dark ? 'bg-zinc-700/50' : 'bg-white border border-zinc-200'}`}>
                  <p className={`text-[8px] font-black uppercase tracking-widest mb-0.5 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>{t('settings_localidad')}</p>
                  <p className={`text-xs font-black truncate ${dark ? 'text-zinc-200' : 'text-zinc-800'}`}>{localidad}</p>
                </div>
                <div className={`p-2.5 sm:p-3 rounded-xl min-w-0 ${dark ? 'bg-zinc-700/50' : 'bg-white border border-zinc-200'}`}>
                  <p className={`text-[8px] font-black uppercase tracking-widest mb-0.5 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>{t('settings_transporte')}</p>
                  <p className={`text-xs font-black truncate ${dark ? 'text-zinc-200' : 'text-zinc-800'}`}>{transporte}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Accesibilidad (Requisito 2: Menú de Accesibilidad en ajustes) */}
          <section className="w-full space-y-2">
            <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${
              isHighContrast ? 'text-[#FFD600]' : dark ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              <Eye size={12} className="inline mr-1" />
              Accesibilidad Visual
            </p>

            {/* Texto Grande */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
              isHighContrast ? 'bg-zinc-950 border-[#FFD600]' : dark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <Type size={18} className={isLargeText ? 'text-[#B30000]' : 'text-zinc-400'} />
                <div className="min-w-0">
                  <p className="font-black text-xs">Texto Grande</p>
                  <p className={`text-[9px] ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>+15% tamaño de fuente</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isLargeText}
                onClick={toggleLargeText}
                className={`w-11 h-6 rounded-full relative transition-all shadow-inner border flex-shrink-0 ${
                  isLargeText
                    ? isHighContrast ? 'bg-[#FFD600] border-[#FFD600]' : 'bg-[#B30000] border-[#B30000]'
                    : dark ? 'bg-zinc-700 border-zinc-600' : 'bg-zinc-200 border-zinc-300'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full shadow transition-all ${
                  isLargeText ? (isHighContrast ? 'left-5 sm:left-5.5 bg-black' : 'left-5 sm:left-5.5 bg-white') : 'left-0.5 bg-white'
                }`} />
              </button>
            </div>

            {/* Alto Contraste */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
              isHighContrast ? 'bg-zinc-950 border-2 border-[#FFD600]' : dark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <SlidersHorizontal size={18} className={isHighContrast ? 'text-[#FFD600]' : 'text-zinc-400'} />
                <div className="min-w-0">
                  <p className={`font-black text-xs ${isHighContrast ? 'text-[#FFD600]' : ''}`}>Alto Contraste</p>
                  <p className={`text-[9px] ${isHighContrast ? 'text-zinc-300' : dark ? 'text-zinc-400' : 'text-zinc-500'}`}>Fondo negro / Textos amarillos</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isHighContrast}
                onClick={toggleHighContrast}
                className={`w-11 h-6 rounded-full relative transition-all shadow-inner border flex-shrink-0 ${
                  isHighContrast ? 'bg-[#FFD600] border-[#FFD600]' : dark ? 'bg-zinc-700 border-zinc-600' : 'bg-zinc-200 border-zinc-300'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full shadow transition-all ${
                  isHighContrast ? 'left-5 sm:left-5.5 bg-black' : 'left-0.5 bg-white'
                }`} />
              </button>
            </div>
          </section>

          {/* Accesos Rápidos */}
          <section className="w-full space-y-2">
            <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {t('settings_quick_access') || 'Accesos Rápidos'}
            </p>
            <button
              onClick={() => { onNavigate('saldo'); onClose(); }}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border font-bold text-xs transition-all active:scale-95 ${dark ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:border-[#B30000]/60' : 'bg-zinc-50 border-zinc-200 text-zinc-900 hover:border-[#B30000]/40 hover:bg-red-50'}`}
            >
              <span className="text-base">💳</span>
              <span className="truncate">Saldo y Recarga Tullave / Metro</span>
            </button>
            <button
              onClick={() => { onClose(); onGoLanding?.(); }}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border font-bold text-xs transition-all active:scale-95 ${dark ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:border-[#C8102E]/60' : 'bg-zinc-50 border-zinc-200 text-zinc-900 hover:border-[#C8102E]/40 hover:bg-red-50'}`}
            >
              <span className="text-base">🚆</span>
              <span className="truncate">Ver Presentación 3D del Metro (Landing)</span>
            </button>
            <button
              onClick={() => { onClose(); onReportIncident?.(); }}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border font-bold text-xs transition-all active:scale-95 ${dark ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:border-amber-500/60' : 'bg-zinc-50 border-zinc-200 text-zinc-900 hover:border-amber-500/40 hover:bg-amber-50'}`}
            >
              <span className="text-base">⚠️</span>
              <span className="truncate">Reportar Incidencia Vial</span>
            </button>
            <button
              onClick={() => { onNavigate('transparencia'); onClose(); }}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border font-bold text-xs transition-all active:scale-95 ${dark ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:border-[#2D8B3C]/60' : 'bg-zinc-50 border-zinc-200 text-zinc-900 hover:border-[#2D8B3C]/40 hover:bg-green-50'}`}
            >
              <ShieldCheck size={16} className="text-[#2D8B3C] flex-shrink-0" />
              <span className="truncate">{t('settings_transparency')}</span>
            </button>
          </section>

          {/* Notificaciones de tráfico */}
          <section className="w-full">
            <p className={`text-[9px] font-black uppercase tracking-widest mb-2.5 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {t('settings_notifications')}
            </p>
            <div className={`rounded-2xl p-3.5 sm:p-4 border ${dark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  {trafficNotifs
                    ? <Bell size={18} className="text-[#B30000] flex-shrink-0" />
                    : <BellOff size={18} className={`flex-shrink-0 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                  }
                  <div className="min-w-0 flex-1">
                    <p className={`font-black text-xs sm:text-sm truncate ${dark ? 'text-white' : 'text-zinc-900'}`}>{t('settings_notif_toggle')}</p>
                    <p className={`text-[9px] font-bold ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>{trafficNotifs ? 'Activadas' : 'Desactivadas'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTrafficNotifs(v => !v)}
                  aria-label="Alternar notificaciones"
                  className={`w-11 h-6 rounded-full relative transition-all shadow-inner border flex-shrink-0 ${trafficNotifs ? 'bg-[#B30000] border-[#B30000]' : dark ? 'bg-zinc-700 border-zinc-600' : 'bg-zinc-200 border-zinc-300'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${trafficNotifs ? 'left-5 sm:left-5.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Selector de idioma */}
          <section className="w-full">
            <p className={`text-[9px] font-black uppercase tracking-widest mb-2.5 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              <Globe size={11} className="inline mr-1" />
              {t('settings_language')}
            </p>
            <div className={`rounded-2xl p-2.5 sm:p-3 border ${dark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
              <LanguageSelector variant="sidebar" direction="up" dark={dark} />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className={`px-4 sm:px-5 py-3 sm:py-4 border-t flex-shrink-0 ${dark ? 'border-zinc-800' : 'border-zinc-100'}`}>
          <p className={`text-[8px] font-black uppercase tracking-widest text-center ${dark ? 'text-zinc-600' : 'text-zinc-400'}`}>
            UrbanGo · Metro de Bogotá · © 2026
          </p>
        </div>
      </div>
    </>
  );
}
