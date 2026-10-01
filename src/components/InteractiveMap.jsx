import { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  AlertTriangle, 
  MapPin, 
  X, 
  Layers, 
  Eye, 
  EyeOff, 
  Play, 
  Pause, 
  Timer,
  ChevronDown, 
  ChevronUp,
  Compass,
  Bike,
  Building2,
  GraduationCap,
  HeartPulse,
  Bus,
  Accessibility,
  ArrowRight,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useLanguage, useI18n } from '../LanguageContext';
import { CAPAS_MAPA_METRO } from '../data/metroOfficialData';
import { TrainIcon } from './TrainIcon';

// === CONSTANTES DEL SISTEMA DE DESPACHO CONTINUO ===
const HEADWAY_MS = 40000;           // Salida de una nueva pareja de trenes cada 40 segundos exactos
const JOURNEY_DURATION_MS = 120000; // Recorrido completo terminal a terminal: 120 segundos

export const DEFAULT_16_STATIONS = [
  { id: 1,  code: 'E1',  name: 'E1 - Patio Taller Bosa / El Porvenir', loc: 'st_loc_bosa',        lat: 4.6095, lng: -74.1780, status: 'En obra', progress: '91%', alert: false, img: '/Linea 1 del metro de bogora.png',  biciSlots: 350, tmConnect: 'SITP Alimentador', affluence: 'media', affluencePct: 58 },
  { id: 2,  code: 'E2',  name: 'E2 - Bosa / Gibraltar',                loc: 'st_loc_bosa',        lat: 4.6180, lng: -74.1680, status: 'En obra', progress: '85%', alert: false, img: '/Corredor central.jfif',          biciSlots: 150, tmConnect: 'SITP Zonal Tintal', affluence: 'baja',  affluencePct: 32 },
  { id: 3,  code: 'E3',  name: 'E3 - Portal Américas / Chicalá',       loc: 'st_loc_kennedy',     lat: 4.6230, lng: -74.1580, status: 'En obra', progress: '82%', alert: false, img: '/Corredor central.jfif',          biciSlots: 800, tmConnect: 'Troncal Américas + Alimentadores', affluence: 'alta', affluencePct: 92 },
  { id: 4,  code: 'E4',  name: 'E4 - Carrera 80 / Ciudad Kennedy',     loc: 'st_loc_kennedy',     lat: 4.6260, lng: -74.1460, status: 'En obra', progress: '78%', alert: false, img: '/Corredor central.jfif',          biciSlots: 200, tmConnect: 'SITP Zonal Av. Villavicencio', affluence: 'media', affluencePct: 65 },
  { id: 5,  code: 'E5',  name: 'E5 - Timiza / Hospital de Kennedy',    loc: 'st_loc_kennedy',     lat: 4.6290, lng: -74.1340, status: 'En obra', progress: '76%', alert: false, img: '/Corredor central.jfif',          biciSlots: 220, tmConnect: 'SITP Zonal + Red Hospital', affluence: 'media', affluencePct: 70 },
  { id: 6,  code: 'E6',  name: 'E6 - Avenida Primero de Mayo',         loc: 'st_loc_kennedy',     lat: 4.6310, lng: -74.1200, status: 'En obra', progress: '75%', alert: false, img: '/caracas calle 19 y 22.jfif',     biciSlots: 280, tmConnect: 'Corredor Av. Boyacá', affluence: 'alta',  affluencePct: 85 },
  { id: 7,  code: 'E7',  name: 'E7 - Plaza de Las Américas',           loc: 'st_loc_puente',      lat: 4.6260, lng: -74.1060, status: 'En obra', progress: '73%', alert: true,  img: '/caracas calle 19 y 22.jfif',     biciSlots: 320, tmConnect: 'Futura Troncal Av. 68', affluence: 'alta',  affluencePct: 88 },
  { id: 8,  code: 'E8',  name: 'E8 - SENA / Carrera 50',               loc: 'st_loc_puente',      lat: 4.6240, lng: -74.0940, status: 'En obra', progress: '72%', alert: false, img: '/caracas calle 19 y 22.jfif',     biciSlots: 250, tmConnect: 'Complejo Industrial & SENA', affluence: 'media', affluencePct: 62 },
  { id: 9,  code: 'E9',  name: 'E9 - NQS / General Santander',         loc: 'st_loc_puente',      lat: 4.6210, lng: -74.0820, status: 'En obra', progress: '70%', alert: false, img: '/Caracas.jfif',                  biciSlots: 400, tmConnect: 'Troncal NQS (Carrera 30)', affluence: 'alta',  affluencePct: 94 },
  { id: 10, code: 'E10', name: 'E10 - Calle 1 Sur / Hortúa',           loc: 'st_loc_martires',    lat: 4.6180, lng: -74.0720, status: 'En obra', progress: '68%', alert: false, img: '/Caracas.jfif',                  biciSlots: 180, tmConnect: 'Troncal Caracas Sur', affluence: 'media', affluencePct: 68 },
  { id: 11, code: 'E11', name: 'E11 - Restrepo / Calle 10 Sur',        loc: 'st_loc_martires',    lat: 4.6210, lng: -74.0700, status: 'En obra', progress: '65%', alert: false, img: '/Caracas.jfif',                  biciSlots: 210, tmConnect: 'Troncal Caracas Centro', affluence: 'media', affluencePct: 74 },
  { id: 12, code: 'E12', name: 'E12 - Calle 26 / Centro Internacional',loc: 'st_loc_santafe',     lat: 4.6270, lng: -74.0660, status: 'En obra', progress: '64%', alert: false, img: '/caracas calle 26.jfif',          biciSlots: 600, tmConnect: 'Troncal Calle 26 (Aeropuerto)', affluence: 'alta',  affluencePct: 96 },
  { id: 13, code: 'E13', name: 'E13 - Calle 45 / Universidad Nacional',loc: 'st_loc_teusaquillo',lat: 4.6360, lng: -74.0640, status: 'En obra', progress: '63%', alert: false, img: '/caracas calle 45.jfif',          biciSlots: 450, tmConnect: 'Distrito Universitario Caracas', affluence: 'alta',  affluencePct: 91 },
  { id: 14, code: 'E14', name: 'E14 - Calle 63 / Chapinero',           loc: 'st_loc_chapinero',   lat: 4.6470, lng: -74.0630, status: 'En obra', progress: '62%', alert: false, img: '/caracas calle 63.jfif',          biciSlots: 320, tmConnect: 'Troncal Caracas Chapinero', affluence: 'media', affluencePct: 76 },
  { id: 15, code: 'E15', name: 'E15 - Calle 72 / Intercambiador Modal',loc: 'st_loc_chapinero',   lat: 4.6560, lng: -74.0620, status: 'En obra', progress: '93%', alert: false, img: '/caracas calle 69 y 72a.png',     biciSlots: 500, tmConnect: 'Troncal Caracas + Futura Línea 2', affluence: 'alta', affluencePct: 95 },
  { id: 16, code: 'E16', name: 'E16 - Calle 72 Norte / Terminal',      loc: 'st_loc_barrios',     lat: 4.6640, lng: -74.0610, status: 'En obra', progress: '93%', alert: false, img: '/caracas calle 69 y 72a.png',     biciSlots: 300, tmConnect: 'Paso Subterráneo Cll 72', affluence: 'media', affluencePct: 60 },
];

