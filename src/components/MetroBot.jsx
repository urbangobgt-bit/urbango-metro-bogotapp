import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, 
  Send, 
  ArrowRight, 
  MapPin, 
  Compass, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Layers, 
  CreditCard, 
  Briefcase, 
  TrendingUp, 
  Clock, 
  Share2, 
  Check, 
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import MetroBotAvatar from './MetroBotAvatar';
import { getMetroBotResponse } from '../utils/metroBotEngine';
import { DEFAULT_16_STATIONS } from './InteractiveMap';

// === CHIPS DINÁMICOS CONTEXTUALES POR CATEGORÍA ===
const DYNAMIC_CHIPS = {
  es: [
    { id: 'c0a', label: '📍 Multiplaza y conexiones', category: 'rutas', prompt: '📍 ¿Qué estaciones quedan cerca de Multiplaza?' },
    { id: 'c0b', label: '🗺️ De Fontibón a Centro Mayor', category: 'rutas', prompt: '🗺️ ¿Cómo llego desde Fontibón a Centro Mayor?' },
    { id: 'c0c', label: '📰 Noticias de la obra', category: 'noticias', prompt: '📰 ¿Cuáles son las últimas noticias del metro y obras?' },
    { id: 'c1', label: '📍 Estaciones en Kennedy', category: 'estaciones', prompt: '📍 ¿Cuáles estaciones me quedan cerca de Kennedy?' },
    { id: 'c2', label: '👥 Aforo de personas', category: 'capacidad', prompt: '👥 ¿Cuál es el aforo y capacidad de personas?' },
    { id: 'c3', label: '💳 ¿Cómo recargar?', category: 'tarifas', prompt: '💳 ¿Cuál es la tarifa y cómo recargar TuTarjetaMetro?' },
    { id: 'c4', label: '💼 Vacantes sin experiencia', category: 'empleo', prompt: '💼 ¿Hay vacantes de empleo sin experiencia?' },
    { id: 'c5', label: '📍 ¿Dónde queda el Patio Taller?', category: 'estaciones', prompt: '📍 ¿Dónde queda el Patio Taller?' },
    { id: 'c6', label: '⚡ Velocidad del tren', category: 'trenes', prompt: '⚡ ¿A qué velocidad irá el tren?' },
    { id: 'c7', label: '⏱️ Tiempo Bosa a Calle 72', category: 'tiempo', prompt: '⏱️ ¿Cuánto tiempo tomará ir desde Kennedy al Centro?' },
    { id: 'c8', label: '🔄 Trasbordos TransMilenio', category: 'conexiones', prompt: '🔄 ¿Dónde puedo hacer trasbordo con TransMilenio?' },
    { id: 'c9', label: '🚇 Línea 2 a Suba', category: 'proyectos', prompt: '🚇 ¿Cómo será la Segunda Línea del Metro a Suba?' },
    { id: 'c10', label: '🚧 Estado de obra (82.33%)', category: 'obras', prompt: '🚧 ¿Cuál es el estado de avance de la obra (82.33%)?' }
  ],
  en: [
    { id: 'c0a', label: '📍 Multiplaza connections', category: 'routes', prompt: '📍 Which stations are near Multiplaza?' },
    { id: 'c0b', label: '🗺️ Fontibón to Centro Mayor', category: 'routes', prompt: '🗺️ How do I get from Fontibón to Centro Mayor?' },
    { id: 'c0c', label: '📰 Metro construction news', category: 'news', prompt: '📰 What are the latest news and progress on Bogotá Metro?' },
    { id: 'c1', label: '📍 Stations in Kennedy', category: 'stations', prompt: '📍 Which stations are located in Kennedy?' },
    { id: 'c2', label: '👥 Passenger Capacity', category: 'capacity', prompt: '👥 What is the passenger capacity and volume?' },
    { id: 'c3', label: '💳 How to recharge card?', category: 'fares', prompt: '💳 How do fares and TuTarjetaMetro recharge work?' },
    { id: 'c4', label: '💼 Jobs with no experience', category: 'jobs', prompt: '💼 Are there job openings for candidates with no experience?' },
    { id: 'c5', label: '📍 Where is the Patio Taller?', category: 'stations', prompt: '📍 Where is the Patio Taller located?' },
    { id: 'c6', label: '⚡ Train speed', category: 'trains', prompt: '⚡ What is the commercial speed of the trains?' },
    { id: 'c7', label: '⏱️ Travel time Kennedy to Downtown', category: 'time', prompt: '⏱️ Travel time from Kennedy to Downtown?' },
    { id: 'c8', label: '🔄 TransMilenio transfers', category: 'transfers', prompt: '🔄 Where can I transfer to TransMilenio?' }
  ],
  pt: [
    { id: 'c0a', label: '📍 Multiplaza e conexões', category: 'rotas', prompt: '📍 Quais estações ficam perto de Multiplaza?' },
    { id: 'c0b', label: '🗺️ Fontibón a Centro Mayor', category: 'rotas', prompt: '🗺️ Como chegar de Fontibón a Centro Mayor?' },
    { id: 'c0c', label: '📰 Notícias da obra', category: 'noticias', prompt: '📰 Quais são as últimas notícias do metrô e obras?' },
    { id: 'c1', label: '📍 Estações em Kennedy', category: 'estacoes', prompt: '📍 Quais estações ficam em Kennedy?' },
    { id: 'c2', label: '👥 Lotação de passageiros', category: 'capacidade', prompt: '👥 Qual é a capacidade e lotação de passageiros?' },
    { id: 'c3', label: '💳 Como recarregar?', category: 'tarifas', prompt: '💳 Qual é a tarifa e como recarregar o cartão?' },
    { id: 'c4', label: '💼 Vagas de emprego', category: 'emprego', prompt: '💼 Quais vagas de emprego estão abertas?' },
    { id: 'c5', label: '📍 Onde fica o Pátio Taller?', category: 'estacoes', prompt: '📍 Onde fica o Pátio Taller?' },
    { id: 'c6', label: '⏱️ Tempo Kennedy ao Centro', category: 'tempo', prompt: '⏱️ Quanto tempo leva de Kennedy ao Centro?' },
    { id: 'c7', label: '🔄 Baldeações TransMilenio', category: 'conexoes', prompt: '🔄 Onde posso fazer baldeação com TransMilenio?' }
  ],
  zh: [
    { id: 'c0a', label: '📍 Multiplaza 换乘路线', category: 'routes', prompt: '📍 Multiplaza 购物中心附近有哪些地铁站？' },
    { id: 'c0b', label: '🗺️ 从芳蒂邦到中央购物中心', category: 'routes', prompt: '🗺️ 从丰蒂邦 (Fontibón) 如何前往 Centro Mayor？' },
    { id: 'c0c', label: '📰 最新工程与建设动态', category: 'news', prompt: '📰 地铁工程最新官方动态与到货进展是什么？' },
    { id: 'c1', label: '📍 肯尼迪区车站', category: 'stations', prompt: '📍 肯尼迪区 (Kennedy) 有哪些车站？' },
    { id: 'c2', label: '👥 列车额定载客量', category: 'capacity', prompt: '👥 地铁列车与车站的额定载客量是多少？' },
    { id: 'c3', label: '💳 票价与充值指南', category: 'fares', prompt: '💳 地铁票价是多少以及如何支付充值？' },
    { id: 'c4', label: '💼 招聘岗位与机会', category: 'jobs', prompt: '💼 目前有哪些无需经验的招聘岗位？' },
    { id: 'c5', label: '📍 车场建在哪里？', category: 'stations', prompt: '📍 车场 (Patio Taller) 建在哪里？' },
    { id: 'c6', label: '⏱️ 全程耗时测算', category: 'time', prompt: '⏱️ 从肯尼迪到市中心需要多久？' },
    { id: 'c7', label: '🔄 快速公交换乘', category: 'transfers', prompt: '🔄 哪里可以换乘快速公交 TransMilenio？' }
  ],
  ja: [
    { id: 'c0a', label: '📍 マルティプラザ乗換', category: 'routes', prompt: '📍 マルティプラザ (Multiplaza) の最寄駅はどこ？' },
    { id: 'c0b', label: '🗺️ フォンティボンからセントロ・マヨールへ', category: 'routes', prompt: '🗺️ フォンティボンからセントロ・マヨールへの行き方は？' },
    { id: 'c0c', label: '📰 地下鉄最新ニュース', category: 'news', prompt: '📰 ボゴタ地下鉄の最新ニュースと進捗状況は？' },
    { id: 'c1', label: '📍 ケネディ区の駅', category: 'stations', prompt: '📍 ケネディ区の駅はどこ？' },
    { id: 'c2', label: '👥 定員と輸送能力', category: 'capacity', prompt: '👥 列車の定員と輸送能力はどのくらい？' },
    { id: 'c3', label: '💳 運賃とチャージ', category: 'fares', prompt: '💳 運賃体系と支払い方法は？' },
    { id: 'c4', label: '💼 採用情報と求人', category: 'jobs', prompt: '💼 未経験から応募できる求人はありますか？' },
    { id: 'c5', label: '📍 車両基地の場所', category: 'stations', prompt: '📍 車両基地 (Patio Taller) はどこにある？' },
    { id: 'c6', label: '⏱️ 所要時間の確認', category: 'time', prompt: '⏱️ ケネディから中心街までの所要時間は？' },
    { id: 'c7', label: '🔄 トランスミレニオ乗換', category: 'transfers', prompt: '🔄 トランスミレニオとの乗換駅は？' }
  ]
};

