import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { 
  Wifi, 
  Eye, 
  EyeOff, 
  QrCode, 
  Sparkles, 
  Check, 
  Copy, 
  RotateCw, 
  ShieldCheck,
  Zap,
  CreditCard
} from 'lucide-react';

export const MetroCardVisual = ({
  cardNumber = '1000-0124-9876-8902',
  cardHolder = 'Ciudadano Metro',
  balance = 24500,
  cardType = 'Edición Coleccionista · Conmemorativa',
  dark = false,
  onRechargeClick = null
}) => {
  const [showNumber, setShowNumber] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [chipTapped, setChipTapped] = useState(false);
  const [copied, setCopied] = useState(false);

  // 3D Tilt Effect using Motion
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 220, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 220, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['14deg', '-14deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-14deg', '14deg']);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Masked vs unmasked card number
  const cleanNum = cardNumber.replace(/\s+/g, '');
  const lastFour = cleanNum.slice(-4) || '8902';
  const maskedDisplay = `•••• •••• •••• ${lastFour}`;
  const formattedFull = cardNumber.includes('-') 
    ? cardNumber 
    : cleanNum.replace(/(.{4})/g, '$1 ').trim();

  const handleChipClick = () => {
    setChipTapped(true);
    if (navigator.vibrate) {
      navigator.vibrate([40, 30, 40]);
    }
    setTimeout(() => setChipTapped(false), 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanNum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center select-none perspective-1000 py-2">
      {/* 3D TILT CONTAINER */}
      <div 
        className="w-full max-w-md perspective-1000"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          ref={cardRef}
          style={{
            rotateX: isFlipped ? 0 : rotateX,
            rotateY: isFlipped ? 180 : rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full aspect-[1.586/1] rounded-[24px] cursor-pointer transition-shadow duration-300 shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(179,0,0,0.45)]"
        >
          {/* ── CARD FRONT (DESIGN OFFICIAL EMB "USTED ES PARTE DE ESTA HISTORIA") ── */}
          <div 
            className={`absolute inset-0 w-full h-full rounded-[24px] overflow-hidden border border-white/20 backface-hidden ${
              isFlipped ? 'pointer-events-none opacity-0' : 'opacity-100'
            }`}
            style={{
              background: 'radial-gradient(circle at 75% 30%, #4a0d0d 0%, #200404 45%, #0d0202 100%)',
            }}
          >
            {/* Red Institutional Waves & Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#B30000]/90 via-[#8A0000]/50 to-transparent mix-blend-screen opacity-90" />
            
            {/* Metallic Brushed Texture & Specular Highlight */}
            <motion.div 
              style={{
                background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 65%)`,
              }}
              className="absolute inset-0 pointer-events-none z-30"
            />

            {/* Subtle Metro Vector Track overlay */}
            <svg 
              className="absolute -bottom-8 -left-8 w-64 h-64 opacity-20 text-white pointer-events-none" 
              viewBox="0 0 200 200" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3"
            >
              <circle cx="100" cy="100" r="80" strokeDasharray="6 6" />
              <circle cx="100" cy="100" r="55" />
              <circle cx="100" cy="100" r="30" />
            </svg>

            {/* Metro Train Front Silhouette & Headlights (Graphic as in official photo) */}
            <div className="absolute right-3 sm:right-6 bottom-4 sm:bottom-6 w-36 sm:w-44 h-28 sm:h-32 pointer-events-none z-10 flex items-end justify-end">
              <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]">
                {/* Windshield */}
                <path d="M 45 40 Q 80 18 115 40 L 125 72 Q 80 82 35 72 Z" fill="#0d1117" stroke="#30363d" strokeWidth="2" />
                <path d="M 52 45 Q 80 30 108 45 L 115 65 Q 80 72 45 65 Z" fill="#1f242c" opacity="0.85" />
                {/* Red Aerodynamic Body */}
                <path d="M 25 72 Q 80 84 135 72 L 140 92 Q 80 110 20 92 Z" fill="#B30000" />
                <path d="M 32 90 Q 80 106 128 90 L 132 102 Q 80 118 28 102 Z" fill="#1c0303" />
                {/* Front Grill / Nose */}
                <rect x="62" y="80" width="36" height="12" rx="4" fill="#0a0a0c" stroke="#444" strokeWidth="1" />
                <rect x="74" y="83" width="12" height="6" rx="2" fill="#B30000" />
                {/* LED Headlights (Glowing) */}
                <ellipse cx="42" cy="78" rx="8" ry="4" fill="#FFE082" className="animate-pulse" />
                <ellipse cx="118" cy="78" rx="8" ry="4" fill="#FFE082" className="animate-pulse" />
                <circle cx="42" cy="78" r="14" fill="#FFD54F" opacity="0.3" filter="blur(4px)" />
                <circle cx="118" cy="78" r="14" fill="#FFD54F" opacity="0.3" filter="blur(4px)" />
              </svg>
            </div>

            {/* TOP BAR: Metro Branding & Bogotá City Logo */}
            <div className="relative z-20 p-5 sm:p-6 pb-0 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/25 flex items-center justify-center text-white font-black text-sm shadow-md">
                  M
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/95 drop-shadow-sm block">
                    Metro de Bogotá
                  </span>
                  <span className="text-[8px] font-bold text-amber-300 tracking-wider uppercase block">
                    Primera Línea · L1MB
                  </span>
                </div>
              </div>

              {/* Official Alcaldía de Bogotá Logo with Star */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/35 backdrop-blur-md border border-white/15">
                <span className="text-[11px] font-black tracking-widest text-white uppercase">
                  BOGOT<span className="text-red-500">A</span>
                </span>
                <span className="text-red-500 text-xs leading-none">★</span>
              </div>
            </div>

            {/* MIDDLE ROW: Interactive Gold Chip & Contactless Wave */}
            <div className="relative z-20 px-5 sm:px-6 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Interactive Gold Contact Chip */}
                <button
                  type="button"
                  onClick={handleChipClick}
                  className={`relative w-11 h-8 rounded-md bg-gradient-to-br from-[#FFE082] via-[#FFD54F] to-[#B58900] p-1 border border-[#FFF9C4]/60 shadow-lg cursor-pointer transition-transform duration-200 active:scale-95 ${
                    chipTapped ? 'ring-2 ring-amber-300 scale-105' : ''
                  }`}
                  title="Chip EMV Seguro CBTC (Clic para autenticar)"
                >
                  <div className="w-full h-full border border-amber-900/30 rounded flex flex-col justify-between p-0.5">
                    <div className="w-full h-px bg-amber-900/40" />
                    <div className="w-full flex justify-between">
                      <div className="w-1.5 h-3 border-r border-amber-900/40" />
                      <div className="w-1.5 h-3 border-l border-amber-900/40" />
                    </div>
                    <div className="w-full h-px bg-amber-900/40" />
                  </div>
                  {chipTapped && (
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow whitespace-nowrap animate-in fade-in zoom-in">
                      NFC Activo
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-1 text-white/75" title="Tecnología sin contacto / NFC">
                  <Wifi size={16} className="rotate-90 text-amber-200" />
                </div>
              </div>

              {/* QR Code Quick Button to generate boarding token */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQrModal(true);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-amber-400/40 text-amber-200 text-[9px] font-black uppercase tracking-wider shadow-sm transition-all active:scale-95"
              >
                <QrCode size={12} />
                <span>QR Abordaje</span>
              </button>
            </div>

            {/* ICONIC MOTTO: "USTED ES PARTE DE ESTA HISTORIA." (From Official Collector Card Photo) */}
            <div className="relative z-20 px-5 sm:px-6 pt-3">
              <p className="text-[13px] sm:text-[15px] font-black italic tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase leading-snug">
                USTED ES PARTE DE ESTA HISTORIA.
              </p>
            </div>

            {/* BOTTOM SECTION: Card Number, Holder, Balance & Visibility Toggle */}
            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 pt-0 z-20 flex flex-col justify-end">
              {/* Card Number Line */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm sm:text-base font-bold tracking-[0.18em] text-white/95 drop-shadow">
                    {showNumber ? formattedFull : maskedDisplay}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNumber(!showNumber);
                    }}
                    className="p-1 text-white/60 hover:text-white transition-colors"
                    title={showNumber ? 'Ocultar número' : 'Mostrar número completo'}
                  >
                    {showNumber ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy();
                    }}
                    className="p-1 text-white/60 hover:text-white transition-colors"
                    title="Copiar número de tarjeta"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Holder & Balance */}
              <div className="flex items-end justify-between border-t border-white/15 pt-2">
                <div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/60 block">
                    Titular
                  </span>
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white truncate max-w-[170px] sm:max-w-[210px] block">
                    {cardHolder}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[8px] font-black uppercase tracking-widest text-amber-300/90 block">
                    Saldo Disponible
                  </span>
                  <span className="text-base sm:text-lg font-black text-white tracking-tight leading-none">
                    ${Number(balance).toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── CARD BACK (REVERSE VIEW WITH MAGNETIC STRIP & BARCODE) ── */}
          <div 
            className={`absolute inset-0 w-full h-full rounded-[24px] overflow-hidden border border-white/20 backface-hidden [transform:rotateY(180deg)] ${
              isFlipped ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            style={{
              background: 'linear-gradient(135deg, #180303 0%, #2e0505 50%, #0d0202 100%)',
            }}
          >
            {/* Magnetic Stripe */}
            <div className="w-full h-11 bg-zinc-950 mt-6 shadow-inner border-y border-zinc-800" />

            <div className="p-5 sm:p-6 space-y-3">
              {/* Signature & CVV Panel */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-8 bg-zinc-200 rounded flex items-center px-3">
                  <span className="font-serif italic text-zinc-700 text-xs select-none">
                    {cardHolder}
                  </span>
                </div>
                <div className="w-14 h-8 bg-white/10 rounded border border-white/20 flex items-center justify-center font-mono text-xs font-black text-amber-300">
                  892
                </div>
              </div>

              <div className="space-y-1 text-[8px] text-white/60 leading-tight">
                <p>Tarjeta oficial conmemorativa de acceso al Sistema Metro de Bogotá y Red Integrada de Transporte SITP.</p>
                <p>Reporte de pérdida o robo: Línea 195 o al portal oficial www.metrodebogota.gov.co</p>
              </div>

              {/* Barcode representation */}
              <div className="pt-2 flex justify-between items-end">
                <div className="h-6 w-36 flex items-end gap-0.5 opacity-80">
                  {[2,4,1,3,2,5,1,4,2,3,1,5,2,4,1,3,2,4,3,1,4,2,5].map((h, i) => (
                    <div key={i} className="bg-white w-1" style={{ height: `${h * 5}px` }} />
                  ))}
                </div>
                <span className="text-[9px] font-black uppercase text-amber-300 tracking-widest">
                  EMB · ALCALDÍA
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* QUICK CARD CONTROLS / ACTIONS */}
      <div className="w-full max-w-md mt-3 flex items-center justify-between px-2 text-xs">
        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 ${
            dark 
              ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white' 
              : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
          }`}
        >
          <RotateCw size={12} className={isFlipped ? 'rotate-180 transition-transform' : ''} />
          <span>{isFlipped ? 'Ver Frente' : 'Girar Tarjeta'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 ${
              dark 
                ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white' 
                : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            <QrCode size={12} className="text-[#B30000]" />
            <span>Ver QR</span>
          </button>

          {onRechargeClick && (
            <button
              type="button"
              onClick={onRechargeClick}
              className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-[#B30000] hover:bg-[#960000] text-white text-[10px] font-black uppercase tracking-wider shadow-md transition-all active:scale-95"
            >
              <Zap size={12} />
              <span>Recargar</span>
            </button>
          )}
        </div>
      </div>

      {/* ── MODAL: CÓDIGO QR DINÁMICO DE ABORDAJE ── */}
      {showQrModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowQrModal(false)}
        >
          <div 
            className={`w-full max-w-sm rounded-3xl p-6 border shadow-2xl space-y-4 animate-in zoom-in-95 text-center ${
              dark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-[#B30000] dark:text-red-400 text-[10px] font-black uppercase tracking-wider">
              <Sparkles size={12} />
              <span>Torniquete CBTC GoA4</span>
            </div>

            <h3 className="text-xl font-black italic tracking-tight">Código QR Dinámico</h3>
            <p className={`text-xs ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Acerca este código al lector óptico del torniquete en cualquiera de las 16 estaciones de la Línea 1.
            </p>

            {/* QR Visual */}
            <div className="p-4 bg-white rounded-2xl inline-block border-4 border-[#B30000] shadow-inner">
              <svg viewBox="0 0 140 140" className="w-44 h-44">
                {/* SVG pattern representing dynamic QR */}
                <rect x="0" y="0" width="140" height="140" fill="white" />
                {/* Corner markers */}
                <rect x="10" y="10" width="35" height="35" fill="black" />
                <rect x="15" y="15" width="25" height="25" fill="white" />
                <rect x="20" y="20" width="15" height="15" fill="#B30000" />

                <rect x="95" y="10" width="35" height="35" fill="black" />
                <rect x="100" y="15" width="25" height="25" fill="white" />
                <rect x="105" y="20" width="15" height="15" fill="#B30000" />

                <rect x="10" y="95" width="35" height="35" fill="black" />
                <rect x="15" y="100" width="25" height="25" fill="white" />
                <rect x="20" y="105" width="15" height="15" fill="#B30000" />

                {/* Random matrix bits */}
                {[
                  [55, 15], [70, 20], [80, 15], [55, 30], [75, 35],
                  [15, 55], [30, 60], [45, 55], [60, 60], [75, 55], [90, 60], [105, 55], [120, 60],
                  [20, 75], [35, 80], [50, 75], [65, 75], [80, 80], [95, 75], [115, 80],
                  [55, 95], [65, 105], [80, 100], [55, 115], [70, 120], [95, 115], [110, 105], [120, 120]
                ].map(([bx, by], idx) => (
                  <rect key={idx} x={bx} y={by} width="8" height="8" fill="black" rx="1.5" />
                ))}

                {/* Center Metro Logo Badge */}
                <circle cx="70" cy="70" r="14" fill="#B30000" />
                <text x="70" y="75" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="sans-serif">M</text>
              </svg>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-500">
              <ShieldCheck size={13} />
              <span>Token de abordaje encriptado (Válido por 10 min)</span>
            </div>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#B30000] text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-[#960000] transition-colors"
            >
              Listo / Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetroCardVisual;
