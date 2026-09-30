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
  ChevronUp
} from 'lucide-react';
import { useI18n } from '../i18nContext';
import { CAPAS_MAPA_METRO } from '../data/metroOfficialData';

// === CONSTANTES DEL SISTEMA DE DESPACHO CONTINUO ===
const HEADWAY_MS = 40000;           // Salida de una nueva pareja de trenes cada 40 segundos exactos
const JOURNEY_DURATION_MS = 120000; // Recorrido completo terminal a terminal: 120 segundos

export const DEFAULT_16_STATIONS = [
  { id: 1,  code: 'E1',  name: 'E1 - Patio Taller Bosa / Gibraltar', loc: 'st_loc_bosa',      lat: 4.6095, lng: -74.1780, status: 'En obra', progress: '91%', alert: false },
  { id: 2,  code: 'E2',  name: 'E2 - Av. Villavicencio',              loc: 'st_loc_kennedy',   lat: 4.6180, lng: -74.1680, status: 'En obra', progress: '37%', alert: false },
  { id: 3,  code: 'E3',  name: 'E3 - Av. Boyacá',                     loc: 'st_loc_kennedy',   lat: 4.6230, lng: -74.1580, status: 'En obra', progress: '34%', alert: false },
  { id: 4,  code: 'E4',  name: 'E4 - Américas',                       loc: 'st_loc_kennedy',   lat: 4.6260, lng: -74.1460, status: 'En obra', progress: '31%', alert: false },
  { id: 5,  code: 'E5',  name: 'E5 - Av. Las Américas',               loc: 'st_loc_kennedy',   lat: 4.6290, lng: -74.1340, status: 'En obra', progress: '28%', alert: false },
  { id: 6,  code: 'E6',  name: 'E6 - Américas / NQS',                 loc: 'st_loc_kennedy',   lat: 4.6310, lng: -74.1200, status: 'En obra', progress: '25%', alert: false },
  { id: 7,  code: 'E7',  name: 'E7 - Av. Primero de Mayo',            loc: 'st_loc_puente',    lat: 4.6260, lng: -74.1060, status: 'En obra', progress: '22%', alert: false },
  { id: 8,  code: 'E8',  name: 'E8 - Puente Aranda',                  loc: 'st_loc_puente',    lat: 4.6240, lng: -74.0940, status: 'En obra', progress: '20%', alert: false },
  { id: 9,  code: 'E9',  name: 'E9 - Ferrocarril',                    loc: 'st_loc_puente',    lat: 4.6210, lng: -74.0820, status: 'En obra', progress: '18%', alert: false },
  { id: 10, code: 'E10', name: 'E10 - Calle 1 / Caracas',             loc: 'st_loc_martires',  lat: 4.6180, lng: -74.0720, status: 'En obra', progress: '17%', alert: false },
  { id: 11, code: 'E11', name: 'E11 - Calle 3 / Caracas',             loc: 'st_loc_martires',  lat: 4.6210, lng: -74.0700, status: 'Cerrada', progress: '16%', alert: false },
  { id: 12, code: 'E12', name: 'E12 - Av. Jiménez',                   loc: 'st_loc_santafe',   lat: 4.6270, lng: -74.0660, status: 'Cerrada', progress: '15%', alert: false },
  { id: 13, code: 'E13', name: 'E13 - Calle 26',                      loc: 'st_loc_santafe',   lat: 4.6360, lng: -74.0640, status: 'Cerrada', progress: '14%', alert: false },
  { id: 14, code: 'E14', name: 'E14 - Calle 39 / Caracas',            loc: 'st_loc_teusaquillo', lat: 4.6470, lng: -74.0630, status: 'Cerrada', progress: '13%', alert: false },
  { id: 15, code: 'E15', name: 'E15 - Calle 57 / Caracas',            loc: 'st_loc_chapinero', lat: 4.6560, lng: -74.0620, status: 'Cerrada', progress: '13%', alert: false },
  { id: 16, code: 'E16', name: 'E16 - Intercambiador Calle 72',       loc: 'st_loc_barrios',   lat: 4.6640, lng: -74.0610, status: 'Cerrada', progress: '93%', alert: false },
];

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

