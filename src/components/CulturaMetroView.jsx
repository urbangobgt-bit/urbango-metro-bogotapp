import React, { useState } from 'react';
import {
  BookOpen,
  HeartHandshake,
  Megaphone,
  Users,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Tv,
  School,
  HardHat,
  TrendingUp,
  ShieldCheck,
  Coffee,
  ListOrdered,
  LogOut,
  Footprints,
  CreditCard,
  MessageSquare,
  Award,
  Share2,
  Check
} from 'lucide-react';
import { useI18n } from '../i18nContext';

export default function CulturaMetroView({
  dark = false,
  onNavigate = () => {},
  onOpenMetroBot = () => {}
}) {
  const { t, lang } = useI18n();

  // Compromiso cívico interactivo
  const [commitments, setCommitments] = useState({
    noFood: true,
    makeQueue: true,
    letExitFirst: true,
    keepMoving: true,
    payProudly: true
  });
  const [copiedShare, setCopiedShare] = useState(false);

  const toggleCommitment = (key) => {
    setCommitments(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(commitments).filter(Boolean).length;
  const isModoMetroHero = completedCount === 5;

  const handleShare = async () => {
    const text = t('cultura.shareText', '¡Ya estoy en #BogotáModoMetro con UrbanGo! 🚇 Cuidar el metro y TransMilenio es compromiso de todos. #MetroTransMilenioEsUno');
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-2">
      {/* ── TOP BAR / BREADCRUMB ── */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all active:scale-95 cursor-pointer ${
            dark 
              ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white' 
              : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 shadow-xs'
          }`}
        >
          <ArrowLeft size={14} />
          <span>{t('cultura.backToHome', 'Volver al Inicio')}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all active:scale-95 cursor-pointer ${
              copiedShare 
                ? 'bg-emerald-600 text-white border-emerald-600' 
                : dark 
                  ? 'bg-zinc-900 border-zinc-800 text-emerald-400 hover:bg-zinc-800' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {copiedShare ? <Check size={14} /> : <Share2 size={14} />}
            <span>{copiedShare ? t('cultura.copied', '¡Copiado!') : t('cultura.share', 'Compartir')}</span>
          </button>
        </div>
      </div>

      {/* ── HERO BANNER: CULTURA Y #BOGOTÁMODOMETRO ── */}
      <div className={`relative overflow-hidden rounded-[2.5rem] border p-6 sm:p-8 md:p-10 shadow-2xl transition-all ${
        dark 
          ? 'bg-gradient-to-br from-emerald-950/80 via-zinc-900 to-zinc-950 border-emerald-500/30' 
          : 'bg-gradient-to-br from-emerald-700 via-emerald-800 to-zinc-900 text-white border-emerald-600/40'
      }`}>
        {/* Glow de fondo decorativo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-md">
                <BookOpen size={12} />
                {t('cultura.badgePedagogy', 'Pedagogía Ciudadana Distrital')}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Sparkles size={11} />
                {t('cultura.badgeOperation', 'Operación Línea 1 • 2028')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
              {t('cultura.heroTitle', 'CULTURA Y')} <span className="text-emerald-400">{t('cultura.heroMotto', '#BOGOTÁMODOMETRO')}</span>
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-medium">
              "{t('cultura.heroSubtitle', 'La cultura ciudadana del Metro de Bogotá se impulsa bajo el lema #BogotáModoMetro, una estrategia de la Alcaldía Mayor de Bogotá y la Empresa Metro de Bogotá para preparar a los ciudadanos antes de la entrada en operación de la Línea 1 en 2028.')}"
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenMetroBot(t('cultura.metroBotQuery', '🌱 ¿Cuáles son las normas de cultura ciudadana y #BogotáModoMetro?'))}
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-950 font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare size={15} className="text-emerald-700" />
                <span>{t('cultura.btnAskMetroBot', 'Preguntar a MetroBot IA')}</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('normas-convivencia');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2.5 rounded-2xl bg-emerald-900/60 hover:bg-emerald-900/80 text-white font-bold text-xs uppercase tracking-wider border border-emerald-400/30 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>{t('cultura.btn5Pillars', 'Conoce los 5 Pilares')}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Sello / Insignia Modo Metro */}
          <div className="flex md:flex-col items-center justify-center p-5 rounded-3xl bg-black/30 border border-emerald-400/30 backdrop-blur-md text-center shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-zinc-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-2">
              <HeartHandshake size={32} strokeWidth={2.4} />
            </div>
            <p className="font-black text-xs uppercase tracking-widest text-white">{t('cultura.heroSealTitle', '#BogotáModoMetro')}</p>
            <p className="text-[10px] text-emerald-200/80 font-semibold mt-0.5">{t('cultura.heroSealSub', 'Alcaldía Mayor de Bogotá • EMB')}</p>
          </div>
        </div>
      </div>

      {/* ── PILAR DE INTEGRACIÓN: #METROTRANSMILENIOESUNO ── */}
      <div className={`rounded-3xl border p-6 sm:p-7 shadow-lg transition-all ${
        dark 
          ? 'bg-zinc-900/90 border-zinc-800' 
          : 'bg-white border-zinc-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Megaphone size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                {t('cultura.pilarTag', 'Pilar Estratégico Central')}
              </span>
              <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
                {t('cultura.pilarTitle', 'Integración del Sistema:')}{' '}
                <span className="text-emerald-600 dark:text-emerald-400">{t('cultura.pilarMotto', '#MetroTransMilenioEsUno')}</span>
              </h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            {t('cultura.pilarBadge', 'Cuidado y Corresponsabilidad')}
          </span>
        </div>

        <div className="pt-5 space-y-4">
          <p className={`text-sm sm:text-base leading-relaxed ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}>
            {t('cultura.pilarDesc', 'Promueve la premisa de que #MetroTransMilenioEsUno, entendiendo que el comportamiento cívico en el transporte actual define el cuidado del nuevo sistema. La cultura ciudadana no comienza cuando ruede el primer tren en 2028: se forja hoy en cada estación de TransMilenio, paradero del SITP y cruce peatonal de Bogotá.')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
            <div className={`p-4 rounded-2xl border ${dark ? 'bg-zinc-800/50 border-zinc-700/60' : 'bg-emerald-50/60 border-emerald-100'}`}>
              <div className="flex items-center gap-2 mb-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={16} />
                <h4 className="font-black text-xs uppercase tracking-wider">{t('cultura.ecosystemTitle', 'Un Solo Ecosistema')}</h4>
              </div>
              <p className={`text-xs leading-snug ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {t('cultura.ecosystemDesc', '10 de las 16 estaciones de la Línea 1 conectan directamente con troncales de TransMilenio. Cuidar uno es proteger al otro.')}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${dark ? 'bg-zinc-800/50 border-zinc-700/60' : 'bg-blue-50/60 border-blue-100'}`}>
              <div className="flex items-center gap-2 mb-1.5 text-blue-600 dark:text-blue-400">
                <Users size={16} />
                <h4 className="font-black text-xs uppercase tracking-wider">{t('cultura.respectTitle', 'Respeto Colectivo')}</h4>
              </div>
              <p className={`text-xs leading-snug ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {t('cultura.respectDesc', 'Prioridad para personas mayores, mujeres gestantes, personas con movilidad reducida y niños en todas las plataformas.')}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${dark ? 'bg-zinc-800/50 border-zinc-700/60' : 'bg-purple-50/60 border-purple-100'}`}>
              <div className="flex items-center gap-2 mb-1.5 text-purple-600 dark:text-purple-400">
                <ShieldCheck size={16} />
                <h4 className="font-black text-xs uppercase tracking-wider">{t('cultura.belongingTitle', 'Sentido de Pertenencia')}</h4>
              </div>
              <p className={`text-xs leading-snug ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {t('cultura.belongingDesc', 'El Metro es patrimonio público de 8 millones de bogotanos. Rechazamos cualquier acto vandálico o evasión de tarifa.')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── NORMAS DE CONVIVENCIA CLAVE (5 PILARES) ── */}
      <div id="normas-convivencia" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              {t('cultura.rulesTag', 'Reglas de Oro del Metro')}
            </span>
            <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
              {t('cultura.rulesTitle', 'Normas de Convivencia Clave')}
            </h3>
          </div>
          <span className="text-xs font-bold text-zinc-500">
            {t('cultura.rulesCount', '5 Normas Esenciales')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Norma 1 */}
          <div className={`p-5 rounded-3xl border transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${
            dark ? 'bg-zinc-900/90 border-zinc-800 hover:border-emerald-500/40' : 'bg-white border-zinc-200 hover:border-emerald-500/40'
          }`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Coffee size={20} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {t('cultura.rule1Tag', 'Limpieza y Confort')}
                </span>
              </div>
              <h4 className={`text-base font-black mb-1.5 leading-snug ${dark ? 'text-white' : 'text-zinc-900'}`}>
                {t('cultura.rule1Title', 'No consumir alimentos ni bebidas')}
              </h4>
              <p className={`text-xs leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {t('cultura.rule1Desc', 'Prohibido ingerir alimentos o bebidas dentro de las estaciones o vehículos. Esta medida preserva la limpieza, evita malos olores y previene incidentes por derrames en trenes de alta tecnología.')}
              </p>
            </div>
            <button
              onClick={() => toggleCommitment('noFood')}
              className={`w-full pt-3 mt-3 border-t text-left flex items-center justify-between text-[11px] font-bold transition-all cursor-pointer ${
                commitments.noFood 
                  ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                  : 'text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className={commitments.noFood ? 'text-emerald-500' : 'text-zinc-400'} />
                <span>{t('cultura.rule1Footer', 'Espacios limpios para todos')}</span>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                commitments.noFood 
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300' 
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
              }`}>
                {commitments.noFood ? t('cultura.habitAssumed', 'Hábito asumido') : t('cultura.habitPending', 'Asumir hábito')}
              </span>
            </button>
          </div>

          {/* Norma 2 */}
          <div className={`p-5 rounded-3xl border transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${
            dark ? 'bg-zinc-900/90 border-zinc-800 hover:border-emerald-500/40' : 'bg-white border-zinc-200 hover:border-emerald-500/40'
          }`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <ListOrdered size={20} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {t('cultura.rule2Tag', 'Fluidez y Orden')}
                </span>
              </div>
              <h4 className={`text-base font-black mb-1.5 leading-snug ${dark ? 'text-white' : 'text-zinc-900'}`}>
                {t('cultura.rule2Title', 'Hacer la fila en accesos y torniquetes')}
              </h4>
              <p className={`text-xs leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {t('cultura.rule2Desc', 'Hacer la fila para permitir un flujo de movilidad continuo. Respeta las demarcaciones de espera en plataformas y no empujes al ingresar a los torniquetes o escaleras mecánicas.')}
              </p>
            </div>
            <button
              onClick={() => toggleCommitment('makeQueue')}
              className={`w-full pt-3 mt-3 border-t text-left flex items-center justify-between text-[11px] font-bold transition-all cursor-pointer ${
                commitments.makeQueue 
                  ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                  : 'text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className={commitments.makeQueue ? 'text-emerald-500' : 'text-zinc-400'} />
                <span>{t('cultura.rule2Footer', 'Flujo continuo y sin empujones')}</span>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                commitments.makeQueue 
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300' 
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
              }`}>
                {commitments.makeQueue ? t('cultura.habitAssumed', 'Hábito asumido') : t('cultura.habitPending', 'Asumir hábito')}
              </span>
            </button>
          </div>

          {/* Norma 3 */}
          <div className={`p-5 rounded-3xl border transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${
            dark ? 'bg-zinc-900/90 border-zinc-800 hover:border-emerald-500/40' : 'bg-white border-zinc-200 hover:border-emerald-500/40'
          }`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <LogOut size={20} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {t('cultura.rule3Tag', 'Regla de Oro')}
                </span>
              </div>
              <h4 className={`text-base font-black mb-1.5 leading-snug ${dark ? 'text-white' : 'text-zinc-900'}`}>
                {t('cultura.rule3Title', 'Dejar salir antes de ingresar')}
              </h4>
              <p className={`text-xs leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {t('cultura.rule3Desc', 'Ubícate a los costados de las puertas en el andén. Permitir el descenso rápido de los usuarios vacía el vagón con agilidad y reduce los tiempos de parada en estación a menos de 40 segundos.')}
              </p>
            </div>
            <button
              onClick={() => toggleCommitment('letExitFirst')}
              className={`w-full pt-3 mt-3 border-t text-left flex items-center justify-between text-[11px] font-bold transition-all cursor-pointer ${
                commitments.letExitFirst 
                  ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                  : 'text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className={commitments.letExitFirst ? 'text-emerald-500' : 'text-zinc-400'} />
                <span>{t('cultura.rule3Footer', 'Entrada 40% más rápida')}</span>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                commitments.letExitFirst 
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300' 
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
              }`}>
                {commitments.letExitFirst ? t('cultura.habitAssumed', 'Hábito asumido') : t('cultura.habitPending', 'Asumir hábito')}
              </span>
            </button>
          </div>

          {/* Norma 4 */}
          <div className={`p-5 rounded-3xl border transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${
            dark ? 'bg-zinc-900/90 border-zinc-800 hover:border-emerald-500/40' : 'bg-white border-zinc-200 hover:border-emerald-500/40'
          }`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Footprints size={20} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {t('cultura.rule4Tag', 'Zonas de Tránsito')}
                </span>
              </div>
              <h4 className={`text-base font-black mb-1.5 leading-snug ${dark ? 'text-white' : 'text-zinc-900'}`}>
                {t('cultura.rule4Title', 'Estaciones para circular')}
              </h4>
              <p className={`text-xs leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {t('cultura.rule4Desc', 'No son zonas para permanecer detenidos u obstaculizar el paso. Camina por la derecha en pasillos y escaleras; deja el carril izquierdo libre para quienes necesitan adelantar con prisa.')}
              </p>
            </div>
            <button
              onClick={() => toggleCommitment('keepMoving')}
              className={`w-full pt-3 mt-3 border-t text-left flex items-center justify-between text-[11px] font-bold transition-all cursor-pointer ${
                commitments.keepMoving 
                  ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                  : 'text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className={commitments.keepMoving ? 'text-emerald-500' : 'text-zinc-400'} />
                <span>{t('cultura.rule4Footer', 'Pasillos y puertas despejadas')}</span>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                commitments.keepMoving 
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300' 
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
              }`}>
                {commitments.keepMoving ? t('cultura.habitAssumed', 'Hábito asumido') : t('cultura.habitPending', 'Asumir hábito')}
              </span>
            </button>
          </div>

          {/* Norma 5 */}
          <div className={`p-5 rounded-3xl border transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${
            dark ? 'bg-zinc-900/90 border-zinc-800 hover:border-emerald-500/40' : 'bg-white border-zinc-200 hover:border-emerald-500/40'
          }`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  {t('cultura.rule5Tag', 'Ética y Empatía')}
                </span>
              </div>
              <h4 className={`text-base font-black mb-1.5 leading-snug ${dark ? 'text-white' : 'text-zinc-900'}`}>
                {t('cultura.rule5Title', 'Pagar el pasaje con orgullo y respeto')}
              </h4>
              <p className={`text-xs leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {t('cultura.rule5Desc', 'Pagar el pasaje con orgullo y actuar con respeto y empatía hacia los operadores, personal de aseo y demás pasajeros. El pago financia la seguridad, tecnología y frecuencia de los trenes.')}
              </p>
            </div>
            <button
              onClick={() => toggleCommitment('payProudly')}
              className={`w-full pt-3 mt-3 border-t text-left flex items-center justify-between text-[11px] font-bold transition-all cursor-pointer ${
                commitments.payProudly 
                  ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                  : 'text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className={commitments.payProudly ? 'text-emerald-500' : 'text-zinc-400'} />
                <span>{t('cultura.rule5Footer', 'Orgullo de ciudad e integridad')}</span>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                commitments.payProudly 
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300' 
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
              }`}>
                {commitments.payProudly ? t('cultura.habitAssumed', 'Hábito asumido') : t('cultura.habitPending', 'Asumir hábito')}
              </span>
            </button>
          </div>

          {/* Tarjeta de Compromiso Activo */}
          <div className={`p-5 rounded-3xl border flex flex-col justify-between ${
            dark 
              ? 'bg-gradient-to-br from-emerald-950/40 to-zinc-900 border-emerald-500/30' 
              : 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200'
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award size={18} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  {t('cultura.commitmentTag', 'Compromiso Cívico')}
                </span>
              </div>
              <h4 className={`text-base font-black leading-tight mb-2 ${dark ? 'text-white' : 'text-zinc-900'}`}>
                {t('cultura.commitmentTitle', '¿Estás en #ModoMetro?')}
              </h4>
              <p className={`text-xs mb-3 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {t('cultura.commitmentDesc', 'Marca tu compromiso con Bogotá. Llevas {count} de 5 normas asumidas.', { count: completedCount })}
              </p>
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide w-full justify-center ${
                isModoMetroHero
                  ? 'bg-emerald-600 text-white shadow-md'
                  : dark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-700'
              }`}>
                <Sparkles size={13} />
                <span>{isModoMetroHero ? t('cultura.commitmentHero', '¡Ciudadano #BogotáModoMetro!') : t('cultura.commitmentIncomplete', 'Completa tus 5 hábitos')}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── ACCIONES Y PARTICIPACIÓN CIUDADANA ── */}
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            {t('cultura.actionsTag', 'Pedagogía en Terreno y Ciudadanía')}
          </span>
          <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
            {t('cultura.actionsTitle', 'Acciones y Participación Ciudadana')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vagón Escuela */}
          <div className={`p-6 rounded-3xl border transition-all ${
            dark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <School size={22} />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {t('cultura.schoolCarTag', 'Pedagogía Itinerante')}
                </span>
                <h4 className={`text-lg font-black tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
                  {t('cultura.schoolCarTitle', 'Vagón Escuela (Metro Escuela)')}
                </h4>
              </div>
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {t('cultura.schoolCarDesc', 'Espacios pedagógicos itinerantes y modelos a escala real donde estudiantes de colegios distritales, familias y comunidades practican directamente las normas de cultura ciudadana, uso de puertas automáticas y validación antes de la inauguración.')}
            </p>
          </div>

          {/* Percepción Ciudadana (Estadísticas Verídicas) */}
          <div className={`p-6 rounded-3xl border transition-all ${
            dark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <TrendingUp size={22} />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {t('cultura.perceptionTag', 'Estudio Oficial EMB')}
                </span>
                <h4 className={`text-lg font-black tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
                  {t('cultura.perceptionTitle', 'Percepción Ciudadana')}
                </h4>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
              <div className={`p-3 rounded-2xl border ${dark ? 'bg-zinc-800/60 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
                <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">95%</p>
                <p className={`text-[10px] font-bold mt-0.5 leading-tight ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {t('cultura.perceptionReality', 'Considera que el Metro es una realidad')}
                </p>
              </div>

              <div className={`p-3 rounded-2xl border ${dark ? 'bg-zinc-800/60 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
                <p className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">90%</p>
                <p className={`text-[10px] font-bold mt-0.5 leading-tight ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {t('cultura.perceptionProgress', 'Lo asocia con progreso y futuro')}
                </p>
              </div>

              <div className={`p-3 rounded-2xl border ${dark ? 'bg-zinc-800/60 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
                <p className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">&gt;70%</p>
                <p className={`text-[10px] font-bold mt-0.5 leading-tight ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {t('cultura.perceptionUsage', 'Planea utilizarlo activamente')}
                </p>
              </div>
            </div>
          </div>

          {/* Talleres en Obra */}
          <div className={`p-6 rounded-3xl border transition-all ${
            dark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <HardHat size={22} />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {t('cultura.workshopsTag', 'Comunidad y Trabajadores')}
                </span>
                <h4 className={`text-lg font-black tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
                  {t('cultura.workshopsTitle', 'Talleres en Obra')}
                </h4>
              </div>
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {t('cultura.workshopsDesc', 'Jornadas pedagógicas permanentes con más de 17.000 trabajadores de la Línea 1 sobre respeto, autocuidado, relacionamiento con los barrios vecinos, reducción de impacto auditivo y convivencia con comerciantes a lo largo del viaducto.')}
            </p>
          </div>

          {/* Memoria y Cultura */}
          <div className={`p-6 rounded-3xl border transition-all ${
            dark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Tv size={22} />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  {t('cultura.memoryTag', 'Canal Capital • Archivo Histórico')}
                </span>
                <h4 className={`text-lg font-black tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
                  {t('cultura.memoryTitle', 'Memoria y Cultura Metro')}
                </h4>
              </div>
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {t('cultura.memoryDesc', 'Documental «El viaje de una ciudad, la hazaña del Metro de Bogotá» (Canal Capital), registrando los 80 años de sueños, planos y el trabajo de ingeniería que hoy materializa el viaducto elevado más moderno de Latinoamérica.')}
            </p>
          </div>
        </div>
      </div>

      {/* ── BOTÓN DE PREGUNTAS A METROBOT IA / REDIRECCIÓN A EMPLEO ── */}
      <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        dark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
      }`}>
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <BookOpen size={20} />
          </div>
          <div>
            <h4 className={`text-sm font-black ${dark ? 'text-white' : 'text-zinc-900'}`}>
              {t('cultura.faqTitle', '¿Dudas sobre cómo actuar en las estaciones?')}
            </h4>
            <p className={`text-xs ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {t('cultura.faqDesc', 'MetroBot IA conoce todas las normas de convivencia y las respuestas pedagógicas oficiales.')}
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenMetroBot(t('cultura.metroBotQuery', '🌱 ¿Cuáles son las normas de cultura ciudadana y #BogotáModoMetro?'))}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{t('cultura.btnConsultMetroBot', 'Consultar a MetroBot IA')}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
