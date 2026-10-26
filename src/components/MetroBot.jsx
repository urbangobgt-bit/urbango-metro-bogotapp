import React, { Fragment, useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, 
  Send, 
  ArrowRight, 
  MapPin, 
  Compass, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Briefcase,
  Newspaper,
  CreditCard,
  MessageSquare,
  Map as MapIcon,
  HeartHandshake
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import MetroBotAvatar from './MetroBotAvatar';
import { 
  getMetroBotResponse, 
  getInitialBotGreeting, 
  KNOWLEDGE_BASE, 
  isRouteOrMapQuery, 
  isEmploymentQuery 
} from '../utils/metroBotEngine';
import { DEFAULT_16_STATIONS } from './InteractiveMap';
import { sanitizeChatMessage, detectSqlInjection } from '../utils/securitySanitizer';

// === CHIPS DINÁMICOS CONTEXTUALES POR CATEGORÍA ===
const DYNAMIC_CHIPS = {
  es: [
    { id: 'c_empleo', label: '💼 Convocatorias de Empleo', category: 'empleo', prompt: '💼 ¿Cuáles son las convocatorias de empleo y vacantes del Metro de Bogotá?' },
    { id: 'c_cultura', label: '🌱 Cultura #BogotáModoMetro', category: 'cultura', prompt: '🌱 ¿Cuáles son las normas de cultura ciudadana y #BogotáModoMetro?' },
    { id: 'c0a', label: '📍 Multiplaza y conexiones', category: 'rutas', prompt: '📍 ¿Qué estaciones quedan cerca de Multiplaza?' },
    { id: 'c0b', label: '🗺️ De Fontibón a Centro Mayor', category: 'rutas', prompt: '🗺️ ¿Cómo llego desde Fontibón a Centro Mayor?' },
    { id: 'c0d', label: '🚇 Las 16 Estaciones (PLMB)', category: 'estaciones', prompt: '🚇 ¿Cuáles son las 16 estaciones de la Primera Línea del Metro?' },
    { id: 'c3', label: '💳 Tarjeta TuLlave y Tarifas', category: 'tarifas', prompt: '💳 ¿Cómo personalizar la tarjeta TuLlave, tarifas vigentes y subsidios?' },
    { id: 'c10', label: '🚧 Estado de obra (82.33%)', category: 'obras', prompt: '🚧 ¿Cuál es el estado de avance de la obra (82.33%)?' },
    { id: 'c_noticias', label: '📰 Noticias Oficiales', category: 'noticias', prompt: '📰 ¿Cuáles son las últimas noticias del Metro de Bogotá?' },
    { id: 'c1', label: '📍 Estaciones en Kennedy', category: 'estaciones', prompt: '📍 ¿Cuáles estaciones me quedan cerca de Kennedy?' },
    { id: 'c2', label: '👥 Aforo de personas', category: 'capacidad', prompt: '👥 ¿Cuál es el aforo y capacidad de personas?' },
    { id: 'c7', label: '⏱️ Tiempo Bosa a Calle 72', category: 'tiempo', prompt: '⏱️ ¿Cuánto tiempo tomará ir desde Bosa o Kennedy al Centro?' },
    { id: 'c9', label: '🚇 Línea 2 a Suba', category: 'proyectos', prompt: '🚇 ¿Cómo será la Segunda Línea del Metro a Suba?' }
  ],
  en: [
    { id: 'c0a', label: '📍 Multiplaza connections', category: 'routes', prompt: '📍 Which stations are near Multiplaza?' },
    { id: 'c0b', label: '🗺️ Fontibón to Centro Mayor', category: 'routes', prompt: '🗺️ How do I get from Fontibón to Centro Mayor?' },
    { id: 'c0d', label: '🚇 All 16 Metro Stations', category: 'stations', prompt: '🚇 What are the 16 stations of Bogotá Metro Line 1?' },
    { id: 'c3', label: '💳 TuLlave Card & Fares', category: 'fares', prompt: '💳 How do fares, TuLlave card, and $0 transfers work?' },
    { id: 'c4', label: '💼 Jobs at SENA & Metro', category: 'jobs', prompt: '💼 How can I apply for job openings at SENA and Metro Línea 1?' },
    { id: 'c1', label: '📍 Stations in Kennedy', category: 'stations', prompt: '📍 Which stations are located in Kennedy?' },
    { id: 'c10', label: '🚧 Progress (82.33%)', category: 'progress', prompt: '🚧 What is the official construction progress (82.33%)?' },
    { id: 'c2', label: '👥 Passenger Capacity', category: 'capacity', prompt: '👥 What is the passenger capacity and volume?' },
    { id: 'c5', label: '📍 Where is the Patio Taller?', category: 'stations', prompt: '📍 Where is the Patio Taller located?' },
    { id: 'c8', label: '🔄 TransMilenio transfers', category: 'transfers', prompt: '🔄 Where can I transfer to TransMilenio?' }
  ],
  pt: [
    { id: 'c0a', label: '📍 Multiplaza e conexões', category: 'rotas', prompt: '📍 Quais estações ficam perto de Multiplaza?' },
    { id: 'c0b', label: '🗺️ Fontibón a Centro Mayor', category: 'rotas', prompt: '🗺️ Como chegar de Fontibón a Centro Mayor?' },
    { id: 'c0c', label: '📰 Notícias da obra', category: 'noticias', prompt: '📰 Quais são as últimas notícias do metrô e obras?' },
    { id: 'c1', label: '📍 Estações em Kennedy', category: 'estacoes', prompt: '📍 Quais estações ficam em Kennedy?' },
    { id: 'c2', label: '👥 Lotação de passageiros', category: 'capacidade', prompt: '👥 Qual é a capacidade e lotação de passageiros?' },
    { id: 'c3', label: '💳 Como recarregar?', category: 'tarifas', prompt: '💳 Qual é a tarifa e como recarregar o cartão?' },
    { id: 'c4', label: '💼 Vagas de emprego', category: 'jobs', prompt: '💼 Como se candidatar às vagas do SENA e Metro?' },
    { id: 'c5', label: '📍 Onde fica o pátio?', category: 'estacoes', prompt: '📍 Onde fica o Pátio Oficina (Patio Taller)?' },
    { id: 'c7', label: '⏱️ Tempo de viagem', category: 'tempo', prompt: '⏱️ Quanto tempo leva de Bosa até a Calle 72?' },
    { id: 'c8', label: '🔄 Integração de transporte', category: 'transfers', prompt: '🔄 Onde fazer baldeação com o TransMilenio?' }
  ],
  zh: [
    { id: 'c0a', label: '📍 Multiplaza 换乘', category: 'routes', prompt: '📍 Multiplaza 附近有哪些地铁站？' },
    { id: 'c0b', label: '🗺️ 丰蒂邦到 Centro Mayor', category: 'routes', prompt: '🗺️ 从丰蒂邦如何前往 Centro Mayor？' },
    { id: 'c0c', label: '📰 地铁工程最新消息', category: 'news', prompt: '📰 波哥大地铁一号线工程进展如何？' },
    { id: 'c1', label: '📍 肯尼迪区车站', category: 'stations', prompt: '📍 肯尼迪区 (Kennedy) 有哪些车站？' },
    { id: 'c2', label: '👥 列车额定载客量', category: 'capacity', prompt: '👥 地铁列车与车站的额定载客量是多少？' },
    { id: 'c3', label: '💳 票价与充值指南', category: 'fares', prompt: '💳 地铁票价是多少以及如何支付充值？' },
    { id: 'c4', label: '💼 招聘岗位与机会', category: 'jobs', prompt: '💼 目前有哪些无需经验的招聘岗位？' },
    { id: 'c5', label: '📍 车场建在哪里？', category: 'stations', prompt: '📍 车场 (Patio Taller) 建在哪里？' },
    { id: 'c6', label: '⏱️ 全程耗时测算', category: 'time', prompt: '⏱️ 从肯尼迪到市中心需要多久？' },
    { id: 'c7', label: '🔄 快速公交换乘', category: 'transfers', prompt: '🔄 哪里可以换乘快速公交 TransMilenio？' }
  ]
};

/**
 * Helper: Detectar mención de estación en el texto de respuesta de MetroBot
 */
const detectStationMention = (text) => {
  if (!text) return null;
  const lower = text.toLowerCase();

  // Match específico ordenado de mayor precisión a menor
  const stationMatches = [
    { codes: ['e16', 'estación 16', 'estacion 16', 'calle 72 norte', 'terminal norte'], id: 16 },
    { codes: ['e15', 'estación 15', 'estacion 15', 'calle 72', 'intercambiador modal'], id: 15 },
    { codes: ['e14', 'estación 14', 'estacion 14', 'calle 63', 'chapinero'], id: 14 },
    { codes: ['e13', 'estación 13', 'estacion 13', 'calle 45', 'universidad nacional', 'unal'], id: 13 },
    { codes: ['e12', 'estación 12', 'estacion 12', 'calle 26', 'centro internacional', 'santa fe'], id: 12 },
    { codes: ['e11', 'estación 11', 'estacion 11', 'restrepo', 'calle 10 sur'], id: 11 },
    { codes: ['e10', 'estación 10', 'estacion 10', 'calle 1 sur', 'hortúa', 'hortua'], id: 10 },
    { codes: ['e9', 'estación 9', 'estacion 9', 'general santander', 'nqs'], id: 9 },
    { codes: ['e8', 'estación 8', 'estacion 8', 'sena', 'carrera 50'], id: 8 },
    { codes: ['e7', 'estación 7', 'estacion 7', 'plaza de las américas', 'plaza de las americas'], id: 7 },
    { codes: ['e6', 'estación 6', 'estacion 6', 'primero de mayo', '1 de mayo'], id: 6 },
    { codes: ['e5', 'estación 5', 'estacion 5', 'timiza', 'hospital de kennedy', 'hospital kennedy'], id: 5 },
    { codes: ['e4', 'estación 4', 'estacion 4', 'carrera 80', 'ciudad kennedy'], id: 4 },
    { codes: ['e3', 'estación 3', 'estacion 3', 'portal américas', 'portal americas', 'chicalá', 'chicala'], id: 3 },
    { codes: ['e2', 'estación 2', 'estacion 2', 'gibraltar'], id: 2 },
    { codes: ['e1', 'estación 1', 'estacion 1', 'patio taller', 'el porvenir'], id: 1 },
  ];

  for (const item of stationMatches) {
    if (item.codes.some(c => lower.includes(c))) {
      return DEFAULT_16_STATIONS.find(s => s.id === item.id) || null;
    }
  }

  // Mapeos por localidad general
  if (lower.includes('kennedy')) return DEFAULT_16_STATIONS[2]; // E3
  if (lower.includes('bosa')) return DEFAULT_16_STATIONS[0]; // E1
  if (lower.includes('puente aranda')) return DEFAULT_16_STATIONS[7]; // E8
  if (lower.includes('mártires') || lower.includes('martires')) return DEFAULT_16_STATIONS[9]; // E10
  if (lower.includes('teusaquillo')) return DEFAULT_16_STATIONS[12]; // E13
  if (lower.includes('barrios unidos')) return DEFAULT_16_STATIONS[15]; // E16

  return null;
};

/**
 * Helper para renderizar negritas y formato inline de forma limpia y accesible.
 * Procesa automáticamente saltos de línea (\n) y marcado en negrita (**texto**).
 * Garantiza contraste perfecto y color nítido tanto en modo claro como oscuro.
 */
const renderInlineFormatted = (str, isDark = false) => {
  if (!str) return null;
  const lines = String(str).split(/\r?\n/);
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <Fragment key={lineIdx}>
        {lineIdx > 0 && <br />}
        {parts.map((part, idx) => {
          if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
            return (
              <strong 
                key={idx} 
                className={isDark ? 'font-black text-white' : 'font-black text-zinc-950'}
              >
                {part.slice(2, -2)}
              </strong>
            );
          }
          return (
            <span 
              key={idx} 
              className={isDark ? 'text-zinc-200' : 'text-zinc-800'}
            >
              {part}
            </span>
          );
        })}
      </Fragment>
    );
  });
};

