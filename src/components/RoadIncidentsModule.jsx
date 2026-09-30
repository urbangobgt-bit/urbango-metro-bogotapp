import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  ThumbsUp, 
  PlusCircle, 
  Filter, 
  CheckCircle2, 
  Send, 
  X, 
  ShieldAlert, 
  Car, 
  Layers, 
  User, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { supabase, isMocking } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18nContext';

// Authentic initial community seed incidents
const INITIAL_INCIDENTS = [
  {
    id: 'inc-1',
    user_id: 'usr-emb-101',
    author_name: 'Carlos Mendoza',
    location: 'Av. Primero de Mayo con Av. Boyacá',
    category: 'Cierres Viales',
    severity: 'Crítico',
    description: 'Cierre total de la calzada norte por maniobra nocturna de izaje de vigas en la Estación 3. Desvío señalizado por la transversal 73.',
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    votes: 42
  },
  {
    id: 'inc-2',
    user_id: 'usr-cit-204',
    author_name: 'Andrea Morales',
    location: 'Av. Caracas entre Calles 45 y 53',
    category: 'Desvíos de Tráfico',
    severity: 'Moderado',
    description: 'Tráfico mixto desviado hacia la Carrera 7 y Carrera 13 debido a demolición de andenes y armado de pilas de viaducto. Recomiendo tomar la NQS.',
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    votes: 28
  },
  {
    id: 'inc-3',
    user_id: 'usr-emb-305',
    author_name: 'Ing. Rodrigo Silva',
    location: 'Calle 72 con Carrera 15 (Intercambiador)',
    category: 'Obras de Redes',
    severity: 'Informativo',
    description: 'Empalme de redes secundarias de gas natural y fibra óptica. Peatones deben usar el paso seguro por la acera sur debidamente señalizada.',
    created_at: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    votes: 19
  },
  {
    id: 'inc-4',
    user_id: 'usr-cit-409',
    author_name: 'Laura Gómez',
    location: 'Av. Villavicencio con Av. Guayacanes',
    category: 'Cierres Viales',
    severity: 'Moderado',
    description: 'Paso restringido a un solo carril por fundición de zapatas para la Estación 2 del Metro. Tránsito con reguladores de tráfico (banderilleros).',
    created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    votes: 35
  }
];

