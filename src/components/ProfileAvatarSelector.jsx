import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles, UploadCloud, Camera, Trash2, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// CSS Keyframes for animated avatar loops
const AVATAR_ANIM_STYLES = `
  @keyframes bearBlink {
    0%, 90%, 100% { transform: scaleY(1); }
    95% { transform: scaleY(0.1); }
  }
  @keyframes earTwitch {
    0%, 85%, 100% { transform: rotate(0deg); }
    90% { transform: rotate(8deg); }
    95% { transform: rotate(-5deg); }
  }
  @keyframes waveHand {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(18deg); }
    75% { transform: rotate(-10deg); }
  }
  @keyframes gentleBounce {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
  }
  .anim-bear-blink { animation: bearBlink 3.6s infinite; transform-origin: center; }
  .anim-ear-twitch { animation: earTwitch 4s infinite ease-in-out; transform-origin: bottom center; }
  .anim-wave-hand { animation: waveHand 2.2s infinite ease-in-out; transform-origin: bottom right; }
  .anim-gentle-bounce { animation: gentleBounce 2.5s infinite ease-in-out; }
`;

export const ANIMATED_AVATARS = [
  {
    id: 'oso',
    name: 'Oso de Anteojos (Mascota)',
    tag: 'Mascota Oficial',
    badgeColor: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
    description: 'Fauna andina protegida con gorra del Metro de Bogotá.',
    renderSvg: ({ size = 64, isAnimated = true }) => (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className={isAnimated ? 'anim-gentle-bounce' : ''}
      >
        <circle cx="50" cy="50" r="48" fill="#1e293b" />
        <g className={isAnimated ? 'anim-ear-twitch' : ''}>
          <circle cx="26" cy="26" r="14" fill="#38261e" />
          <circle cx="26" cy="26" r="8" fill="#e2c8a2" />
          <circle cx="74" cy="26" r="14" fill="#38261e" />
          <circle cx="74" cy="26" r="8" fill="#e2c8a2" />
        </g>
        <circle cx="50" cy="54" r="34" fill="#38261e" />
        <ellipse cx="38" cy="50" rx="11" ry="9" fill="#f5ede0" />
        <ellipse cx="62" cy="50" rx="11" ry="9" fill="#f5ede0" />
        <path d="M 45 49 Q 50 47 55 49" stroke="#f5ede0" strokeWidth="3" fill="none" />
        <g className={isAnimated ? 'anim-bear-blink' : ''}>
          <circle cx="38" cy="50" r="4" fill="#0f172a" />
          <circle cx="39.5" cy="48.5" r="1.5" fill="#ffffff" />
          <circle cx="62" cy="50" r="4" fill="#0f172a" />
          <circle cx="63.5" cy="48.5" r="1.5" fill="#ffffff" />
        </g>
        <ellipse cx="50" cy="62" rx="13" ry="10" fill="#f5ede0" />
        <path d="M 46 58 L 54 58 L 50 63 Z" fill="#1e293b" />
        <path d="M 50 63 L 50 67 M 47 67 Q 50 70 53 67" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 28 32 Q 50 16 72 32 L 80 34 Q 50 24 24 34 Z" fill="#B30000" />
        <path d="M 32 30 Q 50 14 68 30 Z" fill="#8B0000" />
        <circle cx="50" cy="22" r="3.5" fill="#FFD54F" />
      </svg>
    )
  },
  {
    id: 'maquinista',
    name: 'Maquinista L1',
    tag: 'Personal EMB',
    badgeColor: 'bg-red-500/20 text-red-500 border-red-500/30',
    description: 'Operador/a de trenes automáticos con visor de telemetría CBTC.',
    renderSvg: ({ size = 64, isAnimated = true }) => (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className={isAnimated ? 'anim-gentle-bounce' : ''}
      >
        <circle cx="50" cy="50" r="48" fill="#0f172a" />
        <path d="M 20 88 Q 50 72 80 88 L 84 100 L 16 100 Z" fill="#1e3a8a" />
        <path d="M 36 78 L 50 94 L 64 78 Z" fill="#ffffff" />
        <path d="M 47 84 L 53 84 L 51 98 L 49 98 Z" fill="#B30000" />
        <circle cx="70" cy="85" r="4" fill="#FFD54F" />
        <rect x="44" y="60" width="12" height="12" rx="3" fill="#e0ac69" />
        <ellipse cx="50" cy="46" rx="20" ry="22" fill="#e0ac69" />
        <g className={isAnimated ? 'anim-bear-blink' : ''}>
          <circle cx="43" cy="45" r="3" fill="#1e293b" />
          <circle cx="57" cy="45" r="3" fill="#1e293b" />
          <circle cx="44" cy="44" r="1" fill="#ffffff" />
          <circle cx="58" cy="44" r="1" fill="#ffffff" />
        </g>
        <path d="M 46 54 Q 50 58 54 54" stroke="#8c4e16" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 28 36 Q 50 20 72 36 L 76 40 Q 50 32 24 40 Z" fill="#1e3a8a" />
        <path d="M 30 36 Q 50 22 70 36 Z" fill="#0f172a" />
        <path d="M 24 40 Q 50 32 76 40 L 78 43 Q 50 35 22 43 Z" fill="#B30000" />
        <circle cx="50" cy="30" r="3" fill="#FFD54F" />
        <g className={isAnimated ? 'anim-wave-hand' : ''} style={{ transformOrigin: '82px 75px' }}>
          <circle cx="82" cy="65" r="7" fill="#e0ac69" />
          <path d="M 80 60 L 80 54 M 83 60 L 84 53 M 86 61 L 87 55" stroke="#e0ac69" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>
    )
  },
  {
    id: 'pasajero',
    name: 'Pasajera Bogotá',
    tag: 'Comunidad',
    badgeColor: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    description: 'Ciudadana conectada con audífonos y bufanda bogotana.',
    renderSvg: ({ size = 64, isAnimated = true }) => (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className={isAnimated ? 'anim-gentle-bounce' : ''}
      >
        <circle cx="50" cy="50" r="48" fill="#134e4a" />
        <ellipse cx="50" cy="48" rx="26" ry="27" fill="#2d1d16" />
        <path d="M 22 88 Q 50 74 78 88 L 82 100 L 18 100 Z" fill="#0284c7" />
        <path d="M 32 70 Q 50 82 68 70 L 70 82 Q 50 94 30 82 Z" fill="#B30000" />
        <path d="M 44 80 L 46 98 L 54 98 L 52 80 Z" fill="#8B0000" />
        <ellipse cx="50" cy="46" rx="19" ry="21" fill="#f7c59f" />
        <path d="M 31 38 Q 44 30 52 38 Q 62 30 69 40 L 68 34 Q 50 24 32 34 Z" fill="#2d1d16" />
        <g className={isAnimated ? 'anim-bear-blink' : ''}>
          <circle cx="43" cy="46" r="3" fill="#1e293b" />
          <circle cx="57" cy="46" r="3" fill="#1e293b" />
          <circle cx="44.5" cy="45" r="1" fill="#ffffff" />
          <circle cx="58.5" cy="45" r="1" fill="#ffffff" />
        </g>
        <path d="M 45 54 Q 50 60 55 54" stroke="#c05621" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="39" cy="52" r="3" fill="#fca5a5" opacity="0.6" />
        <circle cx="61" cy="52" r="3" fill="#fca5a5" opacity="0.6" />
        <path d="M 28 46 Q 28 20 50 20 Q 72 20 72 46" stroke="#ffffff" strokeWidth="3" fill="none" />
        <rect x="26" y="42" width="6" height="12" rx="3" fill="#38bdf8" />
        <rect x="68" y="42" width="6" height="12" rx="3" fill="#38bdf8" />
      </svg>
    )
  },
  {
    id: 'ingeniera',
    name: 'Ingeniera de Viaducto',
    tag: 'Obras y Redes',
    badgeColor: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
    description: 'Especialista en cimentación y vigas lanzadoras con casco de seguridad.',
    renderSvg: ({ size = 64, isAnimated = true }) => (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className={isAnimated ? 'anim-gentle-bounce' : ''}
      >
        <circle cx="50" cy="50" r="48" fill="#18181b" />
        <path d="M 22 88 Q 50 74 78 88 L 82 100 L 18 100 Z" fill="#ea580c" />
        <path d="M 36 78 L 38 100 M 64 78 L 62 100" stroke="#f4f4f5" strokeWidth="4" />
        <rect x="44" y="60" width="12" height="12" rx="3" fill="#c68642" />
        <ellipse cx="50" cy="47" rx="19" ry="21" fill="#c68642" />
        <g className={isAnimated ? 'anim-bear-blink' : ''}>
          <circle cx="43" cy="47" r="3" fill="#1e293b" />
          <circle cx="57" cy="47" r="3" fill="#1e293b" />
          <circle cx="44.5" cy="46" r="1" fill="#ffffff" />
          <circle cx="58.5" cy="46" r="1" fill="#ffffff" />
        </g>
        <path d="M 46 56 Q 50 60 54 56" stroke="#683d10" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 28 38 Q 50 18 72 38 L 80 42 Q 50 36 20 42 Z" fill="#facc15" />
        <rect x="44" y="24" width="12" height="6" rx="2" fill="#eab308" />
        <rect x="47" y="32" width="6" height="4" rx="1" fill="#B30000" />
      </svg>
    )
  }
];

