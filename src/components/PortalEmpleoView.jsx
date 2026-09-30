import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  ExternalLink,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  ChevronRight,
  ChevronDown,
  Building2,
  FileCheck,
  Search,
  Sparkles,
  Award,
  GraduationCap,
  HardHat,
  Train,
  Wrench,
  ShieldCheck,
  DollarSign,
  UserCheck,
  FileText,
  FileUp,
  Share2,
  X,
  Phone,
  Mail,
  Send,
  HelpCircle,
  Info
} from 'lucide-react';
import { 
  METRO_JOB_STEPS, 
  METRO_JOB_AREAS, 
  OFFICIAL_JOB_PORTALS,
  getLocalizedJobSteps,
  getLocalizedJobAreas
} from '../data/metroJobsData';
import { useLanguage } from '../LanguageContext';

export default function PortalEmpleoView({
  dark = false,
  onClose = null,
  embedded = false,
  initialJobId = null
}) {
  const { t, language } = useLanguage();

  // Localized data reactive to active language
  const stepsData = useMemo(() => getLocalizedJobSteps(language), [language]);
  const areasData = useMemo(() => getLocalizedJobAreas(language), [language]);

  // Step selection state (1 to 4)
  const [activeStep, setActiveStep] = useState(1);
  // Area tab selection: 'all' | 'operativa' | 'tecnica' | 'construccion' | 'profesionales'
  const [selectedAreaTab, setSelectedAreaTab] = useState('operativa');
  // Keyword filter
  const [searchTerm, setSearchTerm] = useState('');
  // Filter only without experience
  const [onlyNoExp, setOnlyNoExp] = useState(false);
  // Accordion state for jobs (expanded IDs)
  const [expandedJobs, setExpandedJobs] = useState({});
  // Quick apply modal
  const [jobToApply, setJobToApply] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationCode, setApplicationCode] = useState('');
  const [applicantForm, setApplicantForm] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    correo: '',
    localidad: 'Bosa',
    nivelEstudio: 'Bachiller',
    experiencia: 'Sin experiencia previa (Deseo capacitación)',
    aceptaTerminos: true
  });
  const [copiedLink, setCopiedLink] = useState(false);

  // Horizontal scroll state for areas tab bar
  const tabsRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const checkScroll = useCallback(() => {
    const el = tabsRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;

    checkScroll();

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => checkScroll());
      ro.observe(el);
    }
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);

    const onWheel = (e) => {
      if (el.scrollWidth > el.clientWidth) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          el.scrollLeft += e.deltaY * 1.2;
          checkScroll();
        }
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      window.removeEventListener('resize', handleResize);
      ro?.disconnect();
      el.removeEventListener('wheel', onWheel);
    };
  }, [checkScroll]);

  // Center active tab when selectedAreaTab changes
  useEffect(() => {
    if (tabsRef.current) {
      const activeBtn = tabsRef.current.querySelector(`[data-tab-id="${selectedAreaTab}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
    setTimeout(checkScroll, 300);
  }, [selectedAreaTab, checkScroll]);

  const handleSingleArrowScroll = () => {
    if (!tabsRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
    if (scrollLeft + clientWidth >= scrollWidth - 15) {
      tabsRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      tabsRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
    setTimeout(checkScroll, 250);
  };

  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        left: direction === 'left' ? -240 : 240,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 250);
    }
  };

  const handleMouseDown = (e) => {
    if (!tabsRef.current) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - tabsRef.current.offsetLeft;
    scrollLeftRef.current = tabsRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !tabsRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - startXRef.current);
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }
    tabsRef.current.scrollLeft = scrollLeftRef.current - walk;
    checkScroll();
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  // Initialize selected job if passed via props
  useEffect(() => {
    if (initialJobId) {
      for (const area of areasData) {
        const found = area.jobs.find(j => j.id === initialJobId);
        if (found) {
          setSelectedAreaTab(area.id);
          setExpandedJobs(prev => ({ ...prev, [found.id]: true }));
          break;
        }
      }
    }
  }, [initialJobId, areasData]);

  // Toggle accordion item
  const toggleJob = (id) => {
    setExpandedJobs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter jobs
  const filteredAreas = useMemo(() => {
    return areasData.map(area => {
      // If a specific area tab is selected and not 'all', filter out non-matching areas
      if (selectedAreaTab !== 'all' && area.id !== selectedAreaTab) {
        return { ...area, jobs: [] };
      }

      const filteredJobs = area.jobs.filter(job => {
        const matchesTerm = !searchTerm.trim() || 
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.requisitoPrincipal.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.funciones.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesNoExp = !onlyNoExp || job.sinExperiencia;

        return matchesTerm && matchesNoExp;
      });

      return {
        ...area,
        jobs: filteredJobs
      };
    }).filter(area => area.jobs.length > 0);
  }, [selectedAreaTab, searchTerm, onlyNoExp]);

  const totalFilteredJobs = useMemo(() => {
    return filteredAreas.reduce((acc, curr) => acc + curr.jobs.length, 0);
  }, [filteredAreas]);

  // Handle application submission
  const handleSubmitApplication = (e) => {
    e.preventDefault();
    const code = 'EMB-2026-' + Math.floor(10000 + Math.random() * 90000);
    setApplicationCode(code);
    setHasApplied(true);

    try {
      const existing = JSON.parse(localStorage.getItem('urbango_job_applications') || '[]');
      existing.unshift({
        jobId: jobToApply?.id || 'general',
        jobTitle: jobToApply?.title || 'Convocatoria General L1',
        area: jobToApply?.areaName || 'Metro de Bogotá L1',
        applicant: applicantForm,
        date: new Date().toISOString(),
        code
      });
      localStorage.setItem('urbango_job_applications', JSON.stringify(existing));
    } catch {
      // Storage fallback
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Convocatorias de Empleo - Metro de Bogotá Línea 1',
        text: 'Postúlate a las vacantes oficiales de la Primera Línea del Metro de Bogotá con o sin experiencia.',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Helper for area icons
  const renderAreaIcon = (iconName, size = 18) => {
    switch (iconName) {
      case 'Train': return <Train size={size} />;
      case 'Wrench': return <Wrench size={size} />;
      case 'HardHat': return <HardHat size={size} />;
      case 'GraduationCap': return <GraduationCap size={size} />;
      default: return <Briefcase size={size} />;
    }
  };

  return (
    <div className={`w-full max-w-5xl mx-auto space-y-6 ${embedded ? '' : 'p-3 sm:p-6'}`}>
      
      {/* ── 1. HERO CABECERA INSTITUCIONAL ── */}
      <div className={`w-full rounded-3xl p-5 sm:p-7 border relative overflow-hidden shadow-lg transition-all ${
        dark 
          ? 'bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border-zinc-800 text-white' 
          : 'bg-gradient-to-br from-white via-zinc-50 to-green-50/40 border-zinc-200 text-zinc-900'
      }`}>
        {/* Glow de fondo */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#2D8B3C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#B30000]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#2D8B3C] to-[#1E6B2C] text-white flex items-center justify-center text-2xl sm:text-3xl shadow-md shrink-0">
              <Briefcase size={30} className="text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#B30000] text-white">
                  Alcaldía Mayor de Bogotá
                </span>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  dark ? 'bg-zinc-800 border-zinc-700 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}>
                  Consorcio Metro Línea 1
                </span>
                <span className="text-[10px] font-bold text-zinc-400 hidden sm:inline">
                  220+ Vacantes Abiertas
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight">
                Empleo y Convocatorias <span className="text-[#2D8B3C]">Metro Línea 1</span>
              </h2>
              <p className={`text-xs sm:text-sm font-medium mt-1 max-w-2xl leading-relaxed ${dark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                Oportunidades laborales directas y transparentes para la construcción, montaje electromecánico y operación de la Primera Línea del Metro de Bogotá.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              onClick={handleShare}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                dark 
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-750' 
                  : 'bg-white border-zinc-200 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
              title="Compartir convocatorias"
            >
              <Share2 size={15} />
              <span className="hidden sm:inline">{copiedLink ? '¡Enlace copiado!' : 'Compartir'}</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  dark ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white' : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900'
                }`}
                title="Cerrar modal"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Banner de Garantía y Transparencia */}
        <div className={`mt-4 p-3 rounded-2xl border flex items-center gap-3 text-xs ${
          dark ? 'bg-zinc-950/60 border-zinc-800/80 text-zinc-300' : 'bg-white/80 border-zinc-200/80 text-zinc-700'
        }`}>
          <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[10px] block">
              Garantía de Transparencia Distrital
            </span>
            <span className="font-semibold text-[11px] sm:text-xs">
              Todos los procesos de selección son <strong>100% gratuitos</strong>. Ninguna entidad o intermediario solicita dinero por exámenes médicos o formularios.
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. PASO A PASO INTERACTIVO DE CÓMO APLICAR (REQUERIMIENTO 1) ── */}
      <div className={`w-full rounded-3xl p-5 sm:p-6 border shadow-sm transition-all ${
        dark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-zinc-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#2D8B3C] block mb-0.5">
              Guía del Aspirante
            </span>
            <h3 className={`font-black text-lg sm:text-xl tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
              {t('jobsModule.stepsTitle', '¿Cómo aplicar paso a paso a las vacantes del Metro?')}
            </h3>
          </div>
          <span className="text-xs font-medium text-zinc-400">
            {t('jobsModule.stepPrefix', 'Paso')} {activeStep} / 4
          </span>
        </div>

        {/* Stepper Buttons Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mb-5">
          {stepsData.map((s) => {
            const isActive = activeStep === s.step;
            const isCompleted = activeStep > s.step;

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveStep(s.step)}
                className={`text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden group ${
                  isActive
                    ? 'bg-[#2D8B3C] text-white border-[#2D8B3C] shadow-md shadow-green-900/20 scale-[1.02]'
                    : isCompleted
                      ? dark
                        ? 'bg-zinc-800/80 border-emerald-500/40 text-zinc-200 hover:bg-zinc-800'
                        : 'bg-emerald-50/60 border-emerald-200 text-zinc-800 hover:bg-emerald-100/60'
                      : dark
                        ? 'bg-zinc-800/40 border-zinc-800 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${
                    isActive
                      ? 'bg-white text-[#2D8B3C] shadow-sm'
                      : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : dark ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-200 text-zinc-700'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={15} /> : s.step}
                  </span>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : dark ? 'bg-zinc-700/50 text-zinc-400' : 'bg-zinc-200/70 text-zinc-600'
                  }`}>
                    {t('jobsModule.stepPrefix', 'Paso')} {s.step}
                  </span>
                </div>
                <h4 className="font-black text-xs sm:text-sm leading-snug line-clamp-1">
                  {s.title}
                </h4>
                <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${
                  isActive ? 'text-green-50' : dark ? 'text-zinc-400' : 'text-zinc-500'
                }`}>
                  {s.summary}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Step Deep Dive Card */}
        {(() => {
          const current = stepsData.find(s => s.step === activeStep) || stepsData[0];
          return (
            <div className={`p-4 sm:p-5 rounded-2xl border transition-all animate-in fade-in duration-200 ${
              dark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2D8B3C]/15 text-[#2D8B3C] flex items-center justify-center font-black text-base shrink-0">
                    {activeStep === 1 && <UserCheck size={20} />}
                    {activeStep === 2 && <Search size={20} />}
                    {activeStep === 3 && <FileUp size={20} />}
                    {activeStep === 4 && <Award size={20} />}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#2D8B3C]">
                      {t('jobsModule.stepPrefix', 'Paso')} {current.step}
                    </span>
                    <h4 className={`font-black text-base sm:text-lg leading-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
                      {current.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeStep > 1 && (
                    <button
                      onClick={() => setActiveStep(prev => prev - 1)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                        dark ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      ← {t('jobsModule.btnPrevStep', 'Paso Anterior')}
                    </button>
                  )}
                  {activeStep < 4 ? (
                    <button
                      onClick={() => setActiveStep(prev => prev + 1)}
                      className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-[#2D8B3C] text-white hover:bg-[#1E6B2C] transition-colors shadow-sm"
                    >
                      {t('jobsModule.btnNextStep', 'Siguiente Paso')} →
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const target = document.getElementById('vacantes-catalogo-section');
                        target?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-[#2D8B3C] text-white hover:bg-[#1E6B2C] transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <Briefcase size={13} />
                      <span>{t('jobsModule.btnViewVacancies', 'Ver Vacantes Activas')}</span>
                    </button>
                  )}
                </div>
              </div>

              <p className={`text-xs sm:text-sm font-medium leading-relaxed mb-3 ${
                dark ? 'text-zinc-300' : 'text-zinc-700'
              }`}>
                {current.desc}
              </p>

              <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                dark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700'
              }`}>
                <Info size={16} className="text-[#2D8B3C] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <strong className="text-[#2D8B3C]">Dato Clave: </strong>
                  {current.detail}
                </div>
              </div>

              {/* Direct action button in step */}
              {current.url && (
                <div className="mt-3.5 pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[11px] font-semibold text-zinc-400">
                    Acceso directo para completar este paso:
                  </span>
                  <a
                    href={current.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-black text-[#2D8B3C] hover:underline"
                  >
                    <span>{current.actionLabel}</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* ── 3. BOTONES DE ACCIÓN DESTACADOS A PORTALES OFICIALES (REQUERIMIENTO 3) ── */}
      <div className={`w-full rounded-3xl p-5 sm:p-6 border shadow-sm transition-all ${
        dark ? 'bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-900 border-zinc-800' : 'bg-gradient-to-r from-red-50/50 via-white to-green-50/50 border-zinc-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#B30000] block mb-0.5">
              Canales Autorizados
            </span>
            <h3 className={`font-black text-lg sm:text-xl tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
              Portales Oficiales de Postulación Directa
            </h3>
          </div>
          <span className="text-xs font-semibold text-zinc-400">
            Enlaces verificados · Vigencia 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* BOTÓN 1: BOGOTÁ TRABAJA */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between ${
            dark 
              ? 'bg-zinc-800/90 border-red-500/30 hover:border-red-500/60' 
              : 'bg-white border-red-200 shadow-sm hover:border-red-300'
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B30000] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#B30000]">
                  Distrito Capital · Agencia Pública
                </span>
              </div>
              <h4 className={`font-black text-base sm:text-lg leading-tight mb-1 ${dark ? 'text-white' : 'text-zinc-900'}`}>
                Agencia Pública de Empleo de Bogotá
              </h4>
              <p className={`text-xs font-medium leading-relaxed mb-4 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Inscribe tu hoja de vida en el portal distrital de la Secretaría de Desarrollo Económico y postúlate a las ferias del Metro.
              </p>
            </div>

            <a
              id="btn-bogota-trabaja"
              href="https://bogotatrabaja.gov.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-[#B30000] hover:bg-[#C8102E] active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 text-center"
            >
              <span>Ir a Bogotá Trabaja</span>
              <ExternalLink size={16} />
            </a>
          </div>

          {/* BOTÓN 2: EL EMPLEO - METRO LÍNEA 1 */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between ${
            dark 
              ? 'bg-zinc-800/90 border-emerald-500/30 hover:border-emerald-500/60' 
              : 'bg-white border-emerald-200 shadow-sm hover:border-emerald-300'
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2D8B3C] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#2D8B3C]">
                  Consorcio Metro Línea 1
                </span>
              </div>
              <h4 className={`font-black text-base sm:text-lg leading-tight mb-1 ${dark ? 'text-white' : 'text-zinc-900'}`}>
                El Empleo - Consorcio Metro Línea 1
              </h4>
              <p className={`text-xs font-medium leading-relaxed mb-4 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Consulta las vacantes empresariales publicadas por el concesionario constructor para frentes de obra y pre-operación.
              </p>
            </div>

            <a
              id="btn-el-empleo-metro"
              href="https://www.elempleo.com/co/sitio-empresarial/consorcio-metro-linea-1"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-[#2D8B3C] hover:bg-[#1E6B2C] active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 text-center"
            >
              <span>Ver Vacantes en El Empleo - Metro Línea 1</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* ── 4. SECCIÓN DE VACANTES REALES CLASIFICADAS EN 4 ÁREAS (REQUERIMIENTO 2) ── */}
      <div 
        id="vacantes-catalogo-section" 
        className={`w-full rounded-3xl p-5 sm:p-6 border shadow-sm transition-all ${
          dark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#2D8B3C]">
                Convocatorias Vigentes
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {totalFilteredJobs} Ofertas Disponibles
              </span>
            </div>
            <h3 className={`font-black text-xl sm:text-2xl tracking-tight leading-tight mt-0.5 ${dark ? 'text-white' : 'text-zinc-900'}`}>
              Vacantes Clasificadas por Área
            </h3>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder={t('jobsModule.searchPlaceholder', 'Buscar por cargo, palabra clave o requisito...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-[#2D8B3C] ${
                  dark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
                }`}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Toggle Sin Experiencia */}
            <button
              type="button"
              onClick={() => setOnlyNoExp(!onlyNoExp)}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border whitespace-nowrap ${
                onlyNoExp
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : dark ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-750' : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <Sparkles size={13} />
              <span>{t('jobsModule.badgeNoExperience', 'Sin experiencia')}</span>
            </button>
          </div>
        </div>

        {/* ── MENÚ DE PESTAÑAS PARA LAS 4 ÁREAS (BARRA DESLIZANTE E INTERACTIVA) ── */}
        <div className="relative mb-6">
          {/* Header con indicador de deslizamiento y control con flecha única */}
          <div className="flex items-center justify-between gap-2 mb-2 text-xs">
            <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5 select-none">
              <span>↔</span>
              <span>{t('jobsModule.exploreAreasTip', 'Desliza, arrastra o usa la flecha para explorar las áreas')}</span>
            </span>

            {/* Control con una sola flecha para mover la barra */}
            <div className="flex items-center shrink-0">
              <button
                type="button"
                onClick={handleSingleArrowScroll}
                aria-label="Desplazar áreas"
                className={`p-1.5 px-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                  dark
                    ? 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 active:scale-95 shadow-xs'
                    : 'bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-100 active:scale-95 shadow-xs'
                }`}
                title="Desplazar para ver más áreas"
              >
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-black hidden sm:inline">Deslizar</span>
                <ChevronRight size={16} className="text-[#2D8B3C]" />
              </button>
            </div>
          </div>

          {/* Sombra / Gradiente lateral izquierda si se puede mover */}
          {canScrollLeft && (
            <div className={`pointer-events-none absolute left-0 top-7 bottom-0 w-8 z-10 bg-gradient-to-r ${
              dark ? 'from-zinc-900 via-zinc-900/80 to-transparent' : 'from-white via-white/80 to-transparent'
            }`} />
          )}

          {/* Barra Desplazable con Touch, Mouse Grab-and-Drag y Rueda del Ratón */}
          <div
            ref={tabsRef}
            onScroll={checkScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`flex items-center gap-2 overflow-x-auto no-scroll pb-2 border-b border-zinc-200 dark:border-zinc-800 scroll-smooth overscroll-x-contain select-none transition-colors ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <button
              type="button"
              data-tab-id="all"
              onClick={() => {
                if (hasDraggedRef.current) return;
                setSelectedAreaTab('all');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                selectedAreaTab === 'all'
                  ? 'bg-[#2D8B3C] text-white shadow-sm scale-[1.02]'
                  : dark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <span>{t('jobsModule.filterAll', 'Todas las Áreas')}</span>
            </button>

            {areasData.map((area) => {
              const isSelected = selectedAreaTab === area.id;
              return (
                <button
                  key={area.id}
                  type="button"
                  data-tab-id={area.id}
                  onClick={() => {
                    if (hasDraggedRef.current) return;
                    setSelectedAreaTab(area.id);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-[#2D8B3C] text-white shadow-sm scale-[1.02]'
                      : dark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  <span>{renderAreaIcon(area.iconName, 15)}</span>
                  <span>{area.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-white/20 text-white font-bold' : dark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200 text-zinc-600'
                  }`}>
                    {area.jobs.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sombra / Gradiente lateral derecha si se puede mover */}
          {canScrollRight && (
            <div className={`pointer-events-none absolute right-0 top-7 bottom-0 w-8 z-10 bg-gradient-to-l ${
              dark ? 'from-zinc-900 via-zinc-900/80 to-transparent' : 'from-white via-white/80 to-transparent'
            }`} />
          )}
        </div>

        {/* ── LISTADO CLASIFICADO CON ACORDEÓN INTERACTIVO ── */}
        <div className="space-y-6">
          {filteredAreas.length === 0 ? (
            <div className={`p-8 text-center rounded-2xl border ${
              dark ? 'bg-zinc-800/40 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-500'
            }`}>
              <AlertCircle size={32} className="mx-auto mb-2 text-zinc-400 opacity-60" />
              <p className="font-bold text-sm">No se encontraron vacantes con los filtros seleccionados.</p>
              <button
                onClick={() => { setSearchTerm(''); setOnlyNoExp(false); setSelectedAreaTab('all'); }}
                className="mt-3 text-xs font-black text-[#2D8B3C] hover:underline"
              >
                Restablecer todos los filtros
              </button>
            </div>
          ) : (
            filteredAreas.map((area) => (
              <div 
                key={area.id}
                className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                  dark ? 'bg-zinc-950/60 border-zinc-800/90' : 'bg-zinc-50/70 border-zinc-200/90'
                }`}
              >
                {/* Cabecera del Área */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
                      style={{ backgroundColor: area.color }}
                    >
                      {renderAreaIcon(area.iconName, 20)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-black text-base sm:text-lg leading-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
                          {area.name}
                        </h4>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${area.tagColor}`}>
                          {area.tag}
                        </span>
                      </div>
                      <p className={`text-xs font-semibold mt-0.5 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {area.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-zinc-400">
                    {area.jobs.length} convocatorias activas
                  </span>
                </div>

                {/* Acordeón de vacantes para esta área */}
                <div className="space-y-3">
                  {area.jobs.map((job) => {
                    const isExpanded = !!expandedJobs[job.id];

                    return (
                      <div
                        key={job.id}
                        className={`rounded-2xl border transition-all overflow-hidden ${
                          isExpanded
                            ? dark 
                              ? 'bg-zinc-900 border-[#2D8B3C]/50 shadow-md' 
                              : 'bg-white border-[#2D8B3C]/40 shadow-md'
                            : dark 
                              ? 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700' 
                              : 'bg-white border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        {/* Cabecera del Acordeón (Clic para expandir) */}
                        <div
                          onClick={() => toggleJob(job.id)}
                          className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              {job.sinExperiencia && (
                                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500 text-white">
                                  Sin Experiencia Previa
                                </span>
                              )}
                              {job.destacada && (
                                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                  Alta Demanda
                                </span>
                              )}
                              <span className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1">
                                <MapPin size={12} className="text-[#2D8B3C]" />
                                {job.ubicacion}
                              </span>
                            </div>

                            <h5 className={`font-black text-base sm:text-lg leading-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
                              {job.title}
                            </h5>

                            <p className={`text-xs font-semibold mt-1 leading-relaxed ${
                              dark ? 'text-zinc-300' : 'text-zinc-600'
                            }`}>
                              {job.requisitoPrincipal}
                            </p>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                            <div className="text-right">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                                {job.vacantes} Plazas Disponibles
                              </span>
                              <span className="text-xs font-black text-zinc-400">
                                {job.salarioEstimado.split(' ')[0]} {job.salarioEstimado.split(' ')[1]}
                              </span>
                            </div>

                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${
                              dark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
                            } ${isExpanded ? 'rotate-180 bg-[#2D8B3C] text-white' : ''}`}>
                              <ChevronDown size={16} />
                            </div>
                          </div>
                        </div>

                        {/* Contenido Expandido del Acordeón */}
                        {isExpanded && (
                          <div className={`p-4 sm:p-5 border-t space-y-4 animate-in fade-in duration-150 ${
                            dark ? 'border-zinc-800 bg-zinc-950/40' : 'border-zinc-100 bg-zinc-50/50'
                          }`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                              {/* Requisitos y Perfil */}
                              <div className={`p-3.5 rounded-xl border ${
                                dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
                              }`}>
                                <h6 className="font-black text-[11px] uppercase tracking-wider text-[#2D8B3C] mb-1.5 flex items-center gap-1.5">
                                  <GraduationCap size={14} />
                                  <span>Perfil & Requisitos Detallados</span>
                                </h6>
                                <p className={`font-medium leading-relaxed ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                  {job.detalleRequisitos}
                                </p>
                              </div>

                              {/* Funciones Principales */}
                              <div className={`p-3.5 rounded-xl border ${
                                dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
                              }`}>
                                <h6 className="font-black text-[11px] uppercase tracking-wider text-[#2D8B3C] mb-1.5 flex items-center gap-1.5">
                                  <Briefcase size={14} />
                                  <span>Funciones del Puesto</span>
                                </h6>
                                <p className={`font-medium leading-relaxed ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                  {job.funciones}
                                </p>
                              </div>

                              {/* Capacitación y Formación */}
                              <div className={`p-3.5 rounded-xl border ${
                                dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
                              }`}>
                                <h6 className="font-black text-[11px] uppercase tracking-wider text-emerald-500 mb-1.5 flex items-center gap-1.5">
                                  <Award size={14} />
                                  <span>Capacitación Pagada por la Empresa</span>
                                </h6>
                                <p className={`font-medium leading-relaxed ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                  {job.capacitacion}
                                </p>
                              </div>

                              {/* Condiciones y Salario */}
                              <div className={`p-3.5 rounded-xl border ${
                                dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
                              }`}>
                                <h6 className="font-black text-[11px] uppercase tracking-wider text-amber-500 mb-1.5 flex items-center gap-1.5">
                                  <DollarSign size={14} />
                                  <span>Remuneración y Tipo de Contrato</span>
                                </h6>
                                <p className={`font-bold leading-relaxed ${dark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                                  {job.salarioEstimado}
                                </p>
                                <p className="text-[11px] text-zinc-400 mt-1 font-semibold">
                                  Contrato: {job.tipoContrato}
                                </p>
                              </div>
                            </div>

                            {/* Botones de Acción para la Vacante */}
                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                              <span className="text-[11px] font-semibold text-zinc-400 text-center sm:text-left">
                                Radicación inmediata con código único de seguimiento distrital.
                              </span>

                              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setJobToApply({ ...job, areaName: area.name });
                                    setHasApplied(false);
                                  }}
                                  className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-[#2D8B3C] hover:bg-[#1E6B2C] active:scale-95 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                  <FileCheck size={16} />
                                  <span>Postularme Ahora</span>
                                </button>

                                <a
                                  href="https://bogotatrabaja.gov.co/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`py-2.5 px-3.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                                    dark 
                                      ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:text-white' 
                                      : 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                                  }`}
                                  title="Ver en portal oficial"
                                >
                                  <span>Bogotá Trabaja</span>
                                  <ExternalLink size={13} />
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── 5. MODAL DE POSTULACIÓN RÁPIDA (CON RADICADO OFICIAL) ── */}
      {jobToApply && (
        <>
          <div
            className="fixed inset-0 z-[3000] bg-black/75 backdrop-blur-xs animate-in fade-in"
            onClick={() => setJobToApply(null)}
          />
          <div className="fixed inset-0 z-[3010] flex items-center justify-center p-3 sm:p-4">
            <div
              className={`w-full max-w-lg rounded-[2rem] p-6 sm:p-7 shadow-2xl border transition-all animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto no-scroll ${
                dark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#2D8B3C] text-white flex items-center justify-center text-xl shadow-md shrink-0">
                    <FileCheck size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#2D8B3C]">
                      Postulación Digital Oficial
                    </span>
                    <h4 className="font-black text-lg sm:text-xl tracking-tight leading-tight">
                      {jobToApply.title}
                    </h4>
                    <p className={`text-xs font-semibold ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {jobToApply.areaName} · Ref: {jobToApply.id}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setJobToApply(null)}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {hasApplied ? (
                /* Pantalla de Éxito con Radicado */
                <div className="space-y-4 py-2 animate-in fade-in">
                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                    <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg">
                      <CheckCircle2 size={32} />
                    </div>
                    <h5 className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      ¡Postulación Radicada con Éxito!
                    </h5>
                    <p className={`text-xs font-medium leading-relaxed ${dark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      Tu perfil para el cargo de <strong>{jobToApply.title}</strong> ha quedado registrado en la base de datos de talento del consorcio constructor.
                    </p>

                    <div className={`mt-3 p-3 rounded-xl border text-center font-mono ${
                      dark ? 'bg-zinc-950 border-zinc-800 text-emerald-400' : 'bg-white border-emerald-200 text-emerald-700'
                    }`}>
                      <span className="text-[10px] uppercase font-sans tracking-widest block text-zinc-400">
                        Código Único de Radicado
                      </span>
                      <strong className="text-lg font-black">{applicationCode}</strong>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                    dark ? 'bg-zinc-800/60 border-zinc-700 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                  }`}>
                    <p className="font-bold flex items-center gap-1.5 text-[#2D8B3C]">
                      <CheckCircle2 size={14} /> Siguientes Pasos Oficiales:
                    </p>
                    <ol className="list-decimal pl-4 space-y-1 text-[11px] opacity-90">
                      <li>El equipo de selección validará tus datos en el transcurso de 3 a 5 días hábiles.</li>
                      <li>Recibirás un mensaje SMS y correo a <strong>{applicantForm.correo || 'tu correo registrado'}</strong> con la citación a pruebas o entrevistas.</li>
                      <li>Para cargos sin experiencia, se agendará la inducción en el simulador de Patio Taller Bosa.</li>
                    </ol>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setJobToApply(null)}
                      className="w-full py-3 rounded-xl bg-[#2D8B3C] text-white font-black text-xs uppercase tracking-wider hover:bg-[#1E6B2C] transition-all"
                    >
                      Aceptar y Continuar
                    </button>
                  </div>
                </div>
              ) : (
                /* Formulario de Postulación */
                <form onSubmit={handleSubmitApplication} className="space-y-3.5">
                  <div className={`p-3 rounded-xl border text-xs ${
                    dark ? 'bg-zinc-800/50 border-zinc-700 text-zinc-300' : 'bg-green-50/70 border-green-200 text-green-950'
                  }`}>
                    <p className="font-bold">Requisitos Clave:</p>
                    <p className="mt-0.5 opacity-90">{jobToApply.requisitoPrincipal}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Andrés Felipe Morales"
                        value={applicantForm.nombre}
                        onChange={(e) => setApplicantForm({ ...applicantForm, nombre: e.target.value })}
                        className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-[#2D8B3C] ${
                          dark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                        Cédula de Ciudadanía *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. 1018456789"
                        value={applicantForm.cedula}
                        onChange={(e) => setApplicantForm({ ...applicantForm, cedula: e.target.value })}
                        className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-[#2D8B3C] ${
                          dark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                        Teléfono Móvil (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ej. 310 555 1234"
                        value={applicantForm.telefono}
                        onChange={(e) => setApplicantForm({ ...applicantForm, telefono: e.target.value })}
                        className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-[#2D8B3C] ${
                          dark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="tu.correo@ejemplo.com"
                        value={applicantForm.correo}
                        onChange={(e) => setApplicantForm({ ...applicantForm, correo: e.target.value })}
                        className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-[#2D8B3C] ${
                          dark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                        Localidad de Residencia en Bogotá
                      </label>
                      <select
                        value={applicantForm.localidad}
                        onChange={(e) => setApplicantForm({ ...applicantForm, localidad: e.target.value })}
                        className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-[#2D8B3C] ${
                          dark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                        }`}
                      >
                        <option value="Bosa">Bosa (Área Patio Taller)</option>
                        <option value="Kennedy">Kennedy (Tramo 1 y 2)</option>
                        <option value="Puente Aranda">Puente Aranda (Tramo 3)</option>
                        <option value="Los Mártires">Los Mártires (Caracas Sur)</option>
                        <option value="Santa Fe">Santa Fe (Caracas Centro)</option>
                        <option value="Teusaquillo">Teusaquillo (Caracas Medio)</option>
                        <option value="Chapinero">Chapinero (Caracas Norte)</option>
                        <option value="Barrios Unidos">Barrios Unidos (Intercambiador Cll 72)</option>
                        <option value="Otra Localidad">Otra Localidad de Bogotá</option>
                        <option value="Soacha">Soacha / Cundinamarca</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                        Nivel de Estudios Culminado
                      </label>
                      <select
                        value={applicantForm.nivelEstudio}
                        onChange={(e) => setApplicantForm({ ...applicantForm, nivelEstudio: e.target.value })}
                        className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-[#2D8B3C] ${
                          dark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                        }`}
                      >
                        <option value="Bachiller">Bachiller Culminado</option>
                        <option value="Técnico Laboral">Técnico Laboral / SENA</option>
                        <option value="Tecnólogo">Tecnólogo</option>
                        <option value="Profesional">Profesional Universitario</option>
                        <option value="Posgrado">Especialización / Maestría</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                      Experiencia en el Sector
                    </label>
                    <select
                      value={applicantForm.experiencia}
                      onChange={(e) => setApplicantForm({ ...applicantForm, experiencia: e.target.value })}
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-[#2D8B3C] ${
                        dark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900'
                      }`}
                    >
                      <option value="Sin experiencia previa (Deseo capacitación)">Sin experiencia previa (Deseo capacitación pagada por consorcio)</option>
                      <option value="6 meses a 1 año en construcción o logística">6 meses a 1 año en construcción, atención o logística</option>
                      <option value="1 a 3 años en el área técnica o ferrocarril">1 a 3 años en el área técnica o transporte</option>
                      <option value="Más de 3 años / Especialista">Más de 3 años / Perfil especialista</option>
                    </select>
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="terminos-empleo"
                      checked={applicantForm.aceptaTerminos}
                      onChange={(e) => setApplicantForm({ ...applicantForm, aceptaTerminos: e.target.checked })}
                      className="mt-1 accent-[#2D8B3C]"
                      required
                    />
                    <label htmlFor="terminos-empleo" className="text-[11px] leading-tight text-zinc-400">
                      Certifico que los datos suministrados son verídicos y autorizo el tratamiento de mis datos de acuerdo con las políticas de talento humano de la Empresa Metro de Bogotá y el Consorcio Metro Línea 1.
                    </label>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setJobToApply(null)}
                      className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                        dark ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 border-zinc-300 text-zinc-700 hover:bg-zinc-200'
                      }`}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 rounded-xl bg-[#2D8B3C] hover:bg-[#1E6B2C] active:scale-95 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Send size={15} />
                      <span>Confirmar Postulación</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