// Generador de Icono Leaflet: Mini-Tren Aerodinámico elegante (30px x 13px)
// Diseñado para rodar exactamente encima de la línea roja con alta visibilidad y finos detalles
const createMetroTrainLeafletIcon = (code, direction, color, angleDeg = 0) => {
  const isNorth = direction === 'north';
  const glowRgba = isNorth ? 'rgba(52, 211, 153, 0.95)' : 'rgba(56, 189, 248, 0.95)';

  return L.divIcon({
    className: 'custom-metro-train-marker',
    html: `
      <div style="position: relative; width: 36px; height: 26px; display: flex; align-items: center; justify-content: center; cursor: pointer; pointer-events: auto; transform: translate(-18px, -13px);">
        <!-- Vehículo rotado según la curva de la línea roja -->
        <div class="train-car-rotator" style="position: relative; width: 30px; height: 13px; transform: rotate(${angleDeg.toFixed(1)}deg); transform-origin: center center; display: flex; align-items: center; justify-content: center;">
          <!-- Proyector de luz LED frontal hacia adelante sobre los rieles -->
          <div style="position: absolute; right: -12px; width: 15px; height: 15px; background: radial-gradient(circle at left, rgba(255,255,255,0.95) 0%, ${color} 45%, transparent 80%); clip-path: polygon(0% 30%, 100% 0%, 100% 100%, 0% 70%); pointer-events: none; filter: blur(0.6px);"></div>

          <!-- Resplandor neón inferior (Underglow) que ilumina la línea roja -->
          <div style="position: absolute; inset: -2px; border-radius: 9999px; background-color: ${color}; opacity: 0.65; filter: blur(2.5px);"></div>

          <!-- Carrocería aerodinámica del mini-tren -->
          <div style="position: relative; z-index: 10; width: 100%; height: 100%; border-radius: 9999px; background: linear-gradient(135deg, #18181b 0%, #09090b 100%); border: 1.5px solid ${color}; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.85), 0 0 8px ${glowRgba}; display: flex; align-items: center; justify-content: space-between; padding: 0 3px; overflow: hidden;">
            <!-- Luz roja trasera de señalización -->
            <span style="display: block; width: 2.5px; height: 4.5px; border-radius: 1px; background-color: #ef4444; box-shadow: 0 0 3px #ef4444; flex-shrink: 0;"></span>

            <!-- Ventanillas de pasajeros iluminadas -->
            <div style="display: flex; gap: 1.5px; align-items: center;">
              <span style="display: block; width: 3px; height: 4px; border-radius: 0.6px; background: rgba(255,255,255,0.95); box-shadow: 0 0 2px rgba(255,255,255,0.8);"></span>
              <span style="display: block; width: 4px; height: 4px; border-radius: 0.6px; background: rgba(255,255,255,0.95); box-shadow: 0 0 2px rgba(255,255,255,0.8);"></span>
            </div>

            <!-- Código del tren -->
            <span style="font-family: ui-monospace, SFMono-Regular, monospace; font-size: 7px; font-weight: 900; color: ${color}; letter-spacing: -0.3px; line-height: 1;">${code}</span>

            <!-- Doble faro blanco delantero de xenón -->
            <div style="display: flex; flex-direction: column; gap: 1.5px; align-items: center; flex-shrink: 0;">
              <span style="display: block; width: 2.2px; height: 2.5px; border-radius: 0.8px; background-color: #ffffff; box-shadow: 0 0 4px #ffffff;"></span>
              <span style="display: block; width: 2.2px; height: 2.5px; border-radius: 0.8px; background-color: #ffffff; box-shadow: 0 0 4px #ffffff;"></span>
            </div>
          </div>
        </div>

        <!-- Radar ping pulsante centrado -->
        <span style="position: absolute; width: 20px; height: 20px; border-radius: 50%; background-color: ${color}; opacity: 0.55; animation: urbangoPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; pointer-events: none;"></span>
      </div>
    `,
    iconSize: [36, 26],
    iconAnchor: [18, 13]
  });
};