// === CAPAS DE PUNTOS DE INTERÉS (SALUD, EDUCACIÓN, BICIPARQUEADEROS Y TRANSMILENIO) ===
export const METRO_POINTS_OF_INTEREST = {
  saludEducacion: [
    {
      id: 'poi_hosp_kennedy',
      category: 'salud',
      type: 'hospital',
      name: 'Hospital Occidente de Kennedy',
      subtitle: 'Hospital Departamental de Alta Complejidad',
      stationNear: 'E5 - Timiza / Hospital de Kennedy',
      lat: 4.6285,
      lng: -74.1400,
      icon: '🏥',
      color: '#10B981',
      desc: 'Principal centro hospitalario del suroccidente de Bogotá, conectado directamente con la Estación 5 del Metro.'
    },
    {
      id: 'poi_unal',
      category: 'educacion',
      type: 'universidad',
      name: 'Universidad Nacional de Colombia (UNAL)',
      subtitle: 'Ciudad Universitaria - 45.000 estudiantes',
      stationNear: 'E13 - Calle 45',
      lat: 4.6380,
      lng: -74.0840,
      icon: '🎓',
      color: '#10B981',
      desc: 'Campus central de la Universidad Nacional, principal universidad pública conectada por la Av. Caracas y Calle 45.'
    },
    {
      id: 'poi_sena_50',
      category: 'educacion',
      type: 'instituto',
      name: 'Complejo Educativo SENA Carrera 50',
      subtitle: 'Centro Metalmecánico e Industrial',
      stationNear: 'E8 - SENA / Carrera 50',
      lat: 4.6235,
      lng: -74.0945,
      icon: '🎓',
      color: '#10B981',
      desc: 'Centro neurálgico de formación técnica que capacitará al personal operativo de la Línea 1.'
    },
    {
      id: 'poi_hosp_hortua',
      category: 'salud',
      type: 'hospital',
      name: 'Hospital San Juan de Dios / La Hortúa',
      subtitle: 'Complejo Hospitalario Histórico y de Especialidades',
      stationNear: 'E10 - Calle 1 Sur / Hortúa',
      lat: 4.5950,
      lng: -74.0880,
      icon: '🏥',
      color: '#10B981',
      desc: 'Centro de salud de referencia en el centro-sur de Bogotá con acceso directo sobre la Avenida Caracas.'
    },
    {
      id: 'poi_javeriana',
      category: 'educacion',
      type: 'universidad',
      name: 'Pontificia Universidad Javeriana / Distrito Universitario',
      subtitle: 'Eje Universitario Calles 40 a 45',
      stationNear: 'E13 y E14 - Calle 45 / Calle 63',
      lat: 4.6275,
      lng: -74.0645,
      icon: '🎓',
      color: '#10B981',
      desc: 'Eje universitario y cultural del oriente de la Caracas con más de 30.000 estudiantes y docentes.'
    },
    {
      id: 'poi_claretiano',
      category: 'educacion',
      type: 'colegio',
      name: 'Colegio Claretiano y Megacolegios Bosa',
      subtitle: 'Sector Educativo Bosa El Porvenir',
      stationNear: 'E1 - Patio Taller',
      lat: 4.6120,
      lng: -74.1750,
      icon: '🎓',
      color: '#10B981',
      desc: 'Comunidad educativa del suroccidente beneficiada con acceso peatonal seguro a la primera estación del metro.'
    }
  ],
  biciTransmilenio: [
    {
      id: 'poi_bici_portal_americas',
      category: 'bici_tm',
      type: 'intermodal',
      name: 'Portal Américas: Biciparqueadero & TransMilenio',
      capacityBici: '800 cupos seguros',
      connectionTM: 'Troncal Américas (Rutas F y alimentadoras)',
      stationNear: 'E3 - Portal Américas / Chicalá',
      lat: 4.6280,
      lng: -74.1490,
      icon: '🚲',
      color: '#06B6D4',
      desc: 'Mayor cicloparqueadero del suroccidente con vigilancia 24/7 y pasarela directa a TransMilenio y Metro.'
    },
    {
      id: 'poi_bici_general_santander',
      category: 'bici_tm',
      type: 'intermodal',
      name: 'Intercambiador NQS General Santander',
      capacityBici: '400 cupos seguros',
      connectionTM: 'Troncal NQS (Carrera 30)',
      stationNear: 'E9 - NQS / General Santander',
      lat: 4.5910,
      lng: -74.1150,
      icon: '🚲',
      color: '#06B6D4',
      desc: 'Gran nodo de transferencia modal con conexión a la ciclorruta de la Primero de Mayo y Troncal NQS.'
    },
    {
      id: 'poi_bici_calle_26',
      category: 'bici_tm',
      type: 'intermodal',
      name: 'Estación Central Calle 26: Hub Intermodal',
      capacityBici: '600 cupos seguros',
      connectionTM: 'Troncal Calle 26 (Aeropuerto El Dorado)',
      stationNear: 'E12 - Calle 26 / Centro Internacional',
      lat: 4.6150,
      lng: -74.0700,
      icon: '🚲',
      color: '#06B6D4',
      desc: 'Interconexión estratégica con la ciclorruta de la Calle 26 y ruta troncal al aeropuerto.'
    },
    {
      id: 'poi_bici_calle_72',
      category: 'bici_tm',
      type: 'intermodal',
      name: 'Intercambiador Modal Calle 72',
      capacityBici: '500 cupos seguros',
      connectionTM: 'Troncal Caracas + Futura Línea 2 a Suba',
      stationNear: 'E15/E16 - Calle 72',
      lat: 4.6580,
      lng: -74.0620,
      icon: '🚲',
      color: '#06B6D4',
      desc: 'Terminal norte de integración con paso vehicular deprimido, ciclorruta de la 72 y conexión subterránea a Línea 2.'
    },
    {
      id: 'poi_bici_patio_taller',
      category: 'bici_tm',
      type: 'bici',
      name: 'Biciparqueadero Central Patio Taller Bosa',
      capacityBici: '350 cupos con recarga e-bike',
      connectionTM: 'Rutas alimentadoras SITP El Porvenir',
      stationNear: 'E1 - Patio Taller',
      lat: 4.6080,
      lng: -74.1800,
      icon: '🚲',
      color: '#06B6D4',
      desc: 'Estacionamiento cubierto con casilleros y puntos de recarga para micromovilidad eléctrica.'
    }
  ]
};

// Cálculo del trazado exacto sobre el eje central del viaducto (Línea 1 Roja)
const calculateLine1Track = (stations) => {
  const points = stations.map(s => ({
    lat: s.lat,
    lng: s.lng,
    station: s
  }));

  const computeDists = (pts) => {
    const dists = [0];
    let total = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const dLat = pts[i + 1].lat - pts[i].lat;
      const dLng = pts[i + 1].lng - pts[i].lng;
      const d = Math.sqrt(dLat * dLat + dLng * dLng);
      total += d;
      dists.push(total);
    }
    return { dists, total };
  };

  const northDist = computeDists(points);
  const reversedPoints = [...points].reverse();
  const southDist = computeDists(reversedPoints);

  return {
    northTrack: { points, ...northDist },
    southTrack: { points: reversedPoints, ...southDist }
  };
};

// Interpolación matemática continua con cálculo de ángulo para orientar el mini tren
const interpolateTrackPoint = (track, progress) => {
  const { points: pts, dists, total } = track;
  if (!pts || pts.length === 0) return { lat: 4.6095, lng: -74.1780, angle: 0, currentStation: null, nextStation: null };
  if (pts.length === 1) return { lat: pts[0].lat, lng: pts[0].lng, angle: 0, currentStation: pts[0].station, nextStation: pts[0].station };

  const targetDist = Math.max(0, Math.min(0.9999, progress)) * total;
  let segIdx = 0;
  for (let i = 0; i < dists.length - 1; i++) {
    if (targetDist >= dists[i] && targetDist <= dists[i + 1]) {
      segIdx = i;
      break;
    }
  }

  const p1 = pts[segIdx];
  const p2 = pts[Math.min(pts.length - 1, segIdx + 1)];
  const segLen = dists[segIdx + 1] - dists[segIdx] || 0.00001;
  const t = Math.max(0, Math.min(1, (targetDist - dists[segIdx]) / segLen));

  const dLat = p2.lat - p1.lat;
  const dLng = p2.lng - p1.lng;
  const angle = Math.atan2(-dLat, dLng) * (180 / Math.PI);

  return {
    lat: p1.lat + (p2.lat - p1.lat) * t,
    lng: p1.lng + (p2.lng - p1.lng) * t,
    angle,
    currentStation: p1.station,
    nextStation: p2.station
  };
};

