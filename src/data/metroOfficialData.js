// Datos oficiales de la Empresa Metro de Bogotá (EMB) S.A.
// Fuente: Informe de Gestión 2025 (Aprobado por Junta Directiva el 18 de febrero de 2026 y Asamblea de Accionistas el 27 de marzo de 2026)

export const METRICAS_L1MB_OFICIALES = {
  avanceFisicoGeneral: {
    ejecutado: 82.33,
    programado: 83.10,
    spi: 99.1, // Schedule Performance Index
    periodo: 'Corte oficial Vigencia 2026 (Empresa Metro de Bogotá - EMB)',
    planEjecucion: 'Plan de Ejecución Vigente PE V14'
  },
  patioTaller: {
    avance: 85.14,
    unidadesTotales: 43,
    unidadesTerminadas: 32,
    unidadesEnEjecucion: 10,
    viaBalastoMetros: 13300,
    detalles: 'Instalación de tercer riel, energización de Subestación SET y SER-1, acabados de edificios de acceso y vía definitiva.'
  },
  viaducto: {
    ejecutado: 78.15,
    programado: 77.97,
    desempeno: 100.2,
    totalApoyos: 745,
    vigasLanzadoras: [
      { nombre: 'Ana', frente: 'WF1 (K0+000 a K4+050)', tramo: 'Bosa - Av. Villavicencio' },
      { nombre: 'Bella', frente: 'WF1 y WF2', tramo: 'Av. Villavicencio - Av. Primero de Mayo' },
      { nombre: 'Camila', frente: 'WF2 y WF6', tramo: 'Av. Primero de Mayo / Caracas Norte' },
      { nombre: 'Fabiola', frente: 'WF2', tramo: 'Primero de Mayo con Boyacá' },
      { nombre: 'Gloria', frente: 'WF3 (K8+025 a K12+416)', tramo: 'Av. NQS - Intersección Pulpo' },
      { nombre: 'Helena', frente: 'WF4 (K12+416 a K16+410)', tramo: 'Caracas Sur - Av. Jiménez' },
      { nombre: 'Emilia', frente: 'WF5 (K16+410 a K19+900)', tramo: 'Caracas Centro - Calle 26' },
      { nombre: 'Denis', frente: 'WF6 (K19+900 a K23+864)', tramo: 'Caracas Norte - Calle 72' },
    ]
  },
  materialRodanteYVias: {
    trenesLlegados: 4,
    pruebasDinamicas: 'En ejecución con sistema CBTC GoA4 en vía de pruebas del Patio Taller',
    viaPlacaViaductoMetros: 2759,
    avanceViaPlacaPct: 11.5,
    viaBalastoPatioTallerMetros: 13300,
    avanceViaBalastoPct: 80.0,
    sistemasInstalados: ['CBTC (Control de Trenes)', 'Subestación Receptora SER-1', 'Subestación Tracción SET', 'Tercer Riel', 'Puertas de Andén en edificio de pruebas', 'Telecomunicaciones y Barreras de acceso']
  },
  intercambiadorCalle72: {
    operatividad: 100,
    estado: 'Operativo al 100%',
    fechaEntradaOperacion: '17 de febrero de 2025',
    fechaActaTerminacion: '26 de junio de 2025 (Unidad de Ejecución 304)',
    detalles: 'Paso a desnivel deprimido de la Calle 72 bajo la Av. Caracas en operación vehicular continua; obras complementarias de urbanismo y conexión peatonal.'
  },
  hitoOperativo2026: {
    distanciaPruebasKm: 5.7,
    tramoPruebas: 'Desde Patio Taller (Bosa) hasta Estación 4 (Av. Primero de Mayo)',
    entregaEstacion1: 'Estación 1 construida en su totalidad para pruebas de sistemas integrados',
    aperturaComercial: 'Marzo de 2028',
    pruebasPasajeros: '2027'
  }
};

