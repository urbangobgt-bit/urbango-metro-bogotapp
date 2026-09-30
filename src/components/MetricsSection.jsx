import React from 'react';
import { useLanguage } from '../LanguageContext';
import { 
  Car, 
  Train, 
  Clock, 
  ShieldCheck, 
  Leaf, 
  Coins, 
  TrendingUp, 
  Heart,
  Zap
} from 'lucide-react';

/**
 * Format dynamic numbers cleanly to prevent ugly outputs like "0.0 días"
 */
export const formatCleanDays = (val) => {
  const num = parseFloat(val);
  if (isNaN(num) || num <= 0) return '0';
  if (Number.isInteger(num) || num % 1 === 0) return String(Math.round(num));
  return num.toFixed(1).replace(/\.0$/, '');
};

export const formatCleanTrees = (val) => {
  const num = parseFloat(val);
  if (isNaN(num) || num <= 0) return '0';
  if (Number.isInteger(num) || num % 1 === 0) return String(Math.round(num));
  return num.toFixed(1).replace(/\.0$/, '');
};

export const formatCleanCurrency = (val) => {
  const num = Number(val);
  if (isNaN(num) || num <= 0) return '0';
  return num.toLocaleString('es-CO');
};

export default function MetricsSection({ 
  metrics = null, 
  dark = false,
  className = ''
}) {
  const { t, language } = useLanguage();

  // Fallback defaults for executive demo or standalone showcase
  const m = metrics || {
    busMinutes: 88,
    metroMinutes: 27,
    distanceKm: '23.9',
    stationDiff: 15,
    minutesSavedPerTrip: 61,
    annualHoursSaved: 488,
    annualDaysSaved: '20.3',
    co2SavedKgAnnual: 109,
    treesEquivalent: '5.0',
    moneySavedMonthlyCop: 134400
  };

  const formattedDays = formatCleanDays(m.annualDaysSaved);
  const formattedTrees = formatCleanTrees(m.treesEquivalent);
  const formattedMoney = formatCleanCurrency(m.moneySavedMonthlyCop);
  const formattedMinutesSaved = Math.max(0, Math.round(Number(m.minutesSavedPerTrip) || 0));

  return (
    <div className={`space-y-4 ${className}`}>
      {/* ── FILA 1: CUADRO COMPARATIVO DE TIEMPOS (3 TARJETAS) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Tráfico Mixto Actual / Hora Pico */}
        <div 
          className={`p-5 rounded-3xl border flex flex-col justify-between space-y-3 shadow-md transition-all ${
            dark 
              ? 'bg-zinc-900/80 border-zinc-800 text-zinc-100 hover:border-zinc-700' 
              : 'bg-white border-zinc-200 text-zinc-900 hover:border-zinc-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Car size={13} className="text-zinc-400" />
                {t('metrics.mixedTrafficTitle', t('impact.mixedTrafficTitle', 'Tráfico Mixto Actual'))}
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300/50 dark:border-zinc-700">
                {t('metrics.mixedTrafficBadge', t('impact.mixedTrafficBadge', 'Hora Pico'))}
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-700 dark:text-zinc-200">
                {m.busMinutes || 0}
              </span>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                {t('metrics.minutes', t('impact.minutes', 'minutos'))}
              </span>
            </div>

            <p className={`text-xs mt-2.5 leading-snug font-medium ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {t('metrics.mixedTrafficDesc', t('impact.mixedTrafficDesc', 'En buses SITP y corredores semaforizados con congestión típica.'))}
            </p>
          </div>

          <div className={`pt-2.5 border-t text-[10px] font-semibold flex items-center justify-between ${
            dark ? 'border-zinc-800 text-zinc-500' : 'border-zinc-100 text-zinc-400'
          }`}>
            <span>
              {t('metrics.distancePrefix', t('impact.distancePrefix', 'Distancia: ~'))}{m.distanceKm || '0'} km
            </span>
            <span className="uppercase text-[9px] tracking-wider text-zinc-400">
              {t('metrics.corridorBaseline', t('impact.corridorBaseline', 'Corredor Caracas / Mayor'))}
            </span>
          </div>
        </div>

        {/* 2. Metro Línea 1 (Oficial EMB) */}
        <div className="p-5 rounded-3xl border border-red-500/40 bg-gradient-to-br from-red-600 via-[#B30000] to-[#8B0000] text-white shadow-xl shadow-red-950/20 flex flex-col justify-between space-y-3 relative overflow-hidden group">
          {/* Subtle decorative glow */}
          <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-100 flex items-center gap-1.5">
                <Train size={13} className="text-white" />
                {t('metrics.metroTitle', t('impact.metroTitle', 'Metro Línea 1 (Oficial EMB)'))}
              </span>
              <span className="text-[9px] font-black px-2.5 py-0.5 rounded-full bg-white/20 text-white flex items-center gap-1 backdrop-blur-xs border border-white/20 shadow-xs">
                <Zap size={10} className="fill-amber-300 text-amber-300" />
                {t('metrics.metroBadge', t('impact.metroBadge', '100% Eléctrico'))}
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-sm">
                {m.metroMinutes || 0}
              </span>
              <span className="text-xs font-bold text-red-100 uppercase tracking-wider">
                {t('metrics.minutes', t('impact.minutes', 'minutos'))}
              </span>
            </div>

            <p className="text-xs text-red-50/95 mt-2.5 leading-snug font-medium">
              {t('metrics.metroDesc', t('impact.metroDesc', 'Velocidad comercial de 42.5 km/h, vía segregada y sin trancones.'))}
            </p>
          </div>

          <div className="pt-2.5 border-t border-white/20 text-[10px] text-red-100 flex items-center justify-between font-bold">
            <span className="flex items-center gap-1">
              <span>{m.stationDiff || 0}</span>
              <span>{t('metrics.intermediateStations', t('impact.intermediateStations', 'estaciones intermedias'))}</span>
            </span>
            <span className="bg-black/20 px-2 py-0.5 rounded-lg text-white font-black tracking-wide">
              {t('metrics.savingsPrefix', t('impact.savingsPrefix', 'Ahorro:'))} {formattedMinutesSaved} min
            </span>
          </div>
        </div>

        {/* 3. Tiempo Recuperado al Año / Bienestar Familiar */}
        <div 
          className={`p-5 rounded-3xl border flex flex-col justify-between space-y-3 shadow-md transition-all ${
            dark 
              ? 'bg-zinc-900/80 border-zinc-800 text-zinc-100 hover:border-emerald-500/30' 
              : 'bg-white border-zinc-200 text-zinc-900 hover:border-emerald-400'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Clock size={13} />
                {t('metrics.timeSavedTitle', t('impact.timeSavedTitle', 'TIEMPO RECUPERADO AL AÑO'))}
              </span>
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {t('metrics.timeSavedBadge', t('impact.timeSavedBadge', 'Bienestar Familiar'))}
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                {m.annualHoursSaved || 0}
              </span>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                {t('metrics.hoursPerYear', t('impact.hoursPerYear', 'horas / año'))}
              </span>
            </div>

            <p className={`text-xs mt-2.5 leading-snug font-medium ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {t('metrics.timeSavedLifeDesc', {
                days: formattedDays,
                defaultValue: `Equivalente a ${formattedDays} días completos de vida que no pasarás atrapado en el tráfico.`
              })}
            </p>
          </div>

          <div className={`pt-2.5 border-t text-[10px] flex items-center gap-1.5 font-semibold ${
            dark ? 'border-zinc-800 text-zinc-400' : 'border-zinc-100 text-zinc-500'
          }`}>
            <Heart size={12} className="text-rose-500 shrink-0 fill-rose-500" />
            <span className="truncate">
              {t('metrics.timeSavedWellness', t('impact.timeSavedWellness', 'Tiempo para descansar, estudiar y compartir.'))}
            </span>
          </div>
        </div>
      </div>

      {/* ── FILA 2: ECO-IMPACTO, AHORRO Y EFICIENCIA (3 TARJETAS) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 4. CO₂ Mitigado */}
        <div 
          className={`p-5 rounded-3xl border flex items-center gap-4 shadow-md transition-all ${
            dark 
              ? 'bg-zinc-900/80 border-zinc-800 text-zinc-100 hover:border-emerald-500/30' 
              : 'bg-white border-zinc-200 text-zinc-900 hover:border-emerald-400'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-xs">
            <Leaf size={22} className="stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5">
              {t('metrics.co2Title', t('impact.co2Title', 'CO₂ MITIGADO'))}
            </p>
            <p className={`text-xl font-black tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
              {m.co2SavedKgAnnual || 0} kg CO₂{' '}
              <span className="text-xs font-semibold text-zinc-400">
                / {t('metrics.perYear', t('impact.perYear', 'año'))}
              </span>
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold truncate mt-0.5">
              {t('metrics.co2TreesDesc', {
                trees: formattedTrees,
                defaultValue: `Equivalente al oxígeno de ${formattedTrees} árboles adultos`
              })}
            </p>
          </div>
        </div>

        {/* 5. Ahorro Estimado de Bolsillo */}
        <div 
          className={`p-5 rounded-3xl border flex items-center gap-4 shadow-md transition-all ${
            dark 
              ? 'bg-zinc-900/80 border-zinc-800 text-zinc-100 hover:border-amber-500/30' 
              : 'bg-white border-zinc-200 text-zinc-900 hover:border-amber-400'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20 shadow-xs">
            <Coins size={22} className="stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-0.5">
              {t('metrics.pocketSavingsTitle', t('impact.pocketSavingsTitle', 'AHORRO ESTIMADO DE BOLSILLO'))}
            </p>
            <p className={`text-xl font-black tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
              ${formattedMoney}{' '}
              <span className="text-xs font-semibold text-zinc-400">
                COP / {t('metrics.perMonth', t('impact.perMonth', 'mes'))}
              </span>
            </p>
            <p className={`text-[11px] font-medium truncate mt-0.5 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {t('metrics.pocketSavingsDesc', t('impact.pocketSavingsDesc', 'Menos gastos en combustible y traslados mixtos'))}
            </p>
          </div>
        </div>

        {/* 6. Eficiencia Operativa */}
        <div 
          className={`p-5 rounded-3xl border flex items-center gap-4 shadow-md transition-all sm:col-span-2 lg:col-span-1 ${
            dark 
              ? 'bg-zinc-900/80 border-zinc-800 text-zinc-100 hover:border-sky-500/30' 
              : 'bg-white border-zinc-200 text-zinc-900 hover:border-sky-400'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20 shadow-xs">
            <TrendingUp size={22} className="stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-0.5">
              {t('metrics.operationalEfficiencyTitle', t('impact.operationalEfficiencyTitle', 'EFICIENCIA OPERATIVA'))}
            </p>
            <p className={`text-xl font-black tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
              72.000{' '}
              <span className="text-xs font-semibold text-zinc-400">
                {t('metrics.paxUnit', t('impact.paxUnit', 'pax/hora/sentido'))}
              </span>
            </p>
            <p className={`text-[11px] font-medium truncate mt-0.5 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {t('metrics.operationalEfficiencyDesc', t('impact.operationalEfficiencyDesc', 'Frecuencia de 180 segundos en hora pico'))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
