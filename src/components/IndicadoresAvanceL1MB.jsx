import React, { useState } from 'react';
import { METRICAS_L1MB_OFICIALES } from '../data/metroOfficialData';
import { useI18n } from '../i18nContext';
import { 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  Layers, 
  Zap, 
  ChevronRight, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  Activity,
  Award
} from 'lucide-react';

export const IndicadoresAvanceL1MB = ({ 
  dark = false, 
  showSummary = true, 
  showFrentes = true 
}) => {
  const { t } = useI18n();
  const [selectedViga, setSelectedViga] = useState(null);
  const data = METRICAS_L1MB_OFICIALES;

  return (
    <div className="space-y-4">
      {/* ── TARJETA PRINCIPAL: AVANCE FÍSICO GENERAL ── */}
      {showSummary && (
      <div className={`rounded-3xl p-5 sm:p-6 border shadow-xl transition-all duration-300 relative overflow-hidden ${
        dark ? 'bg-zinc-900/90 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
      }`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-red-600/10 via-transparent to-transparent pointer-events-none rounded-tr-3xl" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-[#B30000] dark:text-red-400 text-[9px] font-black uppercase tracking-widest mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B30000] animate-pulse" />
              <span>{t('indicators.officialDataBadge', 'Datos Oficiales EMB · Informe 2025')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black italic tracking-tight">{t('indicators.title', 'Avance Físico General (L1MB)')}</h3>
            <p className={`text-xs font-semibold ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {t('indicators.planSubtitle', 'Línea 1 del Metro de Bogotá · Plan de Ejecución V14')}
            </p>
          </div>

          <div className="flex items-baseline gap-2 self-start sm:self-auto">
            <div className="text-left sm:text-right">
              <span className="text-4xl sm:text-5xl font-black tracking-tighter text-[#B30000]">
                {data.avanceFisicoGeneral.ejecutado}%
              </span>
              <span className={`block text-[9px] font-black uppercase tracking-wider ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {t('indicators.actualProgress', 'Ejecutado real')}
              </span>
            </div>
          </div>
        </div>

        {/* Barra de progreso comparativa (Ejecutado vs Programado) */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className={dark ? 'text-zinc-300' : 'text-zinc-700'}>{t('indicators.cumulativeExecution', 'Ejecución Física Acumulada')}</span>
            <span className="font-mono font-black text-[#B30000]">{data.avanceFisicoGeneral.ejecutado}% / {data.avanceFisicoGeneral.programado}% {t('indicators.prog', 'prog.')}</span>
          </div>
          <div className={`w-full h-4 rounded-full overflow-hidden p-0.5 border ${dark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-100 border-zinc-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-[#B30000] via-red-600 to-amber-500 rounded-full transition-all duration-1000 relative shadow-sm"
              style={{ width: `${data.avanceFisicoGeneral.ejecutado}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]" />
            </div>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500">
            <span>{t('indicators.start', '0% (Inicio)')}</span>
            <span className="text-amber-500 flex items-center gap-1">
              <span>{t('indicators.prog', 'Programado:')} {data.avanceFisicoGeneral.programado}%</span>
            </span>
            <span>{t('indicators.completionDate', '100% (Marzo 2028)')}</span>
          </div>
        </div>

        {/* Indicador SPI y Cumplimiento */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 border-t border-zinc-500/20">
          <div className={`p-2.5 rounded-2xl border ${dark ? 'bg-zinc-800/60 border-zinc-700/60' : 'bg-zinc-50 border-zinc-200'}`}>
            <span className={`text-[8px] font-black uppercase tracking-wider block ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {t('indicators.spiIndex', 'Índice SPI (Cronograma)')}
            </span>
            <span className="text-lg font-black text-[#2D8B3C] flex items-center gap-1">
              <TrendingUp size={16} /> {data.avanceFisicoGeneral.spi}%
            </span>
            <span className={`text-[8px] font-medium block mt-0.5 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {t('indicators.highPerformance', 'Alto desempeño técnico')}
            </span>
          </div>

          <div className={`p-2.5 rounded-2xl border ${dark ? 'bg-zinc-800/60 border-zinc-700/60' : 'bg-zinc-50 border-zinc-200'}`}>
            <span className={`text-[8px] font-black uppercase tracking-wider block ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {t('indicators.milestone2026', 'Hito Operativo 2026')}
            </span>
            <span className="text-lg font-black text-amber-500 flex items-center gap-1">
              <Activity size={16} /> 5,7 km
            </span>
            <span className={`text-[8px] font-medium block mt-0.5 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {t('indicators.testRollingStock', 'Pruebas Patio Taller a E4')}
            </span>
          </div>

          <div className={`col-span-2 sm:col-span-1 p-2.5 rounded-2xl border ${dark ? 'bg-zinc-800/60 border-zinc-700/60' : 'bg-zinc-50 border-zinc-200'}`}>
            <span className={`text-[8px] font-black uppercase tracking-wider block ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {t('indicators.completionDate', 'Operación Comercial')}
            </span>
            <span className="text-lg font-black text-[#B30000] flex items-center gap-1">
              <Calendar size={16} /> {data.hitoOperativo2026.aperturaComercial}
            </span>
            <span className={`text-[8px] font-medium block mt-0.5 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {t('indicators.continuousExecution', 'Entrega Estación 1 (2026)')}
            </span>
          </div>
        </div>
      </div>
      )}

      {/* ── CUADRÍCULA DE FRENTES CRÍTICOS (PATIO TALLER, VIADUCTO, MATERIAL RODANTE, INTERCAMBIADOR 72) ── */}
      {showFrentes && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* 1. PATIO TALLER BOSA */}
        <div className={`rounded-3xl p-5 border shadow-md transition-colors ${
          dark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏭</span>
              <div>
                <h4 className="font-black italic text-base leading-tight">{t('indicators.patioTallerTitle', 'Patio Taller (Bosa)')}</h4>
                <p className={`text-[9px] font-black uppercase tracking-wider ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {t('indicators.patioTallerSub', 'Cerebro del Sistema')}
                </p>
              </div>
            </div>
            <span className="text-2xl font-black text-[#2D8B3C] font-mono">
              {data.patioTaller.avance}%
            </span>
          </div>

          <div className="space-y-2 mb-3">
            <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
              <div className="h-full bg-[#2D8B3C] rounded-full transition-all duration-700" style={{ width: `${data.patioTaller.avance}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
              <div className={`p-2 rounded-xl ${dark ? 'bg-zinc-800/80 text-zinc-300' : 'bg-zinc-50 text-zinc-700'}`}>
                <span className="text-emerald-500 font-black block text-xs">{t('indicators.unitsCompleted', '32 UE Terminadas')}</span>
                <span>{t('indicators.ofTotalUnits', 'de 43 Unidades totales')}</span>
              </div>
              <div className={`p-2 rounded-xl ${dark ? 'bg-zinc-800/80 text-zinc-300' : 'bg-zinc-50 text-zinc-700'}`}>
                <span className="text-amber-500 font-black block text-xs">{t('indicators.unitsExecuting', '10 UE en Ejecución')}</span>
                <span>{t('indicators.finishesTrack', 'acabados y vía definitiva')}</span>
              </div>
            </div>
          </div>

          <div className={`p-2.5 rounded-2xl border text-[10px] font-medium flex items-center justify-between ${
            dark ? 'bg-zinc-800/50 border-zinc-700/60 text-zinc-300' : 'bg-emerald-50/50 border-emerald-200 text-zinc-800'
          }`}>
            <span className="flex items-center gap-1.5">
              <span>🛤️</span>
              <span><strong>13.300 m</strong> {t('indicators.ballastTrack', 'de vía férrea en balasto instalados')}</span>
            </span>
            <span className="text-emerald-600 font-black text-[9px] uppercase tracking-wider">80% Balasto</span>
          </div>
        </div>

        {/* 2. VIADUCTO Y VIGAS LANZADORAS */}
        <div className={`rounded-3xl p-5 border shadow-md transition-colors ${
          dark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌉</span>
              <div>
                <h4 className="font-black italic text-base leading-tight">{t('indicators.viaductoTitle', 'Viaducto Elevado')}</h4>
                <p className={`text-[9px] font-black uppercase tracking-wider ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {t('indicators.viaductoSub', '6 vigas lanzadoras activas')}
                </p>
              </div>
            </div>
            <span className="text-2xl font-black text-[#B30000] font-mono">
              {data.viaducto.ejecutado}%
            </span>
          </div>

          <div className="space-y-2 mb-3">
            <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
              <div className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-700" style={{ width: `${data.viaducto.ejecutado}%` }} />
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className={dark ? 'text-zinc-400' : 'text-zinc-600'}>{t('indicators.scheduledTarget', 'Meta Programada:')} {data.viaducto.programado}%</span>
              <span className="text-[#2D8B3C] font-black">{t('indicators.performanceLabel', 'Desempeño:')} {data.viaducto.desempeno}%</span>
            </div>
          </div>

          {/* Lista interactiva de vigas lanzadoras */}
          <div className="space-y-1.5">
            <span className={`text-[9px] font-black uppercase tracking-wider block ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {t('indicators.gantriesTitle', 'Vigas lanzadoras simultáneas:')}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {data.viaducto.vigasLanzadoras.map(v => (
                <button
                  key={v.nombre}
                  onClick={() => setSelectedViga(selectedViga === v.nombre ? null : v.nombre)}
                  className={`px-2 py-1 rounded-lg text-[9px] font-black tracking-wider transition-all border ${
                    selectedViga === v.nombre
                      ? 'bg-[#B30000] text-white border-[#B30000] shadow-sm'
                      : dark ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
                  }`}
                  title={`${v.frente} - ${v.tramo}`}
                >
                  🏗️ {v.nombre}
                </button>
              ))}
            </div>

            {selectedViga && (
              <div className={`p-2.5 rounded-xl border text-[10px] font-medium animate-in fade-in duration-200 mt-1.5 ${
                dark ? 'bg-red-950/30 border-red-800/40 text-red-200' : 'bg-red-50 border-red-200 text-red-900'
              }`}>
                {(() => {
                  const item = data.viaducto.vigasLanzadoras.find(x => x.nombre === selectedViga);
                  return item ? (
                    <div>
                      <span className="font-black uppercase block">Viga {item.nombre} ({item.frente})</span>
                      <span>Tramo de intervención: {item.tramo}</span>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>
        </div>

        {/* 3. MATERIAL RODANTE Y VÍAS */}
        <div className={`rounded-3xl p-5 border shadow-md transition-colors ${
          dark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚆</span>
              <div>
                <h4 className="font-black italic text-base leading-tight">{t('indicators.rollingStockTitle', 'Material Rodante y Vías')}</h4>
                <p className={`text-[9px] font-black uppercase tracking-wider ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {t('indicators.rollingStockSub', 'Pruebas Dinámicas en marcha')}
                </p>
              </div>
            </div>
            <span className="text-xs font-black uppercase px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/30">
              {t('indicators.trainsReceived', '4 Trenes Recibidos')}
            </span>
          </div>

          <div className="space-y-2 text-xs font-medium">
            <div className={`p-2.5 rounded-2xl border ${dark ? 'bg-zinc-800/60 border-zinc-700/60' : 'bg-zinc-50 border-zinc-200'}`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">{t('indicators.slabTrack', 'Vía en placa sobre viaducto:')}</span>
                <span className="font-black text-[#B30000]">2.759 m</span>
              </div>
              <span className={`text-[9px] ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {t('indicators.thirdRailWork', 'Montaje de tercer riel e interestaciones 1 y 2 en ejecución')}
              </span>
            </div>

            <div className={`p-2.5 rounded-2xl border ${dark ? 'bg-zinc-800/60 border-zinc-700/60' : 'bg-zinc-50 border-zinc-200'}`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">{t('indicators.cbtcSystem', 'Sistema de Control CBTC:')}</span>
                <span className="font-black text-emerald-500">GoA4 Driverless</span>
              </div>
              <span className={`text-[9px] ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {t('indicators.substationsEnergized', 'Subestación SER-1 y SET energizadas para pruebas dinámicas')}
              </span>
            </div>
          </div>
        </div>

        {/* 4. INTERCAMBIADOR CALLE 72 */}
        <div className={`rounded-3xl p-5 border shadow-md transition-colors ${
          dark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔄</span>
              <div>
                <h4 className="font-black italic text-base leading-tight">{t('indicators.intercambiadorTitle', 'Intercambiador Calle 72')}</h4>
                <p className={`text-[9px] font-black uppercase tracking-wider ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {t('indicators.intercambiadorSub', 'Av. Caracas con Calle 72')}
                </p>
              </div>
            </div>
            <span className="text-2xl font-black text-[#2D8B3C] font-mono">
              100%
            </span>
          </div>

          <div className="space-y-2">
            <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
              <div className="h-full bg-[#2D8B3C] rounded-full" style={{ width: '100%' }} />
            </div>

            <div className={`p-3 rounded-2xl border text-xs leading-relaxed ${
              dark ? 'bg-emerald-950/20 border-emerald-800/30 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-center gap-2 font-black mb-1 text-[11px] uppercase tracking-wider">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>{t('indicators.intercambiadorStatus', 'Totalmente Operativo')}</span>
              </div>
              <p className="text-[10px] font-medium">
                {t('indicators.intercambiadorDesc', 'Paso a desnivel deprimido de la Calle 72 en funcionamiento vehicular pleno. Acta de terminación suscrita (UE-304) y espacio público entregado para conexión con la Estación 16.')}
              </p>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
export default IndicadoresAvanceL1MB;
