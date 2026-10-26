// Base de conocimiento exhaustiva de UrbanGo y la Primera Línea del Metro de Bogotá (PLMB)
// Contiene todos los datos, estaciones, cierres viales, vacantes, tarjetas Tullave, simulador de viaje, 3D y equipo creador.

export const METRO_SYSTEM_KNOWLEDGE = {
  proyecto: {
    nombre: "Primera Línea del Metro de Bogotá (PLMB)",
    avanceGeneral: "82.33% (Dato oficial EMB 2026)",
    inversionTotal: "$16.27 billones COP (Nación 70%, Distrito 30%, banca multilateral BID, CAF, BEI, BIRF)",
    aperturaComercial: "2028 (Pruebas dinámicas en tramo de prueba del Patio Taller de Bosa en último trimestre de 2026)",
    pruebasDinamicas: "Inicio en tramo de prueba del Patio Taller de Bosa en el último trimestre de 2026",
    longitudTotal: "23.9 kilómetros de viaducto continuo 100% elevado a 13.5 metros de altura promedio",
    alturaPromedio: "13.5 metros de altura promedio",
    viaductoConstruido: "Más de 15 km de viaducto continuo en ejecución y montaje",
    patioTaller: "Patio Taller de Bosa al 93% de avance (32 hectáreas, capacidad para 60 trenes)",
    intercambiador72: "98% de avance (incluye paso deprimido vehicular activo y galería peatonal subterránea de 120 metros para futura transferencia con Línea 2)",
    galeriaPeatonal72: "Galería subterránea de 120 metros para conexión directa con la Línea 2",
    tecnologia: "CBTC (Communication-Based Train Control) con automatización GoA4 (operación sin conductor)",
    rodadura: "Trenes 100% eléctricos sobre rieles de acero",
    electrificacion: "100% eléctrico, reducción proyectada de 171.000 toneladas de CO₂/año",
    eficienciaEnergetica: "Frenado regenerativo que devuelve hasta un 30% de la energía a la red eléctrica",
    frenadoRegenerativo: "Devuelve hasta un 30% de la energía a la red eléctrica",
    horarioOperacion: "4:30 a.m. a 11:00 p.m. (proyectado)",
    frecuencia: "Intervalos de 100 a 140 segundos en horas pico",
    capacidadTren: "1.800 pasajeros por tren (en 6 vagones 100% eléctricos)",
    vagonesPorTren: 6,
    capacidadPorVagon: 300,
    flota: "30 trenes automáticos (sin conductor, tecnología GoA4)",
    longitudTren: "145 metros",
    velocidadComercial: "42.5 km/h (velocidad máxima de diseño 80 km/h)",
    velocidadMaxima: "80 km/h",
    recorridoTotal: "23.9 km elevado, 16 estaciones (10 integradas con TransMilenio)",
    tiempoViaje: "27 minutos entre Bosa y Calle 72",
    ahorroTiempo: "Reduce el trayecto de Bosa a la Calle 72 de 80-100 minutos a solo 27 minutos",
    vigasLanzadoras: "6 vigas lanzadoras activas en Bosa, Av. Primero de Mayo y Av. Caracas"
  },

  aforoYCapacidad: {
    capacidadNominalTren: "1.800 pasajeros por tren (en 6 vagones 100% eléctricos)",
    capacidadMaximaTren: "Hasta 2.000 pasajeros por tren en hora pico (alta densidad)",
    capacidadPorVagon: 300,
    vagonesPorTren: 6,
    longitudTren: "145 metros",
    anchoTren: "2.90 metros",
    flotaTotal: "30 trenes 100% eléctricos de 6 vagones",
    puertasPorTren: "24 puertas dobles por tren (4 por vagón por costado)",
    capacidadPorHoraSentidoMax: "72.000 pasajeros por hora/sentido (PHSM)",
    demandaDiariaEstimada: "Más de 1.000.000 de pasajeros al día en la Línea 1",
    demandaInicialDiaria: "Aprox. 720.000 a 800.000 pasajeros al día",
    capacidadEstaciones: "Andenes de 145 metros con Puertas de Pantalla de Andén (PSD)",
    frecuenciaHoraPico: "Intervalos de 100 a 140 segundos en horas pico",
    conduccionAutomatica: "Automatización GoA4 (operación sin conductor) con CBTC"
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
    { id: 1, code: 'E1', name: 'Estación 1: Av. Villavicencio con Carrera 96 (Bosa / Patio Taller)', loc: 'Bosa', direccion: 'Av. Villavicencio con Carrera 96 (Bosa / Patio Taller)', progress: '91%', status: 'En obra', desc: 'Punto de partida de la Línea 1 en Bosa, acceso al Patio Taller de 32 hectáreas, cocheras y mantenimiento mayor en El Porvenir.' },
    { id: 2, code: 'E2', name: 'Estación 2: Av. Villavicencio con Av. Cali', loc: 'Bosa', direccion: 'Av. Villavicencio con Av. Cali', progress: '85%', status: 'En obra', desc: 'Acceso multimodal en Bosa que conecta los sectores de Gibraltar, El Tintal y la Av. Ciudad de Cali.' },
    { id: 3, code: 'E3', name: 'Estación 3: Av. Villavicencio con Av. Boyacá', loc: 'Kennedy', direccion: 'Av. Villavicencio con Av. Boyacá', progress: '82%', status: 'En obra', desc: 'Integración nodal en Kennedy con el Portal Américas de TransMilenio, alimentadores y el corredor de la Boyacá hacia Chicalá.' },
    { id: 4, code: 'E4', name: 'Estación 4: Av. Primero de Mayo con Av. Poporo Indio (Kennedy)', loc: 'Kennedy', direccion: 'Av. Primero de Mayo con Av. Poporo Indio (Kennedy)', progress: '78%', status: 'En obra', desc: 'Acceso central al corazón residencial y comercial de Ciudad Kennedy por la Av. Primero de Mayo.' },
    { id: 5, code: 'E5', name: 'Estación 5: Av. Primero de Mayo con Av. Boyacá', loc: 'Kennedy', direccion: 'Av. Primero de Mayo con Av. Boyacá', progress: '76%', status: 'En obra', desc: 'Conecta con el Hospital de Kennedy, el parque Timiza y el eje vial de la Av. Boyacá.' },
    { id: 6, code: 'E6', name: 'Estación 6: Av. Primero de Mayo con Av. 68', loc: 'Kennedy / Puente Aranda', direccion: 'Av. Primero de Mayo con Av. 68', progress: '75%', status: 'En obra', desc: 'Intersección estratégica con la futura Troncal Av. 68, ciclorruta y el sector comercial de Plaza de Las Américas.' },
    { id: 7, code: 'E7', name: 'Estación 7: Av. Primero de Mayo con Av. Américas', loc: 'Puente Aranda', direccion: 'Av. Primero de Mayo con Av. Américas', progress: '73%', status: 'En obra', desc: 'Nodo intermodal con la Troncal de Las Américas y zona industrial/comercial de Puente Aranda.' },
    { id: 8, code: 'E8', name: 'Estación 8: Av. NQS con Calle 8 Sur', loc: 'Puente Aranda / Antonio Nariño', direccion: 'Av. NQS con Calle 8 Sur', progress: '72%', status: 'En obra', desc: 'Acceso multimodal sobre la NQS, complejo educativo SENA y zona industrial.' },
    { id: 9, code: 'E9', name: 'Estación 9: Calle 1 Sur con Av. Caracas', loc: 'Antonio Nariño / Los Mártires', direccion: 'Calle 1 Sur con Av. Caracas', progress: '70%', status: 'En obra', desc: 'Gran intercambiador modal con la Troncal Caracas Sur y conexión directa hacia Centro Mayor y NQS.' },
    { id: 10, code: 'E10', name: 'Estación 10: Av. Caracas con Calle 2', loc: 'Antonio Nariño / Los Mártires', direccion: 'Av. Caracas con Calle 2', progress: '68%', status: 'En obra', desc: 'Acceso sobre la Av. Caracas comunicando los sectores de Los Mártires, Antonio Nariño y La Hortúa.' },
    { id: 11, code: 'E11', name: 'Estación 11: Av. Caracas con Calle 11 (Hospital)', loc: 'Los Mártires / Santa Fe', direccion: 'Av. Caracas con Calle 11 (Hospital)', progress: '65%', status: 'En obra', desc: 'Conexión con el complejo hospitalario La Hortúa / San Juan de Dios y zona comercial central.' },
    { id: 12, code: 'E12', name: 'Estación 12: Av. Caracas con Calle 19', loc: 'Los Mártires / Santa Fe', direccion: 'Av. Caracas con Calle 19', progress: '64%', status: 'En obra', desc: 'Eje neurálgico del centro comercial, bancario e histórico de Bogotá.' },
    { id: 13, code: 'E13', name: 'Estación 13: Av. Caracas con Calle 26', loc: 'Santa Fe / Teusaquillo', direccion: 'Av. Caracas con Calle 26', progress: '64%', status: 'En obra', desc: 'Integración masiva con la Troncal Calle 26 hacia el Aeropuerto El Dorado y el Centro Internacional.' },
    { id: 14, code: 'E14', name: 'Estación 14: Av. Caracas con Calle 45', loc: 'Teusaquillo / Chapinero', direccion: 'Av. Caracas con Calle 45', progress: '63%', status: 'En obra', desc: 'Distrito universitario: acceso inmediato a la Universidad Nacional, Pontificia Universidad Javeriana y Universidad Distrital.' },
    { id: 15, code: 'E15', name: 'Estación 15: Av. Caracas con Calle 63', loc: 'Chapinero / Teusaquillo', direccion: 'Av. Caracas con Calle 63', progress: '62%', status: 'En obra', desc: 'Corazón financiero y comercial de Chapinero Central y proximidad a la Plaza de Lourdes.' },
    { id: 16, code: 'E16', name: 'Estación 16: Av. Caracas con Calle 72', loc: 'Barrios Unidos / Chapinero', direccion: 'Av. Caracas con Calle 72', progress: '93%', status: 'En obra avanzada', desc: 'Terminal norte de la Línea 1 con paso subterráneo vehicular e integración multimodal subterránea con la futura Línea 2 a Suba.' }
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
    convocatoria: "Convocatoria Oficial — Agencia Pública de Empleo del SENA & Metro Línea 1 S.A.S.",
    canalesOficiales: "Las ofertas de empleo para la construcción y operación del Metro de Bogotá se gestionan exclusivamente a través de la Agencia Pública de Empleo del SENA (ape.sena.edu.co) y los canales oficiales del concesionario Metro Línea 1 S.A.S. (www.metrolinea1.com) y la Empresa Metro de Bogotá (EMB).",
    salarios: "Desde $2.500.000 hasta $6.800.000 COP según el cargo y nivel de experiencia (incluye vacantes sin experiencia previa con plan de formación técnica)",
    areas: [
      { area: "Operación de Trenes (GoA4)", vacantes: 60, requisitos: "Técnico o tecnólogo en transporte, mecánica, mecatrónica o electricidad" },
      { area: "Mantenimiento e Infraestructura", vacantes: 45, requisitos: "Técnico en mecatrónica, sistemas de rieles, catenaria o electricidad industrial" },
      { area: "Ingeniería y Sistemas CBTC", vacantes: 30, requisitos: "Profesional en Ingeniería Civil, Eléctrica, Mecánica o de Sistemas" },
      { area: "Atención al Usuario y Estaciones", vacantes: 30, requisitos: "Bachiller o técnico con vocación de servicio al ciudadano" },
      { area: "Seguridad y Gestión Operacional", vacantes: 15, requisitos: "Profesionales o tecnólogos en salud ocupacional, seguridad industrial y gestión de riesgos" }
    ],
    postulacion: "Postúlate a través de la Agencia Pública de Empleo del SENA (ape.sena.edu.co), el portal oficial www.metrolinea1.com o directamente desde la pestaña 'Noticias y Empleo' en UrbanGo."
  },

  tarjetaTullave: {
    nombre: "Tarjeta TuLlave / Metro Personalizada",
    personalizacion: "La personalización se realiza de forma gratuita en puntos autorizados de TransMilenio, portales, estaciones o en la web www.tullaveplus.gov.co presentando tu cédula de ciudadanía o documento de identidad.",
    tarifasVigentes: "Tarifa unificada integrada al transporte público de Bogotá ($2.950 - $3.150 COP).",
    transbordosCero: "Transbordo a $0 COP dentro de una ventana de 110 minutos (hasta 2 transbordos consecutivos sin costo adicional entre TransMilenio, buses zonales del SITP, TransMiCable y Metro).",
    tarifasPreferenciales: {
      adultoMayor: "Mayores de 62 años: tarifa subsidiada con cupo mensual de viajes con descuento en el sistema.",
      sisben: "Beneficiarios SISBÉN (Grupos A1 a B7 de Bogotá): tarifa preferencial reducida de hasta $2.500 COP y hasta 40 viajes mensuales subsidiados.",
      discapacidad: "Personas con discapacidad certificada: subsidio mensual distrital de transporte cargado directamente a la tarjeta TuLlave ($29.500 COP mensuales)."
    },
    beneficios: "Transbordos a $0 COP durante 110 minutos, protección del saldo en caso de pérdida o hurto, hasta 2 viajes a crédito garantizados.",
    compatibilidad: "Válida en la Primera Línea del Metro, TransMilenio troncal, buses zonales del SITP, TransMiCable y rutas alimentadoras.",
    funcionesApp: "Permite registrar y consultar tu tarjeta de 16 dígitos, verificar saldo y gestionar recargas en línea."
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
    newsId: 1,
    title: 'Hito histórico: El viaducto de la Línea 1 supera el 82% de ejecución física',
    subtitulo: 'Con 6 vigas lanzadoras activas en Bosa, Primero de Mayo y Av. Caracas, se reporta un avance acumulado del 82,33%.',
    categoria: 'Obras y Avance',
    localidad: 'Kennedy / Bosa',
    resumen: 'Con 6 vigas lanzadoras activas en los frentes de Bosa, Primero de Mayo y la Av. Caracas, la Empresa Metro de Bogotá reporta un avance acumulado del 82,33% en toda la infraestructura.',
    actionId: '#news_1',
    actionText: '📰 Leer Noticia Completa',
    fullText: 'La Empresa Metro de Bogotá (EMB) y el concesionario Metro Línea 1 S.A.S. confirmaron que la Primera Línea del Metro de Bogotá (PLMB) superó el 82,33% de avance acumulado total. Este logro histórico se debe a la operación continua de 6 vigas lanzadoras de alto rendimiento que operan simultáneamente en el Patio Taller de Bosa, la Avenida Primero de Mayo con Av. Boyacá y el corredor de la Avenida Caracas. Hasta la fecha, se han hincado más de 3.200 pilotes PHC y montado más de 1.100 dovelas de concreto prefabricado. El alcalde mayor y la gerencia de la EMB destacaron que las pruebas dinámicas de los primeros trenes eléctricos en el tramo de prueba de Bosa iniciarán según el cronograma fijado para el último trimestre del año.',
    img: '/Linea 1 del metro de bogora.png',
    author: 'Empresa Metro de Bogotá (EMB)',
    date: '14 Sep 2026',
    readMin: 4,
    urgency: 'Alta',
    type: 'breaking',
    etiqueta: 'EN VIVO'
  },
  {
    id: 'news_2',
    newsId: 2,
    title: 'Intercambiador subterráneo de la Calle 72 entra en fase final de integración peatonal',
    subtitulo: 'Finalizan obras estructurales bajo la Avenida Caracas y Carrera 15 para la futura conexión directa con la Línea 2.',
    categoria: 'Obras y Avance',
    localidad: 'Barrios Unidos / Chapinero',
    resumen: 'Finalizan obras estructurales bajo la Avenida Caracas y Carrera 15, permitiendo el flujo continuo del tráfico mixto y la futura conexión directa con la Línea 2.',
    actionId: '#news_2',
    actionText: '📰 Leer Noticia Completa',
    fullText: 'El proyecto del intercambiador a desnivel de la Calle 72 alcanzó el 98% de avance en sus obras civiles principales. Esta megaestructura subterránea elimina la congestión vehicular en el cruce de la Avenida Caracas con Calle 72, permitiendo el paso de tráfico mixto a desnivel bajo el viaducto elevado. Actualmente, los equipos técnicos trabajan en los acabados de urbanismo, señalización, espacio público y la galería subterránea peatonal de 120 metros que conectará de manera directa la Estación 16 de la Línea 1 (elevada) con la futura Estación 1 de la Línea 2 del Metro (subterránea), garantizando una transferencia intermodal fluida para más de 45.000 pasajeros diarios.',
    img: '/caracas calle 69 y 72a.png',
    author: 'Secretaría Distrital de Movilidad / EMB',
    date: '12 Sep 2026',
    readMin: 3,
    urgency: 'Media',
    type: 'noticia',
    etiqueta: null
  },
  {
    id: 'news_3',
    newsId: 3,
    title: 'El Metro evitará 171.000 toneladas de CO₂ al año en la cuenca de Bogotá',
    subtitulo: 'Operación 100% eléctrica con frenado regenerativo y subestaciones alimentadas por fuentes renovables certificadas.',
    categoria: 'Sostenibilidad',
    localidad: 'Bogotá Región',
    resumen: 'Operación 100% eléctrica con frenado regenerativo y subestaciones eléctricas alimentadas por fuentes renovables certificadas.',
    actionId: '#news_3',
    actionText: '📰 Leer Noticia Completa',
    fullText: 'Un estudio de impacto ambiental respaldado por el Banco Interamericano de Desarrollo (BID) ratificó que la Primera Línea del Metro reducirá las emisiones de carbono de la ciudad en 171.000 toneladas de CO₂ equivalente anuales a partir de su entrada en comercialización. Cada uno de los 30 trenes 100% eléctricos contará con sistemas de frenado regenerativo capaces de devolver hasta un 30% de la energía utilizada a la red de tracción del sistema. Adicionalmente, el acuerdo de suministro energético garantiza el abastecimiento exclusivo desde parques hídricos y solares con certificación de origen limpio, retirando de circulación cerca de 19.000 vehículos particulares por día.',
    img: '/Parque de los hippies.jfif',
    author: 'Secretaría Distrital de Ambiente',
    date: '10 Sep 2026',
    readMin: 3,
    urgency: 'Media',
    type: 'noticia',
    etiqueta: null
  },
  {
    id: 'news_4',
    newsId: 4,
    title: 'Plan de Renaturalización: Nuevos corredores verdes a lo largo de la Av. Primero de Mayo',
    subtitulo: 'Se implementan jardines de lluvia y sistemas de drenaje urbano sostenible (SUDs) en los bajos del viaducto.',
    categoria: 'Sostenibilidad',
    localidad: 'Antonio Nariño / Puente Aranda',
    resumen: 'Se implementan jardines de lluvia y sistemas de drenaje sostenible (SUDs) en los bajos del viaducto para mitigar islas de calor.',
    actionId: '#news_4',
    actionText: '📰 Leer Noticia Completa',
    fullText: 'En el marco de la estrategia de adaptación al cambio climático, la Empresa Metro y la Secretaría Distrital de Ambiente iniciaron la siembra de más de 2.800 árboles nativos y la adecuación de 65.000 m² de verde urbano bajo las vigas del viaducto en la Av. Primero de Mayo. El proyecto integra Sistemas de Drenaje Urbano Sostenible (SUDs) y jardines de lluvia que captan, filtran y reutilizan el agua de escorrentía para el riego de la vegetación local. Este corredor ecológico mitigará el efecto de isla de calor en sectores industriales como Puente Aranda y mejorará la calidad del aire para más de 300.000 residentes colindantes.',
    img: '/Corredor central.jfif',
    author: 'Jardín Botánico de Bogotá',
    date: '08 Sep 2026',
    readMin: 2,
    urgency: 'Media',
    type: 'noticia',
    etiqueta: null
  },
  {
    id: 'news_5',
    newsId: 5,
    title: 'Licitación Internacional de la Línea 2 Subterránea recibe propuestas de consorcios globales',
    subtitulo: 'El corredor de 15,5 km que conectará Chapinero, Barrios Unidos, Engativá y Suba avanza hacia su adjudicación.',
    categoria: 'Licitaciones',
    localidad: 'Suba / Engativá',
    resumen: 'El corredor de 15,5 km que conectará Chapinero, Barrios Unidos, Engativá y Suba avanza hacia su adjudicación definitiva.',
    actionId: '#news_5',
    actionText: '📰 Leer Noticia Completa',
    fullText: 'La Empresa Metro de Bogotá cerró la recepción de ofertas económicas y técnicas para la concesión integral de la Línea 2 del Metro, el primer trazado 100% subterráneo del país. Cuatro grandes consorcios internacionales conformados por firmas de España, China, Francia y Brasil presentaron sus pliegos definitivos. La Línea 2 abarcará 15,5 kilómetros, 11 estaciones (10 de ellas subterráneas) y beneficiará a 1,4 millones de habitantes de Suba y Engativá, reduciendo el tiempo de viaje desde el nodo Fontanar del Río hasta la Calle 72 de 100 minutos a solo 20 minutos.',
    img: '/caracas calle 19 y 22.jfif',
    author: 'Empresa Metro de Bogotá',
    date: '05 Sep 2026',
    readMin: 4,
    urgency: 'Alta',
    type: 'breaking',
    etiqueta: 'URGENTE'
  },
  {
    id: 'news_6',
    newsId: 6,
    title: 'Publicados pliegos para la Extensión de la Línea 1 hasta la Calle 100',
    subtitulo: 'Estudios de factibilidad y diseños de detalle para las 4 nuevas estaciones elevadas sobre la troncal Caracas Norte.',
    categoria: 'Licitaciones',
    localidad: 'Usaquén / Chapinero',
    resumen: 'Estudio de factibilidad y diseños de detalle para las 4 nuevas estaciones elevadas sobre la troncal Caracas Norte.',
    actionId: '#news_6',
    actionText: '📰 Leer Noticia Completa',
    fullText: 'La Financiera de Desarrollo Nacional (FDN) y la EMB abrieron la convocatoria para la contratación de los diseños de detalle de la Extensión Norte de la Línea 1. Este proyecto sumará 3,2 kilómetros de viaducto elevado a lo largo de la Avenida Caracas, conectando el terminal actual de la Calle 72 con el nodo multimodal de la Calle 100 y la RegioTram del Norte. El trazado incluirá 4 nuevas estaciones elevadas equipadas con integración tarifaria inmediata a la Troncal Norte de TransMilenio y cicloparqueaderos masivos con capacidad para más de 1.200 bicicletas.',
    img: '/Caracas.jfif',
    author: 'Financiera de Desarrollo Nacional / EMB',
    date: '02 Sep 2026',
    readMin: 3,
    urgency: 'Media',
    type: 'noticia',
    etiqueta: null
  },
  {
    id: 'news_7',
    newsId: 7,
    title: 'Feria de Empleo Metro: Convocatoria abierta para 180 vacantes de operación y mantenimiento',
    subtitulo: 'Perfiles requeridos para técnicos electricistas, inspectores de vía férrea, operadores y controladores CBTC.',
    categoria: 'Empleo y Cultura',
    localidad: 'Bosa / Kennedy',
    resumen: 'Perfiles para técnicos electricistas, inspectores de vía férrea, operadores de estación y controladores de tráfico CBTC.',
    actionId: '#news_7',
    actionText: '📰 Leer Noticia Completa',
    fullText: 'En alianza con el Servicio Nacional de Aprendizaje (SENA) y la Agencia Pública de Empleo de Bogotá, el concesionario Metro Línea 1 habilitó una nueva feria laboral presencial y virtual para la vinculación directa de 180 profesionales e ingenieros. Las vacantes incluyen roles técnicos en mantenimiento de vía permanente, gestión de sistemas informáticos de control de tráfico ferroviario basado en comunicaciones (CBTC), electricistas de alta tensión y operadores de centro de control. Se priorizará la contratación de mano de obra local de las localidades de Bosa, Kennedy, Puente Aranda y Fontibón.',
    img: '/caracas calle 13 y 19.jfif',
    author: 'Agencia Pública de Empleo SENA / ML1',
    date: '01 Sep 2026',
    readMin: 2,
    urgency: 'Alta',
    type: 'noticia',
    etiqueta: null
  },
  {
    id: 'news_8',
    newsId: 8,
    title: 'Cultura Metro: Nace el programa de convivencia y arte en las estaciones elevadas',
    subtitulo: 'Artistas locales intervienen murales y se lanzan talleres de apropiación ciudadana en colegios y centros comunales.',
    categoria: 'Empleo y Cultura',
    localidad: 'Todas las localidades',
    resumen: 'Artistas locales intervienen murales y se lanzan talleres de apropiación ciudadana en colegios y centros comunales.',
    actionId: '#news_8',
    actionText: '📰 Leer Noticia Completa',
    fullText: 'La Secretaría Distrital de Cultura, Recreación y Deporte presentó la estrategia pedagógica \'Cultura Metro Bogotá\', diseñada para fomentar la convivencia, la autorregulación y el sentido de pertenencia en el transporte masivo. La iniciativa incluye la intervención artística de las pilonas y bajos del viaducto mediante 50 murales urbanos realizados por colectivos de grafiti locales. Adicionalmente, el programa desplegará más de 300 gestores pedagógicos en instituciones educativas de las 9 localidades impactadas por el trazado de la Línea 1 para capacitar a más de 80.000 estudiantes en cultura ciudadana y cuidado de los trenes.',
    img: '/Corredor central.jfif',
    author: 'Secretaría Distrital de Cultura / EMB',
    date: '01 Sep 2026',
    readMin: 3,
    urgency: 'Baja',
    type: 'noticia',
    etiqueta: null
  }
];