// Helper to render user avatar anywhere in the app with support for real image URLs, SVG animations, and emojis
export const RenderUserAvatar = ({ avatar, size = 40, isAnimated = true, className = '' }) => {
  if (!avatar) {
    return (
      <span 
        className={`inline-flex items-center justify-center font-emoji select-none shrink-0 ${className}`} 
        style={{ fontSize: `${size * 0.6}px`, width: size, height: size }}
      >
        👤
      </span>
    );
  }

  // 1. Check if avatar is an uploaded image URL (Supabase storage URL, data URL, blob, etc.)
  if (
    typeof avatar === 'string' && 
    (avatar.startsWith('http://') || 
     avatar.startsWith('https://') || 
     avatar.startsWith('data:image/') || 
     avatar.startsWith('blob:'))
  ) {
    return (
      <div 
        className={`inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-zinc-800 ${className}`} 
        style={{ width: size, height: size }}
      >
        <img 
          src={avatar} 
          alt="Foto de perfil" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            // fallback if URL fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // 2. Check if avatar matches animated vectors
  const match = ANIMATED_AVATARS.find(a => a.id === avatar);
  if (match) {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
        <style>{AVATAR_ANIM_STYLES}</style>
        {match.renderSvg({ size, isAnimated })}
      </div>
    );
  }

  // 3. Fallback to emoji or character string
  return (
    <span 
      className={`inline-flex items-center justify-center font-emoji select-none shrink-0 ${className}`} 
      style={{ fontSize: `${size * 0.6}px`, width: size, height: size }}
    >
      {avatar}
    </span>
  );
};

export const ProfileAvatarSelector = ({ currentAvatar, onSelectAvatar, dark = false }) => {
  const { uploadAvatar, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    // If current avatar is an uploaded image URL, default to 'foto' tab
    if (typeof currentAvatar === 'string' && (currentAvatar.startsWith('http') || currentAvatar.startsWith('data:'))) {
      return 'foto';
    }
    return 'animados';
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const classicEmojis = ['👤', '👨🏽‍💼', '👩🏻‍💻', '👨🏻‍🔧', '🚆', '🚌', '🦺', '👷🏽', '🚲', '⚡', '🌳', '🇨🇴'];

  // Handle file selection and Supabase Storage upload
  const handleFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('La imagen no debe superar 5MB de tamaño.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setUploadSuccess(false);

    try {
      // Sube la imagen al bucket 'avatars' en Supabase y actualiza profiles table
      const res = await uploadAvatar(file);
      if (res?.publicUrl) {
        onSelectAvatar?.(res.publicUrl);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Error subiendo avatar:', err);
      setUploadError(err?.message || 'Error al subir la imagen a Supabase Storage.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const isPhotoUrl = typeof currentAvatar === 'string' && (currentAvatar.startsWith('http') || currentAvatar.startsWith('data:'));

  return (
    <div className="space-y-4">
      <style>{AVATAR_ANIM_STYLES}</style>

      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h4 className={`text-xs font-black uppercase tracking-wider ${dark ? 'text-zinc-300' : 'text-zinc-800'}`}>
            Selecciona o Sube tu Foto de Perfil
          </h4>
          <p className={`text-[10px] ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Almacenada de forma permanente en Supabase Storage (bucket <code className="font-mono text-[#B30000]">avatars</code>).
          </p>
        </div>

        {/* Tabs */}
        <div className={`flex p-1 rounded-xl border shrink-0 ${dark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-100 border-zinc-200'}`}>
          <button
            type="button"
            onClick={() => setActiveTab('foto')}
            className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'foto'
                ? 'bg-[#B30000] text-white shadow-sm'
                : dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Camera size={12} />
            Subir Foto
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('animados')}
            className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
              activeTab === 'animados'
                ? 'bg-[#B30000] text-white shadow-sm'
                : dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            ✨ Animados
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('clasicos')}
            className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
              activeTab === 'clasicos'
                ? 'bg-[#B30000] text-white shadow-sm'
                : dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Clásicos
          </button>
        </div>
      </div>

      {/* TAB 1: SUBIR FOTO (STORAGE + PROFILES TABLE) */}
      {activeTab === 'foto' && (
        <div className="space-y-3">
          {/* Active / Current Avatar Card */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-4 ${
            dark ? 'bg-zinc-800/60 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full border-3 border-[#B30000] overflow-hidden flex items-center justify-center shadow-lg bg-zinc-900">
                <RenderUserAvatar avatar={currentAvatar} size={80} />
              </div>
              {isPhotoUrl && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow border-2 border-zinc-900">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isPhotoUrl 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                    : 'bg-zinc-700 text-zinc-300 border-zinc-600'
                }`}>
                  {isPhotoUrl ? '☁️ Foto en Supabase Storage' : 'Avatar Actual'}
                </span>
                {uploadSuccess && (
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">
                    ¡Sincronizado!
                  </span>
                )}
              </div>
              <p className={`text-xs font-bold truncate ${dark ? 'text-white' : 'text-zinc-900'}`}>
                {userProfile?.name || 'Ciudadano UrbanGo'}
              </p>
              <p className={`text-[10px] mt-0.5 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {isPhotoUrl 
                  ? 'Tu imagen está vinculada a tu ID de usuario en la tabla `profiles`.'
                  : 'Sube tu foto personal para que se sincronice en la nube y persista entre inicios de sesión.'
                }
              </p>
            </div>

            {/* Quick Upload Button */}
            <div className="shrink-0">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2.5 rounded-xl bg-[#B30000] hover:bg-[#8B0000] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Camera size={14} />
                    Cambiar Foto
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-[#B30000] bg-red-500/10 scale-[1.01]'
                : dark
                ? 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/50 hover:bg-zinc-800/40'
                : 'border-zinc-300 hover:border-[#B30000]/60 bg-white hover:bg-red-50/30'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-[#B30000] flex items-center justify-center mx-auto mb-2.5">
              {isUploading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <UploadCloud size={24} />
              )}
            </div>
            <p className={`text-xs font-black uppercase tracking-wider ${dark ? 'text-zinc-200' : 'text-zinc-800'}`}>
              {isUploading ? 'Subiendo imagen a Supabase Storage...' : 'Arrastra una foto o haz clic aquí'}
            </p>
            <p className={`text-[10px] mt-1 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Archivos JPG, PNG o WEBP (máx. 5MB) · Ruta: <span className="font-mono text-[9px]">{'{userId}'}/avatar.{'{ext}'}</span>
            </p>
          </div>

          {/* Messages */}
          {uploadError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span className="text-[11px] font-medium leading-tight">{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <Check size={16} className="shrink-0" />
              <span className="text-[11px] font-medium leading-tight">
                ¡Foto de perfil subida y actualizada con éxito en la tabla <code className="font-mono font-bold">profiles</code>!
              </span>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AVATARES ANIMADOS */}
      {activeTab === 'animados' && (
        <div className="grid grid-cols-2 gap-3">
          {ANIMATED_AVATARS.map((av) => {
            const isSelected = currentAvatar === av.id;
            return (
              <button
                key={av.id}
                type="button"
                onClick={() => onSelectAvatar(av.id)}
                className={`group relative p-3 rounded-2xl border text-left flex flex-col items-center gap-2 transition-all duration-300 ${
                  isSelected
                    ? 'border-[#B30000] ring-2 ring-[#B30000]/30 shadow-md scale-[1.02] bg-red-500/5'
                    : dark 
                      ? 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50' 
                      : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#B30000] text-white flex items-center justify-center shadow">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}

                <div className="relative p-1">
                  {av.renderSvg({ size: 56, isAnimated: true })}
                </div>

                <div className="w-full text-center">
                  <span className={`inline-block text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border mb-1 ${av.badgeColor}`}>
                    {av.tag}
                  </span>
                  <p className={`text-xs font-black truncate ${dark ? 'text-white' : 'text-zinc-900'}`}>
                    {av.name}
                  </p>
                  <p className={`text-[9px] line-clamp-2 mt-0.5 leading-snug ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {av.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* TAB 3: CLÁSICOS (EMOJIS) */}
      {activeTab === 'clasicos' && (
        <div className="grid grid-cols-6 gap-2">
          {classicEmojis.map((emoji) => {
            const isSelected = currentAvatar === emoji;
            return (
              <button
                key={emoji}
                type="button"
                onClick={() => onSelectAvatar(emoji)}
                className={`h-12 rounded-xl text-2xl flex items-center justify-center border transition-all ${
                  isSelected
                    ? 'border-[#B30000] bg-red-500/10 ring-2 ring-[#B30000]/30 scale-105'
                    : dark 
                      ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' 
                      : 'bg-white border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                {emoji}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfileAvatarSelector;
