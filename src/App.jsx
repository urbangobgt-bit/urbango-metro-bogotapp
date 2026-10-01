import { useI18n } from './i18nContext';
import { useAuth } from './context/AuthContext';
import LanguageSelector from './components/LanguageSelector';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import {
  Train, Map as MapIcon, Newspaper, User, Bell, X, AlertTriangle,
  Send, Moon, Sun, Construction, Share2, ArrowRight, ArrowLeft, Briefcase, ExternalLink,
  MessageSquare, Bookmark, MapPin, Mail, Search, ShieldCheck,
  Download, FileText, Leaf, TrendingUp, Calendar, DollarSign, Eye, Clock, BarChart3, ChevronDown,
  Settings, CreditCard, Menu
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase, isMocking, empleoData } from './supabaseClient';
import InteractiveMap from './components/InteractiveMap';
import MetroBot from './components/MetroBot';
import Landing3D from './Landing3D';
import SaldoCard, { SaldoModal } from './components/SaldoCard';
import SettingsModal from './components/SettingsModal';
import MetroEntranceAnimation from './components/MetroEntranceAnimation';
import AccessibilityMenu from './components/AccessibilityMenu';
import PortalEmpleoModal from './components/PortalEmpleoModal';
import PortalEmpleoView from './components/PortalEmpleoView';
import { getMetroBotResponse } from './utils/metroBotEngine';
import { NOTICIAS_KB, EMPLEOS_KB } from './data/metroKnowledge';
import IndicadoresAvanceL1MB from './components/IndicadoresAvanceL1MB';
import FeedNoticiasInstitucionales from './components/FeedNoticiasInstitucionales';
import ModuloTransparenciaDoc from './components/ModuloTransparenciaDoc';
import { INDICADORES_L1MB, NOTICIAS_INSTITUCIONALES, DOCUMENTOS_OFICIALES } from './data/metroOfficialData';
import MetroBotAvatar from './components/MetroBotAvatar';
import NewsFeed from './components/NewsFeed';
import RoadIncidentsModule from './components/RoadIncidentsModule';
import CitizenImpactModule from './components/CitizenImpactModule';
import ProfileAvatarSelector, { RenderUserAvatar } from './components/ProfileAvatarSelector';
import ProjectStatus from './components/ProjectStatus';
import NewsAndJobsModal from './components/NewsAndJobsModal';
import ProjectStatusModal from './components/ProjectStatusModal';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
  * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
  .no-scroll::-webkit-scrollbar { display: none; }

  @keyframes trainMove { 0% { transform: translate3d(-150%, 0, 0); } 100% { transform: translate3d(250%, 0, 0); } }
  .animate-train { will-change: transform; animation: trainMove 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

  @keyframes float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
  .animate-float { animation: float 3s ease-in-out infinite; }

  @keyframes fadeInSmooth {
    from { opacity: 0; transform: translateY(15px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-smooth { animation: fadeInSmooth 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }

  @keyframes popupIn {
    from { opacity: 0; transform: translateY(12px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .popup-in { animation: popupIn 0.25s cubic-bezier(0.2,0.8,0.2,1) forwards; }

  /* ── EN VIVO badge ── */
  @keyframes livePulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(185,28,28,0.7); }
    50%       { box-shadow: 0 0 0 6px rgba(185,28,28,0); }
  }
  .live-dot { animation: livePulse 1.4s ease-in-out infinite; }

  /* ── shimmer sweep en botón postulación ── */
  @keyframes shimmerSlide {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
  .btn-shimmer:hover .shimmer-layer { animation: shimmerSlide 0.7s ease forwards; }

  /* ── notification badge glow ── */
  @keyframes badgeGlow {
    0%, 100% { filter: brightness(1); }
    50%       { filter: brightness(1.3) drop-shadow(0 0 4px currentColor); }
  }
  .badge-glow { animation: badgeGlow 2s ease-in-out infinite; }

  /* ── Onda expansiva central ── */
  @keyframes waveExpand {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(1.5); opacity: 0; }
  }
  .wave-effect { animation: waveExpand 1.5s cubic-bezier(0.1, 0.8, 0.3, 1) infinite; }

  /* ── Levitación del robot ── */
  @keyframes robotFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-5px) rotate(1.5deg); }
  }
  .robot-float { animation: robotFloat 3.5s ease-in-out infinite; }

  /* ── Pulso del badge Online ── */
  @keyframes pulseOnline {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.6; }
  }
  .pulse-online { animation: pulseOnline 1.5s ease-in-out infinite; }

  /* ── Partículas LED del diagrama central ── */
  @keyframes ledParticleMove {
    0% { transform: rotate(0deg) translate(95px) rotate(0deg); }
    100% { transform: rotate(360deg) translate(95px) rotate(-360deg); }
  }
  .led-particle-1 { animation: ledParticleMove 18s linear infinite; }
  .led-particle-2 { animation: ledParticleMove 24s linear infinite reverse; }

  /* ── DARK MODE: ensure full-page background ── */
  html.dark body { background: #09090b; }
  html:not(.dark) body { background: #f4f4f5; }
`;

// --- DATA ---
const STATIONS = [
  { id: 1,  code: 'E1',  name: 'E1 - Patio Taller Bosa',       loc: "st_loc_bosa",    lat: 4.6095, lng: -74.1780, status: 'En obra', progress: '91%', alert: false, img: '/Linea 1 del metro de bogora.png',  desc: "st_desc_1" },
  { id: 2,  code: 'E2',  name: 'E2 - Av. Villavicencio',        loc: "st_loc_kennedy",           lat: 4.6180, lng: -74.1680, status: 'En obra', progress: '37%', alert: false, img: '/Corredor central.jfif',             desc: "st_desc_2" },
  { id: 3,  code: 'E3',  name: 'E3 - Av. Boyacá',               loc: "st_loc_kennedy",           lat: 4.6230, lng: -74.1580, status: 'En obra', progress: '34%', alert: false, img: '/Corredor central.jfif',             desc: "st_desc_3" },
  { id: 4,  code: 'E4',  name: 'E4 - Américas',                 loc: "st_loc_kennedy",           lat: 4.6260, lng: -74.1460, status: 'En obra', progress: '31%', alert: false, img: '/Corredor central.jfif',             desc: "st_desc_4" },
  { id: 5,  code: 'E5',  name: 'E5 - Av. Las Américas',         loc: "st_loc_kennedy",           lat: 4.6290, lng: -74.1340, status: 'En obra', progress: '28%', alert: false, img: '/Corredor central.jfif',             desc: "st_desc_5" },
  { id: 6,  code: 'E6',  name: 'E6 - Américas / NQS',           loc: "st_loc_kennedy",           lat: 4.6310, lng: -74.1200, status: 'En obra', progress: '25%', alert: false, img: '/caracas calle 19 y 22.jfif',        desc: "st_desc_6" },
  { id: 7,  code: 'E7',  name: 'E7 - Av. Primero de Mayo',      loc: "st_loc_puente",     lat: 4.6260, lng: -74.1060, status: 'En obra', progress: '22%', alert: true,  img: '/caracas calle 19 y 22.jfif',        desc: "st_desc_7" },
  { id: 8,  code: 'E8',  name: 'E8 - Puente Aranda',            loc: "st_loc_puente",     lat: 4.6240, lng: -74.0940, status: 'En obra', progress: '20%', alert: false, img: '/caracas calle 19 y 22.jfif',        desc: "st_desc_8" },
  { id: 9,  code: 'E9',  name: 'E9 - Ferrocarril',              loc: "st_loc_puente",     lat: 4.6210, lng: -74.0820, status: 'En obra', progress: '18%', alert: false, img: '/Caracas.jfif',                     desc: "st_desc_9" },
  { id: 10, code: 'E10', name: 'E10 - Calle 1 / Caracas',       loc: "st_loc_martires",          lat: 4.6180, lng: -74.0720, status: 'En obra', progress: '17%', alert: false, img: '/Caracas.jfif',                     desc: "st_desc_10" },
  { id: 11, code: 'E11', name: 'E11 - Calle 3 / Caracas',       loc: "st_loc_martires",          lat: 4.6210, lng: -74.0700, status: 'Cerrada', progress: '16%', alert: true,  img: '/caracas calle 13 y 19.jfif',       desc: "st_desc_11" },
  { id: 12, code: 'E12', name: 'E12 - Av. Jiménez',             loc: "st_loc_santafe",          lat: 4.6270, lng: -74.0660, status: 'Cerrada', progress: '15%', alert: true,  img: '/caracas calle 13 y 19.jfif',       desc: "st_desc_12" },
  { id: 13, code: 'E13', name: 'E13 - Calle 26',                loc: "st_loc_santafe",          lat: 4.6360, lng: -74.0640, status: 'Cerrada', progress: '14%', alert: true,  img: '/caracas calle 13 y 19.jfif',       desc: "st_desc_13" },
  { id: 14, code: 'E14', name: 'E14 - Calle 39 / Caracas',      loc: "st_loc_teusaquillo",       lat: 4.6470, lng: -74.0630, status: 'Cerrada', progress: '13%', alert: true,  img: '/Caracas.jfif',                     desc: "st_desc_14" },
  { id: 15, code: 'E15', name: 'E15 - Calle 57 / Caracas',      loc: "st_loc_chapinero",         lat: 4.6560, lng: -74.0620, status: 'Cerrada', progress: '13%', alert: true,  img: '/Caracas.jfif',                     desc: "st_desc_15" },
  { id: 16, code: 'E16', name: 'E16 - Intercambiador Calle 72', loc: "st_loc_barrios",    lat: 4.6640, lng: -74.0610, status: 'Cerrada', progress: '93%', alert: true,  img: '/caracas calle 69 y 72a.png',       desc: "st_desc_16" },
];

const NEWS = [
  {
    id: 'news_1',
    numericId: 0,
    type: 'breaking',
    titleKey: "news_1_title",
    title: "Avance físico general del Metro alcanza el 82.33%",
    date: 'Septiembre 2026',
    urgency: 'Alta',
    img: '/Linea 1 del metro de bogora.png',
    desc: "Obras en Viaducto y Patio Taller avanzan según el cronograma.",
    authorKey: "news_author_emb",
    author: "Empresa Metro de Bogotá",
    sourceKey: "news_source_emb",
    source: "Comunicado Oficial EMB",
    gallery: ['/Linea 1 del metro de bogora.png', '/Corredor central.jfif', '/caracas calle 69 y 72a.png'],
    relatedIds: ['news_2', 1],
    fullKey: "news_1_full",
    fullText: "La Empresa Metro de Bogotá (EMB) confirmó que el proyecto de la Primera Línea ha alcanzado un avance físico general del 82.33%. Con 6 vigas lanzadoras activas en los frentes de Bosa, Primero de Mayo y la Avenida Caracas, la instalación de dovelas y el viaducto elevado avanzan cumpliendo estrictamente con el cronograma. En el Patio Taller de Bosa, los trenes automáticos 1 y 2 continúan en fase de pruebas técnicas de rodaje sobre vía."
  },
  {
    id: 'news_2',
    numericId: 1,
    type: 'noticia',
    titleKey: "news_2_title",
    title: "Avances en el frente de obra de la Caracas con Calle 72",
    date: 'Septiembre 2026',
    urgency: 'Media',
    img: '/caracas calle 69 y 72a.png',
    desc: "Finaliza la adecuación del intercambiador vial en la Calle 72.",
    authorKey: "news_author_sdm",
    author: 'Secretaría Distrital de Movilidad / EMB',
    sourceKey: "news_source_sdm",
    source: 'Boletín Oficial SDM & EMB',
    gallery: ['/caracas calle 69 y 72a.png', '/Caracas.jfif', '/caracas calle 13 y 19.jfif'],
    relatedIds: ['news_1', 0, 2],
    fullKey: "news_2_full",
    fullText: "El frente de obra de la Avenida Caracas con Calle 72 culminó la adecuación de la estructura del intercambiador vial subterráneo. Este hito permite la circulación continua del tráfico vehicular mientras avanzan los acabados de espacio público, senderos peatonales y la preparación del viaducto para la futura Estación 16 que integrará con la Línea 2."
  },
  {
    id: 2,
    numericId: 2,
    type: 'noticia',
    titleKey: "news_3_title",
    title: "Alerta económica de comerciantes por obras en la Caracas",
    date: 'Ayer',
    urgency: 'Alta',
    img: '/caracas calle 69 y 72a.png',
    desc: "news_3_desc",
    authorKey: "news_author_ccb",
    author: 'Cámara de Comercio de Bogotá',
    sourceKey: "news_source_ccb",
    source: 'Informe Sectorial CCB',
    gallery: ['/caracas calle 69 y 72a.png', '/caracas calle 13 y 19.jfif', '/Corredor central.jfif'],
    relatedIds: ['news_1', 'news_2', 0, 1],
    fullKey: "news_3_full",
    fullText: "Comerciantes del corredor de la Avenida Caracas reportan variaciones en sus ingresos debido a los cerramientos viales por las obras del viaducto. La Cámara de Comercio de Bogotá y la Alcaldía activaron mesas de concertación económica para brindar incentivos fiscales y apoyo financiero a los locales afectados durante la fase de cimentación."
  },
];

// ── SYSTEM PROMPT PARA METROBOT IA ──────────────────────────────
const getSystemPrompt = (lang, t) => {
  return `Eres MetroBot, el asistente inteligente oficial de UrbanGo y la Primera Línea del Metro de Bogotá (PLMB). Tu rol es responder consultas ciudadanas y técnicas de forma precisa, moderna y empática.
Usa siempre estos datos verificados:
- Capacidad por tren: 1,800 pasajeros (36,000 a 72,000 pax/h/sentido).
- Frecuencia pico: 3 minutos (20 trenes/hora), reducible a 90 segundos con Puertas de Andén.
- Horarios de servicio: Regulados entre 5:30 AM y 23:00 PM.
- Cobertura: 16 estaciones desde Portal Américas hasta Calle 72.
- Tecnología: Conducción automatizada CBTC sin conductor, 100% eléctrica.
Responde de forma estructurada usando viñetas, emojis claros y tono servicial.

${t('bot_system_prompt')}`;
};

const BOT_ANSWERS = {
  ES: {
    avance: `¡Con muchísimo gusto te informo! 😊\n\n📊 **Avance general:** 77.53% (corte mayo 2026)\n\n🏗️ **Hitos principales:**\n- 🚇 14 km de viaducto construido\n- 🚆 Tren N.° 2 en pruebas de rodaje\n- 🏭 Patio Taller Bosa al 91%\n- 🔄 Intercambiador Calle 72 al 93%\n\n¡Bogotá está muy cerca de tener su metro! 🚇❤️`,
    tren: `¡Qué alegría contarte esto! 🚇✨\n\n🚆 **Estado del material rodante:**\n- Tren N.° 2 en pruebas de rodaje sobre el viaducto\n- 30 trenes automáticos en total (fabricados por CRRC)\n- Cada tren: 6-7 coches, 140 m de longitud, 1,800 pax\n- Sistema 100% eléctrico con frenado regenerativo\n\n¡Un hito histórico para Bogotá!`,
    estaciones: `¡Con placer te cuento! 📍\n\n🗺️ **Las 16 estaciones de la Línea 1:**\n- E1: Patio Taller Bosa\n- E2: Av. Villavicencio\n- E3: Av. Boyacá\n- E4–E5: Américas\n- E6: Américas/NQS\n- E7: Av. Primero de Mayo\n- E8: Puente Aranda\n- E9: Ferrocarril\n- E10–E11: Calle 1-3 / Caracas\n- E12: Av. Jiménez\n- E13: Calle 26\n- E14: Calle 39\n- E15: Calle 57\n- E16: Intercambiador Calle 72\n\n🔗 Conexiones: NQS, Calle 26 y Calle 72`,
    calle72: `¡Claro que sí! 🏗️\n\n📍 **Intercambiador de la Calle 72 (E16):**\n- Avance: **93%** ✅\n- Tipo: Estación intermodal (Metro + TransMilenio)\n- Demolición de estación TM: completada\n- Ubicación: Barrios Unidos\n\n¡Es una de las estaciones más avanzadas del proyecto! 💪`,
    apertura: `📅 **Cronograma oficial:**\n\n- 2023: Cierre financiero completado\n- 2024: Inicio obra civil principal\n- 2026: Pruebas de rodaje (¡ya estamos aquí! 🎉)\n- 2027: Pruebas con pasajeros\n- **2028: Apertura comercial estimada**\n\nCon un avance del 77.53%, ¡la meta está cada vez más cerca! 🌆❤️`,
    empleo: `¡Qué buena iniciativa! 💼\n\n📋 **Oportunidades laborales:**\n- 180 vacantes activas\n- Áreas: Operación, Mantenimiento, Sistemas, Estaciones\n- Desde bachilleres hasta profesionales\n\n🔗 **Cómo aplicar:**\n1. Portal de Empleo de Bogotá: bogota.gov.co\n2. Sección Empleo en esta app\n\n¡Te deseo mucho éxito! 🌐`,
    caracas: `😅 ¡Te entiendo perfectamente!\n\n🚧 **Cierres activos en Av. Caracas:**\n- Calle 26: Cierre total por obras de pilotes\n- Calle 39: Reducción a 1 carril (Teusaquillo)\n- Calle 57: Desvío por Carrera 13\n- Calle 72: Cierre parcial por demolición\n\n🛣️ **Rutas alternas recomendadas:**\n- Carrera 10\n- NQS (Carrera 30)\n- Carrera 7 / 13\n\n¡Paciencia, el metro vale la pena! 🚗➡️🚇`,
    horario: `🕐 **Horarios de operación planificados:**\n\n- 🌅 Apertura: **5:30 AM**\n- 🌙 Cierre: **23:00 PM**\n- ⏱️ Frequencia pico: cada **3 minutos** (20 trenes/h)\n- 🚀 Con Puertas de Andén: reducible a **90 segundos**\n\nOperación regulada los 7 días de la semana. 📅`,
    cbtc: `🤖 **Tecnología CBTC GoA4:**\n\n- Sistema de conducción 100% automatizada (sin conductor)\n- Communication-Based Train Control (CBTC)\n- Grado de Automatización 4 (GoA4) — el más alto\n- 100% eléctrico · Cero emisiones directas\n- Frenado regenerativo que devuelve energía a la red\n\n🌿 El metro más moderno de Latinoamérica. ⚡`,
    capacidad: `👥 **Capacidad del sistema:**\n\n- 🚇 Por tren: **1,800 pasajeros**\n- ⏱️ Por hora/sentido: **36,000 a 72,000 pax**\n- 📊 Estimado diario: **800,000–1,000,000 pasajeros**\n- 🚆 Flota: 30 trenes de 6-7 coches cada uno\n\n¡Suficiente para transformar la movilidad de Bogotá! 🏙️`,
    costo: `💰 **Inversión del proyecto:**\n\n- Presupuesto total: **$16.27 billones COP**\n- Fuentes: Nación + Distrito + Banca Multilateral\n- Financiadores: BID, CAF, BEI, BIRF\n\n📊 **Distribución:**\n- Infraestructura civil: 62%\n- Material rodante: 18%\n- Sistemas y tecnología: 12%\n- Gestión y social: 8%\n\nTodo bajo supervisión de la banca multilateral. 🏦`,
    fallback: `No entendí tu pregunta del todo. Escríbeme sobre avance de obra, estaciones, empleo o cierres viales.`
  },
  EN: {
    avance: `I'm happy to inform you! 😊\n\n📊 **Overall progress:** 77.53% (cut-off May 2026)\n\n🏗️ **Key milestones:**\n- 🚇 14 km of viaduct built\n- 🚆 Train N.° 2 in test runs\n- 🏭 Bosa Yard at 91%\n- 🔄 Calle 72 Interchange at 93%\n\nBogotá is very close to having its metro! 🚇❤️`,
    tren: `Great news! 🚇✨\n\n🚆 **Rolling stock status:**\n- Train N.° 2 in technical test runs on the viaduct\n- 30 automatic trains in total (manufactured by CRRC)\n- Each train: 6-7 cars, 140 m long, 1,800 pax\n- 100% electric system with regenerative braking\n\nA historic milestone for Bogotá!`,
    estaciones: `With pleasure I tell you! 📍\n\n🗺️ **The 16 stations of Line 1:**\n- E1: Bosa Yard\n- E2: Av. Villavicencio\n- E3: Av. Boyacá\n- E4–E5: Américas\n- E6: Américas/NQS\n- E7: Av. Primero de Mayo\n- E8: Puente Aranda\n- E9: Ferrocarril\n- E10–E11: Calle 1-3 / Caracas\n- E12: Av. Jiménez\n- E13: Calle 26\n- E14: Calle 39\n- E15: Calle 57\n- E16: Calle 72 Interchange\n\n🔗 Connections: NQS, Calle 26, and Calle 72`,
    calle72: `Sure! 🏗️\n\n📍 **Calle 72 Interchange (E16):**\n- Progress: **93%** ✅\n- Type: Intermodal station (Metro + TransMilenio)\n- TM station demolition: completed\n- Location: Barrios Unidos\n\nIt is one of the most advanced stations of the project! 💪`,
    apertura: `📅 **Official Schedule:**\n\n- 2023: Financial closure completed\n- 2024: Start of main civil works\n- 2026: Test runs (we are here! 🎉)\n- 2027: Passenger tests\n- **2028: Estimated commercial opening**\n\nWith 77.53% progress, the goal is getting closer! 🌆❤️`,
    empleo: `Great initiative! 💼\n\n📋 **Job opportunities:**\n- 180 active vacancies\n- Areas: Operations, Maintenance, Systems, Stations\n- From high school graduates to professionals\n\n🔗 **How to apply:**\n1. Bogotá Job Portal: bogota.gov.co\n2. Job section in this app\n\nWish you the best of luck! 🌐`,
    caracas: `😅 I completely understand!\n\n🚧 **Active closures on Av. Caracas:**\n- Calle 26: Full closure due to piling works\n- Calle 39: Reduced to 1 lane (Teusaquillo)\n- Calle 57: Detour via Carrera 13\n- Calle 72: Partial closure due to demolition\n\n de la Caracas.\n\n de desvíos:\n- Carrera 10\n- NQS (Carrera 30)\n- Carrera 7 / 13\n\nPatience, the metro is worth it! 🚗➡️🚇`,
    horario: `🕐 **Planned operating hours:**\n\n- 🌅 Opening: **5:30 AM**\n- 🌙 Closing: **23:00 PM**\n- ⏱️ Peak frequency: every **3 minutes** (20 trains/h)\n- 🚀 With platform screen doors: reducible to **90 seconds**\n\nRegulated operation 7 days a week. 📅`,
    cbtc: `🤖 **CBTC GoA4 Technology:**\n\n- 100% automated driverless system\n- Communication-Based Train Control (CBTC)\n- Grade of Automation 4 (GoA4) — highest standard\n- 100% electric · Zero direct emissions\n- Regenerative braking system returning energy to grid\n\n🌿 The most modern metro in Latin America. ⚡`,
    capacidad: `👥 **System capacity:**\n\n- 🚇 Per train: **1,800 passengers**\n- ⏱️ Per hour/direction: **36,000 to 72,000 pax**\n- 📊 Daily estimate: **800,000–1,000,000 passengers**\n- 🚆 Fleet: 30 trains of 6-7 cars each\n\nEnough to transform Bogotá's mobility! 🏙️`,
    costo: `💰 **Project investment:**\n\n- Total budget: **$16.27 billion COP**\n- Sources: Nation + District + Multilateral Banks\n- Funders: IDB, CAF, EIB, IBRD\n\n📊 **Distribution:**\n- Civil infrastructure: 62%\n- Rolling stock: 18%\n- Systems and technology: 12%\n- Management & social: 8%\n\nAll under multilateral bank supervision. 🏦`,
    fallback: `I didn't fully understand your question. Write me about progress, stations, jobs, or road closures.`
  },
  PT: {
    avance: `Com muito prazer te informo! 😊\n\n📊 **Avanço geral:** 77.53% (corte em maio de 2026)\n\n🏗️ **Principais marcos:**\n- 🚇 14 km de viaduto construído\n- 🚆 Trem N.° 2 em testes de rodagem\n- 🏭 Pátio de Oficinas Bosa a 91%\n- 🔄 Trevo da Calle 72 a 93%\n\nBogotá está muito perto de ter seu metrô! 🚇❤️`,
    tren: `Que alegria te contar isso! 🚇✨\n\n🚆 **Status do material rodante:**\n- Trem N.° 2 em testes técnicos no viaduto\n- 30 trens automáticos no total (fabricados pela CRRC)\n- Cada trem: 6-7 vagões, 140 m de comprimento, 1.800 pax\n- Sistema 100% elétrico com frenagem regenerativa\n\nUm marco histórico para Bogotá!`,
    estaciones: `Com prazer te conto! 📍\n\n🗺️ **As 16 estações da Linha 1:**\n- E1: Pátio Bosa\n- E2: Av. Villavicencio\n- E3: Av. Boyacá\n- E4–E5: Américas\n- E6: Américas/NQS\n- E7: Av. Primeiro de Mayo\n- E8: Puente Aranda\n- E9: Ferrocarril\n- E10–E11: Calle 1-3 / Caracas\n- E12: Av. Jiménez\n- E13: Calle 26\n- E14: Calle 39\n- E15: Calle 57\n- E16: Trevo da Calle 72\n\n🔗 Conexões: NQS, Calle 26 e Calle 72`,
    calle72: `Com certeza! 🏗️\n\n📍 **Trevo da Calle 72 (E16):**\n- Avanço: **93%** ✅\n- Tipo: Estação intermodal (Metrô + TransMilenio)\n- Demolição da estação TM: concluída\n- Localização: Barrios Unidos\n\nÉ uma das estações mais avançadas do projeto! 💪`,
    apertura: `📅 **Cronograma oficial:**\n\n- 2023: Fechamento financeiro concluído\n- 2024: Início das obras civis principais\n- 2026: Testes de rodagem (já estamos aqui! 🎉)\n- 2027: Testes com passageiros\n- **2028: Abertura comercial estimada**\n\nCom 77.53% de avanço, a meta está cada vez mais próxima! 🌆❤️`,
    empleo: `Que boa iniciativa! 💼\n\n📋 **Oportunidades de trabalho:**\n- 180 vagas ativas\n- Áreas: Operação, Manutenção, Sistemas, Estações\n- De graduados do ensino médio a profissionais\n\n🔗 **Como se candidatar:**\n1. Portal de Empregos de Bogotá: bogota.gov.co\n2. Seção de Empregos neste app\n\nTe desejo muito sucesso! 🌐`,
    caracas: `😅 Eu te entendo perfeitamente!\n\n🚧 **Bloqueios ativos na Av. Caracas:**\n- Calle 26: Fechamento total por obras de estacas\n- Calle 39: Redução para 1 faixa (Teusaquillo)\n- Calle 57: Desvio pela Carrera 13\n- Calle 72: Fechamento parcial por demolição\n\n de desvios:\n- Carrera 10\n- NQS (Carrera 30)\n- Carrera 7 / 13\n\nPaciência, o metrô vale a pena! 🚗➡️🚇`,
    horario: `🕐 **Horários de funcionamento planejados:**\n\n- 🌅 Abertura: **5:30 AM**\n- 🌙 Fechamento: **23:00 PM**\n- ⏱️ Frequência de pico: a cada **3 minutos** (20 trens/h)\n- 🚀 Com portas de plataforma: reduzível para **90 segundos**\n\nOperação regulada 7 dias por semana. 📅`,
    cbtc: `🤖 **Tecnologia CBTC GoA4:**\n\n- Sistema de condução 100% automatizado sem condutor\n- Communication-Based Train Control (CBTC)\n- Grau de Automação 4 (GoA4) — o mais alto padrão\n- 100% elétrico · Zero emissões diretas\n- Sistema de frenagem regenerativa que devolve energia à rede\n\n🌿 O metrô mais moderno da América Latina. ⚡`,
    capacidad: `👥 **Capacidade do sistema:**\n\n- 🚇 Por trem: **1.800 passageiros**\n- ⏱️ Por hora/sentido: **36.000 a 72.000 pax**\n- 📊 Estimativa diária: **800.000–1.000.000 passageiros**\n- 🚆 Frota: 30 trenes de 6-7 vagões cada\n\nSuficiente para transformar a mobilidade de Bogotá! 🏙️`,
    costo: `💰 **Investimento do projeto:**\n\n- Orçamento total: **$16.27 bilhões COP**\n- Fontes: Nação + Distrito + Bancos Multilaterais\n- Financiadores: BID, CAF, BEI, BIRD\n\n📊 **Distribuição:**\n- Infraestrutura civil: 62%\n- Material rodante: 18%\n- Sistemas e tecnologia: 12%\n- Gestão & social: 8%\n\nTudo sob supervisão de banco multilateral. 🏦`,
    fallback: `Não entendi totalmente sua pergunta. Pergunte-me sobre o avanço, estações, vagas ou bloqueios.`
  },
  ZH: {
    avance: `我非常高兴为您提供信息！😊\n\n📊 **总体进展:** 77.53% (截至2026年5月)\n\n🏗️ **主要里程碑:**\n- 🚇 建成高架桥14公里\n- 🚆 2号列车进行试运行测试\n- 🏭 博萨车场进度达91%\n- 🔄 第72街立交桥进度达93%\n\n波哥大非常接近拥有自己的地铁！🚇❤️`,
    tren: `非常高兴告诉您这个消息！🚇✨\n\n🚆 **机车车辆状态:**\n- 2号列车在高架桥上进行技术试运行测试\n- 总共30列自动驾驶列车（由中车制造）\n- 每列车: 6-7节车厢，长度140米，载客量1800人\n- 100%纯电系统，具备再生制动功能\n\n波哥大的历史性里程碑！`,
    estaciones: `很高兴为您解答！📍\n\n🗺️ **一号线16个车站:**\n- E1: 博萨车场\n- E2: Av. Villavicencio\n- E3: Av. Boyacá\n- E4–E5: Américas\n- E6: Américas/NQS\n- E7: Av. Primero de Mayo\n- E8: Puente Aranda\n- E9: Ferrocarril\n- E10–E11: Calle 1-3 / Caracas\n- E12: Av. Jiménez\n- E13: Calle 26\n- E14: Calle 39\n- E15: Calle 57\n- E16: 第72街立交桥\n\n🔗 换乘站: NQS、Calle 26 和 Calle 72`,
    calle72: `当然可以！🏗️\n\n📍 **第72街立交桥 (E16):**\n- 进展: **93%** ✅\n- 类型: 多式联运车站 (地铁 + 快速公交TM)\n- TM公交站拆除: 已完成\n- 位置: Barrios Unidos\n\n这是该项目中最先进的车站之一！💪`,
    apertura: `📅 **官方时间表:**\n\n- 2023年: 完成融资闭环\n- 2024年: 启动主要土木工程\n- 2026年: 试运行测试 (我们已经在这里了！🎉)\n- 2027年: 乘客测试\n- **2028年: 预计商业运营开通**\n\n随着77.53%的进展，目标越来越近了！🌆❤️`,
    empleo: `非常棒的想法！💼\n\n📋 **就业机会:**\n- 180个活跃空缺职位\n- 领域: 运营、维护、系统、车站\n- 从高中毕业生到专业人员\n\n🔗 **如何申请:**\n1. 波哥大就业门户网站: bogota.gov.co\n2. 本应用中的就业板块\n\n祝您成功！🌐`,
    caracas: `😅 我完全理解！\n\n🚧 **加拉加斯大道的活跃封闭段:**\n- 第26街: 因打桩工程全线封闭\n- 第39街: 缩减为1车道 (Teusaquillo)\n- 第57街: 通过Carrera 13绕行\n- 第72街: 因拆除工作部分封闭\n\n🛣️ **建议替代路线:**\n- Carrera 10\n- NQS (Carrera 30)\n- Carrera 7 / 13\n\n耐心点，地铁是值得的！🚗➡️🚇`,
    horario: `🕐 **规划的运营时间:**\n\n- 🌅 开站时间: **5:30 AM**\n- 🌙 闭站时间: **23:00 PM**\n- ⏱️ 高峰发车间隔: 每 **3分钟** (20列车/小时)\n- 🚀 配备站台屏蔽门后: 可缩短至 **90秒**\n\n每周7天规范运营。📅`,
    cbtc: `🤖 **CBTC GoA4 技术:**\n\n- 100%全自动无人驾驶系统\n- 基于通信的列车控制系统 (CBTC)\n- 自动驾驶等级4级 (GoA4) —— 最高标准\n- 100%纯电运行 · 零直接排放\n- 再生制动系统可将电能反馈回电网\n\n🌿 拉美最现代化的地铁。⚡`,
    capacidad: `👥 **系统运力:**\n\n- 🚇 每列车: **1,800名乘客**\n- ⏱️ 每小时单向运力: **36,000至72,000人次**\n- 📊 预估每日客流量: **800,000–1,000,000人次**\n- 🚆 舰队: 30列车，每列6-7节车厢\n\n足够彻底改变波哥大的出行状况！🏙️`,
    costo: `💰 **项目投资:**\n\n- 总预算: **16.27万亿哥伦比亚比索 (COP)**\n- 资金来源: 国家 + 地区 + 多边开发银行\n- 出资方: 美洲开发银行(BID)、拉美开发银行(CAF)、欧洲投资银行(BEI)、世界银行(BIRF)\n\n📊 **分配比例:**\n- 土木基础设施: 62%\n- 机车车辆: 18%\n- 系统与技术: 12%\n- 管理与社会: 8%\n\n全部在多边银行监管下进行。🏦`,
    fallback: `我没有完全理解您的问题。请向我咨询进度、车站、就业或封路相关的问题。`
  },
  JA: {
    avance: `喜んでお知らせします！😊\n\n📊 **総合進捗状況:** 77.53% (2026年5月時点)\n\n🏗️ **主要マイルストーン:**\n- 🚇 14kmの高架橋建設完了\n- 🚆 第2編成が試運転中\n- 🏭 ボサ車両基地進捗率91%\n- 🔄 72番街結節点進捗率93%\n\nボゴタに地下鉄が走る日が間近に迫っています！🚇❤️`,
    tren: `素晴らしいニュースをお届けします！🚇✨\n\n🚆 **車両の運行準備状況:**\n- 第2編成が高架橋上で走行テスト中\n- 全30編成の完全自動運転列車（CRRC製造）\n- 各編成: 6〜7両編成、全長140m、定員1,800名\n- 回生ブレーキ付き100%電気駆動システム\n\nボゴタの歴史的瞬間です！`,
    estaciones: `喜んでご案内します！📍\n\n🗺️ **1号線の全16駅:**\n- E1: ボサ車両基地 (Patio Taller)\n- E2: アベニーダ・ビジャビセンシオ\n- E3: アベニーダ・ボヤカ\n- E4–E5: アメリカス\n- E6: アメリカス / NQS\n- E7: アベニーダ・プリメロ・デ・マヨ\n- E8: プエンテ・アランダ\n- E9: フェロカリル\n- E10–E11: カジェ 1-3 / カラカス\n- E12: アベニーダ・ヒメネス\n- E13: カジェ 26\n- E14: カジェ 39\n- E15: カジェ 57\n- E16: カジェ 72 インターチェンジ\n\n🔗 接続路線: NQS, カジェ26, カジェ72`,
    calle72: `もちろんです！🏗️\n\n📍 **カジェ72 インターチェンジ (E16):**\n- 進捗率: **93%** ✅\n- タイプ: 複合結節駅（地下鉄＋トランスミレニオ）\n- TM駅の解体: 完了\n- 所在地: バリオス・ウニドス区\n\nプロジェクトの中で最も進んでいる駅の一つです！💪`,
    apertura: `📅 **公式スケジュール:**\n\n- 2023年: 資金調達完了\n- 2024年: 本格土木工事着工\n- 2026年: 走行試験（現在進行中！🎉）\n- 2027年: 乗客乗務試験\n- **2028年: 商業運行開始予定**\n\n77.53%の進捗率を達成し、目標は着実に近づいています！🌆❤️`,
    empleo: `素晴らしいご関心ですね！💼\n\n📋 **求人・採用情報:**\n- 180件の募集枠\n- 職種: 運行、保守メンテナンス、システム、駅務\n- 高卒から専門職まで幅広く募集\n\n🔗 **応募方法:**\n1. ボゴタ就職ポータル: bogota.gov.co\n2. 当アプリの「採用情報」セクション\n\nご応募をお待ちしています！🌐`,
    caracas: `😅 ご不便をおかけしております！\n\n🚧 **カラカス通りの通行止め区間:**\n- カジェ26: 杭打ち工事のため全面通行止め\n- カジェ39: 1車線に規制 (テウサキージョ)\n- カジェ57: カレラ13経由の迂回運行\n- カジェ72: 解体工事のため一部通行止め\n\n🛣️ **おすすめの迂回路:**\n- カレラ10\n- NQS (カレラ30)\n- カレラ7 / 13\n\n安全第一で進めています。ご協力をお願いいたします！🚗➡️🚇`,
    horario: `🕐 **運行計画時間:**\n\n- 🌅 始発: **午前5:30**\n- 🌙 終電: **午後23:00**\n- ⏱️ ラッシュ時運行間隔: **3分間隔** (毎時20本)\n- 🚀 ホームドア導入時: 最短 **90秒間隔**\n\n年中無休で運行されます。📅`,
    cbtc: `🤖 **CBTC GoA4 技術:**\n\n- 完全自動運転システム（乗務員なし）\n- 無線列車制御システム (CBTC)\n- 自動運転レベル4 (GoA4) —— 世界最高水準\n- 100%電気駆動・直接排出ゼロ\n- 回生ブレーキで電力を送電網に回収\n\n🌿 ラテンアメリカで最も先進的な地下鉄です。⚡`,
    capacidad: `👥 **輸送能力:**\n\n- 🚇 1編成あたり: **1,800名**\n- ⏱️ 1時間1方向あたり: **36,000〜72,000名**\n- 📊 1日推定利用者数: **800,000〜1,000,000名**\n- 🚆 車両数: 全30編成（各6〜7両）\n\nボゴタの交通を一変させる輸送力です！🏙️`,
    costo: `💰 **プロジェクト投資額:**\n\n- 総予算: **16兆2,700億コロンビアペソ (COP)**\n- 資金源: 国 + 首都区 + 国際開発金融機関\n- 出資機関: 米州開発銀行(IDB)、CAF、欧州投資銀行(EIB)、世界銀行\n\n📊 **内訳:**\n- 土木インフラ: 62%\n- 車両: 18%\n- システム・技術: 12%\n- 運営・社会環境: 8%\n\n国際金融機関の厳格な監督のもとで実施されています。🏦`,
    fallback: `ご質問内容を正確に把握できませんでした。工事進捗、駅情報、求人、道路規制についてご質問ください。`
  }
};

const callMetroAI = async (prompt, lang, t) => {
  return await getMetroBotResponse(prompt, lang, t);
};

const NOTIF_ITEMS = [
  {
    id: 1,
    type: 'alerta-vial',
    localidad: 'Teusaquillo',
    targetSection: 'estado',
    badge: '🚨 Alerta Vial',
    time: 'Hace 10 min',
    text: 'Cierre total en Av. Caracas entre Calle 26–39 por avance del viaducto.',
    extra: 'Use rutas alternas: Carrera 10 · NQS',
    colorClass: 'bg-[#B30000]',
    badgeBg: 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300',
    cardBg: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800/40'
  },
  {
    id: 2,
    type: 'alerta-vial',
    localidad: 'Caracas/Chapinero',
    targetSection: 'mapa',
    badge: '🚧 Alerta Vial',
    time: 'Hace 25 min',
    text: 'Demolición en Calle 72: acceso restringido en zona norte de la Caracas.',
    extra: '',
    colorClass: 'bg-[#E65100]',
    badgeBg: 'bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300',
    cardBg: 'bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800/40'
  },
  {
    id: 3,
    type: 'avance-obra',
    localidad: 'Caracas/Chapinero',
    targetSection: 'estado',
    badge: '📊 Avance de Obra',
    time: 'Hoy 9:00 AM',
    text: 'Hito alcanzado: Intercambiador Calle 72 supera el 93% de avance general.',
    extra: '',
    colorClass: 'bg-[#2D8B3C]',
    badgeBg: 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300',
    cardBg: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800/40'
  },
  {
    id: 4,
    type: 'oficial',
    localidad: 'Todas',
    targetSection: 'noticias',
    badge: '🏛️ Oficial EMB',
    time: 'Ayer',
    text: '180 nuevas vacantes habilitadas por el Distrito. ¡Postúlate ahora!',
    extra: '',
    colorClass: 'bg-[#1565C0]',
    badgeBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
    cardBg: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800/40'
  }
];

export default function App() {
  const { t, lang, setLang } = useI18n();
  const { userProfile, isAuthenticated, loading: authLoading, signOut: authSignOut } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const view = location.pathname;
  
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('urbango_user') || localStorage.getItem('urbanGoUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isGuest, setIsGuest] = useState(() => {
    return localStorage.getItem('urbango_is_guest') === 'true';
  });
  const [showEntranceAnim, setShowEntranceAnim] = useState(false);
  const [isLargeText, setIsLargeText] = useState(() => {
    return localStorage.getItem('urbango_large_text') === 'true';
  });
  const [isHighContrast, setIsHighContrast] = useState(() => {
    return localStorage.getItem('urbango_high_contrast') === 'true';
  });

  // Sync user profile and configuracion when auth resolves from Supabase profiles table
  useEffect(() => {
    if (!authLoading && isAuthenticated && userProfile) {
      setUser(userProfile);
      setIsGuest(false);
      localStorage.removeItem('urbango_is_guest');
      if (userProfile.configuracion?.large_text !== undefined) {
        setIsLargeText(Boolean(userProfile.configuracion.large_text));
      }
      if (userProfile.configuracion?.high_contrast !== undefined) {
        setIsHighContrast(Boolean(userProfile.configuracion.high_contrast));
      }
    }
  }, [authLoading, isAuthenticated, userProfile]);

  // Guest login handler
  const handleEnterGuest = () => {
    if (isAuthenticated) {
      navigate('/app');
      return;
    }
    const guestUser = {
      id: 'guest',
      name: 'Ciudadano Invitado',
      email: 'invitado@urbango.gov.co',
      avatar: '👤',
      localidad: 'Bogotá D.C.',
      transporte: 'Metro / SITP',
      isGuest: true,
      saldo: 24500,
      estaciones_favoritas: ['Portal Américas', 'Calle 72', 'Av. Primero de Mayo']
    };
    setUser(guestUser);
    setIsGuest(true);
    localStorage.setItem('urbango_is_guest', 'true');
    localStorage.setItem('urbanGoUser', JSON.stringify(guestUser));
    setShowEntranceAnim(true);
  };

  // Auth Guard: Keep the 3D Landing Page (/) public and accessible as the primary showcase.
  // Both authenticated users and guests have access to /app.
  useEffect(() => {
    if (authLoading) return;

    const hasAccess = isAuthenticated || isGuest;

    // If an unauthenticated user without guest access tries to enter /app directly, send them to /login
    if (!hasAccess && view.startsWith('/app')) {
      navigate('/login', { replace: true });
    }

    // If an authenticated user enters /login or /register, redirect to /app (unless entrance animation is running)
    if (isAuthenticated && (view === '/login' || view === '/register') && !showEntranceAnim) {
      navigate('/app', { replace: true });
    }
  }, [authLoading, isAuthenticated, isGuest, view, navigate, showEntranceAnim]);
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('urbanGoTheme') === 'dark';
      if (isDark) document.documentElement.classList.add('dark');
      return isDark;
    }
    return false;
  });

  // Tabs
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Global States
  const [savedItems, setSavedItems] = useState(() => {
    try {
      const active = JSON.parse(localStorage.getItem('urbango_user') || localStorage.getItem('urbanGoUser') || '{}');
      if (Array.isArray(active.saved_items) && active.saved_items.length > 0) {
        return active.saved_items;
      }
      const raw = localStorage.getItem('urbango_saved_items');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [detailItem, setDetailItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mapFocusStation, setMapFocusStation] = useState(null);
  const [chatInitialQuery, setChatInitialQuery] = useState('');
  const [isGlobalPortalModalOpen, setIsGlobalPortalModalOpen] = useState(false);
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [selectedNewsOrJob, setSelectedNewsOrJob] = useState({
    isOpen: false,
    initialTab: 'noticias',
    selectedItemId: null
  });
  const [isProjectStatusOpen, setIsProjectStatusOpen] = useState(false);
  const [isSaldoModalOpen, setIsSaldoModalOpen] = useState(false);

  // Premium Header States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [scrollToJob, setScrollToJob] = useState(false);
  const [notifLocalidad, setNotifLocalidad] = useState('Todas');
  const [readNotifs, setReadNotifs] = useState(new Set());
  const [notifList, setNotifList] = useState(NOTIF_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Rich Incident Report States
  const [incidentType, setIncidentType] = useState('cierre');
  const [incidentLocalidad, setIncidentLocalidad] = useState('Kennedy');
  const [incidentAddress, setIncidentAddress] = useState('');
  const [incidentSeverity, setIncidentSeverity] = useState('moderado');
  const [incidentDesc, setIncidentDesc] = useState('');
  const [incidentPhoto, setIncidentPhoto] = useState(null); // { url, name, size }
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [previewImageModal, setPreviewImageModal] = useState(null);
  const [isSubmittingIncident, setIsSubmittingIncident] = useState(false);
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      showToast('La imagen es demasiado pesada (máximo 15MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      setIncidentPhoto({
        url: event.target.result,
        name: file.name,
        size: formattedSize
      });
      showToast('📸 Foto adjuntada con éxito');
    };
    reader.onerror = () => {
      showToast('Error al procesar la imagen seleccionada.');
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (view === '/splash') {
      const t = setTimeout(() => navigate('/app'), 1100); // Optimized swift transition
      return () => clearTimeout(t);
    }
  }, [view, navigate]);

  const toggleDark = () => {
    const n = !dark; setDark(n);
    document.documentElement.classList.toggle('dark', n);
    localStorage.setItem('urbanGoTheme', n ? 'dark' : 'light');
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const shareLink = () => showToast(t('enlace_copiado'));

  const toggleSave = (item) => {
    if (!item) return;
    const key = item.title || item.name;
    const exists = savedItems.find(s => (s.title || s.name) === key);
    let updated;
    if (exists) {
      updated = savedItems.filter(s => (s.title || s.name) !== key);
      showToast(t('eliminado_guardados'));
    } else {
      updated = [{ ...item, saved_at: new Date().toISOString() }, ...savedItems];
      showToast(t('guardado'));
    }
    setSavedItems(updated);
    try {
      localStorage.setItem('urbango_saved_items', JSON.stringify(updated));
      const active = JSON.parse(localStorage.getItem('urbango_user') || localStorage.getItem('urbanGoUser') || '{}');
      if (active && typeof active === 'object') {
        const merged = { ...active, saved_items: updated };
        localStorage.setItem('urbango_user', JSON.stringify(merged));
        localStorage.setItem('urbanGoUser', JSON.stringify(merged));
      }
    } catch {
      // ignore
    }
  };

  // Search autocomplete index — agrega aquí nuevos ítems para ampliar el buscador
  const SEARCH_INDEX = [
    // Secciones principales
    { id: 'estado',          label: () => t('search_section_obras'),         icon: '🚧', tab: 'estado',        keywords: ['obra', 'avance', 'construccion', 'progreso', 'viaducto', 'pilotes'] },
    { id: 'noticias',        label: () => t('search_section_noticias'),       icon: '📰', tab: 'noticias',       keywords: ['noticias', 'novedades', 'hoy', 'última hora', 'noticia'] },
    { id: 'foro',            label: () => t('search_section_foro'),           icon: '💬', tab: 'foro',           keywords: ['foro', 'comunidad', 'opiniones', 'comentarios', 'chat'] },
    { id: 'transparencia',   label: () => t('search_section_transparencia'),  icon: '🛡️', tab: 'transparencia',  keywords: ['transparencia', 'presupuesto', 'auditoria', 'contratacion', 'licitacion', 'informe'] },
    { id: 'saldo',           label: () => t('search_section_saldo'),          icon: '💳', tab: 'saldo',          keywords: ['saldo', 'tarjeta', 'nfc', 'balance', 'recarga', 'pago'] },
    { id: 'mapa',            label: () => 'Mapa Interactivo',                 icon: '🗺️', tab: 'mapa',           keywords: ['mapa', 'ubicacion', 'estaciones', 'ruta', 'linea'] },
    // Empleo
    { id: 'empleo',          label: () => '180 Vacantes Metro de Bogotá',     icon: '👷', tab: 'noticias',       keywords: ['empleo', 'trabajo', 'vacante', 'cargo', 'aplicar', 'postular', 'jobs', 'contratar'] },
    { id: 'talento',         label: () => t('search_section_talento'),        icon: '💼', tab: 'noticias',       keywords: ['talento', 'portal empleo', 'oportunidad', 'cv', 'hoja de vida'] },
    // Estaciones clave
    { id: 'calle72',         label: () => 'Intercambiador Calle 72',          icon: '🏗️', tab: 'mapa',           keywords: ['calle 72', 'intercambiador', 'e16', 'barrios unidos', '72'] },
    { id: 'bosa',            label: () => 'Patio Taller Bosa',                icon: '🚇', tab: 'mapa',           keywords: ['bosa', 'patio', 'taller', 'e1', 'kennedy sur'] },
    { id: 'kennedy',         label: () => 'Estación Kennedy',                 icon: '📍', tab: 'mapa',           keywords: ['kennedy', 'americas', 'e5', 'e6'] },
    { id: 'jimenez',         label: () => 'Estación Av. Jiménez',             icon: '📍', tab: 'mapa',           keywords: ['jimenez', 'e12', 'centro', 'avenida jimenez'] },
    { id: 'calle26',         label: () => 'Estación Calle 26',                icon: '📍', tab: 'mapa',           keywords: ['calle 26', 'e13', 'el dorado', 'aeropuerto'] },
    { id: 'puente_aranda',   label: () => 'Estación Puente Aranda',           icon: '📍', tab: 'mapa',           keywords: ['puente aranda', 'e8', 'ferrocarril'] },
    // Cierres viales
    { id: 'caracas',         label: () => 'Av. Caracas – Cierres Activos',    icon: '⚠️', tab: 'estado',         keywords: ['caracas', 'cierre', 'vial', 'desvio', 'trafico', 'trancado'] },
    { id: 'calle39',         label: () => 'Cierre Calle 39 – Teusaquillo',    icon: '🚧', tab: 'estado',         keywords: ['calle 39', 'teusaquillo', 'cierre 39'] },
    { id: 'calle57',         label: () => 'Cierre Calle 57 – Chapinero',      icon: '🚧', tab: 'estado',         keywords: ['calle 57', 'chapinero', 'carrera 13'] },
    // Tren y tecnología
    { id: 'tren',            label: () => 'Tren N.° 2 – Pruebas en Viaducto', icon: '🚆', tab: 'estado',         keywords: ['tren', 'prueba', 'rodaje', 'crrc', 'vagon', 'automatico', 'cbtc', 'goa4'] },
    { id: 'apertura',        label: () => 'Apertura Comercial 2028',          icon: '📅', tab: 'noticias',       keywords: ['apertura', 'inauguracion', 'cuando', 'abre', '2028', 'fecha'] },
  ];

  const computeSearchResults = (q) => {
    if (!q || q.trim().length < 2) { setSearchResults([]); return; }
    const lower = q.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // quita tildes para mejor matching
    const results = SEARCH_INDEX.filter(item => {
      const labelNorm = item.label().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const idNorm = item.id.toLowerCase();
      const keywordMatch = (item.keywords || []).some(k =>
        k.normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(lower)
      );
      return labelNorm.includes(lower) || idNorm.includes(lower) || keywordMatch;
    }).slice(0, 7);
    setSearchResults(results);
  };


  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);

    // Find best match from SEARCH_INDEX using keywords
    const match = SEARCH_INDEX.find(item => {
      const labelNorm = item.label().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const idNorm = item.id.toLowerCase();
      const keywordMatch = (item.keywords || []).some(k =>
        q.includes(k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')) ||
        k.normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q)
      );
      return labelNorm.includes(q) || idNorm.includes(q) || keywordMatch;
    });

    if (match) {
      if (match.tab === 'noticias') {
        setSelectedNewsOrJob({
          isOpen: true,
          initialTab: (match.id === 'empleo' || match.id === 'talento') ? 'empleo' : 'noticias',
          selectedItemId: null
        });
      } else if (match.tab === 'estado') {
        setIsProjectStatusOpen(true);
      } else {
        setCurrentTab(match.tab);
      }
    } else {
      showToast(t('redirigiendo'));
      setSelectedNewsOrJob({
        isOpen: true,
        initialTab: 'noticias',
        selectedItemId: null
      });
    }
  };


  const navigateToResult = (result) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    if (result.tab === 'noticias') {
      setSelectedNewsOrJob({
        isOpen: true,
        initialTab: (result.id === 'talento' || result.id === 'empleo') ? 'empleo' : 'noticias',
        selectedItemId: null
      });
    } else if (result.tab === 'estado') {
      setIsProjectStatusOpen(true);
    } else {
      setCurrentTab(result.tab);
    }
  };

  const handleNotifClick = (item) => {
    setReadNotifs(prev => new Set([...prev, item.id]));
    setIsNotifOpen(false);
    if (item.targetSection === 'estado') {
      setIsProjectStatusOpen(true);
    } else if (item.targetSection === 'noticias') {
      setSelectedNewsOrJob({
        isOpen: true,
        initialTab: 'noticias',
        selectedItemId: null
      });
    } else if (item.targetSection) {
      setCurrentTab(item.targetSection);
    }
  };

  const handleSubmitIncident = (e) => {
    e.preventDefault();
    if (!incidentAddress.trim() && !incidentDesc.trim()) {
      showToast('Por favor ingresa la ubicación o descripción.');
      return;
    }

    setIsSubmittingIncident(true);
    setTimeout(() => {
      setIsSubmittingIncident(false);
      const radId = `${Math.floor(1000 + Math.random() * 9000)}`;
      const radicado = `INC-2026-${radId}`;
      const typeLabels = {
        cierre: '🚧 Cierre vial / Desvío no programado',
        hueco: '⚠️ Daño en calzada / Bache peligroso',
        accidente: '💥 Accidente / Choque vehicular',
        semaforo: '🚦 Falla de semáforos',
        obra: '🏗️ Obra sin señalización',
        inundacion: '🌧️ Encharcamiento / Inundación'
      };

      const newNotif = {
        id: Date.now(),
        type: 'alerta-vial',
        localidad: incidentLocalidad,
        targetSection: 'estado',
        badge: `REPORTE CIUDADANO #${radicado}`,
        badgeBg: 'bg-[#B30000] text-white',
        colorClass: 'bg-[#B30000]',
        cardBg: dark ? 'bg-red-950/30 border-red-800/60' : 'bg-red-50 border-red-200',
        text: `${typeLabels[incidentType] || 'Incidencia Vial'}: ${incidentAddress || incidentLocalidad}`,
        extra: incidentDesc ? (incidentDesc.length > 80 ? incidentDesc.substring(0, 80) + '...' : incidentDesc) : 'Alerta radicada en la red distrital de movilidad.',
        fullDesc: incidentDesc || '',
        address: incidentAddress || incidentLocalidad,
        severity: incidentSeverity,
        radicado: radicado,
        photo: incidentPhoto?.url || null,
        photoName: incidentPhoto?.name || null,
        photoSize: incidentPhoto?.size || null,
        time: 'Hace un momento'
      };

      // ── Mapear al modelo oficial de Estado de Obra (ProjectStatus) ──
      const categoryMap = {
        cierre: 'Cierres Viales',
        hueco: 'Paso Restringido',
        accidente: 'Desvíos de Tráfico',
        semaforo: 'Falla Semafórica',
        obra: 'Obras de Redes',
        inundacion: 'Paso Restringido'
      };
      const sevMap = {
        leve: 'Informativo',
        moderado: 'Moderado',
        grave: 'Crítico'
      };

      const finalLocation = incidentAddress.trim()
        ? `${incidentAddress.trim()} (${incidentLocalidad})`
        : `Corredor Metro · Localidad ${incidentLocalidad}`;

      const newIncidentObj = {
        id: `inc-${Date.now()}`,
        user_id: user?.id || 'citizen-global',
        author_name: userProfile?.name || user?.name || 'Ciudadano UrbanGo',
        location: finalLocation,
        category: categoryMap[incidentType] || 'Cierres Viales',
        status: 'En Verificación', // Badge institucional
        severity: sevMap[incidentSeverity] || 'Moderado',
        description: incidentDesc.trim() || `${typeLabels[incidentType] || 'Novedad vial'} reportada en ${finalLocation}.`,
        photo: incidentPhoto?.url || null,
        created_at: new Date().toISOString(),
        votes: 1
      };

      // 1. Guardar en el almacenamiento compartido de incidencias
      try {
        const rawCache = localStorage.getItem('urbango_incidents_cache');
        const list = rawCache ? JSON.parse(rawCache) : [];
        const updatedList = [newIncidentObj, ...list];
        localStorage.setItem('urbango_incidents_cache', JSON.stringify(updatedList));
      } catch (err) {
        console.warn('Error en storage de incidencias:', err);
      }

      // 2. Sincronizar en tiempo real con Supabase
      if (!isMocking && supabase) {
        supabase
          .from('incidents')
          .insert([{
            id: newIncidentObj.id,
            user_id: newIncidentObj.user_id,
            location: newIncidentObj.location,
            category: newIncidentObj.category,
            status: newIncidentObj.status,
            description: newIncidentObj.description,
            created_at: newIncidentObj.created_at,
            votes: newIncidentObj.votes
          }])
          .then(({ error }) => {
            if (error) console.warn('Supabase warning:', error);
          })
          .catch(err => console.warn('Supabase error:', err));
      }

      // 3. Despachar evento para reactividad inmediata en ProjectStatus (Estado de Obra)
      window.dispatchEvent(new CustomEvent('urbango:new-incident', { detail: newIncidentObj }));

      // 4. Actualizar notificaciones y cerrar modal
      setNotifList(prev => [newNotif, ...prev]);
      setIsReportModalOpen(false);
      setIncidentAddress('');
      setIncidentDesc('');
      setIncidentPhoto(null);

      // 5. Redireccionar directamente a Estado de Obra y confirmar al usuario
      setIsProjectStatusOpen(true);
      showToast(`¡Reporte #${radicado} publicado con éxito en Estado de Obra!`);
    }, 1100);
  };

  // ── Theme-aware CSS variables injected via style tag ──
  const themeVars = dark
    ? `
      :root {
        --bg-page:      #09090b;
        --bg-card:      #18181b;
        --bg-card2:     #1c1c1f;
        --bg-input:     #27272a;
        --border-color: #3f3f46;
        --text-primary: #f4f4f5;
        --text-secondary:#a1a1aa;
        --text-muted:   #71717a;
        --nav-bg:       rgba(24,24,27,0.97);
        --header-bg:    rgba(9,9,11,0.92);
      }
    `
    : `
      :root {
        --bg-page:      #f4f4f5;
        --bg-card:      #ffffff;
        --bg-card2:     #f9f9fb;
        --bg-input:     #f1f1f3;
        --border-color: #e4e4e7;
        --text-primary: #18181b;
        --text-secondary:#52525b;
        --text-muted:   #a1a1aa;
        --nav-bg:       rgba(255,255,255,0.97);
        --header-bg:    rgba(255,255,255,0.92);
      }
    `;

  return (
    <div className={`flex flex-col min-h-screen w-full transition-colors duration-300 ${view === '/' ? 'bg-black text-white' : isHighContrast ? 'bg-black text-white' : dark ? 'bg-zinc-950' : 'bg-zinc-50'}`}
      style={{ background: view === '/' || isHighContrast ? '#000000' : dark ? '#09090b' : '#f4f4f5' }}>
      <style>{GLOBAL_CSS}</style>
      <style>{themeVars}</style>
      {isLargeText && (
        <style>{`
          html, body, #root {
            font-size: 115% !important;
          }
        `}</style>
      )}
      {isHighContrast && (
        <style>{`
          body, #root, .high-contrast-root {
            background-color: #000000 !important;
            color: #FFFFFF !important;
          }
          .high-contrast-root div,
          .high-contrast-root section,
          .high-contrast-root main,
          .high-contrast-root header,
          .high-contrast-root footer,
          .high-contrast-root aside,
          .high-contrast-root nav,
          .high-contrast-root ul,
          .high-contrast-root li {
            border-color: #FFD600 !important;
          }
          .high-contrast-root h1,
          .high-contrast-root h2,
          .high-contrast-root h3,
          .high-contrast-root h4,
          .high-contrast-root h5,
          .high-contrast-root h6,
          .high-contrast-root .font-black {
            color: #FFD600 !important;
          }
          .high-contrast-root p,
          .high-contrast-root span,
          .high-contrast-root label {
            color: #FFFFFF !important;
          }
          .high-contrast-root button {
            border-color: #FFD600 !important;
          }
          .high-contrast-root a {
            color: #FFD600 !important;
          }
          .high-contrast-root input,
          .high-contrast-root select,
          .high-contrast-root textarea {
            background-color: #000000 !important;
            color: #FFFFFF !important;
            border-color: #FFD600 !important;
          }
        `}</style>
      )}
      <div className={`relative w-full transition-colors duration-500 flex flex-col ${view === '/' ? '' : 'h-screen overflow-hidden'} ${isHighContrast ? 'high-contrast-root bg-black text-white' : dark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>

        {/* Metro de Bogotá Entrance Animation (3.5s crossing train immediately after successful login) */}
        {showEntranceAnim && (
          <MetroEntranceAnimation
            userName={user?.name || userProfile?.name || 'Ciudadano'}
            onComplete={() => {
              setShowEntranceAnim(false);
              navigate('/app');
            }}
          />
        )}

        {/* Auth loading screen — prevents black screen while session is being verified */}
        {authLoading && (
          <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black">
            <div className="flex flex-col items-center gap-4">
              <span className="text-3xl font-black tracking-tight text-white">Urban<span className="text-[#C8102E]">Go</span></span>
              <div className="w-8 h-8 border-4 border-zinc-700 border-t-[#C8102E] rounded-full animate-spin" />
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Cargando…</p>
            </div>
          </div>
        )}

        {!authLoading && view === '/splash' && <SplashScreen onSkip={() => navigate('/app')} />}
        {!authLoading && view === '/' && (
          <Landing3D
            onEnter={handleEnterGuest}
            onLogin={() => navigate('/login')}
            onRegister={() => navigate('/register')}
          />
        )}
        {!authLoading && view === '/login' && (
          <AuthScreen
            type="login"
            onBack={() => navigate('/')}
            onGuest={handleEnterGuest}
            onSuccess={u => {
              setUser(u);
              setIsGuest(false);
              localStorage.removeItem('urbango_is_guest');
              setShowEntranceAnim(true);
            }}
            dark={dark}
          />
        )}
        {!authLoading && view === '/register' && (
          <AuthScreen
            type="register"
            onBack={() => navigate('/')}
            onGuest={handleEnterGuest}
            onSuccess={u => {
              setUser(u);
              setIsGuest(false);
              localStorage.removeItem('urbango_is_guest');
              setShowEntranceAnim(true);
            }}
            dark={dark}
          />
        )}

        {view.startsWith('/app') && (
          <div className="flex-1 flex flex-col h-full animate-fade-in-smooth">
            {/* TOAST */}
            {toast && (
              <div className={`absolute top-24 left-1/2 -translate-x-1/2 z-[150] px-6 py-3 rounded-full text-[10px] font-black tracking-widest shadow-2xl whitespace-nowrap uppercase ${dark ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-white'}`}>
                {toast}
              </div>
            )}

            {/* HEADER PREMIUM GLOBAL */}
            <div className={`absolute top-0 left-0 right-0 z-[100] backdrop-blur-xl border-b flex justify-center shadow-sm transition-colors duration-300 ${dark ? 'bg-zinc-950/92 border-zinc-800' : 'bg-white/92 border-zinc-200'}`}>
              <div className="w-full max-w-full overflow-visible px-3 sm:px-6 pt-3 sm:pt-4 pb-3 flex justify-between items-center">
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {currentTab !== 'dashboard' ? (
                    <button 
                      onClick={() => {
                        setCurrentTab('dashboard');
                        setIsNotifOpen(false);
                        setIsSearchOpen(false);
                      }}
                      title={t('dash_volver')}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg shadow-md transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer hover:shadow-lg focus:outline-none relative overflow-hidden group ${dark ? 'bg-zinc-800 text-zinc-300 hover:text-white' : 'bg-zinc-100 text-zinc-700 hover:text-zinc-900'}`}
                    >
                      <ArrowLeft size={18} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setCurrentTab('perfil');
                        setIsNotifOpen(false);
                        setIsSearchOpen(false);
                      }}
                      title={t('dash_perfil')}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-[2px] border-[#B30000] flex items-center justify-center text-base sm:text-lg shadow-md transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer hover:shadow-lg focus:outline-none relative overflow-hidden group ${dark ? 'bg-zinc-800' : 'bg-zinc-100'}`}
                    >
                      <div className="absolute inset-0 bg-black/10 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10">
                        <RenderUserAvatar avatar={user?.avatar} size={28} />
                      </div>
                    </button>
                  )}
                  <div>
                    <h1 className={`text-lg sm:text-xl font-black italic tracking-tighter leading-none ${dark ? 'text-white' : 'text-zinc-900'}`}>Urban<span className="text-[#B30000]">-go</span></h1>
                    <p className={`font-bold mt-0.5 uppercase tracking-widest text-[8px] truncate max-w-[120px] sm:max-w-none ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>{
  t('dash_hola').replace('{name}', user?.name || 'Ciudadano')
}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 relative shrink-0">
                  {/* ── MICRO-INDICADOR OPERACIONAL ── */}
                  <div className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest mr-1 ${
                    dark ? 'bg-zinc-900 border-zinc-700 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-500'
                  }`}>
                    <span className="w-1.5 h-1.5 bg-[#2D8B3C] rounded-full animate-pulse flex-shrink-0" />
                    <span>{t('dash_apertura')} <strong className={dark ? 'text-white' : 'text-zinc-900'}>2028</strong></span>
                    <span className={`mx-1 ${dark ? 'text-zinc-700' : 'text-zinc-300'}`}>·</span>
                    <span>{t('dash_avance')} <strong className="text-[#B30000]">77.53%</strong></span>
                  </div>
                  <LanguageSelector variant="capsule" direction="down" dark={dark} />
                  <AccessibilityMenu
                    isLargeText={isLargeText}
                    setIsLargeText={setIsLargeText}
                    isHighContrast={isHighContrast}
                    setIsHighContrast={setIsHighContrast}
                    dark={dark}
                  />
                  <button onClick={() => setIsSearchOpen(true)} className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all shadow-sm ${dark ? 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200'}`}><Search size={17} /></button>
                  <button onClick={() => setIsNotifOpen(!isNotifOpen)} className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all shadow-sm relative ${dark ? 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200'}`}>
                    <Bell size={17} />
                    {notifList.filter(n => !readNotifs.has(n.id)).length > 0 && (
                      <span className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#B30000] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 animate-pulse badge-glow ${dark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                        {notifList.filter(n => !readNotifs.has(n.id)).length}
                      </span>
                    )}
                  </button>
                  <button onClick={() => setIsSettingsOpen(true)} className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all shadow-sm ${dark ? 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200'}`}><Settings size={17} /></button>

                  {/* ── CENTRO DE ALERTAS DE MOVILIDAD (Popover centrado y adaptable) ── */}
                  {isNotifOpen && (
                    <div className={`fixed sm:absolute top-16 sm:top-14 inset-x-0 sm:inset-x-auto sm:right-0 w-[92vw] sm:w-96 max-w-md mx-auto sm:mx-0 rounded-3xl shadow-2xl border z-[350] popup-in overflow-hidden ${dark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200'}`}>
                      {/* Cabecera del panel */}
                      <div className={`px-4 sm:px-5 py-3.5 border-b flex flex-col gap-2 ${dark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-zinc-50/90 border-zinc-100'}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={`font-black text-sm tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>{t('centro_alertas')}</h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#B30000]"></span>
                              </span>
                              <span className={`text-[9px] font-black uppercase tracking-widest ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>{t('en_tiempo_real')}</span>
                            </div>
                          </div>
                          <button onClick={() => setIsNotifOpen(false)} className={`w-7 h-7 flex items-center justify-center rounded-full transition-all ${dark ? 'text-zinc-500 hover:text-white hover:bg-zinc-800' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'}`}><X size={15} /></button>
                        </div>

                        {/* Filtros de localidad rápidos */}
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {[t('todas'), 'Bosa/Kennedy', 'Caracas/Chapinero', 'Teusaquillo'].map(loc => (
                            <button
                              key={loc}
                              onClick={() => setNotifLocalidad(loc)}
                              className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all border ${
                                notifLocalidad === loc
                                  ? 'bg-[#B30000] text-white border-[#B30000] shadow-sm'
                                  : dark
                                    ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
                                    : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900'
                              }`}
                            >
                              {loc}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Notificaciones categorizadas filtradas */}
                      <div className="p-3 space-y-2.5 max-h-[60vh] sm:max-h-80 overflow-y-auto no-scroll">
                        {notifList.filter(n => notifLocalidad === t('todas') || n.localidad === 'Todas' || n.localidad === notifLocalidad).length === 0 ? (
                          <div className={`p-8 text-center text-xs font-bold ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            {t('no_alertas')}
                          </div>
                        ) : (
                          notifList.filter(n => notifLocalidad === t('todas') || n.localidad === 'Todas' || n.localidad === notifLocalidad).map(item => {
                            const isRead = readNotifs.has(item.id);
                            return (
                              <button
                                key={item.id}
                                onClick={() => handleNotifClick(item)}
                                className={`w-full text-left p-3 rounded-2xl border flex gap-3 items-start transition-all active:scale-[0.98] ${item.cardBg} ${isRead ? 'opacity-60' : ''}`}
                              >
                                <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${item.colorClass} shadow-md relative`}>
                                  <AlertTriangle size={14} className="text-white" />
                                  {!isRead && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full border-2 border-[#B30000]" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5 justify-between">
                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md badge-glow ${item.badgeBg}`}>
                                      {item.badge}
                                    </span>
                                    <span className={`text-[8px] font-bold ${dark ? 'text-zinc-600' : 'text-zinc-450'}`}>{item.time}</span>
                                  </div>
                                  <p className={`text-xs font-bold leading-snug ${dark ? 'text-zinc-200' : 'text-zinc-800'}`}>{item.text}</p>
                                  {item.extra && (
                                    <p className={`text-[10px] font-medium mt-0.5 ${dark ? 'text-zinc-500' : 'text-zinc-500'}`}>{item.extra}</p>
                                  )}
                                  {item.photo && (
                                    <div 
                                      className="mt-2 relative rounded-xl overflow-hidden border border-zinc-500/20 max-h-28 bg-black/20 group cursor-pointer"
                                      onClick={(e) => { e.stopPropagation(); setPreviewImageModal(item.photo); }}
                                    >
                                      <img 
                                        src={item.photo} 
                                        alt="Evidencia fotográfica" 
                                        className="w-full h-24 object-cover group-hover:scale-105 transition-transform" 
                                      />
                                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="bg-black/80 text-white text-[9px] font-bold px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                                          🔍 Ampliar foto
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  {item.targetSection && !isRead && (
                                    <p className="text-[9px] font-black uppercase tracking-widest mt-1 text-[#B30000]">
                                      Toca para ver →
                                    </p>
                                  )}
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>

                      {/* Footer del panel con botón de Reporte Rápido */}
                      <div className={`px-4 py-3 border-t flex items-center justify-between gap-2 ${dark ? 'border-zinc-800 bg-zinc-950/80' : 'border-zinc-100 bg-zinc-50/90'}`}>
                        <button 
                          onClick={() => { setIsReportModalOpen(true); setIsNotifOpen(false); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 text-[#B30000] border border-red-500/30 text-[9px] font-black uppercase tracking-wider hover:bg-[#B30000] hover:text-white transition-all active:scale-95"
                        >
                          <AlertTriangle size={12} />
                          <span>Reportar Incidencia</span>
                        </button>
                        <button onClick={() => { setIsNotifOpen(false); setCurrentTab('estado'); }} className="text-[9px] font-black uppercase tracking-widest text-[#B30000] hover:underline">{t('ver_todo')}</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Buscador */}
            {isSearchOpen && (
              <div className="fixed inset-0 z-[300] bg-zinc-950/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-3 pb-24 sm:pb-6">
                <div className={`w-full max-w-lg rounded-[2rem] p-4 sm:p-5 shadow-2xl border popup-in ${dark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200'}`}>
                  <div className="flex justify-between items-center mb-4 px-1 sm:px-2">
                    <h3 className={`font-black text-lg sm:text-xl italic ${dark ? 'text-white' : 'text-zinc-900'}`}>{t('buscador_title')}</h3>
                    <button onClick={() => setIsSearchOpen(false)} className={dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}><X size={22} /></button>
                  </div>
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <input autoFocus value={searchQuery} onChange={e => { setSearchQuery(e.target.value); computeSearchResults(e.target.value); }} placeholder={t('buscar_ph_dinamico')}
                      className={`flex-1 border rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm font-bold focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/20 transition-all shadow-inner placeholder-zinc-400 ${dark ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-zinc-100 text-zinc-900 border-zinc-300'}`} />
                    <button type="submit" className="bg-[#B30000] text-white p-3 sm:p-4 rounded-2xl active:scale-95 transition-transform shadow-md flex items-center justify-center flex-shrink-0"><Search size={20} /></button>
                  </form>
                  {/* Autocomplete dropdown */}
                  {searchResults.length > 0 && (
                    <div className={`mt-2 rounded-2xl border overflow-hidden shadow-lg popup-in max-h-60 overflow-y-auto ${dark ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'}`}>
                      {searchResults.map((result, idx) => (
                        <button
                          key={result.id}
                          onClick={() => navigateToResult(result)}
                          className={`w-full flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-left transition-colors ${idx > 0 ? (dark ? 'border-t border-zinc-700' : 'border-t border-zinc-100') : ''} ${dark ? 'hover:bg-zinc-700 text-zinc-200' : 'hover:bg-zinc-50 text-zinc-800'}`}
                        >
                          <span className="text-base sm:text-lg flex-shrink-0">{result.icon}</span>
                          <span className="flex-1 truncate">{result.label()}</span>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${dark ? 'bg-zinc-700 text-zinc-400' : 'bg-zinc-100 text-zinc-500'}`}>→</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Contextual Route Assistance */}
                  {(searchQuery.toLowerCase().includes('calle 72') || searchQuery.toLowerCase().includes('caracas')) && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 animate-in fade-in zoom-in duration-300">
                      <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={15} />
                      <p className="text-xs text-zinc-300 leading-snug break-words">
                        <strong className="text-amber-500">⚠️ Alerta de Movilidad:</strong> Tramo con cierre total. Utilizar desvío por Carrera 24 o NQS.
                      </p>
                    </div>
                  )}
                  <div className="mt-3 sm:mt-4 px-1 sm:px-2 flex flex-wrap gap-1.5 sm:gap-2">
                    <button onClick={() => setSearchQuery('Empleo')} className={`text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-3 py-1.5 rounded-lg border transition-colors ${dark ? 'text-zinc-300 bg-zinc-800 border-zinc-700 hover:bg-zinc-700' : 'text-zinc-700 bg-zinc-100 border-zinc-200 hover:bg-zinc-200'}`}>{t('btn_empleo')}</button>
                    <button onClick={() => setSearchQuery('Calle 72')} className={`text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-3 py-1.5 rounded-lg border transition-colors ${dark ? 'text-zinc-300 bg-zinc-800 border-zinc-700 hover:bg-zinc-700' : 'text-zinc-700 bg-zinc-100 border-zinc-200 hover:bg-zinc-200'}`}>{t('btn_calle72')}</button>
                    <button onClick={() => setSearchQuery('Foro')} className={`text-[10px] font-black uppercase tracking-widest px-2.5 sm:px-3 py-1.5 rounded-lg border transition-colors ${dark ? 'text-zinc-300 bg-zinc-800 border-zinc-700 hover:bg-zinc-700' : 'text-zinc-700 bg-zinc-100 border-zinc-200 hover:bg-zinc-200'}`}>{t('btn_foro')}</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── MODAL REPORTE DE INCIDENCIA VIAL (Completo & Responsive) ── */}
            {isReportModalOpen && (
              <div className="fixed inset-0 z-[300] bg-zinc-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-4 pb-24 sm:pb-6">
                <div className={`w-full max-w-lg rounded-[2rem] p-5 sm:p-6 shadow-2xl border popup-in max-h-[85vh] overflow-y-auto mb-2 ${dark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className={`text-[9px] font-black uppercase tracking-widest ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{t('incidentModal.networkSubtitle', 'Red Distrital de Movilidad')}</span>
                      </div>
                      <h3 className={`font-black text-lg sm:text-xl italic flex items-center gap-2 ${dark ? 'text-white' : 'text-zinc-900'}`}>
                        <AlertTriangle className="text-[#B30000] flex-shrink-0" size={20} /> 
                        <span>{t('incidentModal.title', 'Reportar Incidencia Vial')}</span>
                      </h3>
                    </div>
                    <button onClick={() => setIsReportModalOpen(false)} className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${dark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}`}><X size={20} /></button>
                  </div>

                  <form onSubmit={handleSubmitIncident} className="space-y-4">
                    {/* Tipo de Incidencia */}
                    <div>
                      <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {t('incidentModal.step1', '1. Tipo de Incidencia o Suceso')}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { id: 'cierre', label: t('incidentModal.typeRoadClosure', 'Cierre Vial / Desvío'), icon: '🚧' },
                          { id: 'hueco', label: t('incidentModal.typePothole', 'Bache o Calzada'), icon: '⚠️' },
                          { id: 'accidente', label: t('incidentModal.typeAccident', 'Accidente / Choque'), icon: '💥' },
                          { id: 'semaforo', label: t('incidentModal.typeTrafficLight', 'Semáforo Apagado'), icon: '🚦' },
                          { id: 'obra', label: t('incidentModal.typeConstruction', 'Obra / Señalización'), icon: '🏗️' },
                          { id: 'inundacion', label: t('incidentModal.typeFlooding', 'Encharcamiento'), icon: '🌧️' },
                        ].map(item => (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => setIncidentType(item.id)}
                            className={`p-2.5 rounded-2xl border text-left flex items-center gap-2 transition-all active:scale-95 ${
                              incidentType === item.id
                                ? 'bg-[#B30000] text-white border-[#B30000] shadow-md'
                                : dark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                            }`}
                          >
                            <span className="text-base">{item.icon}</span>
                            <span className="text-[10px] font-black leading-tight">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Localidad y Ubicación Exacta */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-[10px] font-black uppercase tracking-widest mb-1 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                          {t('incidentModal.step2', '2. Localidad')}
                        </label>
                        <select
                          value={incidentLocalidad}
                          onChange={e => setIncidentLocalidad(e.target.value)}
                          className={`w-full border rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#B30000] ${dark ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-zinc-100 text-zinc-900 border-zinc-300'}`}
                        >
                          {['Bosa', 'Kennedy', 'Puente Aranda', 'Los Mártires', 'Santa Fe', 'Antonio Nariño', 'Teusaquillo', 'Chapinero', 'Barrios Unidos', 'Suba', 'Engativá', 'Fontibón', 'Usaquén'].map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={`block text-[10px] font-black uppercase tracking-widest mb-1 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                          {t('incidentModal.step3', '3. Nivel de Afectación')}
                        </label>
                        <select
                          value={incidentSeverity}
                          onChange={e => setIncidentSeverity(e.target.value)}
                          className={`w-full border rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#B30000] ${dark ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-zinc-100 text-zinc-900 border-zinc-300'}`}
                        >
                          <option value="leve">{t('incidentModal.severityMild', '🟡 Leve (Paso lento)')}</option>
                          <option value="moderado">{t('incidentModal.severityModerate', '🟠 Moderado (1 carril bloqueado)')}</option>
                          <option value="grave">{t('incidentModal.severitySevere', '🔴 Grave (Bloqueo total)')}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-[10px] font-black uppercase tracking-widest mb-1 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {t('incidentModal.step4', '4. Dirección / Punto de Referencia')}
                      </label>
                      <input
                        type="text"
                        value={incidentAddress}
                        onChange={e => setIncidentAddress(e.target.value)}
                        placeholder={t('incidentModal.addressPlaceholder', 'Ej. Av. Caracas con Calle 45 / Av. Villavicencio')}
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-[#B30000] ${dark ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-zinc-100 text-zinc-900 border-zinc-300'}`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[10px] font-black uppercase tracking-widest mb-1 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {t('incidentModal.step5', '5. Detalle de la Novedad')}
                      </label>
                      <textarea
                        rows={3}
                        value={incidentDesc}
                        onChange={e => setIncidentDesc(e.target.value)}
                        placeholder={t('incidentModal.detailPlaceholder', 'Describe qué sucedió, afectación de carriles o rutas de desvío sugeridas...')}
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-[#B30000] resize-none ${dark ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-zinc-100 text-zinc-900 border-zinc-300'}`}
                      />
                    </div>

                    {/* Adjuntar Foto Real con Drag & Drop y Cámara */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className={`block text-[10px] font-black uppercase tracking-widest ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                          {t('incidentModal.step6', '6. Evidencia Fotográfica Real (Opcional)')}
                        </label>
                        {incidentPhoto && (
                          <span className="text-[9px] font-bold text-emerald-500">
                            {incidentPhoto.size}
                          </span>
                        )}
                      </div>

                      {/* Hidden Real File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handlePhotoUpload(e.target.files[0]);
                          }
                        }}
                      />

                      {incidentPhoto ? (
                        <div className={`p-3 rounded-2xl border flex items-center gap-3 ${dark ? 'bg-zinc-800/90 border-zinc-700' : 'bg-zinc-100 border-zinc-300'}`}>
                          <img
                            src={incidentPhoto.url}
                            alt="Vista previa evidencia"
                            onClick={() => setPreviewImageModal(incidentPhoto.url)}
                            className="w-14 h-14 object-cover rounded-xl border border-zinc-500/30 cursor-pointer shadow-sm hover:scale-105 transition-transform flex-shrink-0"
                            title="Toca para ampliar imagen"
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-black truncate ${dark ? 'text-white' : 'text-zinc-900'}`}>
                              {incidentPhoto.name}
                            </p>
                            <p className="text-[10px] font-bold text-emerald-500">
                              {t('incidentModal.evidenceReady', 'Evidencia lista para radicar')}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                type="button"
                                onClick={() => setPreviewImageModal(incidentPhoto.url)}
                                className="text-[9px] font-black uppercase tracking-wider text-blue-500 hover:underline"
                              >
                                {t('incidentModal.viewFull', 'Ver Completa')}
                              </button>
                              <span className="text-zinc-500 text-[9px]">·</span>
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-[9px] font-black uppercase tracking-wider text-amber-500 hover:underline"
                              >
                                {t('incidentModal.changePhoto', 'Cambiar')}
                              </button>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIncidentPhoto(null)}
                            className="w-7 h-7 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center font-bold text-xs transition-colors flex-shrink-0"
                            title="Eliminar foto"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div
                          onDragOver={(e) => { e.preventDefault(); setIsDraggingPhoto(true); }}
                          onDragLeave={() => setIsDraggingPhoto(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDraggingPhoto(false);
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              handlePhotoUpload(e.dataTransfer.files[0]);
                            }
                          }}
                          onClick={() => fileInputRef.current?.click()}
                          className={`w-full py-4 px-3 rounded-2xl border-2 border-dashed cursor-pointer text-center transition-all ${
                            isDraggingPhoto 
                              ? 'border-[#B30000] bg-red-500/10 scale-[1.01]' 
                              : dark 
                                ? 'border-zinc-700 bg-zinc-800/40 hover:bg-zinc-800 hover:border-zinc-500 text-zinc-300' 
                                : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-400 text-zinc-700'
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                            <span className="text-2xl">📸</span>
                            <span className="text-xs font-black">
                              {t('incidentModal.tapAttach', 'Toca para adjuntar foto real o cámara')}
                            </span>
                            <span className={`text-[10px] font-medium ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                              {t('incidentModal.dragDrop', 'O arrastra y suelta tu imagen aquí (JPG, PNG hasta 15MB)')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingIncident}
                      className="w-full bg-gradient-to-r from-[#B30000] to-[#8E0000] text-white py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95 transition-transform shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmittingIncident ? (
                        <span>{t('incidentModal.submitting', 'Radicando Reporte...')}</span>
                      ) : (
                        <span>{t('incidentModal.submitBtn', '🚀 Radicar Reporte Ciudadano')}</span>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Modal Lightbox Visor de Foto Real en Alta Resolución */}
            {previewImageModal && (
              <div 
                className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
                onClick={() => setPreviewImageModal(null)}
              >
                <div 
                  className="relative max-w-2xl w-full max-h-[85vh] flex flex-col items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setPreviewImageModal(null)}
                    className="absolute -top-10 right-0 text-white hover:text-red-400 text-sm font-black flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full border border-white/20 transition-colors"
                  >
                    <span>Cerrar</span>
                    <X size={16} />
                  </button>
                  <img
                    src={previewImageModal}
                    alt="Evidencia fotográfica ampliada"
                    className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-white/20 shadow-2xl"
                  />
                  <div className="mt-3 text-center">
                    <span className="text-white text-xs font-bold bg-zinc-900/80 px-3 py-1 rounded-full border border-zinc-700 inline-block">
                      📸 Evidencia fotográfica ciudadana verificada
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ── DESKTOP + MOBILE RESPONSIVE LAYOUT ── */}
            <div className="flex flex-1 overflow-hidden" style={{ paddingTop: '76px' }}>

              {/* ── SIDEBAR — visible solo en computador (md+) ── */}
              <aside className={`hidden md:flex flex-col w-64 flex-shrink-0 border-r h-full overflow-y-auto transition-colors duration-300 ${dark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                {/* Mini perfil en sidebar */}
                <div className={`px-5 py-4 border-b ${dark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full border-[2.5px] border-[#B30000] flex items-center justify-center flex-shrink-0 overflow-hidden ${dark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                      <RenderUserAvatar avatar={user?.avatar} size={34} />
                    </div>
                    <div className="min-w-0">
                      <p className={`font-black text-sm leading-tight truncate ${dark ? 'text-white' : 'text-zinc-900'}`}>{user?.name || 'Ciudadano'}</p>
                      <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${dark ? 'text-zinc-500' : 'text-zinc-500'}`}>Metro de Bogotá · L1</p>
                    </div>
                  </div>
                </div>

                {/* Items de navegación en sidebar */}
                <nav className="flex-1 p-3 space-y-1">
                  <p className={`text-[9px] font-black uppercase tracking-widest px-3 pb-2 pt-1 ${dark ? 'text-zinc-600' : 'text-zinc-400'}`}>{t('sidebar_navegacion')}</p>
                  {[
                    { tab: 'dashboard', icon: <Train size={18} />,        label: t('sidebar_inicio') },
                    { tab: 'mapa',      icon: <MapIcon size={18} />,       label: t('sidebar_mapa') },
                    /* { tab: 'noticias',  icon: <Newspaper size={18} />,     label: t('sidebar_noticias') }, -- Requerimiento: Oculto del navbar/sidebar principal */
                    /* { tab: 'estado',    icon: <Construction size={18} />,  label: t('sidebar_estado') }, -- Requerimiento: Oculto del navbar/sidebar principal al igual que noticias */
                    { tab: 'foro',      icon: <MessageSquare size={18} />, label: t('sidebar_foro') },
                    { tab: 'saldo',     icon: <CreditCard size={18} />,    label: t('saldo_title') },
                    { tab: 'perfil',    icon: <User size={18} />,          label: t('sidebar_perfil') },
                  ].map(({ tab, icon, label }) => (
                    <button
                      key={tab}
                      onClick={() => { setCurrentTab(tab); setIsNotifOpen(false); setIsSearchOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                        currentTab === tab
                          ? 'bg-red-600 text-white shadow-lg shadow-red-900/20'
                          : dark
                            ? 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                            : 'text-zinc-900 font-semibold hover:bg-zinc-100'
                      }`}
                    >
                      {icon}
                      <span className="truncate">{label}</span>
                    </button>
                  ))}
                </nav>

                {/* Toggle modo claro/oscuro en sidebar */}
                <div className={`p-3 border-t ${dark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                  <button
                    onClick={toggleDark}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      dark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {dark ? <Sun size={18} color="#FFD600" /> : <Moon size={18} color="#B30000" />}
                      <span>{dark ? t('sidebar_modo_claro') : t('sidebar_modo_oscuro')}</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition-all shadow-inner border ${dark ? 'bg-[#B30000] border-[#B30000]' : 'bg-zinc-200 border-zinc-300'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${dark ? 'left-5' : 'left-0.5'}`} />
                    </div>
                  </button>
                </div>

                <div className={`px-3 py-2 border-t ${dark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                  <LanguageSelector variant="sidebar" direction="up" dark={dark} />
                </div>
                {/* ── SELLO INSTITUCIONAL (sidebar footer) ── */}
                <div className={`px-4 pb-4 pt-2 border-t ${dark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                  <button onClick={() => setIsReportModalOpen(true)} className="w-full mb-3 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#B30000] to-[#8E0000] text-white text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
                    <AlertTriangle size={14} /> {t("btn_report_incident", "REPORTAR INCIDENCIA VIAL")}
                  </button>
                  <div className={`rounded-2xl p-3 text-center ${dark ? 'bg-zinc-900/80' : 'bg-zinc-50'}`}>
                    <p className={`text-[9px] font-black uppercase tracking-widest leading-tight mb-2 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {t('sidebar_proto')}<br />
                      {t('sidebar_alcaldia')}
                    </p>
                    <div className="flex justify-center gap-4">
                      <a href="https://bogota.gov.co/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 hover:opacity-75 transition-opacity">
                        <span className="text-base">🏛️</span>
                      </a>
                      <a href="https://www.metrodebogota.gov.co/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 hover:opacity-75 transition-opacity">
                        <span className="text-base">🚇</span>
                      </a>
                    </div>
                    <p className={`text-[7px] font-bold mt-2 ${dark ? 'text-zinc-700' : 'text-zinc-300'}`}>{t('sidebar_copyright')}</p>
                  </div>
                </div>
              </aside>

              {/* ── CONTENIDO PRINCIPAL ── */}
              <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
                {/* Contenido Dinámico (Pestañas) */}
                <main className="flex-1 overflow-y-auto no-scroll pb-20 md:pb-8 px-4 md:px-8 relative z-0 flex flex-col items-center pb-safe">
                  <div className="w-full max-w-5xl h-full flex flex-col pt-4">
                    {currentTab === 'dashboard' && <DashboardTab dark={dark} onNavigate={(tab, payload) => {
                      if (tab === 'empleo') {
                        setSelectedNewsOrJob({ isOpen: true, initialTab: 'empleo', selectedItemId: null });
                      } else if (tab === 'noticias') {
                        setSelectedNewsOrJob({ isOpen: true, initialTab: 'noticias', selectedItemId: null });
                      } else if (tab === 'estado') {
                        setIsProjectStatusOpen(true);
                      } else if (tab === 'saldo') {
                        setCurrentTab('saldo');
                      } else if (tab === 'saldo_modal') {
                        setIsSaldoModalOpen(true);
                      } else {
                        setCurrentTab(tab);
                      }
                      if (payload === 'scrollToJob') setScrollToJob(true);
                    }} setIsChatOpen={setIsChatOpen} />}
                    {currentTab === 'mapa'     && (
                      <InteractiveMap 
                        stations={STATIONS} 
                        onShowDetail={setDetailItem} 
                        dark={dark} 
                        t={t} 
                        focusStationId={mapFocusStation}
                        onAskMetroBot={(query) => {
                          setChatInitialQuery(query);
                          setIsChatOpen(true);
                        }}
                      />
                    )}
                    {currentTab === 'noticias' && <NoticiasTab dark={dark} saved={savedItems} onSave={toggleSave} onShare={shareLink} onShowDetail={setDetailItem} scrollToJob={scrollToJob} setScrollToJob={setScrollToJob} />}
                    {currentTab === 'estado'   && <ProjectStatus dark={dark} />}
                    {currentTab === 'foro'     && <ForoTab dark={dark} user={user} />}
                    {currentTab === 'transparencia' && <TransparenciaTab dark={dark} />}
                    {currentTab === 'saldo'    && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 py-4 w-full">
                        <SaldoCard dark={dark} onClose={() => setCurrentTab('dashboard')} />
                      </div>
                    )}
                    {currentTab === 'perfil'   && <PerfilTab user={user} setUser={setUser} dark={dark} toggleDark={toggleDark} saved={savedItems} onShowDetail={setDetailItem} onSave={toggleSave} onShare={shareLink} onNavigate={setCurrentTab} onReportIncident={() => setIsReportModalOpen(true)} onLogout={async () => { await authSignOut(); setUser(null); setIsGuest(false); localStorage.removeItem('urbango_is_guest'); localStorage.removeItem('urbango_user'); localStorage.removeItem('urbanGoUser'); navigate('/'); }} />}
                  </div>
                </main>

                {/* MetroBot IA Modal */}
                <MetroBot 
                  isOpen={isChatOpen} 
                  onClose={() => {
                    setIsChatOpen(false);
                    setChatInitialQuery('');
                  }} 
                  dark={dark} 
                  initialQuery={chatInitialQuery}
                  onNavigate={(tab, payload) => {
                    if (tab === 'empleo' || tab === 'noticias') {
                      setSelectedNewsOrJob({
                        isOpen: true,
                        initialTab: tab === 'empleo' ? 'empleo' : 'noticias',
                        selectedItemId: null
                      });
                    } else if (tab === 'estado') {
                      setIsProjectStatusOpen(true);
                    } else if (tab === 'mapa') {
                      setCurrentTab('mapa');
                      if (payload?.stationId || payload?.code) {
                        setMapFocusStation(payload.stationId || payload.code);
                      }
                    } else {
                      setCurrentTab(tab);
                    }
                  }}
                  onFocusStation={(station) => {
                    setCurrentTab('mapa');
                    setMapFocusStation(station.id || station.code || station.name);
                    setIsChatOpen(false);
                  }}
                  onOpenProjectStatus={() => setIsProjectStatusOpen(true)}
                  onShowDetail={setDetailItem}
                  onOpenJobModal={(job) => {
                    setSelectedNewsOrJob({
                      isOpen: true,
                      initialTab: 'empleo',
                      selectedItemId: job?.id || null
                    });
                  }}
                  onOpenNewsOrJob={(tab, itemId) => {
                    setSelectedNewsOrJob({
                      isOpen: true,
                      initialTab: tab || 'noticias',
                      selectedItemId: itemId || null
                    });
                  }}
                  onReportIncident={() => setIsReportModalOpen(true)}
                />
                {/* Modal global de Noticias y Convocatorias de Empleo activable desde MetroBot IA */}
                <NewsAndJobsModal
                  isOpen={selectedNewsOrJob.isOpen}
                  onClose={() => setSelectedNewsOrJob(prev => ({ ...prev, isOpen: false }))}
                  initialTab={selectedNewsOrJob.initialTab}
                  selectedItemId={selectedNewsOrJob.selectedItemId}
                  dark={dark}
                  saved={savedItems}
                  onSave={toggleSave}
                  onShare={shareLink}
                  onShowDetail={setDetailItem}
                />
                {/* Modal global de Estado de Avance de Obra activable desde MetroBot IA y accesos */}
                <ProjectStatusModal
                  isOpen={isProjectStatusOpen}
                  onClose={() => setIsProjectStatusOpen(false)}
                  dark={dark}
                />
                {/* Modal global de Saldo de Tarjeta TuTarjetaMetro / TuLlave */}
                <SaldoModal
                  isOpen={isSaldoModalOpen}
                  onClose={() => setIsSaldoModalOpen(false)}
                  dark={dark}
                />
                <PortalEmpleoModal
                  isOpen={isGlobalPortalModalOpen}
                  onClose={() => {
                    setIsGlobalPortalModalOpen(false);
                    setSelectedJobForModal(null);
                  }}
                  selectedJob={selectedJobForModal}
                  dark={dark}
                />
                {detailItem && <DetailModal item={detailItem} onClose={() => setDetailItem(null)} onSave={toggleSave} onShare={shareLink} saved={savedItems} dark={dark} />}
                <SettingsModal
                  isOpen={isSettingsOpen}
                  onClose={() => setIsSettingsOpen(false)}
                  dark={dark}
                  user={user}
                  onNavigate={setCurrentTab}
                  onReportIncident={() => setIsReportModalOpen(true)}
                  onGoLanding={() => navigate('/')}
                  isLargeText={isLargeText}
                  setIsLargeText={setIsLargeText}
                  isHighContrast={isHighContrast}
                  setIsHighContrast={setIsHighContrast}
                />

                {/* ── MENÚ CIRCULAR FLOTANTE COLAPSABLE (SPEED DIAL FAB) — MOBILE ── */}
                {/* Backdrop para auto-cierre inteligente al tocar fuera */}
                {isFabOpen && (
                  <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[240] md:hidden transition-opacity duration-200 animate-in fade-in"
                    onClick={() => setIsFabOpen(false)}
                  />
                )}

                {/* Panel Desplegable de 8 Secciones */}
                {isFabOpen && (
                  <div className={`fixed bottom-24 right-4 sm:right-6 w-[310px] max-w-[calc(100vw-2rem)] rounded-[2rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.35)] border backdrop-blur-2xl z-[250] md:hidden popup-in ${dark ? 'bg-zinc-900/98 border-zinc-700/80 text-white' : 'bg-white/98 border-zinc-200 text-zinc-900'}`}>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200/60 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#B30000] animate-pulse" />
                        <p className="font-black text-xs uppercase tracking-widest italic">Urban<span className="text-[#B30000]">-go</span> Menú</p>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-red-500/10 text-[#B30000]">6 Servicios</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'dashboard', label: 'Inicio', desc: 'Resumen L1', icon: <Train size={17} />, color: 'bg-red-500/15 text-red-600 dark:text-red-400' },
                        { id: 'mapa', label: 'Mapa L1', desc: 'Estaciones', icon: <MapIcon size={17} />, color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
                        /* { id: 'noticias', label: 'Noticias', desc: 'Empleo & Red', icon: <Newspaper size={17} />, color: 'bg-orange-500/15 text-orange-600 dark:text-orange-400' }, -- Oculto del menú para mantener UI limpia */
                        /* { id: 'estado', label: 'Obras', desc: 'Frentes activos', icon: <Construction size={17} />, color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' }, -- Oculto del menú para mantener UI limpia al igual que noticias */
                        { id: 'foro', label: 'Foro', desc: 'Comunidad', icon: <MessageSquare size={17} />, color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400' },
                        { id: 'saldo', label: 'TuLlave', desc: 'Saldo y recarga', icon: <CreditCard size={17} />, color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
                        { id: 'incidencia', label: 'Reportar Vial', desc: 'Incidencia en obra', icon: <AlertTriangle size={17} />, color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400', isAction: true },
                        { id: 'perfil', label: 'Mi Perfil', desc: 'Configuración', icon: <User size={17} />, color: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-400' },
                      ].map(item => {
                        const isActive = !item.isAction && currentTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              if (item.isAction) {
                                setIsReportModalOpen(true);
                              } else {
                                setCurrentTab(item.id);
                              }
                              setIsFabOpen(false);
                              setIsNotifOpen(false);
                              setIsSearchOpen(false);
                            }}
                            className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all active:scale-95 ${
                              isActive
                                ? 'bg-[#B30000] text-white border-[#B30000] shadow-md'
                                : dark
                                  ? 'bg-zinc-800/80 border-zinc-700/60 hover:bg-zinc-800 text-zinc-200'
                                  : 'bg-zinc-50 border-zinc-200/80 hover:bg-zinc-100 text-zinc-800'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-white/20 text-white' : item.color}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-black truncate leading-tight">{item.label}</p>
                              <p className={`text-[8px] truncate ${isActive ? 'text-white/80' : dark ? 'text-zinc-500' : 'text-zinc-500'}`}>{item.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Botón Circular Flotante (Speed Dial FAB) */}
                <button
                  onClick={() => {
                    setIsFabOpen(!isFabOpen);
                    setIsNotifOpen(false);
                  }}
                  title={isFabOpen ? 'Cerrar Menú' : 'Abrir Menú de Navegación'}
                  aria-label="Menú Flotante"
                  className={`fixed bottom-6 right-6 z-[250] md:hidden w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 hover:scale-105 border-2 border-white/30 cursor-pointer ${
                    isFabOpen
                      ? 'bg-zinc-950 text-white rotate-90 scale-105 ring-4 ring-[#B30000]/40'
                      : 'bg-gradient-to-tr from-[#8E0000] via-[#B30000] to-[#E52222] text-white shadow-[0_10px_30px_rgba(179,0,0,0.55)]'
                  }`}
                >
                  {isFabOpen ? (
                    <X size={26} className="transition-transform duration-200" />
                  ) : (
                    <div className="relative flex items-center justify-center">
                      <Train size={24} className="animate-pulse" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-[#B30000]" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── PESTAÑAS PRINCIPALES ─────────────────────────────────────────

const TransparenciaTab = ({ dark }) => {
  const { t, lang, setLang } = useI18n();

  const PILARES = [
    { icon: DollarSign, color: '#B30000', title: t("transp_budget_title"), sub: t("transp_budget_sub"), items: [
      { label: t("transp_cat_civil"), pct: 62, val: '$10.09B' },
      { label: t("transp_cat_rolling"), pct: 18, val: '$2.93B' },
      { label: t("transp_cat_sys"), pct: 12, val: '$1.95B' },
      { label: t("transp_cat_social"), pct: 8, val: '$1.30B' },
    ]},
    { icon: FileText, color: '#1565C0', title: t("transp_bids_title"), sub: t("transp_bids_sub"), items: [
      { label: t("transp_bids_awarded"), pct: 85, val: '127' },
      { label: t("transp_bids_open"), pct: 15, val: '12' },
      { label: t("transp_bids_value"), pct: 78, val: '$12.7B' },
      { label: t("transp_bids_sme"), pct: 42, val: '340+' },
    ]},
    { icon: Eye, color: '#2D8B3C', title: t("transp_audit_title"), sub: t("transp_audit_sub"), items: [
      { label: t("transp_audit_completed"), pct: 90, val: '18' },
      { label: t("transp_audit_resolved"), pct: 95, val: '142/150' },
      { label: t("transp_audit_reports"), pct: 100, val: '24' },
      { label: t("transp_audit_active"), pct: 60, val: '6' },
    ]},
    { icon: Leaf, color: '#FFD600', title: t("transp_env_title"), sub: t("transp_env_sub"), items: [
      { label: t("transp_env_co2"), pct: 80, val: '24,000 T' },
      { label: t("transp_env_trees"), pct: 65, val: '4,200+' },
      { label: t("transp_env_trips"), pct: 70, val: '800K' },
      { label: t("transp_env_energy"), pct: 30, val: '15%' },
    ]},
  ];

  const HITOS = [
    { year: '2023', label: t("hito_cierre"), done: true },
    { year: '2024', label: t("hito_inicio"), done: true },
    { year: '2025', label: t("hito_viaducto"), done: true },
    { year: '2026', label: t("hito_rodaje"), done: true },
    { year: '2027', label: t("hito_pasajeros"), done: false },
    { year: '2028', label: t("hito_apertura"), done: false },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header institucional */}
      <div className="px-2 mt-2">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[8px] font-black uppercase tracking-[0.22em] px-2 py-0.5 rounded-full border ${dark ? 'text-[#2D8B3C] border-[#2D8B3C]/40 bg-green-950/30' : 'text-[#2D8B3C] border-[#2D8B3C]/30 bg-green-50'}`}>Portal Oficial · EMB</span>
        </div>
        <h2 className={`text-3xl font-black italic tracking-tighter leading-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>Gobierno Abierto y<br /><span className="text-[#B30000]">{t('rendicion_cuentas')}</span></h2>
        <p className={`text-xs font-bold mt-2 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{t("news_author_emb", "Empresa Metro de Bogotá")} S.A. · Datos verificados · Corte Mayo 2026</p>
      </div>

      {/* Módulo Oficial de Descarga de Documentos (PDF y XLSX) */}
      <ModuloTransparenciaDoc dark={dark} />

      {/* Grid de 4 pilares */}
      {PILARES.map((pilar) => {
        const Icon = pilar.icon;
        return (
          <div key={pilar.title} className={`rounded-[2rem] p-6 shadow-sm border transition-colors ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: pilar.color }}>
                <Icon size={20} className="text-white" />
              </div>
              <div>
                <h3 className={`font-black text-lg leading-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>{pilar.title}</h3>
                <p className={`text-[9px] font-black uppercase tracking-widest ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>{pilar.sub}</p>
              </div>
            </div>
            <div className="space-y-4">
              {pilar.items.map(item => (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-xs font-bold ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}>{item.label}</span>
                    <span className="text-xs font-black" style={{ color: pilar.color }}>{item.val}</span>
                  </div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.pct}%`, backgroundColor: pilar.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Cronograma de Hitos */}
      <div className={`rounded-[2rem] p-6 shadow-sm border transition-colors ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <h3 className={`font-black italic text-lg mb-5 flex items-center gap-2 ${dark ? 'text-white' : 'text-zinc-900'}`}><Calendar size={20} className="text-[#B30000]" /> {t("transp_schedule_title")}</h3>
        <div className="flex overflow-x-auto no-scroll gap-3 pb-2">
          {HITOS.map((h, i) => (
            <div key={h.year} className={`flex-shrink-0 w-28 text-center p-4 rounded-2xl border transition-all ${
              h.done
                ? dark ? 'bg-[#B30000]/15 border-[#B30000]/30' : 'bg-red-50 border-red-200'
                : dark ? 'bg-zinc-800 border-zinc-700 opacity-60' : 'bg-zinc-50 border-zinc-200 opacity-60'
            }`}>
              <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-xs font-black ${
                h.done ? 'bg-[#B30000] text-white' : dark ? 'bg-zinc-700 text-zinc-400' : 'bg-zinc-200 text-zinc-500'
              }`}>{h.done ? '✓' : i + 1}</div>
              <p className={`font-black text-sm ${dark ? 'text-white' : 'text-zinc-900'}`}>{h.year}</p>
              <p className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{h.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Enlace Oficial a la Empresa Metro de Bogotá */}
      <a 
        href="https://www.metrodebogota.gov.co/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center justify-center gap-3 w-full p-4.5 rounded-2xl bg-[#B30000] text-white font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all hover:bg-[#9B0000]"
      >
        <ExternalLink size={18} /> {t("metro_official_site")}
      </a>

      {/* Canales de Denuncia */}
      <div className={`rounded-[2rem] p-6 shadow-sm border transition-colors ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <h3 className={`font-black italic text-lg mb-4 flex items-center gap-2 ${dark ? 'text-white' : 'text-zinc-900'}`}><ShieldCheck size={20} className="text-[#B30000]" /> {t("denuncia_channels")}</h3>
        <p className={`text-xs font-medium mb-4 leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>{t("denuncia_standards")}</p>
        <div className="space-y-3">
          <a href="mailto:oii-reportfraud@iadb.org" className="flex items-center gap-3 bg-[#B30000] hover:bg-red-800 text-white p-4 rounded-xl font-bold text-sm transition-colors active:scale-95"><Mail size={18} /> oii-reportfraud@iadb.org</a>
          <a href="https://cuentame.iadb.org/" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-4 rounded-xl font-bold text-sm transition-colors active:scale-95 border ${dark ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700' : 'bg-zinc-50 border-zinc-200 text-zinc-900 hover:bg-zinc-100'}`}><ExternalLink size={18} /> {t("iadb_online_form")}</a>
        </div>
      </div>
    </div>
  );
};

const RUTAS_IMPACTO = [
  { id: 'bosa-72', origen: 'route_bosa', destino: 'route_calle72', bus: 85, metro: 27, ahorro: 58, co2: '0.8 kg' },
  { id: 'kennedy-centro', origen: 'route_kennedy', destino: 'route_jimenez', bus: 50, metro: 15, ahorro: 35, co2: '0.5 kg' },
  { id: 'mayo-72', origen: 'route_mayo', destino: 'route_calle72', bus: 65, metro: 18, ahorro: 47, co2: '0.7 kg' },
  { id: 'marly-72', origen: 'route_marly', destino: 'route_calle72', bus: 25, metro: 6, ahorro: 19, co2: '0.3 kg' }
];

const DashboardTab = ({ onNavigate, setIsChatOpen, dark }) => {
  const { t, lang, setLang } = useI18n();

  const [rutaIdx, setRutaIdx] = useState(0);
  const r = RUTAS_IMPACTO[rutaIdx];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BubblesHero dark={dark} onNavigate={onNavigate} />

      {/* ── REDISEÑO VIP PARA METROBOT IA CON AVATAR OFICIAL ── */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="w-full bg-gradient-to-r from-red-600 via-red-700 to-zinc-900 border border-red-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl active:scale-98 transition-all duration-300 flex items-center gap-4 sm:gap-5 text-left relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* MetroBot Digital Guide Avatar (<15KB SVG animado en reposo con badge verde) */}
        <MetroBotAvatar size={56} showStatus={true} isOnline={true} className="shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-200 font-bold text-[10px] tracking-wide">{t('bot_online')} · Asistente Oficial</span>
          </div>
          <h2 className="text-xl font-black italic text-white leading-tight">MetroBot IA</h2>
          <p className="text-zinc-300 text-[10px] font-bold uppercase tracking-widest leading-tight">{t('bot_subtitle')}</p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0">
          <ArrowRight className="text-white opacity-90" size={18} />
        </div>
      </button>

      {/* ── INDICADORES OFICIALES DE AVANCE DE OBRA (L1MB - EMB 82.33%) ── */}
      <IndicadoresAvanceL1MB dark={dark} showSummary={true} showFrentes={false} />

      {/* ── MÓDULO DE IMPACTO CIUDADANO, ECO-IMPACTO Y TIEMPOS (16 ESTACIONES L1MB) ── */}
      <CitizenImpactModule dark={dark} />
    </div>
  )
};

// ── MULTI-TRAIN AUTOMATIC SIMULATOR ──────────────────────────────────────────
const JOURNEY_DURATION_MS = 15 * 60 * 1000;
const SPAWN_INTERVAL_MS = 3 * 60 * 1000;
const DWELL_FIRST_MS = 15000;
const DWELL_STATION_MS = 8000;

const buildRouteTimeline = (stations) => {
  const dists = [];
  let totalDist = 0;
  for (let i = 0; i < stations.length - 1; i++) {
    const dx = stations[i + 1].lat - stations[i].lat;
    const dy = stations[i + 1].lng - stations[i].lng;
    dists.push(Math.sqrt(dx * dx + dy * dy));
    totalDist += dists[i];
  }
  const totalDwell = DWELL_FIRST_MS + (stations.length - 1) * DWELL_STATION_MS;
  const totalTravel = JOURNEY_DURATION_MS - totalDwell;
  const segs = [];
  let t = 0;
  for (let i = 0; i < stations.length; i++) {
    const dwell = i === 0 ? DWELL_FIRST_MS : DWELL_STATION_MS;
    segs.push({ s: t, e: t + dwell, type: 'dwell', idx: i });
    t += dwell;
    if (i < stations.length - 1) {
      const travel = (dists[i] / totalDist) * totalTravel;
      segs.push({ s: t, e: t + travel, type: 'travel', from: i, to: i + 1 });
      t += travel;
    }
  }
  return segs;
};

const getTrainState = (timeline, stations, elapsed) => {
  if (elapsed < 0 || elapsed >= JOURNEY_DURATION_MS) return null;
  for (const seg of timeline) {
    if (elapsed >= seg.s && elapsed < seg.e) {
      if (seg.type === 'dwell') {
        const st = stations[seg.idx];
        return { pos: [st.lat, st.lng], stIdx: seg.idx, phase: 'stopped', progress: elapsed / JOURNEY_DURATION_MS };
      } else {
        const t = (elapsed - seg.s) / (seg.e - seg.s);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const f = stations[seg.from], dest = stations[seg.to];
        return {
          pos: [f.lat + (dest.lat - f.lat) * eased, f.lng + (dest.lng - f.lng) * eased],
          stIdx: seg.from, nextIdx: seg.to, phase: 'moving',
          progress: elapsed / JOURNEY_DURATION_MS
        };
      }
    }
  }
  return null;
};

const TRAIN_COLORS = [
  { bg: 'linear-gradient(135deg,#B30000,#E53935)', shadow: 'rgba(179,0,0,0.5)', solid: '#B30000', name: 'Rojo' },
  { bg: 'linear-gradient(135deg,#1565C0,#42A5F5)', shadow: 'rgba(21,101,192,0.5)', solid: '#1565C0', name: 'Azul' },
  { bg: 'linear-gradient(135deg,#2E7D32,#66BB6A)', shadow: 'rgba(46,125,50,0.5)', solid: '#2E7D32', name: 'Verde' },
  { bg: 'linear-gradient(135deg,#6A1B9A,#AB47BC)', shadow: 'rgba(106,27,154,0.5)', solid: '#6A1B9A', name: 'Morado' },
  { bg: 'linear-gradient(135deg,#E65100,#FF9800)', shadow: 'rgba(230,81,0,0.5)', solid: '#E65100', name: 'Naranja' },
  { bg: 'linear-gradient(135deg,#00838F,#26C6DA)', shadow: 'rgba(0,131,143,0.5)', solid: '#00838F', name: 'Cyan' },
];

const trainSvgStr = (stroke) => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15.5V5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10.5"/><path d="m4 15.5 3.5 3.5h9l3.5-3.5"/><path d="M9 22v-3"/><path d="M15 22v-3"/><rect x="7" y="5" width="10" height="6" rx="1"/></svg>`;

const movingIcons = TRAIN_COLORS.map(c => L.divIcon({
  className: '',
  html: `<div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:${c.bg};border-radius:50%;border:3px solid white;box-shadow:0 4px 12px ${c.shadow};animation:trainPulse 1.5s ease-in-out infinite">${trainSvgStr('white')}</div>`,
  iconSize: [32, 32], iconAnchor: [16, 16]
}));

const stoppedIcon = L.divIcon({
  className: '',
  html: `<div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:linear-gradient(135deg,#FFD600,#FFA000);border-radius:50%;border:3px solid white;box-shadow:0 4px 12px rgba(255,214,0,0.5)">${trainSvgStr('#333')}</div>`,
  iconSize: [32, 32], iconAnchor: [16, 16]
});

const TRAIN_PULSE_CSS = `
  @keyframes trainPulse {
    0%, 100% { box-shadow: 0 4px 15px rgba(179,0,0,0.5); }
    50% { box-shadow: 0 4px 25px rgba(179,0,0,0.8), 0 0 40px rgba(229,57,53,0.3); }
  }
`;

// ── STATION POPUP COMPONENT ──────────────────────────────────────
const StationPopup = ({ station, onClose, onShowDetail, dark }) => {
  if (!station) return null;

  const statusColor = station.alert
    ? { bg: '#FFD600', text: '#1a1a1a' }
    : station.status === 'Cerrada'
      ? { bg: '#B30000', text: '#ffffff' }
      : { bg: '#2D8B3C', text: '#ffffff' };

  return (
    <div
      className="absolute inset-0 z-[65] flex items-end justify-center pb-4 px-3"
      onClick={onClose}
    >
      <div
        className={`w-full rounded-[1.75rem] overflow-hidden shadow-2xl border popup-in transition-colors ${dark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Image header */}
        <div className="relative h-36 overflow-hidden bg-zinc-200 dark:bg-zinc-800">
          <img
            src={station.img || '/Corredor central.jfif'}
            className="absolute inset-0 w-full h-full object-cover block"
            alt={station.name}
            onError={e => { if(!e.target.dataset.fallback) { e.target.dataset.fallback = "true"; e.target.src = '/Corredor central.jfif'; } }}
            style={{ filter: 'brightness(0.92)' }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)' }} />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
          >
            <X size={14} />
          </button>

          {/* Status badge + name overlay */}
          <div className="absolute bottom-3 left-4 right-14">
            <span
              className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md"
              style={{ background: statusColor.bg, color: statusColor.text }}
            >
              {station.alert ? '⚠️ ' : ''}{station.status}
            </span>
            <p className="font-black text-white text-sm mt-1.5 leading-tight drop-shadow-md">{station.name}</p>
          </div>

          {/* Progress badge */}
          <div className="absolute top-3 left-4 bg-black/55 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#B30000] rounded-full animate-pulse" />
            <span className="text-white font-black text-sm leading-none">{station.progress}</span>
            <span className="text-white/70 text-[9px] font-bold uppercase tracking-widest">avance</span>
          </div>
        </div>

        {/* Info body */}
        <div className="p-4 space-y-3">
          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-[#B30000] flex-shrink-0" />
            <span className={`text-xs font-bold ${dark ? 'text-zinc-300' : 'text-zinc-600'}`}>{station.loc}</span>
          </div>

          {/* Description */}
          <p className={`text-xs font-medium leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>{station.desc}</p>

          {/* Progress bar */}
          <div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? 'bg-zinc-700' : 'bg-zinc-200'}`}>
              <div
                className="h-full bg-gradient-to-r from-[#B30000] to-[#E53935] rounded-full transition-all duration-700"
                style={{ width: station.progress }}
              />
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => { onShowDetail(station); onClose(); }}
            className="w-full bg-gradient-to-r from-[#B30000] to-[#8E0000] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform shadow-md flex items-center justify-center gap-2"
          >
            Ver Ficha Completa <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const TrainFocus = ({ trainStates }) => {
  const map = useMap();
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (focused) return;
    const t = trainStates.find(tr => tr.id === 1 && tr.phase === 'moving');
    if (t) {
      map.flyTo(t.pos, 15, { animate: true, duration: 2 });
      setFocused(true);
    }
  }, [trainStates, focused, map]);

  return null;
};

// Fix: forces Leaflet to recalculate tile layout when the map container
// becomes visible (solves the blank map when switching tabs)
const InvalidateSizeOnMount = () => {
  const map = useMap();
  useEffect(() => {
    // Immediate call for when container is already visible
    map.invalidateSize();
    // Spec-required: 200ms delayed call
    const t1 = setTimeout(() => map.invalidateSize(), 200);
    // Extra safety calls for slow CSS/flex resolution
    const t2 = setTimeout(() => map.invalidateSize(), 400);
    const t3 = setTimeout(() => map.invalidateSize(), 800);
    // Also invalidate on window resize
    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);
  return null;
};

const MapaTab = ({ stations, onShowDetail, dark }) => {
  const { t, lang, setLang } = useI18n();

  const center = [4.636, -74.095];
  const line1 = stations.map(s => [s.lat, s.lng]);
  const timeline = useMemo(() => buildRouteTimeline(stations), [stations]);

  const [activeTrains, setActiveTrains] = useState(() => [{ id: 1, num: 1, colorIdx: 0, startTime: Date.now() - 11000 }]);
  const [tick, setTick] = useState(() => Date.now());
  const trainCounterRef = useRef(1);
  const [selectedStation, setSelectedStation] = useState(null);
  const [liveStation, setLiveStation] = useState(null);
  const prevStIdxRef = useRef(null);

  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [layers, setLayers] = useState({ cierres: true, desvios: true, obras: true });
  const [selectedClosure, setSelectedClosure] = useState(null);
  const [tileError, setTileError] = useState(false);
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [isTrainsInfoOpen, setIsTrainsInfoOpen] = useState(false);

  const cierresLines = [
    { id: 'c1', name: 'map_closure_caracas_name', desc: 'map_closure_caracas_desc', date: '2024-05-01', time: '24 hrs', detour: 'map_closure_caracas_detour', color: '#B30000', dash: '10, 10', positions: [[4.6470, -74.0630], [4.6640, -74.0610]] },
    { id: 'c2', name: 'map_closure_mayo_name', desc: 'map_closure_mayo_desc', date: '2024-06-15', time: '10pm - 4am', detour: 'map_closure_mayo_detour', color: '#B30000', dash: '10, 10', positions: [[4.580, -74.140], [4.590, -74.130]] }
  ];
  const desviosLines = [
    { id: 'd1', name: 'Desvío NQS', color: '#2D8B3C', positions: [[4.6470, -74.0730], [4.6640, -74.0710]] }
  ];

  // Memoize event handlers to prevent dropping clicks due to simulator re-renders
  const stationHandlers = useMemo(() => {
    const handlers = {};
    stations.forEach(s => {
      handlers[s.id] = {
        click: (e) => {
          L.DomEvent.stopPropagation(e);
          setSelectedStation(s);
        }
      };
    });
    return handlers;
  }, [stations, setSelectedStation]);

  useEffect(() => {
    const spawner = setInterval(() => {
      const now = Date.now();
      trainCounterRef.current += 1;
      const num = trainCounterRef.current;
      setActiveTrains(prev => [
        ...prev.filter(t => now - t.startTime < JOURNEY_DURATION_MS),
        { id: num, num, colorIdx: (num - 1) % TRAIN_COLORS.length, startTime: now }
      ]);
    }, SPAWN_INTERVAL_MS);

    const ticker = setInterval(() => {
      const now = Date.now();
      setTick(now);
      setActiveTrains(prev => prev.filter(t => now - t.startTime < JOURNEY_DURATION_MS));
    }, 50);

    return () => { clearInterval(spawner); clearInterval(ticker); };
  }, []);

  const trainStates = activeTrains.map(t => {
    const elapsed = tick - t.startTime;
    const state = getTrainState(timeline, stations, elapsed);
    return state ? { ...t, ...state } : null;
  }).filter(Boolean);

  // Live station banner
  useEffect(() => {
    const first = trainStates.find(t => t.phase === 'stopped');
    if (first) {
      const idx = first.stIdx;
      if (idx !== prevStIdxRef.current) {
        prevStIdxRef.current = idx;
        const st = stations[idx];
        if (st) {
          setLiveStation(st);
          const t = setTimeout(() => setLiveStation(null), 5000);
          return () => clearTimeout(t);
        }
      }
    }
  }, [trainStates, stations]);

  const lastSpawn = activeTrains.length > 0 ? Math.max(...activeTrains.map(t => t.startTime)) : tick;
  const nextIn = Math.max(0, SPAWN_INTERVAL_MS - (tick - lastSpawn));
  const nextMin = Math.floor(nextIn / 60000);
  const nextSec = Math.floor((nextIn % 60000) / 1000);

  // Memoize icons to prevent DOM recreation on every 50ms tick, which drops clicks!
  const stationIcons = useMemo(() => {
    const icons = {};
    stations.forEach(s => {
      icons[s.id] = L.divIcon({
        className: 'custom-station-marker',
        html: `<div class="relative" style="cursor:pointer; pointer-events: auto;"><div style="width:22px;height:22px;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;background:${s.alert ? '#FFD600' : s.status === 'Cerrada' ? '#B30000' : '#2D8B3C'}"><div style="width:7px;height:7px;background:white;border-radius:50%"></div></div></div>`,
        iconSize: [22, 22], iconAnchor: [11, 11]
      });
    });
    return icons;
  }, [stations]);

  const mapWrapperRef = useRef(null);

  // ResizeObserver: call invalidateSize whenever the wrapper changes dimensions
  useEffect(() => {
    const node = mapWrapperRef.current;
    if (!node) return;
    let mapInstance = null;
    const findAndInvalidate = () => {
      const leafletContainer = node.querySelector('.leaflet-container');
      if (leafletContainer && leafletContainer._leaflet_map) {
        mapInstance = leafletContainer._leaflet_map;
        mapInstance.invalidateSize();
      }
    };
    const ro = new ResizeObserver(() => { findAndInvalidate(); });
    ro.observe(node);
    findAndInvalidate();
    const tid = setTimeout(findAndInvalidate, 300);
    return () => { ro.disconnect(); clearTimeout(tid); };
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] md:h-[calc(100vh-110px)] min-h-[480px] rounded-3xl overflow-hidden border shadow-lg flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500" ref={mapWrapperRef}>
      <style>{TRAIN_PULSE_CSS}</style>

      {/* ── MAP CONTAINER (100% fondo del viewport del tab) ── */}
      <div className="absolute inset-0 w-full h-full z-0">
        <MapContainer
          center={center}
          zoom={12}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          zoomControl={false}
          whenReady={(map) => {
            setTimeout(() => { try { map.invalidateSize(); } catch (_) {} }, 50);
            setTimeout(() => { try { map.invalidateSize(); } catch (_) {} }, 200);
          }}
        >
          <InvalidateSizeOnMount />
          <TrainFocus trainStates={trainStates} />
          <TileLayer
            url={tileError
              ? "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              : (dark
                  ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png")}
            attribution={tileError
              ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'}
            eventHandlers={{
              tileerror: () => { setTileError(true); }
            }}
          />
          <Polyline positions={line1} color="#B30000" weight={6} opacity={0.9} />
          
          {layers.cierres && cierresLines.map(c => (
            <Polyline key={c.id} positions={c.positions} color={c.color} weight={7} dashArray={c.dash} eventHandlers={{ click: () => setSelectedClosure(c) }} />
          ))}
          {layers.desvios && desviosLines.map(d => (
            <Polyline key={d.id} positions={d.positions} color={d.color} weight={5} opacity={0.8} />
          ))}

          {(layers.obras ? stations : stations.filter(s => s.status !== 'En obra' && s.status !== 'Cerrada')).map(s => (
            <Marker key={s.id} position={[s.lat, s.lng]} icon={stationIcons[s.id]}
              eventHandlers={stationHandlers[s.id]} />
          ))}
          {trainStates?.map(t => (
            <Marker key={`train-${t.id}`} position={t.pos}
              icon={t.phase === 'stopped' ? stoppedIcon : movingIcons[t.colorIdx]}
              zIndexOffset={1000} />
          ))}
        </MapContainer>
      </div>

      {/* ── TOP CONTROLS & FLOATING PILLS OVERLAY ── */}
      <div className="absolute top-3 left-3 right-3 z-[60] flex flex-col gap-2 pointer-events-none">
        
        {/* Top Header Row with Collapsible Buttons */}
        <div className="flex items-center justify-between gap-2 pointer-events-auto">
          {/* Title Pill */}
          <div className={`px-3 py-1.5 rounded-2xl backdrop-blur-xl border shadow-md flex items-center gap-2 ${dark ? 'bg-zinc-950/85 border-zinc-800 text-white' : 'bg-white/90 border-zinc-200 text-zinc-900'}`}>
            <span className="text-base">🚇</span>
            <span className="font-black text-xs italic tracking-tight">L1 <span className="text-[#B30000]">2026</span></span>
          </div>

          {/* Quick Action Pills: Simulación / Capas / Leyenda */}
          <div className="flex items-center gap-1.5">
            {/* Trains simulator status pill */}
            <button
              onClick={() => setIsTrainsInfoOpen(v => !v)}
              className={`px-2.5 py-1.5 rounded-2xl backdrop-blur-xl border shadow-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 ${
                isTrainsInfoOpen
                  ? 'bg-[#B30000] text-white border-[#B30000]'
                  : dark ? 'bg-zinc-900/85 border-zinc-800 text-zinc-300' : 'bg-white/90 border-zinc-200 text-zinc-700'
              }`}
            >
              <div className="w-2 h-2 bg-[#2D8B3C] rounded-full animate-pulse flex-shrink-0" />
              <span>{trainStates.length} 🚆</span>
            </button>

            {/* Capas toggle pill */}
            <button
              onClick={() => { setIsLayersOpen(v => !v); setIsLegendOpen(false); }}
              className={`px-2.5 py-1.5 rounded-2xl backdrop-blur-xl border shadow-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all active:scale-95 ${
                isLayersOpen
                  ? 'bg-zinc-900 text-white border-zinc-700'
                  : dark ? 'bg-zinc-900/85 border-zinc-800 text-zinc-300' : 'bg-white/90 border-zinc-200 text-zinc-700'
              }`}
            >
              <span>⚙️ {t('capas', 'Capas')}</span>
            </button>

            {/* Leyenda toggle pill */}
            <button
              onClick={() => { setIsLegendOpen(v => !v); setIsLayersOpen(false); }}
              className={`px-2.5 py-1.5 rounded-2xl backdrop-blur-xl border shadow-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all active:scale-95 ${
                isLegendOpen
                  ? 'bg-zinc-900 text-white border-zinc-700'
                  : dark ? 'bg-zinc-900/85 border-zinc-800 text-zinc-300' : 'bg-white/90 border-zinc-200 text-zinc-700'
              }`}
            >
              <span>ℹ️</span>
            </button>
          </div>
        </div>

        {/* Live Station Banner Alert (Compact) */}
        {liveStation && (
          <div className="pointer-events-auto self-center max-w-sm w-full bg-[#B30000]/95 backdrop-blur-md rounded-2xl px-3.5 py-2 flex items-center gap-2.5 shadow-xl popup-in border border-red-400/30 text-white">
            <span className="text-xl">🚉</span>
            <div className="flex-1 min-w-0">
              <p className="text-[8px] font-black uppercase tracking-widest text-white/70">{t('map_train_arriving')}</p>
              <p className="font-black text-xs leading-tight truncate">{liveStation.name}</p>
            </div>
            <span className="text-[9px] font-black bg-white/20 px-2 py-0.5 rounded-lg">{liveStation.progress}</span>
          </div>
        )}

        {/* Floating Expandable: Simulator Info Box */}
        {isTrainsInfoOpen && (
          <div className={`pointer-events-auto p-3 rounded-2xl backdrop-blur-xl border shadow-2xl popup-in max-w-xs ${dark ? 'bg-zinc-950/95 border-zinc-800 text-white' : 'bg-white/95 border-zinc-200 text-zinc-900'}`}>
            <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-zinc-500/20">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#2D8B3C] rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">{t('simulacion_auto')}</span>
              </div>
              <span className="text-[9px] font-bold text-zinc-400">{t('map_next_train')} {nextMin}:{String(nextSec).padStart(2, '0')}</span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scroll pb-1">
              {trainStates.map(tState => {
                const st = stations[tState.stIdx];
                const c = TRAIN_COLORS[tState.colorIdx];
                const pct = Math.round(tState.progress * 100);
                return (
                  <div key={tState.id} className={`flex-shrink-0 rounded-xl px-2 py-1 border flex items-center gap-1.5 ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: tState.phase === 'stopped' ? '#FFD600' : c.solid }} />
                    <div className="min-w-0 text-[8px]">
                      <p className="font-black truncate">{t('map_train')} {tState.num}</p>
                      <p className="text-zinc-400 font-bold">{tState.phase === 'stopped' ? `🚉 ${st?.code || ''}` : `🚆 → ${stations[tState.nextIdx]?.code || ''}`} ({pct}%)</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Floating Expandable: Layers Panel */}
        {isLayersOpen && (
          <div className={`pointer-events-auto self-end p-2.5 rounded-2xl backdrop-blur-xl border shadow-2xl popup-in flex flex-col gap-1.5 max-w-[210px] ${dark ? 'bg-zinc-950/95 border-zinc-800' : 'bg-white/95 border-zinc-200'}`}>
            <div className="flex justify-between items-center px-1 pb-1 mb-1 border-b border-zinc-500/20">
              <span className={`text-[9px] font-black uppercase tracking-widest ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>Filtro de Capas</span>
              <button onClick={() => setIsLayersOpen(false)} className="text-zinc-400 text-xs hover:text-white">✕</button>
            </div>
            <button
              onClick={() => setLayers(l => ({...l, cierres: !l.cierres}))}
              className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-left transition-colors border flex items-center justify-between ${layers.cierres ? (dark ? 'bg-red-950/40 text-red-400 border-red-500/40' : 'bg-red-50 text-red-700 border-red-300') : (dark ? 'bg-zinc-900 text-zinc-500 border-zinc-800' : 'bg-zinc-100 text-zinc-400 border-zinc-200')}`}
            >
              <span>🔴 {t('map_active_closures')}</span>
              <span>{layers.cierres ? '✓' : ''}</span>
            </button>
            <button
              onClick={() => setLayers(l => ({...l, desvios: !l.desvios}))}
              className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-left transition-colors border flex items-center justify-between ${layers.desvios ? (dark ? 'bg-green-950/40 text-green-400 border-green-500/40' : 'bg-green-50 text-green-700 border-green-300') : (dark ? 'bg-zinc-900 text-zinc-500 border-zinc-800' : 'bg-zinc-100 text-zinc-400 border-zinc-200')}`}
            >
              <span>🟢 {t('map_alternate_routes')}</span>
              <span>{layers.desvios ? '✓' : ''}</span>
            </button>
            <button
              onClick={() => setLayers(l => ({...l, obras: !l.obras}))}
              className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-left transition-colors border flex items-center justify-between ${layers.obras ? (dark ? 'bg-amber-950/40 text-amber-400 border-amber-500/40' : 'bg-amber-50 text-amber-700 border-amber-300') : (dark ? 'bg-zinc-900 text-zinc-500 border-zinc-800' : 'bg-zinc-100 text-zinc-400 border-zinc-200')}`}
            >
              <span>🚧 {t('map_stations_under_construction')}</span>
              <span>{layers.obras ? '✓' : ''}</span>
            </button>
          </div>
        )}

        {/* Floating Expandable: Legend Panel */}
        {isLegendOpen && (
          <div className={`pointer-events-auto self-end p-3 rounded-2xl backdrop-blur-xl border shadow-2xl popup-in text-[9px] font-black uppercase space-y-2 max-w-[200px] ${dark ? 'bg-zinc-950/95 text-zinc-200 border-zinc-800' : 'bg-white/95 text-zinc-900 border-zinc-200'}`}>
            <div className="flex justify-between items-center pb-1 border-b border-zinc-500/20">
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Convenciones</span>
              <button onClick={() => setIsLegendOpen(false)} className="text-zinc-400 text-xs hover:text-white">✕</button>
            </div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-[#2D8B3C] rounded-full flex-shrink-0" /><span>{t('map_active_work')}</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-[#FFD600] rounded-full flex-shrink-0" /><span>{t('map_alert')}</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-[#B30000] rounded-full flex-shrink-0" /><span>{t('map_closure')}</span></div>
            <div className="flex items-center gap-2 pt-1 border-t border-zinc-500/20">
              <div className="w-2.5 h-2.5 bg-[#B30000] rounded-full animate-pulse flex-shrink-0" />
              <span>{trainStates.length} {t('map_trains')}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM OVERLAYS: SIMULATION DISCLAIMER / CLOSURES / BOTTOM SHEET ── */}
      
      {/* Simulation Banner (Compact Pill Bottom Left) */}
      {showDisclaimer && (
        <div className="absolute bottom-4 left-3 right-3 sm:right-auto z-[60] backdrop-blur-xl bg-zinc-950/85 border border-amber-500/40 rounded-2xl p-2.5 sm:p-3 shadow-xl max-w-sm flex items-start gap-2 text-white">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={15} />
          <p className="text-[10px] sm:text-xs text-zinc-200 leading-tight pr-3 break-words">
            <strong className="text-amber-400">{t('aviso_simulacion').split(':')[0]}:</strong> {t('map_sim_warning').split(':').slice(1).join(':').trim()}
          </p>
          <button onClick={() => setShowDisclaimer(false)} className="text-zinc-400 hover:text-white flex-shrink-0">
            <X size={13} />
          </button>
        </div>
      )}

      {/* Cierres Popup Overlay */}
      {selectedClosure && (
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[90%] max-w-xs backdrop-blur-xl border rounded-2xl p-4 shadow-2xl popup-in ${dark ? 'bg-zinc-900/95 border-zinc-700' : 'bg-white/95 border-zinc-200'}`}>
          <button onClick={() => setSelectedClosure(null)} className={`absolute top-3 right-3 ${dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}><X size={16}/></button>
          <h3 className={`font-black text-xs sm:text-sm mb-1 ${dark ? 'text-white' : 'text-zinc-900'}`}>{t(selectedClosure.name)}</h3>
          <p className={`text-[10px] sm:text-xs mb-3 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>{t(selectedClosure.desc)}</p>
          <div className="space-y-1.5 text-[9px] font-bold uppercase tracking-widest">
            <div className="flex justify-between"><span className={dark ? 'text-zinc-500' : 'text-zinc-400'}>{t('map_start')}</span><span className={dark ? 'text-zinc-200' : 'text-zinc-700'}>{selectedClosure.date}</span></div>
            <div className="flex justify-between"><span className={dark ? 'text-zinc-500' : 'text-zinc-400'}>{t('map_schedule')}</span><span className={dark ? 'text-zinc-200' : 'text-zinc-700'}>{selectedClosure.time}</span></div>
            <div className="flex justify-between"><span className={dark ? 'text-zinc-500' : 'text-zinc-400'}>{t('map_detour')}</span><span className="text-[#2D8B3C] font-black">{t(selectedClosure.detour)}</span></div>
          </div>
        </div>
      )}

      {/* ── INTERACTIVE STATION POPUP / BOTTOM SHEET ── */}
      {selectedStation && (
        <StationPopup
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
          onShowDetail={onShowDetail}
          dark={dark}
        />
      )}
    </div>
  );
};

// ── NEWSCARD ─────────────────────────────────────────────────────────
const NewsCard = ({ n, saved, onSave, onShare, onShowDetail, dark }) => {
  const { t } = useI18n();
  return (
  <div
    className={`w-full max-w-full rounded-3xl overflow-hidden border shadow-sm flex flex-col cursor-pointer group transition-all duration-300 hover:-translate-y-0.5 ${
      dark ? 'bg-zinc-900 border-zinc-700 hover:border-zinc-600' : 'bg-white border-zinc-200 hover:border-zinc-300'
    }`}
    onClick={() => onShowDetail(n)}
  >
    {/* Imagen */}
    <div className="relative h-40 overflow-hidden flex-shrink-0">
      <img
        src={n.img}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        alt={n.title}
        onError={e => { e.target.parentElement.style.display = 'none'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      {n.localidad && (
        <div className="absolute bottom-3 left-3">
          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg backdrop-blur-sm border ${
            dark ? 'bg-zinc-900/70 border-zinc-700 text-zinc-300' : 'bg-white/80 border-white/60 text-zinc-700'
          }`}>📍 {n.localidad}</span>
        </div>
      )}
    </div>
    {/* Contenido */}
    <div className="flex flex-col flex-1 p-3.5 sm:p-4 justify-between min-w-0">
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
            n.urgency === 'Alta' ? 'bg-[#B30000] text-white' : 'bg-[#FFD600] text-zinc-900'
          }`}>{n.category}</span>
        </div>
        <h4 className={`font-black italic text-base leading-tight line-clamp-2 break-words ${
          dark ? 'text-white' : 'text-zinc-900'
        }`}>{t(n.titleKey, n.title || 'Título de la Noticia')}</h4>
        <p className={`text-xs font-medium leading-relaxed line-clamp-2 mt-1 break-words ${
          dark ? 'text-zinc-400' : 'text-zinc-600'
        }`}>{t(n.desc)}</p>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: dark ? '#27272a' : '#e4e4e7' }}>
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-black uppercase tracking-widest ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>{n.date}</span>
          {n.readMin && <span className={`text-[9px] font-bold ${dark ? 'text-zinc-600' : 'text-zinc-400'}`}>· {n.readMin} min</span>}
        </div>
        <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => onSave(n)}
            aria-label="Guardar noticia"
            className={`p-1.5 rounded-xl border shadow-sm active:scale-95 transition-all ${
              saved.some(s => (s.title || s.name) === (n.title || n.name))
                ? 'bg-[#B30000] border-[#B30000] text-white'
                : dark ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900'
            }`}
          ><Bookmark size={13} className={saved.some(s => (s.title || s.name) === (n.title || n.name)) ? 'fill-current' : ''} /></button>
          <button
            onClick={onShare}
            aria-label="Compartir noticia"
            className={`p-1.5 rounded-xl border shadow-sm active:scale-95 transition-transform ${
              dark ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900'
            }`}
          ><Share2 size={13} /></button>
        </div>
      </div>
    </div>
  </div>
  );
};

// ── JOBSSECTION ──────────────────────────────────────────────────────
const JobsSection = ({ dark, onSave, onShare, saved }) => {
  return (
    <div className="w-full max-w-full">
      <PortalEmpleoView dark={dark} embedded={true} />
    </div>
  );
};

const NoticiasTab = ({ saved, onSave, onShare, onShowDetail, scrollToJob, setScrollToJob, dark }) => {
  const { t } = useI18n();
  const jobRef = useRef(null);

  useEffect(() => {
    if (scrollToJob && jobRef.current) {
      jobRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setScrollToJob(false);
    }
  }, [scrollToJob, setScrollToJob]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── MÓDULO OFICIAL DE NOTICIAS CON FILTROS, BÚSQUEDA Y SKELETONS ── */}
      <NewsFeed 
        dark={dark} 
        onShowDetail={onShowDetail} 
        saved={saved} 
        onSave={onSave} 
        onShare={onShare} 
      />

      {/* ── PORTAL DE EMPLEO ── */}
      <div ref={jobRef} className="scroll-mt-28">
        <div className="flex items-center gap-3 mb-4 px-1">
          <div className="w-8 h-8 bg-[#2D8B3C] rounded-xl flex items-center justify-center flex-shrink-0">
            <Briefcase size={16} className="text-white" />
          </div>
          <div>
            <h3 className={`font-black text-lg leading-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>{t('talento_metro')}</h3>
            <p className={`text-[9px] font-black uppercase tracking-widest ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>{t('jobs_portal_official_sub')}</p>
          </div>
        </div>
        <JobsSection dark={dark} onSave={onSave} onShare={onShare} saved={saved} />
      </div>
    </div>
  );
};

const EstadoTab = ({ dark }) => {
  const { t, lang, setLang } = useI18n();

  const [selectedLoc, setSelectedLoc] = useState('Bosa');
  const AVANCE = INDICADORES_L1MB.avanceGeneral.ejecutado;
  const PROGRAMADO = INDICADORES_L1MB.avanceGeneral.programado;
  const SPI = INDICADORES_L1MB.avanceGeneral.spi;

  const FRENTES = [
    { name: 'Patio Taller', pct: INDICADORES_L1MB.patioTaller.avancePct, color: '#2D8B3C', icon: '🏭', detail: `${INDICADORES_L1MB.patioTaller.unidadesTerminadas} Unidades Terminadas` },
    { name: 'Viaducto Elevado', pct: INDICADORES_L1MB.viaducto.avancePct, color: '#B30000', icon: '🌉', detail: `${INDICADORES_L1MB.viaducto.vigasLanzadorasActivas} Vigas Lanzadoras en operación` },
    { name: 'Intercambiador Cll 72', pct: INDICADORES_L1MB.intercambiadorCalle72.avancePct, color: '#1565C0', icon: '🔄', detail: INDICADORES_L1MB.intercambiadorCalle72.estado },
    { name: 'Material Rodante & Vías', pct: 68, color: '#FFD600', icon: '🚆', detail: `${INDICADORES_L1MB.materialRodanteVias.viaEnPlacaInstaladaM} m de vía instalada` },
  ];
  const LOCALIDADES = {
    'Bosa': { pct: 88, desc: t("loc_desc_bosa"), img: '/Corredor central.jfif' },
    'Kennedy': { pct: 72, desc: t("loc_desc_kennedy"), img: '/Linea 1 del metro de bogora.png' },
    'Puente Aranda': { pct: 55, desc: t("loc_desc_puente"), img: '/caracas calle 13 y 19.jfif' },
    'Teusaquillo': { pct: 40, desc: t("loc_desc_teusaquillo"), img: '/caracas calle 19 y 22.jfif' },
    'Barrios Unidos': { pct: 93, desc: t("loc_desc_barrios"), img: '/caracas calle 69 y 72a.png' },
  };
  const loc = LOCALIDADES[selectedLoc];
  const circumference = 2 * Math.PI * 58;
  const dashOffset = circumference - (circumference * AVANCE / 100);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-full">
      <div className="px-2 mt-2">
        <h2 className={`text-2xl sm:text-3xl font-black italic tracking-tighter leading-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>{t('status_obra').split(' ')[0]} de<br /><span className="text-[#B30000]">{t('status_obra').split(' ').slice(1).join(' ')}</span></h2>
      </div>

      {/* Medidor circular de avance general oficial */}
      <div className={`w-full max-w-full rounded-[2rem] p-5 sm:p-6 shadow-sm border transition-colors ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="flex flex-col items-center">
          <svg width="160" height="160" viewBox="0 0 140 140" className="max-w-full">
            <circle cx="70" cy="70" r="58" fill="none" stroke={dark ? '#27272a' : '#e4e4e7'} strokeWidth="12" />
            <circle cx="70" cy="70" r="58" fill="none" stroke="#B30000" strokeWidth="12" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={dashOffset}
              transform="rotate(-90 70 70)" style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
          </svg>
          <div className="-mt-[108px] mb-[52px] text-center">
            <span className={`text-3xl sm:text-4xl font-black ${dark ? 'text-white' : 'text-zinc-900'}`}>{AVANCE}%</span>
            <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>Ejecutado L1MB</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-2 text-center">
            <div className={`p-2 rounded-xl ${dark ? 'bg-zinc-800/70' : 'bg-zinc-50'}`}>
              <span className={`text-[8px] font-black uppercase block ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>Programado</span>
              <span className={`text-sm font-black ${dark ? 'text-zinc-200' : 'text-zinc-800'}`}>{PROGRAMADO}%</span>
            </div>
            <div className={`p-2 rounded-xl ${dark ? 'bg-zinc-800/70' : 'bg-zinc-50'}`}>
              <span className={`text-[8px] font-black uppercase block ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>Desempeño SPI</span>
              <span className="text-sm font-black text-emerald-500">{SPI}%</span>
            </div>
          </div>

          <p className={`text-[9px] font-black uppercase tracking-widest text-center mt-3 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Corte Oficial Informe de Gestión EMB 2025-2026
          </p>
        </div>
      </div>

      {/* ── FRENTES ESPECÍFICOS DE TRABAJO (OFICIAL EMB L1MB) ── */}
      <IndicadoresAvanceL1MB dark={dark} showSummary={false} showFrentes={true} />

      {/* Selector por Localidades */}
      <div className={`w-full max-w-full rounded-[2rem] p-4 sm:p-6 shadow-sm border transition-colors ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <h3 className={`font-black italic text-base sm:text-lg mb-3 sm:mb-4 ${dark ? 'text-white' : 'text-zinc-900'}`}>{t('avance_localidad')}</h3>
        <div className="flex gap-2 overflow-x-auto no-scroll pb-3">
          {Object.keys(LOCALIDADES).map(name => (
            <button key={name} onClick={() => setSelectedLoc(name)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                selectedLoc === name ? 'bg-[#B30000] text-white shadow-md' : dark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-100 text-zinc-500 hover:text-zinc-900'
              }`}>{t('loc_' + name.toLowerCase().replace(' ', '_'))}</button>
          ))}
        </div>

        {/* Tarjeta de localidad seleccionada */}
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="relative h-40 sm:h-44 rounded-2xl overflow-hidden mb-4">
            <img src={loc.img} className="w-full h-full object-cover" alt={selectedLoc} onError={e => e.target.style.display = 'none'} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <span className="text-white font-black text-xs sm:text-sm uppercase tracking-widest">{t('loc_' + selectedLoc.toLowerCase().replace(' ', '_'))}</span>
              <span className="text-white font-black text-xl sm:text-2xl">{loc.pct}%</span>
            </div>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden shadow-inner mb-3 ${dark ? 'bg-zinc-700' : 'bg-zinc-200'}`}>
            <div className="h-full bg-gradient-to-r from-[#B30000] to-[#E53935] rounded-full transition-all duration-700" style={{ width: `${loc.pct}%` }} />
          </div>
          <p className={`text-xs sm:text-sm font-medium leading-relaxed break-words ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}>{loc.desc}</p>
        </div>
      </div>

      {/* Alertas de Cierres */}
      <div className={`w-full max-w-full rounded-[2rem] p-4 sm:p-6 shadow-sm border transition-colors ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <h3 className={`font-black italic text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2 ${dark ? 'text-white' : 'text-zinc-900'}`}><AlertTriangle size={20} className="text-[#FFD600] flex-shrink-0" /> {t('status_closures_active')}</h3>
        <ul className="space-y-3">
          <li className="flex gap-3 items-start"><AlertTriangle className="text-[#FFD600] flex-shrink-0 mt-0.5" size={16} /><span className={`text-xs sm:text-sm font-medium leading-relaxed break-words ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}><strong>{t('status_caracas')}</strong> {t('status_caracas_desc')}</span></li>
          <li className="flex gap-3 items-start"><AlertTriangle className="text-[#FFD600] flex-shrink-0 mt-0.5" size={16} /><span className={`text-xs sm:text-sm font-medium leading-relaxed break-words ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}><strong>{t('status_primero')}</strong> {t('status_primero_desc')}</span></li>
        </ul>
        <div className={`mt-4 p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm font-medium ${dark ? 'bg-red-950/30 border-red-800/30 text-red-300' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <p className={`flex items-center gap-2 mb-1 font-black uppercase tracking-widest text-[10px] ${dark ? 'text-red-400' : 'text-red-700'}`}><Bell size={14} /> {t('status_official_alert')}</p>
          <span className="break-words">{t('status_alert_text')}</span>
        </div>
      </div>

      {/* ── MÓDULO DE INCIDENCIAS VIALES CIUDADANAS Y CIERRES (SUPABASE) ── */}
      <RoadIncidentsModule dark={dark} />
    </div>
  )
};

const FORUM_CATEGORIES = [
  { key: 'transito', emoji: '🚦', labelKey: 'forum_cat_transito' },
  { key: 'cierres', emoji: '🚧', labelKey: 'forum_cat_cierres' },
  { key: 'economico', emoji: '💼', labelKey: 'forum_cat_economico' },
  { key: 'calidad', emoji: '🚴', labelKey: 'forum_cat_calidad' },
];

const ForoTab = ({ user, dark }) => {
  const { t } = useI18n();

  const makeInitialPosts = () => [
    {
      id: 1, user: 'Carlos M.', avatar: '👨🏽‍💼', time: '25 May 2026',
      text: t('forum_post1_text'),
      category: 'transito',
      reactions: { util: 24, afecta: 3, gusta: 41 },
      userReactions: {},
      comments: [{ id: 101, user: 'Laura P.', avatar: '👩🏻', text: t('forum_post1_comment1'), time: '26 May 2026' }],
      showComments: false,
    },
    {
      id: 2, user: 'Valentina R.', avatar: '👩🏽‍💻', time: '24 May 2026',
      text: t('forum_post2_text'),
      category: 'economico',
      reactions: { util: 58, afecta: 112, gusta: 9 },
      userReactions: {},
      comments: [
        { id: 102, user: 'Jorge A.', avatar: '👨🏾', text: t('forum_post2_comment1'), time: '24 May 2026' },
        { id: 103, user: 'María L.', avatar: '👩🏽', text: t('forum_post2_comment2'), time: '25 May 2026' },
      ],
      showComments: false,
    },
    {
      id: 3, user: 'Diego F.', avatar: '👨🏻‍🔧', time: '22 May 2026',
      text: t('forum_post3_text'),
      category: 'cierres',
      reactions: { util: 77, afecta: 5, gusta: 134 },
      userReactions: {},
      comments: [],
      showComments: false,
    },
  ];

  const [posts, setPosts] = useState(makeInitialPosts);
  const [text, setText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showPostModal, setShowPostModal] = useState(false);
  const [commentTexts, setCommentTexts] = useState({});
  const [categoryError, setCategoryError] = useState(false);

  const filteredPosts = filterCategory === 'all'
    ? posts
    : posts.filter(p => p.category === filterCategory);

  const toggleReaction = (postId, reaction) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const alreadyReacted = p.userReactions[reaction];
      return {
        ...p,
        reactions: {
          ...p.reactions,
          [reaction]: alreadyReacted ? p.reactions[reaction] - 1 : p.reactions[reaction] + 1,
        },
        userReactions: { ...p.userReactions, [reaction]: !alreadyReacted },
      };
    }));
  };

  const toggleComments = (postId) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, showComments: !p.showComments } : p));
  };

  const addComment = (postId) => {
    const txt = commentTexts[postId] || '';
    if (!txt.trim()) return;
    const date = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: [...p.comments, { id: Date.now(), user: user?.name || 'Ciudadano', avatar: user?.avatar || '👤', text: txt, time: date }],
        showComments: true,
      };
    }));
    setCommentTexts(prev => ({ ...prev, [postId]: '' }));
  };

  const submitPost = () => {
    if (!text.trim()) return;
    if (!selectedCategory) { setCategoryError(true); return; }
    setCategoryError(false);
    const date = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
    const newPost = {
      id: Date.now(),
      user: user?.name || 'Ciudadano',
      avatar: user?.avatar || '👤',
      time: date,
      text,
      category: selectedCategory,
      reactions: { util: 0, afecta: 0, gusta: 0 },
      userReactions: {},
      comments: [],
      showComments: false,
    };
    setPosts(prev => [newPost, ...prev]);
    setText('');
    setSelectedCategory('');
    setShowPostModal(false);
  };

  const selClass = `w-full border p-4 rounded-2xl focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/20 text-sm font-semibold appearance-none transition-all ${dark ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-zinc-100 text-zinc-900 border-zinc-300'}`;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-full">
      {/* Header */}
      <div className="px-2 mt-2 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
        <div>
          <h2 className={`text-2xl sm:text-3xl font-black italic tracking-tighter leading-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>{t('foro_comunitario').split(' ')[0]}<br /><span className="text-[#B30000]">{t('foro_comunitario').split(' ').slice(1).join(' ')}</span></h2>
          <p className={`text-xs font-medium mt-1 break-words ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{t('forum_desc')}</p>
        </div>
        <button
          onClick={() => setShowPostModal(true)}
          className="flex-shrink-0 bg-[#B30000] text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform shadow-md flex items-center gap-1.5"
        >
          ✏️ {t('forum_post_btn')}
        </button>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto no-scroll pb-1 px-1">
        <button
          onClick={() => setFilterCategory('all')}
          className={`flex-shrink-0 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${filterCategory === 'all' ? 'bg-[#B30000] text-white border-[#B30000]' : dark ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white' : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900'}`}
        >
          {t('forum_filter_all')}
        </button>
        {FORUM_CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setFilterCategory(cat.key)}
            className={`flex-shrink-0 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${filterCategory === cat.key ? 'bg-[#B30000] text-white border-[#B30000]' : dark ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white' : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900'}`}
          >
            {cat.emoji} {t(cat.labelKey).split(' ').slice(1).join(' ')}
          </button>
        ))}
      </div>

      {/* Posts list */}
      <div className="space-y-4 sm:space-y-5 w-full max-w-full">
        {filteredPosts.length === 0 && (
          <div className={`rounded-[2rem] p-8 sm:p-10 text-center border ${dark ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-white border-zinc-200 text-zinc-400'}`}>
            <p className="text-3xl mb-2">💬</p>
            <p className="font-black text-sm">{t('forum_no_posts')}</p>
          </div>
        )}
        {filteredPosts.map(p => {
          const catInfo = FORUM_CATEGORIES.find(c => c.key === p.category);
          return (
            <div key={p.id} className={`w-full max-w-full rounded-[2rem] shadow-sm border transition-colors overflow-hidden ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
              <div className="p-4 sm:p-5">
                {/* Post header */}
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full flex-shrink-0 border-2 border-[#B30000]/40 shadow-sm overflow-hidden ${dark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                    <RenderUserAvatar avatar={p.avatar} size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-black text-xs sm:text-sm leading-tight truncate ${dark ? 'text-white' : 'text-zinc-900'}`}>{p.user}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>{p.time}</p>
                  </div>
                  {catInfo && (
                    <span className={`flex-shrink-0 text-[8px] font-black uppercase tracking-widest px-2 sm:px-2.5 py-1 rounded-xl border ${dark ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-500'}`}>
                      {catInfo.emoji} {t(catInfo.labelKey).split(' ').slice(1, 3).join(' ')}
                    </span>
                  )}
                </div>

                {/* Post text */}
                <p className={`text-xs sm:text-sm font-medium leading-relaxed mb-4 break-words ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}>{p.text}</p>

                {/* Reaction buttons */}
                <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2 pt-3 border-t ${dark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                  {[
                    { key: 'util', emoji: '👍', labelKey: 'forum_reaction_util' },
                    { key: 'afecta', emoji: '😤', labelKey: 'forum_reaction_afecta' },
                    { key: 'gusta', emoji: '❤️', labelKey: 'forum_reaction_gusta' },
                  ].map(r => (
                    <button
                      key={r.key}
                      onClick={() => toggleReaction(p.id, r.key)}
                      className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 border ${p.userReactions[r.key] ? 'bg-[#B30000] text-white border-[#B30000] shadow-md' : dark ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-zinc-900'}`}
                    >
                      <span>{r.emoji}</span>
                      <span>{p.reactions[r.key]}</span>
                      <span className="hidden sm:inline">{t(r.labelKey)}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => toggleComments(p.id)}
                    className={`ml-auto flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all border ${dark ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-zinc-900'}`}
                  >
                    💬 {p.comments.length} <span className="hidden sm:inline">{t('forum_comments')}</span>
                  </button>
                </div>
              </div>

              {/* Comments section */}
              {p.showComments && (
                <div className={`border-t px-4 sm:px-5 pb-4 sm:pb-5 pt-3 sm:pt-4 space-y-3 ${dark ? 'border-zinc-800 bg-zinc-800/30' : 'border-zinc-100 bg-zinc-50/50'}`}>
                  {p.comments.map(c => (
                    <div key={c.id} className="flex gap-2 sm:gap-3 items-start">
                      <span className={`text-base sm:text-lg w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full flex-shrink-0 ${dark ? 'bg-zinc-700' : 'bg-white border border-zinc-200'}`}>{c.avatar}</span>
                      <div className={`flex-1 min-w-0 p-2.5 sm:p-3 rounded-xl text-xs ${dark ? 'bg-zinc-800 text-zinc-300' : 'bg-white border border-zinc-200 text-zinc-700'}`}>
                        <p className="font-black mb-0.5">{c.user} <span className={`font-medium ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>· {c.time}</span></p>
                        <p className="font-medium leading-relaxed break-words">{c.text}</p>
                      </div>
                    </div>
                  ))}
                  {/* Add comment */}
                  <div className="flex gap-2 mt-3">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full flex-shrink-0 overflow-hidden ${dark ? 'bg-zinc-700' : 'bg-white border border-zinc-200'}`}>
                      <RenderUserAvatar avatar={user?.avatar} size={22} />
                    </div>
                    <input
                      value={commentTexts[p.id] || ''}
                      onChange={e => setCommentTexts(prev => ({ ...prev, [p.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && addComment(p.id)}
                      placeholder={t('forum_add_comment')}
                      className={`flex-1 min-w-0 border rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-medium focus:outline-none focus:border-[#B30000] transition-all ${dark ? 'bg-zinc-800 text-white border-zinc-700 placeholder-zinc-500' : 'bg-white text-zinc-900 border-zinc-200 placeholder-zinc-400'}`}
                    />
                    <button
                      onClick={() => addComment(p.id)}
                      className="bg-[#B30000] text-white px-3 py-2 rounded-xl text-xs font-black active:scale-95 transition-transform flex-shrink-0"
                    >
                      {t('forum_reply')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* New Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-[300] bg-zinc-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-4 pb-24 sm:pb-6">
          <div className={`w-full max-w-lg rounded-[2rem] p-5 sm:p-6 shadow-2xl border popup-in max-h-[85vh] overflow-y-auto mb-2 ${dark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200'}`}>
            <div className="flex justify-between items-center mb-5">
              <h3 className={`font-black text-lg sm:text-xl italic ${dark ? 'text-white' : 'text-zinc-900'}`}>{t('forum_new_post_title')}</h3>
              <button onClick={() => { setShowPostModal(false); setCategoryError(false); }} className={`w-8 h-8 flex items-center justify-center rounded-full ${dark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'}`}>✕</button>
            </div>

            <div className="space-y-4">
              {/* Category selector */}
              <div>
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{t('forum_select_category')} *</label>
                <select
                  value={selectedCategory}
                  onChange={e => { setSelectedCategory(e.target.value); setCategoryError(false); }}
                  className={`${selClass} ${categoryError ? 'border-red-500 ring-2 ring-red-500/20' : ''}`}
                >
                  <option value="">{t('forum_select_category')}</option>
                  {FORUM_CATEGORIES.map(cat => (
                    <option key={cat.key} value={cat.key}>{t(cat.labelKey)}</option>
                  ))}
                </select>
                {categoryError && <p className="text-red-500 text-[10px] font-bold mt-1">⚠️ {t('forum_select_category_err')}</p>}
              </div>

              {/* Post text */}
              <div>
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{t('forum_post_text')}</label>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder={t('forum_placeholder')}
                  className={`w-full border focus:outline-none p-4 rounded-2xl focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/20 text-sm font-medium resize-none transition-all ${dark ? 'bg-zinc-800 text-white border-zinc-700 placeholder-zinc-500' : 'bg-zinc-100 text-zinc-900 border-zinc-300 placeholder-zinc-500'}`}
                  rows={4}
                />
              </div>

              <button
                onClick={submitPost}
                disabled={!text.trim()}
                className="w-full bg-[#B30000] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-transform shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('publicar')} 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
};

const PerfilTab = ({ user, setUser, dark, toggleDark, saved, onShowDetail, onSave, onShare, onLogout, onNavigate, onReportIncident }) => {
  const { t, lang, setLang } = useI18n();
  const { userProfile, updateProfile, updateFavorites } = useAuth();

  const [editName, setEditName] = useState(user?.name || userProfile?.name || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || userProfile?.avatar || '👤');
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(null);
  const avatars = ['👤', '👨🏽‍💻', '👩🏻‍🔧', '🚆', '🚌', '🦺', '👷🏽', '🚲'];

  const estacionesLinea1 = [
    'Patio Taller Bosa', 'Av. Villavicencio', 'Av. Primero de Mayo',
    'Av. Boyacá', 'Américas', 'Av. Las Américas', 'Calle 1 / Caracas',
    'Calle 10 / Caracas', 'Av. Jiménez', 'Calle 26', 'Calle 39',
    'Calle 45', 'Calle 53', 'Calle 63', 'Calle 72'
  ];

  const currentFavorites = user?.estaciones_favoritas || userProfile?.estaciones_favoritas || ['Portal Américas', 'Calle 72', 'Av. Primero de Mayo'];

  const handleSave = async () => {
    setSaving(true);
    setSaveFeedback(null);
    const updated = { ...user, name: editName, avatar: editAvatar };
    setUser(updated);
    localStorage.setItem('urbango_user', JSON.stringify(updated));
    localStorage.setItem('urbanGoUser', JSON.stringify(updated));
    if (!user?.isGuest && updateProfile) {
      try {
        await updateProfile({ name: editName, avatar: editAvatar });
        setSaveFeedback({ type: 'success', msg: "¡Perfil sincronizado en Supabase ('profiles') con éxito!" });
      } catch (e) {
        console.warn(e);
        setSaveFeedback({ type: 'error', msg: "Error al sincronizar perfil en la nube." });
      }
    } else {
      setSaveFeedback({ type: 'success', msg: "¡Perfil de ciudadano actualizado con éxito (Modo Invitado)!" });
    }
    setSaving(false);
    setTimeout(() => setSaveFeedback(null), 4000);
  };

  const handleToggleStation = async (station) => {
    let newFavs;
    if (currentFavorites.includes(station)) {
      newFavs = currentFavorites.filter(s => s !== station);
    } else {
      newFavs = [...currentFavorites, station];
    }
    const updated = { ...user, estaciones_favoritas: newFavs };
    setUser(updated);
    localStorage.setItem('urbango_user', JSON.stringify(updated));
    localStorage.setItem('urbanGoUser', JSON.stringify(updated));
    if (!user?.isGuest && updateFavorites) {
      try {
        await updateFavorites(newFavs);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-2 mt-2">
        <h2 className={`text-3xl font-black italic tracking-tighter leading-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>{t('profile_title_1')}<br /><span className="text-[#B30000]">{t('profile_title_2')}</span></h2>
      </div>

      {/* Sincronización Supabase Cloud / Modo Invitado Indicator */}
      {user?.isGuest ? (
        <div className={`rounded-2xl p-4 border flex items-center justify-between ${
          dark ? 'bg-zinc-900/90 border-amber-900/50' : 'bg-amber-50/80 border-amber-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <div>
              <p className={`text-xs font-black uppercase tracking-wider ${dark ? 'text-amber-400' : 'text-amber-800'}`}>Modo Invitado / Ciudadano</p>
              <p className={`text-[10px] font-medium ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>Acceso completo a la plataforma sin necesidad de registrarte.</p>
            </div>
          </div>
          <span className="text-xl">🚀</span>
        </div>
      ) : (
        <div className={`rounded-2xl p-4 border flex items-center justify-between ${
          dark ? 'bg-zinc-900/90 border-emerald-900/50' : 'bg-emerald-50/70 border-emerald-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <p className={`text-xs font-black uppercase tracking-wider ${dark ? 'text-emerald-400' : 'text-emerald-800'}`}>Supabase Cloud Sync Activo</p>
              <p className={`text-[10px] font-medium ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>Persistencia en tiempo real en la tabla <code className="font-mono font-bold">profiles</code></p>
            </div>
          </div>
          <span className="text-xl">⚡</span>
        </div>
      )}

      {/* Accesos Rápidos de Servicios Ciudadanos & Saldo Persistente */}
      <div className={`rounded-[2rem] p-6 shadow-sm border transition-colors ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-black text-lg ${dark ? 'text-white' : 'text-zinc-900'}`}>Servicios y Trámites</h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            dark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
          }`}>
            Saldo: ${(userProfile?.saldo ?? user?.saldo ?? 24500).toLocaleString('es-CO')} COP
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate?.('saldo')}
            className={`p-4 rounded-2xl border flex items-center gap-3 text-left transition-all active:scale-98 ${dark ? 'bg-zinc-800 border-zinc-700 hover:border-[#B30000]/60 text-white' : 'bg-zinc-50 border-zinc-200 hover:border-[#B30000]/40 text-zinc-900'}`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#B30000] text-white flex items-center justify-center text-lg flex-shrink-0 shadow-md">💳</div>
            <div>
              <p className="font-black text-xs">Saldo y Recarga Tullave</p>
              <p className={`text-[10px] ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>Sincronizado en Supabase</p>
            </div>
          </button>

          <button
            onClick={() => onReportIncident?.()}
            className={`p-4 rounded-2xl border flex items-center gap-3 text-left transition-all active:scale-98 ${dark ? 'bg-zinc-800 border-zinc-700 hover:border-amber-500/60 text-white' : 'bg-zinc-50 border-zinc-200 hover:border-amber-500/40 text-zinc-900'}`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg flex-shrink-0 shadow-md">⚠️</div>
            <div>
              <p className="font-black text-xs">Reportar Incidencia</p>
              <p className={`text-[10px] ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>Cierres, desvíos y obras</p>
            </div>
          </button>
        </div>
      </div>

      {/* Estaciones Favoritas Persistentes en Supabase */}
      <div className={`rounded-[2rem] p-6 shadow-sm border transition-colors ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`font-black text-lg flex items-center gap-2 ${dark ? 'text-white' : 'text-zinc-900'}`}>
            <span>📍</span> Estaciones Favoritas
          </h3>
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Supabase Sync</span>
        </div>
        <p className={`text-xs mb-4 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          Selecciona tus estaciones habituales de la Línea 1 para recibir avisos prioritarios de llegada:
        </p>
        <div className="flex flex-wrap gap-2">
          {estacionesLinea1.map(station => {
            const isFav = currentFavorites.includes(station);
            return (
              <button
                key={station}
                onClick={() => handleToggleStation(station)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                  isFav
                    ? 'bg-[#B30000] text-white border-[#B30000] shadow-sm'
                    : dark
                    ? 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                    : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:text-zinc-900'
                }`}
              >
                {isFav ? '★ ' : '+ '} {station}
              </button>
            );
          })}
        </div>
      </div>

      <div className={`rounded-[2rem] p-6 shadow-sm border transition-colors ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <h3 className={`font-black text-lg mb-4 ${dark ? 'text-white' : 'text-zinc-900'}`}>{t('editar_perfil')}</h3>
        
        {/* Selector de Avatares Animados (Mascota Oso de Anteojos, Maquinista L1, Pasajero, Ingeniera) */}
        <div className="mb-6">
          <ProfileAvatarSelector 
            currentAvatar={editAvatar} 
            onSelectAvatar={setEditAvatar} 
            dark={dark} 
          />
        </div>
        <div className="mb-6">
          <label className={`block text-[10px] font-black uppercase mb-1 ml-1 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>Nombre de usuario</label>
          <input value={editName} onChange={e => setEditName(e.target.value)}
            className={`w-full border rounded-xl px-4 py-4 font-bold focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/20 transition-all shadow-inner ${dark ? 'bg-zinc-800 text-white border-zinc-700 placeholder-zinc-500' : 'bg-zinc-100 text-zinc-900 border-zinc-300 placeholder-zinc-500'}`} />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#B30000] text-white font-black text-sm uppercase tracking-widest py-4 rounded-xl shadow-lg active:scale-95 transition-transform disabled:opacity-50"
        >
          {saving ? 'Sincronizando con Supabase...' : t('guardar_cambios')}
        </button>

        {saveFeedback && (
          <div className={`mt-3 p-3 rounded-xl border text-xs font-bold text-center animate-in fade-in duration-200 ${
            saveFeedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
              : 'bg-red-500/10 border-red-500/30 text-red-500'
          }`}>
            {saveFeedback.msg}
          </div>
        )}
      </div>

      {/* ── THEME TOGGLE ── */}
      <div className={`rounded-[2rem] p-6 shadow-sm border transition-colors ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <h3 className={`font-black text-lg mb-5 ${dark ? 'text-white' : 'text-zinc-900'}`}>{t('apariencia')}</h3>
        <button onClick={toggleDark} className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <div className={`flex items-center gap-3 font-black text-sm ${dark ? 'text-white' : 'text-zinc-900'}`}>
            {dark
              ? <Sun size={22} color="#FFD600" />
              : <Moon size={22} color="#B30000" />
            }
            {dark ? t('sidebar_modo_claro') : t('sidebar_modo_oscuro')}
          </div>
          <div className={`w-12 h-6 rounded-full relative transition-all shadow-inner border ${dark ? 'bg-[#B30000] border-[#B30000]' : 'bg-zinc-200 border-zinc-300'}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${dark ? 'left-6' : 'left-0.5'}`} />
          </div>
        </button>
        <p className={`text-[10px] font-bold uppercase tracking-widest mt-3 ml-2 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
          Actualmente: {dark ? 'Modo Oscuro' : 'Modo Claro'}
        </p>
      </div>

      <div className={`rounded-[2rem] p-6 shadow-sm border transition-colors ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <h3 className={`font-black text-lg mb-5 flex items-center gap-2 ${dark ? 'text-white' : 'text-zinc-900'}`}><Bookmark size={20} className="text-[#B30000]" /> {t("global_saved_items")}</h3>
        {saved.length === 0 ? (
          <p className={`font-medium text-sm text-center py-4 rounded-xl border ${dark ? 'text-zinc-500 bg-zinc-800 border-zinc-700' : 'text-zinc-500 bg-zinc-50 border-zinc-200'}`}>{t("global_no_saved")}</p>
        ) : (
          <div className="space-y-4">
            {saved.map((item, i) => (
              <div key={i} className={`flex flex-col p-4 rounded-2xl border shadow-sm gap-4 ${dark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => onShowDetail(item)}>
                  {item.img && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                      <img src={item.img} className="w-full h-full object-cover" alt={t(item.title || item.name, item.title || item.name)} />
                    </div>
                  )}
                  <div className="flex-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#B30000]">{item.type || item.status || 'Elemento'}</span>
                    <h4 className={`font-black italic text-sm line-clamp-2 mt-1 leading-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>{t(item.title || item.name, item.title || item.name)}</h4>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onShowDetail(item)} className={`flex-1 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest hover:bg-[#B30000] hover:text-white hover:border-[#B30000] transition-all active:scale-95 shadow-sm ${dark ? 'bg-zinc-700 text-zinc-200 border-zinc-600' : 'bg-zinc-100 text-zinc-900 border-zinc-200'}`}>Ver Detalle</button>
                  <button onClick={() => onSave(item)} className="p-2.5 bg-[#B30000] text-white rounded-xl active:scale-95 transition-all shadow-sm"><Bookmark size={18} className="fill-current" /></button>
                  <button onClick={onShare} className={`p-2.5 rounded-xl border active:scale-95 transition-all shadow-sm ${dark ? 'bg-zinc-700 text-zinc-300 border-zinc-600 hover:text-white' : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:text-zinc-900'}`}><Share2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={onLogout} className={`w-full font-black text-sm uppercase tracking-widest py-4 rounded-2xl border active:scale-95 transition-transform hover:text-[#B30000] shadow-sm mb-20 md:mb-4 ${dark ? 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-[#B30000]/50' : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:border-[#B30000]/50'}`}>
        Cerrar Sesión
      </button>
    </div>
  )
};

// ── COMPONENTES COMPARTIDOS Y WIDGETS ──────────────────────────────────────

const NavBtn = ({ icon, label, active, onClick, dark }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 px-2 py-2 rounded-xl transition-all duration-300 ${active ? 'bg-red-600 text-white shadow-md -translate-y-1 scale-105 font-semibold' : dark ? 'text-zinc-400 hover:text-[#E53935] hover:bg-zinc-800' : 'text-zinc-900 font-semibold hover:bg-zinc-100'}`}>
    {icon}
    <span className="text-[8px] font-black uppercase tracking-tight leading-none mt-0.5">{label}</span>
  </button>
);

// Renderiza texto con soporte de **bold**, viñetas y Botones Interactivos de Acción
const getActionCardMeta = (actionId, label, dark) => {
  const cleanId = (actionId || '').replace(/^#/, '');

  if (cleanId === 'news_1' || cleanId === 'open_news_1') {
    return {
      icon: <Newspaper size={18} className="text-blue-500 shrink-0" />,
      badge: 'Noticia Oficial EMB · 82.33%',
      title: 'Avance Físico del 82.33% en la Línea 1',
      desc: 'Obras en Viaducto y Patio Taller avanzan según el cronograma.',
      btnText: label || 'Ver Noticia Completa',
      theme: dark 
        ? 'bg-blue-950/40 border-blue-600/40 hover:border-blue-500 hover:bg-blue-900/40 text-blue-200' 
        : 'bg-blue-50/90 border-blue-200 hover:border-blue-400 hover:bg-blue-100/70 text-blue-900',
      badgeClass: dark ? 'bg-blue-900/60 text-blue-300' : 'bg-blue-100 text-blue-800'
    };
  }

  if (cleanId === 'news_2' || cleanId === 'open_news_2') {
    return {
      icon: <Construction size={18} className="text-amber-500 shrink-0" />,
      badge: 'Hito de Obra · Caracas con Cll 72',
      title: 'Avances en el frente de obra Calle 72',
      desc: 'Finaliza adecuación del intercambiador vial subterráneo.',
      btnText: label || 'Ver Noticia Completa',
      theme: dark 
        ? 'bg-amber-950/40 border-amber-600/40 hover:border-amber-500 hover:bg-amber-900/40 text-amber-200' 
        : 'bg-amber-50/90 border-amber-200 hover:border-amber-400 hover:bg-amber-100/70 text-amber-900',
      badgeClass: dark ? 'bg-amber-900/60 text-amber-300' : 'bg-amber-100 text-amber-800'
    };
  }

  if (cleanId === 'job_1' || cleanId === 'apply_job_1') {
    return {
      icon: <Briefcase size={18} className="text-emerald-500 shrink-0" />,
      badge: 'Vacante EMB · Bosa / Kennedy',
      title: 'Auxiliares de Construcción',
      desc: 'Requisitos: 6 meses de experiencia en obras civiles.',
      btnText: label || 'Postularme a esta vacante',
      theme: dark 
        ? 'bg-emerald-950/40 border-emerald-600/40 hover:border-emerald-500 hover:bg-emerald-900/40 text-emerald-200' 
        : 'bg-emerald-50/90 border-emerald-300 hover:border-emerald-400 hover:bg-emerald-100/70 text-emerald-950',
      badgeClass: dark ? 'bg-emerald-900/60 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
    };
  }

  if (cleanId === 'job_2' || cleanId === 'apply_job_2') {
    return {
      icon: <Briefcase size={18} className="text-emerald-500 shrink-0" />,
      badge: 'Vacante EMB · Tramo Caracas',
      title: 'Ingenieros Civiles / Inspectores SST',
      desc: 'Requisitos: Tarjeta profesional vigente.',
      btnText: label || 'Postularme a esta vacante',
      theme: dark 
        ? 'bg-emerald-950/40 border-emerald-600/40 hover:border-emerald-500 hover:bg-emerald-900/40 text-emerald-200' 
        : 'bg-emerald-50/90 border-emerald-300 hover:border-emerald-400 hover:bg-emerald-100/70 text-emerald-950',
      badgeClass: dark ? 'bg-emerald-900/60 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
    };
  }

  if (cleanId === 'open_portal_empleo') {
    return {
      icon: <Briefcase size={18} className="text-[#2D8B3C] shrink-0" />,
      badge: '180 Vacantes Activas',
      title: 'Portal de Empleo Distrital',
      desc: 'Convocatorias públicas y transparentes de Bogotá Trabaja.',
      btnText: label || 'Abrir Portal de Empleo',
      theme: dark 
        ? 'bg-zinc-900 border-zinc-700 hover:border-[#2D8B3C] text-zinc-200' 
        : 'bg-white border-zinc-200 hover:border-[#2D8B3C] text-zinc-900',
      badgeClass: 'bg-[#2D8B3C]/10 text-[#2D8B3C]'
    };
  }

  if (cleanId === 'action_recharge' || cleanId === 'nav_saldo') {
    return {
      icon: <CreditCard size={18} className="text-red-500 shrink-0" />,
      badge: 'TuTarjetaMetro',
      title: 'Saldo y Recarga Tullave',
      desc: 'Consulta tu saldo y recarga de forma segura vía PSE, Nequi o Daviplata.',
      btnText: label || 'Recargar TuTarjetaMetro',
      theme: dark 
        ? 'bg-red-950/40 border-red-600/40 hover:border-red-500 text-red-200' 
        : 'bg-red-50/90 border-red-200 hover:border-red-400 text-red-950',
      badgeClass: dark ? 'bg-red-900/60 text-red-300' : 'bg-red-100 text-red-800'
    };
  }

  if (cleanId === 'action_map' || cleanId === 'nav_mapa') {
    return {
      icon: <MapIcon size={18} className="text-orange-500 shrink-0" />,
      badge: 'Navegación L1',
      title: 'Mapa Interactivo de Estaciones',
      desc: 'Explora las 16 estaciones, viaducto y trazado en tiempo real.',
      btnText: label || 'Abrir Mapa Interactivo',
      theme: dark 
        ? 'bg-orange-950/40 border-orange-600/40 hover:border-orange-500 text-orange-200' 
        : 'bg-orange-50/90 border-orange-200 hover:border-orange-400 text-orange-950',
      badgeClass: dark ? 'bg-orange-900/60 text-orange-300' : 'bg-orange-100 text-orange-800'
    };
  }

  if (cleanId === 'action_status' || cleanId === 'nav_estado') {
    return {
      icon: <BarChart3 size={18} className="text-yellow-500 shrink-0" />,
      badge: 'Avance Consolidado',
      title: 'Estado de Obra (82.33%)',
      desc: 'Revisa frentes de viaducto, Patio Taller de Bosa y Calle 72.',
      btnText: label || 'Ver Estado de Obra',
      theme: dark 
        ? 'bg-yellow-950/40 border-yellow-600/40 hover:border-yellow-500 text-yellow-200' 
        : 'bg-yellow-50/90 border-yellow-200 hover:border-yellow-400 text-yellow-950',
      badgeClass: dark ? 'bg-yellow-900/60 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
    };
  }

  if (cleanId === 'action_profile' || cleanId === 'nav_perfil') {
    return {
      icon: <User size={18} className="text-purple-500 shrink-0" />,
      badge: 'Perfil Ciudadano',
      title: 'Tu Perfil en UrbanGo',
      desc: 'Estaciones preferidas, foto de perfil y ajustes de accesibilidad.',
      btnText: label || 'Ir a Mi Perfil',
      theme: dark 
        ? 'bg-purple-950/40 border-purple-600/40 hover:border-purple-500 text-purple-200' 
        : 'bg-purple-50/90 border-purple-200 hover:border-purple-400 text-purple-950',
      badgeClass: dark ? 'bg-purple-900/60 text-purple-300' : 'bg-purple-100 text-purple-800'
    };
  }

  if (cleanId === 'action_report' || cleanId === 'report_incident') {
    return {
      icon: <AlertTriangle size={18} className="text-red-500 shrink-0" />,
      badge: 'Movilidad en Tiempo Real',
      title: 'Reportar Incidencia Vial',
      desc: 'Notifica cierres viales, accidentes o desvíos en tiempo real.',
      btnText: label || 'Reportar Incidencia Vial',
      theme: dark 
        ? 'bg-red-950/40 border-red-600/40 hover:border-red-500 text-red-200' 
        : 'bg-red-50/90 border-red-200 hover:border-red-400 text-red-950',
      badgeClass: dark ? 'bg-red-900/60 text-red-300' : 'bg-red-100 text-red-800'
    };
  }

  // Fallback genérico para acciones interactivas
  return {
    icon: <ArrowRight size={16} className="text-[#B30000] shrink-0" />,
    badge: 'Acción Rápida',
    title: label || 'Abrir Sección',
    desc: 'Acceso directo desde MetroBot IA.',
    btnText: label || 'Continuar',
    theme: dark 
      ? 'bg-zinc-800 border-zinc-700 hover:border-[#B30000] text-zinc-200' 
      : 'bg-white border-zinc-200 hover:border-[#B30000] text-zinc-900',
    badgeClass: 'bg-[#B30000]/10 text-[#B30000]'
  };
};

const RenderBotText = ({ text, dark, onAction, onAsk }) => {
  // Separar el cuerpo principal del bloque obligatorio [SUGERENCIAS]
  const parts = (text || '').split('[SUGERENCIAS]');
  const mainContent = parts[0] || '';
  const suggestionsContent = parts.length > 1 ? parts[1] : null;

  const lines = mainContent.split('\n');
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;

        // Verificar si la línea contiene un botón de acción interactivo Markdown: [LABEL](#ACTION_ID)
        const actionMatch = line.match(/\[(.*?)\]\((#.*?)\)/);
        if (actionMatch) {
          const label = actionMatch[1];
          const target = actionMatch[2];
          const meta = getActionCardMeta(target, label, dark);

          return (
            <div key={i} className="my-2.5">
              <button
                type="button"
                onClick={() => onAction && onAction(target, label)}
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
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl bg-[#B30000] hover:bg-[#C8102E] text-white flex items-center gap-1.5 shadow-sm transition-colors">
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
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#B30000] flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: rendered.replace(/^- /, '') }} />
            </div>
          );
        }

        return <p key={i} dangerouslySetInnerHTML={{ __html: rendered }} />;
      })}

      {/* Bloque interactivo formateado de [SUGERENCIAS] */}
      {suggestionsContent && (
        <div className="mt-3.5 pt-3 border-t border-dashed border-zinc-200 dark:border-zinc-800">
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
                        onAction('#action_map', itemClean);
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
                      <span className="text-[#B30000] font-black text-xs">•</span>
                      <span>{itemClean.replace(/\[(.*?)\]\(#.*?\)/, '$1')}</span>
                    </span>
                    <ArrowRight size={13} className="shrink-0 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200" />
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

// MetroBot IA Componente Oficial
const ChatModal = MetroBot;

const BubblesHero = ({ onNavigate, dark }) => {
  const { t, lang, setLang } = useI18n();

  const [hoveredColor, setHoveredColor] = useState(null);

  const nodes = [
    { tab: 'mapa',     icon: <MapIcon size={18} />,       label: t('nav.map', t('sidebar_mapa')), color: 'bg-[#ea580c] text-white', glow: '#ea580c', pos: 'top-[calc(50%-115px)] left-[50%] -translate-x-1/2 -translate-y-1/2' },
    { 
      tab: 'saldo',   
      icon: <CreditCard size={18} className="text-zinc-950" strokeWidth={2.4} />,  
      label: t('nav.cardBalance', 'Saldo de Tarjeta'),   
      color: 'bg-yellow-400 text-zinc-950 border-white dark:border-zinc-800 shadow-lg shadow-yellow-500/25', 
      glow: '#EAB308', 
      pos: 'top-[calc(50%-36px)] left-[calc(50%+107px)] -translate-x-1/2 -translate-y-1/2' 
    },
    { tab: 'noticias', icon: <Newspaper size={18} />,     label: t('nav.news', t('bubble_noticias')),         color: 'bg-[#1565C0] text-white', glow: '#1565C0', pos: 'top-[calc(50%+95px)] left-[calc(50%+66px)] -translate-x-1/2 -translate-y-1/2' },
    { tab: 'empleo',   icon: <Briefcase size={18} />,     label: t('nav.jobs', t('bubble_empleo')),           color: 'bg-[#2D8B3C] text-white', glow: '#2D8B3C', pos: 'top-[calc(50%+95px)] left-[calc(50%-66px)] -translate-x-1/2 -translate-y-1/2' },
    { tab: 'foro',     icon: <MessageSquare size={18} />, label: t('nav.forum', t('bubble_foro')),             color: 'bg-[#6B21A8] text-white', glow: '#6B21A8', pos: 'top-[calc(50%-36px)] left-[calc(50%-107px)] -translate-x-1/2 -translate-y-1/2' },
  ];

  return (
    <div className={`relative h-[380px] w-full rounded-[2rem] shadow-2xl border overflow-hidden flex items-center justify-center transition-all duration-500 ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
      <div className="absolute inset-0 opacity-15 dark:opacity-5" style={{ backgroundImage: 'radial-gradient(#B30000 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />

      <div
        className="absolute inset-0 transition-opacity duration-700 pointer-events-none mix-blend-screen"
        style={{
          background: hoveredColor
            ? `radial-gradient(circle, ${hoveredColor}40 0%, transparent 60%)`
            : dark
              ? 'radial-gradient(circle, rgba(179,0,0,0.1) 0%, transparent 65%)'
              : 'radial-gradient(circle, rgba(179,0,0,0.04) 0%, transparent 65%)',
          opacity: hoveredColor ? 1 : 0.6
        }}
      />

      <div className={`absolute w-44 h-44 border border-dashed rounded-full animate-[spin_30s_linear_infinite] pointer-events-none ${dark ? 'border-zinc-800' : 'border-zinc-300/60'}`} />
      <div className={`absolute w-64 h-64 border-2 border-dashed rounded-full animate-[spin_45s_linear_infinite_reverse] pointer-events-none ${dark ? 'border-zinc-800/80' : 'border-zinc-300'}`} />
      <div className={`absolute w-80 h-80 border-2 border-dotted rounded-full animate-[spin_70s_linear_infinite] pointer-events-none ${dark ? 'border-zinc-700/30' : 'border-zinc-200'}`} />

      <div className="absolute w-[190px] h-[190px] rounded-full pointer-events-none flex items-center justify-center">
        <div className="absolute w-2 h-2 rounded-full bg-[#B30000] shadow-[0_0_12px_#B30000] led-particle-1" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_10px_#f97316] led-particle-2" />
      </div>

      {hoveredColor && (
        <div
          className="absolute z-10 w-36 h-36 rounded-full wave-effect pointer-events-none"
          style={{ border: `3px solid ${hoveredColor}`, boxShadow: `0 0 25px ${hoveredColor}40` }}
        />
      )}

      <div
        className="relative z-20 flex flex-col items-center justify-center w-36 h-36 bg-[#B30000] rounded-full shadow-[0_0_35px_rgba(179,0,0,0.5)] border-4 border-white dark:border-zinc-900 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300"
        onClick={() => onNavigate('mapa')}
      >
        <Train size={42} className="text-white mb-1 animate-pulse" />
        <span className="text-white font-black text-[13px] tracking-widest text-center leading-tight drop-shadow-md">METRO<br />2026</span>
      </div>

      {nodes.map(node => (
        <Bubble
          key={node.tab}
          icon={node.icon}
          label={node.label}
          color={node.color}
          glowColor={node.glow}
          pos={node.pos}
          onClick={() => onNavigate(node.tab)}
          onMouseEnter={() => setHoveredColor(node.glow)}
          onMouseLeave={() => setHoveredColor(null)}
        />
      ))}
    </div>
  )
};

const Bubble = ({ icon, label, color, glowColor, pos, onClick, onMouseEnter, onMouseLeave }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => {
        setIsHovered(true);
        onMouseEnter();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onMouseLeave();
      }}
      className={`absolute ${pos} flex flex-col items-center justify-center w-[74px] h-[74px] ${color} rounded-full border-2 border-white dark:border-zinc-800 shadow-xl transition-all duration-300 z-30 animate-float cursor-pointer`}
      style={{
        transform: isHovered ? 'scale(1.1)' : undefined,
        boxShadow: isHovered ? `0 0 25px ${glowColor}` : '0 10px 20px rgba(0,0,0,0.15)',
        zIndex: isHovered ? 40 : 30
      }}
    >
      {icon}
      <span className="text-[7px] font-black uppercase mt-1 text-center leading-tight px-1 max-w-[62px] break-words">{label}</span>
    </button>
  );
};


const DetailModal = ({ item, onClose, onSave, onShare, saved, dark }) => {
  const { t, lang, setLang } = useI18n();

  const isSaved = saved.some(s => (s.title || s.name) === (item.title || item.name));
  const img = item.img || item.image;
  const isNewsArticle = !!(item.fullKey || item.fullText || item.fullContent);

  // Buscar noticias relacionadas
  const relatedNews = isNewsArticle && item.relatedIds
    ? item.relatedIds.map(id => NEWS.find(n => n.id === id)).filter(Boolean)
    : [];

  return (
    <div className={`fixed inset-0 z-[300] flex flex-col animate-in slide-in-from-right-8 duration-300 w-full max-w-full overflow-hidden ${dark ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
      {/* Header con imagen */}
      {img && (
        <div className="relative h-60 sm:h-72 flex-shrink-0">
          <img src={img} className="w-full h-full object-cover" alt="" onError={e => { e.target.style.display='none'; }} style={{ filter: 'brightness(0.9)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.0) 100%)' }} />
          <button onClick={onClose} className="absolute top-5 sm:top-8 left-4 sm:left-5 bg-black/50 text-white rounded-full px-3.5 sm:px-4 py-2 backdrop-blur-sm text-xs font-black flex items-center gap-2 active:scale-95 hover:bg-black/70 transition-colors">
            <ArrowRight size={16} className="rotate-180" /> {t('btn_back')}
          </button>
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${item.urgency === 'Alta' || item.status === 'Cerrada' ? 'bg-[#B30000] text-white' : 'bg-[#FFD600] text-zinc-900'}`}>
                {item.type === 'breaking' ? `🔴 ${t('ultima_hora')}` : item.type || item.status || 'Ficha Técnica'}
              </span>
              {item.category && <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest bg-white/20 backdrop-blur-sm text-white border border-white/20">{item.category}</span>}
            </div>
            <h2 className="text-white font-black italic text-xl sm:text-3xl mt-1 leading-tight break-words">{t(item.titleKey || item.name, item.title || item.name)}</h2>
            {item.loc && <p className="text-white/90 text-xs sm:text-sm font-bold mt-1">{t(item.loc)}</p>}
          </div>
        </div>
      )}

      {/* Contenido scrollable */}
      <div className={`flex-1 overflow-y-auto no-scroll p-4 sm:p-6 ${!img ? 'pt-16 sm:pt-20' : ''}`}>
        {!img && (
          <div className="mb-6">
            <button onClick={onClose} className="flex items-center gap-2 text-[#B30000] font-black uppercase text-xs tracking-widest"><ArrowRight size={16} className="rotate-180" /> {t('btn_back')}</button>
            <h2 className={`text-2xl sm:text-3xl font-black italic tracking-tighter mt-5 leading-tight break-words ${dark ? 'text-white' : 'text-zinc-900'}`}>{t(item.titleKey || item.name, item.title || item.name)}</h2>
          </div>
        )}

        {/* Barra de metadata para noticias */}
        {isNewsArticle && (
          <div className={`flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b ${dark ? 'border-zinc-800' : 'border-zinc-200'}`}>
            {item.date && <span className={`text-[10px] font-black uppercase tracking-widest ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>📅 {item.date}</span>}
            {item.author && <span className={`text-[10px] font-bold ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>✍️ {t(item.authorKey || item.author, item.author)}</span>}
            {item.source && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${dark ? 'text-zinc-400 border-zinc-700 bg-zinc-800' : 'text-zinc-500 border-zinc-200 bg-zinc-100'}`}>📰 {t(item.sourceKey || item.source, item.source)}</span>}
            {item.readMin && <span className={`text-[10px] font-bold ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>🕐 {item.readMin} {t("news_read")}</span>}
          </div>
        )}

        {!isNewsArticle && item.date && <p className={`text-[10px] font-black uppercase tracking-widest mb-4 sm:mb-5 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{item.date}</p>}

        {/* Barra de progreso para estaciones */}
        {item.progress && (
          <div className={`p-4 sm:p-6 rounded-[2rem] mb-4 sm:mb-5 border shadow-sm ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3">
              <span className={dark ? 'text-zinc-400' : 'text-zinc-500'}>{t('detail_work_progress')}</span>
              <span className="text-[#B30000] text-base">{item.progress}</span>
            </div>
            <div className={`w-full h-4 rounded-full overflow-hidden shadow-inner ${dark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
              <div className="h-full bg-gradient-to-r from-[#B30000] to-[#E53935] rounded-full" style={{ width: item.progress }} />
            </div>
          </div>
        )}

        {/* Contenido completo del artículo (Reader Mode) */}
        {isNewsArticle ? (
          <div className={`p-4 sm:p-6 rounded-[2rem] mb-4 sm:mb-5 border shadow-sm ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            {(t(item.fullKey, item.fullText || '') || item.fullText || item.fullContent || '').split('\n\n').map((para, i) => (
              <p key={i} className={`text-sm sm:text-[15px] font-medium leading-[1.8] sm:leading-[1.85] mb-4 sm:mb-5 last:mb-0 break-words ${dark ? 'text-zinc-300' : 'text-zinc-700'}`} style={{ maxWidth: '680px' }}>{para}</p>
            ))}
          </div>
        ) : (
          <div className={`p-4 sm:p-6 rounded-[2rem] text-xs sm:text-sm font-medium leading-relaxed mb-4 sm:mb-5 border shadow-sm break-words ${dark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700'}`}>
            {t(item.descKey || item.desc) || (item.desc && !item.desc.startsWith('st_desc_') ? item.desc : null) || `Ficha técnica completa de ${item.name || item.title}. Esta zona presenta alta actividad de obra e ingeniería estructural.`}
          </div>
        )}

        {/* Galería de fotos */}
        {item.gallery && item.gallery.length > 0 && (
          <div className="mb-4 sm:mb-5">
            <h4 className={`font-black italic text-base sm:text-lg mb-3 ${dark ? 'text-white' : 'text-zinc-900'}`}>{t('detail_gallery')}</h4>
            <div className="flex gap-3 overflow-x-auto no-scroll pb-2">
              {item.gallery.map((src, i) => (
                <div key={i} className="flex-shrink-0 w-40 sm:w-48 h-28 sm:h-32 rounded-2xl overflow-hidden shadow-sm border" style={{ borderColor: dark ? '#27272a' : '#e4e4e7' }}>
                  <img src={src} className="w-full h-full object-cover" alt={`Galería ${i + 1}`} onError={e => e.target.parentElement.style.display = 'none'} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Datos Técnicos para estaciones */}
        {item.code && (
          <div className={`p-4 sm:p-6 rounded-[2rem] border shadow-sm ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            <h4 className={`font-black italic text-base sm:text-lg mb-3 sm:mb-4 ${dark ? 'text-white' : 'text-zinc-900'}`}>{t('detail_technical_data')}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
              <div className={`p-3.5 sm:p-4 rounded-xl ${dark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                <p className={`uppercase font-black mb-1 tracking-widest text-[10px] ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>Código</p>
                <p className={`font-black text-sm sm:text-base ${dark ? 'text-white' : 'text-zinc-900'}`}>{item.code}</p>
              </div>
              <div className={`p-3.5 sm:p-4 rounded-xl ${dark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                <p className={`uppercase font-black mb-1 tracking-widest text-[10px] ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>Localidad</p>
                <p className={`font-black text-sm sm:text-base ${dark ? 'text-white' : 'text-zinc-900'}`}>{t(item.loc).replace('Sector ', '')}</p>
              </div>
              <div className={`p-3.5 sm:p-4 rounded-xl sm:col-span-2 ${dark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                <p className={`uppercase font-black mb-1 tracking-widest text-[10px] ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>Estado</p>
                <p className={`font-black text-sm sm:text-base ${item.status === 'Cerrada' ? 'text-[#B30000]' : 'text-[#2D8B3C]'}`}>{item.status}</p>
              </div>
            </div>
          </div>
        )}

        {/* Noticias Relacionadas */}
        {relatedNews.length > 0 && (
          <div className="mt-5 sm:mt-6">
            <h4 className={`font-black italic text-base sm:text-lg mb-3 ${dark ? 'text-white' : 'text-zinc-900'}`}>{t('noticias_relacionadas')}</h4>
            <div className="space-y-3">
              {relatedNews.slice(0, 2).map(n => (
                <div key={n.id} onClick={() => { onClose(); setTimeout(() => document.querySelector(`[data-detail-id="${n.id}"]`)?.click(), 100); }}
                  className={`flex items-center gap-3 sm:gap-4 p-3 rounded-2xl border cursor-pointer transition-all hover:-translate-y-0.5 ${dark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={n.img} className="w-full h-full object-cover" alt={n.title} onError={e => e.target.parentElement.style.display = 'none'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${n.urgency === 'Alta' ? 'text-[#B30000]' : dark ? 'text-zinc-500' : 'text-zinc-400'}`}>{n.date}</p>
                    <p className={`font-black text-xs sm:text-sm leading-tight line-clamp-2 ${dark ? 'text-white' : 'text-zinc-900'}`}>{t(n.titleKey, n.title)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer con acciones */}
      <div className={`p-4 sm:p-5 border-t flex gap-3 flex-shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.07)] pb-8 sm:pb-10 ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <button onClick={() => onSave(item)} className={`flex-1 flex items-center justify-center gap-2 py-3.5 sm:py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-sm border ${isSaved ? 'bg-[#B30000] border-[#B30000] text-white' : dark ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700' : 'bg-zinc-50 border-zinc-200 text-zinc-900 hover:bg-zinc-100'}`}>
          <Bookmark size={18} className={isSaved ? "fill-current" : ""} /> {isSaved ? t('btn_saved', 'Guardado') : t("btn_save", "GUARDAR")}
        </button>
        <button onClick={() => onShare()} className={`flex-1 flex items-center justify-center gap-2 py-3.5 sm:py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all active:scale-95 shadow-sm ${dark ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700' : 'bg-zinc-50 border-zinc-200 text-zinc-900 hover:bg-zinc-100'}`}>
          <Share2 size={18} /> {t("btn_share", "Compartir")}
        </button>
      </div>
    </div>
  )
};

// --- AUTH SCREENS ---
const SplashScreen = ({ onSkip }) => (
  <div 
    onClick={onSkip}
    className="w-full h-full bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden relative z-[500] cursor-pointer select-none"
    title="Toca para continuar"
  >
    {/* Fondo optimizado */}
    <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #C8102E 0%, transparent 65%)' }} />
    
    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full pointer-events-none animate-train">
      <div className="flex items-end">
        {/* Frente aerodinámico del tren (Splash Screen) */}
        <div className="w-44 h-22 bg-[#C8102E] rounded-r-[2.5rem] rounded-l-lg border-r-[10px] border-[#FFD600] flex items-center justify-center shadow-[0_0_30px_rgba(200,16,46,0.35)] px-4 py-3 relative overflow-hidden">
          {/* Vidrio panorámico */}
          <div className="absolute right-2 top-2 w-14 h-10 bg-[#050505] rounded-tr-[1.8rem] rounded-bl-lg border-t-2 border-white/40" />
          {/* Luz faro */}
          <div className="absolute right-2 bottom-3 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_15px_6px_rgba(255,255,255,0.8)]" />
          <Train size={42} color="#ffffff" className="relative z-10 mr-10 opacity-30" />
        </div>
        {[0, 1, 2].map(i => (
          <div key={i} className="w-32 h-22 bg-[#C8102E] ml-1 rounded-md border-b-4 border-[#1a1a1a] flex justify-around items-center px-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#FFD600] opacity-90" />
            <div className="w-8 h-10 bg-[#050505] rounded border-t border-white/20" />
            <div className="w-8 h-10 bg-[#050505] rounded border-t border-white/20" />
          </div>
        ))}
      </div>
    </div>
    
    <div className="absolute bottom-20 flex flex-col items-center gap-2 opacity-0 animate-fade-in-smooth pointer-events-auto" style={{ animationDelay: '0.15s' }}>
      <h1 className="text-3xl sm:text-4xl font-black text-white italic tracking-tighter drop-shadow-md">Urban<span className="text-[#C8102E]">Go</span></h1>
      <p className="text-[#FFD600] text-xs font-black tracking-widest uppercase animate-pulse">Línea 1 · Metro de Bogotá</p>
      <button 
        onClick={(e) => { e.stopPropagation(); onSkip && onSkip(); }}
        className="mt-3 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-bold tracking-wider uppercase transition-colors active:scale-95"
      >
        Saltar intro ⚡
      </button>
    </div>
  </div>
);

const WelcomeScreen = ({ onAction, onGuest }) => (
  <div className="w-full h-full flex flex-col bg-[#B30000] relative overflow-hidden animate-fade-in-smooth">
    <div className="flex-[1.6] flex flex-col items-center justify-center text-white p-8 text-center relative z-10">
      <div className="w-28 h-28 bg-white/15 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/30 animate-float shadow-2xl backdrop-blur-sm">
        <Train size={52} />
      </div>
      <h1 className="text-4xl font-black mb-3 leading-tight text-white">Metro<br />de Bogotá</h1>
      <p className="text-lg font-medium text-white opacity-85 leading-snug">Muévete inteligente,<br />muévete con Bogotá.</p>
    </div>
    <div className="bg-white rounded-t-[3.5rem] p-10 flex flex-col gap-4 shadow-[0_-20px_60px_rgba(0,0,0,0.25)] relative z-10">
      <button onClick={() => onAction('login')} className="w-full bg-[#B30000] text-white py-4 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-transform">Iniciar Sesión</button>
      <button onClick={() => onAction('register')} className="w-full border-2 border-[#B30000] text-[#B30000] py-4 rounded-2xl font-black text-lg active:scale-95 transition-transform">Crear Cuenta</button>
      <button onClick={onGuest} className="w-full text-zinc-500 font-bold text-sm mt-1 hover:text-[#B30000] transition-colors">Continuar como invitado →</button>
    </div>
  </div>
);

const AuthScreen = ({ type, onBack, onSuccess, onGuest, dark }) => {
  const { t } = useI18n();
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [name,            setName]            = useState('');
  const [email,           setEmail]           = useState('');
  const [pass,            setPass]            = useState('');
  const [confirmPass,     setConfirmPass]     = useState('');
  const [localidad,       setLocalidad]       = useState('');
  const [transporte,      setTransporte]      = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaLoading,  setCaptchaLoading]  = useState(false);
  const [err,             setErr]             = useState('');
  const [success,         setSuccess]         = useState('');
  const [loading,         setLoading]         = useState(false);

  const LOCALIDADES = [
    'Kennedy', 'Bosa', 'Suba', 'Chapinero', 'Teusaquillo',
    'Barrios Unidos', 'Puente Aranda', 'Mártires', 'Santa Fe',
    'Los Mártires', 'Engativá', 'Fontibón', 'Usaquén', 'Usme', 'Ciudad Bolívar'
  ];

  const TRANSPORTES = [
    'TransMilenio / SITP', 'Bicicleta', 'Carro particular',
    'Moto', 'Peatón', 'Taxi / Plataforma', 'Otro'
  ];

  const handleCaptcha = () => {
    if (captchaVerified || captchaLoading) return;
    setCaptchaLoading(true);
    setTimeout(() => { setCaptchaVerified(true); setCaptchaLoading(false); }, 1200);
  };

  const canSubmit = () => {
    if (!email.includes('@') || pass.trim().length < 6) return false;
    if (type === 'register') {
      return (
        name.trim() !== '' &&
        pass === confirmPass &&
        localidad !== '' &&
        transporte !== '' &&
        captchaVerified
      );
    }
    return true;
  };

  const submit = async () => {
    setErr(''); setSuccess('');
    if (!email.includes('@'))      { setErr(t('auth_err_email'));             return; }
    if (pass.trim().length < 6)    { setErr(t('auth_err_password_short'));    return; }
    if (type === 'register') {
      if (!name.trim())            { setErr(t('auth_err_name'));              return; }
      if (pass !== confirmPass)    { setErr(t('auth_err_password_mismatch')); return; }
      if (!localidad)              { setErr(t('reg_localidad_label') + ' ' + t('auth_is_required')); return; }
      if (!transporte)             { setErr(t('reg_transporte_label') + ' ' + t('auth_is_required')); return; }
      if (!captchaVerified)        { setErr(t('reg_captcha_pending'));         return; }
    }

    const uname = type === 'register' ? name : (email.split('@')[0] || 'Ciudadano');
    setLoading(true);

    let authRes;
    try {
      if (type === 'register') {
        authRes = await signUp(email, pass, { name: uname, localidad, transporte, avatar: '👤' });
        if (authRes?.error) throw authRes.error;
        setSuccess(t('auth_success_registered'));
      } else {
        authRes = await signIn(email, pass);
        if (authRes?.error) { setErr(t('auth_err_invalid_credentials')); setLoading(false); return; }
      }
    } catch (e) {
      setLoading(false);
      setErr(e.message || t('auth_err_invalid_credentials'));
      return;
    }

    const savedInDb = (() => {
      try {
        const db = JSON.parse(localStorage.getItem('urbango_registered_users') || '{}');
        return db[email.toLowerCase().trim()] || null;
      } catch {
        return null;
      }
    })();

    const u = authRes?.profile || savedInDb || { 
      name: uname, 
      email, 
      avatar: '👤', 
      localidad: localidad || '—', 
      transporte: transporte || '—',
      saldo: 24500,
      saved_items: [],
      search_history: []
    };

    localStorage.setItem('urbango_user', JSON.stringify(u));
    localStorage.setItem('urbanGoUser', JSON.stringify(u));
    localStorage.setItem('urbango_mock_session', JSON.stringify({
      session: { user: { id: u.id || ('mock-' + Date.now()), email }, access_token: 'mock' },
      profile: u
    }));
    setLoading(false);
    setTimeout(() => onSuccess(u), type === 'register' ? 800 : 0);
  };

  const inpClass = `w-full border p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B30000] transition-all font-semibold text-sm shadow-inner ${
    dark ? 'bg-zinc-800 text-white border-zinc-700 placeholder-zinc-500' : 'bg-zinc-100 text-zinc-900 border-zinc-300 placeholder-zinc-500'
  }`;
  const selClass = `w-full border p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B30000] transition-all font-semibold text-sm appearance-none ${
    dark ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-zinc-100 text-zinc-900 border-zinc-300'
  }`;
  const labelClass = `block text-[10px] font-black uppercase tracking-widest mb-1.5 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`;

  return (
    <div className={`w-full h-full overflow-y-auto no-scroll flex flex-col animate-fade-in-smooth ${dark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}>
      <div className="p-7 flex flex-col flex-1 max-w-md mx-auto w-full">

        {/* Back button */}
        <button onClick={onBack} className={`mb-4 self-start transition-colors ${dark ? 'text-zinc-500 hover:text-[#E53935]' : 'text-zinc-400 hover:text-[#B30000]'}`}>
          <X size={26} />
        </button>

        {/* Header */}
        <h2 className="text-3xl font-black text-[#B30000] mb-1">
          {type === 'login' ? t('auth_login_welcome') : t('auth_register_welcome')}
        </h2>
        <p className={`font-semibold mb-5 text-xs uppercase tracking-widest ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          {type === 'login' ? t('auth_login_subtitle') : t('auth_register_subtitle')}
        </p>

        {/* Error/Success banners */}
        {err && (
          <div className={`p-3 rounded-xl mb-3 text-xs font-bold border ${dark ? 'bg-red-950/40 text-red-300 border-red-800/50' : 'bg-red-50 text-red-600 border-red-200'}`}>
            ⚠️ {err}
          </div>
        )}
        {success && (
          <div className={`p-3 rounded-xl mb-3 text-xs font-bold border ${dark ? 'bg-green-950/40 text-green-300 border-green-800/50' : 'bg-green-50 text-green-700 border-green-200'}`}>
            ✅ {success}
          </div>
        )}

        {/* Form fields */}
        <div className="space-y-3 flex-1">

          {/* Full name — register only */}
          {type === 'register' && (
            <div>
              <label className={labelClass}>{t('auth_fullname_label')} *</label>
              <input value={name} onChange={e => setName(e.target.value)} className={inpClass} placeholder={t('auth_fullname_placeholder')} />
            </div>
          )}

          {/* Email */}
          <div>
            <label className={labelClass}>{t('auth_email_label')} *</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className={inpClass} placeholder={t('auth_email_placeholder')} type="email" autoComplete="email" />
          </div>

          {/* Password */}
          <div>
            <label className={labelClass}>{t('auth_password_label')} *</label>
            <input value={pass} onChange={e => setPass(e.target.value)} className={inpClass} placeholder={t('auth_password_placeholder')} type="password" autoComplete={type === 'login' ? 'current-password' : 'new-password'} />
          </div>

          {/* Confirm password — register only */}
          {type === 'register' && (
            <div>
              <label className={labelClass}>{t('auth_confirm_password_label')} *</label>
              <input
                value={confirmPass}
                onChange={e => setConfirmPass(e.target.value)}
                className={`${inpClass} ${confirmPass && pass !== confirmPass ? 'border-[#B30000] ring-1 ring-[#B30000]' : ''}`}
                placeholder={t('auth_confirm_password_placeholder')}
                type="password"
                autoComplete="new-password"
              />
              {confirmPass && pass !== confirmPass && (
                <p className="text-[9px] text-[#B30000] font-bold mt-1">{t('auth_err_password_mismatch')}</p>
              )}
            </div>
          )}

          {/* Localidad — register only */}
          {type === 'register' && (
            <div>
              <label className={labelClass}>{t('reg_localidad_label')} *</label>
              <select value={localidad} onChange={e => setLocalidad(e.target.value)} className={selClass}>
                <option value="">{t('reg_localidad_label')}…</option>
                {LOCALIDADES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          )}

          {/* Transporte — register only */}
          {type === 'register' && (
            <div>
              <label className={labelClass}>{t('reg_transporte_label')} *</label>
              <select value={transporte} onChange={e => setTransporte(e.target.value)} className={selClass}>
                <option value="">{t('reg_transporte_label')}…</option>
                {TRANSPORTES.map(tr => <option key={tr} value={tr}>{tr}</option>)}
              </select>
            </div>
          )}

          {/* Visual CAPTCHA — register only */}
          {type === 'register' && (
            <div className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
              captchaVerified
                ? dark ? 'bg-green-950/30 border-green-700/50' : 'bg-green-50 border-green-300'
                : dark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-300'
            }`}>
              <button
                type="button"
                onClick={handleCaptcha}
                aria-label={t('reg_captcha_label')}
                className={`w-8 h-8 flex-shrink-0 rounded-md border-2 transition-all flex items-center justify-center ${
                  captchaVerified ? 'bg-[#2D8B3C] border-[#2D8B3C]'
                  : captchaLoading ? 'border-[#B30000] bg-zinc-50'
                  : dark ? 'border-zinc-600 bg-zinc-700 hover:border-[#B30000]' : 'border-zinc-400 bg-white hover:border-[#B30000]'
                }`}
              >
                {captchaVerified && <span className="text-white font-black text-base">✓</span>}
                {captchaLoading && !captchaVerified && <span className="text-[#B30000] text-sm animate-spin inline-block">↻</span>}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-black text-sm ${dark ? 'text-white' : 'text-zinc-900'}`}>{t('reg_captcha_label')}</p>
                <p className={`text-[10px] font-bold transition-colors ${
                  captchaVerified ? 'text-[#2D8B3C]' : captchaLoading ? 'text-[#B30000]' : dark ? 'text-zinc-500' : 'text-zinc-400'
                }`}>
                  {captchaVerified ? t('reg_captcha_verified') : captchaLoading ? t('reg_captcha_verifying') : t('reg_captcha_pending')}
                </p>
              </div>
              <div className={`text-right text-[8px] font-bold leading-tight ${dark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                reCAPTCHA<br/>Privacidad
              </div>
            </div>
          )}

          {/* Forgot password — login only */}
          {type === 'login' && (
            <div className="text-right">
              <button type="button" className="text-[10px] font-bold text-[#B30000] hover:underline">
                {t('auth_forgot_password')}
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={submit}
            disabled={!canSubmit() || loading}
            className="w-full bg-gradient-to-r from-[#B30000] to-[#8E0000] text-white py-4 rounded-2xl font-black text-sm shadow-2xl active:scale-95 transition-all mt-2 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <span className="animate-spin text-lg">↻</span>}
            {type === 'login' ? t('auth_submit_login') : t('auth_submit_register')}
          </button>

          {/* Toggle login / register */}
          <div className="pt-2 text-center">
            {type === 'login' ? (
              <p className={`text-xs ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                ¿No tienes cuenta aún?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-[#B30000] font-black hover:underline"
                >
                  Regístrate aquí
                </button>
              </p>
            ) : (
              <p className={`text-xs ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-[#B30000] font-black hover:underline"
                >
                  Inicia sesión
                </button>
              </p>
            )}
          </div>

          {/* Guest entry */}
          {onGuest && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onGuest}
                className={`w-full py-3 px-4 rounded-2xl border font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  dark
                    ? 'border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:border-[#B30000] hover:text-white'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-[#B30000] hover:text-[#B30000] hover:bg-red-50/50'
                }`}
              >
                <span>🚀</span>
                <span>Continuar como invitado sin registrarse →</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
