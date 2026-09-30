import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  X,
  ExternalLink,
  Layers
} from 'lucide-react';
import { useI18n } from '../i18nContext';

// Master collection of authentic news categorized per requirement
export const NEWS_DATABASE = [
  {
    id: 'n1',
    category: 'obras',
    categoryLabel: 'Obras y Avance',
    title: 'Hito histórico: El viaducto de la Línea 1 supera el 82% de ejecución física',
    excerpt: 'Con 6 vigas lanzadoras activas en los frentes de Bosa, Primero de Mayo y la Av. Caracas, la Empresa Metro de Bogotá reporta un avance acumulado del 82,33% en toda la infraestructura.',
    content: 'La Empresa Metro de Bogotá (EMB) confirmó que el proyecto de la Primera Línea ha alcanzado el 82,33% de avance físico general. En los talleres de Bosa, el viaducto elevado avanza sin interrupciones con la instalación sistemática de dovelas y los trenes número 1 y 2 en pruebas técnicas sobre vía.',
    date: '14 Sep 2026',
    readMin: 4,
    localidad: 'Kennedy / Bosa',
    isLive: true,
    isBreaking: true,
    img: '/Corredor central.jfif',
    source: 'Empresa Metro de Bogotá',
    url: 'https://www.metrodebogota.gov.co'
  },
  {
    id: 'n2',
    category: 'obras',
    categoryLabel: 'Obras y Avance',
    title: 'Intercambiador subterráneo de la Calle 72 entra en fase final de integración peatonal',
    excerpt: 'Finalizan obras estructurales bajo la Avenida Caracas y Carrera 15, permitiendo el flujo continuo del tráfico mixto y la futura conexión directa con la Línea 2.',
    content: 'El paso a desnivel de la Calle 72 ya opera plenamente para descongestionar el norte de Bogotá. Los equipos concentran esfuerzos en el espacio público circundante, rampas de accesibilidad universal y la futura estación 16.',
    date: '12 Sep 2026',
    readMin: 3,
    localidad: 'Barrios Unidos / Chapinero',
    isLive: false,
    isBreaking: false,
    img: '/caracas calle 69 y 72a.png',
    source: 'Secretaría Distrital de Movilidad',
    url: 'https://www.movilidadbogota.gov.co'
  },
  {
    id: 'n3',
    category: 'sostenibilidad',
    categoryLabel: 'Sostenibilidad',
    title: 'El Metro evitará 171.000 toneladas de CO₂ al año en la cuenca de Bogotá',
    excerpt: 'Operación 100% eléctrica con frenado regenerativo y subestaciones eléctricas alimentadas por fuentes renovables certificadas.',
    content: 'Al sustituir más de 19 millones de viajes anuales en vehículos de combustión fósil, la Primera Línea del Metro se consolida como el proyecto de descarbonización urbana más ambicioso de Colombia. Además, se han sembrado más de 6.000 árboles de especies nativas en el corredor de compensación ambiental.',
    date: '10 Sep 2026',
    readMin: 3,
    localidad: 'Bogotá Región',
    isLive: false,
    isBreaking: false,
    img: '/Parque de los hippies.jfif',
    source: 'Secretaría de Ambiente',
    url: 'https://www.ambientebogota.gov.co'
  },
  {
    id: 'n4',
    category: 'sostenibilidad',
    categoryLabel: 'Sostenibilidad',
    title: 'Plan de Renaturalización: Nuevos corredores verdes a lo largo de la Av. Primero de Mayo',
    excerpt: 'Se implementan jardines de lluvia y sistemas de drenaje sostenible (SUDs) en los bajos del viaducto para mitigar islas de calor.',
    content: 'Bajo el viaducto elevado se están instalando senderos peatonales permeables, ciclorrutas iluminadas con tecnología solar y franjas de jardinería urbana que absorben el agua lluvia y reducen el ruido ambiental en las localidades del sur.',
    date: '08 Sep 2026',
    readMin: 2,
    localidad: 'Antonio Nariño / Puente Aranda',
    isLive: false,
    isBreaking: false,
    img: '/Corredor central.jfif',
    source: 'Jardín Botánico de Bogotá',
    url: 'https://www.jbb.gov.co'
  },
  {
    id: 'n5',
    category: 'licitaciones',
    categoryLabel: 'Licitaciones',
    title: 'Licitación Internacional de la Línea 2 Subterránea recibe propuestas de consorcios globales',
    excerpt: 'El corredor de 15,5 km que conectará Chapinero, Barrios Unidos, Engativá y Suba avanza hacia su adjudicación definitiva.',
    content: 'Con el respaldo financiero del Banco Interamericano de Desarrollo (BID), el Banco Mundial (BIRF) y el Banco Europeo de Inversiones (BEI), avanza la fase de evaluación técnica y financiera para la construcción y operación de la segunda línea 100% subterránea.',
    date: '05 Sep 2026',
    readMin: 4,
    localidad: 'Suba / Engativá',
    isLive: false,
    isBreaking: true,
    img: '/caracas calle 19 y 22.jfif',
    source: 'SECOP II / EMB',
    url: 'https://www.colombiacompra.gov.co'
  },
  {
    id: 'n6',
    category: 'licitaciones',
    categoryLabel: 'Licitaciones',
    title: 'Publicados pliegos para la Extensión de la Línea 1 hasta la Calle 100',
    excerpt: 'Estudio de factibilidad y diseños de detalle para las 4 nuevas estaciones elevadas sobre la troncal Caracas Norte.',
    content: 'La EMB abrió el proceso contractual para los estudios de ingeniería de valor de la extensión norte de la L1MB, que conectará la Calle 72 con la Calle 100, facilitando el transbordo directo con la nueva troncal de la Carrera 68 y el Regiotram del Norte.',
    date: '02 Sep 2026',
    readMin: 3,
    localidad: 'Usaquén / Chapinero',
    isLive: false,
    isBreaking: false,
    img: '/Caracas.jfif',
    source: 'Empresa Metro de Bogotá',
    url: 'https://www.metrodebogota.gov.co'
  },
  {
    id: 'n7',
    category: 'empleo_cultura',
    categoryLabel: 'Empleo y Cultura',
    title: 'Feria de Empleo Metro: Convocatoria abierta para 180 vacantes de operación y mantenimiento',
    excerpt: 'Perfiles para técnicos electricistas, inspectores de vía férrea, operadores de estación y controladores de tráfico CBTC.',
    content: 'El concesionario Metro Línea 1 y la Alcaldía Mayor habilitaron mesas de postulación priorizadas para residentes de las localidades de Bosa, Kennedy, Antonio Nariño, Santa Fe y Chapinero. La formación técnica cuenta con becas de certificación en sistemas ferroviarios GoA4.',
    date: '01 Sep 2026',
    readMin: 2,
    localidad: 'Bosa / Kennedy',
    isLive: false,
    isBreaking: false,
    img: '/caracas calle 13 y 19.jfif',
    source: 'Agencia Distrital de Empleo',
    url: 'https://bogotatrabaja.gov.co'
  },
  {
    id: 'n8',
    category: 'empleo_cultura',
    categoryLabel: 'Empleo y Cultura',
    title: 'Cultura Metro: Nace el programa de convivencia y arte en las estaciones elevadas',
    excerpt: 'Artistas locales intervienen murales y se lanzan talleres de apropiación ciudadana en colegios y centros comunales.',
    content: 'Inspirado en el civismo y respeto que caracterizarán el nuevo sistema de transporte, la Secretaría de Cultura y la EMB lanzaron el decálogo de Cultura Metro con intervenciones artísticas, exposiciones fotográficas de la historia del transporte y guías escolares.',
    date: '28 Ago 2026',
    readMin: 3,
    localidad: 'Todas las localidades',
    isLive: false,
    isBreaking: false,
    img: '/Corredor central.jfif',
    source: 'Secretaría de Cultura, Recreación y Deporte',
    url: 'https://www.culturarecreacionydeporte.gov.co'
  }
];