export const RoadIncidentsModule = ({ dark = false }) => {
  const { user, userProfile } = useAuth();
  const { t, lang } = useI18n();

  const currentUserId = user?.id || 'guest-citizen-01';
  const currentUserName = userProfile?.name || user?.name || 'Ciudadano UrbanGo';

  // Incidents state with Supabase & LocalStorage sync
  const [incidents, setIncidents] = useState(() => {
    const cached = localStorage.getItem('urbango_incidents_cache');
    return cached ? JSON.parse(cached) : INITIAL_INCIDENTS;
  });

  const [filterView, setFilterView] = useState('comunidad'); // 'comunidad' | 'mis_reportes'
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [userVotes, setUserVotes] = useState(() => {
    const saved = localStorage.getItem('urbango_incident_votes');
    return saved ? JSON.parse(saved) : {};
  });

  // New report modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [newCategory, setNewCategory] = useState('Cierres Viales');
  const [newSeverity, setNewSeverity] = useState('Moderado');
  const [newDescription, setNewDescription] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sync with Supabase on mount
  useEffect(() => {
    let isMounted = true;

    async function fetchIncidents() {
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
        } catch (err) {
          console.warn('Supabase incidents fetch fallback to local:', err);
        }
      }
    }

    fetchIncidents();
    return () => { isMounted = false; };
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('urbango_incidents_cache', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('urbango_incident_votes', JSON.stringify(userVotes));
  }, [userVotes]);

  // Handle vote
  const handleVote = async (id) => {
    const hasVoted = !!userVotes[id];
    const delta = hasVoted ? -1 : 1;

    // Optimistic update
    const updated = incidents.map(inc => {
      if (inc.id === id) {
        return { ...inc, votes: Math.max(0, (inc.votes || 0) + delta) };
      }
      return inc;
    });
    setIncidents(updated);

    const newVotes = { ...userVotes, [id]: !hasVoted };
    setUserVotes(newVotes);

    // Sync with Supabase if online
    if (!isMocking && supabase) {
      try {
        const target = updated.find(i => i.id === id);
        if (target) {
          await supabase
            .from('incidents')
            .update({ votes: target.votes })
            .eq('id', id);
        }
      } catch (e) {
        console.warn('Could not update vote on Supabase:', e);
      }
    }
  };

  // Submit new incident
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!newLocation.trim() || !newDescription.trim()) return;

    setIsSubmitting(true);

    const newIncident = {
      id: `inc-${Date.now()}`,
      user_id: currentUserId,
      author_name: currentUserName,
      location: newLocation.trim(),
      category: newCategory,
      severity: newSeverity,
      description: newDescription.trim(),
      created_at: new Date().toISOString(),
      votes: 1
    };

    // Optimistic insert
    const updated = [newIncident, ...incidents];
    setIncidents(updated);
    setUserVotes(prev => ({ ...prev, [newIncident.id]: true }));

    // Try Supabase insert
    if (!isMocking && supabase) {
      try {
        await supabase
          .from('incidents')
          .insert([{
            id: newIncident.id,
            user_id: newIncident.user_id,
            location: newIncident.location,
            category: newIncident.category,
            description: newIncident.description,
            created_at: newIncident.created_at,
            votes: newIncident.votes
          }]);
      } catch (err) {
        console.warn('Supabase insert fallback:', err);
      }
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsModalOpen(false);
      setNewLocation('');
      setNewDescription('');
    }, 1200);
  };

  // Filtered incidents
  const displayedIncidents = incidents.filter(inc => {
    if (filterView === 'mis_reportes' && inc.user_id !== currentUserId) {
      return false;
    }
    if (categoryFilter !== 'Todas' && inc.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  const categories = ['Todas', 'Cierres Viales', 'Desvíos de Tráfico', 'Obras de Redes'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── BANNER HEADER & BOTÓN NUEVO REPORTE ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ShieldAlert size={11} />
              <span>{t('incidentsModule.participationBadge', 'Participación Ciudadana · Red Vial Metro')}</span>
            </span>
          </div>
          <h3 className={`text-2xl sm:text-3xl font-black italic tracking-tighter leading-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
            {t('incidentsModule.title', 'Incidencias y Alertas Viales')}
          </h3>
          <p className={`text-xs mt-0.5 ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {t('incidentsModule.subtitle', 'Consulta desvíos y reporta afectaciones en tiempo real para toda la comunidad.')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#B30000] hover:bg-[#960000] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-900/20 active:scale-95 transition-all"
        >
          <PlusCircle size={16} />
          <span>{t('incidentsModule.btnReport', 'Publicar Alerta')}</span>
        </button>
      </div>

      {/* ── FILTROS: "MIS REPORTES" vs "REPORTES DE LA COMUNIDAD" ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Toggle principal */}
        <div className={`p-1 rounded-2xl border flex items-center ${
          dark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
        }`}>
          <button
            type="button"
            onClick={() => setFilterView('comunidad')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              filterView === 'comunidad'
                ? 'bg-[#B30000] text-white shadow-sm'
                : dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            {t('incidentsModule.tabCommunity', 'Reportes de la Comunidad')} ({incidents.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterView('mis_reportes')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              filterView === 'mis_reportes'
                ? 'bg-[#B30000] text-white shadow-sm'
                : dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <User size={13} />
            <span>{t('incidentsModule.tabMyReports', 'Mis Reportes')} ({incidents.filter(i => i.user_id === currentUserId).length})</span>
          </button>
        </div>

        {/* Categorías secundarias */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? dark ? 'bg-zinc-800 text-white border border-zinc-700' : 'bg-white text-zinc-900 border border-zinc-300 shadow-xs'
                  : dark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {cat === 'Todas' ? t('incidentsModule.filterAll', 'Todas') :
               cat === 'Cierres Viales' ? t('incidentsModule.filterClosures', 'Cierres Viales') :
               cat === 'Desvíos de Tráfico' ? t('incidentsModule.filterDetours', 'Desvíos de Tráfico') :
               cat === 'Obras de Redes' ? t('incidentsModule.filterUtilities', 'Obras de Redes') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── LISTADO DE ALERTAS EN TIEMPO REAL ── */}
      {displayedIncidents.length === 0 ? (
        <div className={`p-8 rounded-3xl border text-center ${
          dark ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-500'
        }`}>
          <Car size={32} className="mx-auto mb-2 text-zinc-400" />
          <h4 className="font-black text-sm uppercase tracking-wider">{t('incidentsModule.emptyTitle', 'No hay incidencias registradas en esta vista')}</h4>
          <p className="text-xs mt-1">
            {filterView === 'mis_reportes' 
              ? t('incidentsModule.emptyMyDesc', 'Aún no has publicado reportes viales. ¡Crea el primero usando el botón "Publicar Alerta"!') 
              : t('incidentsModule.emptyGeneralDesc', 'El corredor no presenta reportes bajo el filtro seleccionado.')
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedIncidents.map((inc) => {
            const hasVoted = !!userVotes[inc.id];
            const isMine = inc.user_id === currentUserId;

            return (
              <div
                key={inc.id}
                className={`p-5 rounded-3xl border shadow-sm flex flex-col justify-between space-y-3 transition-all ${
                  dark 
                    ? 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700' 
                    : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="space-y-2">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-500/10 text-[#B30000] dark:text-red-400 border border-red-500/20">
                      <AlertTriangle size={11} />
                      <span>{inc.category}</span>
                    </span>

                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      inc.severity === 'Crítico'
                        ? 'bg-red-500 text-white'
                        : inc.severity === 'Moderado'
                          ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>

                  {/* Location Title */}
                  <div className="flex items-start gap-1.5">
                    <MapPin size={15} className="text-[#B30000] shrink-0 mt-0.5" />
                    <h4 className={`font-black text-sm sm:text-base leading-snug ${
                      dark ? 'text-white' : 'text-zinc-900'
                    }`}>
                      {inc.location}
                    </h4>
                  </div>

                  {/* Description */}
                  <p className={`text-xs leading-relaxed ${dark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    {inc.description}
                  </p>
                </div>

                {/* Footer with Author, Time and Community Upvote */}
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="font-semibold text-zinc-500 dark:text-zinc-400">
                      {isMine ? 'Tú (Tu reporte)' : inc.author_name}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      <span>{new Date(inc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                  </div>

                  {/* Upvote Button */}
                  <button
                    type="button"
                    onClick={() => handleVote(inc.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all active:scale-95 ${
                      hasVoted
                        ? 'bg-[#B30000] text-white border-[#B30000] shadow-sm'
                        : dark
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700'
                          : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
                    }`}
                    title="Votar alerta comunitaria confirmada"
                  >
                    <ThumbsUp size={12} className={hasVoted ? 'fill-current' : ''} />
                    <span>{inc.votes || 0}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL: PUBLICAR NUEVA ALERTA VIAL ── */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl space-y-4 animate-in zoom-in-95 ${
              dark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3 border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 text-[#B30000] flex items-center justify-center font-bold">
                  ⚠️
                </div>
                <div>
                  <h4 className="font-black text-base italic leading-tight">{t('incidentsModule.modalTitle', 'Publicar Alerta Vial')}</h4>
                  <p className="text-[10px] text-zinc-400">{t('incidentsModule.modalSubtitle', 'Notifica a los ciudadanos sobre cierres y desvíos')}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 size={42} className="text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-black text-base">{t('incidentsModule.successTitle', '¡Alerta Publicada con Éxito!')}</h4>
                <p className="text-xs text-zinc-400">{t('incidentsModule.successDesc', 'Gracias por ayudar a mantener informada la movilidad de Bogotá.')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
                {/* Categoría */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                    {t('incidentsModule.typeLabel', 'Tipo de Afectación')}
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2.5 font-bold outline-none border transition-all ${
                      dark 
                        ? 'bg-zinc-800 border-zinc-700 text-white' 
                        : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`}
                  >
                    <option value="Cierres Viales">{t('incidentsModule.optClosures', 'Cierres Viales')}</option>
                    <option value="Desvíos de Tráfico">{t('incidentsModule.optDetours', 'Desvíos de Tráfico')}</option>
                    <option value="Obras de Redes">{t('incidentsModule.optNetworks', 'Obras de Redes (Acueducto/Gas)')}</option>
                    <option value="Paso Restringido">{t('incidentsModule.optRestricted', 'Paso Restringido')}</option>
                  </select>
                </div>

                {/* Ubicación / Corredor */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                    {t('incidentsModule.locationLabel', 'Ubicación o Intersección')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('incidentsModule.locationPlaceholder', 'Ej. Av. Primero de Mayo con Carrera 68')}
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2.5 font-semibold outline-none border transition-all ${
                      dark 
                        ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#B30000]' 
                        : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-[#B30000]'
                    }`}
                  />
                </div>

                {/* Severidad */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                    {t('incidentsModule.severityLabel', 'Nivel de Impacto')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'Informativo', label: t('incidentsModule.sevInformative', 'Informativo') },
                      { key: 'Moderado', label: t('incidentsModule.sevModerate', 'Moderado') },
                      { key: 'Crítico', label: t('incidentsModule.sevCritical', 'Crítico') }
                    ].map(sev => (
                      <button
                        key={sev.key}
                        type="button"
                        onClick={() => setNewSeverity(sev.key)}
                        className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
                          newSeverity === sev.key
                            ? 'bg-[#B30000] text-white border-[#B30000] shadow-sm'
                            : dark 
                              ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white' 
                              : 'bg-zinc-100 border-zinc-200 text-zinc-600'
                        }`}
                      >
                        {sev.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                    {t('incidentsModule.descLabel', 'Descripción del Suceso / Ruta Alterna')}
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder={t('incidentsModule.descPlaceholder', 'Indica qué ocurre en la vía, horarios o desvíos sugeridos...')}
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    className={`w-full rounded-xl p-3 font-medium outline-none border resize-none transition-all ${
                      dark 
                        ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#B30000]' 
                        : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-[#B30000]'
                    }`}
                  />
                </div>

                {/* Botón Enviar */}
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
                      <span>{t('incidentsModule.btnSubmit', 'Publicar en la Red Comunitaria')}</span>
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

export default RoadIncidentsModule;
