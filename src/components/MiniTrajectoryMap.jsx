import React, { useState, useMemo } from 'react';
import { ShieldCheck, Zap, Navigation, MapPin, ArrowRight, Info, CheckCircle2 } from 'lucide-react';

// Estaciones Oficiales de la Línea 1 del Metro de Bogotá con coordenadas georreferenciadas
export const L1_TRAJECTORY_STATIONS = [
  { id: 1,  code: 'E1',  name: 'Estación 1 - Portal Américas / Patio Taller', shortName: 'Patio Taller / Gibraltar', localidad: 'Bosa', km: 0.0, lat: 4.6095, lng: -74.1780 },
  { id: 2,  code: 'E2',  name: 'Estación 2 - Av. Villavicencio con Cra 95A', shortName: 'Cra 95A / Villavicencio', localidad: 'Bosa / Kennedy', km: 1.6, lat: 4.6180, lng: -74.1680 },
  { id: 3,  code: 'E3',  name: 'Estación 3 - Av. Villavicencio con Av. Guayacanes', shortName: 'Av. Guayacanes', localidad: 'Kennedy', km: 3.1, lat: 4.6230, lng: -74.1580 },
  { id: 4,  code: 'E4',  name: 'Estación 4 - Av. Primero de Mayo con Av. Boyacá', shortName: 'Primero de Mayo / Boyacá', localidad: 'Kennedy', km: 5.2, lat: 4.6260, lng: -74.1460 },
  { id: 5,  code: 'E5',  name: 'Estación 5 - Av. Primero de Mayo con Av. 68', shortName: 'Primero de Mayo / Av. 68', localidad: 'Kennedy', km: 7.0, lat: 4.6290, lng: -74.1340 },
  { id: 6,  code: 'E6',  name: 'Estación 6 - Av. Primero de Mayo con Cra 50', shortName: 'Primero de Mayo / Cra 50', localidad: 'Puente Aranda', km: 8.8, lat: 4.6310, lng: -74.1200 },
  { id: 7,  code: 'E7',  name: 'Estación 7 - Av. Primero de Mayo con NQS', shortName: 'Primero de Mayo / NQS', localidad: 'Antonio Nariño', km: 10.7, lat: 4.6260, lng: -74.1060 },
  { id: 8,  code: 'E8',  name: 'Estación 8 - NQS con Calle 8 Sur', shortName: 'NQS / Calle 8 Sur', localidad: 'Antonio Nariño', km: 12.3, lat: 4.6240, lng: -74.0940 },
  { id: 9,  code: 'E9',  name: 'Estación 9 - Calle 1 con Carrera 24', shortName: 'Calle 1 / Cra 24', localidad: 'Los Mártires', km: 14.1, lat: 4.6210, lng: -74.0820 },
  { id: 10, code: 'E10', name: 'Estación 10 - Calle 1 con Carrera 10', shortName: 'Calle 1 / Cra 10 (Hortúa)', localidad: 'Santa Fe / San Cristóbal', km: 15.6, lat: 4.6180, lng: -74.0720 },
  { id: 11, code: 'E11', name: 'Estación 11 - Av. Caracas con Calle 11', shortName: 'Caracas / Calle 11', localidad: 'Santa Fe / Los Mártires', km: 17.2, lat: 4.6210, lng: -74.0700 },
  { id: 12, code: 'E12', name: 'Estación 12 - Av. Caracas con Calle 26', shortName: 'Caracas / Calle 26 (Centro)', localidad: 'Santa Fe / Teusaquillo', km: 18.9, lat: 4.6270, lng: -74.0660 },
  { id: 13, code: 'E13', name: 'Estación 13 - Av. Caracas con Calle 45', shortName: 'Caracas / Calle 45 (Marly)', localidad: 'Chapinero / Teusaquillo', km: 20.6, lat: 4.6360, lng: -74.0640 },
  { id: 14, code: 'E14', name: 'Estación 14 - Av. Caracas con Calle 53', shortName: 'Caracas / Calle 53 (Lourdes)', localidad: 'Chapinero', km: 21.7, lat: 4.6470, lng: -74.0630 },
  { id: 15, code: 'E15', name: 'Estación 15 - Av. Caracas con Calle 63', shortName: 'Caracas / Calle 63 (Campín)', localidad: 'Chapinero / Barrios Unidos', km: 22.8, lat: 4.6560, lng: -74.0620 },
  { id: 16, code: 'E16', name: 'Estación 16 - Av. Caracas con Calle 72', shortName: 'Caracas / Calle 72 (Intercambiador)', localidad: 'Barrios Unidos / Chapinero', km: 23.9, lat: 4.6640, lng: -74.0610 }
];

