import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FastForward, Sparkles, ShieldCheck } from 'lucide-react';

export default function MetroEntranceAnimation({ onComplete, userName = 'Ciudadano' }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 3500; // 3.5 seconds requested by user

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (elapsed >= duration) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      id="metro-entrance-container"
      className="fixed inset-0 z-[9999] bg-[#07090e] text-white flex flex-col justify-between select-none overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      {/* ── AMBIENT SKY & BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep Bogota Night Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070d] via-[#0a0f1d] to-[#12080a]" />

        {/* Distant Monserrate & Cerros Orientales Silhouette */}
        <svg
          className="absolute bottom-32 left-0 right-0 w-full h-48 opacity-25"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#030407"
            d="M0,192L60,186.7C120,181,240,171,360,181.3C480,192,600,224,720,197.3C840,171,960,85,1080,96C1200,107,1320,213,1380,266.7L1440,320L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>

        {/* Monserrate Sanctuary Beacon Light */}
        <div className="absolute top-[32%] right-[22%] w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_15px_6px_rgba(252,211,77,0.7)] animate-pulse" />

        {/* City Street Lights Grid Bokeh */}
        <div className="absolute bottom-28 left-0 right-0 h-16 opacity-30 flex justify-around items-end">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-amber-200/80"
              style={{
                boxShadow: '0 0 8px rgba(253,230,138,0.8)',
                animation: `pulse ${1.5 + (i % 3) * 0.4}s infinite alternate`
              }}
            />
          ))}
        </div>
      </div>

      {/* ── HEADER OVERLAY ── */}
      <header className="relative z-20 pt-8 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#B30000] border-2 border-[#FFD600] flex items-center justify-center shadow-[0_0_20px_rgba(179,0,0,0.6)]">
            <span className="text-white font-black text-lg italic tracking-tighter">M</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FFD600]">
                Primera Línea · Concesión Metro Línea 1
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h1 className="text-lg sm:text-xl font-black italic tracking-tight text-white">
              Metro de Bogotá <span className="text-[#FFD600]">L1</span>
            </h1>
          </div>
        </div>

        {/* Skip button */}
        <button
          id="skip-metro-entrance"
          onClick={() => onComplete?.()}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-zinc-200 hover:text-white transition-all active:scale-95 backdrop-blur-md"
        >
          <span>Saltar</span>
          <FastForward size={14} />
        </button>
      </header>

      {/* ── CENTER STAGE: VIADUCT & CROSSING TRAIN ── */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-center items-center my-auto">
        {/* Welcome Callout Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 px-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={12} className="text-[#FFD600]" />
            <span>Autenticación Exitosa</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
            Bienvenido a bordo, <span className="text-[#FFD600]">{userName}</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mt-1">
            Conectando el suroccidente con la Calle 72 en 27 minutos.
          </p>
        </motion.div>

        {/* THE VIADUCT & TRACK SYSTEM */}
        <div className="relative w-full h-44 flex items-center overflow-hidden">
          {/* Catenary / Overhead wire */}
          <div className="absolute top-4 left-0 right-0 h-[1.5px] bg-cyan-400/30 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />

          {/* Viaduct Concrete Beam */}
          <div className="absolute bottom-10 left-0 right-0 h-10 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-950 border-t-2 border-zinc-500/60 shadow-[0_15px_30px_rgba(0,0,0,0.8)] flex items-center">
            {/* Guide Rail & Safety Led strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#FFD600]/80 shadow-[0_0_12px_#FFD600]" />
            <div className="absolute top-2 left-0 right-0 h-[2px] bg-zinc-300/40" />
            <div className="absolute top-4 left-0 right-0 h-[2px] bg-zinc-300/40" />
          </div>

          {/* Viaduct Pillars (Columns) */}
          <div className="absolute bottom-0 left-0 right-0 h-10 flex justify-around pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-10 sm:w-14 h-full bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-900 border-x border-zinc-600/30 rounded-t-sm"
              />
            ))}
          </div>

          {/* ── THE METRO DE BOGOTÁ TRAIN ── */}
          <motion.div
            initial={{ x: '-120%' }}
            animate={{ x: '125%' }}
            transition={{
              duration: 3.5,
              ease: [0.15, 0.85, 0.35, 1], // Realistic acceleration, cruising speed, and sweep
            }}
            className="absolute bottom-10 left-0 flex items-center cursor-default z-30"
            style={{ willChange: 'transform' }}
          >
            {/* HEADLIGHT CONE BEAM (Projected forward to the right) */}
            <div
              className="absolute left-full top-1/2 -translate-y-1/2 w-[320px] sm:w-[480px] h-[130px] pointer-events-none z-10"
              style={{
                background: 'radial-gradient(ellipse at left, rgba(255,255,230,0.95) 0%, rgba(255,240,180,0.5) 25%, rgba(255,220,100,0.15) 55%, transparent 80%)',
                clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)',
                filter: 'blur(1px)',
              }}
            />

            {/* TRAIN BODY STRUCTURE (4 Cars Set) */}
            <div className="relative flex items-center drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)]">
              {/* REAR CAR (Car 4) */}
              <div className="w-28 sm:w-36 h-14 bg-gradient-to-b from-[#A30000] via-[#B30000] to-[#700000] border-t-2 border-zinc-300 rounded-l-md relative overflow-hidden flex items-center px-2">
                {/* Yellow Bogota Accent Stripe */}
                <div className="absolute bottom-3 left-0 right-0 h-2 bg-[#FFD600] shadow-sm" />
                {/* Red Tail Marker Lights */}
                <div className="absolute left-1 top-4 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_12px_#ff0000]" />
                {/* Windows with warm glowing interior */}
                <div className="flex gap-2 w-full justify-around mb-1">
                  <div className="w-6 sm:w-8 h-5 rounded-sm bg-gradient-to-b from-amber-100 to-amber-300 shadow-[inset_0_0_6px_rgba(0,0,0,0.4),0_0_8px_rgba(251,191,36,0.6)] opacity-90" />
                  <div className="w-6 sm:w-8 h-5 rounded-sm bg-gradient-to-b from-amber-100 to-amber-300 shadow-[inset_0_0_6px_rgba(0,0,0,0.4),0_0_8px_rgba(251,191,36,0.6)] opacity-90" />
                  <div className="w-6 sm:w-8 h-5 rounded-sm bg-gradient-to-b from-amber-100 to-amber-300 shadow-[inset_0_0_6px_rgba(0,0,0,0.4),0_0_8px_rgba(251,191,36,0.6)] opacity-90" />
                </div>
              </div>

              {/* Inter-car gangway */}
              <div className="w-2.5 h-11 bg-zinc-900 border-y border-zinc-600 mx-[1px]" />

              {/* MIDDLE CAR (Car 3) */}
              <div className="w-28 sm:w-36 h-14 bg-gradient-to-b from-[#A30000] via-[#B30000] to-[#700000] border-t-2 border-zinc-300 relative overflow-hidden flex items-center px-2">
                <div className="absolute bottom-3 left-0 right-0 h-2 bg-[#FFD600] shadow-sm" />
                <div className="flex gap-2 w-full justify-around mb-1">
                  <div className="w-6 sm:w-8 h-5 rounded-sm bg-gradient-to-b from-amber-100 to-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)] opacity-90" />
                  <div className="w-6 sm:w-8 h-5 rounded-sm bg-gradient-to-b from-amber-100 to-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)] opacity-90" />
                  <div className="w-6 sm:w-8 h-5 rounded-sm bg-gradient-to-b from-amber-100 to-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)] opacity-90" />
                </div>
                {/* Subway Doors */}
                <div className="absolute top-1 bottom-1 left-1/2 -translate-x-1/2 w-4 border-x border-zinc-900/60 bg-zinc-800/40" />
              </div>

              {/* Inter-car gangway */}
              <div className="w-2.5 h-11 bg-zinc-900 border-y border-zinc-600 mx-[1px]" />

              {/* MIDDLE CAR WITH PANTOGRAPH (Car 2) */}
              <div className="w-28 sm:w-36 h-14 bg-gradient-to-b from-[#A30000] via-[#B30000] to-[#700000] border-t-2 border-zinc-300 relative overflow-hidden flex items-center px-2">
                {/* Roof Pantograph */}
                <div className="absolute -top-3 left-6 w-8 h-3 border-t-2 border-l-2 border-zinc-300 skew-x-12" />
                <div className="absolute -top-3 left-10 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee] animate-ping" />

                <div className="absolute bottom-3 left-0 right-0 h-2 bg-[#FFD600] shadow-sm" />
                <div className="flex gap-2 w-full justify-around mb-1">
                  <div className="w-6 sm:w-8 h-5 rounded-sm bg-gradient-to-b from-amber-100 to-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)] opacity-90" />
                  <div className="w-6 sm:w-8 h-5 rounded-sm bg-gradient-to-b from-amber-100 to-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)] opacity-90" />
                  <div className="w-6 sm:w-8 h-5 rounded-sm bg-gradient-to-b from-amber-100 to-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)] opacity-90" />
                </div>
              </div>

              {/* Inter-car gangway */}
              <div className="w-2.5 h-11 bg-zinc-900 border-y border-zinc-600 mx-[1px]" />

              {/* LEAD CABIN CAR (Car 1 - Front Cockpit) */}
              <div
                className="w-36 sm:w-44 h-14 bg-gradient-to-b from-[#B30000] via-[#C8102E] to-[#7A0000] border-t-2 border-zinc-200 relative overflow-hidden flex items-center pr-3 pl-2"
                style={{
                  clipPath: 'polygon(0% 0%, 82% 0%, 100% 45%, 96% 100%, 0% 100%)',
                }}
              >
                {/* Bogota Yellow Stripe along front wedge */}
                <div className="absolute bottom-3 left-0 right-0 h-2 bg-[#FFD600] shadow-[0_0_6px_#FFD600]" />

                {/* Passenger windows */}
                <div className="flex gap-2 mb-1 mr-4">
                  <div className="w-6 sm:w-8 h-5 rounded-sm bg-gradient-to-b from-amber-100 to-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)] opacity-90" />
                  <div className="w-6 sm:w-8 h-5 rounded-sm bg-gradient-to-b from-amber-100 to-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)] opacity-90" />
                </div>

                {/* Cockpit Windshield */}
                <div
                  className="absolute right-3 top-1.5 w-9 sm:w-11 h-6 bg-gradient-to-br from-cyan-900 via-sky-800 to-zinc-900 border border-cyan-400/40 rounded-sm"
                  style={{
                    clipPath: 'polygon(0% 0%, 85% 0%, 100% 100%, 0% 100%)',
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 -skew-x-12" />
                </div>

                {/* Electronic LED Destination Matrix */}
                <div className="absolute right-4 top-0.5 px-1 bg-black rounded-[2px] border border-emerald-500/50">
                  <span className="text-[6px] sm:text-[7px] font-mono font-bold text-emerald-400 tracking-wider">
                    L1 · CL 72
                  </span>
                </div>

                {/* DUAL FRONT HIGH-BEAM HEADLIGHTS */}
                <div className="absolute right-0.5 bottom-3.5 w-3 h-3 rounded-full bg-white shadow-[0_0_20px_10px_rgba(255,255,255,0.9),0_0_35px_15px_rgba(254,240,138,0.7)] z-20" />
                <div className="absolute right-1.5 bottom-1.5 w-2 h-2 rounded-full bg-white shadow-[0_0_15px_6px_rgba(255,255,255,0.8)] z-20" />
              </div>
            </div>

            {/* Wheel Bogies and Rail Spark Particles */}
            <div className="absolute -bottom-2 left-8 w-3 h-1 bg-cyan-300 rounded-full shadow-[0_0_12px_4px_rgba(34,211,238,0.8)] animate-pulse" />
            <div className="absolute -bottom-2 left-44 w-2 h-1 bg-cyan-300 rounded-full shadow-[0_0_10px_3px_rgba(34,211,238,0.8)] animate-ping" />
          </motion.div>
        </div>
      </div>

      {/* ── FOOTER PROGRESS & STATUS ── */}
      <footer className="relative z-20 pb-8 px-6 sm:px-12 max-w-xl mx-auto w-full">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-400 mb-2">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <ShieldCheck size={14} className="text-[#2D8B3C]" />
            Sincronizando perfiles y estaciones favoritas
          </span>
          <span className="font-mono text-[#FFD600] text-sm">{progress}%</span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-2 rounded-full bg-zinc-800/80 border border-zinc-700/60 overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-[#B30000] via-[#E53935] to-[#FFD600]"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        <p className="text-[10px] text-center text-zinc-500 font-bold uppercase tracking-widest mt-3">
          Sistema Inteligente de Movilidad Urbana · Bogotá D.C. 2026
        </p>
      </footer>
    </div>
  );
}
