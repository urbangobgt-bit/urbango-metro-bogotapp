import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, 
  Clock, 
  Coins, 
  TrendingUp, 
  ArrowRight, 
  Info, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  HelpCircle, 
  Check, 
  Calendar,
  X,
  ExternalLink,
  Train,
  Heart
} from 'lucide-react';
import { useI18n } from '../i18nContext';
import { MiniTrajectoryMapReal } from './MiniTrajectoryMapReal';
import MetricsSection from './MetricsSection';

// 16 Official Stations of Bogotá Metro Line 1 (EMB)
export const L1_STATIONS = [
  { id: 1, name: 'Estación 1 - Portal Américas / Patio Taller', shortName: 'Patio Taller / Américas', localidad: 'Bosa', km: 0.0 },
  { id: 2, name: 'Estación 2 - Av. Villavicencio con Cra 95A', shortName: 'Cra 95A / Villavicencio', localidad: 'Bosa / Kennedy', km: 1.6 },
  { id: 3, name: 'Estación 3 - Av. Villavicencio con Av. Guayacanes', shortName: 'Av. Guayacanes', localidad: 'Kennedy', km: 3.1 },
  { id: 4, name: 'Estación 4 - Av. Primero de Mayo con Av. Boyacá', shortName: 'Primero de Mayo / Boyacá', localidad: 'Kennedy', km: 5.2 },
  { id: 5, name: 'Estación 5 - Av. Primero de Mayo con Av. 68', shortName: 'Primero de Mayo / Av. 68', localidad: 'Kennedy', km: 7.0 },
  { id: 6, name: 'Estación 6 - Av. Primero de Mayo con Cra 50', shortName: 'Primero de Mayo / Cra 50', localidad: 'Puente Aranda', km: 8.8 },
  { id: 7, name: 'Estación 7 - Av. Primero de Mayo con NQS', shortName: 'Primero de Mayo / NQS', localidad: 'Antonio Nariño', km: 10.7 },
  { id: 8, name: 'Estación 8 - NQS con Calle 8 Sur', shortName: 'NQS / Calle 8 Sur', localidad: 'Antonio Nariño', km: 12.3 },
  { id: 9, name: 'Estación 9 - Calle 1 con Carrera 24', shortName: 'Calle 1 / Cra 24', localidad: 'Los Mártires', km: 14.1 },
  { id: 10, name: 'Estación 10 - Calle 1 con Carrera 10', shortName: 'Calle 1 / Cra 10 (Hortúa)', localidad: 'Santa Fe / San Cristóbal', km: 15.6 },
  { id: 11, name: 'Estación 11 - Av. Caracas con Calle 11', shortName: 'Caracas / Calle 11 (Tercer Milenio)', localidad: 'Santa Fe / Los Mártires', km: 17.2 },
  { id: 12, name: 'Estación 12 - Av. Caracas con Calle 26', shortName: 'Caracas / Calle 26 (Centro)', localidad: 'Santa Fe / Teusaquillo', km: 18.9 },
  { id: 13, name: 'Estación 13 - Av. Caracas con Calle 45', shortName: 'Caracas / Calle 45 (Marly)', localidad: 'Chapinero / Teusaquillo', km: 20.6 },
  { id: 14, name: 'Estación 14 - Av. Caracas con Calle 53', shortName: 'Caracas / Calle 53 (Lourdes)', localidad: 'Chapinero', km: 21.7 },
  { id: 15, name: 'Estación 15 - Av. Caracas con Calle 63', shortName: 'Caracas / Calle 63 (Campín)', localidad: 'Chapinero / Barrios Unidos', km: 22.8 },
  { id: 16, name: 'Estación 16 - Av. Caracas con Calle 72', shortName: 'Caracas / Calle 72 (Intercambiador)', localidad: 'Barrios Unidos / Chapinero', km: 23.9 }
];

