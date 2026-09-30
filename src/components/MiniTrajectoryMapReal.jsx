import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Navigation, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Train, 
  Bus, 
  Compass, 
  Info,
  Maximize2,
  CheckCircle2,
  TreePine,
  Waves
} from 'lucide-react';
import { useI18n } from '../i18nContext';

// ── COORDENADAS GEOGRÁFICAS EXACTAS DE LAS 16 ESTACIONES L1MB (OFICIAL EMB) ──
// Distribuidas en 3 ZONAS con CÓDIGO DE COLOR OFICIAL:
// 1. Verdes: Bosa / Kennedy (E1 - E5)
// 2. Amarillos: NQS / Puente Aranda (E6 - E10)
// 3. Púrpuras: Centro / Caracas (E11 - E16)
export const L1_GEO_STATIONS = [
  // ── ZONA 1: BOSA / KENNEDY (VERDES #10B981) ──
  { 
    id: 1,  
    code: 'E1',  
    name: 'Patio Taller / Portal Américas', 
    shortName: 'Patio Taller', 
    localidad: 'Bosa', 
    lat: 4.6095, 
    lng: -74.1780, 
    km: 0.0, 
    intermodal: 'TM Portal Américas',
    zone: 'Bosa / Kennedy',
    zoneColor: '#10B981',
    zoneBgLight: '#ECFDF5',
    zoneText: '#065F46'
  },
  { 
    id: 2,  
    code: 'E2',  
    name: 'Av. Villavicencio con Cra 95A', 
    shortName: 'Cra 95A', 
    localidad: 'Bosa / Kennedy', 
    lat: 4.6180, 
    lng: -74.1680, 
    km: 1.6, 
    intermodal: null,
    zone: 'Bosa / Kennedy',
    zoneColor: '#10B981',
    zoneBgLight: '#ECFDF5',
    zoneText: '#065F46'
  },
  { 
    id: 3,  
    code: 'E3',  
    name: 'Av. Villavicencio con Av. Guayacanes', 
    shortName: 'Av. Guayacanes', 
    localidad: 'Kennedy', 
    lat: 4.6230, 
    lng: -74.1580, 
    km: 3.1, 
    intermodal: 'Alimentador TM',
    zone: 'Bosa / Kennedy',
    zoneColor: '#10B981',
    zoneBgLight: '#ECFDF5',
    zoneText: '#065F46'
  },
  { 
    id: 4,  
    code: 'E4',  
    name: 'Av. Primero de Mayo con Av. Boyacá', 
    shortName: 'Av. Boyacá', 
    localidad: 'Kennedy', 
    lat: 4.6260, 
    lng: -74.1460, 
    km: 5.2, 
    intermodal: 'Troncal Boyacá',
    zone: 'Bosa / Kennedy',
    zoneColor: '#10B981',
    zoneBgLight: '#ECFDF5',
    zoneText: '#065F46'
  },
  { 
    id: 5,  
    code: 'E5',  
    name: 'Av. Primero de Mayo con Av. 68', 
    shortName: 'Av. 68', 
    localidad: 'Kennedy', 
    lat: 4.6290, 
    lng: -74.1340, 
    km: 7.0, 
    intermodal: 'Troncal Av. 68 TM',
    zone: 'Bosa / Kennedy',
    zoneColor: '#10B981',
    zoneBgLight: '#ECFDF5',
    zoneText: '#065F46'
  },

  // ── ZONA 2: NQS / PUENTE ARANDA (AMARILLOS #F59E0B) ──
  { 
    id: 6,  
    code: 'E6',  
    name: 'Av. Primero de Mayo con Cra 50', 
    shortName: 'Cra 50', 
    localidad: 'Puente Aranda', 
    lat: 4.6310, 
    lng: -74.1200, 
    km: 8.8, 
    intermodal: null,
    zone: 'NQS / Puente Aranda',
    zoneColor: '#F59E0B',
    zoneBgLight: '#FFFBEB',
    zoneText: '#92400E'
  },
  { 
    id: 7,  
    code: 'E7',  
    name: 'Av. Primero de Mayo con NQS', 
    shortName: 'NQS / 1 de Mayo', 
    localidad: 'Antonio Nariño', 
    lat: 4.6260, 
    lng: -74.1060, 
    km: 10.7, 
    intermodal: 'Troncal NQS Sur TM',
    zone: 'NQS / Puente Aranda',
    zoneColor: '#F59E0B',
    zoneBgLight: '#FFFBEB',
    zoneText: '#92400E'
  },
  { 
    id: 8,  
    code: 'E8',  
    name: 'NQS con Calle 8 Sur', 
    shortName: 'Calle 8 Sur', 
    localidad: 'Antonio Nariño', 
    lat: 4.6240, 
    lng: -74.0940, 
    km: 12.3, 
    intermodal: 'Est. SENA / TM',
    zone: 'NQS / Puente Aranda',
    zoneColor: '#F59E0B',
    zoneBgLight: '#FFFBEB',
    zoneText: '#92400E'
  },
  { 
    id: 9,  
    code: 'E9',  
    name: 'Calle 1 con Carrera 24', 
    shortName: 'Calle 1 / Cra 24', 
    localidad: 'Los Mártires', 
    lat: 4.6210, 
    lng: -74.0820, 
    km: 14.1, 
    intermodal: null,
    zone: 'NQS / Puente Aranda',
    zoneColor: '#F59E0B',
    zoneBgLight: '#FFFBEB',
    zoneText: '#92400E'
  },
  { 
    id: 10, 
    code: 'E10', 
    name: 'Calle 1 con Carrera 10', 
    shortName: 'Hortúa / Cra 10', 
    localidad: 'Santa Fe / San Cristóbal', 
    lat: 4.6180, 
    lng: -74.0720, 
    km: 15.6, 
    intermodal: 'Troncal Cra 10 TM',
    zone: 'NQS / Puente Aranda',
    zoneColor: '#F59E0B',
    zoneBgLight: '#FFFBEB',
    zoneText: '#92400E'
  },

  // ── ZONA 3: CENTRO / CARACAS (PÚRPURAS #8B5CF6) ──
  { 
    id: 11, 
    code: 'E11', 
    name: 'Av. Caracas con Calle 11', 
    shortName: 'Tercer Milenio', 
    localidad: 'Santa Fe / Los Mártires', 
    lat: 4.6210, 
    lng: -74.0700, 
    km: 17.2, 
    intermodal: 'Portal Tercer Milenio',
    zone: 'Centro / Caracas',
    zoneColor: '#8B5CF6',
    zoneBgLight: '#F5F3FF',
    zoneText: '#5B21B6'
  },
  { 
    id: 12, 
    code: 'E12', 
    name: 'Av. Caracas con Calle 26', 
    shortName: 'Calle 26 / Centro', 
    localidad: 'Santa Fe / Teusaquillo', 
    lat: 4.6270, 
    lng: -74.0660, 
    km: 18.9, 
    intermodal: 'Troncal Calle 26 TM',
    zone: 'Centro / Caracas',
    zoneColor: '#8B5CF6',
    zoneBgLight: '#F5F3FF',
    zoneText: '#5B21B6'
  },
  { 
    id: 13, 
    code: 'E13', 
    name: 'Av. Caracas con Calle 45', 
    shortName: 'Marly / Calle 45', 
    localidad: 'Chapinero / Teusaquillo', 
    lat: 4.6360, 
    lng: -74.0640, 
    km: 20.6, 
    intermodal: 'Estación Marly TM',
    zone: 'Centro / Caracas',
    zoneColor: '#8B5CF6',
    zoneBgLight: '#F5F3FF',
    zoneText: '#5B21B6'
  },
  { 
    id: 14, 
    code: 'E14', 
    name: 'Av. Caracas con Calle 53', 
    shortName: 'Lourdes / Calle 53', 
    localidad: 'Chapinero', 
    lat: 4.6470, 
    lng: -74.0630, 
    km: 21.7, 
    intermodal: 'Estación Calle 57 TM',
    zone: 'Centro / Caracas',
    zoneColor: '#8B5CF6',
    zoneBgLight: '#F5F3FF',
    zoneText: '#5B21B6'
  },
  { 
    id: 15, 
    code: 'E15', 
    name: 'Av. Caracas con Calle 63', 
    shortName: 'Campín / Calle 63', 
    localidad: 'Chapinero / Barrios Unidos', 
    lat: 4.6560, 
    lng: -74.0620, 
    km: 22.8, 
    intermodal: 'Estación Calle 63 TM',
    zone: 'Centro / Caracas',
    zoneColor: '#8B5CF6',
    zoneBgLight: '#F5F3FF',
    zoneText: '#5B21B6'
  },
  { 
    id: 16, 
    code: 'E16', 
    name: 'Av. Caracas con Calle 72', 
    shortName: 'Calle 72 (Intercambiador)', 
    localidad: 'Barrios Unidos / Chapinero', 
    lat: 4.6640, 
    lng: -74.0610, 
    km: 23.9, 
    intermodal: 'Intercambiador L2 & TM',
    zone: 'Centro / Caracas',
    zoneColor: '#8B5CF6',
    zoneBgLight: '#F5F3FF',
    zoneText: '#5B21B6'
  }
];

