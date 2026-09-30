import React, { useState } from 'react';
import { NOTICIAS_INSTITUCIONALES_REALES } from '../data/metroOfficialData';
import { 
  ExternalLink, 
  Share2, 
  Bookmark, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  X, 
  Check, 
  Clock, 
  ShieldCheck, 
  Layers, 
  Building2 
} from 'lucide-react';

export const FeedNoticiasInstitucionales = ({ 
  dark = false, 
  onShowDetail, 
  saved = [], 
  onSave, 
  onShare 
}) => {
  const [selectedNoticia, setSelectedNoticia] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Todas');

  const categories = ['Todas', 'Material Rodante', 'Obras Civiles', 'Expansión Red Metro', 'Renovación Urbana', 'Sostenibilidad'];

  const filteredNews = activeCategory === 'Todas'
    ? NOTICIAS_INSTITUCIONALES_REALES
    : NOTICIAS_INSTITUCIONALES_REALES.filter(n => n.category === activeCategory);

  const handleShare = (n, e) => {
    e.stopPropagation();
    if (onShare) {
      onShare(n);
    } else if (navigator.share) {
      navigator.share({ title: n.title, text: n.desc, url: window.location.href });
    } else {
      navigator.clipboard?.writeText?.(`${n.title} - ${window.location.href}`);
      setCopiedId(n.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleSave = (n, e) => {
    e.stopPropagation();
    if (onSave) onSave(n);
  };

  const openDetail = (n) => {
    if (onShowDetail) {
      onShowDetail(n);
    } else {
      setSelectedNoticia(n);
    }
  };

  return (
    <div className="space-y-4">
      {/* Selector de categorías */}
      <div className="flex gap-1.5 overflow-x-auto no-scroll pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border ${
              activeCategory === cat
                ? 'bg-[#B30000] text-white border-[#B30000] shadow-md'
                : dark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de las 5 noticias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map((n, idx) => {
          const isMain = idx === 0 && activeCategory === 'Todas';
          const isSaved = saved?.some?.(s => s.id === n.id);

          return (
            <div
              key={n.id}
              onClick={() => openDetail(n)}
              className={`rounded-3xl overflow-hidden border shadow-lg cursor-pointer transition-all duration-300 group hover:-translate-y-0.5 flex flex-col justify-between ${
                isMain ? 'md:col-span-2' : ''
              } ${
                dark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:border-zinc-300'
              }`}
            >
              {/* Imagen y badges */}
              <div className={`relative overflow-hidden ${isMain ? 'h-52 sm:h-64' : 'h-44'}`}>
                <img
                  src={n.img}
                  alt={n.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={e => {
                    e.target.src = '/Linea 1 del metro de bogora.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Categoría y urgencia */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md ${
                    n.type === 'breaking' ? 'bg-[#B30000] text-white' : 'bg-zinc-900/90 text-white backdrop-blur-sm'
                  }`}>
                    {n.type === 'breaking' ? '🔴 En Desarrollo' : '📰 Oficial EMB'}
                  </span>
                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                    {n.category}
                  </span>
                </div>

                {/* Localidad */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-[9px] font-bold flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-xl">
                    <MapPin size={11} className="text-[#B30000]" />
                    <span className="truncate max-w-[200px]">{n.localidad}</span>
                  </span>
                  <span className="text-[9px] font-medium opacity-90">{n.date}</span>
                </div>
              </div>

              {/* Contenido textual */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className={`font-black italic leading-tight mb-2 group-hover:text-[#B30000] transition-colors ${
                    isMain ? 'text-lg sm:text-xl' : 'text-base'
                  } ${dark ? 'text-white' : 'text-zinc-900'}`}>
                    {n.title}
                  </h4>
                  <p className={`text-xs font-medium leading-relaxed line-clamp-2 sm:line-clamp-3 ${
                    dark ? 'text-zinc-400' : 'text-zinc-600'
                  }`}>
                    {n.desc}
                  </p>
                </div>

                {/* Pie de tarjeta con acciones */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-500/20 text-xs">
                  <span className={`text-[9px] font-black uppercase tracking-wider ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    Fuente: {n.source}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleShare(n, e)}
                      className={`p-2 rounded-xl transition-colors ${
                        dark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'
                      }`}
                      title="Compartir noticia"
                    >
                      {copiedId === n.id ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
                    </button>
                    {onSave && (
                      <button
                        onClick={(e) => handleSave(n, e)}
                        className={`p-2 rounded-xl transition-colors ${
                          isSaved ? 'text-[#B30000]' : dark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'
                        }`}
                        title={isSaved ? 'Guardada' : 'Guardar noticia'}
                      >
                        <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                    )}
                    <button
                      onClick={() => openDetail(n)}
                      className="px-2.5 py-1 rounded-xl bg-[#B30000]/10 hover:bg-[#B30000] text-[#B30000] hover:text-white font-black text-[9px] uppercase tracking-wider transition-all flex items-center gap-1 ml-1"
                    >
                      <span>Leer</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de detalle local si no se pasó onShowDetail externo */}
      {selectedNoticia && (
        <div 
          className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => setSelectedNoticia(null)}
        >
          <div 
            className={`w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl popup-in p-5 sm:p-6 ${
              dark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#B30000] text-white">
                {selectedNoticia.category}
              </span>
              <button 
                onClick={() => setSelectedNoticia(null)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  dark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-100 text-zinc-600 hover:text-black'
                }`}
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden mb-4">
              <img src={selectedNoticia.img} alt={selectedNoticia.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[9px] font-black uppercase tracking-wider block text-white/80">
                  {selectedNoticia.localidad} · {selectedNoticia.date}
                </span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black italic mb-3 leading-tight">
              {selectedNoticia.title}
            </h3>

            <p className={`text-xs font-semibold mb-4 leading-relaxed ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {selectedNoticia.desc}
            </p>

            <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 mb-4 ${
              dark ? 'bg-zinc-800/60 border-zinc-700 text-zinc-200' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
            }`}>
              <p>{selectedNoticia.fullText}</p>
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 pt-2 border-t border-zinc-500/20">
              <span>Autor: {selectedNoticia.author}</span>
              <span>{selectedNoticia.source}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default FeedNoticiasInstitucionales;