export const getLocalizedStation = (station, lang) => {
  if (!station) return null;
  const l = (lang || 'es').toLowerCase();
  
  if (l === 'zh') {
    const zhNames = {
      1: '第1站 - Portal Américas / 博萨车场',
      2: '第2站 - Av. Villavicencio 与 Cra 95A 交叉口',
      3: '第3站 - Av. Villavicencio 与 Av. Guayacanes 交叉口',
      4: '第4站 - Av. Primero de Mayo 与 Av. Boyacá 交叉口',
      5: '第5站 - Av. Primero de Mayo 与 Av. 68 交叉口',
      6: '第6站 - Av. Primero de Mayo 与 Cra 50 交叉口',
      7: '第7站 - Av. Primero de Mayo 与 NQS 交叉口',
      8: '第8站 - NQS 与 Calle 8 Sur 交叉口',
      9: '第9站 - Calle 1 与 Carrera 24 交叉口',
      10: '第10站 - Calle 1 与 Carrera 10 (Hortúa) 交叉口',
      11: '第11站 - Av. Caracas 与 Calle 11 (Tercer Milenio)',
      12: '第12站 - Av. Caracas 与 Calle 26 (市中心)',
      13: '第13站 - Av. Caracas 与 Calle 45 (Marly)',
      14: '第14站 - Av. Caracas 与 Calle 53 (Lourdes)',
      15: '第15站 - Av. Caracas 与 Calle 63 (Campín)',
      16: '第16站 - Av. Caracas 与 Calle 72 (换乘枢纽)'
    };
    const zhLoc = {
      'Bosa': '博萨区 (Bosa)',
      'Bosa / Kennedy': '博萨 / 肯尼迪区',
      'Kennedy': '肯尼迪区 (Kennedy)',
      'Puente Aranda': '普恩特阿兰达区',
      'Antonio Nariño': '安东尼奥纳里尼奥区',
      'Los Mártires': '烈士区 (Los Mártires)',
      'Santa Fe / San Cristóbal': '圣达菲 / 圣克里斯托瓦尔区',
      'Santa Fe / Los Mártires': '圣达菲 / 烈士区',
      'Santa Fe / Teusaquillo': '圣达菲 / 特乌萨基约区',
      'Chapinero / Teusaquillo': '查皮内罗 / 特乌萨基约区',
      'Chapinero': '查皮内罗区 (Chapinero)',
      'Chapinero / Barrios Unidos': '查皮内罗 / 联合区',
      'Barrios Unidos / Chapinero': '联合区 / 查皮内罗'
    };
    return {
      ...station,
      name: zhNames[station.id] || station.name,
      localidad: zhLoc[station.localidad] || station.localidad
    };
  }

  if (l === 'en') {
    return {
      ...station,
      name: station.name.replace(/^Estación (\d+)/, 'Station $1'),
      localidad: station.localidad
    };
  }

  if (l === 'pt') {
    return {
      ...station,
      name: station.name.replace(/^Estación (\d+)/, 'Estação $1'),
      localidad: station.localidad
    };
  }

  return station;
};