// ── LÍMITES GEOGRÁFICOS DE PROYECCIÓN CARTOGRÁFICA (BOGOTÁ EXTENDIDA) ──
const GEO_BBOX = {
  minLng: -74.1950,
  maxLng: -74.0450,
  minLat: 4.5950,
  maxLat: 4.6750
};

const CANVAS_WIDTH = 1300;
const CANVAS_HEIGHT = 750;

// Proyección cartesiana equirrectangular adaptada para el visor OpenStreetMap / Mapbox Light
const projectGeoToCanvas = (lat, lng) => {
  const x = ((lng - GEO_BBOX.minLng) / (GEO_BBOX.maxLng - GEO_BBOX.minLng)) * CANVAS_WIDTH;
  const y = ((GEO_BBOX.maxLat - lat) / (GEO_BBOX.maxLat - GEO_BBOX.minLat)) * CANVAS_HEIGHT;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
};

// ── CORREDORES VIALES PRINCIPALES (OPENSTREETMAP LIGHT STYLE) ──
const BOGOTA_ARTERIAL_ROADS = [
  // Av. Caracas / Autopista Norte
  { id: 'caracas', name: 'Av. Caracas', pts: [[4.600, -74.075], [4.620, -74.070], [4.635, -74.064], [4.655, -74.062], [4.675, -74.060]], type: 'primary' },
  // Carrera 7 / Carrera 10
  { id: 'cra7', name: 'Carrera 7', pts: [[4.595, -74.080], [4.615, -74.073], [4.630, -74.062], [4.650, -74.056], [4.675, -74.051]], type: 'primary' },
  // Av. NQS (Troncal NQS)
  { id: 'nqs', name: 'Av. NQS', pts: [[4.595, -74.150], [4.615, -74.120], [4.625, -74.095], [4.640, -74.080], [4.660, -74.070], [4.675, -74.062]], type: 'highway' },
  // Av. Primero de Mayo
  { id: 'primero-mayo', name: 'Av. Primero de Mayo', pts: [[4.610, -74.175], [4.625, -74.150], [4.630, -74.125], [4.626, -74.106], [4.615, -74.085], [4.595, -74.080]], type: 'primary' },
  // Av. Carrera 68
  { id: 'cra68', name: 'Av. Carrera 68', pts: [[4.595, -74.140], [4.625, -74.134], [4.645, -74.110], [4.665, -74.085], [4.675, -74.078]], type: 'highway' },
  // Av. Boyacá
  { id: 'boyaca', name: 'Av. Boyacá', pts: [[4.595, -74.160], [4.620, -74.150], [4.645, -74.135], [4.665, -74.110], [4.675, -74.095]], type: 'highway' },
  // Av. Villavicencio
  { id: 'villavicencio', name: 'Av. Villavicencio', pts: [[4.605, -74.185], [4.618, -74.168], [4.623, -74.158], [4.615, -74.140], [4.600, -74.125]], type: 'primary' },
  // Av. Ciudad de Cali
  { id: 'cali', name: 'Av. Ciudad de Cali', pts: [[4.600, -74.195], [4.625, -74.180], [4.645, -74.165], [4.665, -74.145], [4.675, -74.125]], type: 'primary' },
  // Av. Calle 26 (Av. El Dorado)
  { id: 'calle26', name: 'Calle 26 (El Dorado)', pts: [[4.670, -74.135], [4.655, -74.105], [4.640, -74.085], [4.627, -74.066]], type: 'highway' },
  // Av. Calle 13 / Centenario
  { id: 'calle13', name: 'Calle 13 / Centenario', pts: [[4.655, -74.155], [4.640, -74.125], [4.625, -74.090], [4.615, -74.075]], type: 'primary' },
  // Calle 72
  { id: 'calle72', name: 'Calle 72', pts: [[4.660, -74.050], [4.664, -74.061], [4.670, -74.085], [4.675, -74.105]], type: 'secondary' },
  // Calle 80
  { id: 'calle80', name: 'Calle 80', pts: [[4.667, -74.060], [4.672, -74.090], [4.675, -74.115]], type: 'highway' },
  // Autopista Sur
  { id: 'auto-sur', name: 'Autopista Sur', pts: [[4.595, -74.170], [4.600, -74.155], [4.610, -74.135], [4.620, -74.120]], type: 'highway' },
  // Av. de Las Américas
  { id: 'americas', name: 'Av. Las Américas', pts: [[4.615, -74.175], [4.625, -74.145], [4.630, -74.120], [4.632, -74.095], [4.630, -74.075]], type: 'highway' }
];

