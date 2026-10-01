import React from 'react';

/**
 * ============================================================================
 * TRAIN ICON COMPONENT (MINI-METRO PLMB)
 * ============================================================================
 * Rediseño aerodinámico de alta velocidad para la Primera Línea del Metro:
 * - Color institucional: Rojo Metro (#DC2626 / #E11D48)
 * - Vía 1 (Sur ➔ Norte): Contorno Azul/Cian (#06B6D4), brillo neumórfico y badge "Norte / N"
 * - Vía 2 (Norte ➔ Sur): Contorno Amarillo/Ámbar (#F59E0B), brillo neumórfico y badge "Sur / S"
 */
export const TrainIcon = ({
  direction = 'north',
  code = 'M-01',
  width = 44,
  height = 20,
  className = '',
  showBadge = true
}) => {
  const isNorth = direction === 'north';
  const strokeColor = isNorth ? '#06B6D4' : '#F59E0B';
  const glowShadow = isNorth 
    ? 'drop-shadow(0px 0px 6px rgba(6, 182, 212, 0.85))' 
    : 'drop-shadow(0px 0px 6px rgba(245, 158, 11, 0.85))';
  const dirLabel = isNorth ? 'N ⬆' : 'S ⬇';

  return (
    <div 
      className={`inline-flex items-center justify-center relative select-none ${className}`}
      style={{ filter: glowShadow }}
      title={`Tren ${code} - ${isNorth ? 'Sentido Bosa ➔ Calle 72 (Norte)' : 'Sentido Calle 72 ➔ Bosa (Sur)'}`}
    >
      <svg 
        viewBox="0 0 52 24" 
        width={width} 
        height={height} 
        className="overflow-visible"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradiente Rojo Institucional Metro de Bogotá */}
          <linearGradient id={`metroRedGrad-${direction}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E11D48" />
            <stop offset="60%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          {/* Gradiente Reflejo Parabrisas */}
          <linearGradient id={`windshieldGrad-${direction}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        {/* Resplandor exterior / Contorno de Vía */}
        <path
          d="M 5 12 C 7 5, 14 4, 20 4 L 40 4 C 47 4, 50 8, 51 12 C 50 16, 47 20, 40 20 L 20 20 C 14 20, 7 19, 5 12 Z"
          fill={`url(#metroRedGrad-${direction})`}
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Franja aerodinámica plateada lateral */}
        <path
          d="M 12 16 L 42 16"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Ventanillas de pasajeros iluminadas */}
        <rect x="15" y="7" width="5.5" height="5" rx="1" fill="#FFFFFF" opacity="0.95" />
        <rect x="23" y="7" width="5.5" height="5" rx="1" fill="#FFFFFF" opacity="0.95" />
        <rect x="31" y="7" width="5.5" height="5" rx="1" fill="#FFFFFF" opacity="0.95" />

        {/* Parabrisas aerodinámico frontal oscuro */}
        <path
          d="M 39 6.5 L 46 8.5 C 48.5 10.5, 48.5 13.5, 46 15.5 L 39 17.5 Z"
          fill={`url(#windshieldGrad-${direction})`}
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="0.8"
        />

        {/* Reflejo blanco curvo sobre el parabrisas */}
        <path
          d="M 41 8 L 45 10 C 46 11, 46 13, 45 14"
          stroke="rgba(255, 255, 255, 0.75)"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Luces traseras rojas */}
        <circle cx="7" cy="8" r="1.5" fill="#EF4444" />
        <circle cx="7" cy="16" r="1.5" fill="#EF4444" />

        {/* Faros delanteros de xenón blanco */}
        <circle cx="49" cy="9" r="1.6" fill="#FFFFFF" />
        <circle cx="49" cy="15" r="1.6" fill="#FFFFFF" />

        {/* Badge / Indicador de dirección */}
        {showBadge && (
          <text
            x="19"
            y="14.5"
            fill={strokeColor}
            fontSize="4.5"
            fontWeight="900"
            fontFamily="ui-monospace, monospace"
            letterSpacing="-0.3px"
          >
            {dirLabel}
          </text>
        )}
      </svg>
    </div>
  );
};

export default TrainIcon;
