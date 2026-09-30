import React, { useState } from 'react';
import { DOCUMENTOS_TRANSPARENCIA_OFICIALES } from '../data/metroOfficialData';
import { useI18n } from '../i18nContext';
import { 
  FileText, 
  Table, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Search, 
  Share2, 
  Check, 
  Eye, 
  X, 
  Building2, 
  FileSpreadsheet, 
  Layers,
  Award
} from 'lucide-react';

export const ModuloTransparenciaDoc = ({ dark = false }) => {
  const { t } = useI18n();
  const [selectedDocPreview, setSelectedDocPreview] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [downloadCount, setDownloadCount] = useState({
    'doc-informe-2025': 1420,
    'doc-contratos-2024': 980
  });

  const handleDownload = (doc) => {
    setDownloadCount(prev => ({
      ...prev,
      [doc.id]: (prev[doc.id] || 0) + 1
    }));
  };

  const handleCopyLink = (doc) => {
    const fullUrl = `${window.location.origin}/${doc.filename}`;
    navigator.clipboard?.writeText?.(fullUrl);
    setCopiedId(doc.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Cabecera del Módulo */}
      <div className={`rounded-3xl p-5 sm:p-6 border shadow-lg ${
        dark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest mb-1.5">
              <ShieldCheck size={12} />
              <span>{t('transparencia.badge', 'Sede Electrónica de Transparencia Distrital')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black italic tracking-tight">
              {t('transparencia.title', 'Gestión Documental y Rendición de Cuentas')}
            </h3>
            <p className={`text-xs font-semibold ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {t('transparencia.subtitle', 'Descarga directa de documentos públicos oficiales expedidos por la Empresa Metro de Bogotá S.A.')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black px-3 py-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 whitespace-nowrap">
              Ley 1712 de Transparencia
            </span>
          </div>
        </div>

        {/* Resumen de Certificaciones de Gestión */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-zinc-500/20 text-center">
          <div className={`p-2.5 rounded-2xl ${dark ? 'bg-zinc-800/50' : 'bg-zinc-50'}`}>
            <span className="text-base font-black text-[#B30000] block">AAA (col)</span>
            <span className={`text-[8px] font-black uppercase tracking-wider ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>Fitch Ratings</span>
          </div>
          <div className={`p-2.5 rounded-2xl ${dark ? 'bg-zinc-800/50' : 'bg-zinc-50'}`}>
            <span className="text-base font-black text-emerald-500 block">93.7 / 100</span>
            <span className={`text-[8px] font-black uppercase tracking-wider ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>Índice Desempeño IDI</span>
          </div>
          <div className={`p-2.5 rounded-2xl ${dark ? 'bg-zinc-800/50' : 'bg-zinc-50'}`}>
            <span className="text-base font-black text-blue-500 block">99.92%</span>
            <span className={`text-[8px] font-black uppercase tracking-wider ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>Cumplimiento PAII</span>
          </div>
          <div className={`p-2.5 rounded-2xl ${dark ? 'bg-zinc-800/50' : 'bg-zinc-50'}`}>
            <span className="text-base font-black text-purple-500 block">223</span>
            <span className={`text-[8px] font-black uppercase tracking-wider ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>Trámites Contractuales</span>
          </div>
        </div>
      </div>

      {/* Tarjetas de Descarga Directa de Documentos Oficiales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DOCUMENTOS_TRANSPARENCIA_OFICIALES.map((doc) => {
          const isPdf = doc.format === 'PDF';
          const currentDownloads = downloadCount[doc.id] || doc.descargas;

          return (
            <div
              key={doc.id}
              className={`rounded-3xl p-5 sm:p-6 border shadow-lg transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                dark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
              }`}
            >
              <div className="space-y-3">
                {/* Cabecera del archivo */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md flex-shrink-0"
                      style={{ backgroundColor: doc.color }}
                    >
                      {isPdf ? <FileText size={24} /> : <FileSpreadsheet size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span 
                          className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md text-white shadow-xs"
                          style={{ backgroundColor: doc.color }}
                        >
                          {doc.format}
                        </span>
                        <span className={`text-[9px] font-bold ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          {doc.size}
                        </span>
                        <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          {doc.badge}
                        </span>
                      </div>
                      <h4 className="font-black italic text-base leading-tight">
                        {doc.title}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Subtítulo institucional y fecha */}
                <div className={`p-2.5 rounded-2xl border text-xs leading-relaxed ${
                  dark ? 'bg-zinc-800/60 border-zinc-700/60 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                }`}>
                  <p className="font-bold text-[11px] mb-1 text-[#B30000] dark:text-red-400">
                    {doc.subtitle}
                  </p>
                  <p className="text-[10px] text-zinc-500 leading-normal">
                    {doc.descripcion}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[9px] font-bold text-zinc-500">
                  <span>Entidad: {doc.entidad}</span>
                  <span>{currentDownloads} descargas</span>
                </div>
              </div>

              {/* Botones de acción: Enlaces oficiales directos o Descarga directa */}
              {doc.externalLinks ? (
                <div className="pt-3 mt-3 border-t border-zinc-500/20 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      href="https://www.metrodebogota.gov.co/base-datos-contratos-2024"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] text-white font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all text-center"
                    >
                      <ExternalLink size={13} />
                      <span>Base Contratos 2024</span>
                    </a>

                    <a
                      href="https://datosabiertos.bogota.gov.co/organization/metro-de-bogota"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-[#2D8B3C] hover:bg-[#1E5E28] text-white font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all text-center"
                    >
                      <ExternalLink size={13} />
                      <span>Datos Abiertos Bogotá</span>
                    </a>
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedDocPreview(doc)}
                      className={`flex items-center gap-1 text-[11px] font-bold transition-colors ${
                        dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      <Eye size={13} />
                      <span>Ver síntesis de contratos</span>
                    </button>
                    <span className="text-[9px] text-zinc-500 font-medium">Sitios verificados</span>
                  </div>
                </div>
              ) : (
                <div className="pt-4 mt-4 border-t border-zinc-500/20 flex items-center gap-2">
                  <a
                    href={`/${doc.filename}`}
                    download={doc.filename}
                    onClick={() => handleDownload(doc)}
                    className="flex-1 py-3 px-4 rounded-xl text-white font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all hover:opacity-90"
                    style={{ backgroundColor: doc.color }}
                  >
                    <Download size={15} />
                    <span>Descargar {doc.format}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedDocPreview(doc)}
                    className={`p-3 rounded-xl border transition-all active:scale-95 ${
                      dark ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
                    }`}
                    title="Ver resumen y detalles"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyLink(doc)}
                    className={`p-3 rounded-xl border transition-all active:scale-95 ${
                      dark ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
                    }`}
                    title="Copiar enlace de descarga directa"
                  >
                    {copiedId === doc.id ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} />}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de previsualización de documento */}
      {selectedDocPreview && (
        <div 
          className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => setSelectedDocPreview(null)}
        >
          <div 
            className={`w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl popup-in p-5 sm:p-6 ${
              dark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span 
                  className="px-2.5 py-1 rounded-lg text-white font-black text-[9px] uppercase tracking-wider"
                  style={{ backgroundColor: selectedDocPreview.color }}
                >
                  {selectedDocPreview.format}
                </span>
                <span className="text-xs font-bold text-zinc-500">{selectedDocPreview.filename}</span>
              </div>
              <button 
                onClick={() => setSelectedDocPreview(null)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  dark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-100 text-zinc-600 hover:text-black'
                }`}
              >
                <X size={16} />
              </button>
            </div>

            <h3 className="text-xl font-black italic mb-1">
              {selectedDocPreview.title}
            </h3>
            <p className="text-xs font-bold text-[#B30000] mb-4">
              {selectedDocPreview.subtitle}
            </p>

            {/* Contenido detallado del documento */}
            {selectedDocPreview.format === 'PDF' ? (
              <div className={`p-4 rounded-2xl border text-xs space-y-3 mb-4 leading-relaxed font-mono ${
                dark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
              }`}>
                <div className="font-bold border-b pb-2 border-zinc-500/20 flex justify-between">
                  <span>EMPRESA METRO DE BOGOTÁ S.A.</span>
                  <span className="text-emerald-500">APROBADO</span>
                </div>
                <p>• <strong>Avance Físico General:</strong> 82.33% ejecutado frente a 83.10% programado (SPI: 99.1%).</p>
                <p>• <strong>Patio Taller:</strong> 85.14% avance (32 UE terminadas, 10 en ejecución, 13.300 m de vía balasto).</p>
                <p>• <strong>Viaducto:</strong> 78.15% ejecutado. 6 vigas lanzadoras activas (Ana, Bella, Camila, Fabiola, Gloria, Helena, Emilia, Denis).</p>
                <p>• <strong>Material Rodante:</strong> 4 primeros trenes recibidos con pruebas dinámicas y CBTC GoA4; 2.759 m vía en placa.</p>
                <p>• <strong>Intercambiador Calle 72:</strong> Operativo al 100% (Acta de terminación suscrita).</p>
                <p>• <strong>Expansión Red Metro:</strong> Línea 2 Subterránea (15.5 km, 11 est.), Extensión Calle 100 (3.25 km) y Línea 3 Soacha.</p>
              </div>
            ) : (
              <div className={`p-4 rounded-2xl border text-xs space-y-2 mb-4 font-mono overflow-x-auto ${
                dark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
              }`}>
                <div className="font-bold border-b pb-2 border-zinc-500/20 flex justify-between">
                  <span>MATRIZ AUDITADA DE CONTRATOS EMB</span>
                  <span className="text-blue-500">VIGENCIA 2024-2025</span>
                </div>
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-zinc-700">
                      <th className="py-1">Contrato</th>
                      <th className="py-1">Objeto</th>
                      <th className="py-1">Valor</th>
                      <th className="py-1">% Avance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1">163 de 2019</td>
                      <td className="py-1">Concesión L1MB</td>
                      <td className="py-1">$12.9 Billones</td>
                      <td className="py-1 text-emerald-500">82.33%</td>
                    </tr>
                    <tr>
                      <td className="py-1">148 de 2020</td>
                      <td className="py-1">Interventoría L1</td>
                      <td className="py-1">$227.000 Mill.</td>
                      <td className="py-1 text-emerald-500">78.45%</td>
                    </tr>
                    <tr>
                      <td className="py-1">151 de 2018</td>
                      <td className="py-1">PMO Gerencia</td>
                      <td className="py-1">$65.000 Mill.</td>
                      <td className="py-1 text-emerald-500">86.82%</td>
                    </tr>
                    <tr>
                      <td className="py-1">153 de 2025</td>
                      <td className="py-1">Héroes Renovación</td>
                      <td className="py-1">$3.450 Mill.</td>
                      <td className="py-1 text-amber-500">15.00%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {selectedDocPreview.externalLinks ? (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href="https://www.metrodebogota.gov.co/base-datos-contratos-2024"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg text-center"
                  >
                    <ExternalLink size={16} />
                    <span>Base Contratos 2024</span>
                  </a>
                  <a
                    href="https://datosabiertos.bogota.gov.co/organization/metro-de-bogota"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-[#2D8B3C] hover:bg-[#1E5E28] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg text-center"
                  >
                    <ExternalLink size={16} />
                    <span>Datos Abiertos Bogotá</span>
                  </a>
                </div>
                <button
                  onClick={() => setSelectedDocPreview(null)}
                  className={`w-full py-2.5 rounded-xl border font-bold text-xs ${
                    dark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                  }`}
                >
                  Cerrar Ventana
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <a
                  href={`/${selectedDocPreview.filename}`}
                  download={selectedDocPreview.filename}
                  onClick={() => handleDownload(selectedDocPreview)}
                  className="flex-1 py-3 rounded-xl text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                  style={{ backgroundColor: selectedDocPreview.color }}
                >
                  <Download size={16} />
                  <span>Descargar Archivo Completo</span>
                </a>
                <button
                  onClick={() => setSelectedDocPreview(null)}
                  className={`px-4 py-3 rounded-xl border font-bold text-xs ${
                    dark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                  }`}
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default ModuloTransparenciaDoc;