// ── CUERPOS DE AGUA (RÍOS Y CANALES DE BOGOTÁ) ──
const BOGOTA_WATERWAYS = [
  // Río Bogotá (Borde Occidental)
  { id: 'rio-bogota', name: 'Río Bogotá', pts: [[4.595, -74.195], [4.620, -74.190], [4.650, -74.180], [4.675, -74.165]] },
  // Canal / Río Fucha
  { id: 'rio-fucha', name: 'Canal Río Fucha', pts: [[4.595, -74.085], [4.610, -74.110], [4.625, -74.135], [4.640, -74.175]] },
  // Río Tunjuelo
  { id: 'rio-tunjuelo', name: 'Río Tunjuelo', pts: [[4.595, -74.140], [4.600, -74.160], [4.608, -74.185]] },
  // Canal Arzobispo / Salitre
  { id: 'rio-arzobispo', name: 'Canal Salitre', pts: [[4.635, -74.060], [4.645, -74.080], [4.660, -74.115]] }
];

// ── PARQUES URBANOS DESTACADOS DE BOGOTÁ ──
const BOGOTA_PARKS = [
  { id: 'parque-simon-bolivar', name: 'Parque Simón Bolívar', lat: 4.658, lng: -74.095, rx: 42, ry: 32 },
  { id: 'parque-timiza', name: 'Parque Timiza', lat: 4.614, lng: -74.155, rx: 32, ry: 24 },
  { id: 'parque-cayetano', name: 'Parque Cayetano Cañizares', lat: 4.628, lng: -74.150, rx: 28, ry: 20 },
  { id: 'parque-el-tunal', name: 'Parque El Tunal', lat: 4.597, lng: -74.135, rx: 38, ry: 26 },
  { id: 'parque-nacional', name: 'Parque Nacional', lat: 4.625, lng: -74.062, rx: 30, ry: 25 },
  { id: 'parque-tercer-milenio', name: 'Parque Tercer Milenio', lat: 4.602, lng: -74.078, rx: 20, ry: 18 }
];

// ── NODOS INTERMODALES CON TRANSMILENIO ──
const NODOS_INTERMODALES_TM = [
  { id: 'tm-portal-americas', name: 'Portal Américas', lat: 4.6095, lng: -74.1780, code: 'F01', troncal: 'Américas', linea: 'Línea F' },
  { id: 'tm-av68', name: 'Intermodal Av. 68', lat: 4.6290, lng: -74.1340, code: 'TM-68', troncal: 'Av. 68', linea: 'Intermodal 68' },
  { id: 'tm-nqs-sena', name: 'Intermodal NQS / SENA', lat: 4.6260, lng: -74.1060, code: 'G22', troncal: 'NQS Sur', linea: 'Línea G' },
  { id: 'tm-hortua', name: 'Estación Hortúa', lat: 4.6180, lng: -74.0720, code: 'L08', troncal: 'Carrera 10', linea: 'Línea L' },
  { id: 'tm-tercer-milenio', name: 'Portal Tercer Milenio', lat: 4.6210, lng: -74.0700, code: 'H01', troncal: 'Caracas Sur', linea: 'Línea H' },
  { id: 'tm-calle26', name: 'Centro Memoria / Calle 26', lat: 4.6270, lng: -74.0660, code: 'K05', troncal: 'Calle 26', linea: 'Línea K' },
  { id: 'tm-marly', name: 'Estación Marly', lat: 4.6360, lng: -74.0640, code: 'A12', troncal: 'Caracas Centro', linea: 'Línea A' },
  { id: 'tm-calle72', name: 'Intercambiador Calle 72', lat: 4.6640, lng: -74.0610, code: 'A01', troncal: 'Caracas Norte', linea: 'Línea A / L2' }
];