/**
 * Renderizador de Texto Limpio de MetroBot IA.
 * Imprime ÚNICAMENTE texto limpio en el chat (markdown con negritas, listas y saltos de línea),
 * SIN incrustar Cards de interfaz estáticas, ni botones repetitivos de mapa ni bloques de sugerencias dentro del mensaje.
 */
const RenderBotText = ({ text, dark, onAction }) => {
  // Separar y aislar la respuesta de texto de cualquier bloque [SUGERENCIAS]
  const cleanBody = useMemo(() => {
    if (!text) return '';
    // Quitar bloque de [SUGERENCIAS]
    let cleaned = text.split('[SUGERENCIAS]')[0];
    // Quitar todos los tags de acción dinámicos [ACTION: ...]
    cleaned = cleaned.replace(/\[ACTION:\s*[A-Z0-9_]+\]/g, '');
    // Quitar enlaces markdown tipo [Texto](#action)
    cleaned = cleaned.replace(/\[(?:🗺️|💳|🚧|📰|📍)?\s*[^\]]+\]\(#[a-zA-Z0-9_-]+\)/g, '');
    return cleaned.trim();
  }, [text]);

  // Extracción estricta del comando [ACTION: ...] mediante Regex del mensaje del bot
  const actionMatch = text ? text.match(/\[ACTION:\s*([A-Z0-9_]+)\]/i) : null;
  const detectedAction = actionMatch ? actionMatch[1].toUpperCase() : null;

  // Detección estricta de intenciones y comandos de acción ([ACTION])
  // REGLA CRÍTICA 1: Si el mensaje contiene formato de ruta, direcciones o mapa,
  // queda PROHIBIDO adjuntar [ACTION: OPEN_EMPLOYMENT_MODULE] aunque mencione Bosa, Kennedy, Usme o Fontibón.
  const isRouteContent = 
    isRouteOrMapQuery('', text) || 
    detectedAction === 'OPEN_MAP_MODULE' ||
    text.includes('🧭 **Ruta Sugerida:') ||
    text.includes('🧭 **Ruta:') || 
    text.includes('• **Estación de Metro clave') ||
    text.includes('• **Estación Metro Clave') ||
    text.includes('🔄 **Conexiones Totales:');

  const hasMapAction = isRouteContent || detectedAction === 'OPEN_MAP_MODULE';
  const hasEmploymentAction = !isRouteContent && detectedAction === 'OPEN_EMPLOYMENT_MODULE';
  const hasNewsAction = !isRouteContent && detectedAction === 'OPEN_NEWS_MODULE';
  const hasBalanceAction = !isRouteContent && detectedAction === 'OPEN_BALANCE_MODULE';
  const hasCultureAction = !isRouteContent && detectedAction === 'OPEN_CULTURE_MODULE';
  const hasForumAction = !isRouteContent && detectedAction === 'OPEN_FORUM_MODULE';

  // Procesar párrafos y líneas
  const paragraphs = useMemo(() => {
    if (!cleanBody) return [];
    return cleanBody
      .replace(/\[ACTION:\s*[A-Z0-9_]+\]/g, '')
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(Boolean);
  }, [cleanBody]);

  return (
    <div className="space-y-3 py-0.5 text-xs sm:text-[13px] leading-relaxed">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n').map(l => l.trim()).filter(Boolean);

        return (
          <div key={pIdx} className="space-y-1.5">
            {lines.map((line, lIdx) => {
              // Comprobar si es un paso numerado: ej. "1. **Abordaje 1 (Origen):** ..." o "1. Paso 1..."
              const isNumberedStep = /^[0-9]+\.\s+/.test(line);
              // Comprobar si es un bullet: ej. "• ..." o "- ..."
              const isBullet = /^[-*•]\s+/.test(line);

              if (isNumberedStep) {
                const match = line.match(/^([0-9]+\.)\s+(.*)/);
                const stepNum = match ? match[1] : '';
                const stepText = match ? match[2] : line;
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-0.5 my-1.5">
                    <span className="font-bold text-[#DC2626] dark:text-red-400 shrink-0">
                      {stepNum}
                    </span>
                    <div className="flex-1">
                      {renderInlineFormatted(stepText, dark)}
                    </div>
                  </div>
                );
              }

              if (isBullet) {
                const bulletText = line.replace(/^[-*•]\s+/, '');
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-1 my-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] dark:bg-red-400 mt-2 shrink-0" />
                    <div className="flex-1">
                      {renderInlineFormatted(bulletText, dark)}
                    </div>
                  </div>
                );
              }

              return (
                <div key={lIdx} className="leading-relaxed">
                  {renderInlineFormatted(line, dark)}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* ── ACTION TRIGGER CARDS DINÁMICAS (Diseño Oficial Rojo Oscuro y Crema) ── */}

      {/* 1. CONSULTAS DE RUTAS, DIRECCIONES Y UBICACIÓN DE ESTACIONES */}
      {hasMapAction && (
        <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            type="button"
            onClick={() => {
              if (onAction) onAction('#open_mapa', 'Ver esta ruta en el Mapa Interactivo');
            }}
            className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 shadow-sm active:scale-[0.98] group flex items-center justify-between gap-3 ${
              dark 
                ? 'bg-gradient-to-r from-[#2c0505]/95 via-[#1a0303] to-[#120202] border-red-700/60 hover:border-red-500 text-amber-100 shadow-red-950/20' 
                : 'bg-gradient-to-r from-[#FFFDF9] via-[#FFF8EE] to-[#FEF3C7] border-2 border-[#991b1b]/35 hover:border-[#991b1b] text-[#7f1d1d] shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                dark ? 'bg-gradient-to-br from-[#DC2626] to-[#7f1d1d] text-amber-100' : 'bg-gradient-to-br from-[#991b1b] to-[#7f1d1d] text-amber-50'
              }`}>
                <MapIcon size={16} />
              </div>
              <div className="truncate">
                <span className={`text-[9.5px] font-black uppercase tracking-wider block leading-none mb-1 ${
                  dark ? 'text-amber-300/90' : 'text-[#991b1b]'
                }`}>
                  Trazado Línea 1 · 16 Estaciones y Viaducto
                </span>
                <span className={`font-bold text-xs truncate block ${
                  dark ? 'text-amber-50 group-hover:text-white' : 'text-[#7f1d1d]'
                }`}>
                  🗺️ Ver esta ruta en el Mapa Interactivo
                </span>
              </div>
            </div>
            <ArrowRight size={15} className={`shrink-0 group-hover:translate-x-1.5 transition-transform ${
              dark ? 'text-amber-300' : 'text-[#991b1b]'
            }`} />
          </button>
        </div>
      )}

      {/* 2. CONSULTAS EXCLUSIVAS DE TRABAJO, VACANTES Y SENA */}
      {hasEmploymentAction && (
        <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            type="button"
            onClick={() => {
              if (onAction) onAction('#open_portal_empleo', 'Ver Convocatorias de Empleo');
            }}
            className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 shadow-sm active:scale-[0.98] group flex items-center justify-between gap-3 ${
              dark 
                ? 'bg-gradient-to-r from-[#2c0505]/95 via-[#1a0303] to-[#120202] border-red-700/60 hover:border-red-500 text-amber-100 shadow-red-950/20' 
                : 'bg-gradient-to-r from-[#FFFDF9] via-[#FFF8EE] to-[#FEF3C7] border-2 border-[#991b1b]/35 hover:border-[#991b1b] text-[#7f1d1d] shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                dark ? 'bg-gradient-to-br from-[#DC2626] to-[#7f1d1d] text-amber-100' : 'bg-gradient-to-br from-[#991b1b] to-[#7f1d1d] text-amber-50'
              }`}>
                <Briefcase size={16} />
              </div>
              <div className="truncate">
                <span className={`text-[9.5px] font-black uppercase tracking-wider block leading-none mb-1 ${
                  dark ? 'text-amber-300/90' : 'text-[#991b1b]'
                }`}>
                  Agencia Pública SENA / EMB · Postulaciones Gratuitas
                </span>
                <span className={`font-bold text-xs truncate block ${
                  dark ? 'text-amber-50 group-hover:text-white' : 'text-[#7f1d1d]'
                }`}>
                  💼 Ver Convocatorias de Empleo
                </span>
              </div>
            </div>
            <ArrowRight size={15} className={`shrink-0 group-hover:translate-x-1.5 transition-transform ${
              dark ? 'text-amber-300' : 'text-[#991b1b]'
            }`} />
          </button>
        </div>
      )}

      {/* 3. CONSULTAS DE NOTICIAS, HITOS Y PORCENTAJE DE AVANCE DE OBRA */}
      {hasNewsAction && (
        <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            type="button"
            onClick={() => {
              if (onAction) onAction('#open_noticias', 'Ver Noticias e Hitos de la Obra');
            }}
            className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 shadow-sm active:scale-[0.98] group flex items-center justify-between gap-3 ${
              dark 
                ? 'bg-gradient-to-r from-[#2c0505]/95 via-[#1a0303] to-[#120202] border-red-700/60 hover:border-red-500 text-amber-100 shadow-red-950/20' 
                : 'bg-gradient-to-r from-[#FFFDF9] via-[#FFF8EE] to-[#FEF3C7] border-2 border-[#991b1b]/35 hover:border-[#991b1b] text-[#7f1d1d] shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                dark ? 'bg-gradient-to-br from-[#DC2626] to-[#7f1d1d] text-amber-100' : 'bg-gradient-to-br from-[#991b1b] to-[#7f1d1d] text-amber-50'
              }`}>
                <Newspaper size={16} />
              </div>
              <div className="truncate">
                <span className={`text-[9.5px] font-black uppercase tracking-wider block leading-none mb-1 ${
                  dark ? 'text-amber-300/90' : 'text-[#991b1b]'
                }`}>
                  Boletines Oficiales y Avance de Obra (82,33%)
                </span>
                <span className={`font-bold text-xs truncate block ${
                  dark ? 'text-amber-50 group-hover:text-white' : 'text-[#7f1d1d]'
                }`}>
                  📰 Ver Noticias e Hitos de la Obra
                </span>
              </div>
            </div>
            <ArrowRight size={15} className={`shrink-0 group-hover:translate-x-1.5 transition-transform ${
              dark ? 'text-amber-300' : 'text-[#991b1b]'
            }`} />
          </button>
        </div>
      )}

      {/* 4. CONSULTAS DE SALDO, RECARGAS Y TARJETA TULLAVE */}
      {hasBalanceAction && (
        <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            type="button"
            onClick={() => {
              if (onAction) onAction('#open_saldo', 'Consultar Saldo y Recargar TuLlave');
            }}
            className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 shadow-sm active:scale-[0.98] group flex items-center justify-between gap-3 ${
              dark 
                ? 'bg-gradient-to-r from-[#2c0505]/95 via-[#1a0303] to-[#120202] border-red-700/60 hover:border-red-500 text-amber-100 shadow-red-950/20' 
                : 'bg-gradient-to-r from-[#FFFDF9] via-[#FFF8EE] to-[#FEF3C7] border-2 border-[#991b1b]/35 hover:border-[#991b1b] text-[#7f1d1d] shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                dark ? 'bg-gradient-to-br from-[#DC2626] to-[#7f1d1d] text-amber-100' : 'bg-gradient-to-br from-[#991b1b] to-[#7f1d1d] text-amber-50'
              }`}>
                <CreditCard size={16} />
              </div>
              <div className="truncate">
                <span className={`text-[9.5px] font-black uppercase tracking-wider block leading-none mb-1 ${
                  dark ? 'text-amber-300/90' : 'text-[#991b1b]'
                }`}>
                  Sistema TuLlave · Transbordo a $0 COP en 110 min
                </span>
                <span className={`font-bold text-xs truncate block ${
                  dark ? 'text-amber-50 group-hover:text-white' : 'text-[#7f1d1d]'
                }`}>
                  💳 Consultar Saldo y Recargar TuLlave
                </span>
              </div>
            </div>
            <ArrowRight size={15} className={`shrink-0 group-hover:translate-x-1.5 transition-transform ${
              dark ? 'text-amber-300' : 'text-[#991b1b]'
            }`} />
          </button>
        </div>
      )}

      {/* 5. CONSULTAS DE CULTURA Y PEDAGOGÍA */}
      {hasCultureAction && (
        <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            type="button"
            onClick={() => {
              if (onAction) onAction('#open_cultura', 'Ver Módulo Cultura #BogotáModoMetro');
            }}
            className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 shadow-sm active:scale-[0.98] group flex items-center justify-between gap-3 ${
              dark 
                ? 'bg-gradient-to-r from-[#2c0505]/95 via-[#1a0303] to-[#120202] border-red-700/60 hover:border-red-500 text-amber-100 shadow-red-950/20' 
                : 'bg-gradient-to-r from-[#FFFDF9] via-[#FFF8EE] to-[#FEF3C7] border-2 border-[#991b1b]/35 hover:border-[#991b1b] text-[#7f1d1d] shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                dark ? 'bg-gradient-to-br from-[#DC2626] to-[#7f1d1d] text-amber-100' : 'bg-gradient-to-br from-[#991b1b] to-[#7f1d1d] text-amber-50'
              }`}>
                <HeartHandshake size={16} />
              </div>
              <div className="truncate">
                <span className={`text-[9.5px] font-black uppercase tracking-wider block leading-none mb-1 ${
                  dark ? 'text-amber-300/90' : 'text-[#991b1b]'
                }`}>
                  Pedagogía Cívica, Convivencia y Vagón Escuela
                </span>
                <span className={`font-bold text-xs truncate block ${
                  dark ? 'text-amber-50 group-hover:text-white' : 'text-[#7f1d1d]'
                }`}>
                  🎭 Ver Módulo Cultura #BogotáModoMetro
                </span>
              </div>
            </div>
            <ArrowRight size={15} className={`shrink-0 group-hover:translate-x-1.5 transition-transform ${
              dark ? 'text-amber-300' : 'text-[#991b1b]'
            }`} />
          </button>
        </div>
      )}

      {/* 6. CONSULTAS DE OPINIÓN Y PARTICIPACIÓN */}
      {hasForumAction && (
        <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            type="button"
            onClick={() => {
              if (onAction) onAction('#open_foro', 'Ir al Foro Ciudadano');
            }}
            className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 shadow-sm active:scale-[0.98] group flex items-center justify-between gap-3 ${
              dark 
                ? 'bg-gradient-to-r from-[#2c0505]/95 via-[#1a0303] to-[#120202] border-red-700/60 hover:border-red-500 text-amber-100 shadow-red-950/20' 
                : 'bg-gradient-to-r from-[#FFFDF9] via-[#FFF8EE] to-[#FEF3C7] border-2 border-[#991b1b]/35 hover:border-[#991b1b] text-[#7f1d1d] shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                dark ? 'bg-gradient-to-br from-[#DC2626] to-[#7f1d1d] text-amber-100' : 'bg-gradient-to-br from-[#991b1b] to-[#7f1d1d] text-amber-50'
              }`}>
                <MessageSquare size={16} />
              </div>
              <div className="truncate">
                <span className={`text-[9.5px] font-black uppercase tracking-wider block leading-none mb-1 ${
                  dark ? 'text-amber-300/90' : 'text-[#991b1b]'
                }`}>
                  Participación, Debate Vecinal y Propuestas
                </span>
                <span className={`font-bold text-xs truncate block ${
                  dark ? 'text-amber-50 group-hover:text-white' : 'text-[#7f1d1d]'
                }`}>
                  💬 Ir al Foro Ciudadano
                </span>
              </div>
            </div>
            <ArrowRight size={15} className={`shrink-0 group-hover:translate-x-1.5 transition-transform ${
              dark ? 'text-amber-300' : 'text-[#991b1b]'
            }`} />
          </button>
        </div>
      )}
    </div>
  );
};

// === COMPONENTE PRINCIPAL METROBOT ===
export const MetroBot = ({
  isOpen = false,
  onClose = () => {},
  dark = false,
  onNavigate = () => {},
  onShowDetail = () => {},
  onOpenJobModal = () => {},
  onReportIncident = () => {},
  onOpenNewsOrJob = () => {},
  onOpenProjectStatus = () => {},
  onFocusStation = null,
  initialQuery = ''
}) => {
  const { t, lang, setLang } = useLanguage();
  const activeLangKey = (lang || 'es').toLowerCase();

  // Chips dinámicos contextuales base por idioma
  const dynamicChips = useMemo(() => {
    return DYNAMIC_CHIPS[activeLangKey] || DYNAMIC_CHIPS.es;
  }, [activeLangKey]);

  const [chat, setChat] = useState(() => [{ 
    role: 'bot', 
    text: getInitialBotGreeting(lang) 
  }]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  
  // Estado de Texto a Voz (TTS)
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);

  const bottomRef = useRef(null);
  const prevLangRef = useRef(lang);
  const initialHandledRef = useRef(false);

  // Obtener el último mensaje del bot para extraer sugerencias y atajos de mapa (FUERA del chat)
  const lastBotMessage = useMemo(() => {
    return [...chat].reverse().find(c => c.role === 'bot');
  }, [chat]);

  // Sugerencias contextuales dinámicas: extraídas del último mensaje o chips predeterminados
  const activeSuggestions = useMemo(() => {
    if (lastBotMessage?.text && lastBotMessage.text.includes('[SUGERENCIAS]')) {
      const parts = lastBotMessage.text.split('[SUGERENCIAS]');
      if (parts[1]) {
        const parsed = parts[1]
          .split('\n')
          .map(l => l.trim())
          .filter(l => l.startsWith('- '))
          .map(l => l.replace(/^- /, '').trim())
          .filter(Boolean);
        if (parsed.length > 0) {
          return parsed.map((item, idx) => ({
            id: `sug_${idx}`,
            label: item,
            prompt: item.replace(/^[📍🗺️💳💼🚇🚲⚡🚧💡🌱🔍•\s]+/, '').trim()
          }));
        }
      }
    }
    return dynamicChips;
  }, [lastBotMessage, dynamicChips]);

  // Estación detectada para acceso rápido en la parte inferior (FUERA del chat)
  const activeStationOnMap = useMemo(() => {
    if (!lastBotMessage?.text) return null;
    return detectStationMention(lastBotMessage.text);
  }, [lastBotMessage]);

  // Sincronización de bienvenida e idioma
  useEffect(() => {
    if (prevLangRef.current !== lang) {
      prevLangRef.current = lang;
      setChat([{ role: 'bot', text: getInitialBotGreeting(lang) }]);
      // Detener cualquier voz activa al cambiar de idioma
      if (synthRef.current) {
        synthRef.current.cancel();
        setSpeakingIndex(null);
      }
    } else if (isOpen) {
      setChat(prev => (prev.length <= 1 ? [{ role: 'bot', text: getInitialBotGreeting(lang) }] : prev));
    }
  }, [lang, isOpen]);

  // Manejo de consulta inicial automática (ej. desde Ficha Técnica)
  useEffect(() => {
    if (isOpen && initialQuery && initialQuery.trim() && !initialHandledRef.current) {
      initialHandledRef.current = true;
      ask(initialQuery);
    } else if (!isOpen) {
      initialHandledRef.current = false;
    }
  }, [isOpen, initialQuery]);

  useEffect(() => { 
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [chat, loading]);

  // Cancelar audio si se cierra el modal
  useEffect(() => {
    if (!isOpen && synthRef.current) {
      synthRef.current.cancel();
      setSpeakingIndex(null);
    }
  }, [isOpen]);

  // ── FUNCIÓN DE TEXTO A VOZ (TTS) ──
  const toggleTTS = (index, rawText) => {
    if (!synthRef.current) return;

    if (speakingIndex === index) {
      synthRef.current.cancel();
      setSpeakingIndex(null);
      return;
    }

    synthRef.current.cancel();

    // Limpiar formato markdown y URLs antes de hablar
    const cleanToSpeak = (rawText || '')
      .split('[SUGERENCIAS]')[0]
      .replace(/\[(.*?)\]\(#.*?\)/g, '$1')
      .replace(/[*_#`]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    if (!cleanToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(cleanToSpeak);
    
    // Mapeo preciso de código de idioma para pronunciación nativa
    const langMap = {
      es: 'es-CO',
      en: 'en-US',
      pt: 'pt-BR',
      zh: 'zh-CN'
    };
    utterance.lang = langMap[activeLangKey] || 'es-CO';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    synthRef.current.speak(utterance);
  };

  // Manejo de acciones en el mapa o deep links
  const handleBotAction = (actionId, label) => {
    const cleanId = (actionId || '').replace(/^#/, '');

    // 1. MAPA INTERACTIVO
    if (cleanId === 'open_mapa' || cleanId === 'action_map' || cleanId === 'nav_mapa' || cleanId === 'mapa') {
      if (onNavigate) {
        onNavigate('mapa');
      }
      onClose();
      return;
    }

    // 2. SALDO DE TARJETA TULLAVE
    if (cleanId === 'open_saldo' || cleanId === 'action_recharge' || cleanId === 'saldo' || cleanId === 'tullave') {
      if (onNavigate) {
        onNavigate('saldo');
      }
      onClose();
      return;
    }

    // 3. ESTADO DE PROYECTO
    if (cleanId === 'open_project_status' || cleanId === 'action_status') {
      if (onOpenProjectStatus) {
        onOpenProjectStatus();
      } else if (onNavigate) {
        onNavigate('estado');
      }
      onClose();
      return;
    }

    // 4. NOTICIAS E HITOS
    if (cleanId === 'open_noticias' || cleanId === 'noticias' || cleanId.startsWith('news')) {
      if (onNavigate) {
        onNavigate('noticias');
      } else if (onOpenNewsOrJob) {
        onOpenNewsOrJob('noticias', cleanId.startsWith('news') ? cleanId : null);
      }
      onClose();
      return;
    }

    // 5. EMPLEO Y CONVOCATORIAS
    if (cleanId === 'open_portal_empleo' || cleanId.startsWith('job') || cleanId === 'empleo') {
      if (onNavigate) {
        onNavigate('empleo');
      } else if (onOpenJobModal) {
        onOpenJobModal();
      } else if (onOpenNewsOrJob) {
        onOpenNewsOrJob('empleo', null);
      }
      onClose();
      return;
    }

    // 6. CULTURA Y #BOGOTÁMODOMETRO
    if (cleanId === 'open_cultura' || cleanId === 'nav_cultura' || cleanId === 'cultura') {
      if (onNavigate) {
        onNavigate('cultura');
      }
      onClose();
      return;
    }

    // 7. FORO CIUDADANO
    if (cleanId === 'open_foro' || cleanId === 'foro' || cleanId === 'forum') {
      if (onNavigate) {
        onNavigate('foro');
      }
      onClose();
      return;
    }

    // 8. REPORTE DE INCIDENCIAS
    if (cleanId === 'action_report' || cleanId === 'report_incident') {
      if (onReportIncident) {
        onReportIncident();
      }
      onClose();
      return;
    }
  };

  // ── MANEJO DEL BOTÓN DE ACCIÓN MAPA-CHAT ──
  const handleFocusStationOnMap = (station) => {
    if (!station) return;
    
    // Detener voz activa
    if (synthRef.current) {
      synthRef.current.cancel();
      setSpeakingIndex(null);
    }

    onClose();

    if (onFocusStation) {
      onFocusStation(station);
    }

    if (onNavigate) {
      onNavigate('mapa', { stationId: station.id, code: station.code });
    }
  };

  // Enviar pregunta con sanitización de seguridad estricta
  const ask = async (overrideMsg) => {
    const rawMsg = (overrideMsg || input).trim();
    if (!rawMsg || loading) return;

    // Sanitización contra SQL Injection y XSS/Code Injection
    const msg = sanitizeChatMessage(rawMsg);
    if (!msg) return;

    // Detener voz anterior si estaba hablando
    if (synthRef.current) {
      synthRef.current.cancel();
      setSpeakingIndex(null);
    }

    // 1. Amplitud de memoria contextual: retener los últimos 10 turnos de conversación activos (hasta 20 intercambios)
    const currentHistory = [...chat].slice(-20);
    setChat(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);

    // ── INTERCEPTOR DE MENSAJES DE EMPLEO (FRONTEND) CON SOPORTE 5 IDIOMAS ──
    const isEmp = isEmploymentQuery(msg);

    if (isEmp) {
      setTimeout(() => {
        const employmentTexts = {
          es: `💼 **Convocatorias Laborales Oficiales del Metro de Bogotá:**

Las vacantes operativas (operadores CBTC, electricistas, técnicos electromecánicos e inspectores de vía) se gestionan **100% gratis** a través de la **Agencia Pública de Empleo del SENA** y el concesionario **Metro Línea 1 S.A.S.**

🔧 **Perfiles Técnicos y Operativos Disponibles:**
• **Operadores y Controladores de Tráfico Ferroviario CBTC:** Monitoreo y operación de trenes automáticos con tecnología GoA4.
• **Técnicos Electricistas de Media y Alta Tensión:** Mantenimiento de subestaciones de tracción (SET) y catenarias.
• **Técnicos Electromecánicos e Inspectores de Vía Permanente:** Monitoreo, diagnóstico y mantenimiento de rieles y aparatos de vía.
• **Auxiliares de Obra Civil y Montaje:** Plazas con y sin experiencia previa con formación técnica remunerada.

📢 **Canales Oficiales y Gratuitos de Postulación:**
1. **Agencia Pública de Empleo del SENA:** Portal web oficial **ape.sena.edu.co**.
2. **Concesionario Metro Línea 1 S.A.S.:** Portal de talento **www.metrolinea1.com**.
3. **Empresa Metro de Bogotá (EMB):** Sitio web institucional **www.metrodebogota.gov.co**.

⚠️ Las postulaciones son totalmente gratuitas. Ningún intermediario ni particular cobra por exámenes médicos, recepción de hojas de vida ni vinculación laboral.

[ACTION: OPEN_EMPLOYMENT_MODULE]

[SUGERENCIAS]
- 💼 ¿Cuáles son los requisitos para técnico electricista?
- 📋 ¿Cómo postular mi hoja de vida en el SENA?
- 🚇 ¿Qué capacitación reciben los operadores CBTC?`,

          en: `💼 **Official Job Openings for Bogotá Metro:**

Operational positions (CBTC operators, high-voltage electricians, electromechanical technicians, and track inspectors) are managed **100% free** through the **SENA Public Employment Agency** and concessionaire **Metro Línea 1 S.A.S.**

🔧 **Available Technical & Operational Roles:**
• **CBTC Rail Traffic Controllers & Operators:** Monitoring and controlling automatic trains equipped with GoA4 driverless technology.
• **Medium & High Voltage Electrical Technicians:** Maintenance of traction power substations (SET) and overhead catenary systems.
• **Electromechanical Technicians & Track Inspectors:** Routine diagnostics and maintenance of permanent track and turnout points.
• **Civil Works & Assembly Assistants:** Entry-level and experienced roles with paid certified technical training.

📢 **Official & Free Application Channels:**
1. **SENA Public Employment Agency:** Official portal **ape.sena.edu.co**.
2. **Concessionaire Metro Línea 1 S.A.S.:** Talent portal **www.metrolinea1.com**.
3. **Empresa Metro de Bogotá (EMB):** Institutional website **www.metrodebogota.gov.co**.

⚠️ Applications are completely free of charge. No legitimate recruiter charges for interviews, medical exams, or onboarding.

[ACTION: OPEN_EMPLOYMENT_MODULE]

[SUGERENCIAS]
- 💼 What are the requirements for electrical technicians?
- 📋 How do I submit my resume on SENA?
- 🚇 What training do CBTC operators receive?`,

          pt: `💼 **Convocatórias de Emprego Oficiais do Metrô de Bogotá:**

As vagas operacionais (operadores CBTC, eletricistas, técnicos eletromecânicos e inspetores de via) são intermediadas **100% de forma gratuita** pela **Agência Pública de Emprego do SENA** e pela concessionária **Metro Línea 1 S.A.S.**

🔧 **Perfis Técnicos e Operacionais Disponíveis:**
• **Controladores e Operadores de Tráfego Ferroviário CBTC:** Monitoramento e condução de trens automáticos com tecnologia GoA4 sem condutor.
• **Técnicos Eletricistas de Média e Alta Tensão:** Manutenção de subestações de tração (SET) e rede aérea de catenárias.
• **Técnicos Eletromecânicos e Inspetores de Via Permanente:** Diagnóstico e manutenção de trilhos e aparelhos de mudança de via.
• **Auxiliares de Obras Civis e Montagem:** Vagas com e sem experiência prévia com treinamento técnico remunerado.

📢 **Canais Oficiais e Gratuitos de Candidatura:**
1. **Agência Pública de Emprego do SENA:** Portal oficial **ape.sena.edu.co**.
2. **Concessionária Metro Línea 1 S.A.S.:** Portal de talentos **www.metrolinea1.com**.
3. **Empresa Metro de Bogotá (EMB):** Site institucional **www.metrodebogota.gov.co**.

⚠️ Os processos seletivos são totalmente gratuitos. Nenhum intermediário cobra taxas para exames médicos ou cadastramento de currículos.

[ACTION: OPEN_EMPLOYMENT_MODULE]

[SUGERENCIAS]
- 💼 Quais são os requisitos para técnico eletricista?
- 📋 Como cadastrar meu currículo no SENA?
- 🚇 Que capacitação os operadores CBTC recebem?`,

          zh: `💼 **波哥大地铁官方公开招聘与就业岗位：**

所有一线运营与工程技术岗位（CBTC无人驾驶调度员、高压电气工程师、机电维保技师及线路巡检员）均**完全免费**由**哥伦比亚国家学徒服务局（SENA）公共就业服务平台**与**Metro Línea 1 S.A.S.特许经营公司**联合直招。

🔧 **热招技术与运营岗位类别：**
• **CBTC 铁路列车调度员与控制中心操作员：** 负责GoA4全自动无人驾驶列车系统的监控与运行调度。
• **中高压电气维护技师：** 负责牵引变电所（SET）与接触网供电系统的维护检修。
• **机电技工与轨道线路巡检员：** 负责钢轨几何尺寸、道岔及机电设备的状态诊断与周期保养。
• **土建施工与轨道装配普工/学徒：** 提供带薪专业技术实训，欢迎有无工程经验者报名。

📢 **官方直聘报名渠道（绝无中介费）：**
1. **SENA 公共就业服务局:** 官方平台 **ape.sena.edu.co**。
2. **Metro Línea 1 S.A.S. 特许经营公司:** 招聘官网 **www.metrolinea1.com**。
3. **波哥大地铁公司 (EMB):** 官方网站 **www.metrodebogota.gov.co**。

⚠️ 所有岗位应聘与考评均 100% 免费。严禁向求职者收取体检费、建档费或入职中介费。

[ACTION: OPEN_EMPLOYMENT_MODULE]

[SUGERENCIAS]
- 💼 电气维护技术人员的应聘要求是什么？
- 📋 如何在 SENA 就业平台提交个人简历？
- 🚇 CBTC 调度员需要接受哪些专业实操培训？`
        };

        const activeEmpLang = (lang || 'es').toLowerCase();
        const cleanEmploymentText = employmentTexts[activeEmpLang] || employmentTexts.es;
        setChat(prev => [...prev, { role: 'bot', text: cleanEmploymentText }]);
        setLoading(false);
      }, 300);
      return;
    }

    setTimeout(async () => {
      // Llamada al motor de IA pasando la memoria contextual (10 turnos) y el diccionario KNOWLEDGE_BASE
      const res = await getMetroBotResponse(msg, lang, t, currentHistory, KNOWLEDGE_BASE);
      setChat(prev => [...prev, { role: 'bot', text: res }]);
      setLoading(false);
    }, 250);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        onClick={e => e.stopPropagation()}
        className={`w-full sm:max-w-lg sm:rounded-3xl h-[100dvh] sm:h-[660px] sm:max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border ${
          dark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        {/* Header Superior */}
        <div className={`p-4 sm:p-5 border-b flex justify-between items-center shadow-sm shrink-0 ${
          dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <MetroBotAvatar size={44} showStatus={true} isOnline={true} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`font-black italic leading-tight text-base sm:text-lg ${dark ? 'text-white' : 'text-zinc-900'}`}>
                  MetroBot IA
                </h3>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DC2626] text-white shrink-0">
                  {t('metroBot.badgeOfficial', 'Oficial EMB')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse shrink-0" />
                <span className={`text-[10px] font-bold uppercase tracking-widest truncate ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {activeLangKey === 'zh' ? '多语种智能助理 (西 · 英 · 葡 · 中)' :
                   activeLangKey === 'en' ? 'Online AI Assistant (ES · EN · PT · ZH)' :
                   activeLangKey === 'pt' ? 'Assistente Virtual Online (ES · EN · PT · ZH)' :
                   'Asistente Oficial en Línea (ES · EN · PT · ZH)'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {/* Selector Rápido de Idioma dentro del chat */}
            <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-xl border border-zinc-200 dark:border-zinc-700">
              {[
                { code: 'es', label: 'ES' },
                { code: 'en', label: 'EN' },
                { code: 'pt', label: 'PT' },
                { code: 'zh', label: '中文' }
              ].map(item => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLang(item.code)}
                  className={`px-1.5 py-0.5 rounded-lg text-[9px] font-black tracking-wider transition-all ${
                    activeLangKey === item.code
                      ? 'bg-[#DC2626] text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                  }`}
                  title={`Cambiar a ${item.label}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button 
              onClick={onClose} 
              className={`p-1.5 rounded-full transition-colors ${
                dark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
              aria-label="Cerrar chat"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Lista de Mensajes */}
        <div className={`flex-1 min-h-0 overflow-y-auto p-4 ${dark ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
          <div className="text-center mb-5">
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
              dark ? 'text-zinc-500 bg-zinc-800/80' : 'text-zinc-400 bg-zinc-200/80'
            }`}>
              {t('bot_hoy', 'Hoy')} • Bogotá PLMB
            </span>
          </div>

          {chat.map((c, i) => (
            <div key={i} className={`mb-4 flex ${c.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] rounded-3xl px-4 sm:px-5 py-3 sm:py-3.5 shadow-sm text-xs sm:text-sm font-medium leading-relaxed relative group ${
                c.role === 'user' 
                  ? 'bg-[#DC2626] text-white rounded-br-sm' 
                  : dark 
                    ? 'bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-bl-sm' 
                    : 'bg-white text-zinc-900 border border-zinc-200 rounded-bl-sm'
              }`}>
                
                {/* ── BOTÓN DE TEXTO A VOZ (TTS) ── */}
                {c.role === 'bot' && (
                  <button
                    type="button"
                    onClick={() => toggleTTS(i, c.text)}
                    className={`absolute top-3 right-3 p-1.5 rounded-full transition-all ${
                      speakingIndex === i 
                        ? 'bg-emerald-500 text-white shadow-md animate-pulse' 
                        : dark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'
                    }`}
                    title={speakingIndex === i ? t('mapModule.ttsStop', 'Detener voz') : t('mapModule.ttsPlay', 'Escuchar respuesta')}
                    aria-label="Reproducir texto a voz"
                  >
                    {speakingIndex === i ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                )}

                {c.role === 'bot' ? (
                  <RenderBotText 
                    text={c.text} 
                    dark={dark} 
                    onAction={handleBotAction}
                  />
                ) : (
                  c.text
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-end gap-2">
              <div className="mb-1 shrink-0">
                <MetroBotAvatar size={32} showStatus={false} />
              </div>
              <div className={`px-5 py-4 rounded-3xl rounded-bl-none border shadow-sm flex gap-1.5 ${
                dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
              }`}>
                <div className="w-2.5 h-2.5 bg-[#DC2626] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2.5 h-2.5 bg-[#DC2626] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2.5 h-2.5 bg-[#DC2626] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── FOOTER CON CHIPS DINÁMICOS CONTEXTUALES Y FORMULARIO (FUERA DEL CHAT) ── */}
        <div className={`shrink-0 p-3 sm:p-4 border-t flex flex-col gap-2.5 ${
          dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
        }`}>
          {/* Acceso Rápido al Mapa si la respuesta mencionó una estación */}
          {activeStationOnMap && onFocusStation && (
            <button
              type="button"
              onClick={() => handleFocusStationOnMap(activeStationOnMap)}
              className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 transition-all active:scale-[0.98] shadow-2xs group ${
                dark 
                  ? 'bg-zinc-800/90 hover:bg-zinc-700 border-cyan-500/40 text-cyan-300' 
                  : 'bg-cyan-50 hover:bg-cyan-100 border-cyan-300 text-cyan-900'
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                <Compass size={14} className="shrink-0 text-cyan-500 group-hover:rotate-45 transition-transform" />
                <span className="truncate">
                  🗺️ {(t ? t('mapModule.btnFocusMap', 'Enfocar en el Mapa') : 'Enfocar en el Mapa')}: <strong>{activeStationOnMap.name}</strong>
                </span>
              </span>
              <ArrowRight size={13} className="shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {/* Barra de Chips Dinámicos Deslizables (FUERA del mensaje del chat) */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar w-full max-w-full">
            {activeSuggestions.map(chip => (
              <button 
                key={chip.id || chip.label} 
                onClick={() => ask(chip.prompt || chip.label)}
                className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 flex items-center gap-1.5 shadow-2xs ${
                  dark 
                    ? 'bg-zinc-800/90 border-zinc-700/80 text-zinc-300 hover:bg-zinc-700 hover:text-white hover:border-zinc-500' 
                    : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900'
                }`}
              >
                <span>{chip.label}</span>
              </button>
            ))}
          </div>

          {/* Formulario de Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); ask(); }} 
            className="flex items-center gap-2 w-full"
          >
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder={
                activeLangKey === 'zh' ? '向我咨询车站、载客量、换乘或招聘...' :
                activeLangKey === 'en' ? 'Ask me about stations, capacity, transfers or jobs...' :
                activeLangKey === 'pt' ? 'Pergunte sobre estações, lotação, baldeação ou vagas...' :
                activeLangKey === 'ja' ? '駅、輸送力、乗換、求人について質問...' :
                'Pregúntame sobre estaciones, aforo, trasbordos o empleo...'
              }
              className={`flex-1 min-w-0 border rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20 transition-all ${
                dark 
                  ? 'bg-zinc-800 text-white border-zinc-700 placeholder-zinc-500' 
                  : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400'
              }`} 
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()} 
              className="bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-40 text-white p-2.5 sm:p-3 rounded-2xl shadow-md active:scale-95 transition-all shrink-0 flex items-center justify-center"
              aria-label="Enviar mensaje"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MetroBot;