/**
 * Generador de Icono Leaflet: Mini-Tren Aerodinámico Rojo Metro Oficial (#DC2626)
 * - Vía 1 (Norte): Contorno Azul/Cian (#06B6D4), drop-shadow neumórfico y badge 'N'
 * - Vía 2 (Sur): Contorno Amarillo/Ámbar (#F59E0B), drop-shadow neumórfico y badge 'S'
 */
const createMetroTrainLeafletIcon = (code, direction, angleDeg = 0) => {
  const isNorth = direction === 'north';
  const strokeColor = isNorth ? '#06B6D4' : '#F59E0B';
  const glowShadow = isNorth 
    ? 'drop-shadow(0px 0px 6px rgba(6, 182, 212, 0.85))' 
    : 'drop-shadow(0px 0px 6px rgba(245, 158, 11, 0.85))';
  const badgeLetter = isNorth ? 'N' : 'S';

  return L.divIcon({
    className: 'custom-metro-train-marker',
    html: `
      <div style="position: relative; width: 44px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; pointer-events: auto; transform: translate(-22px, -14px); filter: ${glowShadow};">
        <!-- Vehículo rotado según el ángulo del viaducto -->
        <div class="train-car-rotator" style="position: relative; width: 36px; height: 16px; transform: rotate(${angleDeg.toFixed(1)}deg); transform-origin: center center; display: flex; align-items: center; justify-content: center;">
          
          <!-- Haz proyector LED frontal -->
          <div style="position: absolute; right: -14px; width: 18px; height: 18px; background: radial-gradient(circle at left, rgba(255,255,255,0.95) 0%, ${strokeColor} 50%, transparent 80%); clip-path: polygon(0% 30%, 100% 0%, 100% 100%, 0% 70%); pointer-events: none; filter: blur(0.5px);"></div>

          <!-- Carrocería aerodinámica Rojo Metro con contorno iluminado -->
          <div style="position: relative; z-index: 10; width: 100%; height: 100%; border-radius: 9999px; background: linear-gradient(135deg, #E11D48 0%, #DC2626 50%, #991B1B 100%); border: 2.5px solid ${strokeColor}; box-shadow: inset 0 1px 2px rgba(255,255,255,0.4), 0 3px 6px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: space-between; padding: 0 4px; overflow: hidden;">
            
            <!-- Luces rojas traseras -->
            <span style="display: block; width: 2.5px; height: 5px; border-radius: 1px; background-color: #EF4444; box-shadow: 0 0 3px #EF4444; flex-shrink: 0;"></span>

            <!-- Ventanillas de pasajeros iluminadas -->
            <div style="display: flex; gap: 1.5px; align-items: center;">
              <span style="display: block; width: 3.5px; height: 4.5px; border-radius: 0.6px; background: #FFFFFF; box-shadow: 0 0 2px rgba(255,255,255,0.8);"></span>
              <span style="display: block; width: 3.5px; height: 4.5px; border-radius: 0.6px; background: #FFFFFF; box-shadow: 0 0 2px rgba(255,255,255,0.8);"></span>
            </div>

            <!-- Identificador de sentido y código -->
            <span style="font-family: ui-monospace, monospace; font-size: 7.5px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.3px; line-height: 1; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">
              ${badgeLetter}
            </span>

            <!-- Parabrisas oscuro aerodinámico con faros xenón -->
            <div style="position: relative; width: 6px; height: 10px; background: #0F172A; border-radius: 1px 3px 3px 1px; display: flex; flex-direction: column; justify-content: space-between; padding: 1px; flex-shrink: 0; border-left: 1px solid rgba(255,255,255,0.4);">
              <span style="display: block; width: 2px; height: 2px; border-radius: 50%; background-color: #FFFFFF; box-shadow: 0 0 3px #FFFFFF;"></span>
              <span style="display: block; width: 2px; height: 2px; border-radius: 50%; background-color: #FFFFFF; box-shadow: 0 0 3px #FFFFFF;"></span>
            </div>
          </div>
        </div>

        <!-- Radar ping neumórfico centrado -->
        <span style="position: absolute; width: 22px; height: 22px; border-radius: 50%; background-color: ${strokeColor}; opacity: 0.45; animation: urbangoPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; pointer-events: none;"></span>
      </div>
    `,
    iconSize: [44, 28],
    iconAnchor: [22, 14]
  });
};