export const CitizenImpactModule = ({ dark = false }) => {
  const { t, lang } = useI18n();

  // State: Stations selection
  const [originId, setOriginId] = useState('');
  const [destId, setDestId] = useState('');
  const [tripFrequencyPerWeek, setTripFrequencyPerWeek] = useState(10); // 5 days round-trip = 10 trips
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  // Both stations selected
  const isRouteSelected = Boolean(originId && destId);

  // Swap stations
  const handleSwap = () => {
    if (originId && destId) {
      const temp = originId;
      setOriginId(destId);
      setDestId(temp);
    }
  };

  // Localized stations list
  const localizedStations = useMemo(() => {
    return L1_STATIONS.map(st => getLocalizedStation(st, lang));
  }, [lang]);

  // Calculations based on scientific and official parameters
  const metrics = useMemo(() => {
    const rawOrigin = L1_STATIONS.find(s => s.id === Number(originId)) || null;
    const rawDest = L1_STATIONS.find(s => s.id === Number(destId)) || null;

    const originStation = rawOrigin ? getLocalizedStation(rawOrigin, lang) : null;
    const destStation = rawDest ? getLocalizedStation(rawDest, lang) : null;

    if (!rawOrigin || !rawDest) {
      return {
        originStation: null,
        destStation: null,
        stationDiff: 0,
        distanceKm: '0.0',
        metroMinutes: 0,
        busMinutes: 0,
        minutesSavedPerTrip: 0,
        weeklyMinutesSaved: 0,
        annualHoursSaved: 0,
        annualDaysSaved: '0.0',
        co2SavedKgPerTrip: '0.00',
        co2SavedKgAnnual: 0,
        treesEquivalent: '0.0',
        moneySavedMonthlyCop: 0
      };
    }

    const stationDiff = Math.abs(rawDest.id - rawOrigin.id);
    const distanceKm = Math.abs(rawDest.km - rawOrigin.km) || 1.6;

    // Full 23.9 km takes exactly 27 minutes (Official EMB parameter, speed ~42.5 km/h including stops)
    const metroMinutes = stationDiff === 0 
      ? 0 
      : Math.round(Math.max(3, (stationDiff / 15) * 27));

    // Mixed traffic / bus baseline in Bogotá peak hours:
    const busMinutes = stationDiff === 0
      ? 0
      : Math.round(Math.max(10, (stationDiff / 15) * 88));

    const minutesSavedPerTrip = Math.max(0, busMinutes - metroMinutes);
    const weeklyMinutesSaved = minutesSavedPerTrip * tripFrequencyPerWeek;
    const annualHoursSaved = Math.round((weeklyMinutesSaved * 48) / 60); // 48 work weeks
    const annualDaysSaved = (annualHoursSaved / 24).toFixed(1);

    // CO2 Savings
    const co2SavedKgPerTrip = ((distanceKm * 0.095)).toFixed(2);
    const co2SavedKgAnnual = Math.round(parseFloat(co2SavedKgPerTrip) * tripFrequencyPerWeek * 48);

    // Trees equivalence: 1 mature tree absorbs ~22 kg CO2/year
    const treesEquivalent = Math.max(1, (co2SavedKgAnnual / 22).toFixed(1));

    // Economic savings
    const moneySavedMonthlyCop = Math.round(tripFrequencyPerWeek * 4.2 * 3200);

    return {
      originStation,
      destStation,
      stationDiff,
      distanceKm: distanceKm.toFixed(1),
      metroMinutes,
      busMinutes,
      minutesSavedPerTrip,
      weeklyMinutesSaved,
      annualHoursSaved,
      annualDaysSaved,
      co2SavedKgPerTrip,
      co2SavedKgAnnual,
      treesEquivalent,
      moneySavedMonthlyCop
    };
  }, [originId, destId, tripFrequencyPerWeek, lang]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── HEADER CON BADGES DE RIGOR METODOLÓGICO ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-red-500/10 text-[#B30000] dark:text-red-400 border border-red-500/20">
              <ShieldCheck size={11} />
              <span>{t('citizenImpact.badgeOfficial', 'Dato Oficial EMB')}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Zap size={11} />
              <span>{t('citizenImpact.badgeSimulation', 'Simulación UrbanGo L1')}</span>
            </span>
          </div>

          <h3 className={`text-2xl sm:text-3xl font-black italic tracking-tighter leading-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
            {t('citizenImpact.title', 'Impacto Ciudadano, Eco-Impacto y Tiempo')}
          </h3>
          <p className={`text-xs mt-0.5 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {t('citizenImpact.subtitle', 'Calcula el tiempo recuperado para tu vida y las emisiones de CO₂ mitigadas con el Metro de Bogotá.')}
          </p>
        </div>

        {/* Botón Ver Metodología */}
        <button
          type="button"
          onClick={() => setIsMethodologyOpen(true)}
          className={`self-start md:self-auto flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all shadow-sm active:scale-95 ${
            dark 
              ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800' 
              : 'bg-white border-zinc-200 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50'
          }`}
        >
          <HelpCircle size={14} className="text-[#B30000]" />
          <span>{t('citizenImpact.btnMethodology', 'Metodología y Fuentes')}</span>
        </button>
      </div>

      {/* ── SELECTOR DE ESTACIÓN ORIGEN Y DESTINO (16 ESTACIONES L1) ── */}
      <div className={`p-5 sm:p-6 rounded-3xl border shadow-sm transition-all ${
        dark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-zinc-200'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
          {/* Origen */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{t('citizenImpact.originLabel', 'Estación Origen')}</span>
              </label>
              <span className="text-[9px] font-bold text-zinc-400">
                {metrics.originStation ? metrics.originStation.localidad : t('citizenImpact.toSelect', 'Por elegir')}
              </span>
            </div>
            <select
              value={originId}
              onChange={e => setOriginId(e.target.value ? Number(e.target.value) : '')}
              className={`w-full rounded-2xl px-4 py-3 text-xs sm:text-sm font-black outline-none border transition-all truncate ${
                dark 
                  ? 'bg-zinc-950 border-zinc-700 text-white focus:border-[#B30000]' 
                  : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#B30000]'
              }`}
            >
              <option value="" disabled>{t('citizenImpact.selectOriginPlaceholder', '-- Selecciona Estación Origen --')}</option>
              {localizedStations.map(st => (
                <option key={`orig-${st.id}`} value={st.id} disabled={st.id === Number(destId)}>
                  {st.name} ({st.localidad})
                </option>
              ))}
            </select>
          </div>

          {/* Botón Intercambiar */}
          <div className="flex justify-center pt-2 md:pt-5">
            <button
              type="button"
              onClick={handleSwap}
              disabled={!isRouteSelected}
              className={`p-3 rounded-2xl text-white shadow-md active:scale-95 transition-all ${
                isRouteSelected 
                  ? 'bg-[#B30000] hover:bg-[#960000] cursor-pointer' 
                  : 'bg-zinc-300 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
              }`}
              title={t('citizenImpact.swapStations', 'Intercambiar origen y destino')}
              aria-label={t('citizenImpact.swapStations', 'Intercambiar estaciones')}
            >
              <ArrowRight size={16} className="rotate-90 md:rotate-0" />
            </button>
          </div>

          {/* Destino */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#B30000]" />
                <span>{t('citizenImpact.destLabel', 'Estación Destino')}</span>
              </label>
              <span className="text-[9px] font-bold text-zinc-400">
                {metrics.destStation ? metrics.destStation.localidad : t('citizenImpact.toSelect', 'Por elegir')}
              </span>
            </div>
            <select
              value={destId}
              onChange={e => setDestId(e.target.value ? Number(e.target.value) : '')}
              className={`w-full rounded-2xl px-4 py-3 text-xs sm:text-sm font-black outline-none border transition-all truncate ${
                dark 
                  ? 'bg-zinc-950 border-zinc-700 text-white focus:border-[#B30000]' 
                  : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#B30000]'
              }`}
            >
              <option value="" disabled>{t('citizenImpact.selectDestPlaceholder', '-- Selecciona Estación Destino --')}</option>
              {localizedStations.map(st => (
                <option key={`dest-${st.id}`} value={st.id} disabled={st.id === Number(originId)}>
                  {st.name} ({st.localidad})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Frecuencia semanal slider */}
        <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Calendar size={14} className="text-[#B30000]" />
            <span className="font-medium">{t('citizenImpact.tripFreqLabel', 'Frecuencia de viaje:')}</span>
            <span className="font-black text-zinc-900 dark:text-white">
              {t('citizenImpact.tripsPerWeek', { count: tripFrequencyPerWeek, defaultValue: `${tripFrequencyPerWeek} viajes / semana` })}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={2}
              max={14}
              step={2}
              value={tripFrequencyPerWeek}
              onChange={e => setTripFrequencyPerWeek(Number(e.target.value))}
              className="w-40 accent-[#B30000] cursor-pointer"
            />
            <span className="text-[10px] font-bold text-zinc-400">
              {t('citizenImpact.roundTripDays', { days: tripFrequencyPerWeek / 2, defaultValue: `(${tripFrequencyPerWeek / 2} días ida/vuelta)` })}
            </span>
          </div>
        </div>
      </div>

      {/* ── MINI MAPA DINÁMICO DEL TRAZADO LÍNEA 1 ── */}
      <AnimatePresence mode="wait">
        {isRouteSelected ? (
          <motion.div
            key={`mini-map-${originId}-${destId}`}
            initial={{ opacity: 0, height: 0, scale: 0.97 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full overflow-hidden"
          >
            <MiniTrajectoryMapReal
              originId={Number(originId)}
              destId={Number(destId)}
              dark={dark}
              onSelectStation={(stId) => {
                if (stId !== Number(originId)) {
                  setDestId(stId);
                }
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="mini-map-empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`p-5 rounded-3xl border border-dashed flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left ${
              dark ? 'bg-zinc-900/30 border-zinc-800 text-zinc-400' : 'bg-zinc-50/70 border-zinc-300 text-zinc-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#B30000]/10 border border-[#B30000]/25 text-[#B30000] flex items-center justify-center flex-shrink-0">
                <Train size={17} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white">
                  {t('citizenImpact.miniMapWaitTitle', 'Mini Mapa de Trayectoria en Espera')}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {t('citizenImpact.miniMapWaitDesc', 'Elige la Estación de Origen y la Estación de Destino en el selector superior para desplegar el mapa interactivo con zoom automático.')}
                </p>
              </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex-shrink-0">
              {t('citizenImpact.stationsBadge', '16 Estaciones EMB')}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CUADRO COMPARATIVO DE TIEMPOS Y ECO-IMPACTO (METRICS SECTION) ── */}
      <MetricsSection metrics={metrics} dark={dark} />

      {/* ── MODAL DE METODOLOGÍA Y FUENTES CIENTÍFICAS ── */}
      {isMethodologyOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsMethodologyOpen(false)}
        >
          <div 
            className={`w-full max-w-lg rounded-3xl p-6 border shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 ${
              dark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3 border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#B30000]" />
                <h4 className="font-black text-base italic">
                  {t('citizenImpact.methodologyTitle', 'Metodología y Fuentes Científicas')}
                </h4>
              </div>
              <button 
                onClick={() => setIsMethodologyOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
                aria-label="Cerrar modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-[#B30000] dark:text-red-300">
                <p className="font-bold">{t('citizenImpact.ethicalDistinctionTitle', 'Distinción Ética de Datos:')}</p>
                <p className="text-[11px] mt-0.5">
                  {t('citizenImpact.ethicalDistinctionDesc', 'UrbanGo distingue rigurosamente entre los parámetros contractuales suministrados por la Empresa Metro de Bogotá (EMB) y las proyecciones algorítmicas de nuestra simulación.')}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-zinc-900 dark:text-white uppercase text-[10px] tracking-wider mb-1">
                  {t('citizenImpact.methodologyPoint1Title', '1. Velocidad Comercial y Tiempos de Recorrido (EMB Oficial)')}
                </h5>
                <p className="text-zinc-400 text-[11px]">
                  {t('citizenImpact.methodologyPoint1Desc', 'La Línea 1 cuenta con 23,9 km de viaducto elevado y 16 estaciones. La velocidad máxima de diseño es de 80 km/h, con una velocidad comercial promedio de 42,5 km/h (incluyendo 20 a 30 segundos de parada en cada andén). El recorrido completo entre Bosa (Patio Taller) y la Calle 72 toma exactamente 27 minutos.')}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-zinc-900 dark:text-white uppercase text-[10px] tracking-wider mb-1">
                  {t('citizenImpact.methodologyPoint2Title', '2. Línea Base de Tráfico Mixto (Encuesta de Movilidad de Bogotá)')}
                </h5>
                <p className="text-zinc-400 text-[11px]">
                  {t('citizenImpact.methodologyPoint2Desc', 'El tiempo actual de comparación proviene de la matriz Origen-Destino de la Secretaría Distrital de Movilidad para las horas pico (06:30-08:30 y 17:30-19:30), donde el trayecto Bosa-Calle 72 oscila entre 85 y 105 minutos debido a intersecciones y paraderos frecuentes.')}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-zinc-900 dark:text-white uppercase text-[10px] tracking-wider mb-1">
                  {t('citizenImpact.methodologyPoint3Title', '3. Factor de Emisión y Descarbonización (UPME & IPCC)')}
                </h5>
                <p className="text-zinc-400 text-[11px]">
                  {t('citizenImpact.methodologyPoint3Desc', 'El cálculo de mitigación de CO₂ aplica el factor del Sistema Interconectado Nacional de Colombia (UPME 2024), donde la matriz eléctrica genera menos de 0.12 kg CO₂/kWh por su predominancia hidroeléctrica. Esto genera una reducción neta estimada de 95 gramos de CO₂ evitados por pasajero-kilómetro frente al mix vehicular actual.')}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsMethodologyOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#B30000] text-white text-xs font-black uppercase tracking-wider"
              >
                {t('citizenImpact.btnUnderstood', 'Entendido')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenImpactModule;