export const MiniTrajectoryMap = ({
  originId = 1,
  destId = 16,
  dark = false,
  onSelectStation = null,
  compact = false
}) => {
  const [hoveredStation, setHoveredStation] = useState(null);
  const [badgeType, setBadgeType] = useState('emb'); // 'emb' | 'urbango'

  // Determinar rango del viaje (mínimo y máximo para abarcar estaciones intermedias)
  const minId = Math.min(Number(originId), Number(destId));
  const maxId = Math.max(Number(originId), Number(destId));
  const isSouthToNorth = Number(originId) <= Number(destId);

  // Proyección geográfica para SVG en lienzo responsive de 840 x 300 px
  const svgWidth = 840;
  const svgHeight = 280;
  const padX = 60;
  const padY = 48;

  const minLng = -74.1780;
  const maxLng = -74.0610;
  const minLat = 4.6095;
  const maxLat = 4.6640;

  // Cálculo de puntos de cada estación
  const projectedStations = useMemo(() => {
    return L1_TRAJECTORY_STATIONS.map(st => {
      const normX = (st.lng - minLng) / (maxLng - minLng);
      // Invertir latitud porque en SVG el eje Y crece hacia abajo
      const normY = 1 - (st.lat - minLat) / (maxLat - minLat);

      const x = padX + normX * (svgWidth - padX * 2);
      const y = padY + normY * (svgHeight - padY * 2);

      const isOrigin = st.id === Number(originId);
      const isDest = st.id === Number(destId);
      const isTerminal = isOrigin || isDest;
      const isInTrip = st.id >= minId && st.id <= maxId;

      return {
        ...st,
        x,
        y,
        isOrigin,
        isDest,
        isTerminal,
        isInTrip
      };
    });
  }, [originId, destId, minId, maxId]);

  // Generar trazado SVG completo (los 16 nodos)
  const fullPathD = useMemo(() => {
    return projectedStations.reduce((acc, st, i) => {
      return i === 0 ? `M ${st.x} ${st.y}` : `${acc} L ${st.x} ${st.y}`;
    }, '');
  }, [projectedStations]);

  // Generar trazado SVG solo del segmento del viaje
  const activePathD = useMemo(() => {
    const tripStations = projectedStations.filter(st => st.id >= minId && st.id <= maxId);
    // Ordenar de acuerdo con el sentido del viaje
    const ordered = isSouthToNorth ? tripStations : [...tripStations].reverse();
    return ordered.reduce((acc, st, i) => {
      return i === 0 ? `M ${st.x} ${st.y}` : `${acc} L ${st.x} ${st.y}`;
    }, '');
  }, [projectedStations, minId, maxId, isSouthToNorth]);

  // Datos del viaje seleccionado
  const originStation = projectedStations.find(s => s.id === Number(originId)) || projectedStations[0];
  const destStation = projectedStations.find(s => s.id === Number(destId)) || projectedStations[15];
  const stationCountInTrip = maxId - minId + 1;
  const tripDistanceKm = Math.abs(destStation.km - originStation.km).toFixed(1);

  // Zoom dinámico automático: Recalcula el viewBox enfocado exclusivamente en las estaciones del trayecto seleccionado
  const dynamicViewBox = useMemo(() => {
    const tripStations = projectedStations.filter(st => st.id >= minId && st.id <= maxId);
    if (!tripStations.length) {
      return `0 0 ${svgWidth} ${svgHeight}`;
    }

    const xs = tripStations.map(s => s.x);
    const ys = tripStations.map(s => s.y);
    const rawMinX = Math.min(...xs);
    const rawMaxX = Math.max(...xs);
    const rawMinY = Math.min(...ys);
    const rawMaxY = Math.max(...ys);

    // Padding óptimo para etiquetas de texto y anillos pulsantes de terminales
    const count = tripStations.length;
    const padXZoom = count <= 3 ? 95 : 75;
    const padYZoom = count <= 3 ? 75 : 60;

    let minX = rawMinX - padXZoom;
    let maxX = rawMaxX + padXZoom;
    let minY = rawMinY - padYZoom;
    let maxY = rawMaxY + padYZoom;

    let width = maxX - minX;
    let height = maxY - minY;

    // Relación de aspecto panorámica armónica (2.35:1)
    const targetRatio = 2.35;
    const currentRatio = width / (height || 1);

    if (currentRatio < targetRatio) {
      const neededWidth = height * targetRatio;
      const diffW = neededWidth - width;
      minX -= diffW / 2;
      width = neededWidth;
    } else {
      const neededHeight = width / targetRatio;
      const diffH = neededHeight - height;
      minY -= diffH / 2;
      height = neededHeight;
    }

    // Tamaño mínimo de ventana para evitar sobre-escalado si el viaje es de 1 o 2 estaciones
    if (width < 340) {
      const extra = 340 - width;
      minX -= extra / 2;
      width = 340;
    }
    if (height < 150) {
      const extra = 150 - height;
      minY -= extra / 2;
      height = 150;
    }

    return `${minX.toFixed(1)} ${minY.toFixed(1)} ${width.toFixed(1)} ${height.toFixed(1)}`;
  }, [projectedStations, minId, maxId, svgWidth, svgHeight]);

  return (
    <div className={`w-full rounded-3xl border shadow-lg overflow-hidden transition-all relative ${
      dark ? 'bg-zinc-950/90 border-zinc-800' : 'bg-white border-zinc-200'
    }`}>
      {/* ── HEADER DEL MINI MAPA CON BADGES DE TRANSPARENCIA REQUERIDOS ── */}
      <div className={`px-4 sm:px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${
        dark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-50/90 border-zinc-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-[#B30000] text-white flex items-center justify-center shadow-md text-xs font-black">
            L1
          </div>
          <div>
            <h4 className={`text-xs sm:text-sm font-black italic tracking-tight flex items-center gap-1.5 ${
              dark ? 'text-white' : 'text-zinc-900'
            }`}>
              <span>Trazado Dinámico de la Línea 1</span>
              <span className="text-[10px] font-bold text-zinc-400 not-italic">(23.9 km)</span>
            </h4>
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
              <span>{stationCountInTrip} estaciones del viaje</span>
              <span>•</span>
              <span className="text-[#B30000] font-black">{tripDistanceKm} km activos</span>
              <span>•</span>
              <span className="hidden sm:inline text-zinc-400">
                {isSouthToNorth ? 'Sentido Nororiente ↗' : 'Sentido Suroccidente ↙'}
              </span>
            </div>
          </div>
        </div>

        {/* Badges de Transparencia Requeridos */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setBadgeType(b => b === 'emb' ? 'urbango' : 'emb')}
            title="Alternar información de validación"
            className={`inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all shadow-sm ${
              badgeType === 'emb'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20'
                : dark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200' : 'bg-white border-zinc-200 text-zinc-600'
            }`}
          >
            <ShieldCheck size={12} className="text-amber-500" />
            <span>Datos Oficiales EMB</span>
          </button>

          <button
            type="button"
            onClick={() => setBadgeType(b => b === 'urbango' ? 'emb' : 'urbango')}
            title="Alternar información de validación"
            className={`inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all shadow-sm ${
              badgeType === 'urbango'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20'
                : dark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200' : 'bg-white border-zinc-200 text-zinc-600'
            }`}
          >
            <Zap size={12} className="text-emerald-500" />
            <span>Simulación Calculada UrbanGo</span>
          </button>
        </div>
      </div>

      {/* ── BARRA RESUMEN DE TERMINALES DEL VIAJE ── */}
      <div className={`px-4 sm:px-6 py-2 border-b flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs font-bold ${
        dark ? 'bg-zinc-950 border-zinc-800/80 text-zinc-300' : 'bg-zinc-100/60 border-zinc-200/80 text-zinc-700'
      }`}>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-black">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Origen: {originStation.code} · {originStation.shortName}
          </span>
          <ArrowRight size={12} className="text-zinc-400" />
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-black">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Destino: {destStation.code} · {destStation.shortName}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-zinc-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF1E27] shadow-[0_0_8px_#FF1E27]" />
            Tramo Rojo Neón
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-zinc-400 opacity-40" />
            Fuera de Viaje
          </span>
        </div>
      </div>

      {/* ── LIENZO SVG DINÁMICO DEL TRAZADO CON ZOOM AUTOMÁTICO AL TRAYECTO ── */}
      <div className="relative w-full p-2 sm:p-4 flex items-center justify-center">
        <svg
          viewBox={dynamicViewBox}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto max-h-[340px] select-none transition-all duration-700 ease-out"
        >
          <defs>
            {/* Filtro Resplandor Rojo Neón para el segmento activo */}
            <filter id="neonGlowRed" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Filtro Resplandor Dorado / Amarillo para las terminales */}
            <filter id="goldGlowTerminal" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="goldBlur" />
              <feMerge>
                <feMergeNode in="goldBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradiente Rojo Neón */}
            <linearGradient id="neonRedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF1E27" />
              <stop offset="50%" stopColor="#FF334B" />
              <stop offset="100%" stopColor="#FF002E" />
            </linearGradient>

            {/* Gradiente Dorado para Terminales */}
            <linearGradient id="goldTerminalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>

          {/* Guías viales y marcas de contexto */}
          <g className="text-zinc-400/40 text-[9px] font-bold" opacity={dark ? 0.35 : 0.45}>
            <text x={padX} y={svgHeight - 12}>Sur-Occidente (Bosa / Gibraltar)</text>
            <text x={svgWidth - padX - 160} y={22}>Nor-Oriente (Caracas / Calle 72)</text>
          </g>

          {/* 1. LÍNEA COMPLETA BASE (Fuera del trayecto: opacidad baja) */}
          <path
            d={fullPathD}
            fill="none"
            stroke={dark ? '#3f3f46' : '#cbd5e1'}
            strokeWidth={4.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.32}
          />

          {/* 2. SEGMENTO ACTIVO EN ROJO NEÓN BRILLANTE */}
          {minId !== maxId && (
            <>
              {/* Resplandor exterior difuso */}
              <path
                d={activePathD}
                fill="none"
                stroke="#FF1E27"
                strokeWidth={10}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.4}
                filter="url(#neonGlowRed)"
              />
              {/* Núcleo del segmento rojo neón */}
              <path
                d={activePathD}
                fill="none"
                stroke="url(#neonRedGradient)"
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#neonGlowRed)"
              />
              {/* Línea central blanca sutil para efecto de energía viaducto */}
              <path
                d={activePathD}
                fill="none"
                stroke="#ffffff"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.85}
              />
            </>
          )}

          {/* 3. MARCADORES DE ESTACIONES (16 Estaciones) */}
          {projectedStations.map(st => {
            const isHovered = hoveredStation?.id === st.id;

            // CASO 1: Estación fuera del trayecto -> Opacidad baja
            if (!st.isInTrip) {
              return (
                <g
                  key={`st-${st.id}`}
                  className="cursor-pointer transition-opacity duration-300"
                  opacity={isHovered ? 0.8 : 0.3}
                  onMouseEnter={() => setHoveredStation(st)}
                  onMouseLeave={() => setHoveredStation(null)}
                  onClick={() => onSelectStation && onSelectStation(st.id)}
                >
                  <circle
                    cx={st.x}
                    cy={st.y}
                    r={5}
                    fill={dark ? '#27272a' : '#f1f5f9'}
                    stroke={dark ? '#52525b' : '#94a3b8'}
                    strokeWidth={1.5}
                  />
                  <text
                    x={st.x}
                    y={st.y + (st.id % 2 === 0 ? 15 : -10)}
                    textAnchor="middle"
                    className={`text-[9px] font-bold select-none ${dark ? 'fill-zinc-500' : 'fill-zinc-400'}`}
                  >
                    {st.code}
                  </text>
                </g>
              );
            }

            // CASO 2: Estaciones TERMINALES (Origen y Destino) -> Marcadores Amarillo/Dorado con animación pulse
            if (st.isTerminal) {
              return (
                <g
                  key={`st-${st.id}`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredStation(st)}
                  onMouseLeave={() => setHoveredStation(null)}
                  onClick={() => onSelectStation && onSelectStation(st.id)}
                >
                  {/* Anillo de pulso animado (ondas expansivas) */}
                  <circle
                    cx={st.x}
                    cy={st.y}
                    r={18}
                    fill="#F59E0B"
                    opacity={0.25}
                    className="animate-ping origin-center"
                    style={{ transformOrigin: `${st.x}px ${st.y}px`, animationDuration: '2s' }}
                  />

                  {/* Halo dorado estático */}
                  <circle
                    cx={st.x}
                    cy={st.y}
                    r={14}
                    fill="#FBBF24"
                    opacity={0.35}
                    filter="url(#goldGlowTerminal)"
                  />

                  {/* Círculo base dorado */}
                  <circle
                    cx={st.x}
                    cy={st.y}
                    r={9.5}
                    fill="url(#goldTerminalGradient)"
                    stroke="#FFFFFF"
                    strokeWidth={2.5}
                    filter="url(#goldGlowTerminal)"
                  />

                  {/* Núcleo interior blanco */}
                  <circle
                    cx={st.x}
                    cy={st.y}
                    r={3.5}
                    fill="#FFFFFF"
                  />

                  {/* Etiqueta de terminal: Origen / Destino */}
                  <g transform={`translate(${st.x}, ${st.y + (st.id % 2 === 0 ? 20 : -18)})`}>
                    <rect
                      x={-34}
                      y={-9}
                      width={68}
                      height={18}
                      rx={9}
                      fill={st.isOrigin ? '#D97706' : '#B45309'}
                      stroke="#FFFFFF"
                      strokeWidth={1.5}
                      className="shadow-md"
                    />
                    <text
                      x={0}
                      y={3.5}
                      textAnchor="middle"
                      className="fill-white text-[9px] font-black tracking-wider uppercase select-none"
                    >
                      {st.isOrigin ? 'ORIGEN' : 'DESTINO'}
                    </text>
                  </g>

                  {/* Etiqueta de texto con el nombre enfático de la estación */}
                  <g transform={`translate(${st.x}, ${st.y + (st.id % 2 === 0 ? 40 : -36)})`}>
                    <rect
                      x={-56}
                      y={-9}
                      width={112}
                      height={18}
                      rx={6}
                      fill={dark ? 'rgba(24, 24, 27, 0.95)' : 'rgba(255, 255, 255, 0.95)'}
                      stroke="#F59E0B"
                      strokeWidth={1.2}
                      className="shadow-sm"
                    />
                    <text
                      x={0}
                      y={3.5}
                      textAnchor="middle"
                      className={`text-[9px] font-black select-none ${dark ? 'fill-amber-300' : 'fill-amber-900'}`}
                    >
                      {st.code} · {st.shortName.split('/')[0].trim()}
                    </text>
                  </g>
                </g>
              );
            }

            // CASO 3: Estaciones INTERMEDIAS DENTRO DEL VIAJE -> Resaltadas en rojo neón brillante con etiqueta enfática
            return (
              <g
                key={`st-${st.id}`}
                className="cursor-pointer transition-transform duration-200"
                onMouseEnter={() => setHoveredStation(st)}
                onMouseLeave={() => setHoveredStation(null)}
                onClick={() => onSelectStation && onSelectStation(st.id)}
              >
                {/* Resplandor neón */}
                <circle
                  cx={st.x}
                  cy={st.y}
                  r={10}
                  fill="#FF1E27"
                  opacity={0.35}
                  filter="url(#neonGlowRed)"
                />

                {/* Marcador rojo neón brillante */}
                <circle
                  cx={st.x}
                  cy={st.y}
                  r={6.5}
                  fill="#FF1E27"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  filter="url(#neonGlowRed)"
                />

                {/* Núcleo central blanco */}
                <circle
                  cx={st.x}
                  cy={st.y}
                  r={2}
                  fill="#FFFFFF"
                />

                {/* Etiqueta de texto enfática para estaciones intermedias del viaje */}
                <g transform={`translate(${st.x}, ${st.y + (st.id % 2 === 0 ? 20 : -17)})`}>
                  <rect
                    x={-32}
                    y={-7.5}
                    width={64}
                    height={15}
                    rx={5}
                    fill={dark ? 'rgba(24, 24, 27, 0.92)' : 'rgba(255, 255, 255, 0.92)'}
                    stroke="#FF1E27"
                    strokeWidth={1}
                    className="shadow-sm"
                  />
                  <text
                    x={0}
                    y={3}
                    textAnchor="middle"
                    className={`text-[8.5px] font-black select-none ${dark ? 'fill-red-300' : 'fill-red-700'}`}
                  >
                    {st.code} {st.shortName.split('/')[0].trim().slice(0, 10)}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* ── TOOLTIP FLOTANTE AL PASAR EL CURSOR SOBRE UNA ESTACIÓN ── */}
        {hoveredStation && (
          <div
            className={`absolute z-30 pointer-events-none p-2.5 rounded-2xl border shadow-xl backdrop-blur-xl transition-all duration-150 text-xs ${
              dark ? 'bg-zinc-900/95 border-zinc-700 text-white' : 'bg-white/95 border-zinc-200 text-zinc-900'
            }`}
            style={{
              left: Math.min(Math.max(10, (hoveredStation.x / svgWidth) * 100), 75) + '%',
              top: '15px'
            }}
          >
            <div className="flex items-center gap-1.5 font-black">
              <span className={`w-2 h-2 rounded-full ${
                hoveredStation.isTerminal 
                  ? 'bg-amber-500 animate-pulse' 
                  : hoveredStation.isInTrip ? 'bg-[#FF1E27]' : 'bg-zinc-400'
              }`} />
              <span>{hoveredStation.code} - {hoveredStation.name}</span>
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5 flex items-center justify-between gap-2">
              <span>Localidad: {hoveredStation.localidad}</span>
              <span>Km {hoveredStation.km}</span>
            </div>
            <div className="mt-1 pt-1 border-t border-zinc-500/20 text-[9px] font-bold">
              {hoveredStation.isOrigin && <span className="text-amber-500 font-black">★ Estación de Inicio del Viaje</span>}
              {hoveredStation.isDest && <span className="text-amber-500 font-black">🏁 Estación Destino Final</span>}
              {!hoveredStation.isTerminal && hoveredStation.isInTrip && (
                <span className="text-red-500 font-bold">✓ Estación intermedia activa en trayecto</span>
              )}
              {!hoveredStation.isInTrip && (
                <span className="text-zinc-500">Estación fuera del viaje seleccionado</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── FOOTER INFORMATIVO CON STATS RÁPIDAS ── */}
      <div className={`px-4 sm:px-6 py-2.5 border-t text-[10px] sm:text-xs flex flex-wrap items-center justify-between gap-2 ${
        dark ? 'bg-zinc-900/40 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
      }`}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <strong className="text-zinc-800 dark:text-zinc-200">2</strong> Terminales Doradas
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF1E27]" />
            <strong className="text-zinc-800 dark:text-zinc-200">{Math.max(0, stationCountInTrip - 2)}</strong> Intermedias Neón
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-400 opacity-40" />
            <strong className="text-zinc-800 dark:text-zinc-200">{16 - stationCountInTrip}</strong> Fuera de Viaje
          </span>
        </div>

        <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
          Línea 1 · Viaducto Elevado 100% Segregado
        </div>
      </div>
    </div>
  );
};

export default MiniTrajectoryMap;