// Capas geográficas estructuradas para el mapa interactivo
export const CAPAS_MAPA_METRO = {
  linea1: {
    id: 'l1',
    nombre: 'Línea 1 (L1MB)',
    tipo: 'Viaducto Elevado',
    color: '#B30000',
    longitudKm: 23.9,
    estacionesCount: 16,
    estado: 'En construcción activa (82,33% ejecutado)',
    descripcion: 'Corredor principal desde el Patio Taller en Bosa hasta la Calle 72 por la Av. Villavicencio, Av. Primero de Mayo y Av. Caracas.'
  },
  linea2: {
    id: 'l2',
    nombre: 'Línea 2 (L2MB)',
    tipo: 'Corredor Subterráneo',
    color: '#0070F3',
    longitudKm: 15.5,
    estacionesCount: 11,
    estado: 'Licitación pública internacional (Recepción de ofertas 2026)',
    descripcion: 'Corredor subterráneo de 15,5 km que conectará Chapinero, Barrios Unidos, Engativá y Suba, finalizando en el Patio Taller de Fontanar del Río.',
    estaciones: [
      { id: 'l2-e1', code: 'E1-L2', name: 'Estación Calle 72 / Cra 11', localidad: 'Chapinero', lat: 4.6565, lng: -74.0560, tipo: 'Subterránea', conexion: 'Intercambio Peatonal Cra 11' },
      { id: 'l2-e2', code: 'E2-L2', name: 'Estación Caracas / Calle 72', localidad: 'Chapinero / Barrios Unidos', lat: 4.6582, lng: -74.0625, tipo: 'Subterránea', conexion: 'Intercambio L1MB & TransMilenio' },
      { id: 'l2-e3', code: 'E3-L2', name: 'Estación Calle 72 / NQS', localidad: 'Barrios Unidos', lat: 4.6640, lng: -74.0745, tipo: 'Subterránea', conexion: 'Troncal NQS TransMilenio' },
      { id: 'l2-e4', code: 'E4-L2', name: 'Estación Calle 72 / Av. 68', localidad: 'Barrios Unidos / Engativá', lat: 4.6710, lng: -74.0900, tipo: 'Subterránea', conexion: 'Troncal Av. 68' },
      { id: 'l2-e5', code: 'E5-L2', name: 'Estación Calle 72 / Av. Boyacá', localidad: 'Engativá', lat: 4.6790, lng: -74.1030, tipo: 'Subterránea', conexion: 'Av. Boyacá' },
      { id: 'l2-e6', code: 'E6-L2', name: 'Estación Calle 72 / Av. Cali', localidad: 'Engativá', lat: 4.6880, lng: -74.1180, tipo: 'Subterránea', conexion: 'Av. Ciudad de Cali' },
      { id: 'l2-e7', code: 'E7-L2', name: 'Estación Av. Cali / Calle 80', localidad: 'Engativá', lat: 4.6980, lng: -74.1105, tipo: 'Subterránea', conexion: 'Troncal Calle 80 Portal 80' },
      { id: 'l2-e8', code: 'E8-L2', name: 'Estación Av. Cali / Calle 90', localidad: 'Engativá / Suba', lat: 4.7100, lng: -74.1020, tipo: 'Subterránea', conexion: 'Conexión Humedal Juan Amarillo' },
      { id: 'l2-e9', code: 'E9-L2', name: 'Estación Cra 91 / Av. Suba', localidad: 'Suba', lat: 4.7240, lng: -74.0960, tipo: 'Subterránea', conexion: 'Troncal Suba TransMilenio' },
      { id: 'l2-e10', code: 'E10-L2', name: 'Estación Av. Cali / Calle 132', localidad: 'Suba', lat: 4.7380, lng: -74.0940, tipo: 'Subterránea', conexion: 'Centro Suba' },
      { id: 'l2-e11', code: 'E11-L2', name: 'Estación Patio Taller Fontanar del Río', localidad: 'Suba', lat: 4.7520, lng: -74.1080, tipo: 'Superficie / Patio', conexion: 'Patio Taller L2MB' }
    ]
  },
  extensionL1: {
    id: 'ext-l1',
    nombre: 'Extensión Línea 1 (Calle 100)',
    tipo: 'Viaducto / Integración Norte',
    color: '#8E24AA',
    longitudKm: 3.25,
    estado: 'Estudios de Factibilidad APP-IP (Iniciativa Privada CHEC)',
    descripcion: 'Trazado de 3,25 km que extiende la Línea 1 desde la Calle 72 hasta la Calle 100, interconectando con la Troncal Av. 68 y el Regiotram del Norte en Calle 94/NQS.',
    estaciones: [
      { id: 'ext-e1', code: 'EXT-1', name: 'Estación Los Héroes / Calle 80', localidad: 'Chapinero', lat: 4.6675, lng: -74.0610, tipo: 'Elevada', conexion: 'Espacio Público Monumento a Los Héroes & Calle 80' },
      { id: 'ext-e2', code: 'EXT-2', name: 'Estación Calle 85', localidad: 'Chapinero', lat: 4.6730, lng: -74.0590, tipo: 'Elevada', conexion: 'Zona Rosa / Virrey' },
      { id: 'ext-e3', code: 'EXT-3', name: 'Estación Calle 94 / NQS', localidad: 'Chapinero / Usaquén', lat: 4.6805, lng: -74.0570, tipo: 'Elevada / Intermodal', conexion: 'Interconexión Regiotram del Norte (Tren de Zipaquirá)' },
      { id: 'ext-e4', code: 'EXT-4', name: 'Estación Terminal Calle 100', localidad: 'Usaquén / Suba', lat: 4.6885, lng: -74.0550, tipo: 'Elevada / Intermodal', conexion: 'Conexión Troncal Av. 68 de TransMilenio' }
    ]
  },
  redRegionalL3: {
    id: 'l3-regional',
    nombre: 'Red Regional y Línea 3 (Soacha)',
    tipo: 'Red Férrea Urbano-Regional',
    color: '#FF6D00',
    estado: 'En estructuración y factibilidad (Convenio Marco 125 de 2024 / Contrato 198)',
    descripcion: 'Proyección de integración férrea con Soacha y los corredores regionales de Cundinamarca (Regiotram de Occidente y Regiotram del Norte / Tren de Zipaquirá).',
    trazado: [
      [4.5800, -74.2250], // Soacha Centro
      [4.5950, -74.2050], // San Mateo
      [4.6100, -74.1850], // Bosa Estación
      [4.6280, -74.1650], // Portal Sur / Conexión L1MB
      [4.6390, -74.1350], // Corredor Férreo Sur
      [4.6320, -74.0900]  // Estación Central / Regiotram
    ]
  }
};

