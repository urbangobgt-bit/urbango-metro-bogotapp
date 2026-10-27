import React, { useState } from 'react';
import { 
  Briefcase, 
  ShieldCheck, 
  GraduationCap, 
  AlertCircle, 
  CheckCircle2, 
  Train, 
  Wrench, 
  Radio, 
  Building2, 
  ExternalLink,
  Users
} from 'lucide-react';
import { useI18n } from '../i18nContext';
import NewsEmploymentNav from './NewsEmploymentNav';
import PortalEmpleoView from './PortalEmpleoView';

/**
 * Módulo Independiente: "Empleo y Convocatorias"
 * Muestra exclusivamente las convocatorias laborales del SENA / Metro Línea 1 S.A.S.,
 * perfiles operativos requeridos (Conductores GoA4, Mantenimiento, Señalización CBTC)
 * y el formulario/enlace de postulación 100% gratuita.
 */
export const EmploymentModule = ({
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
        activeTab="empleo" 
        onTabChange={(tab) => {
          if (onNavigate) onNavigate(tab);
        }} 
        dark={dark} 
      />

      {/* ── BANNER OFICIAL: 180+ VACANTES SENA & METRO LÍNEA 1 S.A.S. ── */}
      <div 
        className={`w-full p-5 sm:p-6 rounded-[2rem] border relative overflow-hidden transition-all shadow-sm ${
          dark 
            ? 'bg-gradient-to-br from-[#1c0808] via-zinc-900 to-zinc-950 border-red-900/40 text-white' 
            : 'bg-gradient-to-br from-[#FFFDF9] via-[#FFF8EE] to-[#FEF3C7] border-[#800020]/25 text-zinc-900'
        }`}
      >
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020] text-[#FFF8E7] text-[10px] font-black uppercase tracking-wider shadow-sm">
              <Briefcase size={12} />
              <span>{t('employmentBanner.officialRecruitmentBadge', 'CONVOCATORIA LABORAL OFICIAL')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck size={13} />
              <span>{t('employmentBanner.activeOpeningsBadge', '180+ VACANTES ACTIVAS')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2.5">
              <h1 className={`text-2xl sm:text-3xl font-black italic tracking-tight leading-tight ${dark ? 'text-white' : 'text-[#800020]'}`}>
                {t('employmentBanner.title', 'Portal de Empleo y Talento Metro: SENA & Metro Línea 1 S.A.S.')}
              </h1>
              <p className={`text-xs sm:text-sm font-medium leading-relaxed ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                {t('employmentBanner.desc', 'El concesionario Metro Línea 1 S.A.S. y la Agencia Pública de Empleo del SENA abren convocatorias laborales directas para la operación, mantenimiento y puesta en marcha comercial de la Primera Línea del Metro de Bogotá.')}
              </p>

              {/* Roles operativos prioritarios requeridos */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <div className={`p-3 rounded-xl border flex flex-col justify-between ${dark ? 'bg-zinc-800/80 border-zinc-700/60' : 'bg-white/80 border-[#800020]/15'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Train size={16} className="text-[#800020] dark:text-red-400" />
                    <span className="text-[10px] font-black uppercase text-[#800020] dark:text-white">
                      {t('employmentBanner.role1Title', 'CONDUCTORES GOA4')}
                    </span>
                  </div>
                  <p className={`text-[10.5px] leading-snug ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {t('employmentBanner.role1Desc', 'Supervisión y control de trenes 100% automatizados sin conductor CBTC.')}
                  </p>
                </div>

                <div className={`p-3 rounded-xl border flex flex-col justify-between ${dark ? 'bg-zinc-800/80 border-zinc-700/60' : 'bg-white/80 border-[#800020]/15'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Wrench size={16} className="text-[#800020] dark:text-red-400" />
                    <span className="text-[10px] font-black uppercase text-[#800020] dark:text-white">
                      {t('employmentBanner.role2Title', 'MANTENIMIENTO VÍA')}
                    </span>
                  </div>
                  <p className={`text-[10.5px] leading-snug ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {t('employmentBanner.role2Desc', 'Técnicos de vía férrea, catenaria aérea y subestaciones eléctricas.')}
                  </p>
                </div>

                <div className={`p-3 rounded-xl border flex flex-col justify-between ${dark ? 'bg-zinc-800/80 border-zinc-700/60' : 'bg-white/80 border-[#800020]/15'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Radio size={16} className="text-[#800020] dark:text-red-400" />
                    <span className="text-[10px] font-black uppercase text-[#800020] dark:text-white">
                      {t('employmentBanner.role3Title', 'SEÑALIZACIÓN CBTC')}
                    </span>
                  </div>
                  <p className={`text-[10.5px] leading-snug ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {t('employmentBanner.role3Desc', 'Telecomunicaciones ferroviarias, radio TETRA y sistemas SCADA.')}
                  </p>
                </div>
              </div>
            </div>

            {/* Aviso Antifraude Institucional */}
            <div className={`md:col-span-4 p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
              dark ? 'bg-amber-950/20 border-amber-600/30 text-amber-200' : 'bg-amber-50/80 border-amber-300/80 text-amber-900'
            }`}>
              <div className="flex items-start gap-2.5">
                <AlertCircle size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider mb-1">
                    {t('employmentBanner.freeNoticeTitle', 'POSTULACIÓN 100% GRATUITA')}
                  </h4>
                  <p className="text-[11px] leading-relaxed">
                    {t('employmentBanner.freeNoticeDesc', 'Ninguna persona, empresa o sindicato cobra por aplicar a estas vacantes ni por exámenes médicos o certificaciones.')}
                  </p>
                </div>
              </div>
              <div className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                {t('employmentBanner.exclusiveChannel', 'Canal exclusivo: ape.sena.edu.co & Concesionario Metro Línea 1 S.A.S.')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PORTAL DE EMPLEO INTERACTIVO CON FILTROS, ROLES Y FORMULARIO DE POSTULACIÓN ── */}
      <div className="w-full">
        <PortalEmpleoView dark={dark} embedded={true} />
      </div>
    </div>
  );
};

export default EmploymentModule;
