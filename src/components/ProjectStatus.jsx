import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Bell, 
  MapPin, 
  Clock, 
  ThumbsUp, 
  PlusCircle, 
  Send, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  ShieldAlert, 
  Car, 
  RefreshCw,
  Sparkles,
  Filter,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useI18n } from '../i18nContext';
import { useAuth } from '../context/AuthContext';
import { INDICADORES_L1MB } from '../data/metroOfficialData';
import IndicadoresAvanceL1MB from './IndicadoresAvanceL1MB';
import { supabase, isMocking } from '../supabaseClient';

// 16 L1 Stations for quick selector in modal
const QUICK_STATIONS = [
  'Patio Taller / Portal Américas (Estación 1)',
  'Av. Villavicencio con Cra 95A (Estación 2)',
  'Av. Villavicencio con Av. Guayacanes (Estación 3)',
  'Av. Primero de Mayo con Av. Boyacá (Estación 4)',
  'Av. Primero de Mayo con Av. 68 (Estación 5)',
  'Av. Primero de Mayo con Cra 50 (Estación 6)',
  'Av. Primero de Mayo con NQS (Estación 7)',
  'NQS con Calle 8 Sur (Estación 8)',
  'Calle 1 con Carrera 24 (Estación 9)',
  'Calle 1 con Carrera 10 / Hortúa (Estación 10)',
  'Av. Caracas con Calle 11 / Tercer Milenio (Estación 11)',
  'Av. Caracas con Calle 26 / Centro (Estación 12)',
  'Av. Caracas con Calle 45 / Marly (Estación 13)',
  'Av. Caracas con Calle 53 / Lourdes (Estación 14)',
  'Av. Caracas con Calle 63 / Campín (Estación 15)',
  'Av. Caracas con Calle 72 / Intercambiador (Estación 16)',
];

// Initial authentic incidents with verification badges and timestamps
const INITIAL_INCIDENTS = [
  {
    id: 'inc-01',
    user_id: 'usr-emb-101',
    author_name: 'Carlos Mendoza (Veeduría Ciudadana)',
    location: 'Av. Primero de Mayo con Av. Boyacá (Estación 4)',
    category: 'Cierres Viales',
    status: 'Confirmado',
    severity: 'Crítico',
    description: 'Cierre total de calzada norte por maniobra nocturna de izaje de dovelas y vigas. Desvío señalizado por la transversal 73.',
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    votes: 46
  },
  {
    id: 'inc-02',
    user_id: 'usr-cit-204',
    author_name: 'Andrea Morales',
    location: 'Av. Caracas entre Calles 45 y 53 (Estaciones 13 y 14)',
    category: 'Desvíos de Tráfico',
    status: 'Confirmado',
    severity: 'Moderado',
    description: 'Tráfico vehicular mixto desviado hacia la Carrera 7 y Carrera 13 debido a cimentación de pilas de viaducto. Recomiendo tomar la NQS.',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    votes: 31
  },
  {
    id: 'inc-03',
    user_id: 'usr-cit-305',
    author_name: 'Ing. Rodrigo Silva',
    location: 'Calle 72 con Carrera 15 (Intercambiador - Estación 16)',
    category: 'Obras de Redes',
    status: 'En Verificación',
    severity: 'Informativo',
    description: 'Empalme de redes secundarias de gas natural y fibra óptica. Peatones deben usar el paso por la acera sur debidamente señalizada.',
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    votes: 18
  },
  {
    id: 'inc-04',
    user_id: 'usr-cit-409',
    author_name: 'Laura Gómez',
    location: 'Av. Villavicencio con Av. Guayacanes (Estación 3)',
    category: 'Paso Restringido',
    status: 'Confirmado',
    severity: 'Moderado',
    description: 'Paso restringido a un solo carril por fundición de zapatas para la Estación 3. Tránsito regulado con banderilleros en sitio.',
    created_at: new Date(Date.now() - 9 * 3600 * 1000).toISOString(),
    votes: 24
  }
];