// Las 5 Noticias Institucionales Oficiales Reales
export const NOTICIAS_INSTITUCIONALES_REALES = [
  {
    id: 101,
    type: 'breaking',
    urgency: 'Alta',
    title: 'Llegada del Material Rodante y Pruebas Dinámicas',
    titleKey: 'news_mat_rodante_title',
    date: 'Febrero 2026',
    author: 'Empresa Metro de Bogotá',
    source: 'Informe de Gestión Oficial EMB 2025',
    category: 'Movilidad',
    readMin: 3,
    localidad: 'Bosa – Patio Taller',
    img: '/Corredor central.jfif',
    desc: 'Inspección e inicio de pruebas dinámicas con sistema de señalización y control CBTC GoA4 en el Patio Taller de Bosa, tras el arribo de los primeros 4 trenes.',
    fullText: 'Durante la vigencia 2025 y comienzos de 2026, el proyecto de la Primera Línea del Metro de Bogotá consolidó hitos determinantes con la llegada de los primeros cuatro trenes al país y el arribo de vehículos auxiliares especializados. En el Patio Taller de Bosa se habilitó la vía de pruebas sobre balasto (con 13.300 metros construidos) y se energizaron la Subestación Receptora SER-1 y la Subestación de Tracción SET, permitiendo iniciar el riguroso protocolo de pruebas dinámicas y verificación con el sistema automatizado CBTC (Communication-Based Train Control) de grado GoA4. El concesionario avanza paralelamente en el montaje de tercer riel y puertas de andén en el edificio de pruebas.',
    gallery: ['/Corredor central.jfif', '/Linea 1 del metro de bogora.png']
  },
  {
    id: 102,
    type: 'noticia',
    urgency: 'Alta',
    title: 'Operación Continua de Vigas Lanzadoras en 6 Frentes',
    titleKey: 'news_vigas_lanzadoras_title',
    date: 'Febrero 2026',
    author: 'Concesionario Metro Línea 1',
    source: 'Supervisión de Interventoría L1MB',
    category: 'Obras',
    readMin: 4,
    localidad: 'Corredores Villavicencio, 1 de Mayo y Caracas',
    img: '/caracas calle 69 y 72a.png',
    desc: 'Montaje simultáneo de dovelas y vigas U en los 6 frentes de obra mediante las vigas lanzadoras Ana, Bella, Camila, Fabiola, Gloria, Helena, Emilia y Denis.',
    fullText: 'El componente de viaducto alcanzó un 78,15% de ejecución física, superando la meta programada de 77,97% (desempeño de 100,2%). Este ritmo constructivo sin precedentes es impulsado por la operación continua de 6 vigas lanzadoras pesadas operando simultáneamente: "Ana" y "Bella" en el frente WF1; "Bella", "Camila" y "Fabiola" en WF2; "Gloria" en WF3; "Helena" en WF4; "Emilia" en WF5 y "Denis" en WF6. Sobre el viaducto ya se han instalado 2.759 metros de vía férrea en placa, especialmente en las interestaciones 1 y 2, consolidando la superestructura elevada que transformará el transporte masivo en la capital.',
    gallery: ['/caracas calle 69 y 72a.png', '/caracas calle 19 y 22.jfif']
  },
  {
    id: 103,
    type: 'noticia',
    urgency: 'Media',
    title: 'Avanza Licitación Internacional de la Línea 2 Subterránea',
    titleKey: 'news_licitacion_l2_title',
    date: 'Enero 2026',
    author: 'Empresa Metro de Bogotá',
    source: 'Dirección de Contratación & Banca Multilateral',
    category: 'Obras',
    readMin: 3,
    localidad: 'Chapinero, Barrios Unidos, Engativá y Suba',
    img: '/Linea 1 del metro de bogora.png',
    desc: 'Evaluación de ofertas finales para la concesión del tramo subterráneo de 15,5 km y 11 estaciones que beneficiará a más de 2,5 millones de habitantes.',
    fullText: 'El proceso de licitación pública internacional (GIPPF-LPI-001-2023) para la Línea 2 del Metro de Bogotá avanza en su recta definitiva con dos grupos internacionales precalificados y habilitados: APCA 3 (APCA Bogotá Metro 2) y APCA 4 (Unión L2 Bogotá Metro Rail). El proyecto cuenta con el respaldo financiero de la Banca Multilateral, habiendo suscrito un convenio de línea de crédito condicional (CCLIP) por USD 415 millones con el BID. El corredor subterráneo conectará la Calle 72 con Suba y Engativá a lo largo de 15,5 km, incorporando 11 estaciones de alta tecnología.',
    gallery: ['/Linea 1 del metro de bogora.png', '/Corredor central.jfif']
  },
  {
    id: 104,
    type: 'noticia',
    urgency: 'Media',
    title: 'Estructuración del Espacio Público Monumento a Los Héroes',
    titleKey: 'news_heroes_title',
    date: 'Noviembre 2025 / 2026',
    author: 'Gerencia de Desarrollo Urbano e Inmobiliario',
    source: 'Acuerdo Distrital 927 / Contratos 153 y 159 de 2025',
    category: 'Obras',
    readMin: 2,
    localidad: 'Autopista Norte con Calle 80',
    img: '/Caracas.jfif',
    desc: 'Proyecto de renovación urbana e integración con la nueva estación de la Calle 80, preservando el valor histórico y cultural del emblemático hito.',
    fullText: 'En cumplimiento del Artículo 197 del Acuerdo Distrital 927 de 2024 y los requerimientos del Ministerio de las Culturas, las Artes y los Saberes, la Empresa Metro de Bogotá suscribió los Contratos 153 y 159 de 2025 para la estructuración integral del proyecto de intervención y ocupación del espacio público en el histórico sector de Los Héroes. La iniciativa contempla un elemento conmemorativo visual y un diseño paisajístico de vanguardia integrado directamente con el nuevo viaducto y las plataformas de transferencia intermodal con TransMilenio.',
    gallery: ['/Caracas.jfif', '/caracas calle 13 y 19.jfif']
  },
  {
    id: 105,
    type: 'noticia',
    urgency: 'Baja',
    title: 'Estrategia "Metro te Acompaña" y Apoyo a Micronegocios',
    titleKey: 'news_ambiental_piga_title',
    date: 'Vigencia 2025-2026',
    author: 'Gerencia Ambiental y Social EMB',
    source: 'Plan Social y de Gestión Ambiental (PIGA)',
    category: 'Comercio',
    readMin: 3,
    localidad: 'Distrito Capital – Corredor L1MB',
    img: '/caracas calle 13 y 19.jfif',
    desc: 'Más de 1.628 acciones comunitarias, acompañamiento a comerciantes, adecuación de corredores peatonales y >94% de efectividad en gestión ambiental.',
    fullText: 'La gestión ambiental y social del proyecto L1MB alcanzó destacados estándares avalados por la Banca Multilateral. A través de la estrategia "Metro te Acompaña" se ejecutaron 1.628 acciones territoriales de seguridad, convivencia y atención ciudadana en zonas aledañas a las obras, brindando apoyo a locatarios y pequeños comerciantes para mantener la accesibilidad a sus negocios durante el avance del viaducto. Paralelamente, se cumplió con el 94% de efectividad en traslados silviculturales y reducción en consumos institucionales de agua y energía.',
    gallery: ['/caracas calle 13 y 19.jfif', '/caracas calle 19 y 22.jfif']
  }
];