const CATEGORY_MAP = {
  todas: { label: 'Todas', labelEn: 'All' },
  obras: { label: 'Obras y Avance', labelEn: 'Works & Progress', color: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30' },
  sostenibilidad: { label: 'Sostenibilidad', labelEn: 'Sustainability', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
  licitaciones: { label: 'Licitaciones', labelEn: 'Tenders & Contracts', color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30' },
  empleo_cultura: { label: 'Empleo y Cultura', labelEn: 'Jobs & Culture', color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30' }
};

export const NewsFeed = ({
  dark = false,
  saved = [],
  onSave = null,
  onShare = null,
  onShowDetail = null
}) => {
  const { t, lang } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Trigger skeleton loader briefly on category change or search for polished feeling
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  const categories = ['todas', 'obras', 'sostenibilidad', 'licitaciones', 'empleo_cultura'];

  // Filtered and Searched items
  const filteredNews = useMemo(() => {
    return NEWS_DATABASE.filter(item => {
      const matchCategory = selectedCategory === 'todas' || item.category === selectedCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.localidad.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* ── HEADER Y BÚSQUEDA ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.22em] px-2.5 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-[#B30000] dark:text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B30000] animate-pulse" />
              <span>{t('newsModule.liveFeedBadge', 'Bogotá Live Feed · EMB Oficial')}</span>
            </span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black italic tracking-tighter leading-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
            {t('newsModule.title', 'Noticias y Novedades del Metro')}
          </h2>
        </div>

        {/* Real-time search bar */}
        <div className="relative w-full md:w-72">
          <Search size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('newsModule.searchPlaceholder', 'Buscar noticias, frentes, temas...')}
            className={`w-full rounded-2xl pl-10 pr-9 py-2.5 text-xs font-semibold outline-none border transition-all ${
              dark 
                ? 'bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#B30000]' 
                : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-[#B30000]'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── BARRA DE FILTROS POR CATEGORÍA ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((catKey) => {
          const isSelected = selectedCategory === catKey;
          const label = 
            catKey === 'todas' ? t('newsModule.catAll', 'Todas') :
            catKey === 'obras' ? t('newsModule.catWorks', 'Obras y Avance') :
            catKey === 'sostenibilidad' ? t('newsModule.catSustainability', 'Sostenibilidad') :
            catKey === 'licitaciones' ? t('newsModule.catTenders', 'Licitaciones') :
            t('newsModule.catJobsCulture', 'Empleo y Cultura');
          
          return (
            <button
              key={catKey}
              type="button"
              onClick={() => setSelectedCategory(catKey)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                isSelected
                  ? 'bg-[#B30000] text-white shadow-md shadow-red-900/20 ring-2 ring-[#B30000]/30'
                  : dark
                    ? 'bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                    : 'bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              <span>{label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected 
                  ? 'bg-white/20 text-white' 
                  : dark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-500'
              }`}>
                {catKey === 'todas' 
                  ? NEWS_DATABASE.length 
                  : NEWS_DATABASE.filter(n => n.category === catKey).length
                }
              </span>
            </button>
          );
        })}
      </div>

      {/* ── SKELETON LOADERS DURANTE CARGA / CAMBIO ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(sk => (
            <div 
              key={sk} 
              className={`rounded-3xl p-4 border overflow-hidden animate-pulse space-y-3 ${
                dark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'
              }`}
            >
              <div className={`w-full h-44 rounded-2xl ${dark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
              <div className="space-y-2 pt-1">
                <div className={`h-3 w-1/3 rounded-md ${dark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
                <div className={`h-5 w-4/5 rounded-md ${dark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
                <div className={`h-3 w-full rounded-md ${dark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
                <div className={`h-3 w-2/3 rounded-md ${dark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
              </div>
            </div>
          ))}
        </div>
      ) : filteredNews.length === 0 ? (
        /* Estado Vacío */
        <div className={`rounded-3xl p-10 text-center border ${
          dark ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-500'
        }`}>
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-[#B30000] flex items-center justify-center mx-auto mb-3 text-2xl">
            📰
          </div>
          <h3 className="font-black text-base uppercase tracking-wider">No se encontraron noticias</h3>
          <p className="text-xs mt-1 max-w-sm mx-auto">
            Prueba ajustando los términos de búsqueda o seleccionando la categoría "Todas".
          </p>
          <button
            type="button"
            onClick={() => { setSelectedCategory('todas'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#B30000] text-white text-xs font-black uppercase tracking-wider hover:bg-[#960000] transition-colors"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        /* ── GRID DE NOTICIAS CON SEPARACIÓN Y LAYOUT PULIDO ── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNews.map((news, idx) => {
            const isSaved = saved.some(s => s.id === news.id || s.title === news.title);
            const catBadge = CATEGORY_MAP[news.category] || CATEGORY_MAP.obras;

            return (
              <article
                key={news.id}
                onClick={() => onShowDetail && onShowDetail(news)}
                className={`group rounded-3xl overflow-hidden border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer ${
                  dark 
                    ? 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 hover:-translate-y-1' 
                    : 'bg-white border-zinc-200 hover:border-zinc-300 hover:-translate-y-1'
                }`}
              >
                {/* Imagen y Badges */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-zinc-950">
                  <img 
                    src={news.img} 
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = '/Corredor central.jfif';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Breaking or Live Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {news.isLive && (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#B30000] text-white text-[9px] font-black uppercase tracking-widest shadow">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        {lang === 'en' ? 'LIVE' : lang === 'pt' ? 'AO VIVO' : lang === 'zh' ? '直播' : lang === 'ja' ? 'ライブ' : 'EN VIVO'}
                      </span>
                    )}
                    {news.isBreaking && !news.isLive && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest shadow">
                        {lang === 'en' ? 'BREAKING' : lang === 'pt' ? 'URGENTE' : lang === 'zh' ? '突发' : lang === 'ja' ? '速報' : 'URGENTE'}
                      </span>
                    )}
                  </div>

                  {/* Localidad Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold uppercase tracking-wider">
                      <MapPin size={10} className="text-amber-300" />
                      <span>{news.localidad}</span>
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  {onSave && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSave(news);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                        isSaved 
                          ? 'bg-[#B30000] text-white' 
                          : 'bg-black/50 text-white/80 hover:text-white hover:bg-black/70'
                      }`}
                      title={isSaved ? t('newsModule.saved', 'Guardada') : t('newsModule.save', 'Guardar noticia')}
                    >
                      {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                    </button>
                  )}
                </div>

                {/* Contenido Editorial */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    {/* Categoría & Tiempo */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${catBadge.color}`}>
                        {news.category === 'obras' ? t('newsModule.catWorks', 'Obras y Avance') :
                         news.category === 'sostenibilidad' ? t('newsModule.catSustainability', 'Sostenibilidad') :
                         news.category === 'licitaciones' ? t('newsModule.catTenders', 'Licitaciones') :
                         t('newsModule.catJobsCulture', 'Empleo y Cultura')}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] font-medium text-zinc-400">
                        <Clock size={11} />
                        <span>{news.readMin} {t('newsModule.minRead', 'min lectura')}</span>
                      </div>
                    </div>

                    {/* Título */}
                    <h3 className={`font-black text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#B30000] transition-colors ${
                      dark ? 'text-white' : 'text-zinc-900'
                    }`}>
                      {news.title}
                    </h3>

                    {/* Bajada / Excerpt */}
                    <p className={`text-xs line-clamp-2 leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {news.excerpt}
                    </p>
                  </div>

                  {/* Footer de Tarjeta: Fecha, Fuente y Acción */}
                  <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
                      <Calendar size={11} />
                      <span>{news.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[#B30000] font-black uppercase tracking-wider group-hover:translate-x-0.5 transition-transform">
                      <span>{t('newsModule.readMore', 'Leer Más')}</span>
                      <ChevronRight size={13} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