// Mensaje de bienvenida inicial multilingüe
const getInitialBotMessage = (language) => {
  const l = (language || 'es').toLowerCase();
  if (l === 'ja') {
    return `こんにちは！私は **MetroBot IA** 🤖、ボゴタ地下鉄1号線（PLMB）および **UrbanGo** の公式都市モビリティ・AIアシスタントです。\n\n市内20区すべての移動ルート、ショッピングモール（Multiplaza、Centro Mayorなど）、公園、大学、最新ニュース、工事進捗（82.33%）、定員・輸送能力について何でもお尋ねください。\n\n[SUGERENCIAS]\n- 📍 マルティプラザの最寄駅はどこ？\n- 🗺️ フォンティボンからセントロ・マヨールへの行き方は？\n- 👥 列車の定員と輸送能力はどのくらい？\n- 📰 地下鉄最新ニュース`;
  }
  if (l === 'zh') {
    return `您好！我是 **MetroBot IA** 🤖，波哥大地铁一号线（PLMB）及 **UrbanGo** 官方全域交通与城市出行AI智能助手。\n\n您可以向我咨询波哥安全市20个行政区的所有换乘出行方案、各大商场（Multiplaza、Centro Mayor等）、公园、大学高校、最新工程进展（82.33%）、列车载客量与招聘机会。\n\n[SUGERENCIAS]\n- 📍 Multiplaza 购物中心附近有哪些地铁站？\n- 🗺️ 从丰蒂邦如何前往 Centro Mayor？\n- 👥 地铁列车与车站的额定载客量是多少？\n- 📰 地铁工程最新官方动态是什么？`;
  }
  if (l === 'pt') {
    return `Olá! Sou o **MetroBot IA** 🤖, o assistente inteligente oficial de mobilidade e geografia urbana de Bogotá no UrbanGo e Metro de Bogotá.\n\nVocê pode me perguntar sobre qualquer ponto da cidade, as 20 localidades, shoppings (Multiplaza, Centro Mayor, etc.), parques, universidades, rotas passo a passo, notícias, avanço de obra (82.33%) e capacidade.\n\n[SUGERENCIAS]\n- 📍 Quais estações ficam perto de Multiplaza?\n- 🗺️ Como chegar de Fontibón a Centro Mayor?\n- 👥 Qual é a capacidade e lotação de passageiros?\n- 📰 Quais são as últimas notícias das obras?`;
  }
  if (l === 'en') {
    return `Hello! I am **MetroBot AI** 🤖, the official intelligent mobility and urban geography assistant for Bogotá at UrbanGo and Bogotá Metro.\n\nYou can ask me about any of Bogotá's 20 localities, shopping malls (Multiplaza, Centro Mayor, Unicentro), parks, universities, step-by-step transit routes, official news, construction progress (82.33%), and passenger capacity.\n\n[SUGERENCIAS]\n- 📍 Which stations are near Multiplaza?\n- 🗺️ How do I get from Fontibón to Centro Mayor?\n- 👥 What is the passenger capacity and volume?\n- 📰 What are the latest construction news?`;
  }
  return `¡Hola! Soy **MetroBot IA** 🤖, tu asistente inteligente oficial de movilidad y geografía urbana de Bogotá en UrbanGo y la Empresa Metro de Bogotá (EMB).\n\nConozco toda la ciudad: sus 20 localidades, centros comerciales (Multiplaza, Centro Mayor, Unicentro, Titán Plaza), parques, universidades, barrios, rutas paso a paso (SITP / TransMilenio / Metro), noticias, obras al 82.33% y aforo de personas. ¡Pregúntame lo que necesites!\n\n[SUGERENCIAS]\n- 📍 ¿Qué estaciones quedan cerca de Multiplaza?\n- 🗺️ ¿Cómo llego desde Fontibón a Centro Mayor?\n- 👥 ¿Cuál es el aforo y capacidad de personas?\n- 📰 ¿Cuáles son las últimas noticias del metro y obras?`;
};