// === COMPONENTE: FICHA TÉCNICA DE ESTACIÓN (MODAL ELEGANTE) ===
const StationTechSheetModal = ({ 
  station, 
  onClose, 
  onAskMetroBot, 
  dark, 
  t 
}) => {
  if (!station) return null;

  const locText = t(station.loc) || station.loc;
  const descText = t(station.desc) || station.desc;

  // Cálculo de afluencia simulada dinámica basada en la estación
  const affluenceLevel = station.affluence || (station.progress?.startsWith('9') ? 'alta' : 'media');
  const affluencePct = station.affluencePct || (affluenceLevel === 'alta' ? 88 : affluenceLevel === 'media' ? 62 : 30);
  
  const affluenceBadge = affluenceLevel === 'alta'
    ? { text: t('mapModule.affluenceHigh', 'Alta (89% · Concurrido / Pico)'), bg: 'bg-rose-500/15 border-rose-500/30 text-rose-500' }
    : affluenceLevel === 'media'
      ? { text: t('mapModule.affluenceMedium', 'Media (64% · Flujo Moderado)'), bg: 'bg-amber-500/15 border-amber-500/30 text-amber-500' }
      : { text: t('mapModule.affluenceLow', 'Baja (28% · Tránsito Fluido)'), bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500' };

  return (
    <div 
      className="fixed inset-0 z-[2500] bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto border shadow-2xl popup-in flex flex-col ${
          dark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Hero con Imagen de la Estación */}
        <div className="relative h-44 sm:h-48 overflow-hidden bg-zinc-900 flex-shrink-0">
          <img 
            src={station.img || '/Corredor central.jfif'} 
            alt={station.name}
            className="w-full h-full object-cover"
            onError={e => { e.target.src = '/Corredor central.jfif'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />

          {/* Botón cerrar */}
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
            aria-label="Cerrar ficha"
          >
            <X size={16} />
          </button>

          {/* Badges superiores */}
          <div className="absolute top-3 left-4 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#DC2626] text-white shadow-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              {station.code || 'PLMB'}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-sm text-zinc-200 border border-white/10">
              {t('mapModule.techSheetTitle', 'Ficha Técnica Oficial')}
            </span>
          </div>

          {/* Título de la estación */}
          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-lg sm:text-xl font-black italic tracking-tight text-white leading-tight drop-shadow-md">
              {station.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <MapPin size={12} className="text-[#DC2626] shrink-0" />
              <span className="text-xs font-semibold text-zinc-300 truncate">{locText}</span>
              <span className="text-zinc-500">•</span>
              <span className="text-xs font-bold text-emerald-400">{station.progress} {t('map_progress', 'Avance')}</span>
            </div>
          </div>
        </div>

        {/* Contenido detallado de la Ficha Técnica */}
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* 1. Indicador Visual de Afluencia Simulada */}
          <div className={`p-3.5 rounded-2xl border ${dark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">👥</span>
                <span className="text-xs font-black uppercase tracking-wider">
                  {t('mapModule.simulatedAffluence', 'Afluencia Simulada en Vivo')}
                </span>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${affluenceBadge.bg}`}>
                {affluenceBadge.text}
              </span>
            </div>
            {/* Barra medidora */}
            <div className="w-full h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden relative">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  affluencePct > 80 ? 'bg-gradient-to-r from-amber-500 to-rose-600' :
                  affluencePct > 50 ? 'bg-gradient-to-r from-emerald-500 to-amber-500' :
                  'bg-emerald-500'
                }`}
                style={{ width: `${affluencePct}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-zinc-400 font-bold mt-1.5">
              <span>Capacidad de andén: 3.000 usuarios</span>
              <span>Puertas PSD 145m</span>
            </div>
          </div>

          {/* 2. Nivel de Accesibilidad Universal */}
          <div className={`p-3.5 rounded-2xl border ${dark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
            <div className="flex items-center gap-2 mb-2 text-[#06B6D4]">
              <Accessibility size={16} />
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                {t('mapModule.accessibilityLevel', 'Accesibilidad Universal 100% PMR')}
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>Ascensores calle-andén</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>Pisos podotáctiles</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>Rampas reglamentarias</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>Señalética Braille / Sonido</span>
              </div>
            </div>
          </div>

          {/* 3. Conexiones de Transporte Intermodal */}
          <div className={`p-3.5 rounded-2xl border ${dark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
            <div className="flex items-center gap-2 mb-2 text-[#DC2626]">
              <Bus size={16} />
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                {t('mapModule.transportConnections', 'Conexiones Intermodales')}
              </h4>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-medium">TransMilenio / SITP:</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{station.tmConnect || 'Troncal Caracas'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Biciparqueadero:</span>
                <span className="font-bold text-[#06B6D4] flex items-center gap-1">
                  <Bike size={13} /> {station.biciSlots || 250} cupos seguros
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Integración Tarifaria:</span>
                <span className="font-bold text-emerald-500">Ventana 110 min ($0 COP trasbordo)</span>
              </div>
            </div>
          </div>

          {/* 4. Botones de Acción */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                if (onAskMetroBot) {
                  onAskMetroBot(`¿Cuáles son las características y conexiones de la ${station.name}?`);
                  onClose();
                }
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#DC2626] to-[#991B1B] hover:from-[#E11D48] hover:to-[#B91C1C] text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare size={14} />
              <span>{t('mapModule.btnAskMetroBot', 'Consultar con MetroBot IA')}</span>
            </button>

            <button
              onClick={onClose}
              className={`py-3 px-4 rounded-xl border text-xs font-black uppercase tracking-wider transition-colors active:scale-95 ${
                dark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
              }`}
            >
              {t('mapModule.btnUnderstood', 'Entendido')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// === COMPONENTE PRINCIPAL INTERACTIVE MAP ===
const InteractiveMap = ({ 
  stations = [], 
  onShowDetail, 
  dark, 
  t: propT,
  focusStationId = null,
  onAskMetroBot = null
}) => {
  const { t: contextT } = useI18n();
  const t = propT || contextT;
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const staticMarkersRef = useRef([]);
  const poiMarkersRef = useRef([]);

  // 16 Estaciones oficiales de la Línea 1
  const metroStations = useMemo(() => {
    if (stations && stations.length >= 16) {
      return stations.slice(0, 16);
    }
    return DEFAULT_16_STATIONS;
  }, [stations]);

  // Trazados exactos de avance sobre el eje de la Línea 1
  const line1Geometry = useMemo(() => {
    return calculateLine1Track(metroStations);
  }, [metroStations]);

  // Controles de estado interactivos
  const [isPlaying, setIsPlaying] = useState(true);
  const [showLiveTrains, setShowLiveTrains] = useState(true);
  const [secondsToNextDispatch, setSecondsToNextDispatch] = useState(40);
  const [activeTrainCount, setActiveTrainCount] = useState(2);

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const showLiveTrainsRef = useRef(showLiveTrains);
  showLiveTrainsRef.current = showLiveTrains;

  // Motor de tiempo de simulación
  const simTimeRef = useRef(0);
  const trainMarkersMap = useRef(new Map());
  const trainsLayerRef = useRef(null);

  // Estados visuales y modales
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [isLegendExpanded, setIsLegendExpanded] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  // Modal Ficha Técnica de Estación
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isLayersOpen, setIsLayersOpen] = useState(false);

  // Capas con las nuevas micro-innovaciones: Salud/Educación y Biciparqueaderos/TM
  const [layers, setLayers] = useState({ 
    linea1: true, 
    linea2: true, 
    extensionL1: true, 
    redRegional: true, 
    saludEducacion: true,      // 🏥 Salud y Educación
    biciTransmilenio: true,    // 🚲 Biciparqueaderos & TM
    cierres: true, 
    desvios: false, 
    obras: true 
  });

  const [selectedClosure, setSelectedClosure] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const cierresLines = [
    { id: 'c1', name: 'map_closure_caracas_name', desc: 'map_closure_caracas_desc', date: '2024-05-01', time: '24 hrs', detour: 'map_closure_caracas_detour', color: '#DC2626', dash: '10, 10', positions: [[4.6470, -74.0630], [4.6640, -74.0610]] },
    { id: 'c2', name: 'map_closure_mayo_name', desc: 'map_closure_mayo_desc', date: '2024-06-15', time: '10pm - 4am', detour: 'map_closure_mayo_detour', color: '#DC2626', dash: '10, 10', positions: [[4.580, -74.140], [4.590, -74.130]] }
  ];
  const desviosLines = [
    { id: 'd1', name: 'Desvío NQS', color: '#10B981', positions: [[4.6470, -74.0730], [4.6640, -74.0710]] }
  ];

  const translate = t || ((key) => key);

  // 1. INICIALIZACIÓN DE LEAFLET
  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    const map = L.map(mapRef.current, {
      center: [4.6350, -74.1150],
      zoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
      maxZoom: 19, 
      attribution: 'OpenStreetMap' 
    }).addTo(map);

    // Capa de los trenes en Leaflet por encima de las capas del viaducto
    trainsLayerRef.current = L.layerGroup().addTo(map);

    mapInstance.current = map;
    setMapReady(true);

    const ro = new ResizeObserver(() => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize();
      }
    });
    ro.observe(mapRef.current);

    setTimeout(() => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize();
      }
    }, 200);

    return () => {
      ro.disconnect();
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      setMapReady(false);
    };
  }, []);

  // 2. FOCUS AUTOMÁTICO EN ESTACIÓN CUANDO SE PIDE DESDE METROBOT
  useEffect(() => {
    if (!mapInstance.current || !focusStationId) return;

    const target = metroStations.find(
      s => s.id === focusStationId || 
           s.code?.toLowerCase() === String(focusStationId).toLowerCase() ||
           s.name?.toLowerCase().includes(String(focusStationId).toLowerCase())
    );

    if (target) {
      mapInstance.current.flyTo([target.lat, target.lng], 15, { duration: 1.2 });
      setSelectedStation(target);
    }
  }, [focusStationId, metroStations, mapReady]);

  // 3. RENDERIZAR CAPAS DE INFRAESTRUCTURA Y POIS (SALUD, EDUCACIÓN, BICIS)
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapReady) return;

    staticMarkersRef.current.forEach(layer => map.removeLayer(layer));
    staticMarkersRef.current = [];

    poiMarkersRef.current.forEach(layer => map.removeLayer(layer));
    poiMarkersRef.current = [];

    // Línea 1 Oficial (Viaducto Central Rojo: los trenes ruedan exactamente por encima de él)
    if (layers.linea1) {
      const line1 = metroStations.map(s => [s.lat, s.lng]);
      if (line1.length > 0) {
        const mainLine = L.polyline(line1, { color: '#DC2626', weight: 6, opacity: 0.95 }).addTo(map);
        mainLine.on('click', () => setSelectedProject(CAPAS_MAPA_METRO.linea1));
        staticMarkersRef.current.push(mainLine);
      }

      // Estaciones Línea 1
      const visibleStations = layers.obras ? metroStations : metroStations.filter(s => s.status !== 'En obra' && s.status !== 'Cerrada');
      visibleStations.forEach(s => {
        const iconHtml = `
          <div class="relative group" style="cursor:pointer; pointer-events: auto;">
            <div style="width:20px;height:20px;border-radius:50%;border:2.5px solid white;box-shadow:0 3px 6px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;background:${s.alert ? '#F59E0B' : s.status === 'Cerrada' ? '#DC2626' : '#10B981'};transition:transform 0.2s;" class="hover:scale-125">
              <div style="width:6px;height:6px;background:white;border-radius:50%"></div>
            </div>
            <span style="position:absolute; top:-18px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.85); color:white; font-size:9px; font-weight:900; padding:1px 5px; border-radius:6px; white-space:nowrap; pointer-events:none; border:1px solid rgba(255,255,255,0.2);">
              ${s.code}
            </span>
          </div>
        `;
        
        const icon = L.divIcon({
          className: 'custom-station-marker',
          html: iconHtml,
          iconSize: [20, 20], 
          iconAnchor: [10, 10]
        });

        const marker = L.marker([s.lat, s.lng], { icon }).addTo(map);
        marker.on('click', () => setSelectedStation(s));
        staticMarkersRef.current.push(marker);
      });
    }

    // CAPA POI 1: SALUD Y EDUCACIÓN (🏥 / 🎓)
    if (layers.saludEducacion) {
      METRO_POINTS_OF_INTEREST.saludEducacion.forEach(poi => {
        const poiHtml = `
          <div style="cursor:pointer; transform: translate(-14px, -14px); width:28px; height:28px; border-radius:50%; background:#10B981; border:2px solid white; box-shadow:0 3px 8px rgba(16,185,129,0.5); display:flex; align-items:center; justify-content:center; font-size:13px;" title="${poi.name}">
            ${poi.icon}
          </div>
        `;
        const poiIcon = L.divIcon({
          className: 'custom-poi-marker',
          html: poiHtml,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        const marker = L.marker([poi.lat, poi.lng], { icon: poiIcon }).addTo(map);
        marker.on('click', () => setSelectedPoi(poi));
        poiMarkersRef.current.push(marker);
      });
    }

    // CAPA POI 2: BICIPARQUEADEROS & TRANSMILENIO (🚲 / 🚌)
    if (layers.biciTransmilenio) {
      METRO_POINTS_OF_INTEREST.biciTransmilenio.forEach(poi => {
        const poiHtml = `
          <div style="cursor:pointer; transform: translate(-14px, -14px); width:28px; height:28px; border-radius:50%; background:#06B6D4; border:2px solid white; box-shadow:0 3px 8px rgba(6,182,212,0.5); display:flex; align-items:center; justify-content:center; font-size:13px;" title="${poi.name}">
            ${poi.icon}
          </div>
        `;
        const poiIcon = L.divIcon({
          className: 'custom-bici-marker',
          html: poiHtml,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        const marker = L.marker([poi.lat, poi.lng], { icon: poiIcon }).addTo(map);
        marker.on('click', () => setSelectedPoi(poi));
        poiMarkersRef.current.push(marker);
      });
    }

    // Línea 2
    if (layers.linea2 && CAPAS_MAPA_METRO.linea2) {
      const l2 = CAPAS_MAPA_METRO.linea2;
      const l2Coords = l2.estaciones.map(e => [e.lat, e.lng]);
      const l2Line = L.polyline(l2Coords, { color: '#0070F3', weight: 5, opacity: 0.85, dashArray: '6, 8' }).addTo(map);
      l2Line.on('click', () => setSelectedProject(l2));
      staticMarkersRef.current.push(l2Line);
    }

    // Extensión Línea 1
    if (layers.extensionL1 && CAPAS_MAPA_METRO.extensionL1) {
      const ext = CAPAS_MAPA_METRO.extensionL1;
      const extCoords = [
        [4.6582, -74.0625],
        ...ext.estaciones.map(e => [e.lat, e.lng])
      ];
      const extLine = L.polyline(extCoords, { color: '#8E24AA', weight: 4, opacity: 0.8, dashArray: '4, 6' }).addTo(map);
      extLine.on('click', () => setSelectedProject(ext));
      staticMarkersRef.current.push(extLine);
    }

    // Red Regional
    if (layers.redRegional && CAPAS_MAPA_METRO.redRegionalL3) {
      const reg = CAPAS_MAPA_METRO.redRegionalL3;
      const regLine = L.polyline(reg.trazado, { color: '#FF6D00', weight: 4, opacity: 0.8, dashArray: '8, 8' }).addTo(map);
      regLine.on('click', () => setSelectedProject(reg));
      staticMarkersRef.current.push(regLine);
    }

    // Cierres
    if (layers.cierres) {
      cierresLines.forEach(c => {
        const poly = L.polyline(c.positions, { color: c.color, weight: 6, dashArray: c.dash }).addTo(map);
        poly.on('click', () => setSelectedClosure(c));
        staticMarkersRef.current.push(poly);
      });
    }

    // Desvíos
    if (layers.desvios) {
      desviosLines.forEach(d => {
        const poly = L.polyline(d.positions, { color: d.color, weight: 5, opacity: 0.8 }).addTo(map);
        staticMarkersRef.current.push(poly);
      });
    }

  }, [metroStations, layers, mapReady]);

  // 4. MOTOR DE ANIMACIÓN: TRENES ROJO METRO CON CONTORNOS DIFERENCIADOS POR SENTIDO
  useEffect(() => {
    if (!mapReady || !trainsLayerRef.current) return;

    let animId;
    let lastTimestamp = performance.now();

    const loop = (currentTimestamp) => {
      const delta = Math.min(currentTimestamp - lastTimestamp, 100);
      lastTimestamp = currentTimestamp;

      if (isPlayingRef.current) {
        simTimeRef.current += delta;
      }

      const layer = trainsLayerRef.current;
      const markersMap = trainMarkersMap.current;

      if (!showLiveTrainsRef.current) {
        if (markersMap.size > 0) {
          markersMap.forEach(({ marker }) => layer.removeLayer(marker));
          markersMap.clear();
        }
      } else {
        const curSimTime = simTimeRef.current;
        const minK = Math.max(0, Math.floor((curSimTime - JOURNEY_DURATION_MS) / HEADWAY_MS) + 1);
        const maxK = Math.floor(curSimTime / HEADWAY_MS);
        const activeIds = new Set();

        for (let k = minK; k <= maxK; k++) {
          const elapsed = curSimTime - k * HEADWAY_MS;
          if (elapsed >= 0 && elapsed < JOURNEY_DURATION_MS) {
            const progress = elapsed / JOURNEY_DURATION_MS;

            // ── TREN SENTIDO NORTE: Bosa (E1) ➔ Calle 72 (E16) | Contorno Azul/Cian (#06B6D4) ──
            const northId = `N-${k}`;
            activeIds.add(northId);
            const northPos = interpolateTrackPoint(line1Geometry.northTrack, progress);
            const northNum = (k * 2 + 1);
            const northCode = `M-${String(((northNum - 1) % 50) + 1).padStart(2, '0')}`;
            const northData = {
              id: northId,
              code: northCode,
              direction: 'north',
              name: `Tren ${northCode} (Vía 1 · Norte)`,
              origin: 'Patio Taller Bosa (E1)',
              destination: 'Intercambiador Calle 72 (E16)',
              strokeColor: '#06B6D4',
              color: '#DC2626',
              progress: Math.round(progress * 100),
              currentStationName: northPos.currentStation?.name || 'Patio Taller Bosa',
              nextStationName: northPos.nextStation?.name || 'Calle 72'
            };

            let northEntry = markersMap.get(northId);
            if (!northEntry) {
              const icon = createMetroTrainLeafletIcon(northCode, 'north', northPos.angle);
              const marker = L.marker([northPos.lat, northPos.lng], { icon, zIndexOffset: 1200 }).addTo(layer);
              marker.on('click', () => setSelectedTrain(northData));
              northEntry = { marker, data: northData, lastAngle: northPos.angle };
              markersMap.set(northId, northEntry);
            } else {
              northEntry.marker.setLatLng([northPos.lat, northPos.lng]);
              northEntry.data = northData;

              const el = northEntry.marker.getElement();
              if (el) {
                const rotator = el.querySelector('.train-car-rotator');
                if (rotator && Math.abs(northEntry.lastAngle - northPos.angle) > 1.5) {
                  rotator.style.transform = `rotate(${northPos.angle.toFixed(1)}deg)`;
                  northEntry.lastAngle = northPos.angle;
                }
              }
            }

            // ── TREN SENTIDO SUR: Calle 72 (E16) ➔ Bosa (E1) | Contorno Amarillo/Ámbar (#F59E0B) ──
            const southId = `S-${k}`;
            activeIds.add(southId);
            const southPos = interpolateTrackPoint(line1Geometry.southTrack, progress);
            const southNum = (k * 2 + 2);
            const southCode = `M-${String(((southNum - 1) % 50) + 1).padStart(2, '0')}`;
            const southData = {
              id: southId,
              code: southCode,
              direction: 'south',
              name: `Tren ${southCode} (Vía 2 · Sur / Retorno)`,
              origin: 'Intercambiador Calle 72 (E16)',
              destination: 'Patio Taller Bosa (E1)',
              strokeColor: '#F59E0B',
              color: '#DC2626',
              progress: Math.round(progress * 100),
              currentStationName: southPos.currentStation?.name || 'Calle 72',
              nextStationName: southPos.nextStation?.name || 'Patio Taller Bosa'
            };

            let southEntry = markersMap.get(southId);
            if (!southEntry) {
              const icon = createMetroTrainLeafletIcon(southCode, 'south', southPos.angle);
              const marker = L.marker([southPos.lat, southPos.lng], { icon, zIndexOffset: 1200 }).addTo(layer);
              marker.on('click', () => setSelectedTrain(southData));
              southEntry = { marker, data: southData, lastAngle: southPos.angle };
              markersMap.set(southId, southEntry);
            } else {
              southEntry.marker.setLatLng([southPos.lat, southPos.lng]);
              southEntry.data = southData;

              const el = southEntry.marker.getElement();
              if (el) {
                const rotator = el.querySelector('.train-car-rotator');
                if (rotator && Math.abs(southEntry.lastAngle - southPos.angle) > 1.5) {
                  rotator.style.transform = `rotate(${southPos.angle.toFixed(1)}deg)`;
                  southEntry.lastAngle = southPos.angle;
                }
              }
            }
          }
        }

        // Limpiar trenes que culminaron
        for (const [id, entry] of markersMap.entries()) {
          if (!activeIds.has(id)) {
            layer.removeLayer(entry.marker);
            markersMap.delete(id);
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      if (trainMarkersMap.current) {
        trainMarkersMap.current.forEach(({ marker }) => {
          if (trainsLayerRef.current) {
            trainsLayerRef.current.removeLayer(marker);
          }
        });
        trainMarkersMap.current.clear();
      }
    };
  }, [mapReady, line1Geometry]);

  // Actualización periódica del contador de despacho
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const elapsedInCycle = simTimeRef.current % HEADWAY_MS;
      const remainingMs = HEADWAY_MS - elapsedInCycle;
      const secs = Math.max(1, Math.ceil(remainingMs / 1000));
      setSecondsToNextDispatch(secs);
      setActiveTrainCount(trainMarkersMap.current.size);
    }, 500);

    return () => clearInterval(timerInterval);
  }, []);

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] w-full flex flex-col relative rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 border shadow-lg">
      <style>{`
        @keyframes urbangoPing {
          0% { transform: scale(0.85); opacity: 0.85; }
          75%, 100% { transform: scale(2.3); opacity: 0; }
        }
      `}</style>

      {/* Contenedor del mapa Leaflet */}
      <div 
        ref={mapRef} 
        style={{ height: '100%', width: '100%', zIndex: 1, position: 'absolute', top: 0, left: 0 }}
      />

      {/* ── CONTROLES SUPERIORES: DESPACHO CADA 40S, PAUSAR/REANUDAR Y CONTROL DE CAPAS ── */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Badge Título L1 2026 */}
        <div className={`pointer-events-auto backdrop-blur-xl px-3.5 py-1.5 rounded-full border shadow-lg flex items-center gap-2 transition-all ${
          dark ? 'bg-zinc-950/85 border-zinc-800 text-white' : 'bg-white/90 border-zinc-200 text-zinc-900'
        }`}>
          <div className="w-2.5 h-2.5 rounded-full bg-[#DC2626] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-black italic tracking-tight">
            {t('mapModule.titleBadge', 'Metro L1 2026')}
          </span>
          <span className="hidden sm:inline-block text-[10px] font-bold text-zinc-400 border-l border-zinc-500/20 pl-2">
            {t('mapModule.stationsCount', '16 Estaciones')}
          </span>
        </div>

        {/* Grupo de Controles: Temporizador, Pausa, Visibilidad y Capas */}
        <div className="pointer-events-auto flex items-center gap-1.5 flex-wrap">
          
          {/* Temporizador de Despacho Continuo */}
          <div 
            className={`backdrop-blur-xl px-3 py-1.5 rounded-full border shadow-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              dark 
                ? 'bg-zinc-950/85 border-emerald-500/40 text-emerald-400' 
                : 'bg-white/95 border-emerald-300 text-emerald-700'
            }`}
            title={t('mapModule.continuousDispatch', 'Despacho sincronizado en Bosa y Calle 72 cada 40 segundos')}
          >
            <Timer size={12} className={isPlaying ? "animate-spin text-emerald-500" : "text-amber-500"} style={{ animationDuration: '4s' }} />
            <span>
              {isPlaying ? (
                <>{t('mapModule.nextTrainIn', 'Próximo tren en:')} <strong className="font-mono text-emerald-500">{secondsToNextDispatch}s</strong></>
              ) : (
                <>{t('mapModule.pausedLabel', 'Pausado')} (<strong className="font-mono">{secondsToNextDispatch}s</strong>)</>
              )}
            </span>
          </div>

          {/* Botón Pausar / Reanudar */}
          <button
            onClick={() => setIsPlaying(prev => !prev)}
            className={`backdrop-blur-xl px-3 py-1.5 rounded-full border shadow-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 ${
              isPlaying
                ? dark ? 'bg-zinc-900/90 border-zinc-700 text-zinc-200' : 'bg-white/90 border-zinc-200 text-zinc-700'
                : 'bg-amber-500 text-white border-amber-400 shadow-amber-900/30'
            }`}
          >
            {isPlaying ? <Pause size={11} className="text-amber-500" /> : <Play size={11} className="text-white fill-white" />}
            <span className="hidden sm:inline">{isPlaying ? t('mapModule.btnPause', 'Pausar') : t('mapModule.btnResume', 'Reanudar')}</span>
          </button>

          {/* Botón Mostrar / Ocultar Trenes */}
          <button
            onClick={() => setShowLiveTrains(prev => !prev)}
            className={`backdrop-blur-xl px-3 py-1.5 rounded-full border shadow-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 ${
              showLiveTrains
                ? 'bg-emerald-600 text-white border-emerald-500'
                : dark ? 'bg-zinc-900/90 border-zinc-700 text-zinc-400' : 'bg-white/90 border-zinc-200 text-zinc-600'
            }`}
          >
            {showLiveTrains ? <Eye size={11} /> : <EyeOff size={11} />}
            <span className="hidden sm:inline">{showLiveTrains ? t('mapModule.btnHideTrains', 'Ocultar Trenes') : t('mapModule.btnShowTrains', 'Mostrar Trenes')}</span>
          </button>

          {/* CONTROL COMPACTO DE CAPAS (LAYER SWITCHER) */}
          <button
            onClick={() => setIsLayersOpen(v => !v)}
            className={`backdrop-blur-xl px-3.5 py-1.5 rounded-full border shadow-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 ${
              isLayersOpen
                ? 'bg-[#DC2626] text-white border-[#DC2626]'
                : dark ? 'bg-zinc-950/85 border-zinc-800 text-zinc-300 hover:text-white' : 'bg-white/90 border-zinc-200 text-zinc-700 hover:text-zinc-900'
            }`}
          >
            <Layers size={11} />
            <span>{t('mapModule.layersBtn', 'Capas')}</span>
          </button>
        </div>
      </div>

      {/* ── PANEL DESPLEGABLE COMPACTO DE CAPAS CON SALUD/EDUCACIÓN Y BICIS/TM ── */}
      {isLayersOpen && (
        <div className={`absolute top-12 sm:top-14 right-3 z-[1000] p-3.5 rounded-2xl backdrop-blur-xl border shadow-2xl popup-in flex flex-col gap-2 max-w-[260px] w-64 ${
          dark ? 'bg-zinc-950/95 border-zinc-800 text-zinc-200' : 'bg-white/95 border-zinc-200 text-zinc-800'
        }`}>
          <div className="flex justify-between items-center pb-1 border-b border-zinc-500/20">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              {t('mapModule.layersTitle', 'Control de Capas')}
            </span>
            <button onClick={() => setIsLayersOpen(false)} className="text-zinc-400 text-xs hover:text-white">✕</button>
          </div>
          
          {/* Micro-Innovación: Capa Salud y Educación */}
          <button
            onClick={() => setLayers(l => ({ ...l, saludEducacion: !l.saludEducacion }))}
            className={`px-3 py-2 rounded-xl text-[10px] font-bold text-left transition-all border flex items-center justify-between ${
              layers.saludEducacion 
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-black' 
                : dark ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-zinc-100 border-zinc-200 text-zinc-400'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span>🏥</span>
              <span>{t('mapModule.layerHealthEdu', 'Salud y Educación')}</span>
            </span>
            <span>{layers.saludEducacion ? '✓' : ''}</span>
          </button>

          {/* Micro-Innovación: Capa Biciparqueaderos & TransMilenio */}
          <button
            onClick={() => setLayers(l => ({ ...l, biciTransmilenio: !l.biciTransmilenio }))}
            className={`px-3 py-2 rounded-xl text-[10px] font-bold text-left transition-all border flex items-center justify-between ${
              layers.biciTransmilenio 
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400 font-black' 
                : dark ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-zinc-100 border-zinc-200 text-zinc-400'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span>🚲</span>
              <span>{t('mapModule.layerBikeTransmilenio', 'Biciparqueaderos & TM')}</span>
            </span>
            <span>{layers.biciTransmilenio ? '✓' : ''}</span>
          </button>

          <div className="h-[1px] bg-zinc-500/15 my-0.5" />

          {/* Capas de Red Metro */}
          <button
            onClick={() => setLayers(l => ({ ...l, linea1: !l.linea1 }))}
            className={`px-3 py-1.5 rounded-xl text-[9.5px] font-bold text-left transition-colors border flex items-center justify-between ${
              layers.linea1 
                ? 'bg-red-500/15 border-red-500/40 text-red-500 font-black' 
                : dark ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-zinc-100 border-zinc-200 text-zinc-400'
            }`}
          >
            <span>{t('mapModule.line1', '🔴 Línea 1 (Viaducto L1MB)')}</span>
            <span>{layers.linea1 ? '✓' : ''}</span>
          </button>

          <button
            onClick={() => setLayers(l => ({ ...l, linea2: !l.linea2 }))}
            className={`px-3 py-1.5 rounded-xl text-[9.5px] font-bold text-left transition-colors border flex items-center justify-between ${
              layers.linea2 
                ? 'bg-blue-500/15 border-blue-500/40 text-blue-400 font-black' 
                : dark ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-zinc-100 border-zinc-200 text-zinc-400'
            }`}
          >
            <span>{t('mapModule.line2', '🔵 Línea 2 (Subterráneo)')}</span>
            <span>{layers.linea2 ? '✓' : ''}</span>
          </button>

          <button
            onClick={() => setLayers(l => ({ ...l, cierres: !l.cierres }))}
            className={`px-3 py-1.5 rounded-xl text-[9.5px] font-bold text-left transition-colors border flex items-center justify-between ${
              layers.cierres 
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-500 font-black' 
                : dark ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-zinc-100 border-zinc-200 text-zinc-400'
            }`}
          >
            <span>🚧 Cierres y Desvíos de Obra</span>
            <span>{layers.cierres ? '✓' : ''}</span>
          </button>
        </div>
      )}

      {/* ── LEYENDA EN LA ESQUINA INFERIOR DEL MAPA (DIFERENCIACIÓN VISUAL DE TRENES) ── */}
      <div className="absolute bottom-3 left-3 z-[1000] pointer-events-auto max-w-[290px] sm:max-w-xs">
        <div className={`backdrop-blur-xl rounded-2xl border shadow-2xl transition-all ${
          dark ? 'bg-zinc-950/90 border-zinc-800 text-zinc-200' : 'bg-white/95 border-zinc-200 text-zinc-800'
        }`}>
          {/* Header interactivo */}
          <button
            onClick={() => setIsLegendExpanded(prev => !prev)}
            className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left hover:opacity-85 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-[10px] font-black uppercase tracking-wider">
                {t('mapModule.legendTitle', 'Flota en Rodaje')}
              </span>
              <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded-full ${isPlaying ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {activeTrainCount} {t('mapModule.trainsCount', 'trenes')}
              </span>
            </div>
            {isLegendExpanded ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>

          {isLegendExpanded && (
            <div className="px-3 pb-3 pt-1 space-y-2 border-t border-zinc-500/15 text-[9px] font-bold">
              
              {/* Vía 1: Sentido Sur ➔ Norte (Bosa a Calle 72) - Contorno Azul/Cian */}
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-2 shadow-xs">
                <div className="w-5 h-5 rounded-md bg-[#DC2626] border-2 border-[#06B6D4] shadow-[0_0_8px_rgba(6,182,212,0.8)] flex items-center justify-center text-[8px] font-black text-white shrink-0 mt-0.5">
                  N
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#06B6D4]">{t('mapModule.northbound', 'Sentido Norte')}</span>
                    <span className="text-[8px] text-zinc-400">c/40s</span>
                  </div>
                  <p className="text-[9px] text-zinc-300 font-semibold truncate">
                    {t('mapModule.trainRedBlueBorder', '🔴 [Borde Azul]: Bosa ➔ Calle 72')}
                  </p>
                </div>
              </div>

              {/* Vía 2: Sentido Norte ➔ Sur (Calle 72 a Bosa) - Contorno Amarillo/Ámbar */}
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 shadow-xs">
                <div className="w-5 h-5 rounded-md bg-[#DC2626] border-2 border-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.8)] flex items-center justify-center text-[8px] font-black text-white shrink-0 mt-0.5">
                  S
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#F59E0B]">{t('mapModule.southbound', 'Sentido Sur')}</span>
                    <span className="text-[8px] text-zinc-400">c/40s</span>
                  </div>
                  <p className="text-[9px] text-zinc-300 font-semibold truncate">
                    {t('mapModule.trainRedYellowBorder', '🔴 [Borde Amarillo]: Calle 72 ➔ Bosa')}
                  </p>
                </div>
              </div>

              {/* Parámetros técnicos del despacho */}
              <div className="pt-1 flex items-center justify-between text-[8px] text-zinc-400 border-t border-zinc-500/10">
                <span>Rojo Metro PLMB (#DC2626)</span>
                <span className="font-black text-cyan-400">GoA4 100% Automático</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL DE TELEMETRÍA DETALLADA DEL TREN SELECCIONADO ── */}
      {selectedTrain && (
        <div 
          className="absolute inset-0 z-[2200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedTrain(null)}
        >
          <div 
            className={`w-full max-w-sm rounded-3xl p-5 border shadow-2xl popup-in ${
              dark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrainIcon direction={selectedTrain.direction} width={34} height={16} />
                <span 
                  className="text-xs font-black uppercase tracking-wider"
                  style={{ color: selectedTrain.strokeColor }}
                >
                  {selectedTrain.direction === 'north' 
                    ? `${t('mapModule.northbound', 'Sentido Norte')} (Vía 1)` 
                    : `${t('mapModule.southbound', 'Sentido Sur')} (Vía 2)`}
                </span>
              </div>
              <button 
                onClick={() => setSelectedTrain(null)}
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  dark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-100 text-zinc-600 hover:text-black'
                }`}
                aria-label="Cerrar telemetría"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg font-black bg-[#DC2626]"
                style={{ border: `2.5px solid ${selectedTrain.strokeColor}` }}
              >
                🚇
              </div>
              <div>
                <h3 className="text-base font-black italic">
                  {selectedTrain.name}
                </h3>
                <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                  {t('mapModule.telemetrySub', 'CRRC Alstom · 6 Vagones 100% Eléctricos (GoA4)')}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-xs font-bold">
              <div className={`p-2.5 rounded-2xl flex justify-between items-center ${dark ? 'bg-zinc-800/80' : 'bg-zinc-50'}`}>
                <span className="text-zinc-400">{t('mapModule.origin', 'Origen')}</span>
                <span className="font-black text-[#DC2626]">{selectedTrain.origin}</span>
              </div>
              <div className={`p-2.5 rounded-2xl flex justify-between items-center ${dark ? 'bg-zinc-800/80' : 'bg-zinc-50'}`}>
                <span className="text-zinc-400">{t('mapModule.destination', 'Destino')}</span>
                <span className="font-black" style={{ color: selectedTrain.strokeColor }}>{selectedTrain.destination}</span>
              </div>
              <div className={`p-2.5 rounded-2xl flex justify-between items-center ${dark ? 'bg-zinc-800/80' : 'bg-zinc-50'}`}>
                <span className="text-zinc-400">{t('mapModule.nextStation', 'Próxima Estación')}</span>
                <span className="font-black text-amber-500">{selectedTrain.nextStationName}</span>
              </div>
              <div className={`p-2.5 rounded-2xl flex justify-between items-center ${dark ? 'bg-zinc-800/80' : 'bg-zinc-50'}`}>
                <span className="text-zinc-400">{t('mapModule.progress', 'Avance del Recorrido')}</span>
                <span className="font-black text-emerald-400">{selectedTrain.progress}%</span>
              </div>
              <div className={`p-2.5 rounded-2xl flex justify-between items-center ${dark ? 'bg-zinc-800/80' : 'bg-zinc-50'}`}>
                <span className="text-zinc-400">{t('mapModule.commercialSpeed', 'Velocidad Comercial')}</span>
                <span className="font-black text-blue-400">{t('mapModule.commercialSpeedVal', '43 km/h (GoA4 Automatizado)')}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTrain(null)}
              className="w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-md transition-transform active:scale-95 bg-[#DC2626]"
              style={{ border: `1.5px solid ${selectedTrain.strokeColor}` }}
            >
              {t('mapModule.closeTelemetry', 'Cerrar Telemetría')}
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL DETALLE DE POI (SALUD, EDUCACIÓN, BICIS) ── */}
      {selectedPoi && (
        <div 
          className="absolute inset-0 z-[2200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPoi(null)}
        >
          <div 
            className={`w-full max-w-sm rounded-3xl p-5 border shadow-2xl popup-in ${
              dark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span 
                className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: selectedPoi.color }}
              >
                {selectedPoi.category === 'salud' ? '🏥 Centro de Salud' : selectedPoi.category === 'educacion' ? '🎓 Educación' : '🚲 Hub Bici + TM'}
              </span>
              <button 
                onClick={() => setSelectedPoi(null)}
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  dark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-100 text-zinc-600 hover:text-black'
                }`}
              >
                <X size={14} />
              </button>
            </div>

            <h3 className="text-base font-black italic mb-1">{selectedPoi.name}</h3>
            <p className="text-[11px] font-semibold text-zinc-400 mb-3">{selectedPoi.subtitle || selectedPoi.desc}</p>

            <div className="space-y-2 mb-4 text-xs font-bold">
              <div className={`p-2.5 rounded-2xl flex justify-between items-center ${dark ? 'bg-zinc-800/80' : 'bg-zinc-50'}`}>
                <span className="text-zinc-400">Estación Metro Cercana:</span>
                <span className="font-black text-[#DC2626]">{selectedPoi.stationNear}</span>
              </div>
              {selectedPoi.capacityBici && (
                <div className={`p-2.5 rounded-2xl flex justify-between items-center ${dark ? 'bg-zinc-800/80' : 'bg-zinc-50'}`}>
                  <span className="text-zinc-400">Cupos Bici:</span>
                  <span className="font-black text-[#06B6D4]">{selectedPoi.capacityBici}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedPoi(null)}
              className="w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-md active:scale-95 transition-transform"
              style={{ backgroundColor: selectedPoi.color }}
            >
              {t('mapModule.btnUnderstood', 'Entendido')}
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL FICHA TÉCNICA DE ESTACIÓN (MICRO-INNOVACIÓN 1) ── */}
      {selectedStation && (
        <StationTechSheetModal
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
          onAskMetroBot={onAskMetroBot}
          dark={dark}
          t={translate}
        />
      )}

      {/* Modal Ficha Proyecto / Línea */}
      {selectedProject && (
        <div 
          className="absolute inset-0 z-[2100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className={`w-full max-w-md rounded-3xl p-5 border shadow-2xl popup-in ${
              dark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span 
                className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: selectedProject.color || '#DC2626' }}
              >
                {selectedProject.tipo}
              </span>
              <button 
                onClick={() => setSelectedProject(null)}
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  dark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-100 text-zinc-600 hover:text-black'
                }`}
              >
                <X size={14} />
              </button>
            </div>

            <h3 className="text-lg font-black italic mb-1">{selectedProject.nombre}</h3>
            <span className="text-[10px] font-black uppercase tracking-wider block text-emerald-500 mb-3">
              {selectedProject.estado}
            </span>

            <p className={`text-xs font-medium mb-4 leading-relaxed ${dark ? 'text-zinc-300' : 'text-zinc-600'}`}>
              {selectedProject.descripcion}
            </p>

            <button
              onClick={() => setSelectedProject(null)}
              className="w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-md active:scale-95 transition-transform bg-[#DC2626]"
            >
              {t('mapModule.btnUnderstood', 'Entendido')}
            </button>
          </div>
        </div>
      )}

      {/* Modal Cierres Viales */}
      {selectedClosure && (
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2000] w-[90%] max-w-xs backdrop-blur-xl border rounded-2xl p-4 shadow-2xl popup-in ${dark ? 'bg-zinc-900/95 border-zinc-700' : 'bg-white/95 border-zinc-200'}`}>
          <button onClick={() => setSelectedClosure(null)} className={`absolute top-3 right-3 ${dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}><X size={16}/></button>
          <h3 className={`font-black text-xs sm:text-sm mb-1 ${dark ? 'text-white' : 'text-zinc-900'}`}>{translate(selectedClosure.name)}</h3>
          <p className={`text-[10px] sm:text-xs mb-3 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>{translate(selectedClosure.desc)}</p>
          <div className="space-y-1.5 text-[9px] font-bold uppercase tracking-widest">
            <div className="flex justify-between"><span className={dark ? 'text-zinc-500' : 'text-zinc-400'}>{translate('map_start')}</span><span className={dark ? 'text-zinc-200' : 'text-zinc-700'}>{selectedClosure.date}</span></div>
            <div className="flex justify-between"><span className={dark ? 'text-zinc-500' : 'text-zinc-400'}>{translate('map_schedule')}</span><span className={dark ? 'text-zinc-200' : 'text-zinc-700'}>{selectedClosure.time}</span></div>
            <div className="flex justify-between"><span className={dark ? 'text-zinc-500' : 'text-zinc-400'}>{translate('map_detour')}</span><span className="text-[#10B981] font-black">{translate(selectedClosure.detour)}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