export const EMPLEOS_KB = [
  {
    id: 'job_1',
    title: 'Auxiliares de Construcción',
    ubicacion: 'Tramo Bosa/Kennedy',
    requisitos: '6 meses de experiencia (también vacantes sin experiencia en talleres de inducción).',
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

// ============================================================================
// BASE DE CONOCIMIENTO INTEGRAL DE MOVILIDAD Y GEOGRAFÍA URBANA DE BOGOTÁ
// ============================================================================

// 1. LAS 20 LOCALIDADES DE BOGOTÁ
export const BOGOTA_LOCALIDADES_KB = {
  fontibon: {
    nombre: "Fontibón (Localidad 9)",
    ubicacion: "Occidente de Bogotá",
    corredoresPrincipales: "Calle 13 (Av. Centenario), Av. Esperanza, Av. El Dorado (Calle 26), Av. Boyacá, Av. Ciudad de Cali",
    transmilenio: "Troncal Calle 26 (Portal El Dorado, Modelia, Normandía) y Troncal Américas / Calle 13",
    conexionMetro: "La Primera Línea del Metro conectará a Fontibón a través de la Estación 12 (Calle 26 / Caracas) con transbordo directo por la Troncal 26, y por el sur hacia la Estación 7 y 8 sobre la Av. Primero de Mayo vía SITP Boyacá. La futura Línea 3 y Regiotram de Occidente atravesarán el corazón de Fontibón por el corredor férreo de la Calle 13.",
    hitos: ["Aeropuerto Internacional El Dorado", "Terminal de Transportes Salitre (zona limítrofe)", "Zona Franca de Bogotá", "Centro Comercial Multiplaza (Av. Boyacá con Cll 13)", "Centro Comercial Hayuelos", "Barrio Modelia", "Parque Fundacional de Fontibón"]
  },
  suba: {
    nombre: "Suba (Localidad 11)",
    ubicacion: "Noroccidente de Bogotá",
    corredoresPrincipales: "Av. Suba, Av. Boyacá, Av. Ciudad de Cali, Calle 170, Calle 127, Autopista Norte",
    transmilenio: "Troncal Suba (Portal Suba, La Campiña, 21 Ángeles) y Troncal AutoNorte",
    conexionMetro: "Línea 2 del Metro de Bogotá (15.5 km subterráneos) conectará directamente a Suba con 11 estaciones hasta el Patio Taller en Fontanar del Río, enlazando en Calle 72 con la Línea 1.",
    hitos: ["Centro Suba", "Subazar", "Plaza Imperial", "Parque La Colina", "Mirador de Los Nevados", "Humedal La Conejera", "Humedal Juan Amarillo / Tibabuyes", "Fontanar del Río"]
  },
  kennedy: {
    nombre: "Kennedy (Localidad 8)",
    ubicacion: "Suroccidente de Bogotá",
    corredoresPrincipales: "Av. Primero de Mayo, Av. Villavicencio, Av. Boyacá, Av. de Las Américas, Av. Ciudad de Cali, Av. Guayacanes",
    transmilenio: "Troncal Américas (Portal Américas, Banderas, Marsella) y conexiones zonales",
    conexionMetro: "Corazón de la Primera Línea del Metro: Alberga las Estaciones 3 (Portal Américas), 4 (Carrera 80), 5 (Hospital de Kennedy / Timiza) y 6 (Avenida Primero de Mayo con Boyacá).",
    hitos: ["Hospital Occidente de Kennedy", "Parque Metropolitano Timiza", "Centro Comercial Plaza Central", "Centro Comercial Multiplaza (frontera norte)", "Plaza de Las Américas", "Estadio Metropolitano de Techo", "Mundo Aventura", "Barrio Castilla", "Patio Bonito", "Tintal"]
  },
  bosa: {
    nombre: "Bosa (Localidad 7)",
    ubicacion: "Extremo Suroccidente de Bogotá",
    corredoresPrincipales: "Av. Villavicencio, Autopista Sur, Av. Tintal, Av. San Bernardino, Av. Bosa, Av. Guayacanes",
    transmilenio: "Portal del Sur y Troncal Autopista Sur, rutas alimentadoras",
    conexionMetro: "Punto de partida de la Línea 1: Patio Taller El Porvenir (32 ha), Estación 1 (Patio Taller) y Estación 2 (Bosa / Gibraltar). Reduce el viaje al centro de 1h 45m a solo 27 minutos.",
    hitos: ["Patio Taller El Porvenir", "Bosa Centro", "Parque Fundacional de Bosa", "Centro Comercial Gran Plaza Bosa", "Centro Comercial Trebolis El Porvenir", "Universidad Distrital Sede Bosa Porvenir"]
  },
  engativa: {
    nombre: "Engativá (Localidad 10)",
    ubicacion: "Noroccidente de Bogotá",
    corredoresPrincipales: "Calle 80, Calle 26, Av. Boyacá, Av. Ciudad de Cali, Av. Mutis (Calle 63)",
    transmilenio: "Troncal Calle 80 (Portal 80) y Troncal Calle 26",
    conexionMetro: "Beneficiada directa de la Línea 2 del Metro que pasará por la Calle 72, Álamos y Quirigua conectando con Suba y Calle 72.",
    hitos: ["Centro Comercial Titán Plaza", "Diverplaza", "Portal 80", "Jardín Botánico (zona limítrofe)", "Parque La Florida", "Barrio Quirigua", "Minuto de Dios"]
  },
  chapinero: {
    nombre: "Chapinero (Localidad 2)",
    ubicacion: "Oriente de Bogotá",
    corredoresPrincipales: "Av. Caracas, Carrera Séptima, Carrera 11, Carrera 13, Calle 72, Calle 63, Calle 85, Calle 100",
    transmilenio: "Troncal Caracas y Corredor Verde Cra 7ma / Duales",
    conexionMetro: "Alberga la Estación 14 (Calle 63) y Estación 15 (Calle 72 / Intercambiador Modal), donde confluyen la Línea 1 y la futura Línea 2.",
    hitos: ["Zona Rosa / Zona T", "Parque de la 93", "Parque El Virrey", "Centro Comercial Andino", "El Retiro", "Atlantis Plaza", "Pontificia Universidad Javeriana", "Universidad de La Salle", "Universidad Pedagógica Nacional"]
  },
  usaquen: {
    nombre: "Usaquén (Localidad 1)",
    ubicacion: "Extremo Nororiente de Bogotá",
    corredoresPrincipales: "Autopista Norte, Carrera Séptima, Carrera Novena, Carrera 19, Calle 100, Calle 116, Calle 127, Calle 140, Calle 170",
    transmilenio: "Troncal Autopista Norte (Portales del Norte y alimentadores)",
    conexionMetro: "Conectada mediante la futura Extensión de la Línea 1 hacia la Calle 100 y Troncal Av. 68.",
    hitos: ["Centro Comercial Unicentro", "Hacienda Santa Bárbara", "Centro Comercial Santafé", "Parque Fundacional de Usaquén", "Barrio Cedritos", "Clínica Santa Fe", "Usaquén Plaza"]
  },
  teusaquillo: {
    nombre: "Teusaquillo (Localidad 13)",
    ubicacion: "Centro-Occidente geográfico de Bogotá",
    corredoresPrincipales: "Av. El Dorado (Calle 26), Av. Caracas, Av. NQS (Carrera 30), Av. de Las Américas, Calle 53, Calle 63",
    transmilenio: "Troncales Caracas, NQS y Calle 26",
    conexionMetro: "Alberga la Estación 13 (Calle 45 / Universidad Nacional) de la Línea 1.",
    hitos: ["Universidad Nacional de Colombia (UNAL)", "Parque Metropolitano Simón Bolívar", "Parque de los Novios", "Movistar Arena", "Estadio El Campín", "Corferias", "CAN", "Barrio Galerías"]
  },
  puente_aranda: {
    nombre: "Puente Aranda (Localidad 16)",
    ubicacion: "Centro-Sur de Bogotá",
    corredoresPrincipales: "Av. Primero de Mayo, Av. de Las Américas, Av. Carrera 68, Av. Carrera 50, Av. NQS, Calle 13",
    transmilenio: "Troncal Américas y Troncal NQS",
    conexionMetro: "Alberga las Estaciones 7 (Plaza de Las Américas / Cra 68), 8 (SENA / Carrera 50) y 9 (NQS / General Santander).",
    hitos: ["Centro Comercial Plaza de Las Américas", "Complejo SENA Carrera 50", "Zona Industrial de Puente Aranda", "Centro Mayor (límite sur con Antonio Nariño)"]
  },
  los_martires: {
    nombre: "Los Mártires (Localidad 14)",
    ubicacion: "Centro de Bogotá",
    corredoresPrincipales: "Av. Caracas, Av. Calle 26, Calle 13, Av. Calle 1, Av. Carrera 30 (NQS)",
    transmilenio: "Troncales Caracas, Calle 26, Américas",
    conexionMetro: "Alberga las Estaciones 10 (Calle 1 Sur / Hortúa), 11 (Restrepo / Cll 10 Sur) y 12 (Calle 26 / Centro Internacional).",
    hitos: ["Plaza España", "Barrio Santa Isabel", "Basílica del Voto Nacional", "Complejo Hospitalario San Juan de Dios"]
  },
  santa_fe: {
    nombre: "Santa Fe (Localidad 3)",
    ubicacion: "Centro-Oriente de Bogotá",
    corredoresPrincipales: "Av. Caracas, Carrera Séptima, Carrera Décima, Av. Calle 26, Av. Comuneros (Cll 6)",
    transmilenio: "Troncal Caracas, Carrera 10ma y Calle 26",
    conexionMetro: "Servida por la Estación 12 (Calle 26 / Centro Internacional).",
    hitos: ["Torre Colpatria", "Centro Internacional", "Cerro de Monserrate", "Museo Nacional", "Plaza de Toros / Santamaría", "Barrio La Macarena"]
  },
  la_candelaria: {
    nombre: "La Candelaria (Localidad 17)",
    ubicacion: "Centro Histórico de Bogotá",
    corredoresPrincipales: "Carrera Séptima, Carrera Décima, Av. Jiménez (Eje Ambiental), Calle 19",
    transmilenio: "Estaciones Museo del Oro, Las Aguas, San Victorino",
    conexionMetro: "Acceso a 5 minutos a pie desde la Estación 11 y Estación 12 de la Línea 1 del Metro.",
    hitos: ["Plaza de Bolívar", "Palacio de Nariño", "Museo del Oro", "Biblioteca Luis Ángel Arango", "Universidad de los Andes", "Universidad del Rosario", "Chorro de Quevedo"]
  },
  antonio_narino: {
    nombre: "Antonio Nariño (Localidad 15)",
    ubicacion: "Centro-Sur de Bogotá",
    corredoresPrincipales: "Av. Caracas, Av. Primero de Mayo, Autopista Sur, Calle 1 Sur, Carrera Décima",
    transmilenio: "Troncal Caracas Sur, Troncal NQS y Troncal Décima",
    conexionMetro: "Conectada mediante Estación 10 (Calle 1 Sur / Hortúa) y Estación 11 (Restrepo).",
    hitos: ["Barrio Restrepo (capital del calzado)", "Hospital San Carlos", "Centro Comercial Centro Mayor (zona limítrofe)", "Parque Ciudad Berna"]
  },
  san_cristobal: {
    nombre: "San Cristóbal (Localidad 4)",
    ubicacion: "Suroriente montañoso de Bogotá",
    corredoresPrincipales: "Carrera Décima, Av. Primero de Mayo, Calle 27 Sur, Vía a Choachí",
    transmilenio: "Portal 20 de Julio y Troncal Carrera Décima",
    conexionMetro: "Conexión en 10 min en TransMilenio o alimentador con la Estación 10 (Hortúa) y Estación 11 (Restrepo) de la Línea 1.",
    hitos: ["Iglesia del 20 de Julio", "Parque San Cristóbal", "Parque Entrenubes", "Portal 20 de Julio"]
  },
  tunjuelito: {
    nombre: "Tunjuelito (Localidad 6)",
    ubicacion: "Sur de Bogotá",
    corredoresPrincipales: "Autopista Sur, Av. Caracas Sur, Av. Boyacá, Av. Jorge Gaitán Cortés",
    transmilenio: "Troncales Caracas Sur y Autopista Sur (Portal Tunal, Venecia, General Santander)",
    conexionMetro: "Integrada a la Estación 9 (NQS / General Santander) de la Línea 1 del Metro mediante la Troncal NQS y alimentadores del Tunal.",
    hitos: ["Parque Metropolitano El Tunal", "Biblioteca Gabriel García Márquez (El Tunal)", "Centro Comercial Ciudad Tunal", "Barrio Venecia", "Isla del Sol"]
  },
  rafael_uribe: {
    nombre: "Rafael Uribe Uribe (Localidad 18)",
    ubicacion: "Suroriente de Bogotá",
    corredoresPrincipales: "Av. Caracas Sur, Carrera Décima, Av. Primero de Mayo, Calle 40 Sur",
    transmilenio: "Troncal Caracas Sur (Olaya, Quiroga, Molinos) y Décima (Country Sur)",
    conexionMetro: "Acceso inmediato por la Av. Caracas hacia las Estaciones 10 y 11 de la Línea 1.",
    hitos: ["Barrio Quiroga", "Barrio Olaya", "Parque Estadio Olaya Herrera", "Barrio San José"]
  },
  ciudad_bolivar: {
    nombre: "Ciudad Bolívar (Localidad 19)",
    ubicacion: "Sur montañoso de Bogotá",
    corredoresPrincipales: "Autopista Sur, Av. Boyacá, Av. Villavicencio, Av. Gaitán Cortés",
    transmilenio: "TransMiCable (Tunal a Mirador del Paraíso), Portal Tunal, Portal del Sur",
    conexionMetro: "Conexión integral mediante TransMiCable y rutas alimentadoras hacia el Portal del Sur y Estación 9 (General Santander / NQS) de la Línea 1.",
    hitos: ["TransMiCable", "Mirador El Paraíso", "Universidad Distrital Sede Tecnológica", "Parque Illimaní", "Potosí"]
  },
  usme: {
    nombre: "Usme (Localidad 5)",
    ubicacion: "Extremo Sur de Bogotá",
    corredoresPrincipales: "Av. Caracas Sur, Antigua Vía al Llano, Autopista al Llano",
    transmilenio: "Portal Usme y rutas alimentadoras de la cuenca sur",
    conexionMetro: "Conexión rápida por la Troncal Caracas Sur hacia la Estación 10 y 11 de la Línea 1 del Metro en menos de 20 minutos de viaje troncal.",
    hitos: ["Portal Usme", "Parque Cantarrana", "Plaza Fundacional de Usme", "Parque Entre Nubes sector Usme"]
  },
  barrios_unidos: {
    nombre: "Barrios Unidos (Localidad 12)",
    ubicacion: "Nororiente céntrico de Bogotá",
    corredoresPrincipales: "Av. Caracas, Av. NQS (Cra 30), Calle 72, Calle 80, Calle 68, Carrera 24",
    transmilenio: "Troncales Caracas, NQS y Calle 80",
    conexionMetro: "Alberga la Estación 16 (Calle 72 Norte / Terminal L1) y futura conexión de la Línea 2.",
    hitos: ["Barrio 7 de Agosto (autopartes y gastronomía)", "Metrópolis", "Plaza de los Artesanos", "Parque de los Novios (zona limítrofe)", "La Floresta (zona este)"]
  },
  sumapaz: {
    nombre: "Sumapaz (Localidad 20)",
    ubicacion: "Extremo Sur rural de Bogotá",
    corredoresPrincipales: "Carretera Usme - San Juan de Sumapaz",
    transmilenio: "Conexión intermunicipal desde Portal Usme",
    conexionMetro: "Enlace rural-urbano a través de los servicios troncales de la Caracas hacia el Metro de Bogotá.",
    hitos: ["Páramo de Sumapaz (el páramo más grande del mundo)", "Laguna de Chisacá", "San Juan de Sumapaz"]
  }
};

// 2. CENTROS COMERCIALES EMBLEMÁTICOS
export const BOGOTA_CENTROS_COMERCIALES_KB = {
  multiplaza: {
    nombre: "Centro Comercial Multiplaza La Felicidad",
    direccion: "Av. Boyacá # 13-05 (Av. Boyacá con Calle 13)",
    localidad: "Fontibón / Kennedy",
    transporteActual: "Rutas SITP zonales por la Av. Boyacá y Calle 13.",
    conexionMetro: "Estación 5 (Av. Primero de Mayo con Av. Boyacá) y Estación 6 (Av. Primero de Mayo con Cra 50 / Av. 68). Conexión en bus SITP Zonal por la Av. Boyacá norte hasta Calle 13 (1 transbordo a $0 COP).",
    consejoRuta: "Desde Estación 5 o 6, toma bus SITP Zonal hacia el norte por la Av. Boyacá hasta Calle 13."
  },
  centro_mayor: {
    nombre: "Centro Comercial Centro Mayor",
    direccion: "Calle 38A Sur # 34D-51 (Autopista Sur con Carrera 30 / NQS)",
    localidad: "Antonio Nariño / Puente Aranda / Tunjuelito",
    transporteActual: "TransMilenio Troncal NQS Sur y bus zonal Autopista Sur con pasarela peatonal techada directa.",
    conexionMetro: "Estación 8 (NQS con Calle 8 Sur) o Estación 3 (Av. Boyacá). Conexión por Troncal NQS Sur o bus zonal Autopista Sur.",
    consejoRuta: "Enlace en Estación 8 con Troncal NQS Sur hacia estación General Santander / C.C. Centro Mayor con transbordo a $0 COP."
  },
  unicentro: {
    nombre: "Centro Comercial Unicentro",
    direccion: "Avenida Carrera 15 # 124-30",
    localidad: "Usaquén",
    transporteActual: "TransMilenio estación Pepe Sierra / Calle 127 y rutas SITP por Carrera 15.",
    conexionMetro: "Estación 16 (Calle 72 con Av. Caracas). Conexión en bus Zonal/SITP por la Carrera 15 norte o Troncal Norte (1 transbordo a $0 COP).",
    consejoRuta: "Desde Estación 16 en Calle 72, toma bus Zonal por Carrera 15 norte directo hasta Unicentro."
  },
  plaza_central: {
    nombre: "Centro Comercial Plaza Central",
    direccion: "Carrera 65 # 11-50 (Calle 13 con Carrera 65 / Av. Boyacá)",
    localidad: "Puente Aranda / Fontibón",
    transporteActual: "Rutas SITP sobre la Calle 13 y Av. Boyacá.",
    conexionMetro: "Estación 5 (Av. Primero de Mayo con Av. Boyacá) y Estación 6 (Av. Primero de Mayo con Cra 50 / Av. 68). Conexión Zonal por la Boyacá norte hacia la Calle 13.",
    consejoRuta: "Toma SITP zonal por la Av. Boyacá norte hasta Calle 13 con transbordo a $0 COP."
  },
  gran_estacion: {
    nombre: "Centro Comercial Gran Estación",
    direccion: "Av. Calle 26 # 62-47 (Eje Empresarial Salitre)",
    localidad: "Teusaquillo",
    transporteActual: "TransMilenio estación Gran Estación / Salitre el Greco (Troncal Calle 26).",
    conexionMetro: "Integración directa con la Estación 12 (Calle 26 / Caracas) de la Línea 1 mediante la Troncal Calle 26.",
    consejoRuta: "Acceso directo en bus troncal de la Calle 26 que cruza hacia el centro y la Caracas."
  },
  titan_plaza: {
    nombre: "Centro Comercial Titán Plaza",
    direccion: "Av. Boyacá con Calle 80",
    localidad: "Engativá",
    transporteActual: "TransMilenio estación Boyacá o Minuto de Dios (Troncal Calle 80), rutas SITP por la Boyacá.",
    conexionMetro: "Conectará con la Línea 2 del Metro (tramo Calle 80 / Suba).",
    consejoRuta: "Corredor directo sobre la Av. Boyacá con conexión a troncal Calle 80."
  },
  santafe: {
    nombre: "Centro Comercial Santafé",
    direccion: "Calle 185 # 45-03 (Autopista Norte)",
    localidad: "Suba / Usaquén",
    transporteActual: "TransMilenio estación Calle 187 o Portal Norte.",
    conexionMetro: "Conexión troncal por la Autopista Norte hacia el intercambiador de Calle 72.",
    consejoRuta: "Tomar servicios ruta fácil o expresos de la Troncal Norte hasta la estación Calle 187."
  },
  parque_la_colina: {
    nombre: "Centro Comercial Parque La Colina",
    direccion: "Carrera 58D # 146-51 (Av. Boyacá con Cll 146)",
    localidad: "Suba",
    transporteActual: "Rutas SITP por la Av. Boyacá y Calle 152, TransMilenio estación 21 Ángeles (Troncal Suba).",
    conexionMetro: "Conexión con la Línea 2 del Metro en el tramo de Suba.",
    consejoRuta: "SITP por la Av. Boyacá hacia el norte o Calle 134/152."
  },
  andino: {
    nombre: "Centro Comercial Andino / El Retiro / Atlantis",
    direccion: "Carrera 11 # 82-71 (Zona Rosa / El Virrey)",
    localidad: "Chapinero",
    transporteActual: "TransMilenio estación Héroes o Calle 85 (Troncal AutoNorte / Caracas), rutas SITP Cra 11 y Cra 15.",
    conexionMetro: "Estación 15 (Calle 72 / Caracas) de la Línea 1 del Metro queda a 10 min a pie o 4 min en SITP hacia el norte.",
    consejoRuta: "Descender en Estación 15 o Calle 72 y caminar por la Cra 11 hacia la Zona T."
  },
  mallplaza_calima: {
    nombre: "Centro Comercial Mallplaza (antiguo Calima)",
    direccion: "Avenida Carrera 30 (NQS) con Calle 19",
    localidad: "Los Mártires",
    transporteActual: "TransMilenio estación Paloquemao (Troncal NQS) o Calle 19 (Caracas).",
    conexionMetro: "Estación 11 (Restrepo) y Estación 12 (Calle 26) de la Línea 1 del Metro.",
    consejoRuta: "Acceso directo en la NQS frente a Paloquemao."
  },
  hayuelos: {
    nombre: "Centro Comercial Hayuelos",
    direccion: "Calle 20 # 82-52 (Av. Cali con Calle 20)",
    localidad: "Fontibón",
    transporteActual: "SITP Av. Ciudad de Cali y Av. Ferrocarril, TransMilenio Portal El Dorado a 10 min.",
    conexionMetro: "Conectado vía Calle 26 a la Estación 12 de la Línea 1.",
    consejoRuta: "Tomar SITP por la Av. Cali hacia el Portal Américas o Portal El Dorado."
  }
};

// 3. PARQUES Y PUNTOS DE RECREACIÓN
export const BOGOTA_PARQUES_RECREACION_KB = {
  simon_bolivar: {
    nombre: "Parque Metropolitano Simón Bolívar",
    direccion: "Av. Calle 53 y Av. Calle 63 con Av. Esmeralda (Cra 60) y Cra 68",
    localidad: "Teusaquillo",
    transporteActual: "Rutas SITP por la Calle 53, Calle 63 y Carrera 68. TransMilenio estación Simón Bolívar (Troncal NQS) y Salitre El Greco (Troncal 26).",
    conexionMetro: "Conexión directa desde la Estación 13 (Calle 45 / UNAL) o Estación 14 (Calle 63) en SITP por la Calle 53 o Calle 63.",
    consejoRuta: "Desde cualquier estación de la Caracas o NQS, toma SITP hacia el occidente por la Cll 53 o Cll 63 para entrar al Simón Bolívar."
  },
  el_tunal: {
    nombre: "Parque Metropolitano El Tunal",
    direccion: "Calle 48B Sur con Av. Boyacá y Av. Mariscal Sucre",
    localidad: "Tunjuelito",
    transporteActual: "TransMilenio Portal Tunal (Troncal Caracas Sur) y estación Parque (Troncal NQS ramal Tunal), TransMiCable.",
    conexionMetro: "Enlace en 8 min con la Estación 9 (NQS / General Santander) de la Línea 1.",
    consejoRuta: "TransMilenio al Portal Tunal o SITP por la Av. Boyacá."
  },
  timiza: {
    nombre: "Parque Metropolitano Timiza",
    direccion: "Carrera 72N con Calle 40H Sur",
    localidad: "Kennedy",
    transporteActual: "Rutas SITP por la Av. Villavicencio y Av. Primero de Mayo.",
    conexionMetro: "Estación 5 (Timiza / Hospital de Kennedy) de la Línea 1 del Metro tiene acceso peatonal directo a escasas 3 cuadras del lago de Timiza.",
    consejoRuta: "El Metro te deja en la puerta en la Estación 5 Timiza."
  },
  parque_nacional: {
    nombre: "Parque Nacional Enrique Olaya Herrera",
    direccion: "Carrera Séptima con Calle 36 a 39",
    localidad: "Santa Fe / Teusaquillo",
    transporteActual: "TransMilenio estación Calle 39 o Calle 34 (Troncal Caracas), rutas Cra 7ma.",
    conexionMetro: "Estación 12 (Calle 26) y Estación 13 (Calle 45) de la Línea 1.",
    consejoRuta: "Caminar desde la estación de la Caracas hacia los cerros por la Calle 36 o 39."
  },
  monserrate: {
    nombre: "Cerro de Monserrate (Santuario del Señor Caído)",
    direccion: "Cerros Orientales, acceso por Paseo de Bolívar / Carrera 2 Este",
    localidad: "Santa Fe",
    transporteActual: "Teleférico, Funicular y sendero peatonal. TransMilenio estación Las Aguas o Universidades.",
    conexionMetro: "Estación 12 (Calle 26 / Centro Internacional) de la Línea 1 a 10 min en transporte ligero o caminata turística.",
    consejoRuta: "Llegar en Metro a Calle 26 o Centro Internacional y subir por el Eje Ambiental / Av. Jiménez hacia la estación del Funicular."
  },
  jardin_botanico: {
    nombre: "Jardín Botánico José Celestino Mutis",
    direccion: "Av. Calle 63 # 68-95",
    localidad: "Engativá",
    transporteActual: "Rutas SITP por la Calle 63 y Carrera 68.",
    conexionMetro: "Conexión directa por la Calle 63 desde la Estación 14 (Calle 63 / Chapinero) de la Línea 1.",
    consejoRuta: "Toma cualquier SITP por la Calle 63 hacia el occidente desde Chapinero."
  },
  parque_de_los_novios: {
    nombre: "Parque de los Novios (Parque El Lago)",
    direccion: "Calle 63 # 45-10",
    localidad: "Barrios Unidos",
    transporteActual: "TransMilenio estación Movistar Arena (NQS) a 5 min a pie, SITP Cll 63.",
    conexionMetro: "Estación 14 (Calle 63 / Chapinero) de la Línea 1.",
    consejoRuta: "Descender en Estación 14 de la Caracas y tomar SITP o caminar hacia el occidente por la Calle 63."
  },
  guadalupe: {
    nombre: "Cerro de Guadalupe (Santuario de Nuestra Señora de Guadalupe)",
    direccion: "Cerros Orientales de Bogotá (3.310 msnm, km 6.7 vía Bogotá - Choachí)",
    localidad: "Santa Fe",
    transporteActual: "Transporte público intermunicipal desde la Calle 6 / Carrera 10 hacia Choachí, o servicios de fin de semana.",
    conexionMetro: "Accesible desde la Estación 10 (Hortúa) o Estación 11 (Restrepo) y conexión por el eje de la Av. Comuneros / Vía Choachí.",
    consejoRuta: "Desde el centro o la Estación 12 de la Calle 26, conectar hacia el oriente subiendo por los Cerros Orientales con vista panorámica de toda la ciudad."
  }
};

// 4. ENTIDADES, EMPRESAS Y UNIVERSIDADES
export const BOGOTA_UNIVERSIDADES_EMPRESAS_KB = {
  corferias: {
    nombre: "Centro Internacional de Negocios y Exposiciones Corferias",
    direccion: "Carrera 37 # 24-67",
    localidad: "Teusaquillo",
    transporteActual: "TransMilenio estación Corferias (Troncal Américas / Calle 26 Recinto Ferial), SITP Av. Esperanza.",
    conexionMetro: "Estación 12 (Calle 26 / Centro Internacional) y Estación 9 (NQS) de la Línea 1.",
    consejoRuta: "TransMilenio estación Corferias en la Troncal Américas o SITP por la Av. Esperanza."
  },
  movistar_arena_campin: {
    nombre: "Movistar Arena & Estadio El Campín",
    direccion: "Carrera 30 (Av. NQS) con Calle 57",
    localidad: "Teusaquillo",
    transporteActual: "TransMilenio estaciones Movistar Arena y Campín - UAN (Troncal NQS).",
    conexionMetro: "Estación 13 (Calle 45 / UNAL) y Estación 14 (Calle 63) de la Línea 1 a 10 min en SITP o caminata.",
    consejoRuta: "Metro L1 hasta Estación 13 o 14 y conectar hacia la NQS por la Calle 53 o 63."
  },
  universidad_nacional: {
    nombre: "Universidad Nacional de Colombia (Sede Bogotá / Ciudad Universitaria)",
    direccion: "Carrera 30 # 45-03 (Calle 26 a Calle 45 entre Cra 30 y Cra 45)",
    localidad: "Teusaquillo",
    transporteActual: "TransMilenio estación Universidad Nacional (Troncal NQS) y Ciudad Universitaria (Troncal 26).",
    conexionMetro: "Estación 14 (Calle 45 / Universidad Nacional) de la Línea 1 del Metro con acceso directo por el andén oriental y pasarela peatonal.",
    consejoRuta: "El Metro L1 tiene su propia Estación 14 sobre la Caracas con Calle 45 para conectar directo a la UNAL."
  },
  javeriana: {
    nombre: "Pontificia Universidad Javeriana",
    direccion: "Carrera 7 # 40-62",
    localidad: "Chapinero",
    transporteActual: "TransMilenio estación Calle 45 (Caracas) a 4 cuadras, buses duales y SITP Cra 7ma.",
    conexionMetro: "Estación 14 (Calle 45) de la Línea 1 a solo 400 metros caminando hacia los Cerros.",
    consejoRuta: "Bájate en la Estación 14 del Metro (Calle 45) y camina 4 minutos hacia los cerros por la Calle 40 o 45."
  },
  los_andes: {
    nombre: "Universidad de los Andes",
    direccion: "Carrera 1 # 18A-12 (Eje Ambiental / Cerros Orientales)",
    localidad: "La Candelaria / Santa Fe",
    transporteActual: "TransMilenio estaciones Las Aguas y Universidades a 2 cuadras.",
    conexionMetro: "Estación 12 (Calle 19) y Estación 13 (Calle 26) de la Línea 1.",
    consejoRuta: "Desde Estación 12 o 13, camina por el Eje Ambiental hacia el oriente o toma TransMilenio."
  },
  rosario: {
    nombre: "Universidad del Rosario (Claustro Histórico y Sedes)",
    direccion: "Calle 12C # 6-25 (Sede Claustro, La Candelaria)",
    localidad: "La Candelaria / Santa Fe",
    transporteActual: "TransMilenio estaciones Museo del Oro, San Victorino y Aguas.",
    conexionMetro: "Estación 11 (Calle 11 / Hospital) y Estación 12 (Calle 19) de la Línea 1 del Metro a 6 min a pie.",
    consejoRuta: "Bájate en la Estación 12 (Calle 19) o Estación 11 y camina hacia el centro histórico por la Carrera Séptima o Calle 12."
  },
  distrital: {
    nombre: "Universidad Distrital Francisco José de Caldas",
    direccion: "Sede Macarena (Cra 3 # 26A-40), Sede Central / Calle 40 (Cra 7 # 40B-53), Sede Bosa Porvenir",
    localidad: "Santa Fe / Chapinero / Bosa",
    transporteActual: "SITP Cra 7ma y Cra 5ta para La Macarena; Troncal Caracas (estación Calle 39 / 45); alimentadores Bosa.",
    conexionMetro: "Sede Bosa: Estación 1 (Patio Taller). Sedes Centro/Chapinero: Estación 13 (Calle 26) y Estación 14 (Calle 45).",
    consejoRuta: "Excelente cobertura del Metro: conecta directamente tanto la sede Bosa Porvenir como las sedes de la Caracas."
  },
  centro_internacional: {
    nombre: "Centro Internacional de Bogotá (Distrito Financiero y Hotelero)",
    direccion: "Carrera 7ma / Carrera 10ma con Calle 26 a 32",
    localidad: "Santa Fe / Teusaquillo / Los Mártires",
    transporteActual: "TransMilenio estación Museo Nacional, San Diego y Calle 26.",
    conexionMetro: "Estación 13 (Av. Caracas con Calle 26) de la Línea 1, con acceso subterráneo intermodal directo.",
    consejoRuta: "La Estación 13 de la Línea 1 te dejará en el centro neurálgico del Centro Internacional."
  },
  zona_franca: {
    nombre: "Zona Franca de Bogotá",
    direccion: "Carrera 106 # 15A-25",
    localidad: "Fontibón",
    transporteActual: "Rutas SITP zonales y alimentadoras desde Portal El Dorado y Portal Américas.",
    conexionMetro: "Conectada con la Estación 13 por la Troncal 26 y Estación 7 por la Av. Boyacá.",
    consejoRuta: "SITP por la Calle 13 hacia el occidente pasando la Av. Ciudad de Cali."
  },
  connecta: {
    nombre: "Complejo Empresarial Connecta 26",
    direccion: "Av. Calle 26 # 92-32",
    localidad: "Fontibón / Engativá",
    transporteActual: "TransMilenio estación Portal El Dorado y Modelia.",
    conexionMetro: "Conexión expresa por la Troncal 26 hacia la Estación 13 del Metro de Bogotá.",
    consejoRuta: "TransMilenio directo en la Troncal Calle 26."
  }
};

/**
 * Diccionario de conocimiento local unificado de UrbanGo & Metro de Bogotá.
 * Se inyecta como contexto persistente en llamadas a la IA y MetroBot.
 */
export const KNOWLEDGE_BASE = {
  proyecto: METRO_SYSTEM_KNOWLEDGE.proyecto,
  aforoYCapacidad: METRO_SYSTEM_KNOWLEDGE.aforoYCapacidad,
  linea2: METRO_SYSTEM_KNOWLEDGE.linea2,
  financiacion: METRO_SYSTEM_KNOWLEDGE.financiacion,
  concesionarioYFabricante: METRO_SYSTEM_KNOWLEDGE.concesionarioYFabricante,
  metro: METRO_SYSTEM_KNOWLEDGE,
  noticias: NOTICIAS_KB,
  empleos: EMPLEOS_KB,
  localidades: BOGOTA_LOCALIDADES_KB,
  centrosComerciales: BOGOTA_CENTROS_COMERCIALES_KB,
  parquesRecreacion: BOGOTA_PARQUES_RECREACION_KB,
  universidadesEmpresas: BOGOTA_UNIVERSIDADES_EMPRESAS_KB
};

export default KNOWLEDGE_BASE;