// Documentos oficiales para el módulo de transparencia y gestión documental
export const DOCUMENTOS_TRANSPARENCIA_OFICIALES = [
  {
    id: 'doc-informe-2025',
    filename: 'informe-de-gestion-2025_abrob_jd_asam-1.pdf',
    title: 'Informe de Gestión 2025 (PDF)',
    subtitle: 'Aprobado por Junta Directiva (18 Feb 2026) y Asamblea de Accionistas (27 Mar 2026)',
    size: '14.2 MB',
    format: 'PDF',
    date: '27 de marzo de 2026',
    entidad: 'Empresa Metro de Bogotá S.A.',
    icon: 'FileText',
    badge: 'Oficial Aprobado',
    color: '#B30000',
    descripcion: 'Documento público oficial con el balance integral de la Línea 1, expansión de la Red Metro (L2, Calle 100, L3), gestión ambiental, social, contractual y estados financieros auditados.',
    descargas: 1420
  },
  {
    id: 'doc-contratos-2024',
    filename: 'ejecucion-contractual-2024_1.xlsx',
    title: 'Ejecución Contractual y Base de Datos Oficial',
    subtitle: 'Portal Oficial de Datos Abiertos y Base de Contratos EMB 2024',
    size: 'Portales Oficiales',
    format: 'ENLACES',
    date: 'Vigencia contractual 2024-2025',
    entidad: 'Empresa Metro de Bogotá & Alcaldía Mayor',
    icon: 'ExternalLink',
    badge: 'Datos Abiertos',
    color: '#1565C0',
    descripcion: 'Consulte directamente en línea la base de datos de contratos de la Empresa Metro de Bogotá (vigencia 2024) y el catálogo abierto oficial del Distrito Capital.',
    descargas: 2150,
    externalLinks: [
      {
        title: 'Base de Datos de Contratos 2024 (Sitio EMB)',
        url: 'https://www.metrodebogota.gov.co/base-datos-contratos-2024',
        label: 'metrodebogota.gov.co/base-datos-contratos-2024',
        color: '#1565C0'
      },
      {
        title: 'Portal de Datos Abiertos de Bogotá (EMB)',
        url: 'https://datosabiertos.bogota.gov.co/organization/metro-de-bogota',
        label: 'datosabiertos.bogota.gov.co/organization/metro-de-bogota',
        color: '#2D8B3C'
      }
    ]
  }
];

