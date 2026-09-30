import { useState, useRef, useLayoutEffect, Suspense, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  PresentationControls,
  ContactShadows,
  RoundedBox,
} from '@react-three/drei';
import * as THREE from 'three';
import { Map, Briefcase, Bot, ChevronRight, Globe, Code, Users, X, Mail, ShieldCheck, Settings, Activity } from 'lucide-react';
import { useI18n } from './i18nContext';
import LanguageSelector from './components/LanguageSelector';

gsap.registerPlugin(ScrollTrigger);

// ── RESPONSIVE & PERFORMANCE HELPER ──────────────────────────────
const isMobileDevice = () => typeof window !== 'undefined' && (window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

// ── DATOS DEL EQUIPO ───────────────────────────────────────────────
const getTeam = (t) => [
  { name: 'Gabriela Camargo', role: t('gabriela_role'), img: '/gabriela.png', emoji: '👩🏻‍💻', linkedin: '#', github: '#', email: 'mailto:gabriela@urbango.co', color: '#C8102E', bio: t('gabriela_bio'), impact: t('gabriela_impact'), badges: [t('gabriela_skill_1'), t('gabriela_skill_2'), t('gabriela_skill_3'), t('gabriela_skill_4')] },
  { name: 'Nathalia Gutiérrez', role: t('nathalia_role'), img: '/nathalia.png', emoji: '🎨', linkedin: '#', github: '#', email: 'mailto:nathalia@urbango.co', color: '#FFD600', bio: t('nathalia_bio'), impact: t('nathalia_impact'), badges: [t('nathalia_skill_1'), t('nathalia_skill_2'), t('nathalia_skill_3'), t('nathalia_skill_4')] },
  { name: 'Nicol Miranda', role: t('nicol_role'), img: '/nicol.png', emoji: '📢', linkedin: '#', github: '#', email: 'mailto:nicol@urbango.co', color: '#2D8B3C', bio: t('nicol_bio'), impact: t('nicol_impact'), badges: [t('nicol_skill_1'), t('nicol_skill_2'), t('nicol_skill_3'), t('nicol_skill_4')] },
  { name: 'Jorge Zonati', role: t('jorge_role'), img: '/jorge.png', emoji: '🗺️', linkedin: '#', github: '#', email: 'mailto:jorge@urbango.co', color: '#1565C0', bio: t('jorge_bio'), impact: t('jorge_impact'), badges: [t('jorge_skill_1'), t('jorge_skill_2'), t('jorge_skill_3'), t('jorge_skill_4')] },
];

// ── RIELES Y TRAVIESAS ─────────────────────────────────────────────
const TrackRails = () => (
  <group position={[0, -0.72, 0]}>
    <mesh position={[-0.9, 0, 0]}>
      <boxGeometry args={[0.12, 0.08, 14]} />
      <meshStandardMaterial color="#555" metalness={0.9} roughness={0.2} />
    </mesh>
    <mesh position={[0.9, 0, 0]}>
      <boxGeometry args={[0.12, 0.08, 14]} />
      <meshStandardMaterial color="#555" metalness={0.9} roughness={0.2} />
    </mesh>
    {Array.from({ length: 14 }).map((_, i) => (
      <mesh key={i} position={[0, -0.04, -6.5 + i]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[2.2, 0.06, 0.3]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.3} roughness={0.8} />
      </mesh>
    ))}
  </group>
);

// ── RUEDA ─────────────────────────────────────────────────────────
const Wheel = ({ pos }) => (
  <mesh position={pos} rotation={[0, 0, Math.PI / 2]} castShadow>
    <cylinderGeometry args={[0.3, 0.3, 0.18, 24]} />
    <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.15} />
  </mesh>
);

