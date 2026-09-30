// Base de conocimiento exhaustiva de UrbanGo y la Primera Línea del Metro de Bogotá (PLMB)
// Contiene todos los datos, estaciones, cierres viales, vacantes, tarjetas Tullave, simulador de viaje, 3D y equipo creador.

export const METRO_SYSTEM_KNOWLEDGE = {
  proyecto: {
    nombre: "Primera Línea del Metro de Bogotá (PLMB)",
    avanceGeneral: "82.33% (Dato oficial EMB 2026)",
    inversionTotal: "$16.27 billones COP (Nación 70%, Distrito 30%, banca multilateral BID, CAF, BEI, BIRF)",
    aperturaComercial: "2028 (Pruebas de rodaje con tren 2 en 2026, pruebas de pasajeros en 2027)",
    longitudTotal: "23.9 kilómetros de viaducto continuo 100% elevado",
    viaductoConstruido: "Más de 14 km de viaducto ya construido",
    patioTaller: "Patio Taller de Bosa al 91% de avance (32 hectáreas, capacidad para 60 trenes)",
    intercambiador72: "Intercambiador subterráneo y viaducto en Calle 72 al 93% de avance",
    tecnologia: "Conducción 100% automatizada sin conductor CBTC GoA4 (Communication-Based Train Control Grado 4)",
    electrificacion: "100% eléctrico, reducción proyectada de 171.000 toneladas de CO₂/año",
    horarioOperacion: "4:30 a.m. a 11:00 p.m. (proyectado)",
    frecuencia: "Un tren cada 2 a 3 minutos en hora pico",
    capacidadTren: "1.800 pasajeros por tren (300 por vagón en 6 vagones)",
    vagonesPorTren: 6,
    capacidadPorVagon: 300,
    flota: "30 trenes automáticos (sin conductor, tecnología GoA4)",
    longitudTren: "145 metros",
    velocidadComercial: "43 km/h (velocidad máxima 80 km/h)",
    recorridoTotal: "23.9 km elevado, 16 estaciones (10 integradas con TransMilenio)",
    tiempoViaje: "27 minutos entre Bosa y Calle 72",
    ahorroTiempo: "Reduce trayectos de 1h 45m a solo 27 minutos desde Bosa/Kennedy hasta el Centro y Calle 72"
  },

  aforoYCapacidad: {
    capacidadNominalTren: "1.800 pasajeros por tren (300 por vagón en 6 vagones)",
    capacidadMaximaTren: "Hasta 2.000 pasajeros por tren en hora pico (alta densidad a 6 personas/m²)",
    capacidadPorVagon: 300,
    vagonesPorTren: 6,
    longitudTren: "145 metros",
    anchoTren: "2.90 metros",
    flotaTotal: "30 trenes 100% eléctricos de 6 vagones",
    puertasPorTren: "24 puertas dobles por tren (4 por vagón por costado) para embarque ágil en 20-30 seg",
    capacidadPorHoraSentidoMax: "72.000 pasajeros por hora y sentido (p/h/s) en máxima demanda",
    capacidadPorHoraSentidoInicial: "36.000 a 43.000 pasajeros por hora y sentido (p/h/s)",
    demandaDiariaEstimada: "Más de 1.000.000 de pasajeros al día (más de 1 millón de viajes diarios)",
    demandaInicialDiaria: "Aprox. 720.000 a 800.000 pasajeros al día en los primeros meses de operación",
    capacidadEstaciones: "Andenes de 145 metros con Puertas de Pantalla de Andén (PSD), vestíbulos para evacuar más de 40.000 a 50.000 usuarios por hora en estaciones de transferencia",
    frecuenciaHoraPico: "2 a 3 minutos entre trenes (reducible a 90 segundos con sistema CBTC GoA4)",
    conduccionAutomatica: "Grado 4 (GoA4 UTO) 100% automático sin conductor"
  },

  linea2: {
    nombre: "Segunda Línea del Metro de Bogotá (L2)",
    tipo: "Subterránea en su mayoría (15.5 kilómetros)",
    estaciones: 11,
    recorrido: "Desde Calle 72 (intercambiador L1) pasando por Chapinero, Barrios Unidos, Engativá y Suba hasta Fontanar del Río",
    patioTaller: "Sector Fontanar del Río (Suba)",
    beneficiarios: "Más de 2.5 millones de habitantes del noroccidente de Bogotá",
    presupuesto: "Aprox. $35 billones COP (cofinanciado 70% Nación y 30% Distrito)",
    integracionL1: "Conexión modal directa en el intercambiador de la Calle 72 con Caracas"
  },

  financiacion: {
    presupuestoObra: "$16.27 billones COP (inversión integral superior a $22.3 billones COP)",
    cofinanciacion: "70% Gobierno Nacional de Colombia, 30% Alcaldía Mayor de Bogotá (Distrito Capital)",
    bancaMultilateral: "Banco Mundial (BIRF), Banco Interamericano de Desarrollo (BID), Banco Europeo de Inversiones (BEI) y CAF",
    modeloContrato: "Contrato de concesión integral a 20 años con el consorcio Metro Línea 1 S.A.S."
  },

  concesionarioYFabricante: {
    concesionario: "Metro Línea 1 S.A.S. (integrado por China Harbour Engineering Company - CHEC y Xi'an Rail Transit Group)",
    fabricanteTrenes: "CRRC Changchun Railway Vehicles Co., Ltd.",
    interventoria: "Consorcio Supervisor L1",
    entidadContratante: "Empresa Metro de Bogotá (EMB S.A.)"
  },

  seguridadYTecnologia: {
    automatizacion: "GoA4 (Unattended Train Operation) sin conductor en cabina",
    senializacion: "CBTC (Communications-Based Train Control) vía radio continua",
    puertasAnden: "Puertas de Pantalla de Andén (PSD) de 145 metros en las 16 estaciones",
    videovigilancia: "Más de 1.200 cámaras de CCTV con analítica de inteligencia artificial",
    accesibilidadPMR: "100% accesible: ascensores de calle a andén, pisos podotáctiles, braille, avisos visuales y sonoros",
    emergencias: "Botones de pánico e intercomunicadores en cada vagón y andén, supervisión 24/7 desde el PCC de Bosa"
  },

  sostenibilidad: {
    energia: "100% trenes eléctricos con frenado regenerativo",
    emisionesEvitadas: "Reducción de más de 171.000 toneladas de CO₂ al año",
    espacioPublico: "Más de 95.000 m² de nuevo espacio público y plazoletas bioclimáticas",
    ciclorrutas: "Ciclorrutas continuas debajo del viaducto y siembra de miles de árboles nativos"
  },

  estaciones: [
    { id: 1, code: 'E1', name: 'Patio Taller / El Porvenir', loc: 'Bosa', direccion: 'Carrera 96 con Calle 49 Sur', progress: '91%', status: 'En obra', desc: 'Punto de partida de la Línea 1, centro neurálgico de operaciones, mantenimiento y cocheras con 32 hectáreas en el sector de El Porvenir.' },
    { id: 2, code: 'E2', name: 'Bosa / Gibraltar', loc: 'Bosa', direccion: 'Av. Villavicencio con Av. Tintal', progress: '85%', status: 'En obra', desc: 'Acceso multimodal en la localidad de Bosa conectando los sectores de Gibraltar y Tintal.' },
    { id: 3, code: 'E3', name: 'Portal Américas / Chicalá', loc: 'Kennedy', direccion: 'Av. Villavicencio con Av. Cali', progress: '82%', status: 'En obra', desc: 'Estación clave en Kennedy con integración modal directa al Portal Américas de TransMilenio y rutas alimentadoras.' },
    { id: 4, code: 'E4', name: 'Carrera 80 / Ciudad Kennedy', loc: 'Kennedy', direccion: 'Av. Villavicencio con Carrera 80', progress: '78%', status: 'En obra', desc: 'Acceso central al corazón residencial y comercial de Ciudad Kennedy por la Av. Villavicencio.' },
    { id: 5, code: 'E5', name: 'Timiza / Hospital de Kennedy', loc: 'Kennedy', direccion: 'Av. Villavicencio con Carrera 78H / Calle 40 Sur', progress: '76%', status: 'En obra', desc: 'Conecta con el Hospital de Kennedy, el parque Timiza y corredores de salud y educación del suroccidente.' },
    { id: 6, code: 'E6', name: 'Avenida Primero de Mayo', loc: 'Kennedy', direccion: 'Av. Primero de Mayo con Av. Boyacá', progress: '75%', status: 'En obra', desc: 'Intersección estratégica con la Av. Boyacá y el corredor comercial de la Primero de Mayo en Kennedy.' },
    { id: 7, code: 'E7', name: 'Plaza de Las Américas', loc: 'Puente Aranda', direccion: 'Av. Primero de Mayo con Carrera 68', progress: '73%', status: 'En obra', desc: 'Sector comercial Plaza de Las Américas y conexión con la futura Troncal Av. 68.' },
    { id: 8, code: 'E8', name: 'SENA / Carrera 50', loc: 'Puente Aranda', direccion: 'Av. Primero de Mayo con Carrera 50', progress: '72%', status: 'En obra', desc: 'Acceso al complejo educativo SENA y zona industrial de Puente Aranda.' },
    { id: 9, code: 'E9', name: 'NQS / General Santander', loc: 'Puente Aranda', direccion: 'Av. Primero de Mayo con Av. NQS', progress: '70%', status: 'En obra', desc: 'Gran nodo de transferencia modal con la Troncal NQS (Carrera 30) de TransMilenio.' },
    { id: 10, code: 'E10', name: 'Calle 1 Sur / Hortúa', loc: 'Antonio Nariño / Los Mártires', direccion: 'Av. Caracas con Calle 1 Sur', progress: '68%', status: 'En obra', desc: 'Conexión con el complejo hospitalario La Hortúa y la Troncal Caracas Sur de TransMilenio.' },
    { id: 11, code: 'E11', name: 'Restrepo / Calle 10 Sur', loc: 'Antonio Nariño / Los Mártires', direccion: 'Av. Caracas con Calle 10 Sur', progress: '65%', status: 'En obra', desc: 'Eje comercial del Restrepo y conexión con los barrios del sur de la Caracas.' },
    { id: 12, code: 'E12', name: 'Calle 26 / Centro Internacional', loc: 'Antonio Nariño / Los Mártires / Santa Fe', direccion: 'Av. Caracas con Calle 26', progress: '64%', status: 'En obra', desc: 'Integración modal masiva con la Troncal Calle 26 (conexión directa hacia el Aeropuerto El Dorado).' },
    { id: 13, code: 'E13', name: 'Calle 45 / Universidad Nacional', loc: 'Teusaquillo / Chapinero', direccion: 'Av. Caracas con Calle 45', progress: '63%', status: 'En obra', desc: 'Sector universitario, cultural y conexión con la Universidad Nacional y Universidad Javeriana.' },
    { id: 14, code: 'E14', name: 'Calle 63', loc: 'Teusaquillo / Chapinero', direccion: 'Av. Caracas con Calle 63', progress: '62%', status: 'En obra', desc: 'Corazón financiero y comercial de Chapinero Central y cercanía a la Plaza de Lourdes.' },
    { id: 15, code: 'E15', name: 'Calle 72 (Intercambiador Modal)', loc: 'Teusaquillo / Chapinero / Barrios Unidos', direccion: 'Av. Caracas con Calle 72', progress: '93%', status: 'En obra avanzada', desc: 'Estación de integración con intercambiador vial subterráneo en Calle 72 y futura conexión con la Línea 2 del Metro.' },
    { id: 16, code: 'E16', name: 'Calle 72 Norte / Terminal', loc: 'Barrios Unidos / Chapinero', direccion: 'Av. Caracas con Calle 72 Norte', progress: '93%', status: 'Fase final de estructura', desc: 'Terminal norte de la Línea 1, paso a desnivel vehicular en operación y futura expansión hacia Calle 100.' }
  ],

  estacionesPorLocalidad: {
    bosa: [
      { id: 1, code: 'E1', name: 'Patio Taller / El Porvenir', direccion: 'Carrera 96 con Calle 49 Sur', desc: 'Centro de mantenimiento de 32 hectáreas en El Porvenir' },
      { id: 2, code: 'E2', name: 'Bosa / Gibraltar', direccion: 'Av. Villavicencio con Av. Tintal', desc: 'Acceso en sector Gibraltar y El Tintal' }
    ],
    kennedy: [
      { id: 3, code: 'E3', name: 'Portal Américas / Chicalá', direccion: 'Av. Villavicencio con Av. Cali', desc: 'Integración modal con TransMilenio Portal Américas' },
      { id: 4, code: 'E4', name: 'Carrera 80 / Ciudad Kennedy', direccion: 'Av. Villavicencio con Carrera 80', desc: 'Acceso a Ciudad Kennedy Central' },
      { id: 5, code: 'E5', name: 'Timiza / Hospital de Kennedy', direccion: 'Av. Villavicencio con Carrera 78H / Calle 40 Sur', desc: 'Acceso a Hospital de Kennedy y Parque Timiza' },
      { id: 6, code: 'E6', name: 'Avenida Primero de Mayo', direccion: 'Av. Primero de Mayo con Av. Boyacá', desc: 'Intersección con Av. Boyacá y Primero de Mayo' }
    ],
    puente_aranda: [
      { id: 7, code: 'E7', name: 'Plaza de Las Américas', direccion: 'Av. Primero de Mayo con Carrera 68', desc: 'Sector comercial Plaza de Las Américas' },
      { id: 8, code: 'E8', name: 'SENA / Carrera 50', direccion: 'Av. Primero de Mayo con Carrera 50', desc: 'Zona industrial y complejo SENA' },
      { id: 9, code: 'E9', name: 'NQS / General Santander', direccion: 'Av. Primero de Mayo con Av. NQS', desc: 'Transferencia modal con Troncal NQS de TransMilenio' }
    ],
    antonio_narino_los_martires: [
      { id: 10, code: 'E10', name: 'Calle 1 Sur / Hortúa', direccion: 'Av. Caracas con Calle 1 Sur', desc: 'Complejo Hospitalario La Hortúa e integración Caracas Sur' },
      { id: 11, code: 'E11', name: 'Restrepo / Calle 10 Sur', direccion: 'Av. Caracas con Calle 10 Sur', desc: 'Eje comercial del Restrepo' },
      { id: 12, code: 'E12', name: 'Calle 26 / Centro Internacional', direccion: 'Av. Caracas con Calle 26', desc: 'Interconexión modal con Troncal Calle 26 hacia el Aeropuerto' }
    ],
    teusaquillo_chapinero_barrios_unidos: [
      { id: 13, code: 'E13', name: 'Calle 45 / Universidad Nacional', direccion: 'Av. Caracas con Calle 45', desc: 'Sector universitario UNAL y Javeriana' },
      { id: 14, code: 'E14', name: 'Calle 63', direccion: 'Av. Caracas con Calle 63', desc: 'Zona financiera y comercial de Chapinero Central' },
      { id: 15, code: 'E15', name: 'Calle 72 (Intercambiador Modal)', direccion: 'Av. Caracas con Calle 72', desc: 'Paso a desnivel deprimido y conexión Línea 2' }
    ]
  },

  alertasViales: [
    {
      tramo: "Av. Caracas entre Calles 26 y 39",
      estado: "Cierre Total",
      motivo: "Hincado masivo de pilotes y montaje de vigas U del viaducto",
      desvios: "Tomar Carrera 10, Carrera 13, Carrera 7 o Troncal NQS (Carrera 30)"
    },
    {
      tramo: "Intercambiador Calle 72 con Caracas",
      estado: "Acceso restringido y desvíos",
      motivo: "Demolición de estación antigua TM e integración con estructura elevada",
      desvios: "Carrera 15, Carrera 24, Calle 74 o Calle 68"
    },
    {
      tramo: "Av. Primero de Mayo con Carrera 68 / Villavicencio",
      estado: "Paso a 1 carril",
      motivo: "Cimentación de columnas soporte para estación E7",
      desvios: "Av. Boyacá o Autopista Sur"
    }
  ],

  empleo: {
    vacantesDisponibles: 180,
    convocatoria: "Convocatoria Oficial 2026 — Empresa Metro de Bogotá S.A.S.",
    salarios: "Desde $2.500.000 hasta $6.800.000 COP según el cargo y nivel de experiencia",
    areas: [
      { area: "Operación de Trenes", vacantes: 60, requisitos: "Técnico o tecnólogo en transporte, mecánica o electricidad con mínimo 1 año de experiencia" },
      { area: "Mantenimiento e Infraestructura", vacantes: 45, requisitos: "Técnico en mecatrónica, sistemas de rieles o electricidad industrial (turnos rotativos 24/7)" },
      { area: "Ingeniería y Sistemas", vacantes: 30, requisitos: "Profesional en Ingeniería Civil, Eléctrica, Mecánica o de Sistemas" },
      { area: "Atención al Usuario y Estaciones", vacantes: 30, requisitos: "Bachiller o técnico con excelente comunicación y vocación de servicio al ciudadano" },
      { area: "Seguridad y Gestión Operacional", vacantes: 15, requisitos: "Profesionales o tecnólogos en salud ocupacional, seguridad industrial y gestión de riesgos" }
    ],
    postulacion: "Se puede postular directamente desde la pestaña 'Noticias y Empleo' en esta aplicación o en el portal oficial distrital bogota.gov.co"
  },

  tarjetaTullave: {
    nombre: "Tarjeta Tullave / Metro Personalizada",
    compatibilidad: "Válida para Metro Línea 1, TransMilenio troncal, buses zonales SITP, TransMiCable y alimentadores",
    beneficios: "Tarifas integradas con transbordos a costo $0 o con descuento durante 110 minutos, protección de saldo por pérdida, viaje a crédito de hasta 2 pasajes",
    funcionesApp: "Permite ingresar y guardar tu número de tarjeta de 16 dígitos (ej. 1000-0124-9876-5432), editar el nombre del titular y recargar en línea vía Nequi, Daviplata, PSE o tarjeta de crédito",
    tecnologia: "Chip NFC y Contactless de radiofrecuencia para validación rápida en torniquetes y puertas de andén"
  },

  modulosApp: {
    landing3D: "Simulador 3D inmersivo con tren digital e interactivo del Metro L1, visualización de gálibo, capacidad y física de frenado",
    mapaInteractivo: "Mapa con las 16 estaciones, coordenadas GPS, cálculo de rutas óptimas, estado de obra y desvíos viales",
    estadoDeObra: "Monitoreo fotográfico y porcentual de avance por frentes de trabajo (Bosa, Caracas, Calle 72)",
    noticiasEmpleo: "Boletines oficiales de la Alcaldía Mayor, Empresa Metro de Bogotá, alertas para comerciantes y bolsa de empleo",
    foroCiudadano: "Espacio comunitario para debatir, publicar propuestas ciudadanas, votar y calificar soluciones de movilidad",
    transparencia: "Información de auditoría, fuentes de financiación multilateral, contratos y rendición de cuentas",
    saldoRecarga: "Tarjeta virtual Tullave/Metro para configurar tu tarjeta física y simular recargas de saldo instantáneas",
    perfilAjustes: "Gestión de usuario, modo oscuro/claro, selector de idioma (Español, Inglés, Portugués, Chino) y reportes de incidentes viales"
  },

  equipoCreador: {
    gabriela: "Gabriela — Líder de Proyecto & Desarrolladora Lead Software (arquitectura Full-Stack, simulación 3D, conectividad e IA MetroBot)",
    nathalia: "Nathalia — Líder de Diseño UI/UX & Identidad Visual (diseño de interfaz accesible, paleta institucional y usabilidad)",
    nicol: "Nicol — Líder de Comunicaciones, Transparencia & Estrategia Ciudadana (gestión de contenidos verídicos, transparencia y foro)",
    jorge: "Jorge — Especialista en SIG & Geolocalización GPS (cartografía interactiva, parametrización de cierres y rutas de desvío)"
  }
};

