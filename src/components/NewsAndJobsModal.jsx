import React, { useState, useEffect } from 'react';
import { 
  X, 
  Newspaper, 
  Briefcase, 
  CheckCircle2, 
  ExternalLink, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  Send,
  Building2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useI18n } from '../i18nContext';
import { NOTICIAS_KB, EMPLEOS_KB } from '../data/metroKnowledge';
import NewsFeed from './NewsFeed';
import PortalEmpleoView from './PortalEmpleoView';

export const NewsAndJobsModal = ({
  isOpen = false,
  onClose,
  initialTab = 'noticias',
  selectedItemId = null,
  dark = false,
  onSave,
  onShare,
  saved = [],
  onShowDetail
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('noticias'); // 'noticias' | 'empleo'
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationSent, setApplicationSent] = useState(false);
  const [applicantForm, setApplicantForm] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    experiencia: '6 meses a 1 año'
  });

  // Sync initial tab and selected item when opening
  useEffect(() => {
    if (isOpen) {
      if (initialTab) setActiveTab(initialTab);
      setApplicationSent(false);

      if (selectedItemId) {
        if (selectedItemId === 'job_1' || selectedItemId === 'apply_job_1') {
          setActiveTab('empleo');
          setSelectedJob(EMPLEOS_KB.find(j => j.id === 'job_1') || EMPLEOS_KB[0]);
        } else if (selectedItemId === 'job_2' || selectedItemId === 'apply_job_2') {
          setActiveTab('empleo');
          setSelectedJob(EMPLEOS_KB.find(j => j.id === 'job_2') || EMPLEOS_KB[1]);
        } else if (selectedItemId.startsWith('job_')) {
          setActiveTab('empleo');
          setSelectedJob(EMPLEOS_KB.find(j => j.id === selectedItemId) || EMPLEOS_KB[0]);
        }
      } else {
        setSelectedJob(null);
      }
    }
  }, [isOpen, initialTab, selectedItemId]);

  if (!isOpen) return null;

  const handleApply = (e) => {
    e.preventDefault();
    setApplicationSent(true);
    setTimeout(() => {
      // Auto close after 2.5s or allow user to close
    }, 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-[2500] bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[2rem] border shadow-2xl overflow-hidden transition-all popup-in ${
          dark ? 'bg-zinc-950/98 border-zinc-800 text-white' : 'bg-white/98 border-zinc-200 text-zinc-900'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* ── HEADER ── */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 ${
          dark ? 'border-zinc-800 bg-zinc-900/60' : 'border-zinc-100 bg-zinc-50/70'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#B30000] to-[#E53935] flex items-center justify-center text-white shadow-md flex-shrink-0">
              {activeTab === 'noticias' ? <Newspaper size={20} /> : <Briefcase size={20} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg tracking-tight leading-tight">
                  {activeTab === 'noticias' ? t('newsModule.modalTitle', 'Novedades y Avances Oficiales') : t('jobsModule.modalTitle', 'Convocatorias de Empleo PLMB')}
                </h2>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/10 text-[#B30000] border border-red-500/20 hidden sm:inline">
                  {t('newsModule.empresaMetro', 'Empresa Metro')}
                </span>
              </div>
              <p className={`text-xs font-semibold ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {t('newsModule.canalCiudadano', 'Primera Línea del Metro de Bogotá (PLMB) · Canal Ciudadano')}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              dark ? 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700' : 'bg-zinc-200 text-zinc-600 hover:text-black hover:bg-zinc-300'
            }`}
            title="Cerrar modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── TAB SELECTOR ── */}
        <div className={`px-4 sm:px-6 pt-3 pb-2 border-b flex items-center justify-between gap-3 ${
          dark ? 'border-zinc-800/80 bg-zinc-900/40' : 'border-zinc-100 bg-zinc-50/50'
        }`}>
          <div className={`p-1 rounded-2xl flex items-center gap-1 border ${
            dark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
          }`}>
            <button
              onClick={() => { setActiveTab('noticias'); setSelectedJob(null); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'noticias'
                  ? 'bg-[#B30000] text-white shadow-sm'
                  : dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Newspaper size={14} />
              <span>{t('newsModule.tabNews', 'Últimas Noticias')}</span>
            </button>
            <button
              onClick={() => setActiveTab('empleo')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'empleo'
                  ? 'bg-[#2D8B3C] text-white shadow-sm'
                  : dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Briefcase size={14} />
              <span>{t('newsModule.tabJobs', 'Convocatorias de Empleo')}</span>
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-white/20 text-white">
                {t('newsModule.badgeActive', 'Activas')}
              </span>
            </button>
          </div>

          <span className="text-[10px] font-bold text-zinc-400 hidden sm:inline">
            {t('newsModule.generalProgress', 'Avance general obra:')} <strong className="text-emerald-500">82.33%</strong>
          </span>
        </div>

        {/* ── BODY CONTENT ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scroll">
          {activeTab === 'noticias' ? (
            <div className="space-y-4">
              {/* Highlight Official Banner */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                dark ? 'bg-red-950/20 border-red-500/30' : 'bg-red-50/80 border-red-200'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏗️</span>
                  <div>
                    <h3 className="text-sm font-black text-[#B30000] dark:text-red-400">
                      {t('newsModule.consolidatedProgress', 'Avance General Consolidado: 82.33%')}
                    </h3>
                    <p className={`text-xs font-medium ${dark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      {t('newsModule.consolidatedDesc', '6 vigas lanzadoras activas y pruebas de rodaje dinámico en Patio Taller Bosa.')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Master News Feed with Categories and Filters */}
              <NewsFeed 
                dark={dark} 
                onShowDetail={onShowDetail} 
                saved={saved} 
                onSave={onSave} 
                onShare={onShare} 
              />
            </div>
          ) : (
            <div className="w-full">
              <PortalEmpleoView 
                dark={dark} 
                embedded={true} 
                initialJobId={selectedItemId} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsAndJobsModal;