// Metadata para tarjetas de acción
const getActionCardMeta = (actionId, label, dark) => {
  const cleanId = (actionId || '').replace(/^#/, '');

  if (cleanId === 'action_map' || cleanId === 'nav_mapa') {
    return {
      icon: <Compass size={16} className="text-[#06B6D4] shrink-0" />,
      badge: 'Navegación L1',
      title: 'Mapa Interactivo de Estaciones',
      desc: 'Explora las 16 estaciones, viaducto y trazado en tiempo real.',
      btnText: 'Ver en el Mapa',
      theme: dark 
        ? 'bg-zinc-900 border-cyan-500/40 hover:border-cyan-400 text-zinc-100' 
        : 'bg-white border-cyan-300 hover:border-cyan-500 text-zinc-900',
      badgeClass: 'bg-cyan-500/10 text-cyan-400'
    };
  }

  if (cleanId === 'action_recharge' || cleanId === 'open_saldo' || cleanId === 'tullave') {
    return {
      icon: <CreditCard size={16} className="text-[#10B981] shrink-0" />,
      badge: 'Tarjeta Inteligente',
      title: 'Recargar TuTarjetaMetro',
      desc: 'Gestiona tu saldo virtual, PSE, Nequi y Daviplata.',
      btnText: 'Recargar Saldo',
      theme: dark 
        ? 'bg-zinc-900 border-emerald-500/40 hover:border-emerald-400 text-zinc-100' 
        : 'bg-white border-emerald-300 hover:border-emerald-500 text-zinc-900',
      badgeClass: 'bg-emerald-500/10 text-emerald-400'
    };
  }

  if (cleanId === 'open_portal_empleo' || cleanId.startsWith('job')) {
    return {
      icon: <Briefcase size={16} className="text-[#8B5CF6] shrink-0" />,
      badge: 'Convocatoria Laboral',
      title: 'Bolsa de Empleo Oficial Metro',
      desc: 'Más de 180 vacantes abiertas para obras, ingeniería y operación.',
      btnText: 'Ver Vacantes',
      theme: dark 
        ? 'bg-zinc-900 border-purple-500/40 hover:border-purple-400 text-zinc-100' 
        : 'bg-white border-purple-300 hover:border-purple-500 text-zinc-900',
      badgeClass: 'bg-purple-500/10 text-purple-400'
    };
  }

  if (cleanId === 'open_project_status' || cleanId === 'action_status') {
    return {
      icon: <TrendingUp size={16} className="text-[#F59E0B] shrink-0" />,
      badge: 'Auditoría EMB',
      title: 'Avance de Obra en Vivo (82.33%)',
      desc: 'Inspecciona frentes de trabajo, viaducto, patio taller y Calle 72.',
      btnText: 'Ver Estado de Obra',
      theme: dark 
        ? 'bg-zinc-900 border-amber-500/40 hover:border-amber-400 text-zinc-100' 
        : 'bg-white border-amber-300 hover:border-amber-500 text-zinc-900',
      badgeClass: 'bg-amber-500/10 text-amber-400'
    };
  }

  return {
    icon: <ArrowRight size={16} className="text-[#DC2626] shrink-0" />,
    badge: 'Acción Rápida',
    title: label || 'Abrir Sección',
    desc: 'Acceso directo desde MetroBot IA.',
    btnText: label || 'Continuar',
    theme: dark 
      ? 'bg-zinc-900 border-zinc-700 hover:border-[#DC2626] text-zinc-200' 
      : 'bg-white border-zinc-200 hover:border-[#DC2626] text-zinc-900',
    badgeClass: 'bg-[#DC2626]/10 text-[#DC2626]'
  };
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
 * Renderizador de Texto Markdown con Botón de Acción Mapa-Chat integrado
 */
const RenderBotText = ({ 
  text, 
  dark, 
  onAction, 
  onAsk, 
  onFocusStation,
  t
}) => {
  const parts = (text || '').split('[SUGERENCIAS]');
  const mainContent = parts[0] || '';
  const suggestionsContent = parts.length > 1 ? parts[1] : null;

  // Detección de estación para botón de acción directa mapa-chat
  const mentionedStation = useMemo(() => detectStationMention(mainContent), [mainContent]);

  const lines = mainContent.split('\n');

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;

        // Botón de acción interactivo Markdown: [LABEL](#ACTION_ID)
        const actionMatch = line.match(/\[(.*?)\]\((#.*?)\)/);
        if (actionMatch) {
          const label = actionMatch[1];
          const target = actionMatch[2];
          const meta = getActionCardMeta(target, label, dark);

          return (
            <div key={i} className="my-2.5">
              <button
                type="button"
                onClick={() => {
                  if (target === '#action_map' && mentionedStation && onFocusStation) {
                    onFocusStation(mentionedStation);
                  } else if (onAction) {
                    onAction(target, label);
                  }
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] group flex flex-col gap-2 ${meta.theme}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {meta.icon}
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${meta.badgeClass}`}>
                      {meta.badge}
                    </span>
                  </div>
                  <ArrowRight size={14} className="shrink-0 group-hover:translate-x-1 transition-transform opacity-70 group-hover:opacity-100" />
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm tracking-tight leading-snug">
                    {meta.title}
                  </h4>
                  <p className="text-[11px] font-medium opacity-80 mt-0.5 leading-tight">
                    {meta.desc}
                  </p>
                </div>
                <div className="pt-1 flex items-center justify-end">
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white flex items-center gap-1.5 shadow-sm transition-colors">
                    <span>{meta.btnText}</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </button>
            </div>
          );
        }

        const isBullet = line.trim().startsWith('- ');
        let rendered = line
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>');

        if (isBullet) {
          return (
            <div key={i} className="flex items-start gap-2 ml-1">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#DC2626] flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: rendered.replace(/^- /, '') }} />
            </div>
          );
        }

        return <p key={i} dangerouslySetInnerHTML={{ __html: rendered }} />;
      })}

      {/* ── BOTÓN DINÁMICO MAPA-CHAT (MICRO-INNOVACIÓN 2) ── */}
      {mentionedStation && onFocusStation && (
        <div className="pt-2 pb-1">
          <button
            type="button"
            onClick={() => onFocusStation(mentionedStation)}
            className="btn-map-focus w-full py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-[#06B6D4]/15 to-[#3B82F6]/15 hover:from-[#06B6D4]/25 hover:to-[#3B82F6]/25 border border-cyan-500/40 text-cyan-500 dark:text-cyan-400 font-black text-xs uppercase tracking-wider shadow-sm flex items-center justify-between gap-2 active:scale-95 transition-all group"
          >
            <span className="flex items-center gap-2 truncate">
              <Compass size={15} className="text-cyan-500 group-hover:rotate-45 transition-transform shrink-0" />
              <span className="truncate">🗺️ {(t ? t('mapModule.btnFocusMap', 'Enfocar en el Mapa') : 'Enfocar en el Mapa')}: {mentionedStation.name}</span>
            </span>
            <ArrowRight size={14} className="shrink-0 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Bloque interactivo de [SUGERENCIAS] */}
      {suggestionsContent && (
        <div className="mt-3 pt-3 border-t border-dashed border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
              [SUGERENCIAS]
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {suggestionsContent
              .split('\n')
              .map(s => s.trim())
              .filter(s => s.startsWith('- '))
              .map((item, idx) => {
                const itemClean = item.replace(/^- /, '').trim();
                const actionMatch = itemClean.match(/\[(.*?)\]\((#.*?)\)/);

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (actionMatch && onAction) {
                        onAction(actionMatch[2], actionMatch[1]);
                      } else if (itemClean.includes('Mapa Interactivo') && onAction) {
                        if (mentionedStation && onFocusStation) {
                          onFocusStation(mentionedStation);
                        } else {
                          onAction('#action_map', itemClean);
                        }
                      } else if (itemClean.includes('TuTarjetaMetro') && onAction) {
                        onAction('#action_recharge', itemClean);
                      } else if (onAsk) {
                        onAsk(itemClean);
                      }
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 border transition-all duration-150 active:scale-[0.98] ${
                      dark
                        ? 'bg-zinc-800/80 hover:bg-zinc-800 border-zinc-700/70 text-zinc-200 hover:border-zinc-600'
                        : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[#DC2626] font-black text-xs">•</span>
                      <span>{itemClean.replace(/\[(.*?)\]\(#.*?\)/, '$1')}</span>
                    </span>
                    <ArrowRight size={13} className="shrink-0 text-zinc-400" />
                  </button>
                );
              })}
          </div>
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

  // Chips dinámicos contextuales
  const dynamicChips = useMemo(() => {
    return DYNAMIC_CHIPS[activeLangKey] || DYNAMIC_CHIPS.es;
  }, [activeLangKey]);

  const [chat, setChat] = useState(() => [{ 
    role: 'bot', 
    text: getInitialBotMessage(lang) 
  }]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  
  // Estado de Texto a Voz (TTS)
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);

  const bottomRef = useRef(null);
  const prevLangRef = useRef(lang);
  const initialHandledRef = useRef(false);

  // Sincronización de bienvenida e idioma
  useEffect(() => {
    if (prevLangRef.current !== lang) {
      prevLangRef.current = lang;
      setChat([{ role: 'bot', text: getInitialBotMessage(lang) }]);
      // Detener cualquier voz activa al cambiar de idioma
      if (synthRef.current) {
        synthRef.current.cancel();
        setSpeakingIndex(null);
      }
    } else if (isOpen) {
      setChat(prev => (prev.length <= 1 ? [{ role: 'bot', text: getInitialBotMessage(lang) }] : prev));
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

  // ── FUNCIÓN DE TEXTO A VOZ (TTS) (MICRO-INNOVACIÓN 2) ──
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
      zh: 'zh-CN',
      ja: 'ja-JP'
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

    if (cleanId === 'action_map' || cleanId === 'nav_mapa') {
      if (onNavigate) {
        onNavigate('mapa');
        onClose();
      }
      return;
    }

    if (cleanId === 'action_recharge' || cleanId === 'open_saldo' || cleanId === 'tullave') {
      if (onNavigate) {
        onNavigate('saldo');
        onClose();
      }
      return;
    }

    if (cleanId === 'open_project_status' || cleanId === 'action_status') {
      if (onOpenProjectStatus) {
        onOpenProjectStatus();
        return;
      }
      if (onNavigate) {
        onNavigate('estado');
        onClose();
      }
      return;
    }

    if (cleanId === 'open_portal_empleo' || cleanId.startsWith('job')) {
      if (onOpenNewsOrJob) {
        onOpenNewsOrJob('empleo', null);
        onClose();
      }
      return;
    }

    if (cleanId === 'action_report' || cleanId === 'report_incident') {
      if (onReportIncident) {
        onReportIncident();
        onClose();
      }
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

  // Enviar pregunta
  const ask = async (overrideMsg) => {
    const msg = (overrideMsg || input).trim();
    if (!msg || loading) return;

    // Detener voz anterior si estaba hablando
    if (synthRef.current) {
      synthRef.current.cancel();
      setSpeakingIndex(null);
    }

    setChat(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);

    setTimeout(async () => {
      const res = await getMetroBotResponse(msg, lang, t);
      setChat(prev => [...prev, { role: 'bot', text: res }]);
      setLoading(false);
    }, 500);
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
                  {activeLangKey === 'zh' ? '多语种智能助理 (西 · 英 · 葡 · 中 · 日)' :
                   activeLangKey === 'en' ? 'Online AI Assistant (ES · EN · PT · ZH · JA)' :
                   activeLangKey === 'pt' ? 'Assistente Virtual Online (ES · EN · PT · ZH · JA)' :
                   activeLangKey === 'ja' ? '公式AIアシスタント (西・英・葡・中・日)' :
                   'Asistente Oficial en Línea (ES · EN · PT · ZH · JA)'}
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
                { code: 'zh', label: '中文' },
                { code: 'ja', label: '日本語' }
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
                
                {/* ── BOTÓN DE TEXTO A VOZ (TTS) (MICRO-INNOVACIÓN 2) ── */}
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
                    onAsk={(q) => ask(q)} 
                    onFocusStation={handleFocusStationOnMap}
                    t={t}
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

        {/* ── FOOTER CON CHIPS DINÁMICOS CONTEXTUALES Y FORMULARIO (MICRO-INNOVACIÓN 2) ── */}
        <div className={`shrink-0 p-3 sm:p-4 border-t flex flex-col gap-2.5 ${
          dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
        }`}>
          {/* Barra de Chips Dinámicos Deslizables */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar w-full max-w-full">
            {dynamicChips.map(chip => (
              <button 
                key={chip.id} 
                onClick={() => ask(chip.prompt)}
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