export const ProjectStatus = ({ dark = false, initialOpenModal = false }) => {
  const { t } = useI18n();
  const { user, userProfile } = useAuth();

  const currentUserId = user?.id || 'guest-citizen-01';
  const currentUserName = userProfile?.name || user?.name || 'Ciudadano UrbanGo';

  const [selectedLoc, setSelectedLoc] = useState('Bosa');
  const AVANCE = INDICADORES_L1MB.avanceGeneral.ejecutado;
  const PROGRAMADO = INDICADORES_L1MB.avanceGeneral.programado;
  const SPI = INDICADORES_L1MB.avanceGeneral.spi;

  // Circumference for the progress gauge
  const circumference = 2 * Math.PI * 58;
  const dashOffset = circumference - (circumference * AVANCE / 100);

  const LOCALIDADES = {
    'Bosa': { pct: 88, desc: t("loc_desc_bosa"), img: '/Corredor central.jfif' },
    'Kennedy': { pct: 72, desc: t("loc_desc_kennedy"), img: '/Linea 1 del metro de bogora.png' },
    'Puente Aranda': { pct: 55, desc: t("loc_desc_puente"), img: '/caracas calle 13 y 19.jfif' },
    'Teusaquillo': { pct: 40, desc: t("loc_desc_teusaquillo"), img: '/caracas calle 19 y 22.jfif' },
    'Barrios Unidos': { pct: 93, desc: t("loc_desc_barrios"), img: '/caracas calle 69 y 72a.png' },
  };
  const loc = LOCALIDADES[selectedLoc] || LOCALIDADES['Bosa'];

  // Incidents state with Supabase & LocalStorage sync
  const [incidents, setIncidents] = useState(() => {
    const cached = localStorage.getItem('urbango_incidents_cache');
    return cached ? JSON.parse(cached) : INITIAL_INCIDENTS;
  });

  const [userVotes, setUserVotes] = useState(() => {
    const saved = localStorage.getItem('urbango_incident_votes');
    return saved ? JSON.parse(saved) : {};
  });

  const [categoryFilter, setCategoryFilter] = useState('Todas');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(initialOpenModal);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form Fields per requirements: Categoría, Ubicación/Estación cercana y Descripción
  const [category, setCategory] = useState('Cierres Viales');
  const [locationInput, setLocationInput] = useState('');
  const [nearbyStation, setNearbyStation] = useState('');
  const [description, setDescription] = useState('');

  // Fetch incidents from Supabase on mount and listen for real-time app events
  useEffect(() => {
    let isMounted = true;

    async function loadIncidents() {
      if (!isMocking && supabase) {
        try {
          const { data, error } = await supabase
            .from('incidents')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data && data.length > 0 && isMounted) {
            setIncidents(data);
            localStorage.setItem('urbango_incidents_cache', JSON.stringify(data));
          }
        } catch (e) {
          console.warn('Supabase fetch fallback to local:', e);
        }
      }
    }

    loadIncidents();

    // Listen for new incidents created anywhere in the app (e.g. sidebar button, FAB)
    const handleNewIncident = (event) => {
      if (event.detail && isMounted) {
        setIncidents(prev => {
          if (prev.some(i => i.id === event.detail.id)) return prev;
          return [event.detail, ...prev];
        });
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === 'urbango_incidents_cache' && e.newValue && isMounted) {
        try {
          setIncidents(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };

    window.addEventListener('urbango:new-incident', handleNewIncident);
    window.addEventListener('storage', handleStorageChange);

    return () => { 
      isMounted = false; 
      window.removeEventListener('urbango:new-incident', handleNewIncident);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('urbango_incidents_cache', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('urbango_incident_votes', JSON.stringify(userVotes));
  }, [userVotes]);

  // Handle community upvotes
  const handleVote = async (id) => {
    const hasVoted = !!userVotes[id];
    const delta = hasVoted ? -1 : 1;

    const updated = incidents.map(inc => {
      if (inc.id === id) {
        return { ...inc, votes: Math.max(0, (inc.votes || 0) + delta) };
      }
      return inc;
    });
    setIncidents(updated);
    setUserVotes(prev => ({ ...prev, [id]: !hasVoted }));

    if (!isMocking && supabase) {
      try {
        const target = updated.find(i => i.id === id);
        if (target) {
          await supabase
            .from('incidents')
            .update({ votes: target.votes })
            .eq('id', id);
        }
      } catch (err) {
        console.warn('Supabase vote update error:', err);
      }
    }
  };

  // Submit quick incident modal
  const handleSubmitIncident = async (e) => {
    e.preventDefault();
    const finalLocation = nearbyStation 
      ? `${nearbyStation}${locationInput.trim() ? ` · ${locationInput.trim()}` : ''}`
      : locationInput.trim();

    if (!finalLocation || !description.trim()) return;

    setIsSubmitting(true);

    const newIncident = {
      id: `inc-${Date.now()}`,
      user_id: currentUserId,
      author_name: currentUserName,
      location: finalLocation,
      category: category,
      status: 'En Verificación', // Initial badge per requirement: "En Verificación"
      severity: 'Moderado',
      description: description.trim(),
      created_at: new Date().toISOString(),
      votes: 1
    };

    // Optimistic insert
    const updated = [newIncident, ...incidents];
    setIncidents(updated);
    setUserVotes(prev => ({ ...prev, [newIncident.id]: true }));
    window.dispatchEvent(new CustomEvent('urbango:new-incident', { detail: newIncident }));

    // Send to Supabase
    if (!isMocking && supabase) {
      try {
        await supabase
          .from('incidents')
          .insert([{
            id: newIncident.id,
            user_id: newIncident.user_id,
            location: newIncident.location,
            category: newIncident.category,
            status: newIncident.status,
            description: newIncident.description,
            created_at: newIncident.created_at,
            votes: newIncident.votes
          }]);
      } catch (err) {
        console.warn('Supabase insert error:', err);
      }
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsModalOpen(false);
      setLocationInput('');
      setNearbyStation('');
      setDescription('');
    }, 1200);
  };

  // Filtered incidents
  const filteredIncidents = incidents.filter(inc => {
    if (categoryFilter !== 'Todas' && inc.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  const categories = ['Todas', 'Cierres Viales', 'Desvíos de Tráfico', 'Obras de Redes', 'Paso Restringido'];

  // Helper for human-friendly relative time
  const formatIncidentTime = (isoString) => {
    try {
      const date = new Date(isoString);
      const diffMinutes = Math.round((Date.now() - date.getTime()) / (60 * 1000));
      if (diffMinutes < 5) return 'Hace un momento';
      if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
      const diffHours = Math.round(diffMinutes / 60);
      if (diffHours < 24) return `Hace ${diffHours} h`;
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Reciente';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-full">
      {/* ── CABECERA Y BOTÓN DESTACADO EN ROJO "REPORTAR INCIDENCIA VIAL" ── */}
      <div className="px-2 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-[#B30000] dark:text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B30000] animate-pulse" />
              <span>{t('projectStatus.badgeOfficial', 'Avance de Infraestructura Oficial')}</span>
            </span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black italic tracking-tighter leading-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
            {t('status_obra').split(' ')[0]} de <span className="text-[#B30000]">{t('status_obra').split(' ').slice(1).join(' ')}</span>
          </h2>
        </div>

        {/* ── BOTÓN DESTACADO EN ROJO REQUERIDO ── */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#B30000] hover:bg-[#960000] text-white text-xs font-black uppercase tracking-wider shadow-xl shadow-red-900/25 active:scale-95 transition-all group"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <AlertTriangle size={14} className="text-white group-hover:rotate-12 transition-transform" />
          </div>
          <span>{t('projectStatus.btnReport', 'Reportar Incidencia Vial')}</span>
        </button>
      </div>

      {/* ── MEDIDOR CIRCULAR DE AVANCE GENERAL OFICIAL (82.33%) ── */}
      <div className={`w-full max-w-full rounded-[2rem] p-5 sm:p-6 shadow-sm border transition-colors ${
        dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
      }`}>
        <div className="flex flex-col items-center">
          <svg width="160" height="160" viewBox="0 0 140 140" className="max-w-full">
            <circle cx="70" cy="70" r="58" fill="none" stroke={dark ? '#27272a' : '#e4e4e7'} strokeWidth="12" />
            <circle cx="70" cy="70" r="58" fill="none" stroke="#B30000" strokeWidth="12" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={dashOffset}
              transform="rotate(-90 70 70)" style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
          </svg>
          <div className="-mt-[108px] mb-[52px] text-center">
            <span className={`text-3xl sm:text-4xl font-black ${dark ? 'text-white' : 'text-zinc-900'}`}>{AVANCE}%</span>
            <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {t('projectStatus.executedL1MB', 'Ejecutado L1MB')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-2 text-center">
            <div className={`p-2 rounded-xl ${dark ? 'bg-zinc-800/70' : 'bg-zinc-50'}`}>
              <span className={`text-[8px] font-black uppercase block ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {t('projectStatus.scheduled', 'Programado')}
              </span>
              <span className={`text-sm font-black ${dark ? 'text-zinc-200' : 'text-zinc-800'}`}>{PROGRAMADO}%</span>
            </div>
            <div className={`p-2 rounded-xl ${dark ? 'bg-zinc-800/70' : 'bg-zinc-50'}`}>
              <span className={`text-[8px] font-black uppercase block ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {t('projectStatus.performanceSpi', 'Desempeño SPI')}
              </span>
              <span className="text-sm font-black text-emerald-500">{SPI}%</span>
            </div>
          </div>

          <p className={`text-[9px] font-black uppercase tracking-widest text-center mt-3 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {t('projectStatus.corteOficial', 'Corte Oficial Empresa Metro de Bogotá (EMB) · Vigencia 2026')}
          </p>
        </div>
      </div>

      {/* ── FRENTES ESPECÍFICOS DE TRABAJO (OFICIAL EMB L1MB) ── */}
      <IndicadoresAvanceL1MB dark={dark} showSummary={false} showFrentes={true} />

      {/* ── SELECTOR POR LOCALIDADES ── */}
      <div className={`w-full max-w-full rounded-[2rem] p-4 sm:p-6 shadow-sm border transition-colors ${
        dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
      }`}>
        <h3 className={`font-black italic text-base sm:text-lg mb-3 sm:mb-4 ${dark ? 'text-white' : 'text-zinc-900'}`}>
          {t('avance_localidad')}
        </h3>
        <div className="flex gap-2 overflow-x-auto no-scroll pb-3">
          {Object.keys(LOCALIDADES).map(name => (
            <button key={name} onClick={() => setSelectedLoc(name)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                selectedLoc === name ? 'bg-[#B30000] text-white shadow-md' : dark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-100 text-zinc-500 hover:text-zinc-900'
              }`}>{t('loc_' + name.toLowerCase().replace(' ', '_'))}</button>
          ))}
        </div>

        {/* Tarjeta de localidad seleccionada */}
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="relative h-40 sm:h-44 rounded-2xl overflow-hidden mb-4">
            <img src={loc.img} className="w-full h-full object-cover" alt={selectedLoc} onError={e => e.target.style.display = 'none'} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <span className="text-white font-black text-xs sm:text-sm uppercase tracking-widest">{t('loc_' + selectedLoc.toLowerCase().replace(' ', '_'))}</span>
              <span className="text-white font-black text-xl sm:text-2xl">{loc.pct}%</span>
            </div>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden shadow-inner mb-3 ${dark ? 'bg-zinc-700' : 'bg-zinc-200'}`}>
            <div className="h-full bg-gradient-to-r from-[#B30000] to-[#E53935] rounded-full transition-all duration-700" style={{ width: `${loc.pct}%` }} />
          </div>
          <p className={`text-xs sm:text-sm font-medium leading-relaxed break-words ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}>{loc.desc}</p>
        </div>
      </div>

      {/* ── ALERTAS INSTITUCIONALES DE CIERRES ── */}
      <div className={`w-full max-w-full rounded-[2rem] p-4 sm:p-6 shadow-sm border transition-colors ${
        dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
      }`}>
        <h3 className={`font-black italic text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2 ${dark ? 'text-white' : 'text-zinc-900'}`}>
          <AlertTriangle size={20} className="text-[#FFD600] flex-shrink-0" /> {t('status_closures_active')}
        </h3>
        <ul className="space-y-3">
          <li className="flex gap-3 items-start">
            <AlertTriangle className="text-[#FFD600] flex-shrink-0 mt-0.5" size={16} />
            <span className={`text-xs sm:text-sm font-medium leading-relaxed break-words ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              <strong>{t('status_caracas')}</strong> {t('status_caracas_desc')}
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <AlertTriangle className="text-[#FFD600] flex-shrink-0 mt-0.5" size={16} />
            <span className={`text-xs sm:text-sm font-medium leading-relaxed break-words ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              <strong>{t('status_primero')}</strong> {t('status_primero_desc')}
            </span>
          </li>
        </ul>
        <div className={`mt-4 p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm font-medium ${
          dark ? 'bg-red-950/30 border-red-800/30 text-red-300' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <p className={`flex items-center gap-2 mb-1 font-black uppercase tracking-widest text-[10px] ${dark ? 'text-red-400' : 'text-red-700'}`}>
            <Bell size={14} /> {t('status_official_alert')}
          </p>
          <span className="break-words">{t('status_alert_text')}</span>
        </div>
      </div>

      {/* ── REQUERIMIENTO CLAVE: BLOQUE "INCIDENCIAS Y ALERTAS VIALES" AL FINAL DE LA SECCIÓN ── */}
      <div id="incidencias-viales-section" className={`w-full max-w-full rounded-[2rem] p-5 sm:p-6 shadow-sm border transition-colors ${
        dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert size={16} className="text-[#B30000]" />
              <h3 className={`font-black italic text-lg sm:text-xl ${dark ? 'text-white' : 'text-zinc-900'}`}>
                {t('incidentsModule.title', 'Incidencias y Alertas Viales')}
              </h3>
            </div>
            <p className={`text-xs ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {t('incidentsModule.subtitle', 'Alertas reportadas por la ciudadanía y sincronizadas en tiempo real con Supabase.')}
            </p>
          </div>

          {/* Botón Reportar dentro del bloque */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#B30000] hover:bg-[#960000] text-white text-[11px] font-black uppercase tracking-wider shadow-md active:scale-95 transition-all"
          >
            <PlusCircle size={14} />
            <span>{t('incidentsModule.btnReport', 'Reportar Novedad')}</span>
          </button>
        </div>

        {/* Categorías de filtrado */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#B30000] text-white shadow-sm'
                  : dark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Listado en tiempo real de alertas ciudadanas */}
        {filteredIncidents.length === 0 ? (
          <div className={`p-8 rounded-2xl border text-center ${
            dark ? 'bg-zinc-800/40 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-500'
          }`}>
            <Car size={32} className="mx-auto mb-2 opacity-50" />
            <p className="font-bold text-xs uppercase tracking-wider">No hay incidencias activas en esta categoría</p>
            <p className="text-[11px] mt-1 text-zinc-400">Si identificas un cierre o desvío, repórtalo con el botón superior.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIncidents.map((inc) => {
              const hasVoted = !!userVotes[inc.id];
              const isConfirmed = inc.status === 'Confirmado';

              return (
                <div
                  key={inc.id}
                  className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                    dark 
                      ? 'bg-zinc-800/60 border-zinc-700/60 hover:border-zinc-600' 
                      : 'bg-zinc-50/80 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Header de Alerta: Badge de Estado y Categoría */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        {/* BADGE DE ESTADO REQUERIDO: "En Verificación", "Confirmado" */}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          isConfirmed
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        }`}>
                          {isConfirmed ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                          <span>{inc.status || 'En Verificación'}</span>
                        </span>

                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-[#B30000] dark:text-red-400 border border-red-500/20 uppercase tracking-wider">
                          {inc.category}
                        </span>
                      </div>

                      {/* HORA DE PUBLICACIÓN REQUERIDA */}
                      <span className="text-[10px] font-medium text-zinc-400 flex items-center gap-1">
                        <Clock size={11} />
                        <span>{formatIncidentTime(inc.created_at)}</span>
                      </span>
                    </div>

                    {/* UBICACIÓN REQUERIDA */}
                    <div className="flex items-start gap-1.5 pt-0.5">
                      <MapPin size={15} className="text-[#B30000] shrink-0 mt-0.5" />
                      <h4 className={`font-black text-xs sm:text-sm leading-snug ${
                        dark ? 'text-white' : 'text-zinc-900'
                      }`}>
                        {inc.location}
                      </h4>
                    </div>

                    {/* Descripción */}
                    <p className={`text-xs leading-relaxed ${
                      dark ? 'text-zinc-300' : 'text-zinc-600'
                    }`}>
                      {inc.description}
                    </p>

                    {/* Foto o evidencia adjunta */}
                    {inc.photo && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700/60 max-h-40">
                        <img 
                          src={inc.photo} 
                          alt="Evidencia fotográfica" 
                          className="w-full h-full object-cover max-h-36 hover:scale-105 transition-transform cursor-pointer"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Footer: Autor y CONTADOR DE VOTOS / APOYOS COMUNITARIOS REQUERIDO */}
                  <div className="pt-2.5 border-t border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between text-[10px]">
                    <span className="text-zinc-400 truncate max-w-[170px]">
                      Por {inc.author_name}
                    </span>

                    {/* Contador de Votos / Apoyos Comunitarios */}
                    <button
                      type="button"
                      onClick={() => handleVote(inc.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-black transition-all active:scale-95 ${
                        hasVoted
                          ? 'bg-[#B30000] text-white border-[#B30000] shadow-sm'
                          : dark
                            ? 'bg-zinc-700/60 border-zinc-600 text-zinc-300 hover:text-white'
                            : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                      }`}
                      title="Votar apoyo / confirmar alerta comunitaria"
                    >
                      <ThumbsUp size={12} className={hasVoted ? 'fill-current' : ''} />
                      <span>{inc.votes || 0} apoyos</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── MODAL DE REGISTRO RÁPIDO DE NOVEDAD VIAL (REQUERIDO) ── */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[300] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl space-y-4 animate-in zoom-in-95 ${
              dark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3 border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 text-[#B30000] flex items-center justify-center font-bold">
                  <AlertTriangle size={17} />
                </div>
                <div>
                  <h4 className="font-black text-base italic leading-tight">{t('incidentsModule.modalTitle', 'Reportar Incidencia Vial')}</h4>
                  <p className="text-[10px] text-zinc-400">{t('incidentsModule.modalSubtitle', 'Alerta ciudadana para la red de movilidad del Metro')}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
                aria-label="Cerrar modal"
              >
                <X size={18} />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 size={42} className="text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-black text-base">{t('incidentsModule.successTitle', '¡Alerta Radicada con Éxito!')}</h4>
                <p className="text-xs text-zinc-400">
                  {t('incidentsModule.successDesc', 'Tu reporte se ha registrado con estado "En Verificación" y ya es visible para la comunidad.')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitIncident} className="space-y-3.5 text-xs">
                {/* 1. Categoría */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                    {t('incidentsModule.stepCategory', '1. Categoría de la Incidencia')}
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2.5 font-bold outline-none border transition-all ${
                      dark 
                        ? 'bg-zinc-800 border-zinc-700 text-white' 
                        : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`}
                  >
                    <option value="Cierres Viales">{t('incidentsModule.optClosures', 'Cierres Viales (Total o Parcial)')}</option>
                    <option value="Desvíos de Tráfico">{t('incidentsModule.optDetours', 'Desvíos de Tráfico (PMT)')}</option>
                    <option value="Obras de Redes">{t('incidentsModule.optNetworks', 'Obras de Redes y Servicios')}</option>
                    <option value="Paso Restringido">{t('incidentsModule.optRestricted', 'Paso Restringido / Banderillero')}</option>
                    <option value="Falla Semafórica">{t('incidentsModule.optSignals', 'Falla Semafórica o Señalización')}</option>
                  </select>
                </div>

                {/* 2. Ubicación / Estación Cercana */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                    {t('incidentsModule.stepStation', '2. Estación Cercana L1 (Opcional)')}
                  </label>
                  <select
                    value={nearbyStation}
                    onChange={e => setNearbyStation(e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2.5 font-bold outline-none border transition-all mb-2 ${
                      dark 
                        ? 'bg-zinc-800 border-zinc-700 text-white' 
                        : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`}
                  >
                    <option value="">{t('incidentsModule.selectStationPh', '-- Seleccionar Estación del Viaducto --')}</option>
                    {QUICK_STATIONS.map((st, i) => (
                      <option key={i} value={st}>{st}</option>
                    ))}
                  </select>

                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                    {t('incidentsModule.stepLocation', 'Ubicación o Intersección Exacta')}
                  </label>
                  <input
                    type="text"
                    required={!nearbyStation}
                    placeholder={t('incidentsModule.locationPlaceholder', 'Ej. Av. Primero de Mayo con Carrera 68 / Av. Caracas con Cll 45')}
                    value={locationInput}
                    onChange={e => setLocationInput(e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2.5 font-semibold outline-none border transition-all ${
                      dark 
                        ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#B30000]' 
                        : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-[#B30000]'
                    }`}
                  />
                </div>

                {/* 3. Descripción */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                    {t('incidentsModule.stepDesc', '3. Descripción de la Novedad')}
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder={t('incidentsModule.descPlaceholder', 'Describe la situación en la vía, carriles bloqueados o rutas alternas recomendadas...')}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className={`w-full rounded-xl p-3 font-medium outline-none border resize-none transition-all ${
                      dark 
                        ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#B30000]' 
                        : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-[#B30000]'
                    }`}
                  />
                </div>

                {/* Botón de Envío */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#B30000] hover:bg-[#960000] text-white text-xs font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw size={15} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={15} />
                      <span>{t('incidentsModule.btnSubmit', 'Publicar Incidencia Vial')}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectStatus;