// Alias estructurados para compatibilidad amplia en toda la aplicación
export const INDICADORES_L1MB = {
  avanceGeneral: METRICAS_L1MB_OFICIALES.avanceFisicoGeneral,
  patioTaller: {
    avancePct: METRICAS_L1MB_OFICIALES.patioTaller.avance,
    unidadesTerminadas: METRICAS_L1MB_OFICIALES.patioTaller.unidadesTerminadas,
    unidadesTotales: METRICAS_L1MB_OFICIALES.patioTaller.unidadesTotales,
    viaBalastoMetros: METRICAS_L1MB_OFICIALES.patioTaller.viaBalastoMetros
  },
  viaducto: {
    avancePct: METRICAS_L1MB_OFICIALES.viaducto.ejecutado,
    vigasLanzadorasActivas: METRICAS_L1MB_OFICIALES.viaducto.vigasLanzadoras.length,
    vigas: METRICAS_L1MB_OFICIALES.viaducto.vigasLanzadoras
  },
  materialRodanteVias: {
    trenesEnSitio: METRICAS_L1MB_OFICIALES.materialRodanteYVias.trenesLlegados,
    viaEnPlacaInstaladaM: METRICAS_L1MB_OFICIALES.materialRodanteYVias.viaPlacaViaductoMetros,
    tercerRiel: true,
    pruebasCBTC: true
  },
  intercambiadorCalle72: {
    avancePct: METRICAS_L1MB_OFICIALES.intercambiadorCalle72.operatividad,
    estado: METRICAS_L1MB_OFICIALES.intercambiadorCalle72.estado
  },
  hito2026: METRICAS_L1MB_OFICIALES.hitoOperativo2026
};

export const NOTICIAS_INSTITUCIONALES = NOTICIAS_INSTITUCIONALES_REALES;
export const NOTICIAS_OFICIALES_EMB = NOTICIAS_INSTITUCIONALES_REALES;
export const DOCUMENTOS_OFICIALES = DOCUMENTOS_TRANSPARENCIA_OFICIALES;