// === SUBCOMPONENTE POPUP ESTACIÓN ===
const StationPopup = ({ station, onClose, onShowDetail, dark, t: propT }) => {
  const { t: contextT, lang } = useI18n();
  const t = propT || contextT;

  if (!station) return null;

  const statusColor = station.alert
    ? { bg: '#FFD600', text: '#1a1a1a' }
    : station.status === 'Cerrada'
      ? { bg: '#B30000', text: '#ffffff' }
      : { bg: '#2D8B3C', text: '#ffffff' };

  const localizedStatus = station.status === 'Cerrada' 
    ? t('mapModule.statusClosed', 'Cerrada')
    : station.status === 'Operativa'
      ? t('mapModule.statusOperational', 'Operativa')
      : t('mapModule.statusInWork', 'En obra');

  const locText = t(station.loc) || station.loc;
  const descText = t(station.desc) || station.desc;

  return (
    <div
      className="absolute inset-0 z-[2000] flex items-end justify-center pb-4 px-3"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-sm rounded-[1.75rem] overflow-hidden shadow-2xl border popup-in transition-colors ${dark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-36 overflow-hidden bg-zinc-200 dark:bg-zinc-800">
          <img
            src={station.img || '/Corredor central.jfif'}
            className="absolute inset-0 w-full h-full object-cover block"
            alt={station.name}
            onError={e => { if(!e.target.dataset.fallback) { e.target.dataset.fallback = "true"; e.target.src = '/Corredor central.jfif'; } }}
            style={{ filter: 'brightness(0.92)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)' }} />
          <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-sm hover:bg-black/70 transition-colors">
            <X size={14} />
          </button>
          <div className="absolute bottom-3 left-4 right-14">
            <span className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md" style={{ background: statusColor.bg, color: statusColor.text }}>
              {station.alert ? '⚠️ ' : ''}{localizedStatus}
            </span>
            <p className="font-black text-white text-sm mt-1.5 leading-tight drop-shadow-md">{station.name}</p>
          </div>
          <div className="absolute top-3 left-4 bg-black/55 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#B30000] rounded-full animate-pulse" />
            <span className="text-white font-black text-sm leading-none">{station.progress}</span>
            <span className="text-white/70 text-[9px] font-bold uppercase tracking-widest">{t("map_progress", "AVANCE")}</span>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-[#B30000] flex-shrink-0" />
            <span className={`text-xs font-bold ${dark ? 'text-zinc-300' : 'text-zinc-600'}`}>{locText}</span>
          </div>
          <p className={`text-xs font-medium leading-relaxed ${dark ? 'text-zinc-300' : 'text-zinc-600'}`}>{descText}</p>
          <div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? 'bg-zinc-700' : 'bg-zinc-200'}`}>
              <div className="h-full bg-gradient-to-r from-[#B30000] to-[#E53935] rounded-full transition-all duration-700" style={{ width: station.progress }} />
            </div>
          </div>
          <button onClick={() => { onShowDetail(station); onClose(); }} className="w-full bg-gradient-to-r from-[#B30000] to-[#8E0000] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform shadow-md flex items-center justify-center gap-2">
            {t('mapModule.viewStationDetail', 'Ver Ficha Completa')}
          </button>
        </div>
      </div>
    </div>
  );
};

// === COMPONENTE PRINCIPAL INTERACTIVE MAP ===
const InteractiveMap = ({ stations = [], onShowDetail, dark, t: propT }) => {
  const { t: contextT } = useI18n();
  const t = propT || contextT;
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const staticMarkersRef = useRef([]);

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
  const [activeTrainCount, setActiveTrainCount] = useState(2); // Inicia con 2 trenes: 1 Norte y 1 Sur

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const showLiveTrainsRef = useRef(showLiveTrains);
  showLiveTrainsRef.current = showLiveTrains;

  // TIEMPO DE SIMULACIÓN: Inicia exactamente en 0ms
  // Apenas se abre el mapa, sale 1 tren Norte (E1 Bosa) y 1 tren Sur (E16 Calle 72).
  // A los 40s sale la siguiente pareja, a los 80s la tercera pareja.
  const simTimeRef = useRef(0);
  const trainMarkersMap = useRef(new Map());
  const trainsLayerRef = useRef(null);

  // Estados visuales y modales
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [isLegendExpanded, setIsLegendExpanded] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  const [selectedStation, setSelectedStation] = useState(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [isLayersOpen, setIsLayersOpen] = useState(false);

  const [layers, setLayers] = useState({ 
    linea1: true, 
    linea2: true, 
    extensionL1: true, 
    redRegional: true, 
    cierres: true, 
    desvios: false, 
    obras: true 
  });
  const [selectedClosure, setSelectedClosure] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const cierresLines = [
    { id: 'c1', name: 'map_closure_caracas_name', desc: 'map_closure_caracas_desc', date: '2024-05-01', time: '24 hrs', detour: 'map_closure_caracas_detour', color: '#B30000', dash: '10, 10', positions: [[4.6470, -74.0630], [4.6640, -74.0610]] },
    { id: 'c2', name: 'map_closure_mayo_name', desc: 'map_closure_mayo_desc', date: '2024-06-15', time: '10pm - 4am', detour: 'map_closure_mayo_detour', color: '#B30000', dash: '10, 10', positions: [[4.580, -74.140], [4.590, -74.130]] }
  ];
  const desviosLines = [
    { id: 'd1', name: 'Desvío NQS', color: '#2D8B3C', positions: [[4.6470, -74.0730], [4.6640, -74.0710]] }
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

  // 2. RENDERIZAR CAPAS DE INFRAESTRUCTURA (LÍNEA 1 ROJA, ESTACIONES, ETC.)
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapReady) return;

    staticMarkersRef.current.forEach(layer => map.removeLayer(layer));
    staticMarkersRef.current = [];

    // Línea 1 Oficial (Viaducto Central Rojo: los trenes ruedan exactamente por encima de él)
    if (layers.linea1) {
      const line1 = metroStations.map(s => [s.lat, s.lng]);
      if (line1.length > 0) {
        // Viaducto rojo oficial con 6px de grosor
        const mainLine = L.polyline(line1, { color: '#B30000', weight: 6, opacity: 0.95 }).addTo(map);
        mainLine.on('click', () => setSelectedProject(CAPAS_MAPA_METRO.linea1));
        staticMarkersRef.current.push(mainLine);
      }

      // Estaciones Línea 1
      const visibleStations = layers.obras ? metroStations : metroStations.filter(s => s.status !== 'En obra' && s.status !== 'Cerrada');
      visibleStations.forEach(s => {
        const iconHtml = `<div class="relative" style="cursor:pointer; pointer-events: auto;"><div style="width:18px;height:18px;border-radius:50%;border:2px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;background:${s.alert ? '#FFD600' : s.status === 'Cerrada' ? '#B30000' : '#2D8B3C'}"><div style="width:5px;height:5px;background:white;border-radius:50%"></div></div></div>`;
        
        const icon = L.divIcon({
          className: 'custom-station-marker',
          html: iconHtml,
          iconSize: [18, 18], 
          iconAnchor: [9, 9]
        });

        const marker = L.marker([s.lat, s.lng], { icon }).addTo(map);
        marker.on('click', () => setSelectedStation(s));
        staticMarkersRef.current.push(marker);
      });
    }

    // Línea 2
    if (layers.linea2 && CAPAS_MAPA_METRO.linea2) {
      const l2 = CAPAS_MAPA_METRO.linea2;
      const l2Coords = l2.estaciones.map(e => [e.lat, e.lng]);
      const l2Line = L.polyline(l2Coords, { color: '#0070F3', weight: 5, opacity: 0.85, dashArray: '6, 8' }).addTo(map);
      l2Line.on('click', () => setSelectedProject(l2));
      staticMarkersRef.current.push(l2Line);

      l2.estaciones.forEach((e, idx) => {
        const iconHtml = `<div class="relative" style="cursor:pointer;"><div style="width:18px;height:18px;border-radius:50%;border:2px solid white;box-shadow:0 2px 5px rgba(0,112,243,0.4);display:flex;align-items:center;justify-content:center;background:#0070F3;color:white;font-size:8px;font-weight:900;">${idx + 1}</div></div>`;
        const icon = L.divIcon({
          className: 'custom-l2-marker',
          html: iconHtml,
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });
        const marker = L.marker([e.lat, e.lng], { icon }).addTo(map);
        marker.on('click', () => {
          setSelectedStation({
            name: e.name,
            code: e.code,
            loc: e.localidad,
            desc: `Estación ${e.tipo} de la Línea 2 del Metro (Subterránea). ${e.conexion}. En proceso de licitación pública internacional.`,
            status: 'Licitación Internacional',
            progress: '35% (Licitación)',
            alert: false,
            img: '/Linea 1 del metro de bogora.png'
          });
        });
        staticMarkersRef.current.push(marker);
      });
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

  }, [metroStations, layers.linea1, layers.linea2, layers.extensionL1, layers.redRegional, layers.cierres, layers.desvios, layers.obras, mapReady]);

  // 3. MOTOR DE ANIMACIÓN EN TIEMPO REAL: TRENES RODANDO EXACTAMENTE POR ENCIMA DE LA LÍNEA ROJA
  // - Inicia en simTime = 0ms: apenas se abre el mapa, sale 1 tren Norte (E1 Bosa) y 1 tren Sur (E16 Calle 72).
  // - A los 40s (simTime = 40,000ms), sale la segunda pareja de trenes.
  // - A los 80s, sale la tercera pareja.
  // - A los 120s, los trenes que culminan su viaje desaparecen limpiamente al llegar a su estación final.
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

            // ── TREN SENTIDO NORTE: Bosa (E1) ➔ Calle 72 (E16) | Verde esmeralda (#34d399) ──
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
              color: '#34d399',
              progress: Math.round(progress * 100),
              currentStationName: northPos.currentStation?.name || 'Patio Taller Bosa',
              nextStationName: northPos.nextStation?.name || 'Calle 72'
            };

            let northEntry = markersMap.get(northId);
            if (!northEntry) {
              const icon = createMetroTrainLeafletIcon(northCode, 'north', '#34d399', northPos.angle);
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

            // ── TREN SENTIDO SUR: Calle 72 (E16) ➔ Bosa (E1) | Azul cielo (#38bdf8) ──
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
              color: '#38bdf8',
              progress: Math.round(progress * 100),
              currentStationName: southPos.currentStation?.name || 'Calle 72',
              nextStationName: southPos.nextStation?.name || 'Patio Taller Bosa'
            };

            let southEntry = markersMap.get(southId);
            if (!southEntry) {
              const icon = createMetroTrainLeafletIcon(southCode, 'south', '#38bdf8', southPos.angle);
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

        // Remover trenes que hayan culminado el recorrido
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

  // 4. ACTUALIZACIÓN DEL CONTADOR DE DESPACHO CADA 500MS
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
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] w-full flex flex-col relative rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 border shadow-md">
      {/* Estilos CSS para el radar pulsante */}
      <style>{`
        @keyframes urbangoPing {
          0% { transform: scale(0.85); opacity: 0.85; }
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>

      {/* Contenedor del mapa Leaflet */}
      <div 
        ref={mapRef} 
        style={{ height: '100%', width: '100%', zIndex: 1, position: 'absolute', top: 0, left: 0 }}
      />

      {/* ── CONTROLES SUPERIORES: DESPACHO CADA 40S, PAUSAR/REANUDAR Y VER/OCULTAR ── */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Badge Título L1 2026 */}
        <div className={`pointer-events-auto backdrop-blur-xl px-3 py-1.5 rounded-full border shadow-lg flex items-center gap-2 transition-all ${
          dark ? 'bg-zinc-950/85 border-zinc-800 text-white' : 'bg-white/90 border-zinc-200 text-zinc-900'
        }`}>
          <div className="w-2 h-2 rounded-full bg-[#B30000] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-black italic tracking-tight">
            {t('mapModule.titleBadge', 'Metro L1 2026')}
          </span>
          <span className="hidden sm:inline-block text-[10px] font-bold text-zinc-400 border-l border-zinc-500/20 pl-2">
            {t('mapModule.stationsCount', '16 Estaciones')}
          </span>
        </div>

        {/* Grupo de Controles y Temporizador de Despacho */}
        <div className="pointer-events-auto flex items-center gap-1.5 flex-wrap">
          {/* INDICADOR DE TIEMPO RESTANTE PARA EL PRÓXIMO DESPACHO (CADA 40S) */}
          <div 
            className={`backdrop-blur-xl px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border shadow-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
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

          {/* BOTÓN 1: PAUSAR / REANUDAR ANIMACIÓN */}
          <button
            onClick={() => setIsPlaying(prev => !prev)}
            className={`backdrop-blur-xl px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border shadow-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 ${
              isPlaying
                ? dark 
                  ? 'bg-zinc-900/90 border-zinc-700 text-zinc-200 hover:border-zinc-500' 
                  : 'bg-white/90 border-zinc-200 text-zinc-700 hover:border-zinc-300'
                : 'bg-amber-500 text-white border-amber-400 shadow-amber-900/30'
            }`}
            title={isPlaying ? t('mapModule.btnPause', 'Pausar') : t('mapModule.btnResume', 'Reanudar')}
          >
            {isPlaying ? (
              <>
                <Pause size={11} className="text-amber-500" />
                <span className="hidden sm:inline">{t('mapModule.btnPause', 'Pausar')}</span>
              </>
            ) : (
              <>
                <Play size={11} className="text-white fill-white" />
                <span>{t('mapModule.btnResume', 'Reanudar')}</span>
              </>
            )}
          </button>

          {/* BOTÓN 2: MOSTRAR / OCULTAR TRENES EN VIVO */}
          <button
            onClick={() => setShowLiveTrains(prev => !prev)}
            className={`backdrop-blur-xl px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border shadow-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 ${
              showLiveTrains
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/30'
                : dark 
                  ? 'bg-zinc-900/90 border-zinc-700 text-zinc-400 hover:text-white' 
                  : 'bg-white/90 border-zinc-200 text-zinc-600 hover:text-zinc-900'
            }`}
            title={showLiveTrains ? t('mapModule.btnHideTrains', 'Ocultar Trenes') : t('mapModule.btnShowTrains', 'Mostrar Trenes')}
          >
            {showLiveTrains ? (
              <>
                <Eye size={11} className="text-white" />
                <span className="hidden sm:inline">{t('mapModule.btnHideTrains', 'Ocultar Trenes')}</span>
                <span className="sm:hidden">{t('mapModule.btnHideTrains', 'Ocultar')}</span>
              </>
            ) : (
              <>
                <EyeOff size={11} className="text-zinc-400" />
                <span className="hidden sm:inline">{t('mapModule.btnShowTrains', 'Mostrar Trenes')}</span>
                <span className="sm:hidden">{t('mapModule.btnShowTrains', 'Mostrar')}</span>
              </>
            )}
          </button>

          {/* BOTÓN 3: SELECTOR DE CAPAS */}
          <button
            onClick={() => setIsLayersOpen(v => !v)}
            className={`backdrop-blur-xl px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border shadow-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 transition-all active:scale-95 ${
              isLayersOpen
                ? 'bg-[#B30000] text-white border-[#B30000]'
                : dark ? 'bg-zinc-950/85 border-zinc-800 text-zinc-300 hover:text-white' : 'bg-white/90 border-zinc-200 text-zinc-700 hover:text-zinc-900'
            }`}
          >
            <Layers size={11} />
            <span>{t('mapModule.layersBtn', 'Capas')}</span>
          </button>
        </div>
      </div>

      {/* ── PANEL DESPLEGABLE DE CAPAS ── */}
      {isLayersOpen && (
        <div className={`absolute top-12 sm:top-14 right-3 z-[1000] p-3 rounded-2xl backdrop-blur-xl border shadow-2xl popup-in flex flex-col gap-1.5 max-w-[240px] w-60 ${dark ? 'bg-zinc-950/95 border-zinc-800' : 'bg-white/95 border-zinc-200'}`}>
          <div className="flex justify-between items-center pb-1 border-b border-zinc-500/20">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{t('mapModule.layersTitle', 'Capas Red Metro')}</span>
            <button onClick={() => setIsLayersOpen(false)} className="text-zinc-400 text-xs hover:text-white">✕</button>
          </div>
          
          <button
            onClick={() => setLayers(l => ({...l, linea1: !l.linea1}))}
            className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-left transition-colors border flex items-center justify-between ${layers.linea1 ? (dark ? 'bg-red-950/40 text-red-400 border-red-500/40' : 'bg-red-50 text-red-700 border-red-300') : (dark ? 'bg-zinc-900 text-zinc-500 border-zinc-800' : 'bg-zinc-100 text-zinc-400 border-zinc-200')}`}
          >
            <span>{t('mapModule.line1', '🔴 Línea 1 (Viaducto L1MB)')}</span>
            <span>{layers.linea1 ? '✓' : ''}</span>
          </button>

          <button
            onClick={() => setLayers(l => ({...l, linea2: !l.linea2}))}
            className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-left transition-colors border flex items-center justify-between ${layers.linea2 ? (dark ? 'bg-blue-950/40 text-blue-400 border-blue-500/40' : 'bg-blue-50 text-blue-700 border-blue-300') : (dark ? 'bg-zinc-900 text-zinc-500 border-zinc-800' : 'bg-zinc-100 text-zinc-400 border-zinc-200')}`}
          >
            <span>{t('mapModule.line2', '🔵 Línea 2 (Subterráneo)')}</span>
            <span>{layers.linea2 ? '✓' : ''}</span>
          </button>

          <button
            onClick={() => setLayers(l => ({...l, extensionL1: !l.extensionL1}))}
            className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-left transition-colors border flex items-center justify-between ${layers.extensionL1 ? (dark ? 'bg-purple-950/40 text-purple-400 border-purple-500/40' : 'bg-purple-50 text-purple-700 border-purple-300') : (dark ? 'bg-zinc-900 text-zinc-500 border-zinc-800' : 'bg-zinc-100 text-zinc-400 border-zinc-200')}`}
          >
            <span>{t('mapModule.extensionL1', '🟣 Extensión L1 (Calle 100)')}</span>
            <span>{layers.extensionL1 ? '✓' : ''}</span>
          </button>

          <button
            onClick={() => setLayers(l => ({...l, redRegional: !l.redRegional}))}
            className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-left transition-colors border flex items-center justify-between ${layers.redRegional ? (dark ? 'bg-amber-950/40 text-amber-400 border-amber-500/40' : 'bg-amber-50 text-amber-700 border-amber-300') : (dark ? 'bg-zinc-900 text-zinc-500 border-zinc-800' : 'bg-zinc-100 text-zinc-400 border-zinc-200')}`}
          >
            <span>{t('mapModule.redRegional', '🟠 Red Regiotram & Soacha')}</span>
            <span>{layers.redRegional ? '✓' : ''}</span>
          </button>
        </div>
      )}

      {/* ── LEYENDA INFERIOR Y ESTADO DE FLOTAS SOBRE LÍNEA 1 ROJA ── */}
      <div className="absolute bottom-3 left-3 z-[1000] pointer-events-auto max-w-[280px] sm:max-w-xs">
        <div className={`backdrop-blur-xl rounded-2xl border shadow-2xl transition-all ${
          dark ? 'bg-zinc-950/90 border-zinc-800 text-zinc-200' : 'bg-white/95 border-zinc-200 text-zinc-800'
        }`}>
          {/* Header interactivo */}
          <button
            onClick={() => setIsLegendExpanded(prev => !prev)}
            className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-[9px] font-black uppercase tracking-wider">
                {t('mapModule.continuousDispatch', 'Despacho Continuo (40s)')}
              </span>
              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${isPlaying ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {activeTrainCount} {t('mapModule.trainsCount', 'trenes')}
              </span>
            </div>
            {isLegendExpanded ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>

          {isLegendExpanded && (
            <div className="px-3 pb-3 pt-1 space-y-2 border-t border-zinc-500/15 text-[9px] font-bold">
              {/* Vía 1: Sentido Norte (Bosa -> Calle 72) */}
              <div className="p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#34d399] shadow-[0_0_8px_#34d399] flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#34d399]">{t('mapModule.northbound', 'Sentido Norte')}</span>
                    <span className="text-[8px] text-zinc-400">{t('mapModule.departureEvery40s', 'Salida c/40s')}</span>
                  </div>
                  <p className="text-[8.5px] text-zinc-300 truncate">
                    {t('mapModule.routeNorth', 'Bosa (E1) ➔ Calle 72 (E16)')}
                  </p>
                </div>
              </div>

              {/* Vía 2: Sentido Sur / Retorno (Calle 72 -> Bosa) */}
              <div className="p-1.5 rounded-xl bg-sky-500/10 border border-sky-500/25 flex items-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8] flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#38bdf8]">{t('mapModule.southbound', 'Sentido Sur / Retorno')}</span>
                    <span className="text-[8px] text-zinc-400">{t('mapModule.departureEvery40s', 'Salida c/40s')}</span>
                  </div>
                  <p className="text-[8.5px] text-zinc-300 truncate">
                    {t('mapModule.routeSouth', 'Calle 72 (E16) ➔ Bosa (E1)')}
                  </p>
                </div>
              </div>

              {/* Parámetros técnicos del despacho */}
              <div className="pt-1 flex items-center justify-between text-[8px] text-zinc-400 border-t border-zinc-500/10">
                <span>{t('mapModule.trackDirect', 'Rodaje directo sobre Línea 1')}</span>
                <span className="font-black text-emerald-400">{t('mapModule.speedGoA4', '60 FPS GoA4')}</span>
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
                <span 
                  className="w-3 h-3 rounded-full animate-ping" 
                  style={{ backgroundColor: selectedTrain.color }} 
                />
                <span 
                  className="text-xs font-black uppercase tracking-wider"
                  style={{ color: selectedTrain.color }}
                >
                  {selectedTrain.direction === 'north' 
                    ? `${t('mapModule.northbound', 'Sentido Norte')} (Bosa ➔ Calle 72)` 
                    : `${t('mapModule.southbound', 'Sentido Sur')} (Calle 72 ➔ Bosa)`}
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
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg font-black"
                style={{ backgroundColor: selectedTrain.color }}
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
                <span className="font-black text-[#B30000]">{selectedTrain.origin}</span>
              </div>
              <div className={`p-2.5 rounded-2xl flex justify-between items-center ${dark ? 'bg-zinc-800/80' : 'bg-zinc-50'}`}>
                <span className="text-zinc-400">{t('mapModule.destination', 'Destino')}</span>
                <span className="font-black" style={{ color: selectedTrain.color }}>{selectedTrain.destination}</span>
              </div>
              <div className={`p-2.5 rounded-2xl flex justify-between items-center ${dark ? 'bg-zinc-800/80' : 'bg-zinc-50'}`}>
                <span className="text-zinc-400">{t('mapModule.nextStation', 'Próxima Estación')}</span>
                <span className="font-black text-amber-500">{selectedTrain.nextStationName || t('mapModule.inTransit', 'En tránsito')}</span>
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
              className="w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-md transition-transform active:scale-95"
              style={{ backgroundColor: selectedTrain.color }}
            >
              {t('mapModule.closeTelemetry', 'Cerrar Telemetría')}
            </button>
          </div>
        </div>
      )}

      {/* Disclaimer de simulación operativa */}
      {showDisclaimer && (
        <div className="absolute bottom-3 right-3 z-[1000] backdrop-blur-xl bg-zinc-950/85 border border-amber-500/40 rounded-2xl p-2.5 sm:p-3 shadow-xl max-w-xs flex items-start gap-2 text-white">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={14} />
          <p className="text-[9px] sm:text-[10px] text-zinc-200 leading-tight pr-2">
            <strong className="text-amber-400">{t('mapModule.disclaimerTitle', 'Despacho Continuo:')}</strong> {t('mapModule.disclaimerDesc', 'Trenes rodando directamente sobre la Línea 1 Roja cada 40s en ambas direcciones.')}
          </p>
          <button onClick={() => setShowDisclaimer(false)} className="text-zinc-400 hover:text-white flex-shrink-0" aria-label="Cerrar">
            <X size={12} />
          </button>
        </div>
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
                style={{ backgroundColor: selectedProject.color || '#B30000' }}
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

            <h3 className="text-lg font-black italic mb-1">
              {selectedProject.nombre}
            </h3>
            <span className="text-[10px] font-black uppercase tracking-wider block text-emerald-500 mb-3">
              {selectedProject.estado}
            </span>

            <p className={`text-xs font-medium mb-4 leading-relaxed ${dark ? 'text-zinc-300' : 'text-zinc-600'}`}>
              {selectedProject.descripcion}
            </p>

            <button
              onClick={() => setSelectedProject(null)}
              className="w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-md transition-transform active:scale-95"
              style={{ backgroundColor: selectedProject.color || '#B30000' }}
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
            <div className="flex justify-between"><span className={dark ? 'text-zinc-500' : 'text-zinc-400'}>{translate('map_detour')}</span><span className="text-[#2D8B3C] font-black">{translate(selectedClosure.detour)}</span></div>
          </div>
        </div>
      )}

      {/* Modal Detalle de Estación */}
      {selectedStation && (
        <StationPopup
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
          onShowDetail={onShowDetail}
          dark={dark}
          t={translate}
        />
      )}
    </div>
  );
};

export default InteractiveMap;
