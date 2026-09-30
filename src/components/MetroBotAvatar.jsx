import React from 'react';

const METRO_BOT_CSS = `
  @keyframes botBreathe {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-2.5px) scale(1.02); }
  }
  @keyframes visorGlow {
    0%, 100% { opacity: 0.85; filter: drop-shadow(0 0 4px rgba(56, 189, 248, 0.6)); }
    50% { opacity: 1; filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.9)); }
  }
  @keyframes antennaPulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; transform: scale(1.2); }
  }
  .anim-bot-breathe {
    animation: botBreathe 3.2s ease-in-out infinite;
    transform-origin: center bottom;
  }
  .anim-visor-glow {
    animation: visorGlow 2.5s ease-in-out infinite;
  }
  .anim-antenna-pulse {
    animation: antennaPulse 1.8s ease-in-out infinite;
    transform-origin: center;
  }
`;

export const MetroBotAvatar = ({ 
  size = 40, 
  showStatus = true, 
  isOnline = true, 
  className = "" 
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`} style={{ width: size, height: size }}>
      <style>{METRO_BOT_CSS}</style>

      {/* SVG Digital Guide Girl (MetroBot) */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 120 120" 
        className="w-full h-full anim-bot-breathe"
      >
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>
          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B30000" />
            <stop offset="70%" stopColor="#800000" />
            <stop offset="100%" stopColor="#4a0404" />
          </linearGradient>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
        </defs>

        {/* Circular Background Container */}
        <circle cx="60" cy="60" r="56" fill="url(#bgGrad)" stroke="#38bdf8" strokeWidth="2.5" strokeOpacity="0.4" />

        {/* Halo / Tech Ring */}
        <circle cx="60" cy="60" r="51" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 4" opacity="0.35" />

        {/* Hair Back */}
        <path d="M 28 65 Q 24 30 60 22 Q 96 30 92 65 Q 88 88 84 94 Q 60 88 36 94 Q 32 88 28 65 Z" fill="url(#hairGrad)" />

        {/* Futuristic Neck & Collar */}
        <path d="M 52 74 L 68 74 L 66 84 L 54 84 Z" fill="#fde047" opacity="0.3" />
        <rect x="52" y="74" width="16" height="10" rx="3" fill="#fed7aa" />

        {/* Tech Suit Torso (Red Metro Jacket with White Collar) */}
        <path d="M 24 108 Q 60 88 96 108 L 100 120 L 20 120 Z" fill="url(#suitGrad)" />
        <path d="M 44 94 L 60 114 L 76 94 Z" fill="#ffffff" />
        <path d="M 54 99 L 60 110 L 66 99 Z" fill="#0f172a" />
        {/* Metro Emblem Pin on Chest */}
        <circle cx="78" cy="106" r="4" fill="#FFD54F" stroke="#B30000" strokeWidth="1" />

        {/* Head / Face */}
        <ellipse cx="60" cy="58" rx="23" ry="24" fill="#fed7aa" />

        {/* Soft Blush */}
        <ellipse cx="44" cy="66" rx="4" ry="2.5" fill="#f87171" opacity="0.5" />
        <ellipse cx="76" cy="66" rx="4" ry="2.5" fill="#f87171" opacity="0.5" />

        {/* Confident, friendly mouth */}
        <path d="M 53 69 Q 60 75 67 69" stroke="#b45309" strokeWidth="2.2" strokeLinecap="round" fill="none" />

        {/* Hair Bangs / Front Styling */}
        <path d="M 36 46 Q 48 34 60 44 Q 72 34 84 46 Q 82 30 60 25 Q 38 30 36 46 Z" fill="#4338ca" />
        {/* Hair highlight strand */}
        <path d="M 44 33 Q 56 28 68 35" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Eyes Behind Visor */}
        <circle cx="48" cy="55" r="3" fill="#1e1b4b" />
        <circle cx="72" cy="55" r="3" fill="#1e1b4b" />

        {/* ── HIGH-TECH METRO VISOR / HUD GLASSES ── */}
        <g className="anim-visor-glow">
          {/* Curved Visor Shield */}
          <path 
            d="M 33 50 Q 60 45 87 50 L 85 62 Q 60 67 35 62 Z" 
            fill="url(#visorGrad)" 
            stroke="#e0f2fe" 
            strokeWidth="1.2" 
          />
          {/* Data Lines inside visor (HUD) */}
          <path d="M 40 55 L 52 55 M 68 55 L 80 55" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
          <circle cx="60" cy="55" r="1.5" fill="#fef08a" />
        </g>

        {/* Headset Frame & Mic */}
        <path d="M 33 52 Q 30 65 37 72 L 48 74" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="48" cy="74" r="2.5" fill="#38bdf8" />
        <rect x="28" y="47" width="5" height="12" rx="2" fill="#0284c7" />
        <rect x="87" y="47" width="5" height="12" rx="2" fill="#0284c7" />

        {/* Holographic Antenna / Transmitter Node with pulsing LED */}
        <path d="M 89 47 L 95 38" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="95" cy="38" r="3" fill="#38bdf8" className="anim-antenna-pulse" />
        <circle cx="95" cy="38" r="6" fill="#38bdf8" opacity="0.4" className="anim-antenna-pulse" />
      </svg>

      {/* Online Pulsing Emerald Status Badge */}
      {showStatus && isOnline && (
        <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-white dark:border-zinc-950 shadow-xs" />
        </span>
      )}
    </div>
  );
};

export default MetroBotAvatar;