export const MiniTrajectoryMapReal = ({ 
  originId, 
  destId, 
  dark = false, 
  onSelectStation,
  compact = false 
}) => {
  const { t } = useI18n();

  const [hoveredStation, setHoveredStation] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [showRoadGrid, setShowRoadGrid] = useState(true);
  const [showTMNodes, setShowTMNodes] = useState(true);

  // Mapeo proyectado de las 16 estaciones oficiales al lienzo OpenStreetMap / Mapbox Light
  const stations = useMemo(() => {
    return L1_GEO_STATIONS.map(st => {
      const { x, y } = projectGeoToCanvas(st.lat, st.lng);
      return {
        ...st,
        x,
        y,
        isOrigin: Number(originId) === st.id,
        isDest: Number(destId) === st.id,
        isTerminal: Number(originId) === st.id || Number(destId) === st.id
      };
    });
  }, [originId, destId]);

  // Estaciones involucradas en el viaje seleccionado
  const { tripStations, minTripId, maxTripId, isSelectedTrip } = useMemo(() => {
    const oId = Number(originId);
    const dId = Number(destId);

    if (!oId || !dId) {
      return { tripStations: [], minTripId: 0, maxTripId: 0, isSelectedTrip: false };
    }

    const minId = Math.min(oId, dId);
    const maxId = Math.max(oId, dId);

    const trip = stations.filter(s => s.id >= minId && s.id <= maxId);
    return {
      tripStations: trip,
      minTripId: minId,
      maxTripId: maxId,
      isSelectedTrip: true
    };
  }, [stations, originId, destId]);

  // Trazo completo del viaducto L1MB (23.9 km)
  const fullViaductPath = useMemo(() => {
    if (stations.length === 0) return '';
    return stations.reduce((acc, st, i) => {
      return i === 0 ? `M ${st.x} ${st.y}` : `${acc} L ${st.x} ${st.y}`;
    }, '');
  }, [stations]);

  // Trazo del segmento activo del viaje (rojo vibrante del metro)
  const activeTripPath = useMemo(() => {
    if (tripStations.length < 2) return '';
    return tripStations.reduce((acc, st, i) => {
      return i === 0 ? `M ${st.x} ${st.y}` : `${acc} L ${st.x} ${st.y}`;
    }, '');
  }, [tripStations]);

  // Proyección de la malla vial de Bogotá estilo OSM Light
  const projectedRoads = useMemo(() => {
    return BOGOTA_ARTERIAL_ROADS.map(road => {
      const d = road.pts.reduce((acc, [lat, lng], idx) => {
        const { x, y } = projectGeoToCanvas(lat, lng);
        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
      }, '');
      return { ...road, path: d };
    });
  }, []);

  // Proyección de los cuerpos de agua (Ríos y Canales)
  const projectedWaterways = useMemo(() => {
    return BOGOTA_WATERWAYS.map(river => {
      const d = river.pts.reduce((acc, [lat, lng], idx) => {
        const { x, y } = projectGeoToCanvas(lat, lng);
        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
      }, '');
      return { ...river, path: d };
    });
  }, []);

  // Proyección de parques
  const projectedParks = useMemo(() => {
    return BOGOTA_PARKS.map(p => {
      const { x, y } = projectGeoToCanvas(p.lat, p.lng);
      return { ...p, x, y };
    });
  }, []);

  // Proyección de nodos intermodales con TransMilenio
  const projectedTMNodes = useMemo(() => {
    return NODOS_INTERMODALES_TM.map(node => {
      const { x, y } = projectGeoToCanvas(node.lat, node.lng);
      return { ...node, x, y };
    });
  }, []);

  // ── RECALCULO DINÁMICO DEL VIEWBOX (ZOOM AUTOMÁTICO AL TRAMO ELEGIDO) ──
  const dynamicViewBox = useMemo(() => {
    if (!isSelectedTrip || tripStations.length === 0) {
      return `0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`;
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    tripStations.forEach(s => {
      if (s.x < minX) minX = s.x;
      if (s.x > maxX) maxX = s.x;
      if (s.y < minY) minY = s.y;
      if (s.y > maxY) maxY = s.y;
    });

    // Margen holgado para acoger los círculos numerados, sombras y badges de texto
    const paddingX = Math.max(85, (maxX - minX) * 0.26);
    const paddingY = Math.max(75, (maxY - minY) * 0.32);

    let boxX = Math.max(0, minX - paddingX);
    let boxY = Math.max(0, minY - paddingY);
    let boxW = (maxX - minX) + paddingX * 2;
    let boxH = (maxY - minY) + paddingY * 2;

    // Ajuste de aspect ratio panorámico 16:9
    const targetAspect = 16 / 9;
    const currentAspect = boxW / boxH;

    if (currentAspect < targetAspect) {
      const newW = boxH * targetAspect;
      boxX = Math.max(0, boxX - (newW - boxW) / 2);
      boxW = newW;
    } else {
      const newH = boxW / targetAspect;
      boxY = Math.max(0, boxY - (newH - boxH) / 2);
      boxH = newH;
    }

    boxW = Math.min(CANVAS_WIDTH, boxW);
    boxH = Math.min(CANVAS_HEIGHT, boxH);
    if (boxX + boxW > CANVAS_WIDTH) boxX = CANVAS_WIDTH - boxW;
    if (boxY + boxH > CANVAS_HEIGHT) boxY = CANVAS_HEIGHT - boxH;

    return `${Math.round(boxX)} ${Math.round(boxY)} ${Math.round(boxW)} ${Math.round(boxH)}`;
  }, [isSelectedTrip, tripStations]);

  // Terminales de referencia
  const originStation = stations.find(s => s.isOrigin);
  const destStation = stations.find(s => s.isDest);

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-[#F4F3ED] text-slate-800 shadow-xl overflow-hidden relative select-none">
      {/* ── ENCABEZADO ESTILO OPENSTREETMAP / MAPBOX LIGHT CON BADGES DE TRANSPARENCIA ── */}
      <div className="px-4 sm:px-6 py-3 border-b border-slate-200/90 bg-white/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-950/20">
            <Compass size={17} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                Cartografía Oficial Bogotá D.C. · OpenStreetMap Light
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Línea 1 Metro
              </span>
            </div>
            <p className="text-[10.5px] text-slate-500 font-medium">
              Geolocalización satelital, cerros orientales, hidrografía y estaciones por zonas de color
            </p>
          </div>
        </div>

        {/* Badges de Transparencia Oficial EMB y UrbanGo */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Badge Oficial EMB */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-[10px] text-slate-700">
            <ShieldCheck size={12} className="text-emerald-600 shrink-0" />
            <span className="font-bold">Datos Oficiales EMB</span>
            <span className="text-[8.5px] px-1 py-0.2 bg-slate-200 rounded text-slate-700 font-mono">PE V14</span>
          </div>

          {/* Badge Algorítmico UrbanGo */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-[10px] text-amber-900">
            <Sparkles size={11} className="text-amber-600 shrink-0" />
            <span className="font-bold">Simulación Calculada UrbanGo</span>
          </div>

          {/* Toggles de capas */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5 text-[10px]">
            <button
              onClick={() => setShowRoadGrid(!showRoadGrid)}
              className={`px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                showRoadGrid ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Alternar Malla Vial"
            >
              <Navigation size={10} className="text-slate-600" />
              <span className="hidden sm:inline">Malla Vial</span>
            </button>
            <button
              onClick={() => setShowTMNodes(!showTMNodes)}
              className={`px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                showTMNodes ? 'bg-red-50 text-red-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Alternar TransMilenio"
            >
              <Bus size={10} />
              <span className="hidden sm:inline">TransMilenio</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── LEYENDA SUPERIOR DE ZONAS CROMÁTICAS (VERDES, AMARILLOS, PÚRPURAS) ── */}
      <div className="px-4 sm:px-6 py-2 bg-slate-50 border-b border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-[10px]">
        <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">
          Zonas de Estaciones:
        </span>
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Zona 1: Bosa / Kennedy (Verdes) */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300/80 text-emerald-800 font-bold">
            <span className="w-3.5 h-3.5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[8px] font-black shadow-xs">
              1-5
            </span>
            <span>Verdes: Bosa / Kennedy</span>
          </div>

          {/* Zona 2: NQS / Puente Aranda (Amarillos) */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-300/80 text-amber-800 font-bold">
            <span className="w-3.5 h-3.5 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-[8px] font-black shadow-xs">
              6-10
            </span>
            <span>Amarillos: NQS / Puente Aranda</span>
          </div>

          {/* Zona 3: Centro / Caracas (Púrpuras) */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-50 border border-purple-300/80 text-purple-800 font-bold">
            <span className="w-3.5 h-3.5 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center text-[8px] font-black shadow-xs">
              11-16
            </span>
            <span>Púrpuras: Centro / Caracas</span>
          </div>
        </div>
      </div>

      {/* ── LIENZO CARTOGRÁFICO SVG EN ESTILO OPENSTREETMAP / MAPBOX LIGHT ── */}
      <div className="relative w-full h-[320px] sm:h-[400px] md:h-[440px] bg-[#F4F3ED] overflow-hidden flex items-center justify-center">
        {/* Rosa de los vientos / HUD Norte */}
        <div className="absolute top-3 right-3 flex flex-col items-center pointer-events-none bg-white/90 p-1.5 rounded-xl border border-slate-300 shadow-sm z-10">
          <div className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center bg-slate-50">
            <span className="text-[9px] font-black text-slate-800 font-mono">N</span>
          </div>
          <span className="text-[7.5px] font-mono text-slate-500 mt-0.5">000°</span>
        </div>

        {/* Coordenadas en la esquina inferior */}
        <div className="absolute bottom-2 right-3 text-[8.5px] font-mono text-slate-500 pointer-events-none z-10 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
          MAGNA-SIRGAS BOGOTÁ · OSM Light Style
        </div>

        {/* SVG CARTOGRÁFICO REAL CON ZOOM DINÁMICO */}
        <svg
          viewBox={dynamicViewBox}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full transition-all duration-700 ease-out"
        >
          <defs>
            {/* Sombra de contraste para marcadores y etiquetas */}
            <filter id="osmStationShadow" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0F172A" floodOpacity="0.22" />
            </filter>

            <filter id="osmPillShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.18" />
            </filter>

            {/* Sombra suave para la línea activa del metro */}
            <filter id="osmLineShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#B91C1C" floodOpacity="0.35" />
            </filter>

            {/* Gradiente de elevación de los Cerros Orientales */}
            <linearGradient id="cerrosGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D9EDCE" stopOpacity="0.7" />
              <stop offset="35%" stopColor="#C4E2B5" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#ADD69B" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#96C882" stopOpacity="1" />
            </linearGradient>

            {/* Gradiente para ríos y canales */}
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C8E4F8" />
              <stop offset="100%" stopColor="#ADD6F5" />
            </linearGradient>

            {/* Textura de retícula urbana tenue (OpenStreetMap blocks) */}
            <pattern id="urbanBlocks" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#EAE6DC" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* 1. FONDO BASE URBANO DE BOGOTÁ */}
          <rect x="0" y="0" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#F4F3ED" />
          <rect x="0" y="0" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="url(#urbanBlocks)" />

          {/* 2. ÁREA VERDOSA DE LOS CERROS ORIENTALES (FRANJA MONTAÑOSA ORIENTAL) */}
          <g id="capa-cerros-orientales">
            {/* Polígono montañoso de los Cerros Orientales (flanco oriental de Bogotá) */}
            <path
              d={`M ${CANVAS_WIDTH * 0.77} 0 
                 Q ${CANVAS_WIDTH * 0.79} ${CANVAS_HEIGHT * 0.25}, ${CANVAS_WIDTH * 0.76} ${CANVAS_HEIGHT * 0.5} 
                 T ${CANVAS_WIDTH * 0.78} ${CANVAS_HEIGHT} 
                 L ${CANVAS_WIDTH} ${CANVAS_HEIGHT} 
                 L ${CANVAS_WIDTH} 0 Z`}
              fill="url(#cerrosGradient)"
            />

            {/* Curvas de nivel topográficas suaves sobre los Cerros */}
            <path
              d={`M ${CANVAS_WIDTH * 0.82} 0 Q ${CANVAS_WIDTH * 0.84} ${CANVAS_HEIGHT * 0.3}, ${CANVAS_WIDTH * 0.81} ${CANVAS_HEIGHT * 0.6} T ${CANVAS_WIDTH * 0.83} ${CANVAS_HEIGHT}`}
              fill="none"
              stroke="#8DBF76"
              strokeWidth="1.2"
              strokeDasharray="6,4"
              opacity="0.6"
            />
            <path
              d={`M ${CANVAS_WIDTH * 0.88} 0 Q ${CANVAS_WIDTH * 0.90} ${CANVAS_HEIGHT * 0.4}, ${CANVAS_WIDTH * 0.87} ${CANVAS_HEIGHT * 0.7} T ${CANVAS_WIDTH * 0.89} ${CANVAS_HEIGHT}`}
              fill="none"
              stroke="#7EAF66"
              strokeWidth="1.2"
              opacity="0.6"
            />

            {/* Etiquetas cartográficas sobre los Cerros */}
            <text
              x={CANVAS_WIDTH * 0.88}
              y={CANVAS_HEIGHT * 0.22}
              textAnchor="middle"
              className="fill-[#456C36] text-[11px] font-black tracking-widest uppercase select-none opacity-85 font-sans"
            >
              Cerros Orientales
            </text>
            <text
              x={CANVAS_WIDTH * 0.89}
              y={CANVAS_HEIGHT * 0.45}
              textAnchor="middle"
              className="fill-[#4F783D] text-[9.5px] font-bold select-none opacity-80"
            >
              ▲ Monserrate (3.152 m)
            </text>
            <text
              x={CANVAS_WIDTH * 0.88}
              y={CANVAS_HEIGHT * 0.72}
              textAnchor="middle"
              className="fill-[#4F783D] text-[9.5px] font-bold select-none opacity-80"
            >
              ▲ Guadalupe (3.250 m)
            </text>
          </g>

          {/* 3. PARQUES URBANOS EN TONOS VERDES NATURALES */}
          <g id="capa-parques-urbanos">
            {projectedParks.map(park => (
              <g key={`park-${park.id}`}>
                <ellipse
                  cx={park.x}
                  cy={park.y}
                  rx={park.rx}
                  ry={park.ry}
                  fill="#CCE5B7"
                  stroke="#B0D594"
                  strokeWidth="1"
                  opacity="0.9"
                />
                <text
                  x={park.x}
                  y={park.y + 2.5}
                  textAnchor="middle"
                  className="fill-[#3F6330] text-[7.5px] font-bold select-none pointer-events-none"
                >
                  {park.name.replace('Parque ', '')}
                </text>
              </g>
            ))}
          </g>

          {/* 4. HIDROGRAFÍA (RÍOS Y CANALES DE AGUA) */}
          <g id="capa-hidrografia">
            {projectedWaterways.map(river => (
              <g key={`river-${river.id}`}>
                <path
                  d={river.path}
                  fill="none"
                  stroke="#C0E0F6"
                  strokeWidth={river.id === 'rio-bogota' ? 7 : 3.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={river.path}
                  fill="none"
                  stroke="#9ACDF0"
                  strokeWidth={river.id === 'rio-bogota' ? 3.5 : 1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            ))}
          </g>

          {/* 5. MALLA VIAL DE BOGOTÁ (ESTILO OPENSTREETMAP LIGHT) */}
          {showRoadGrid && (
            <g id="capa-malla-vial">
              {projectedRoads.map(road => {
                const isHighway = road.type === 'highway';
                const isPrimary = road.type === 'primary';

                return (
                  <g key={`road-${road.id}`}>
                    {/* Trazo exterior / borde de la vía (casing OSM) */}
                    <path
                      d={road.path}
                      fill="none"
                      stroke={isHighway ? '#E5D5BA' : isPrimary ? '#E2DAC8' : '#ECE5D8'}
                      strokeWidth={isHighway ? 7 : isPrimary ? 5 : 3.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Relleno interior blanco / crema cálido de la vía */}
                    <path
                      d={road.path}
                      fill="none"
                      stroke={isHighway ? '#FFF8E6' : '#FFFFFF'}
                      strokeWidth={isHighway ? 4.8 : isPrimary ? 3.2 : 2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* 6. NODOS INTERMODALES TRANSMILENIO */}
          {showTMNodes && (
            <g id="capa-nodos-tm">
              {projectedTMNodes.map(node => (
                <g 
                  key={`tm-node-${node.id}`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={6}
                    fill="#EF4444"
                    stroke="#FFFFFF"
                    strokeWidth={1.5}
                    filter="url(#osmPillShadow)"
                  />
                  <text
                    x={node.x}
                    y={node.y + 2.5}
                    textAnchor="middle"
                    className="fill-white text-[6.5px] font-black pointer-events-none select-none"
                  >
                    T
                  </text>
                </g>
              ))}
            </g>
          )}

          {/* 7. VIADUCTO LÍNEA 1 METRO: LÍNEA INACTIVA COMPLETA (23.9 KM) */}
          <path
            d={fullViaductPath}
            fill="none"
            stroke="#DCD7CE"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={fullViaductPath}
            fill="none"
            stroke="#A39D92"
            strokeWidth={2}
            strokeDasharray="4,4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 8. SEGMENTO ACTIVO DEL VIAJE: LÍNEA ROJA DEL METRO (OFICIAL L1) */}
          {activeTripPath && (
            <g id="tramo-viaje-activo">
              {/* Borde exterior blanco para alto contraste contra el mapa claro */}
              <path
                d={activeTripPath}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={9}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#osmLineShadow)"
              />
              {/* Línea principal rojo metro */}
              <path
                d={activeTripPath}
                fill="none"
                stroke="#DC2626"
                strokeWidth={5.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Línea central fina blanca de guía */}
              <path
                d={activeTripPath}
                fill="none"
                stroke="#FEE2E2"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* 9. ESTACIONES L1: CÍRCULOS NUMERADOS DE COLORES POR ZONA */}
          {stations.map(st => {
            const inTrip = isSelectedTrip && st.id >= minTripId && st.id <= maxTripId;

            // ── CASO A: ESTACIONES FUERA DEL TRAYECTO (OPACIDAD MODERADA) ──
            if (!inTrip) {
              return (
                <g 
                  key={`st-outside-${st.id}`}
                  className="opacity-45 hover:opacity-90 transition-opacity cursor-pointer"
                  onClick={() => onSelectStation && onSelectStation(st.id)}
                  onMouseEnter={() => setHoveredStation(st)}
                  onMouseLeave={() => setHoveredStation(null)}
                >
                  {/* Círculo numerado con el color de su zona */}
                  <circle
                    cx={st.x}
                    cy={st.y}
                    r={9.5}
                    fill={st.zoneColor}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    filter="url(#osmStationShadow)"
                  />
                  {/* Número de la estación */}
                  <text
                    x={st.x}
                    y={st.y + 3.2}
                    textAnchor="middle"
                    className="fill-white text-[8px] font-black pointer-events-none select-none font-sans"
                  >
                    {st.id}
                  </text>
                  {/* Nombre tenue */}
                  <text
                    x={st.x}
                    y={st.y + (st.id % 2 === 0 ? 18 : -14)}
                    textAnchor="middle"
                    className="fill-slate-600 text-[7px] font-bold select-none pointer-events-none"
                  >
                    {st.shortName.slice(0, 10)}
                  </text>
                </g>
              );
            }

            // ── CASO B: ESTACIONES TERMINALES (ORIGEN / DESTINO) ──
            if (st.isTerminal) {
              return (
                <g
                  key={`st-terminal-${st.id}`}
                  className="cursor-pointer"
                  onClick={() => onSelectStation && onSelectStation(st.id)}
                  onMouseEnter={() => setHoveredStation(st)}
                  onMouseLeave={() => setHoveredStation(null)}
                >
                  {/* Onda de pulso expansivo animado en el color de su zona */}
                  <circle
                    cx={st.x}
                    cy={st.y}
                    r={22}
                    fill={st.zoneColor}
                    opacity={0.3}
                    className="animate-ping origin-center"
                    style={{ transformOrigin: `${st.x}px ${st.y}px`, animationDuration: '2s' }}
                  />

                  {/* Halo exterior blanco de contraste */}
                  <circle
                    cx={st.x}
                    cy={st.y}
                    r={16}
                    fill="#FFFFFF"
                    filter="url(#osmStationShadow)"
                  />

                  {/* CÍRCULO NUMERADO COLOREADO TERMINAL */}
                  <circle
                    cx={st.x}
                    cy={st.y}
                    r={13.5}
                    fill={st.zoneColor}
                    stroke="#FFFFFF"
                    strokeWidth={2.8}
                  />

                  {/* NÚMERO DE LA ESTACIÓN DENTRO DEL CÍRCULO */}
                  <text
                    x={st.x}
                    y={st.y + 4.5}
                    textAnchor="middle"
                    className="fill-white text-[11px] font-black pointer-events-none select-none font-sans"
                  >
                    {st.id}
                  </text>

                  {/* BADGE SUPERIOR: ORIGEN / DESTINO */}
                  <g 
                    transform={`translate(${st.x}, ${st.y + (st.id % 2 === 0 ? 25 : -24)})`}
                    filter="url(#osmPillShadow)"
                  >
                    <rect
                      x={-34}
                      y={-9}
                      width={68}
                      height={18}
                      rx={9}
                      fill={st.isOrigin ? '#059669' : '#DC2626'}
                      stroke="#FFFFFF"
                      strokeWidth={1.8}
                    />
                    <text
                      x={0}
                      y={3.5}
                      textAnchor="middle"
                      className="fill-white text-[8.5px] font-black tracking-wider uppercase select-none font-sans"
                    >
                      {st.isOrigin ? 'ORIGEN' : 'DESTINO'}
                    </text>
                  </g>

                  {/* BADGE INFERIOR: NOMBRE OFICIAL DE LA ESTACIÓN */}
                  <g 
                    transform={`translate(${st.x}, ${st.y + (st.id % 2 === 0 ? 46 : -43)})`}
                    filter="url(#osmPillShadow)"
                  >
                    <rect
                      x={-60}
                      y={-9.5}
                      width={120}
                      height={19}
                      rx={6}
                      fill="#FFFFFF"
                      stroke={st.zoneColor}
                      strokeWidth={1.5}
                    />
                    <text
                      x={0}
                      y={3.5}
                      textAnchor="middle"
                      className="fill-slate-900 text-[9px] font-black select-none tracking-tight font-sans"
                    >
                      {st.code} · {st.shortName.slice(0, 15)}
                    </text>
                  </g>
                </g>
              );
            }

            // ── CASO C: ESTACIONES INTERMEDIAS DENTRO DEL VIAJE ELEGIDO ──
            return (
              <g
                key={`st-intermediate-${st.id}`}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectStation && onSelectStation(st.id)}
                onMouseEnter={() => setHoveredStation(st)}
                onMouseLeave={() => setHoveredStation(null)}
              >
                {/* Halo exterior blanco de contraste */}
                <circle
                  cx={st.x}
                  cy={st.y}
                  r={13}
                  fill="#FFFFFF"
                  filter="url(#osmStationShadow)"
                />

                {/* CÍRCULO NUMERADO CON SU COLOR DE ZONA (VERDE, AMARILLO O PÚRPURA) */}
                <circle
                  cx={st.x}
                  cy={st.y}
                  r={11}
                  fill={st.zoneColor}
                  stroke="#FFFFFF"
                  strokeWidth={2.2}
                />

                {/* NÚMERO DE LA ESTACIÓN CENTRADO */}
                <text
                  x={st.x}
                  y={st.y + 3.8}
                  textAnchor="middle"
                  className="fill-white text-[9.5px] font-black pointer-events-none select-none font-sans"
                >
                  {st.id}
                </text>

                {/* NOMBRE DE LA ESTACIÓN EN CÁPSULA BLANCA DE ALTO CONTRASTE */}
                <g 
                  transform={`translate(${st.x}, ${st.y + (st.id % 2 === 0 ? 21 : -19)})`}
                  filter="url(#osmPillShadow)"
                >
                  <rect
                    x={-36}
                    y={-8}
                    width={72}
                    height={16}
                    rx={5}
                    fill="#FFFFFF"
                    stroke={st.zoneColor}
                    strokeWidth={1.2}
                  />
                  <text
                    x={0}
                    y={3}
                    textAnchor="middle"
                    className="fill-slate-900 text-[8.5px] font-black select-none tracking-tight font-sans"
                  >
                    {st.shortName.slice(0, 11)}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* TOOLTIP FLOTANTE AL PASAR EL CURSOR SOBRE UNA ESTACIÓN */}
        <AnimatePresence>
          {hoveredStation && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-3 left-3 pointer-events-none p-3 rounded-2xl bg-white/95 border border-slate-300 shadow-xl backdrop-blur-md max-w-[270px] z-30"
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div 
                  className="w-7 h-7 rounded-full text-white flex items-center justify-center text-[12px] font-black shadow-xs"
                  style={{ backgroundColor: hoveredStation.zoneColor }}
                >
                  {hoveredStation.id}
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-black text-slate-900">{hoveredStation.name}</p>
                  <p className="text-[10px] font-bold text-slate-500">
                    Zona {hoveredStation.zone}
                  </p>
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-200 text-[10px] flex items-center justify-between text-slate-600">
                <span>Progresiva: <strong>K{hoveredStation.km}</strong></span>
                {hoveredStation.intermodal && (
                  <span className="text-red-700 font-bold flex items-center gap-1 bg-red-50 px-1.5 py-0.5 rounded">
                    <Bus size={10} /> {hoveredStation.intermodal}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOOLTIP FLOTANTE SOBRE NODO TRANSMILENIO */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-12 left-3 pointer-events-none p-2.5 rounded-2xl bg-white/95 border border-red-200 shadow-xl backdrop-blur-md max-w-[240px] z-30"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-red-600 text-white flex items-center justify-center text-[10px] font-black">
                  TM
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-black text-slate-900">{hoveredNode.name}</p>
                  <p className="text-[9.5px] text-red-600 font-bold">{hoveredNode.troncal}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── PIE DE CONTROL INFORMATIVO DEL TRAYECTO ── */}
      <div className="px-4 sm:px-6 py-3 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Resumen del tramo seleccionado */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5">
            <span 
              className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[9px] font-black shadow-xs"
              style={{ backgroundColor: originStation?.zoneColor || '#10B981' }}
            >
              {originStation?.id || '1'}
            </span>
            <span className="font-bold text-slate-900 text-[11px]">
              {originStation ? `${originStation.code} (${originStation.shortName})` : 'Origen'}
            </span>
          </div>

          <span className="text-slate-400 font-bold">➔</span>

          <div className="flex items-center gap-1.5">
            <span 
              className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[9px] font-black shadow-xs"
              style={{ backgroundColor: destStation?.zoneColor || '#8B5CF6' }}
            >
              {destStation?.id || '16'}
            </span>
            <span className="font-bold text-slate-900 text-[11px]">
              {destStation ? `${destStation.code} (${destStation.shortName})` : 'Destino'}
            </span>
          </div>

          <span className="text-slate-300 hidden sm:inline">|</span>

          <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
            {tripStations.length} estaciones en el tramo ({Math.abs((destStation?.km || 0) - (originStation?.km || 0)).toFixed(1)} km de viaducto)
          </span>
        </div>

        {/* Leyenda y simbología */}
        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1.5 rounded-full bg-red-600 shadow-xs" />
            <span className="font-bold text-slate-700">Viaducto L1</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1.5 rounded-full bg-[#E5D5BA]" />
            <span>Vías Principales</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
            <span>Cerros / Parques</span>
          </div>
        </div>
      </div>
    </div>
  );
};