// ── ESTRUCTURA DE DATOS INTERNOS (KNOWLEDGE BASE) ──────────────────────────
export const NOTICIAS_KB = [
  {
    id: 'news_1',
    title: 'Avance del 82.33% en la obra general',
    resumen: 'Obras en viaducto y llegada de nuevos trenes.',
    actionId: '#news_1',
    actionText: '📰 Leer Noticia Completa',
    fullText: 'La Empresa Metro de Bogotá (EMB) confirmó que la Primera Línea ha alcanzado un avance físico general del 82.33%. Con 6 vigas lanzadoras trabajando en los tramos de Bosa, Primero de Mayo y la Avenida Caracas, el viaducto elevado avanza a paso firme. En el Patio Taller de Bosa, los trenes automáticos número 1 y 2 continúan sus pruebas técnicas de rodaje sobre vía.',
    img: '/Linea 1 del metro de bogora.png',
    author: 'Empresa Metro de Bogotá (EMB)',
    date: 'Septiembre 2026',
    urgency: 'Alta',
    type: 'breaking'
  },
  {
    id: 'news_2',
    title: 'Obras subterráneas en Calle 72 con Caracas',
    resumen: 'Avances en el intercambiador vial.',
    actionId: '#news_2',
    actionText: '📰 Leer Noticia Completa',
    fullText: 'El frente de obra de la Avenida Caracas con Calle 72 culminó la adecuación de la estructura del intercambiador vial subterráneo. Este hito permite la circulación continua del tráfico vehicular mientras avanzan los acabados de espacio público, senderos peatonales y la preparación del viaducto para la futura Estación 16 que integrará con la Línea 2.',
    img: '/caracas calle 69 y 72a.png',
    author: 'Secretaría Distrital de Movilidad / EMB',
    date: 'Septiembre 2026',
    urgency: 'Media',
    type: 'noticia'
  }
];

export const EMPLEOS_KB = [
  {
    id: 'job_1',
    title: 'Auxiliares de Construcción',
    ubicacion: 'Tramo Bosa/Kennedy',
    requisitos: '6 meses de experiencia.',
    actionId: '#job_1',
    actionText: '💼 Postularme a esta vacante',
    salario: '$2.500.000 - $3.200.000 COP',
    vacantes: 45
  },
  {
    id: 'job_2',
    title: 'Ingenieros Civiles / Inspectores SST',
    ubicacion: 'Tramo Caracas',
    requisitos: 'Tarjeta profesional vigente.',
    actionId: '#job_2',
    actionText: '💼 Postularme a esta vacante',
    salario: '$4.800.000 - $6.800.000 COP',
    vacantes: 20
  }
];