// ── EFECTO DE MOVIMIENTO DEL PAISAJE (VIADUCTO) ──────────────────
const MovingScenery = () => {
  const sceneryRef = useRef();
  const isMobile = isMobileDevice();
  const count = isMobile ? 6 : 14;
  useFrame((state, delta) => {
    if (sceneryRef.current) {
      sceneryRef.current.position.z += delta * 25;
      if (sceneryRef.current.position.z > 8) sceneryRef.current.position.z -= 16;
    }
  });
  return (
    <group ref={sceneryRef}>
      {[-3, 3].map((side) => (
        <group key={`city-${side}`} position={[side, 0, 0]}>
          {Array.from({ length: count }).map((_, i) => (
            <mesh key={`light-${i}`} position={[side === -3 ? 0.3 : -0.3, (Math.random() - 0.5) * 3, -16 + Math.random() * 32]}>
              <boxGeometry args={[0.05, 0.05, 1.5 + Math.random() * 2]} />
              <meshBasicMaterial color={Math.random() > 0.4 ? "#FFD600" : "#ff2222"} transparent opacity={0.8} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

// ── INTERIOR DEL TREN — MATERIALES OPTIMIZADOS ─────────────────
const TrainInterior = () => {
  const isMobile = isMobileDevice();
  return (
  <group position={[0, 1.38, 0]}>
    <MovingScenery />

    {/* 1. Piso gris antideslizante con textura rugosa sutil */}
    <group position={[0, -0.85, 0]}>
      <mesh><boxGeometry args={[2.7, 0.05, 8.2]} /><meshStandardMaterial color="#3a3a3a" roughness={0.85} metalness={0.05} /></mesh>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={`grip-${i}`} position={[0, 0.027, -3.5 + i * 0.6]}>
          <boxGeometry args={[2.4, 0.003, 0.05]} />
          <meshStandardMaterial color="#2d2d2d" roughness={0.95} metalness={0.02} />
        </mesh>
      ))}
      {[-0.9, 0.9].map((x, i) => (
        <mesh key={`yl-${i}`} position={[x, 0.026, 0]}>
          <boxGeometry args={[0.08, 0.01, 8.2]} />
          <meshStandardMaterial color="#FFD600" roughness={0.5} emissive="#FFD600" emissiveIntensity={0.15} />
        </mesh>
      ))}
    </group>

    {/* 2. Techo + Tiras LED continuas brillantes */}
    <mesh position={[0, 0.85, 0]}><boxGeometry args={[1.5, 0.1, 8.2]} /><meshStandardMaterial color="#e8e8e8" roughness={0.4} /></mesh>
    {[-0.75, 0.75].map((x, i) => (
      <group key={`led-${i}`} position={[x, 0.82, 0]}>
        <mesh rotation={[0, 0, x > 0 ? 0.2 : -0.2]}>
          <boxGeometry args={[0.18, 0.015, 8.2]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={4} toneMapped={false} />
        </mesh>
        <mesh position={[x > 0 ? -0.12 : 0.12, -0.03, 0]}>
          <boxGeometry args={[0.04, 0.008, 8.0]} />
          <meshStandardMaterial color="#fff5e0" emissive="#fff5e0" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </group>
    ))}
    <pointLight position={[0, 0.5, 0]} intensity={3} distance={7} decay={2} color="#ffffff" />

    {/* Pantallas PIS */}
    {[-2, 2].map((z, i) => (
      <group key={`pis-${i}`} position={[0, 0.75, z]}>
        <mesh><boxGeometry args={[0.8, 0.15, 0.05]} /><meshStandardMaterial color="#111" /></mesh>
        <mesh position={[0, 0, 0.026]}><boxGeometry args={[0.75, 0.1, 0.01]} /><meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={2} toneMapped={false} /></mesh>
      </group>
    ))}

    {/* 3. Asientos ergonómicos */}
    {[-1.2, 1.2].map((x, side) => (
      <group key={`seats-${side}`} position={[x, -0.5, 0]}>
        <RoundedBox args={[0.5, 0.35, 7.8]} radius={0.06} smoothness={2} position={[0, -0.15, 0]}>
          <meshStandardMaterial color="#222" roughness={0.55} metalness={0.25} />
        </RoundedBox>
        <mesh position={[side === 0 ? 0.2 : -0.2, -0.3, 0]}>
          <boxGeometry args={[0.02, 0.015, 7.6]} />
          <meshStandardMaterial color="#e8f4ff" emissive="#e8f4ff" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        {Array.from({ length: 8 }).map((_, i) => {
          const isPriority = i === 1 || i === 6;
          return (
            <group key={`seat-${i}`}>
              <RoundedBox args={[0.42, 0.12, 0.65]} radius={0.04} smoothness={2} position={[(side === 0 ? 0.02 : -0.02), 0.06, -3.0 + i * 0.85]}>
                <meshStandardMaterial color={isPriority ? "#0047BB" : "#C8102E"} roughness={0.35} metalness={0.18} />
              </RoundedBox>
              <RoundedBox args={[0.08, 0.42, 0.65]} radius={0.04} smoothness={2} position={[(side === 0 ? -0.18 : 0.18), 0.32, -3.0 + i * 0.85]} rotation={[0, 0, side === 0 ? -0.15 : 0.15]}>
                <meshStandardMaterial color={isPriority ? "#0047BB" : "#C8102E"} roughness={0.35} metalness={0.18} />
              </RoundedBox>
            </group>
          );
        })}
      </group>
    ))}

    {/* Pasamanos acero inoxidable */}
    {[-0.7, 0.7].map((x, side) => (
      <group key={`hr-${side}`}>
        <mesh position={[x, 0.65, 0]}><cylinderGeometry args={[0.02, 0.02, 7.8, 10]} /><meshStandardMaterial color="#d4d4d4" metalness={0.95} roughness={0.08} /></mesh>
        <mesh position={[x, 0.3, 0]}><cylinderGeometry args={[0.015, 0.015, 7.8, 10]} /><meshStandardMaterial color="#d4d4d4" metalness={0.95} roughness={0.08} /></mesh>
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh key={`pl-${i}`} position={[x, 0.05, -3.0 + i * 2.0]}><cylinderGeometry args={[0.02, 0.02, 1.3, 10]} /><meshStandardMaterial color="#d4d4d4" metalness={0.95} roughness={0.08} /></mesh>
        ))}
      </group>
    ))}

    {/* Postes centrales */}
    {Array.from({ length: 3 }).map((_, i) => (
      <mesh key={`cp-${i}`} position={[0, 0, -2.5 + i * 2.5]}><cylinderGeometry args={[0.025, 0.025, 1.7, 10]} /><meshStandardMaterial color="#d4d4d4" metalness={0.95} roughness={0.08} /></mesh>
    ))}

    {/* 5. Puertas y ventanas */}
    {[-1.38, 1.38].map((x, side) => (
      <group key={`dr-${side}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <group key={`d-${i}`} position={[x, 0.05, -2.5 + i * 2.5]}>
            <mesh><boxGeometry args={[0.06, 1.7, 1.3]} /><meshStandardMaterial color="#e0e0e0" roughness={0.3} metalness={0.3} /></mesh>
            <mesh position={[side === 0 ? 0.03 : -0.03, 0.1, 0]}><boxGeometry args={[0.02, 1.5, 0.02]} /><meshStandardMaterial color="#111" roughness={0.9} /></mesh>
            <mesh position={[side === 0 ? 0.02 : -0.02, 0.1, 0]}><boxGeometry args={[0.02, 1.3, 1.0]} /><meshStandardMaterial color="#001122" transparent opacity={0.25} metalness={0.9} roughness={0.05} /></mesh>
          </group>
        ))}
      </group>
    ))}

    {/* 6. Paredes interiores */}
    <mesh><boxGeometry args={[2.75, 1.75, 8.3]} /><meshStandardMaterial color="#d4d4d4" side={THREE.BackSide} roughness={0.5} metalness={0.2} /></mesh>
  </group>
  );
};

// ── VAGÓN 3D AERODINÁMICO ─────────────────────────────────────────
const MetroTrain = ({ trainRef }) => {
  const innerRef = useRef();
  const isMob = isMobileDevice();
  const smooth = isMob ? 2 : 4;
  useFrame(({ clock }) => {
    if (innerRef.current) innerRef.current.position.y = Math.sin(clock.elapsedTime * 0.55) * 0.038;
  });
  return (
    <group ref={trainRef} position={[0, 0, 0]}>
      <group ref={innerRef}>
      <RoundedBox args={[3.1, 0.55, 9.6]} radius={0.18} smoothness={smooth} position={[0, 0.27, 0]} castShadow={!isMob} receiveShadow={!isMob}><meshStandardMaterial color="#111" metalness={0.7} roughness={0.35} /></RoundedBox>
      <RoundedBox args={[3.0, 2.0, 8.6]} radius={0.38} smoothness={smooth} position={[0, 1.38, 0]} castShadow={!isMob} receiveShadow={!isMob}><meshStandardMaterial color="#C8102E" metalness={0.85} roughness={0.15} envMapIntensity={1.8} /></RoundedBox>
      <RoundedBox args={[2.7, 0.5, 8.0]} radius={0.25} smoothness={smooth} position={[0, 2.5, 0]} castShadow={!isMob}><meshStandardMaterial color="#A0000A" metalness={0.9} roughness={0.1} /></RoundedBox>
      <RoundedBox args={[1.4, 0.28, 5.5]} radius={0.1} smoothness={2} position={[0, 2.8, 0]} castShadow={!isMob}><meshStandardMaterial color="#1e1e1e" metalness={0.4} roughness={0.7} /></RoundedBox>
      {[-1.505, 1.505].map((x, i) => (<mesh key={i} position={[x, 0.72, 0]}><boxGeometry args={[0.06, 0.13, 9.0]} /><meshStandardMaterial color="#FFD600" metalness={0.5} roughness={0.2} emissive="#FFD600" emissiveIntensity={0.18} /></mesh>))}
      <RoundedBox args={[3.12, 0.75, 8.3]} radius={0.08} smoothness={2} position={[0, 1.75, 0]}><meshStandardMaterial color="#030308" metalness={1.0} roughness={0.02} envMapIntensity={3.5} /></RoundedBox>

      {/* Cabina frontal */}
      <group position={[0, 1.32, 4.2]}>
        <RoundedBox args={[2.95, 2.05, 1.6]} radius={0.42} smoothness={smooth} rotation={[0.28, 0, 0]} castShadow={!isMob} receiveShadow={!isMob}><meshStandardMaterial color="#C8102E" metalness={0.85} roughness={0.15} /></RoundedBox>
        <RoundedBox args={[2.5, 1.05, 0.55]} radius={0.22} smoothness={smooth} position={[0, 0.32, 0.56]} rotation={[0.28, 0, 0]}><meshStandardMaterial color="#000a14" metalness={0.96} roughness={0.03} envMapIntensity={4} /></RoundedBox>
        <mesh position={[0, 0.88, 0.56]} rotation={[0.28, 0, 0]}><boxGeometry args={[2.38, 0.08, 0.08]} /><meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={15} toneMapped={false} /></mesh>
        <pointLight position={[0, 1.1, 1.3]} intensity={5} color="#e8f4ff" distance={8} decay={1.5} />
      </group>

      {/* Cabina trasera */}
      <group position={[0, 1.32, -4.2]}>
        <RoundedBox args={[2.95, 2.05, 1.6]} radius={0.42} smoothness={smooth} rotation={[-0.28, 0, 0]} castShadow={!isMob} receiveShadow={!isMob}><meshStandardMaterial color="#C8102E" metalness={0.85} roughness={0.15} /></RoundedBox>
        <RoundedBox args={[2.5, 1.05, 0.55]} radius={0.22} smoothness={smooth} position={[0, 0.32, -0.56]} rotation={[-0.28, 0, 0]}><meshStandardMaterial color="#000a14" metalness={0.96} roughness={0.03} envMapIntensity={4} /></RoundedBox>
        <mesh position={[0, 0.88, -0.56]} rotation={[-0.28, 0, 0]}><boxGeometry args={[2.38, 0.08, 0.08]} /><meshStandardMaterial color="#ff1a1a" emissive="#ff2222" emissiveIntensity={14} toneMapped={false} /></mesh>
        <pointLight position={[0, 1.1, -1.3]} intensity={5} color="#ff2222" distance={8} decay={1.5} />
      </group>

      {/* Faros frontales */}
      <group position={[0, 0.9, 4.82]} rotation={[0.28, 0, 0]}>
        {[-0.95, 0.95].map((x, i) => (<group key={i}><mesh position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.08, 0.42, 8, 12]} /><meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={20} toneMapped={false} /></mesh><pointLight position={[x, 0, 0.4]} intensity={6} color="#e8f4ff" distance={10} decay={1.5} /></group>))}
      </group>

      {/* Faros traseros */}
      <group position={[0, 0.9, -4.82]} rotation={[-0.28, 0, 0]}>
        {[-0.95, 0.95].map((x, i) => (<group key={i}><mesh position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.08, 0.42, 8, 12]} /><meshStandardMaterial color="#ff2222" emissive="#ff2222" emissiveIntensity={16} toneMapped={false} /></mesh><pointLight position={[x, 0, -0.4]} intensity={5} color="#ff2222" distance={8} decay={1.5} /></group>))}
      </group>

      {[-3.8, -1.2, 1.2, 3.8].map((z, i) => [-1.55, 1.55].map((x, j) => (<Wheel key={`${i}-${j}`} pos={[x, -0.08, z]} />)))}
      <TrackRails />
      <TrainInterior />
      </group>
    </group>
  );
};

// ── TARJETA DE EQUIPO ──────────────────────────────────────────────
const TeamCard = ({ member, onClick }) => (
  <div onClick={() => onClick(member)} className="bg-black/70 sm:bg-black/60 backdrop-blur-sm sm:backdrop-blur-xl border border-white/15 rounded-xl sm:rounded-2xl p-2.5 sm:p-5 text-center flex flex-col items-center gap-1.5 sm:gap-3 hover:bg-black/70 hover:-translate-y-2 transition-all duration-300 shadow-2xl cursor-pointer">
    <div className="rounded-full w-14 h-14 sm:w-24 sm:h-24 mx-auto border-2 flex items-center justify-center text-2xl sm:text-5xl shadow-lg overflow-hidden flex-shrink-0" style={{ background: `radial-gradient(circle at 35% 35%, ${member.color}44, #000)`, borderColor: member.color }}>
      {member.img ? <img src={member.img} alt={member.name} className="w-full h-full object-cover" /> : member.emoji}
    </div>
    <div className="min-w-0 w-full">
      <p className="text-white font-bold text-xs sm:text-sm leading-tight truncate">{member.name}</p>
      <p className="text-zinc-300 sm:text-zinc-400 text-[8px] sm:text-[10px] font-medium mt-0.5 sm:mt-1 uppercase tracking-wider sm:tracking-widest truncate">{member.role}</p>
    </div>
    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
      <a href={member.linkedin} className="text-zinc-300 sm:text-zinc-400 hover:text-[#0077b5] transition-colors" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><Globe size={14} /></a>
      <a href={member.github} className="text-zinc-300 sm:text-zinc-400 hover:text-white transition-colors" aria-label="GitHub" target="_blank" rel="noopener noreferrer"><Code size={14} /></a>
    </div>
  </div>
);

// ── HUD INFO CARD (GLASSMORPHISM FLOTANTE) ──────────────────────
const InfoCard = ({ title, value, unit, sub }) => (
  <div className="bg-black/70 sm:bg-black/60 backdrop-blur-sm sm:backdrop-blur-xl border border-white/15 sm:border-white/10 p-2.5 sm:p-4 rounded-xl flex flex-col justify-center transition-all hover:bg-black/50 shadow-2xl min-w-0">
    <h4 className="text-zinc-300 sm:text-zinc-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest mb-0.5 sm:mb-1 truncate">{title}</h4>
    <div className="flex items-baseline gap-1 mb-0.5 sm:mb-1">
      <span className="text-lg sm:text-2xl md:text-3xl font-black text-white">{value}</span>
      {unit && <span className="text-[#C8102E] text-[10px] sm:text-xs font-bold">{unit}</span>}
    </div>
    <p className="text-zinc-400 sm:text-zinc-500 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider leading-tight truncate">{sub}</p>
  </div>
);

// ── RESPONSIVE 3D SHADOWS ──────────────────────────────────────────
const ResponsiveShadows = () => {
  const isMobile = isMobileDevice();
  const shadowY = isMobile ? -0.2 : -0.72;
  const shadowScale = isMobile ? 18 : 26;

  return (
    <ContactShadows
      position={[0, shadowY, 0]}
      opacity={isMobile ? 0.75 : 0.88}
      scale={shadowScale}
      blur={isMobile ? 1.6 : 2.2}
      far={5}
      color="#000"
      resolution={isMobile ? 256 : 512}
    />
  );
};

// ── COMPONENTE PRINCIPAL LANDING 3D ───────────────────────────────
export default function Landing3D({ onEnter, onLogin, onRegister }) {
  const { t } = useI18n();
  const TEAM = getTeam(t);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [memberDetail, setMemberDetail] = useState(null);
  const containerRef = useRef(null);
  const trainObjRef  = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);
  const text4Ref = useRef(null);
  const text5Ref = useRef(null);
  const text6Ref = useRef(null);

  // Refs para las tarjetas HUD — animadas con GSAP (sin React state)
  const hudCardRefs = useRef([]);
  const hudTitleRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2.6, // +50% dampening para scroll cinematográfico
        },
      });

      gsap.set(
        [text2Ref.current, text3Ref.current, text4Ref.current, text5Ref.current, text6Ref.current],
        { autoAlpha: 0, y: 60 }
      );
      gsap.set(text1Ref.current, { autoAlpha: 1, y: 0 });

      // Inicializar HUD cards como invisibles
      if (hudTitleRef.current) gsap.set(hudTitleRef.current, { autoAlpha: 0, y: 20 });
      hudCardRefs.current.filter(Boolean).forEach(el => gsap.set(el, { autoAlpha: 0, y: 30 }));

      const proxy = { rotY: -Math.PI / 10, zoom: 0 };

      const applyTrainTransform = () => {
        if (trainObjRef.current) {
          const isMob = isMobileDevice();
          // Escala equilibrada al 78% en móvil para mantener presencia visual óptima
          const baseScale = isMob ? 0.78 : 1.0;
          const baseY = isMob ? 0.6 : 0.0;

          trainObjRef.current.rotation.y = proxy.rotY;
          const s = (1 + proxy.zoom * 3) * baseScale;
          trainObjRef.current.scale.set(s, s, s);
          trainObjRef.current.position.z = proxy.zoom * 13;
          trainObjRef.current.position.y = baseY + proxy.zoom * (isMob ? -2.2 : -2.5);
        }
      };

      // Set initial scale and position immediately
      applyTrainTransform();

      const spin = (targetRot, targetZoom, dur) => ({
        rotY: targetRot,
        zoom: targetZoom,
        duration: dur,
        ease: 'power2.inOut',
        onUpdate: applyTrainTransform,
      });

      // ── FASE 1 → 2: Quiénes Somos ──
      tl.to(text1Ref.current, { autoAlpha: 0, y: -60, duration: 1 })
        .to(proxy, spin(Math.PI / 2.2, 0, 2), '-=0.8')
        .to(text2Ref.current, { autoAlpha: 1, y: 0, duration: 1 }, '-=1');

      // ── FASE 2 → 3: Equipo ──
      tl.to(text2Ref.current, { autoAlpha: 0, y: -60, duration: 1 })
        .to(proxy, spin(Math.PI / 1.3, 0, 2), '-=0.8')
        .to(text3Ref.current, { autoAlpha: 1, y: 0, duration: 1 }, '-=1');

      // ── FASE 3 → 4: Ecosistema ──
      tl.to(text3Ref.current, { autoAlpha: 0, y: -60, duration: 1 })
        .to(proxy, spin(Math.PI, 0, 2), '-=0.8')
        .to(text4Ref.current, { autoAlpha: 1, y: 0, duration: 1 }, '-=1');

      // ── FASE 4 → 5: FLY-THROUGH — Cámara entra por el frente del vagón ──
      tl.to(text4Ref.current, { autoAlpha: 0, y: -60, duration: 1 })
        .to(proxy, spin(Math.PI * 2, 1, 3), '-=0.8')
        .to(text5Ref.current, { autoAlpha: 1, y: 0, duration: 1 }, '-=2');

      // Stagger de tarjetas HUD flotantes durante el fly-through
      if (hudTitleRef.current) {
        tl.to(hudTitleRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=1.5');
      }
      const validCards = hudCardRefs.current.filter(Boolean);
      if (validCards.length > 0) {
        tl.to(validCards, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.25 }, '-=1.2');
      }

      // ── FASE 5 → 6: Cámara sale por la parte trasera — CTA ──
      tl.to(text5Ref.current, { autoAlpha: 0, y: -60, duration: 1 })
        .to(proxy, spin(Math.PI * 2.2, 0, 3), '-=0.8')
        .to(text6Ref.current, { autoAlpha: 1, y: 0, duration: 1 }, '-=1');

      const onResize = () => {
        applyTrainTransform();
        ScrollTrigger.refresh();
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToPhase = (idx) => {
    window.scrollTo({ top: window.innerHeight * (idx * 1.17), behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="relative bg-black w-full" style={{ height: '700vh' }}>
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-black">

        {/* ── CANVAS 3D ── */}
        <div className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }}>
          <Canvas
            shadows={!isMobileDevice()}
            dpr={[1, isMobileDevice() ? 1 : 1.5]}
            camera={{ position: [0, 3, 13], fov: 42 }}
            gl={{
              antialias: !isMobileDevice(),
              powerPreference: 'high-performance',
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.1,
            }}
          >
            <Suspense fallback={null}>
              <color attach="background" args={['#000000']} />
              <fog attach="fog" args={['#000000', 20, 38]} />
              <ambientLight intensity={0.4} />
              <hemisphereLight skyColor="#ffffff" groundColor="#0a0a14" intensity={1.1} />
              <directionalLight position={[10, 16, 10]} intensity={1.6} />
              <directionalLight position={[-10, 10, -6]} intensity={0.8} color="#e0e8ff" />
              <pointLight position={[0, -1.5, 0]} intensity={1.2} color="#C8102E" distance={10} decay={2} />
              <PresentationControls global config={{ mass: 1.5, tension: 400 }} snap={{ mass: 4, tension: 1000 }} rotation={[0.08, 0, 0]} polar={[-Math.PI / 5, Math.PI / 5]} azimuth={[-Math.PI / 1.6, Math.PI / 1.6]}>
                <MetroTrain trainRef={trainObjRef} />
              </PresentationControls>
              <ResponsiveShadows />
            </Suspense>
          </Canvas>
        </div>

        {/* ── HEADER FLOTANTE GLASSMORPHISM ── */}
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] sm:w-11/12 max-w-6xl bg-black/60 backdrop-blur-xl border border-white/10 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between rounded-full shadow-2xl">
          <button onClick={() => scrollToPhase(0)} className="focus:outline-none flex items-center gap-1.5">
            <span className="text-lg sm:text-xl font-bold text-white tracking-tight">Urban<span className="text-[#C8102E]">Go</span></span>
          </button>
          <nav className="hidden md:flex items-center gap-7">
            {[[t('nav_quienes'), 1], [t('nav_equipo'), 2], [t('nav_app'), 3], [t('nav_avance'), 4]].map(([label, phase]) => (
              <button key={label} onClick={() => scrollToPhase(phase)} className="text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-200">{label}</button>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => onEnter && onEnter()} 
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/15 transition-all text-xs active:scale-95 whitespace-nowrap flex items-center gap-1"
            >
              <span>Entrar</span>
              <ChevronRight size={14} />
            </button>
            <LanguageSelector variant="capsule" dark={true} />
            <button onClick={() => setShowLoginModal(true)} className="bg-[#C8102E] hover:bg-[#a50d25] text-white font-semibold px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all duration-300 shadow-lg shadow-red-700/30 text-xs sm:text-sm active:scale-95 whitespace-nowrap">{t('btn_login').replace('🔑 ', '')}</button>
          </div>
        </header>

        {/* ── OVERLAYS DE TEXTO ── */}
        <div className="absolute inset-0 z-10 pointer-events-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 overflow-hidden">

          {/* FASE 1 — HERO */}
          <div ref={text1Ref} className="absolute left-4 sm:left-6 lg:left-16 right-4 sm:right-auto top-[54%] sm:top-1/2 -translate-y-1/2 max-w-2xl pointer-events-auto">
            <span className="inline-block text-[#C8102E] text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-2 sm:mb-4 border border-[#C8102E]/30 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/60 backdrop-blur-sm">{t('hero_tag')}</span>
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent mb-2 sm:mb-5 leading-none drop-shadow-2xl whitespace-pre-line break-words max-w-full">{t('hero_title')}</h1>
            <p className="text-sm sm:text-xl md:text-2xl font-bold text-[#E53935] break-words">{t('hero_subtitle')}</p>
            <p className="text-zinc-200 sm:text-zinc-400 text-xs sm:text-sm md:text-base mt-1.5 sm:mt-3 font-medium max-w-md break-words">{t('hero_desc')}</p>
            <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-3">
              <button 
                onClick={() => onEnter && onEnter()} 
                className="bg-[#C8102E] hover:bg-[#a50d25] text-white font-black px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-red-700/40 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Entrar a la App</span>
                <ChevronRight size={16} />
              </button>
              <button 
                onClick={() => setShowLoginModal(true)} 
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full text-xs sm:text-sm backdrop-blur-md border border-white/20 active:scale-95 transition-all"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>

          {/* FASE 2 — QUIÉNES SOMOS */}
          <div ref={text2Ref} className="absolute right-4 sm:right-6 lg:right-16 left-4 sm:left-auto top-[54%] sm:top-1/2 -translate-y-1/2 max-w-xl pointer-events-auto">
            <div className="bg-black/65 sm:bg-black/60 backdrop-blur-sm sm:backdrop-blur-xl border border-white/15 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2.5 sm:mb-5 leading-tight whitespace-pre-line break-words">{t('quienes_title')}</h2>
              <p className="text-zinc-200 sm:text-zinc-300 text-xs sm:text-base md:text-lg font-medium leading-relaxed">
                {t('quienes_desc')}
              </p>
              <div className="mt-3.5 sm:mt-6 flex items-center gap-2.5 sm:gap-3">
                <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-pulse flex-shrink-0" />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-300 sm:text-zinc-400">{t('hero_date_loc')}</span>
              </div>
            </div>
          </div>

          {/* FASE 3 — EQUIPO CREADOR */}
          <div ref={text3Ref} className="absolute left-4 sm:left-6 lg:left-16 right-4 sm:right-auto top-[54%] sm:top-1/2 -translate-y-1/2 w-auto max-w-5xl pointer-events-auto">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
              <Users className="w-5 h-5 sm:w-8 sm:h-8 text-[#C8102E] flex-shrink-0" />
              <h2 className="text-xl sm:text-4xl md:text-5xl font-black text-white truncate">{t('equipo_title')}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-5 max-w-5xl">
              {TEAM.map((m) => (<TeamCard key={m.name} member={m} onClick={setMemberDetail} />))}
            </div>
          </div>

          {/* FASE 4 — ECOSISTEMA */}
          <div ref={text4Ref} className="absolute right-4 sm:right-6 lg:right-16 left-4 sm:left-auto top-[54%] sm:top-1/2 -translate-y-1/2 max-w-4xl pointer-events-auto">
            <h2 className="text-xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-8 leading-tight">{t('ecosistema_title')}<br /><span className="text-[#C8102E]">UrbanGo</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-5">
              {[
                { Icon: Map, color: '#FFD600', label: t('eco_mapa_title'), desc: t('eco_mapa_desc') },
                { Icon: Briefcase, color: '#2D8B3C', label: t('eco_empleo_title'), desc: t('eco_empleo_desc') },
                { Icon: Bot, color: '#1565C0', label: t('eco_bot_title'), desc: t('eco_bot_desc') },
              ].map(({ Icon, color, label, desc }) => (
                <div key={label} className="bg-black/70 sm:bg-black/60 backdrop-blur-sm sm:backdrop-blur-xl border border-white/15 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 hover:-translate-y-2 hover:bg-black/70 transition-all duration-300 shadow-2xl">
                  <Icon style={{ color }} className="w-6 h-6 sm:w-11 sm:h-11 mb-2 sm:mb-4" />
                  <h3 className="text-sm sm:text-xl font-bold text-white mb-1 sm:mb-2">{label}</h3>
                  <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FASE 5 — INTERIOR HUD FLOTANTE (Fly-Through) */}
          <div ref={text5Ref} className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 pointer-events-none">
            <div className="w-full max-w-4xl mx-auto pointer-events-auto relative px-1 sm:px-4 max-h-[85vh] overflow-y-auto no-scroll">
              {/* Título del recorrido */}
              <div ref={hudTitleRef} className="text-center mb-3 sm:mb-5">
                <span className="inline-block text-[#C8102E] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] border border-[#C8102E]/30 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm">
                  🚇 Recorrido Interior · Línea 1
                </span>
              </div>

              {/* Fila 1: Capacidad y Operación */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 mb-2.5 sm:mb-4">
                <div ref={el => (hudCardRefs.current[0] = el)}>
                  <InfoCard title={t('hud_capacidad')} value="1,800" unit={t('hud_pax')} sub={t('hud_capacidad_sub')} />
                </div>
                <div ref={el => (hudCardRefs.current[1] = el)}>
                  <InfoCard title={t('hud_freq')} value="3" unit={t('hud_min')} sub={t('hud_freq_sub')} />
                </div>
                <div ref={el => (hudCardRefs.current[2] = el)}>
                  <InfoCard title={t('hud_vel')} value="43" unit="km/h" sub={t('hud_vel_sub')} />
                </div>
              </div>

              {/* Fila 2: Ficha Técnica */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 mb-2.5 sm:mb-4">
                <div ref={el => (hudCardRefs.current[3] = el)}>
                  <InfoCard title={t('hud_coches')} value="6-7" unit="" sub={t('hud_coches_sub')} />
                </div>
                <div ref={el => (hudCardRefs.current[4] = el)}>
                  <InfoCard title={t('hud_longitud')} value="140" unit="m" sub={t('hud_total')} />
                </div>
                <div ref={el => (hudCardRefs.current[5] = el)}>
                  <InfoCard title={t('hud_ancho')} value="2.90" unit="m" sub={t('hud_galibo')} />
                </div>
                <div ref={el => (hudCardRefs.current[6] = el)}>
                  <InfoCard title={t('hud_via')} value="1.435" unit="mm" sub={t('hud_ancho_std')} />
                </div>
                <div ref={el => (hudCardRefs.current[7] = el)} className="col-span-2 sm:col-span-1">
                  <InfoCard title={t('hud_peso')} value="14.6" unit="T" sub={t('hud_eje')} />
                </div>
              </div>

              {/* Fila 3: Sistema CBTC */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-4">
                <div ref={el => (hudCardRefs.current[8] = el)}>
                  <div className="bg-black/80 md:bg-black/60 backdrop-blur-md md:backdrop-blur-xl border border-white/20 md:border-white/10 p-3.5 sm:p-5 rounded-xl hover:bg-black/50 transition-colors shadow-2xl">
                    <h4 className="text-[#C8102E] font-black text-xs uppercase tracking-widest mb-1.5 sm:mb-2 flex items-center gap-2"><Activity size={14} /> {t('cbtc_title')}</h4>
                    <p className="text-zinc-200 sm:text-zinc-300 text-xs sm:text-sm font-medium leading-relaxed">{t('cbtc_desc')}</p>
                  </div>
                </div>
                <div ref={el => (hudCardRefs.current[9] = el)}>
                  <div className="bg-black/80 md:bg-black/60 backdrop-blur-md md:backdrop-blur-xl border border-white/20 md:border-white/10 p-3.5 sm:p-5 rounded-xl hover:bg-black/50 transition-colors shadow-2xl">
                    <h4 className="text-[#C8102E] font-black text-xs uppercase tracking-widest mb-1.5 sm:mb-2 flex items-center gap-2"><Map size={14} /> {t('est_title')}</h4>
                    <p className="text-zinc-200 sm:text-zinc-300 text-xs sm:text-sm font-medium leading-relaxed">{t('est_desc')}</p>
                  </div>
                </div>
                <div ref={el => (hudCardRefs.current[10] = el)}>
                  <div className="bg-black/80 md:bg-black/60 backdrop-blur-md md:backdrop-blur-xl border border-white/20 md:border-white/10 p-3.5 sm:p-5 rounded-xl hover:bg-black/50 transition-colors shadow-2xl">
                    <h4 className="text-[#C8102E] font-black text-xs uppercase tracking-widest mb-1.5 sm:mb-2 flex items-center gap-2"><ShieldCheck size={14} /> {t('puertas_title')}</h4>
                    <p className="text-zinc-200 sm:text-zinc-300 text-xs sm:text-sm font-medium leading-relaxed">{t('puertas_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FASE 6 — CTA CIERRE */}
          <div ref={text6Ref} className="absolute inset-x-0 bottom-20 sm:bottom-28 flex flex-col items-center justify-center text-center pointer-events-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent mb-6 sm:mb-10 leading-tight tracking-tighter whitespace-pre-line break-words max-w-full">{t('cta_title')}</h2>
            <button onClick={() => setShowLoginModal(true)} className="group relative bg-white text-black px-8 sm:px-14 py-4 sm:py-6 rounded-full font-black uppercase tracking-widest text-sm sm:text-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_50px_rgba(255,255,255,0.35)] hover:shadow-[0_0_80px_rgba(255,255,255,0.55)] flex items-center gap-3 sm:gap-4 overflow-hidden">
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <span className="relative">{t('cta_btn')}</span>
              <ChevronRight className="relative w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
            <p className="text-zinc-500 text-[10px] sm:text-xs font-bold mt-4 sm:mt-5 uppercase tracking-[0.2em]">{t('cta_sub')}</p>
          </div>
        </div>
      </div>

      {/* ── MODALES ── */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-black/90 border border-white/20 rounded-3xl p-6 sm:p-8 w-full max-w-md text-center shadow-2xl relative popup-in max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowLoginModal(false)} aria-label="Cerrar modal" className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors"><X size={20} /></button>
            <h3 className="text-2xl font-black text-white mb-2">{t('login_title')}</h3>
            <p className="text-xs sm:text-sm text-zinc-400 mb-6 sm:mb-8 font-medium">{t('login_sub')}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setShowLoginModal(false); onLogin && onLogin(); }}
                className="w-full py-4 rounded-xl bg-white text-zinc-900 font-black border border-white/20 hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2 shadow-md text-sm sm:text-base"
              >{t('btn_login')}</button>
              <button
                onClick={() => { setShowLoginModal(false); onRegister && onRegister(); }}
                className="w-full py-4 rounded-xl bg-zinc-800 text-white font-bold border border-zinc-700 hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >{t('btn_register')}</button>
              <button
                onClick={() => { setShowLoginModal(false); onEnter && onEnter(); }}
                className="w-full py-3.5 mt-1 rounded-xl border border-zinc-700 hover:border-zinc-500 bg-zinc-900/60 text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider active:scale-95"
              >
                {t('btn_guest')}
              </button>
            </div>
          </div>
        </div>
      )}

      {memberDetail && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={() => setMemberDetail(null)}>
          <div className="backdrop-blur-2xl bg-black/90 border border-white/20 rounded-3xl p-6 sm:p-8 w-full max-w-lg mx-auto shadow-2xl relative popup-in max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button onClick={() => setMemberDetail(null)} aria-label="Cerrar detalle" className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors z-10"><X size={20} /></button>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4 sm:mb-5">
                <div className="absolute inset-0 rounded-full blur-xl opacity-50" style={{ background: memberDetail.color }}></div>
                <div className="relative rounded-full w-24 h-24 sm:w-28 sm:h-28 mx-auto border-4 flex items-center justify-center text-5xl sm:text-6xl shadow-xl bg-black overflow-hidden" style={{ borderColor: memberDetail.color }}>
                  {memberDetail.img ? <img src={memberDetail.img} alt={memberDetail.name} className="w-full h-full object-cover" /> : memberDetail.emoji}
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">{memberDetail.name}</h3>
              <p className="text-xs font-bold uppercase tracking-widest mt-1 mb-3 sm:mb-4" style={{ color: memberDetail.color }}>{memberDetail.role}</p>
              <p className="text-zinc-300 text-xs sm:text-sm font-medium mb-4 leading-relaxed">{memberDetail.bio}</p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 sm:p-4 w-full text-left mb-4 sm:mb-5">
                <p className="text-white text-xs font-bold uppercase tracking-widest mb-1">{t('impacto_title')}</p>
                <p className="text-zinc-400 text-xs sm:text-sm leading-snug">{memberDetail.impact}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-5 sm:mb-6">
                {memberDetail.badges.map(b => (<span key={b} className="bg-zinc-800 text-zinc-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-full border border-zinc-700">{b}</span>))}
              </div>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 w-full">
                <a href={memberDetail.linkedin} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs sm:text-sm font-bold transition-colors"><Globe size={16} /> {t('social_linkedin')}</a>
                <a href={memberDetail.github} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs sm:text-sm font-bold transition-colors"><Code size={16} /> {t('social_github')}</a>
                <a href={memberDetail.email} className="flex-none flex items-center justify-center p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"><Mail size={16} /></a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
